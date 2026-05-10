import TeamGrid from "./TeamGrid";


export default function TeamSection() {
  return (
    <section
      id="team"
      style={{
        position: "relative",
        padding:
          "var(--section-pad-v) var(--section-pad-h)",
        borderTop: "1px solid var(--l00)",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(243,241,234,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,234,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* Ghost number */}
      <div
        style={{
          position: "absolute",
          top: 32,
          right: 40,
          fontFamily: "var(--f-mono)",
          fontSize: "clamp(90px,10vw,180px)",
          color: "var(--t04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        03
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "var(--max-width)",
          margin: "0 auto",
        }}
      >
        {/* TOP LABEL */}
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
            OPERATIONS TEAM
          </span>

          <div
            style={{
              width: 140,
              height: 1,
              background: "var(--l01)",
            }}
          />
        </div>

        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "end",
            marginBottom: 64,
          }}
        >
          {/* LEFT */}
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--f-cond)",
                fontSize: "clamp(64px,8vw,128px)",
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                color: "var(--t00)",
                textTransform: "uppercase",
              }}
            >
              THE PEOPLE
              <br />
              BEHIND SENTRI
              
              
            </h2>
          </div>

          {/* RIGHT */}
          <div
            style={{
              borderLeft: "1px solid var(--l01)",
              paddingLeft: 28,
              maxWidth: 540,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--f-mono)",
                fontSize: 14,
                lineHeight: 2,
                color: "var(--t01)",
              }}
            >
              Sentri was built by a multidisciplinary
              engineering team focused on clinical
              intelligence systems, explainable AI,
              operational UX, and real-time healthcare
              infrastructure.
            </p>
          </div>
        </div>

        <TeamGrid />
      </div>
    </section>
  );
}