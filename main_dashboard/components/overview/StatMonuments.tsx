const stats = [
  {
    value: "94.2%",
    label: "Prediction Accuracy",
    accent: "var(--amber)",
  },
  {
    value: "8s",
    label: "Inference Window",
    accent: "rgba(224,71,71,0.75)",
  },
  {
    value: "247",
    label: "Vitals Processed / Min",
    accent: "rgba(200,196,183,0.45)",
  },
];

export default function StatMonuments() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: 18,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            border: "1px solid var(--l01)",
            background: "var(--s01)",
            padding: "24px 22px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Accent line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 2,
              background: stat.accent,
            }}
          />

          {/* Tiny top label */}
          <div
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 9,
              color: "var(--t03)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 18,
              marginLeft: 10,
            }}
          >
            SENTRI METRIC
          </div>

          {/* Main stat */}
          <div
            style={{
              fontSize:
                "clamp(42px,5vw,64px)",
              lineHeight: 0.9,
              color: "var(--bone)",
              marginBottom: 16,
              marginLeft: 10,
            }}
          >
            {stat.value}
          </div>

          {/* Bottom label */}
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              color: "var(--t02)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginLeft: 10,
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}