const STEP_MS = 14;

export function ecgPoint(t, heartRate) {
  const hr     = Math.max(30, heartRate || 75);
  const period = 60000 / hr;
  const phase  = (t * STEP_MS % period) / period;
  if (phase < 0.05) return  0.85;
  if (phase < 0.10) return  0.35;
  if (phase < 0.42) return  0.04;
  if (phase < 0.47) return -0.35;
  if (phase < 0.50) return  1.00;
  if (phase < 0.54) return -0.22;
  if (phase < 0.60) return  0.02;
  if (phase < 0.70) return  0.28;
  if (phase < 0.76) return  0.05;
  return 0.02;
}

export function plethPoint(t, spo2) {
  const s     = Math.max(80, Math.min(100, spo2 || 97));
  const amp   = Math.max(0.25, (s - 85) / 15);
  const phase = (t * STEP_MS % 900) / 900;
  return Math.sin(phase * Math.PI * 2) * amp +
         0.14 * Math.sin(phase * Math.PI * 4 - Math.PI * 0.6) * amp;
}

export function respPoint(t, respRate) {
  const rr     = Math.max(8, respRate || 16);
  const period = 60000 / rr;
  return Math.sin((t * STEP_MS / period) * Math.PI * 2) * 0.5;
}