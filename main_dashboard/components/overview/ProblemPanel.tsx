export default function ProblemPanel() {
  return (
    <div
      style={{
        border: "1px solid var(--l01)",
        background: "var(--s01)",
        padding: "clamp(20px,3vw,36px)",
      }}
    >
      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--amber)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            ICU FAILURE MODE
          </p>

          <h2
            style={{
              fontSize: "clamp(42px,6vw,84px)",
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              margin: 0,
            }}
          >
            Alert
            <br />
            Fatigue
          </h2>
        </div>

        <div
          style={{
            maxWidth: 420,
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono)",
              color: "var(--t01)",
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            ICU staff monitor dozens of
            disconnected vitals continuously.
            Threshold-based alarms generate
            excessive noise while missing
            gradual deterioration trends.
          </p>
        </div>
      </div>

      {/* METRICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px,1fr))",
          gap: 14,
        }}
      >
        {[
          {
            value: "11M",
            label:
              "Sepsis deaths globally/year",
            color: "var(--crimson)",
          },
          {
            value: "80%",
            label:
              "False-positive alert burden",
            color: "var(--amber)",
          },
          {
            value: "3AM",
            label:
              "Critical decision overload",
            color: "var(--bone)",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              border: "1px solid var(--l00)",
              padding: "18px 16px",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <div
              style={{
                fontSize: 42,
                lineHeight: 1,
                color: item.color,
                marginBottom: 10,
              }}
            >
              {item.value}
            </div>

            <p
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 11,
                lineHeight: 1.7,
                color: "var(--t02)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}