"use client";

import { useState } from "react";

const NODES = [
  {
    id: 0,
    title: "PATIENT REGISTRATION",
    desc:
      "Patient intake, demographics, and baseline ICU profile initialization.",
    meta: ["PDF PARSING", "GROQ", "PATIENT DATA"],
  },
  {
    id: 1,
    title: "GROQ LLM PARSING",
    desc:
      "Clinical history transformed into structured contextual intelligence.",
    meta: ["LLAMA-3.3", "ENTITY EXTRACTION", "JSON"],
  },
  {
    id: 2,
    title: "STRUCTURED PROFILE",
    desc:
      "Normalized patient state object generated for downstream inference.",
    meta: ["FEATURE STORE", "VECTOR STATE"],
  },
  {
    id: 3,
    title: "ROLLING VITALS",
    desc:
      "Continuous telemetry ingestion using rolling temporal windows.",
    meta: ["MQTT", "STREAM", "TEMPORAL"],
  },
  {
    id: 4,
    title: "FEATURE ENGINEERING",
    desc:
      "Trend deltas, slopes, volatility, and deterioration signatures computed.",
    meta: ["WINDOW OPS", "DERIVATIVES"],
  },
  {
    id: 5,
    title: "XGBOOST ENGINE",
    desc:
      "Primary deterioration prediction engine producing calibrated risk outputs.",
    meta: ["XGBOOST", "CLASSIFIER", "RISK"],
  },
  {
    id: 6,
    title: "SHAP EXPLAINABILITY",
    desc:
      "Explainability layer surfaces dominant clinical contributors.",
    meta: ["SHAP", "FEATURE IMPACT"],
  },
  {
    id: 7,
    title: "VIGIL-7 DASHBOARD",
    desc:
      "Operational ICU interface displaying live patient intelligence.",
    meta: ["NEXT.JS", "LIVE STATE"],
  },
];

function ParsingViz() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {[
        "Patient has prior cardiac instability...",
        "Extracting medication history...",
        "Converting clinical notes to vectors...",
      ].map((line, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--l01)",
            background: "var(--s02)",
            padding: "10px 14px",
            animation: `telemetryPulse 1.4s ease-in-out ${i * 200}ms infinite`,
          }}
        >
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "var(--t02)",
              letterSpacing: "0.06em",
            }}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

function RollingWindowVizInternal() {
  const rows = [
    ["V1", "V2", "V3", "V4", "V5"],
    ["V2", "V3", "V4", "V5", "V6"],
    ["V3", "V4", "V5", "V6", "V7"],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {rows.map((row, r) => (
        <div
          key={r}
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {row.map((item, i) => (
            <div
              key={item}
              style={{
                padding: "10px 12px",
                minWidth: 48,
                textAlign: "center",
                border:
                  i >= 3
                    ? "1px solid rgba(212,129,10,0.45)"
                    : "1px solid var(--l01)",
                background:
                  i >= 3
                    ? "rgba(212,129,10,0.08)"
                    : "var(--s02)",
                animation:
                  i >= 3
                    ? "activeGlow 1.5s ease-in-out infinite"
                    : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color:
                    i >= 3
                      ? "var(--amber)"
                      : "var(--t02)",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function XGBoostViz() {
  const bars = [22, 44, 68, 82, 91];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        gap: 12,
        height: 180,
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            background:
              i === bars.length - 1
                ? "rgba(212,129,10,0.18)"
                : "rgba(200,196,183,0.08)",
            border:
              i === bars.length - 1
                ? "1px solid rgba(212,129,10,0.35)"
                : "1px solid var(--l00)",
            animation:
              i === bars.length - 1
                ? "telemetryPulse 1s ease-in-out infinite"
                : undefined,
            transition: "500ms ease",
          }}
        />
      ))}
    </div>
  );
}

function SHAPViz() {
  const data = [
    ["HR TREND", 38],
    ["SPO₂ DROP", 31],
    ["RESP RATE", 18],
    ["TEMP RISE", 8],
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {data.map(([label, pct], i) => (
        <div key={label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                color: "var(--t02)",
              }}
            >
              {label}
            </span>

            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                color: "var(--amber)",
              }}
            >
              {pct}%
            </span>
          </div>

          <div
            style={{
              height: 8,
              background: "var(--s02)",
              border: "1px solid var(--l00)",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background:
                  i < 2
                    ? "rgba(212,129,10,0.6)"
                    : "rgba(200,196,183,0.16)",
                animation:
                  "telemetryPulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardViz() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
      }}
    >
      {[
        ["RISK", "78"],
        ["HR", "102"],
        ["SPO₂", "93"],
        ["ALERTS", "3"],
      ].map(([label, val], i) => (
        <div
          key={label}
          style={{
            border:
              i === 0
                ? "1px solid rgba(196,43,43,0.4)"
                : "1px solid var(--l01)",
            background:
              i === 0
                ? "rgba(196,43,43,0.08)"
                : "var(--s02)",
            padding: "18px 16px",
          }}
        >
          <div
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              color: "var(--t03)",
              marginBottom: 8,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontFamily: "var(--f-cond)",
              fontSize: 42,
              lineHeight: 1,
              color:
                i === 0
                  ? "var(--crimson)"
                  : "var(--t00)",
            }}
          >
            {val}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ArchDiagram() {
  const [active, setActive] = useState(5);

  return (
    <>
      <style>{`
        @keyframes flowPulse {
          0% {
            opacity: 0;
            transform: scaleX(0);
            transform-origin: left;
          }

          50% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        @keyframes activeGlow {
          0%,100% {
            box-shadow: 0 0 0 rgba(212,129,10,0);
          }

          50% {
            box-shadow: 0 0 24px rgba(212,129,10,0.12);
          }
        }

        @keyframes telemetryPulse {
          0%,100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div
        style={{
          border: "1px solid var(--l01)",
          background: "rgba(13,16,23,0.82)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              padding: 32,
              borderRight: "1px solid var(--l01)",
            }}
          >
            {/* TOP */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color: "var(--amber)",
                  letterSpacing: "0.18em",
                }}
              >
                LIVE INFERENCE FLOW
              </span>

              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--l00)",
                }}
              />
            </div>

            {/* NODES */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {NODES.map((node, i) => {
                const isActive = active === i;

                return (
                  <div
                    key={node.title}
                    onClick={() => setActive(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
                      opacity:
                        isActive ||
                        Math.abs(active - i) <= 1
                          ? 1
                          : 0.45,
                      transition: "300ms ease",
                    }}
                  >
                    {/* INDEX */}
                    <span
                      style={{
                        width: 28,
                        fontFamily: "var(--f-mono)",
                        fontSize: 10,
                        color: isActive
                          ? "var(--amber)"
                          : "var(--t03)",
                      }}
                    >
                      0{i + 1}
                    </span>

                    {/* CONNECTOR */}
                    <div
                      style={{
                        width: 36,
                        height: 1,
                        background: "var(--l01)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {i <= active && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "var(--amber)",
                            animation:
                              "flowPulse 1.5s linear infinite",
                          }}
                        />
                      )}
                    </div>

                    {/* NODE */}
                    <div
                      style={{
                        flex: 1,
                        border: isActive
                          ? "1px solid rgba(212,129,10,0.5)"
                          : "1px solid var(--l01)",
                        background: isActive
                          ? "rgba(212,129,10,0.06)"
                          : "var(--s02)",
                        padding: "14px 18px",
                        animation: isActive
                          ? "activeGlow 2s ease-in-out infinite"
                          : undefined,
                        transition: "300ms ease",
                      }}
                    >
                      <span
                        style={{
                          fontFamily:
                            "var(--f-mono)",
                          fontSize: 11,
                          color: isActive
                            ? "var(--amber)"
                            : "var(--t01)",
                          letterSpacing: "0.14em",
                          textTransform:
                            "uppercase",
                        }}
                      >
                        {node.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent:
                "space-between",
              minHeight: "clamp(300px, 50vh, 620px)",
            }}
          >
            {/* TOP */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  marginBottom: 22,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 10,
                    color: "var(--amber)",
                    letterSpacing: "0.18em",
                  }}
                >
                  ACTIVE SUBSYSTEM
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      background:
                        "var(--amber)",
                      animation:
                        "telemetryPulse 1s linear infinite",
                    }}
                  />

                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 9,
                      color: "var(--t02)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    LIVE
                  </span>
                </div>
              </div>

              {/* TITLE */}
              <h3
                style={{
                  margin: 0,
                  marginBottom: 22,
                  fontFamily: "var(--f-cond)",
                  fontWeight: 700,
                  fontSize: 44,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "var(--t00)",
                  textTransform: "uppercase",
                }}
              >
                {NODES[active].title}
              </h3>

              {/* DESC */}
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--f-mono)",
                  fontSize: 13,
                  lineHeight: 2,
                  color: "var(--t01)",
                  maxWidth: 420,
                  marginBottom: 36,
                }}
              >
                {NODES[active].desc}
              </p>

              {/* META */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {NODES[active].meta.map(
                  (m) => (
                    <div
                      key={m}
                      style={{
                        border:
                          "1px solid var(--l01)",
                        padding:
                          "8px 12px",
                        background:
                          "var(--s02)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily:
                            "var(--f-mono)",
                          fontSize: 10,
                          color:
                            "var(--t02)",
                          letterSpacing:
                            "0.12em",
                          textTransform:
                            "uppercase",
                        }}
                      >
                        {m}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* DYNAMIC VISUAL STATE */}
              <div
                style={{
                  marginTop: 36,
                  minHeight: 220,
                  borderTop:
                    "1px solid var(--l01)",
                  paddingTop: 28,
                }}
              >
                {active === 0 && <ParsingViz />}
                {active === 1 && <ParsingViz />}
                {active === 2 && <ParsingViz />}
                {active === 3 && (
                  <RollingWindowVizInternal />
                )}
                {active === 4 && (
                  <RollingWindowVizInternal />
                )}
                {active === 5 && (
                  <XGBoostViz />
                )}
                {active === 6 && <SHAPViz />}
                {active === 7 && (
                  <DashboardViz />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}