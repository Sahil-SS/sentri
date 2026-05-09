const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * POST vitals row to backend
 * Returns { ok: true } or { ok: false, error }
 */
export async function postVitals(vitals) {
  try {
    const payload = {
      patient_id: vitals.patient_id,
      timestamp: new Date().toISOString(),
      heart_rate: vitals.heart_rate,
      spo2: vitals.spo2,
      temperature: vitals.temperature,
      resp_rate: vitals.resp_rate,
      map: vitals.map,
    };

    const res = await fetch(`${API_BASE}/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
