"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { loadDataset, rowToVitals } from "@/lib/dataLoader";

const INTERVAL_MS = 10_000; // 10 seconds per spec

// ── Scenario fallback generators (used when CSV row is unavailable) ──────────
function rand(a, b) {
  return a + Math.random() * (b - a);
}

const generators = {
  septic: (hour) => ({
    heart_rate: Math.min(180, Math.round(110 + hour * 3.5 + rand(-3, 3))),
    spo2: Math.max(70, Math.round(90 - hour * 1.2 + rand(-1, 1))),
    temperature: +Math.min(41.5, 38.4 + hour * 0.18 + rand(-0.1, 0.1)).toFixed(
      1,
    ),
    respiratory_rate: Math.min(55, Math.round(27 + hour * 1.5 + rand(-2, 2))),
    systolic_bp: Math.max(55, Math.round(118 - hour * 4 + rand(-4, 4))),
    mean_arterial_pressure: Math.max(
      40,
      Math.round(77 - hour * 2.5 + rand(-2, 2)),
    ),
  }),
  moderate: (hour) => ({
    heart_rate: Math.round(88 + hour * 1.8 + rand(-3, 3)),
    spo2: Math.max(86, Math.round(95 - hour * 0.5 + rand(-1, 1))),
    temperature: +(37.4 + hour * 0.1 + rand(-0.1, 0.1)).toFixed(1),
    respiratory_rate: Math.round(19 + hour * 0.8 + rand(-1, 1)),
    systolic_bp: Math.max(90, Math.round(126 - hour * 2 + rand(-3, 3))),
    mean_arterial_pressure: Math.max(
      65,
      Math.round(86 - hour * 1.2 + rand(-2, 2)),
    ),
  }),
  stable: (hour) => ({
    heart_rate: Math.round(80 + rand(-4, 4)),
    spo2: Math.round(98 + rand(-1, 1)),
    temperature: +(36.8 + rand(-0.2, 0.2)).toFixed(1),
    respiratory_rate: Math.round(16 + rand(-1, 1)),
    systolic_bp: Math.round(125 + rand(-5, 5)),
    mean_arterial_pressure: Math.round(88 + rand(-3, 3)),
  }),
};

export function useVitalsSimulator() {
  // ── Patients ──────────────────────────────────────────────────────────────
  const [backendPatients, setBackendPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ── Simulation state ──────────────────────────────────────────────────────
  const [currentVitals, setCurrentVitals] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [vitalsSentCount, setVitalsSentCount] = useState(0);
  const [rowCursor, setRowCursor] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [lastSentMs, setLastSentMs] = useState(null);
  const [backendStatus, setBackendStatus] = useState("connecting"); // 'ok' | 'offline' | 'connecting'
  const [scenario, setScenario] = useState("septic");

  // ── Stable refs (avoid stale closures in interval) ───────────────────────
  const patientRef = useRef(selectedPatient);
  const scenarioRef = useRef(scenario);
  const countRef = useRef(0);
  const hourRef = useRef(0);
  const datasetRef = useRef(null); // { rows, byPatient }
  const cursorRef = useRef(0);
  const sendingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    patientRef.current = selectedPatient;
  }, [selectedPatient]);
  useEffect(() => {
    scenarioRef.current = scenario;
  }, [scenario]);

  // ── Load dataset once ─────────────────────────────────────────────────────
  useEffect(() => {
    loadDataset()
      .then((ds) => {
        datasetRef.current = ds;
        setTotalRows(ds.rows.length);
      })
      .catch(() => {
        // CSV unavailable — fallback to generators only
        datasetRef.current = { rows: [], byPatient: new Map() };
      });
  }, []);

  // ── Backend health check ──────────────────────────────────────────────────
  const checkBackend = useCallback(async () => {
    const ok = await api.ping();
    setBackendStatus(ok ? "ok" : "offline");
    return ok;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkBackend();
    const t = setInterval(checkBackend, 15_000);
    return () => clearInterval(t);
  }, [checkBackend]);

  // ── Load patients from backend ────────────────────────────────────────────
  useEffect(() => {
    api
      .getPatients()
      .then((res) => {
        if (res.success && res.patients.length) {
          setBackendPatients(res.patients);
          setSelectedPatient(res.patients[0].patient_id);
        }
      })
      .catch(() => {});
  }, []);

  // ── Reset when patient changes ────────────────────────────────────────────
  useEffect(() => {
    countRef.current = 0;
    hourRef.current = 0;
    cursorRef.current = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVitalsSentCount(0);
    setLatestPrediction(null);
    setAlerts([]);
    setCurrentVitals(null);
    setRowCursor(0);
  }, [selectedPatient]);

  // ── Core send function ────────────────────────────────────────────────────
  const sendVitals = useCallback(async () => {
    const pid = patientRef.current;
    if (!pid || sendingRef.current) return;
    sendingRef.current = true;

    try {
      // Build vitals: prefer CSV row, fallback to scenario generator
      let base;
      const ds = datasetRef.current;
      if (ds && ds.rows.length > 0) {
        // Try patient-specific rows first, then global rows
        const patRows = ds.byPatient.get(pid) || ds.rows;
        const idx = cursorRef.current % patRows.length;
        base = rowToVitals(patRows[idx], pid);
        cursorRef.current++;
        setRowCursor(cursorRef.current);
      } else {
        const gen = generators[scenarioRef.current] || generators.stable;
        base = { patient_id: pid, ...gen(hourRef.current) };
      }

      hourRef.current++;

      setCurrentVitals({ ...base, hour: hourRef.current });
      setLastSentMs(Date.now());

      const res = await api.sendVitals(base);
      countRef.current++;
      setVitalsSentCount(countRef.current);
      setBackendStatus("ok");

      if (res.prediction) {
        setLatestPrediction(res.prediction);
        // Fetch updated alerts ~1.2s after prediction arrives
        setTimeout(() => {
          api
            .getAlerts(pid)
            .then(
              (r) =>
                r.success && setAlerts(r.alerts.filter((a) => !a.acknowledged)),
            )
            .catch(() => {});
        }, 1200);
      }
    } catch {
      setBackendStatus("offline");
    } finally {
      sendingRef.current = false;
    }
  }, []);

  // ── Auto-send interval (10 s, starts when patient selected) ──────────────
  useEffect(() => {
    if (!selectedPatient) return;

    // Fire immediately on patient select, then every 10 s
    sendVitals();
    timerRef.current = setInterval(sendVitals, INTERVAL_MS);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [selectedPatient, sendVitals]);

  // ── Acknowledge alert ─────────────────────────────────────────────────────
  const acknowledgeAlert = useCallback(async (alertId) => {
    try {
      await api.acknowledgeAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch {}
  }, []);

  return {
    // patient
    backendPatients,
    selectedPatient,
    setSelectedPatient,
    // vitals
    currentVitals,
    vitalsSentCount,
    lastSentMs,
    rowCursor,
    totalRows,
    // AI
    latestPrediction,
    alerts,
    acknowledgeAlert,
    // status
    backendStatus,
    // scenario
    scenario,
    setScenario,
  };
}
