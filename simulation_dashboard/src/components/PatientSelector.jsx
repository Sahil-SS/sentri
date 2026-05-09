"use client";
import { useVitals } from "@/context/VitalsContext";

export default function PatientSelector() {
  const { selectedPatient, setSelectedPatient, backendPatients } = useVitals();
  const loading = backendPatients.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "0.55rem",
          letterSpacing: "0.2em",
          color: "#4a5568",
          textTransform: "uppercase",
        }}
      >
        Patient ID
      </span>

      <div style={{ position: "relative", display: "inline-block" }}>
        <select
          value={selectedPatient || ""}
          onChange={(e) => setSelectedPatient(e.target.value)}
          disabled={loading}
          style={{
            minWidth: 170,
            background: "#000",
            color: "#00e5ff",
            border: "1px solid #00e5ff",
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "0.95rem",
            fontWeight: 600,
            padding: "6px 30px 6px 12px",
            borderRadius: "2px",
            appearance: "none",
            outline: "none",
            cursor: loading ? "wait" : "pointer",
            letterSpacing: "0.05em",
          }}
        >
          {loading ? (
            <option>Loading...</option>
          ) : (
            backendPatients.map((p) => (
              <option
                key={p.patient_id}
                value={p.patient_id}
                style={{ background: "#0d1117", color: "#00e5ff" }}
              >
                {p.patient_id}
              </option>
            ))
          )}
        </select>
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#00e5ff",
            fontSize: "0.65rem",
            pointerEvents: "none",
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
