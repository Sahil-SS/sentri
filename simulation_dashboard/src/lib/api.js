/**
 * api.js  —  Sentri Simulation Dashboard API client
 *
 * Single source-of-truth for every backend call.
 * Reads the base URL from:
 *   NEXT_PUBLIC_API_URL  (set in .env.local)
 *
 * Example .env.local:
 *   NEXT_PUBLIC_API_URL=https://your-node-backend.railway.app
 */

const BASE = "https://loyal-magic-production-0fce.up.railway.app/";

// ─── helpers ──────────────────────────────────────────────────────────────────

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GET ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

async function post(path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`POST ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

async function patch(path, data = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PATCH ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

// ─── patients ─────────────────────────────────────────────────────────────────

/** List all registered patients. */
export const getPatients = () => get("/api/patients");

/** Get a single patient by ID. */
export const getPatient = (patientId) => get(`/api/patients/${patientId}`);

// ─── dashboard ────────────────────────────────────────────────────────────────

/**
 * Full dashboard snapshot:
 *   { patient, latestVitals, latestPrediction,
 *     activeAlerts, historicalVitals, historicalPredictions }
 */
export const getDashboard = (patientId) => get(`/api/dashboard/${patientId}`);

// ─── vitals ───────────────────────────────────────────────────────────────────

/** Fetch recent vitals (default last 20). */
export const getVitals = (patientId, limit = 20) =>
  get(`/api/vitals/${patientId}?limit=${limit}`);

/**
 * Submit a vitals reading.
 * Triggers rolling-window prediction on the backend.
 *
 * @param {string} patientId
 * @param {{ heart_rate, spo2, temperature, respiratory_rate,
 *            systolic_bp, mean_arterial_pressure }} vitals
 * @returns {{ vital, prediction, alert }}
 */
export const submitVitals = (patientId, vitals) =>
  post("/api/vitals", { patient_id: patientId, ...vitals });

// ─── predictions ─────────────────────────────────────────────────────────────

/** Fetch recent predictions (default last 20). */
export const getPredictions = (patientId, limit = 20) =>
  get(`/api/predictions/${patientId}?limit=${limit}`);

// ─── alerts ──────────────────────────────────────────────────────────────────

/** All alerts for a patient (active + recent). */
export const getAlerts = (patientId) => get(`/api/alerts/${patientId}`);

/** Acknowledge a single alert. */
export const acknowledgeAlert = (alertId) =>
  patch(`/api/alerts/${alertId}/acknowledge`);

// ─── convenience bundle ───────────────────────────────────────────────────────

/**
 * Poll everything needed for the live monitor in one round-trip.
 * Falls back to individual calls if /api/dashboard is unavailable.
 */
export async function pollPatientData(patientId) {
  try {
    return await getDashboard(patientId);
  } catch {
    const [vitals, predictions, alerts] = await Promise.all([
      getVitals(patientId),
      getPredictions(patientId),
      getAlerts(patientId),
    ]);
    return {
      latestVitals: vitals[0] ?? null,
      latestPrediction: predictions[0] ?? null,
      activeAlerts: alerts,
      historicalVitals: vitals,
      historicalPredictions: predictions,
    };
  }
}
