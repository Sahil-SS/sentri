import ArchDiagram from "./ArchDiagram";
import TechStackGrid from "./TechStackGrid";
import RollingWindowViz from "./RollingWindowViz";

export default function TechSection() {
  return (
    <section
      id="technology"
      style={{
        position: "relative",
        padding:
          "96px clamp(24px,5vw,72px) 110px",
        background: "var(--grad-section)",
        overflow: "hidden",
        borderTop: "1px solid var(--l00)",
      }}
    >
      {/* GRID */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(200,196,183,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,196,183,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* RED GLOW */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(196,43,43,0.08), transparent 70%)",
          top: -200,
          right: -100,
          pointerEvents: "none",
          filter: "blur(60px)",
        }}
      />

      {/* SECTION NUMBER */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 40,
          fontFamily: "var(--f-mono)",
          fontSize: "clamp(90px,10vw,180px)",
          fontWeight: 700,
          color: "rgba(200,196,183,0.04)",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        02
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(24px, 3vw, 48px)",
            marginBottom: 56,
            alignItems: "end",
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color: "var(--amber)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                SYSTEM ARCHITECTURE
              </span>

              <div
                style={{
                  width: 140,
                  height: 1,
                  background: "var(--l01)",
                }}
              />
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: "var(--f-cond)",
                fontWeight: 700,
                fontSize: "clamp(48px,7vw,120px)",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: "var(--t00)",
                textTransform: "uppercase",
              }}
            >
              HOW THE
              <br />
              SYSTEM
              <br />
              THINKS
            </h2>
          </div>

          {/* RIGHT */}
          <div
            className="mobile-no-border-left"
            style={{
              borderLeft: "1px solid var(--l01)",
              paddingLeft: 28,
              maxWidth: 560,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--f-mono)",
                fontSize: 15,
                lineHeight: 2,
                color: "var(--t01)",
              }}
            >
              Sentri transforms rolling ICU
              telemetry into explainable risk
              intelligence using temporal
              inference, XGBoost prediction,
              SHAP explainability, and
              contextual clinical reasoning.
            </p>
          </div>
        </div>

        {/* ARCH */}
        <ArchDiagram />

        {/* STACK */}
        <div style={{ marginTop: 40 }}>
          <TechStackGrid />
        </div>

        {/* WINDOW */}
        <div style={{ marginTop: 40 }}>
          <RollingWindowViz />
        </div>
      </div>
    </section>
  );
}