import ProblemPanel from "./ProblemPanel";
import ComparisonGrid from "./ComparisonGrid";
import StatMonuments from "./StatMonuments";

export default function OverviewSection() {
  return (
    <section
      id="overview"
      style={{
        position: "relative",
        padding:
          "clamp(24px,4vw,56px) clamp(24px,5vw,80px) clamp(80px,10vw,140px)",
      }}
    >
      <div
  style={{
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(212,129,10,0.25), transparent)",
    marginBottom: 48,
  }}
/>
      {/* SECTION HEADER */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto 48px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "var(--amber)",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          01 · SYSTEM OVERVIEW
        </p>

        <h2
          style={{
            fontSize:
              "clamp(56px,9vw,120px)",
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            margin: 0,
          }}
        >
          ICU
          <br />
          Intelligence
        </h2>
      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <ProblemPanel />

        <ComparisonGrid />

        <StatMonuments />
      </div>
    </section>
  );
}