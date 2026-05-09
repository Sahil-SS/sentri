"use client";

import { useVitals } from "@/context/VitalsContext";
import Header from "@/components/Header";
import PatientSelector from "@/components/PatientSelector";
import StatusBar from "@/components/StatusBar";
import VitalsMonitor from "@/components/VitalsMonitor";

// ── Scenario selector ─────────────────────────────────────────────────────────
const SCENARIOS = [
  { value: "septic", label: "Septic Shock", color: "#ff3333" },
  { value: "moderate", label: "Moderate Deterioration", color: "#ffaa00" },
  { value: "stable", label: "Stable Recovery", color: "#00ff7f" },
];

function ScenarioSelector() {
  const { scenario, setScenario } = useVitals();
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
        Scenario
      </span>
      <div style={{ position: "relative" }}>
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          style={{
            background: "#000",
            border: "1px solid #1a2332",
            color:
              SCENARIOS.find((s) => s.value === scenario)?.color ?? "#e8edf2",
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "0.82rem",
            padding: "5px 28px 5px 10px",
            borderRadius: 2,
            appearance: "none",
            cursor: "pointer",
            minWidth: 200,
          }}
        >
          {SCENARIOS.map((s) => (
            <option
              key={s.value}
              value={s.value}
              style={{ color: s.color, background: "#0d1117" }}
            >
              {s.label}
            </option>
          ))}
        </select>
        <span
          style={{
            position: "absolute",
            right: 9,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#4a5568",
            fontSize: "0.6rem",
            pointerEvents: "none",
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}

// ── Reading progress dots ─────────────────────────────────────────────────────
function ReadingDots() {
  const { vitalsSentCount } = useVitals();
  const count = Math.min(vitalsSentCount, 6);
  const triggered = vitalsSentCount >= 6;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "Share Tech Mono, monospace",
          fontSize: "0.6rem",
          color: triggered ? "#00ff7f" : "#4a5568",
          letterSpacing: "0.1em",
        }}
      >
        {triggered ? "AI ACTIVE" : `${count} / 6 TO TRIGGER AI`}
      </span>
      <div style={{ display: "flex", gap: 5 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: `1px solid ${i < count ? (triggered ? "#00ff7f" : "#00e5ff") : "#1a2332"}`,
              background:
                i < count ? (triggered ? "#00ff7f" : "#00e5ff") : "transparent",
              boxShadow: i < count && triggered ? "0 0 6px #00ff7f" : "none",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Risk badge ────────────────────────────────────────────────────────────────
function RiskPanel() {
  const { latestPrediction, vitalsSentCount, alerts, acknowledgeAlert } =
    useVitals();

  const sevColor =
    latestPrediction?.severity === "high"
      ? "#ff3333"
      : latestPrediction?.severity === "medium"
        ? "#ffaa00"
        : "#00ff7f";

  const score = latestPrediction?.risk_score;
  const exps =
    latestPrediction?.explanation ?? latestPrediction?.explanations ?? [];
  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 16,
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* AI Risk Score */}
      <div
        style={{
          background: "#050a05",
          border: "1px solid #1a2332",
          borderRadius: 4,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "#4a5568",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          AI RISK SCORE
        </div>

        <div
          style={{
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "3.2rem",
            fontWeight: 700,
            lineHeight: 1,
            color: score != null ? sevColor : "#1a2332",
            transition: "color 0.5s",
          }}
        >
          {score != null ? Math.round(score) : "--"}
        </div>

        <div
          style={{
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "0.6rem",
            color: score != null ? sevColor : "#4a5568",
            letterSpacing: "0.15em",
            marginTop: 4,
          }}
        >
          {score != null
            ? `${Math.round(score)}% DETERIORATION RISK`
            : vitalsSentCount < 6
              ? `NEED ${6 - Math.min(vitalsSentCount, 6)} MORE READINGS`
              : "AWAITING AI"}
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: 10,
            height: 5,
            background: "#0d1117",
            borderRadius: 2,
            border: "1px solid #1a2332",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              width: score != null ? `${Math.min(score, 100)}%` : "0%",
              background: score != null ? sevColor : "#1a2332",
              transition: "width 1s ease, background 0.5s",
            }}
          />
        </div>

        {/* Threshold labels */}
        <div
          style={{
            position: "relative",
            height: 14,
            marginTop: 2,
            fontFamily: "Share Tech Mono, monospace",
            fontSize: "0.55rem",
          }}
        >
          <span style={{ position: "absolute", left: "35%", color: "#ffaa00" }}>
            ▲35
          </span>
          <span style={{ position: "absolute", left: "50%", color: "#ff3333" }}>
            ▲50
          </span>
        </div>

        {/* Severity badge */}
        {latestPrediction && (
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                fontFamily: "Share Tech Mono, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                padding: "3px 12px",
                borderRadius: 2,
                border: `1px solid ${sevColor}`,
                background: sevColor + "18",
                color: sevColor,
                animation:
                  latestPrediction.severity === "high"
                    ? "blink 1s infinite"
                    : "none",
              }}
            >
              {latestPrediction.severity.toUpperCase()} RISK
            </span>
          </div>
        )}
      </div>

      {/* Clinical Signals */}
      <div
        style={{
          background: "#050a05",
          border: "1px solid #1a2332",
          borderRadius: 4,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "#4a5568",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          CLINICAL SIGNALS
        </div>
        {exps.length > 0 ? (
          exps.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 6,
                fontSize: "0.78rem",
                fontFamily: "DM Sans, sans-serif",
                color: "#a0b8c8",
                lineHeight: 1.45,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: sevColor,
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
              {e}
            </div>
          ))
        ) : (
          <div
            style={{
              fontFamily: "Share Tech Mono, monospace",
              fontSize: "0.65rem",
              color: "#1a2332",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            {vitalsSentCount < 6 ? "— awaiting readings —" : "— no signals —"}
          </div>
        )}
      </div>

      {/* Active Alerts */}
      <div
        style={{
          background: "#050a05",
          border: "1px solid #1a2332",
          borderRadius: 4,
          padding: "14px 16px",
          flex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "#4a5568",
            textTransform: "uppercase",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ACTIVE ALERTS
          {activeAlerts.length > 0 && (
            <span
              style={{
                background: "#ff3333",
                color: "#fff",
                borderRadius: 9,
                fontSize: "0.55rem",
                padding: "1px 6px",
                fontFamily: "Share Tech Mono, monospace",
              }}
            >
              {activeAlerts.length}
            </span>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div
            style={{
              fontFamily: "Share Tech Mono, monospace",
              fontSize: "0.65rem",
              color: "#1a2332",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            — no active alerts —
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const ac =
              alert.severity === "high"
                ? "#ff3333"
                : alert.severity === "medium"
                  ? "#ffaa00"
                  : "#00ff7f";
            return (
              <div
                key={alert._id}
                style={{
                  borderLeft: `3px solid ${ac}`,
                  paddingLeft: 10,
                  marginBottom: 10,
                  background: "#000",
                  borderRadius: "0 3px 3px 0",
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Share Tech Mono, monospace",
                      fontSize: "0.6rem",
                      color: ac,
                      border: `1px solid ${ac}`,
                      padding: "1px 6px",
                      borderRadius: 2,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontFamily: "Share Tech Mono, monospace",
                      fontSize: "0.55rem",
                      color: "#4a5568",
                    }}
                  >
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.75rem",
                    color: "#ffccd0",
                    lineHeight: 1.4,
                    marginBottom: 6,
                  }}
                >
                  {alert.message}
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert._id)}
                  style={{
                    fontFamily: "Share Tech Mono, monospace",
                    fontSize: "0.58rem",
                    color: "#00e5ff",
                    background: "none",
                    border: "1px solid rgba(0,229,255,0.3)",
                    padding: "2px 8px",
                    borderRadius: 2,
                    cursor: "pointer",
                    letterSpacing: "0.1em",
                  }}
                >
                  ACK
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Top control strip (inside page, below header) ─────────────────────────────
function ControlStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        background: "#050a05",
        borderBottom: "1px solid #1a2332",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <PatientSelector />
        <ScenarioSelector />
      </div>
      <ReadingDots />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <Header />
      <ControlStrip />

      {/* Body: monitor left, AI panel right */}
      <div
        style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
      >
        {/* LEFT: waveforms + numeric vitals */}
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          <VitalsMonitor />
        </div>

        {/* RIGHT: risk + alerts */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            borderLeft: "1px solid #1a2332",
            overflowY: "auto",
            background: "#000",
          }}
        >
          <RiskPanel />
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
