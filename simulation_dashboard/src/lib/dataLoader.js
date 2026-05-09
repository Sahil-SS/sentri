/**
 * Parses the Kaggle Sepsis CSV into a map of patient_id → rows[]
 * Expected columns: Patient_ID, Hour, HR, O2Sat, Temp, Resp, SBP, MAP, Age, SepsisLabel
 */
export function parseCSV(rawText) {
  const lines = rawText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i];
    });
    return row;
  });

  // Group by Patient_ID
  const patientMap = {};
  rows.forEach(row => {
    const pid = row['Patient_ID'];
    if (!pid) return;
    if (!patientMap[pid]) patientMap[pid] = [];
    patientMap[pid].push({
      patient_id: pid,
      hour: parseFloat(row['Hour']) || 0,
      heart_rate: parseFloat(row['HR']) || 75,
      spo2: parseFloat(row['O2Sat']) || 97,
      temperature: parseFloat(row['Temp']) || 37.0,
      resp_rate: parseFloat(row['Resp']) || 16,
      sbp: parseFloat(row['SBP']) || 120,
      map: parseFloat(row['MAP']) || 85,
      age: parseFloat(row['Age']) || 55,
      sepsis_label: parseInt(row['SepsisLabel']) || 0,
    });
  });

  return patientMap;
}

export function getPatientIds(patientMap) {
  return Object.keys(patientMap).sort();
}
