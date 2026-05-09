let _cache = null;

/**
 * Loads and parses public/Simulated_Dataset.csv once, caches result.
 * Returns: { rows: Array<Object>, byPatient: Map<string, Array<Object>> }
 */
export async function loadDataset() {
  if (_cache) return _cache;

  const res = await fetch("/Simulated_Dataset.csv");
  const text = await res.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      const v = vals[i]?.trim();
      row[h] = isNaN(v) || v === "" ? v : Number(v);
    });
    return row;
  });

  // Group by patient_id if that column exists
  const byPatient = new Map();
  rows.forEach((row) => {
    const pid = row.patient_id || row.Patient_ID || row.id || "default";
    if (!byPatient.has(pid)) byPatient.set(pid, []);
    byPatient.get(pid).push(row);
  });

  _cache = { rows, byPatient, headers };
  return _cache;
}

/**
 * Maps a CSV row to the vitals shape the backend expects.
 * Adjust field names to match your CSV headers.
 */
export function rowToVitals(row, patientId) {
  return {
    patient_id: patientId,
    heart_rate: row.HR ?? row.heart_rate ?? row.HeartRate ?? 75,
    spo2: row.SpO2 ?? row.spo2 ?? row.oxygen_sat ?? 97,
    temperature: row.Temp ?? row.temperature ?? row.Temperature ?? 37.0,
    respiratory_rate: row.Resp ?? row.respiratory_rate ?? row.RespRate ?? 16,
    systolic_bp: row.SBP ?? row.systolic_bp ?? row.SystolicBP ?? 120,
    mean_arterial_pressure:
      row.MAP ?? row.mean_arterial_pressure ?? row.MeanBP ?? 85,
  };
}
