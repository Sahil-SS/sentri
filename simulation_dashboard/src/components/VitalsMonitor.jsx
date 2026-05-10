"use client";

import { useEffect, useRef } from "react";
import { useVitals } from "@/context/VitalsContext";
import WaveformChannel from "./WaveformChannel";
import VitalPanel from "./VitalPanel";

// ── Waveform math (inlined — no import risk) ─────────────────────────────────
const STEP_MS = 14;

function ecgPoint(t, heartRate) {
  const hr = Math.max(30, heartRate || 75);
  const period = 60000 / hr;
  const phase = ((t * STEP_MS) % period) / period;
  if (phase < 0.05) return 0.85;
  if (phase < 0.1) return 0.35;
  if (phase < 0.42) return 0.04;
  if (phase < 0.47) return -0.35;
  if (phase < 0.5) return 1.0;
  if (phase < 0.54) return -0.22;
  if (phase < 0.6) return 0.02;
  if (phase < 0.7) return 0.28;
  if (phase < 0.76) return 0.05;
  return 0.02;
}

function plethPoint(t, spo2) {
  const s = Math.max(80, Math.min(100, spo2 || 97));
  const amp = Math.max(0.25, (s - 85) / 15);
  const phase = ((t * STEP_MS) % 900) / 900;
  return (
    Math.sin(phase * Math.PI * 2) * amp +
    0.14 * Math.sin(phase * Math.PI * 4 - Math.PI * 0.6) * amp
  );
}

function respPoint(t, respRate) {
  const rr = Math.max(8, respRate || 16);
  const period = 60000 / rr;
  return Math.sin(((t * STEP_MS) / period) * Math.PI * 2) * 0.5;
}

// ─────────────────────────────────────────────────────────────────────────────
const BUFFER_SIZE = 300;
const makeBuffer = () => new Float32Array(BUFFER_SIZE);

export default function VitalsMonitor() {
  const { currentVitals, selectedPatient } = useVitals();

  const ecgBuf = useRef(makeBuffer());
  const plethBuf = useRef(makeBuffer());
  const respBuf = useRef(makeBuffer());
  const tRef = useRef(0);
  const vitalsRef = useRef(currentVitals);
  const rafRef = useRef(null);

  // Keep vitalsRef fresh without restarting RAF
  useEffect(() => {
    vitalsRef.current = currentVitals;
  }, [currentVitals]);

  // Reset buffers on patient switch
  useEffect(() => {
    ecgBuf.current.fill(0);
    plethBuf.current.fill(0);
    respBuf.current.fill(0);
    tRef.current = 0;
  }, [selectedPatient]);

  // RAF loop — starts once, never restarts
  useEffect(() => {
    let last = 0;
    const loop = (now) => {
      if (now - last >= STEP_MS) {
        last = now;
        const v = vitalsRef.current;
        const hr = v?.heart_rate || 75;
        const sp = v?.spo2 || 97;
        const rr = v?.respiratory_rate || 16;
        const t = tRef.current++;

        ecgBuf.current.copyWithin(0, 1);
        plethBuf.current.copyWithin(0, 1);
        respBuf.current.copyWithin(0, 1);
        ecgBuf.current[BUFFER_SIZE - 1] = ecgPoint(t, hr);
        plethBuf.current[BUFFER_SIZE - 1] = plethPoint(t, sp);
        respBuf.current[BUFFER_SIZE - 1] = respPoint(t, rr);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const v = currentVitals;
  const hr = v?.heart_rate != null ? Math.round(v.heart_rate) : null;
  const sp = v?.spo2 != null ? Math.round(v.spo2) : null;
  const tmp = v?.temperature != null ? Number(v.temperature).toFixed(1) : null;
  const rr =
    v?.respiratory_rate != null ? Math.round(v.respiratory_rate) : null;

  const map =
    v?.mean_arterial_pressure != null
      ? Math.round(v.mean_arterial_pressure)
      : null;

  return (
    <div style={{ padding: "16px", background: "#e8e8e8" }}>
      <div
        style={{
          background: "#000",
          border: "3px solid #d4d4d4",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: "0 8px 48px rgba(0,0,0,0.55)",
        }}
      >
        {/* Monitor info bar */}
        <div
          style={{
            background: "#050a05",
            borderBottom: "1px solid #1a2332",
            padding: "5px 16px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            height: 34,
          }}
        >
          <Chip label="BED" value="ICU-1" color="#00ff7f" />
          <Chip
            label="PATIENT"
            value={selectedPatient || "---"}
            color="#e8edf2"
          />
          <Chip
            label="AGE"
            value={v?.age != null ? `${Math.round(v.age)} yr` : "---"}
            color="#e8edf2"
          />
          <Chip
            label="HOUR"
            value={v?.hour != null ? Math.round(v.hour) : "---"}
            color="#6b7a8d"
          />
        </div>

        {/* ECG — standard height */}
        <WaveformChannel
          label="ECG"
          color="#00ff7f"
          bufferRef={ecgBuf}
          numericValue={hr}
          unit="bpm"
          height={100}
        />

        {/* PLETH — taller for more visibility */}
        <WaveformChannel
          label="PLETH"
          color="#00e5ff"
          bufferRef={plethBuf}
          numericValue={sp}
          unit="%"
          height={130}
        />

        {/* RESP — standard height */}
        <WaveformChannel
          label="RESP"
          color="#e0e0e0"
          bufferRef={respBuf}
          numericValue={rr}
          unit="br/min"
          height={100}
        />

        {/* Numeric panels */}
        <div style={{ display: "flex", borderTop: "2px solid #1a2332" }}>
          <VitalPanel
            label="Heart Rate"
            value={hr}
            unit="bpm"
            color="#00ff7f"
            rangeKey="hr"
          />
          <Sep />
          <VitalPanel
            label="SpO₂"
            value={sp}
            unit="%"
            color="#00e5ff"
            rangeKey="spo2"
          />
          <Sep />
          <VitalPanel
            label="Temperature"
            value={tmp}
            unit="°C"
            color="#ffd700"
            rangeKey="temp"
          />
          <Sep />
          <VitalPanel
            label="Resp Rate"
            value={rr}
            unit="br/min"
            color="#e0e0e0"
            rangeKey="resp"
          />
          <Sep />
          <VitalPanel
            label="MAP"
            value={map}
            unit="mmHg"
            color="#39ff14"
            rangeKey="map"
          />
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.55rem",
          letterSpacing: "0.15em",
          color: "#4a5568",
          textTransform: "uppercase",
        }}
      >
        {label}:
      </span>
      <span
        style={{
          fontFamily: "Share Tech Mono, monospace",
          fontSize: "0.82rem",
          fontWeight: 600,
          color,
          letterSpacing: "0.05em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, background: "#1a2332", flexShrink: 0 }} />;
}
