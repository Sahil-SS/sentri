const STACK = [
  {
    title: "XGBOOST",
    line1: "Gradient Boosted",
    line2: "Temporal Inference",
  },
  {
    title: "SHAP",
    line1: "Explainability",
    line2: "Clinical Factors",
  },
  {
    title: "GROQ LLM",
    line1: "History Parsing",
    line2: "llama-3.3-70b",
  },
  {
    title: "FASTAPI",
    line1: "ML Backend",
    line2: "Inference Service",
  },
  {
    title: "NODE.JS",
    line1: "Orchestration",
    line2: "Primary Backend",
  },
  {
    title: "NEXT.JS",
    line1: "VIGIL-7",
    line2: "ICU Interface",
  },
];

export default function TechStackGrid() {
  return (
    <div>
      {/* header */}
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
            textTransform: "uppercase",
          }}
        >
          CORE STACK
        </span>

        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--l00)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
        }}
      >
        {STACK.map((item, i) => (
          <div
            key={item.title}
            style={{
              border:
                i === 0 || i === 1
                  ? "1px solid var(--l-amber)"
                  : "1px solid var(--l01)",
              background:
                i === 0 || i === 1
                  ? "var(--amber-glow)"
                  : "var(--s01)",
              padding: 24,
              minHeight: 180,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  i === 0 || i === 1
                    ? "var(--amber)"
                    : "var(--l00)",
              }}
            />

            <div
              style={{
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-cond)",
                  fontSize: 28,
                  fontWeight: 700,
                  color:
                    i === 0 || i === 1
                      ? "var(--amber)"
                      : "var(--t00)",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.title}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 11,
                  color: "var(--t01)",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                {item.line1}
              </span>

              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color: "var(--t02)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {item.line2}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}