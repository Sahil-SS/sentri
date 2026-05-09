import Button from "@/components/shared/Button";
import AmberCursor from "@/components/shared/AmberCursor";

export default function HeroText() {
  return (
    <div className="relative z-10">
      {/* PRETITLE */}
      <div
        className="
          flex
          items-center
          gap-3
          flex-wrap
          mb-8
          hero-reveal
        "
      >
        <p className="label">
          SP-1 · VIGIL-7 · ICU COMMAND
          INTELLIGENCE
        </p>

        <AmberCursor />
      </div>

      {/* TITLE */}
      <div
        className="
          hero-reveal
        "
        style={{
          animationDelay: "300ms",
        }}
      >
        <h1 className="mb-8">
          SENTINEL
          <br />

          <span className="ml-0 lg:ml-12">
            PROTOCOL
          </span>
        </h1>
      </div>

      {/* TAGLINE */}
      <div
        className="
          hero-reveal
          mb-8
        "
        style={{
          animationDelay: "600ms",
        }}
      >
        <p
          className="
            font-[var(--f-cond)]
            uppercase
            tracking-[0.08em]
            text-[var(--ts-hero-sub)]
            text-[var(--t01)]
            leading-[1.2]
          "
        >
          Predict deterioration.
          <br />
          Before it happens.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div
        className="
          hero-reveal
          mb-10
        "
        style={{
          animationDelay: "900ms",
        }}
      >
        <div
          className="
            flex
            flex-col
            gap-4
            max-w-[620px]
          "
        >
          {[
            "Rolling temporal AI inference on ICU vitals.",
            "XGBoost + SHAP + LLM clinical reasoning.",
            "8-second decision support for nurses at 3 AM.",
          ].map((line) => (
            <div
              key={line}
              className="
                flex
                items-start
                gap-3
              "
            >
              <span className="text-[var(--amber)]">
                ▶
              </span>

              <p
                className="
                  text-[14px]
                  text-[var(--t01)]
                  leading-[1.8]
                "
              >
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="
          hero-reveal
          flex
          flex-col
          sm:flex-row
          gap-4
        "
        style={{
          animationDelay: "1200ms",
        }}
      >
        <Button variant="primary-crit">
          Launch Demo →
        </Button>

        <Button variant="secondary">
          View Architecture ↓
        </Button>
      </div>
    </div>
  );
}