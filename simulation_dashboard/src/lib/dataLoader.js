/**
 * dataLoader.js
 *
 * Replaces the old CSV-based loader.
 * All data now comes from the deployed Node.js backend (MongoDB).
 *
 * Set your backend URL in .env.local:
 *   NEXT_PUBLIC_API_URL=https://your-node-backend.railway.app
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.__SENTRI_API_URL) ||
  "http://localhost:5000";

// ─── patient list ────────────────────────────────────────────────────────────

/**
 * Fetch all registered patients.
 * Returns: Array<{ patient_id, name, age, gender, ... }>
 */
export async function fetchAllPatients() {
  const res = await fetch(`${BASE_URL}/api/patients`);
  if (!res.ok) throw new Error(`Failed to fetch patients: ${res.status}`);
  return res.json();
}

// ─── dashboard snapshot ───────────────────────────────────────────────────────

/**
 * Fetch the full dashboard snapshot for one patient.
 * Returns: { patient, latestVitals, latestPrediction, activeAlerts,
 *             historicalVitals, historicalPredictions }
 */
export async function fetchDashboard(patientId) {
  const res = await fetch(`${BASE_URL}/api/dashboard/${patientId}`);
  if (!res.ok)
    throw new Error(
      `Failed to fetch dashboard for ${patientId}: ${res.status}`
    );
  return res.json();
}

// ─── vitals ───────────────────────────────────────────────────────────────────

/**
 * Fetch the N most recent vitals for a patient.
 * Returns: Array<VitalDoc>
 */
export async function fetchLatestVitals(patientId, limit = 20) {
  const res = await fetch(
    `${BASE_URL}/api/vitals/${patientId}?limit=${limit}`
  );
  if (!res.ok)
    throw new Error(`Failed to fetch vitals for ${patientId}: ${res.status}`);
  return res.json();
}

/**
 * Post a single vitals reading for a patient.
 * Triggers the rolling-window prediction pipeline on the backend.
 *
 * @param {string} patientId
 * @param {Object} vitals  { heart_rate, spo2, temperature, respiratory_rate,
 *                           systolic_bp, mean_arterial_pressure }
 * Returns: { vital, prediction, alert }
 */
export async function postVitals(patientId, vitals) {
  const res = await fetch(`${BASE_URL}/api/vitals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id: patientId, ...vitals }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to post vitals: ${res.status} — ${err}`);
  }
  return res.json();
}

// ─── predictions ─────────────────────────────────────────────────────────────

/**
 * Fetch recent predictions for a patient.
 * Returns: Array<PredictionDoc>
 */
export async function fetchPredictions(patientId, limit = 20) {
  const res = await fetch(
    `${BASE_URL}/api/predictions/${patientId}?limit=${limit}`
  );
  if (!res.ok)
    throw new Error(
      `Failed to fetch predictions for ${patientId}: ${res.status}`
    );
  return res.json();
}

// ─── alerts ──────────────────────────────────────────────────────────────────

/**
 * Fetch all active (unacknowledged) alerts for a patient.
 * Returns: Array<AlertDoc>
 */
export async function fetchActiveAlerts(patientId) {
  const res = await fetch(`${BASE_URL}/api/alerts/${patientId}`);
  if (!res.ok)
    throw new Error(`Failed to fetch alerts for ${patientId}: ${res.status}`);
  return res.json();
}

/**
 * Acknowledge an alert by ID.
 */
export async function acknowledgeAlert(alertId) {
  const res = await fetch(`${BASE_URL}/api/alerts/${alertId}/acknowledge`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Failed to acknowledge alert: ${res.status}`);
  return res.json();
}

// ─── compatibility shim ───────────────────────────────────────────────────────
// Some existing components may still call loadDataset() / rowToVitals().
// These shims keep them from crashing while you migrate.

/** @deprecated  Use fetchAllPatients() + fetchDashboard() instead. */
export async function loadDataset() {
  console.warn(
    "[dataLoader] loadDataset() is deprecated. " +
      "Use fetchAllPatients() and fetchDashboard() instead."
  );
  const patients = await fetchAllPatients();
  // Build a minimal rows/byPatient structure so old call-sites don't crash.
  const rows = patients.map((p) => ({ patient_id: p.patient_id, ...p }));
  const byPatient = new Map(rows.map((r) => [r.patient_id, [r]]));
  return { rows, byPatient, headers: Object.keys(rows[0] || {}) };
}

/** @deprecated  Vitals now come directly from MongoDB via fetchLatestVitals(). */
export function rowToVitals(row, patientId) {
  console.warn("[dataLoader] rowToVitals() is deprecated.");
  return {
    patient_id: patientId,
    heart_rate: row.HR ?? row.heart_rate ?? 75,
    spo2: row.SpO2 ?? row.spo2 ?? 97,
    temperature: row.Temp ?? row.temperature ?? 37.0,
    respiratory_rate: row.Resp ?? row.respiratory_rate ?? 16,
    systolic_bp: row.SBP ?? row.systolic_bp ?? 120,
    mean_arterial_pressure: row.MAP ?? row.mean_arterial_pressure ?? 85,
  };
}