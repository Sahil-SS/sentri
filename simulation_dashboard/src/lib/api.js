const BASE = "https://loyal-magic-production-0fce.up.railway.app/";

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  // GET /api/patients
  getPatients: () => req("/api/patients"),

  // GET /api/patients/:id
  getPatient: (id) => req(`/api/patients/${id}`),

  // POST /api/patients/register
  registerPatient: (payload) =>
    req("/api/patients/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // POST /api/vitals  → returns { success, prediction? }
  sendVitals: (vitals) =>
    req("/api/vitals", { method: "POST", body: JSON.stringify(vitals) }),

  // GET /api/dashboard/:id
  getDashboard: (id) => req(`/api/dashboard/${id}`),

  // GET /api/predictions/:id
  getPredictions: (id) => req(`/api/predictions/${id}`),

  // GET /api/alerts/:id
  getAlerts: (id) => req(`/api/alerts/${id}`),

  // PATCH /api/alerts/:alertId/acknowledge
  acknowledgeAlert: (alertId) =>
    req(`/api/alerts/${alertId}/acknowledge`, { method: "PATCH" }),

  // Health check
  ping: () =>
    req("/api/patients")
      .then(() => true)
      .catch(() => false),
};
