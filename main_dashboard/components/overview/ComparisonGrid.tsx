const rows = [
  {
    old: "Threshold alarms",
    new: "Trend-based deterioration analysis",
  },
  {
    old: "Reactive escalation",
    new: "Predictive intervention support",
  },
  {
    old: "Opaque alerts",
    new: "SHAP explainability",
  },
  {
    old: "Fragmented monitoring",
    new: "Unified ICU intelligence layer",
  },
];

export default function ComparisonGrid() {
  return (
    <div
      style={{
        border: "1px solid var(--l01)",
        background: "var(--s01)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid var(--l01)",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderRight:
              "1px solid var(--l01)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "rgba(224,71,71,0.75)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Traditional Monitoring
          </p>
        </div>

        <div
          style={{
            padding: "14px 20px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "var(--amber)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Sentri Intelligence Layer
          </p>
        </div>
      </div>

      {/* ROWS */}
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 44px 1fr",
            alignItems: "stretch",
            borderBottom:
              i !== rows.length - 1
                ? "1px solid var(--l00)"
                : "none",
          }}
        >
          {/* OLD */}
          <div
            style={{
              padding: "22px 20px",
              borderRight:
                "1px solid var(--l00)",
              position: "relative",
            }}
          >
            {/* Accent line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "rgba(224,71,71,0.45)",
              }}
            />

            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 13,
                lineHeight: 1.9,
                color:
                  "rgba(200,196,183,0.62)",
                marginLeft: 8,
              }}
            >
              {row.old}
            </p>
          </div>

          {/* CENTER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight:
                "1px solid var(--l00)",
            }}
          >
            <span
              style={{
                color: "var(--amber)",
                opacity: 0.65,
                fontSize: 14,
              }}
            >
              →
            </span>
          </div>

          {/* NEW */}
          <div
            style={{
              padding: "22px 20px",
              position: "relative",
            }}
          >
            {/* Accent line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "rgba(212,129,10,0.5)",
              }}
            />

            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 13,
                lineHeight: 1.9,
                color: "var(--bone)",
                marginLeft: 8,
              }}
            >
              {row.new}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}