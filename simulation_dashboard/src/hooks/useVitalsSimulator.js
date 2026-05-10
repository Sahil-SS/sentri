"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getPatients,
  getVitals,
  getPredictions,
  getAlerts,
  submitVitals,
  acknowledgeAlert as apiAcknowledgeAlert,
} from "@/lib/api";

const INTERVAL_MS = 10_000;



// ── Scenario generators (produce new vitals each tick) ───────────────────────
function rand(a, b) {
  return a + Math.random() * (b - a);
}

const generators = {
  septic: (hour) => ({
    heart_rate: Math.min(180, Math.round(110 + hour * 3.5 + rand(-3, 3))),
    spo2: Math.max(70, Math.round(90 - hour * 1.2 + rand(-1, 1))),
    temperature: +Math.min(41.5, 38.4 + hour * 0.18 + rand(-0.1, 0.1)).toFixed(1),
    respiratory_rate: Math.min(55, Math.round(27 + hour * 1.5 + rand(-2, 2))),
    systolic_bp: Math.max(55, Math.round(118 - hour * 4 + rand(-4, 4))),
    mean_arterial_pressure: Math.max(40, Math.round(77 - hour * 2.5 + rand(-2, 2))),
  }),
  moderate: (hour) => ({
    heart_rate: Math.round(88 + hour * 1.8 + rand(-3, 3)),
    spo2: Math.max(86, Math.round(95 - hour * 0.5 + rand(-1, 1))),
    temperature: +(37.4 + hour * 0.1 + rand(-0.1, 0.1)).toFixed(1),
    respiratory_rate: Math.round(19 + hour * 0.8 + rand(-1, 1)),
    systolic_bp: Math.max(90, Math.round(126 - hour * 2 + rand(-3, 3))),
    mean_arterial_pressure: Math.max(65, Math.round(86 - hour * 1.2 + rand(-2, 2))),
  }),
  stable: (_hour) => ({
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

  // ── Live state ────────────────────────────────────────────────────────────
  const [currentVitals, setCurrentVitals] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [historicalVitals, setHistoricalVitals] = useState([]);
  const [historicalPredictions, setHistoricalPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [vitalsSentCount, setVitalsSentCount] = useState(0);
  const [lastSentMs, setLastSentMs] = useState(null);
  const [backendStatus, setBackendStatus] = useState("connecting");
  const [scenario, setScenario] = useState("septic");

  // ── Stable refs ───────────────────────────────────────────────────────────
  const patientRef  = useRef(selectedPatient);
  const scenarioRef = useRef(scenario);
  const countRef    = useRef(0);
  const hourRef     = useRef(0);
  const sendingRef  = useRef(false);
  const timerRef    = useRef(null);

  useEffect(() => { patientRef.current  = selectedPatient; }, [selectedPatient]);
  useEffect(() => { scenarioRef.current = scenario;        }, [scenario]);

  // ── Backend health check ──────────────────────────────────────────────────
  const checkBackend = useCallback(async () => {
    try {
      await getPatients();
      setBackendStatus("ok");
    } catch {
      setBackendStatus("offline");
    }
  }, []);

  useEffect(() => {
    checkBackend();
    const t = setInterval(checkBackend, 15_000);
    return () => clearInterval(t);
  }, [checkBackend]);

  // ── Load patient list from MongoDB ────────────────────────────────────────
const fetchPatients = useCallback(async () => {
  try {
    const res = await getPatients();

    const patients =
      Array.isArray(res)
        ? res
        : (res?.patients ?? []);

    setBackendPatients(patients);

    // only set default patient initially
    setSelectedPatient((prev) => {
      if (prev) return prev;

      return patients.length
        ? patients[0].patient_id
        : null;
    });

  } catch (err) {
    console.error("Failed to fetch patients:", err);
  }
}, []);
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchPatients();

  // auto refresh patient dropdown
  const interval = setInterval(fetchPatients, 5000);

  return () => clearInterval(interval);
}, [fetchPatients]);

  // ── Load historical data when patient changes ─────────────────────────────
  useEffect(() => {
    if (!selectedPatient) return;

    // Reset counters and state
    countRef.current = 0;
    hourRef.current  = 0;
    setVitalsSentCount(0);
    setLatestPrediction(null);
    setAlerts([]);
    setCurrentVitals(null);
    setHistoricalVitals([]);
    setHistoricalPredictions([]);

    Promise.all([
      getVitals(selectedPatient, 50),
      getPredictions(selectedPatient, 50),
      getAlerts(selectedPatient),
    ])
      .then(([vitalsRes, predictionsRes, alertsRes]) => {

  const vitals =
    Array.isArray(vitalsRes)
      ? vitalsRes
      : (vitalsRes?.vitals ?? []);

  const predictions =
    Array.isArray(predictionsRes)
      ? predictionsRes
      : (predictionsRes?.predictions ?? []);

  const alertList =
    Array.isArray(alertsRes)
      ? alertsRes
      : (alertsRes?.alerts ?? []);
        if (Array.isArray(vitals) && vitals.length) {
          const sorted = [...vitals].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          setHistoricalVitals(sorted);
          setCurrentVitals(sorted[sorted.length - 1]);
          setVitalsSentCount(sorted.length);
          countRef.current = sorted.length;
        }
        if (Array.isArray(predictions) && predictions.length) {
          const sorted = [...predictions].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          setHistoricalPredictions(sorted);
          setLatestPrediction(sorted[sorted.length - 1]);
        }
        if (Array.isArray(alertList)) {
          setAlerts(alertList.filter((a) => !a.acknowledged));
        }
      })
      .catch(() => {});
  }, [selectedPatient]);

  // ── Send one vitals tick ──────────────────────────────────────────────────
  const sendVitals = useCallback(async () => {
    const pid = patientRef.current;
    if (!pid || sendingRef.current) return;
    sendingRef.current = true;

    try {
      const gen    = generators[scenarioRef.current] || generators.stable;
      const vitals = gen(hourRef.current);
      hourRef.current++;

      setCurrentVitals({ ...vitals, patient_id: pid, hour: hourRef.current });
      setLastSentMs(Date.now());

      // submitVitals(patientId, vitals) → { vital, prediction, alert }
      const res = await submitVitals(pid, vitals);
      countRef.current++;
      setVitalsSentCount(countRef.current);
      setBackendStatus("ok");

      setHistoricalVitals((prev) => [
        ...prev,
        { ...vitals, patient_id: pid, timestamp: new Date().toISOString() },
      ]);

      if (res.prediction) {
        setLatestPrediction(res.prediction);
        setHistoricalPredictions((prev) => [...prev, res.prediction]);

        setTimeout(() => {
          getAlerts(pid)
            .then((list) => {
              if (Array.isArray(list))
                setAlerts(list.filter((a) => !a.acknowledged));
            })
            .catch(() => {});
        }, 1200);
      }
    } catch {
      setBackendStatus("offline");
    } finally {
      sendingRef.current = false;
    }
  }, []);

  // ── Auto-send interval ────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPatient) return;
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
      await apiAcknowledgeAlert(alertId);
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch {}
  }, []);

  return {
    backendPatients,
    selectedPatient,
    setSelectedPatient,
    currentVitals,
    historicalVitals,
    vitalsSentCount,
    lastSentMs,
    latestPrediction,
    historicalPredictions,
    alerts,
    acknowledgeAlert,
    backendStatus,
    scenario,
    setScenario,
  };
}