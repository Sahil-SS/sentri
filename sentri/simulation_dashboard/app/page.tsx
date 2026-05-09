"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState("");

  const [patient, setPatient] = useState("017072");

  const [vitals, setVitals] = useState({
    hr: 82,
    spo2: 98,
    temp: 37.1,
    resp: 16,
    sbp: 120,
    map: 85,
    age: 64,
  });

  useEffect(() => {
    const clock = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals({
        hr: Math.floor(75 + Math.random() * 15),
        spo2: Math.floor(95 + Math.random() * 4),
        temp: Number(
          (
            36.5 +
            Math.random() * 1.5
          ).toFixed(1)
        ),
        resp: Math.floor(14 + Math.random() * 5),
        sbp: Math.floor(110 + Math.random() * 20),
        map: Math.floor(80 + Math.random() * 15),
        age: 64,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="monitor">

      {/* TOP BAR */}

      <div className="topbar">

        <div className="brand">

          <div className="live-dot"></div>

          <span>SENTRI ICU</span>

        </div>

        <div className="clock">
          {time}
        </div>

        <select
          value={patient}
          onChange={(e) =>
            setPatient(e.target.value)
          }
          className="patient-select"
        >
          <option>017072</option>
          <option>017073</option>
          <option>017074</option>
        </select>

      </div>

      {/* BODY */}

      <div className="monitor-body">

        {/* LEFT */}

        <div className="wave-section">

          <WaveRow
            label="ECG"
            color="#00ff7f"
            value={vitals.hr}
            unit="bpm"
            waveform="ecg"
          />

          <WaveRow
            label="SPO2"
            color="#00e5ff"
            value={vitals.spo2}
            unit="%"
            waveform="spo2"
          />

          <WaveRow
            label="RESP"
            color="#ffffff"
            value={vitals.resp}
            unit="rpm"
            waveform="resp"
          />

        </div>

        {/* RIGHT */}

        <div className="side-panel">

          <NumericBox
            label="TEMP"
            value={vitals.temp}
            unit="°C"
            color="#ffd700"
          />

          <NumericBox
            label="SBP"
            value={vitals.sbp}
            unit="mmHg"
            color="#39ff14"
          />

          <NumericBox
            label="MAP"
            value={vitals.map}
            unit="mmHg"
            color="#00ff7f"
          />

          <NumericBox
            label="AGE"
            value={vitals.age}
            unit="yrs"
            color="#ffffff"
          />

        </div>

      </div>
    </div>
  );
}

/* ======================= */

function WaveRow({
  label,
  color,
  value,
  unit,
  waveform,
}: any) {
  return (
    <div className="wave-row">

      <div
        className="wave-label"
        style={{ color }}
      >
        {label}
      </div>

      <div className="wave-container">

        <div
          className={`wave ${waveform}`}
          style={{
            borderColor: color,
          }}
        ></div>

      </div>

      <div
        className="wave-number"
        style={{ color }}
      >

        <div className="big-number">
          {value}
        </div>

        <div className="unit">
          {unit}
        </div>

      </div>

    </div>
  );
}

/* ======================= */

function NumericBox({
  label,
  value,
  unit,
  color,
}: any) {
  return (
    <div className="numeric-box">

      <div
        className="numeric-label"
        style={{ color }}
      >
        {label}
      </div>

      <div
        className="numeric-value"
        style={{ color }}
      >
        {value}
      </div>

      <div className="numeric-unit">
        {unit}
      </div>

    </div>
  );
}