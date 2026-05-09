export default function ContactTerminal() {
  return (
    <div
      style={{
        border: "1px solid var(--l01)",
        background: "rgba(13,16,23,0.82)",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 100,
      }}
    >
      {/* TOP */}
      <div>
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
            }}
          >
            TERMINAL STATUS
          </span>

          <div
            style={{
              flex: 1,
              height: 1,
              background: "var(--l00)",
            }}
          />
        </div>

        {/* STATUS */}
        <div
          style={{
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                background: "var(--amber)",
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
              CHANNEL ACTIVE
            </span>
          </div>

          <p
            style={{
              margin: 0,
              fontFamily: "var(--f-mono)",
              fontSize: 12,
              lineHeight: 2,
              color: "var(--t02)",
            }}
          >
            Sentri transmission endpoints are
            currently operational and accepting
            inbound communication packets.
          </p>
        </div>

        {/* METRICS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {[
            ["UPLINK STATUS", "STABLE"],
            ["AVERAGE RESPONSE", "< 24 HOURS"],
            ["DEPLOYMENT REGION", "INDIA"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                paddingBottom: 14,
                borderBottom:
                  "1px solid var(--l00)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color: "var(--t03)",
                  letterSpacing: "0.12em",
                }}
              >
                {k}
              </span>

              <span
                style={{
                  fontFamily: "var(--f-mono)",
                  fontSize: 10,
                  color: "var(--t01)",
                  letterSpacing: "0.12em",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div
        style={{
          marginTop: 48,
          borderTop: "1px solid var(--l00)",
          paddingTop: 20,
        }}
      >
        <span
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 9,
            color: "var(--t03)",
            letterSpacing: "0.12em",
          }}
        >
          SENTRI VIGIL-7 · SECURE CONTACT NODE
        </span>
      </div>
    </div>
  );
}