/* eslint-disable react-hooks/set-state-in-effect */
/**
 * hooks/usePatientData.js
 *
 * Polls the Node backend (MongoDB) for a patient's live data every N seconds.
 *
 * Usage:
 *   const { dashboard, loading, error, refresh } = usePatientData(patientId);
 *
 * Returns:
 *   dashboard: {
 *     patient,
 *     latestVitals,
 *     latestPrediction,
 *     activeAlerts,
 *     historicalVitals,
 *     historicalPredictions
 *   }
 */
 
"use client";
 
import { useEffect, useRef, useState, useCallback } from "react";
import { pollPatientData } from "../lib/api";
 
const DEFAULT_INTERVAL_MS = 5000; // poll every 5 seconds
 
/**
 * @param {string|null} patientId
 * @param {number}      intervalMs  polling interval in milliseconds
 */
export function usePatientData(patientId, intervalMs = DEFAULT_INTERVAL_MS) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const timerRef                  = useRef(null);
 
  const fetch = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await pollPatientData(patientId);
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);
 
  // Initial fetch + start polling
  useEffect(() => {
    if (!patientId) {
      setDashboard(null);
      return;
    }
 
    fetch(); // immediate first load
 
    timerRef.current = setInterval(fetch, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [patientId, intervalMs, fetch]);
 
  return { dashboard, loading, error, refresh: fetch };
}
 
// ─── convenience destructurers ────────────────────────────────────────────────
 
/** Pull just the latest vitals from the dashboard snapshot. */
export function useLatestVitals(patientId) {
  const { dashboard, loading, error } = usePatientData(patientId);
  return {
    vitals: dashboard?.latestVitals ?? null,
    loading,
    error,
  };
}
 
/** Pull just the latest prediction. */
export function useLatestPrediction(patientId) {
  const { dashboard, loading, error } = usePatientData(patientId);
  return {
    prediction: dashboard?.latestPrediction ?? null,
    loading,
    error,
  };
}
 
/** Pull only active alerts. */
export function useActiveAlerts(patientId) {
  const { dashboard, loading, error } = usePatientData(patientId);
  return {
    alerts: dashboard?.activeAlerts ?? [],
    loading,
    error,
  };
}
 