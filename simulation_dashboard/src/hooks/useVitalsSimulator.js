/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function rand(a, b) {
  return a + Math.random() * (b - a);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario generators
// ─────────────────────────────────────────────────────────────────────────────
const generators = {
  stable: (step) => ({
    heart_rate: Math.round(74 + rand(-3, 3)),
    spo2: Math.round(98 + rand(-1, 1)),
    temperature: +(36.8 + rand(-0.2, 0.2)).toFixed(1),
    respiratory_rate: Math.round(15 + rand(-1, 1)),
    systolic_bp: Math.round(126 + rand(-4, 4)),
    mean_arterial_pressure: Math.round(88 + rand(-3, 3)),
  }),

  moderate: (step) => ({
    heart_rate: Math.round(90 + step * 1.5 + rand(-3, 3)),
    spo2: Math.max(88, Math.round(95 - step * 0.5 + rand(-1, 1))),
    temperature: +(37.5 + step * 0.08 + rand(-0.1, 0.1)).toFixed(1),
    respiratory_rate: Math.round(20 + step * 0.6 + rand(-1, 1)),
    systolic_bp: Math.max(95, Math.round(120 - step * 1.5 + rand(-3, 3))),
    mean_arterial_pressure: Math.max(
      65,
      Math.round(82 - step * 1.2 + rand(-2, 2)),
    ),
  }),

  septic: (step) => ({
    heart_rate: Math.min(180, Math.round(115 + step * 3 + rand(-3, 3))),
    spo2: Math.max(70, Math.round(90 - step * 1.4 + rand(-1, 1))),
    temperature: +Math.min(41.5, 38.5 + step * 0.2 + rand(-0.1, 0.1)).toFixed(
      1,
    ),
    respiratory_rate: Math.min(50, Math.round(28 + step * 1.5 + rand(-2, 2))),
    systolic_bp: Math.max(60, Math.round(112 - step * 4 + rand(-4, 4))),
    mean_arterial_pressure: Math.max(
      45,
      Math.round(75 - step * 2.5 + rand(-2, 2)),
    ),
  }),
};

export function useVitalsSimulator() {
  // ───────────────────────────────────────────────────────────────────────────
  // State
  // ───────────────────────────────────────────────────────────────────────────
  const [backendPatients, setBackendPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [currentVitals, setCurrentVitals] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);

  const [historicalVitals, setHistoricalVitals] = useState([]);
  const [historicalPredictions, setHistoricalPredictions] = useState([]);

  const [alerts, setAlerts] = useState([]);

  const [vitalsSentCount, setVitalsSentCount] = useState(0);
  const [lastSentMs, setLastSentMs] = useState(null);

  const [backendStatus, setBackendStatus] = useState("connecting");

  const [scenarioQueue, setScenarioQueue] = useState([]);

  // current displayed scenario
  const [scenario, setScenario] = useState("stable");

  // ───────────────────────────────────────────────────────────────────────────
  // Refs
  // ───────────────────────────────────────────────────────────────────────────
  const patientRef = useRef(selectedPatient);
  const countRef = useRef(0);
  const hourRef = useRef(0);
  const sendingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    patientRef.current = selectedPatient;
  }, [selectedPatient]);

  // ───────────────────────────────────────────────────────────────────────────
  // Queue scenario transitions
  // ───────────────────────────────────────────────────────────────────────────
  const queueScenario = useCallback((scenarioType) => {
    setScenarioQueue((prev) => [
      ...prev,
      {
        type: scenarioType,
        stepsRemaining: 6,
      },
    ]);

    setScenario(scenarioType);
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Backend health
  // ───────────────────────────────────────────────────────────────────────────
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

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch patients
  // ───────────────────────────────────────────────────────────────────────────
  const fetchPatients = useCallback(async () => {
    try {
      const res = await getPatients();

      const patients = Array.isArray(res) ? res : (res?.patients ?? []);

      setBackendPatients(patients);

      setSelectedPatient((prev) => {
        if (prev) return prev;

        return patients.length ? patients[0].patient_id : null;
      });
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  }, []);

  useEffect(() => {
    fetchPatients();

    const interval = setInterval(fetchPatients, 5000);

    return () => clearInterval(interval);
  }, [fetchPatients]);

  // ───────────────────────────────────────────────────────────────────────────
  // Load historical data
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPatient) return;

    countRef.current = 0;
    hourRef.current = 0;

    setVitalsSentCount(0);

    setLatestPrediction(null);

    setAlerts([]);

    setCurrentVitals(null);

    setHistoricalVitals([]);

    setHistoricalPredictions([]);

    setScenarioQueue([]);

    Promise.all([
      getVitals(selectedPatient, 50),
      getPredictions(selectedPatient, 50),
      getAlerts(selectedPatient),
    ])
      .then(([vitalsRes, predictionsRes, alertsRes]) => {
        const vitals = Array.isArray(vitalsRes)
          ? vitalsRes
          : (vitalsRes?.vitals ?? []);

        const predictions = Array.isArray(predictionsRes)
          ? predictionsRes
          : (predictionsRes?.predictions ?? []);

        const alertList = Array.isArray(alertsRes)
          ? alertsRes
          : (alertsRes?.alerts ?? []);

        if (vitals.length) {
          const sorted = [...vitals].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          );

          setHistoricalVitals(sorted);

          setCurrentVitals(sorted[sorted.length - 1]);

          setVitalsSentCount(sorted.length);

          countRef.current = sorted.length;
        }

        if (predictions.length) {
          const sorted = [...predictions].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
          );

          setHistoricalPredictions(sorted);

          setLatestPrediction(sorted[sorted.length - 1]);
        }

        if (alertList.length) {
          setAlerts(alertList.filter((a) => !a.acknowledged));
        }
      })
      .catch(() => {});
  }, [selectedPatient]);

  // ───────────────────────────────────────────────────────────────────────────
  // Send vitals
  // ───────────────────────────────────────────────────────────────────────────
  const sendVitals = useCallback(async () => {
    const pid = patientRef.current;

    if (!pid || sendingRef.current) return;

    sendingRef.current = true;

    try {
      let activeScenario = scenarioQueue[0];

      if (!activeScenario) {
        activeScenario = {
          type: "stable",
          stepsRemaining: 999,
        };
      }

      const gen = generators[activeScenario.type] || generators.stable;

      const vitals = gen(hourRef.current);

      hourRef.current++;

      setCurrentVitals({
        ...vitals,
        patient_id: pid,
        hour: hourRef.current,
      });

      setLastSentMs(Date.now());

      const res = await submitVitals(pid, vitals);

      countRef.current++;

      setVitalsSentCount(countRef.current);

      setBackendStatus("ok");

      setHistoricalVitals((prev) => [
        ...prev,
        {
          ...vitals,
          patient_id: pid,
          timestamp: new Date().toISOString(),
        },
      ]);

      // reduce queue
      setScenarioQueue((prev) => {
        if (!prev.length) return prev;

        const updated = [...prev];

        updated[0] = {
          ...updated[0],
          stepsRemaining: updated[0].stepsRemaining - 1,
        };

        if (updated[0].stepsRemaining <= 0) {
          updated.shift();
        }

        return updated;
      });

      if (res.prediction) {
        setLatestPrediction(res.prediction);

        setHistoricalPredictions((prev) => [...prev, res.prediction]);

        setTimeout(() => {
          getAlerts(pid)
            .then((list) => {
              const alertList = Array.isArray(list)
                ? list
                : (list?.alerts ?? []);

              setAlerts(alertList.filter((a) => !a.acknowledged));
            })
            .catch(() => {});
        }, 1200);
      }
    } catch {
      setBackendStatus("offline");
    } finally {
      sendingRef.current = false;
    }
  }, [scenarioQueue]);

  // ───────────────────────────────────────────────────────────────────────────
  // Auto send interval
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPatient) return;

    sendVitals();

    timerRef.current = setInterval(sendVitals, INTERVAL_MS);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [selectedPatient, sendVitals]);

  // ───────────────────────────────────────────────────────────────────────────
  // Alerts
  // ───────────────────────────────────────────────────────────────────────────
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

    scenarioQueue,
    queueScenario,
  };
}
