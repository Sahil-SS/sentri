import ContactForm from "./ContactForm";
import ContactTerminal from "./ContactTerminal";

export default function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding:
          "var(--section-pad-v) var(--section-pad-h)",
        borderTop: "1px solid var(--l00)",
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

      {/* GHOST NUMBER */}
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
        04
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
            TRANSMISSION CHANNEL
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
            marginBottom: 72,
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
              INITIATE
              <br />
              CONTACT
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
              For collaboration, clinical validation,
              deployment discussions, or technical
              inquiries, establish a secure
              transmission channel with the Sentri
              operations team.
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1.1fr) minmax(320px,0.9fr)",
            gap: 24,
          }}
        >
          <ContactForm />
          <ContactTerminal />
        </div>
      </div>
    </section>
  );
}