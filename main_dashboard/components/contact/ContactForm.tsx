"use client";

export default function ContactForm() {
  return (
    <form
      action="https://api.web3forms.com/submit"
      method="POST"
      style={{
        border: "1px solid var(--l01)",
        background: "rgba(13,16,23,0.82)",
        padding: 32,
      }}
    >
      {/* WEB3FORMS ACCESS KEY */}
      <input
        type="hidden"
        name="access_key"
        value="46b2a622-540f-489c-9ed4-2142262b202d"
      />

      {/* TOP */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 36,
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
          SECURE MESSAGE
        </span>

        <div
          style={{
            flex: 1,
            height: 1,
            background: "var(--l00)",
          }}
        />
      </div>

      {/* INPUTS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {[
          {
            label: "NAME",
            type: "text",
            name: "name",
          },

          {
            label: "EMAIL",
            type: "email",
            name: "email",
          },
        ].map((field) => (
          <div key={field.name}>
            <label
              style={{
                display: "block",
                marginBottom: 10,
                fontFamily: "var(--f-mono)",
                fontSize: 10,
                color: "var(--t03)",
                letterSpacing: "0.14em",
              }}
            >
              {field.label}
            </label>

            <input
              type={field.type}
              name={field.name}
              required
              style={{
                width: "100%",
                background: "var(--s02)",
                border: "1px solid var(--l01)",
                padding: "16px 18px",
                color: "var(--t00)",
                fontFamily: "var(--f-mono)",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        ))}

        {/* MESSAGE */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 10,
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "var(--t03)",
              letterSpacing: "0.14em",
            }}
          >
            MESSAGE
          </label>

          <textarea
            name="message"
            required
            rows={7}
            style={{
              width: "100%",
              resize: "none",
              background: "var(--s02)",
              border: "1px solid var(--l01)",
              padding: "16px 18px",
              color: "var(--t00)",
              fontFamily: "var(--f-mono)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          style={{
            border: "1px solid var(--l-amber)",
            background: "var(--amber-glow)",
            padding: "18px 22px",
            color: "var(--amber)",
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "300ms ease",
          }}
        >
          Transmit Message
        </button>
      </div>
    </form>
  );
}