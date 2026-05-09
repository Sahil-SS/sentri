export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid var(--l01)",
        overflow: "hidden",
      }}
    >
      {/* GRID */}
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

      {/* MAIN */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding:
            "72px var(--section-pad-h) 42px",
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1fr) auto",
            gap: 40,
            alignItems: "end",
            marginBottom: 72,
          }}
        >
          {/* LEFT */}
          <div>
            {/* label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 26,
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
                SENTRI VIGIL-7
              </span>

              <div
                style={{
                  width: 120,
                  height: 1,
                  background: "var(--l01)",
                }}
              />
            </div>

            {/* heading */}
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--f-cond)",
                fontSize: "clamp(54px,7vw,120px)",
                lineHeight: 0.88,
                letterSpacing: "-0.05em",
                color: "var(--t00)",
                textTransform: "uppercase",
                maxWidth: 900,
              }}
            >
              REAL-TIME
              <br />
              CLINICAL
              <br />
              INTELLIGENCE
            </h2>
          </div>

          {/* RIGHT */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 18,
            }}
          >
            {[
              "EARLY DETERIORATION DETECTION",
              "EXPLAINABLE AI INFERENCE",
              "REAL-TIME ICU TELEMETRY",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: "var(--amber)",
                  }}
                />

                <span
                  style={{
                    fontFamily: "var(--f-mono)",
                    fontSize: 10,
                    color: "var(--t02)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER LINE */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--l01), transparent)",
            marginBottom: 36,
          }}
        />

        {/* BOTTOM */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 28,
            alignItems: "center",
          }}
        >
          {/* left */}
          <div>
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 9,
                color: "var(--t03)",
                letterSpacing: "0.14em",
                lineHeight: 1.8,
                display: "block",
              }}
            >
              SENTRI · VIGIL-7 PLATFORM
            </span>

            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 9,
                color: "var(--t03)",
                letterSpacing: "0.14em",
                lineHeight: 1.8,
                display: "block",
              }}
            >
              OPERATIONAL CLINICAL
              INTELLIGENCE SYSTEM
            </span>
          </div>

          {/* center */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                background: "var(--amber)",
                opacity: 0.7,
              }}
            />

            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                color: "var(--amber)",
                letterSpacing: "0.14em",
              }}
            >
              SYSTEM STATUS · ACTIVE
            </span>
          </div>

          {/* right */}
          <div
            style={{
              justifySelf: "end",
            }}
          >
            <span
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 9,
                color: "var(--t03)",
                letterSpacing: "0.14em",
              }}
            >
              © 2026 SENTRI SYSTEMS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}