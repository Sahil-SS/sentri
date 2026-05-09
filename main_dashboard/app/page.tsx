import Button from "@/components/shared/Button";
import Panel from "@/components/shared/Panel";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollProgress from "@/components/shared/ScrollProgress";
import AmberCursor from "@/components/shared/AmberCursor";

export default function HomePage() {
  return (
    <main className="bg-[var(--void)] min-h-screen">
      <ScrollProgress />

      {/* HERO TEST */}
      <section
        className="
          min-h-screen
          flex
          items-center
        "
      >
        <div
          className="
            w-full
            max-w-[1400px]
            mx-auto
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >
          {/* LEFT */}
          <div>
            <div
              className="
                flex
                items-center
                gap-3
                mb-8
                flex-wrap
              "
            >
              <p className="label">
                SP-1 · VIGIL-WEB
              </p>

              <AmberCursor />
            </div>

            <h1 className="mb-8">
              SENTINEL
              <br />
              <span className="ml-0 lg:ml-10">
                PROTOCOL
              </span>
            </h1>

            <p
              className="
                text-[var(--t01)]
                max-w-[600px]
                leading-[1.9]
                mb-10
              "
            >
              Rolling temporal AI inference on ICU
              vitals. XGBoost + SHAP + LLM clinical
              reasoning. Built for overloaded Indian
              ICU environments.
            </p>

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-4
              "
            >
              <Button variant="primary-crit">
                Launch Demo →
              </Button>

              <Button variant="secondary">
                View Architecture ↓
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <Panel
              variant="crit"
              className="
                p-8
                lg:p-12
                min-h-[400px]
                flex
                items-center
                justify-center
              "
            >
              <div className="text-center">
                <div
                  className="
                    monument-number
                    text-[var(--crimson)]
                    animate-pulse
                  "
                >
                  78
                </div>

                <p
                  className="
                    mt-4
                    font-[var(--f-cond)]
                    uppercase
                    tracking-[0.2em]
                    text-[var(--crimson)]
                  "
                >
                  Critical Risk Index
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* OVERVIEW TEST */}
      <section>
        <SectionHeader
          number="01"
          title="Overview"
          eyebrow="ICU COMMAND INTELLIGENCE"
        />

        <div className="mt-16">
          <Panel
            variant="standard"
            className="
              p-6
              md:p-10
            "
          >
            <p
              className="
                text-[var(--t01)]
                leading-[2]
              "
            >
              EVERY YEAR, SEPSIS CLAIMS 11
              MILLION LIVES GLOBALLY.
            </p>
          </Panel>
        </div>
      </section>
    </main>
  );
}