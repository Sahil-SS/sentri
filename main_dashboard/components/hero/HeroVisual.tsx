"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

import ThreatArcHero from "./ThreatArcHero";

const HR_DATA = Array.from(
  { length: 20 },
  (_, i) => ({
    t: i,
    v:
      72 +
      Math.sin(i * 0.6) * 8 +
      i * 0.9,
  })
);

const SPO2_DATA = Array.from(
  { length: 20 },
  (_, i) => ({
    t: i,
    v:
      98 -
      i * 0.24 -
      Math.abs(Math.sin(i * 0.5)) *
        0.8,
  })
);

function VitalCard({
  label,
  value,
  unit,
  accent,
  data,
}: {
  label: string;
  value: string;
  unit: string;
  accent: string;
  data: { t: number; v: number }[];
}) {
  return (
    <div
      style={{
        border:
          "1px solid var(--l01)",
        background: "var(--s01)",
        padding: "14px",
      }}
    >
      {/* LABEL */}
      <div
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 9,
          color: "var(--t02)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      {/* VALUE */}
      <div
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 32,
          fontWeight: 700,
          color: accent,
          marginBottom: 12,
        }}
      >
        {value}

        <span
          style={{
            fontSize: 11,
            color: "var(--t03)",
            marginLeft: 4,
          }}
        >
          {unit}
        </span>
      </div>

      {/* CHART */}
      <ResponsiveContainer
        width="100%"
        height={60}
      >
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={`grad-${label}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={accent}
                stopOpacity={0.3}
              />

              <stop
                offset="100%"
                stopColor={accent}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="v"
            stroke={accent}
            strokeWidth={2}
            fill={`url(#grad-${label})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function HeroVisual() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        position: "relative",
      }}
    >
      {/* ECG */}
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.12,
        }}
      >
        <path
          d="
            M0 220
            L180 220
            L240 220
            L290 80
            L340 340
            L400 220
            L1200 220
          "
          fill="none"
          stroke="var(--crimson)"
          strokeWidth="2"
        />
      </svg>

      {/* MAIN */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "340px 1fr",
            gap: 14,
          }}
        >
          {/* ARC */}
          <div
            style={{
              border:
                "1px solid rgba(196,43,43,0.25)",
              background: "var(--s01)",
              minHeight: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreatArcHero />
          </div>

          {/* VITALS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <VitalCard
              label="Heart Rate"
              value="102"
              unit="BPM"
              accent="var(--amber)"
              data={HR_DATA}
            />

            <VitalCard
              label="SpO₂ Decline"
              value="93%"
              unit="SAT"
              accent="var(--crimson)"
              data={SPO2_DATA}
            />
          </div>
        </div>

        {/* ROSTER */}
        <div
          style={{
            border:
              "1px solid var(--l01)",
            background: "var(--s01)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontFamily:
                "var(--f-mono)",
              fontSize: 10,
              color: "var(--t02)",
              letterSpacing: "0.14em",
              marginBottom: 10,
            }}
          >
            ICU ACTIVE PATIENTS
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              "P-001 · HR 102 · SPO₂ 93%",
              "P-005 · HR 88 · SPO₂ 97%",
              "P-002 · HR 76 · SPO₂ 99%",
            ].map((item) => (
              <div
                key={item}
                style={{
                  fontFamily:
                    "var(--f-mono)",
                  fontSize: 11,
                  color: "var(--t01)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}