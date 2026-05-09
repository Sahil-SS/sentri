"use client";

import { useEffect, useState } from "react";

const STATES = [
  {
    id: 0,
    risk: 24,
    status: "STABLE",
    color: "rgba(200,196,183,0.7)",
    windows: [
      ["72", "74", "75", "76", "77"],
      ["97", "97", "96", "96", "95"],
    ],
  },

  {
    id: 1,
    risk: 48,
    status: "MONITOR",
    color: "var(--amber)",
    windows: [
      ["76", "79", "82", "86", "91"],
      ["96", "95", "94", "94", "93"],
    ],
  },

  {
    id: 2,
    risk: 78,
    status: "ESCALATE",
    color: "var(--crimson)",
    windows: [
      ["84", "91", "96", "101", "108"],
      ["95", "94", "93", "92", "91"],
    ],
  },
];

export default function RollingWindowViz() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) =>
        prev === STATES.length - 1
          ? 0
          : prev + 1
      );
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const state = STATES[active];

  return (
    <>
      <style>{`
        @keyframes slidePulse {
          0%,100% {
            transform: translateX(0px);
            opacity: 0.7;
          }

          50% {
            transform: translateX(3px);
            opacity: 1;
          }
        }

        @keyframes riskPulse {
          0%,100% {
            box-shadow: 0 0 0 rgba(212,129,10,0);
          }

          50% {
            box-shadow: 0 0 24px rgba(212,129,10,0.12);
          }
        }

        @keyframes telemetryBlink {
          0%,100% {
            opacity: 0.3;
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
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid var(--l01)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
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
              TEMPORAL WINDOW ENGINE
            </span>

            <div
              style={{
                width: 120,
                height: 1,
                background: "var(--l00)",
              }}
            />
          </div>

          {/* LIVE */}
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
                background: state.color,
                animation:
                  "telemetryBlink 1s linear infinite",
              }}
            />

            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 9,
                color: "var(--t02)",
                letterSpacing: "0.12em",
              }}
            >
              LIVE INFERENCE
            </span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1.1fr 0.9fr",
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              padding: 28,
              borderRight: "1px solid var(--l01)",
            }}
          >
            {/* TIMELINE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 36,
              }}
            >
              {STATES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  style={{
                    border:
                      i === active
                        ? `1px solid ${s.color}`
                        : "1px solid var(--l01)",
                    background:
                      i === active
                        ? "rgba(255,255,255,0.03)"
                        : "transparent",
                    padding: "10px 14px",
                    cursor: "pointer",
                    transition: "300ms ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 10,
                      color:
                        i === active
                          ? s.color
                          : "var(--t03)",
                      letterSpacing:
                        "0.12em",
                    }}
                  >
                    T+{i * 15}m
                  </span>
                </button>
              ))}
            </div>

            {/* WINDOW STREAM */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              {/* HR */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 10,
                      color: "var(--t03)",
                    }}
                  >
                    HEART RATE
                  </span>

                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 10,
                      color: state.color,
                    }}
                  >
                    TRENDING ↑
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {state.windows[0].map(
                    (v, i) => (
                      <div
                        key={i}
                        style={{
                          minWidth: 64,
                          padding:
                            "14px 16px",
                          textAlign:
                            "center",
                          border:
                            i >= 3
                              ? `1px solid ${state.color}`
                              : "1px solid var(--l01)",
                          background:
                            i >= 3
                              ? "rgba(255,255,255,0.03)"
                              : "var(--s02)",
                          animation:
                            i >= 3
                              ? "slidePulse 1.2s ease-in-out infinite"
                              : undefined,
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              "var(--f-mono)",
                            fontSize: 11,
                            color:
                              i >= 3
                                ? state.color
                                : "var(--t02)",
                          }}
                        >
                          {v}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* SPO2 */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 10,
                      color: "var(--t03)",
                    }}
                  >
                    SPO₂ SATURATION
                  </span>

                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 10,
                      color:
                        active === 2
                          ? "var(--crimson)"
                          : "var(--amber)",
                    }}
                  >
                    TRENDING ↓
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {state.windows[1].map(
                    (v, i) => (
                      <div
                        key={i}
                        style={{
                          minWidth: 64,
                          padding:
                            "14px 16px",
                          textAlign:
                            "center",
                          border:
                            i >= 3
                              ? `1px solid ${state.color}`
                              : "1px solid var(--l01)",
                          background:
                            i >= 3
                              ? "rgba(255,255,255,0.03)"
                              : "var(--s02)",
                          animation:
                            i >= 3
                              ? "slidePulse 1.2s ease-in-out infinite"
                              : undefined,
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              "var(--f-mono)",
                            fontSize: 11,
                            color:
                              i >= 3
                                ? state.color
                                : "var(--t02)",
                          }}
                        >
                          {v}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              padding: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent:
                "space-between",
            }}
          >
            {/* TOP */}
            <div>
              <div
                style={{
                  marginBottom: 22,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "var(--f-mono)",
                    fontSize: 10,
                    color: "var(--amber)",
                    letterSpacing: "0.18em",
                  }}
                >
                  ACTIVE PREDICTION
                </span>
              </div>

              {/* RISK */}
              <div
                style={{
                  border:
                    `1px solid ${state.color}`,
                  background:
                    "rgba(255,255,255,0.02)",
                  padding: 28,
                  marginBottom: 24,
                  animation:
                    "riskPulse 2s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    fontFamily:
                      "var(--f-mono)",
                    fontSize: 10,
                    color: "var(--t03)",
                    marginBottom: 12,
                  }}
                >
                  DETERIORATION RISK
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--f-cond)",
                      fontSize: 92,
                      lineHeight: 0.9,
                      color: state.color,
                    }}
                  >
                    {state.risk}
                  </span>

                  <span
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 16,
                      color: "var(--t02)",
                      marginBottom: 12,
                    }}
                  >
                    %
                  </span>
                </div>
              </div>

              {/* STATUS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  paddingBottom: 18,
                  borderBottom:
                    "1px solid var(--l01)",
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "var(--f-mono)",
                    fontSize: 10,
                    color: "var(--t03)",
                    letterSpacing: "0.12em",
                  }}
                >
                  SYSTEM STATUS
                </span>

                <span
                  style={{
                    fontFamily:
                      "var(--f-mono)",
                    fontSize: 11,
                    color: state.color,
                    letterSpacing: "0.14em",
                  }}
                >
                  {state.status}
                </span>
              </div>
            </div>

            {/* BOTTOM GRAPH */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: 10,
                  height: 160,
                  marginBottom: 16,
                }}
              >
                {[24, 32, 41, 58, state.risk].map(
                  (h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        background:
                          i === 4
                            ? state.color
                            : "rgba(200,196,183,0.08)",
                        opacity:
                          i === 4 ? 1 : 0.45,
                        transition:
                          "500ms ease",
                      }}
                    />
                  )
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                {[
                  "T-60",
                  "T-45",
                  "T-30",
                  "T-15",
                  "NOW",
                ].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily:
                        "var(--f-mono)",
                      fontSize: 9,
                      color: "var(--t03)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}