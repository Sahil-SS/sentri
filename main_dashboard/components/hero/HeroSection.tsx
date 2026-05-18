import HeroText from "./HeroText";
import HeroVisual from "./HeroVisual";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "var(--void)",
        paddingTop: "56px",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at 72% 40%,
              rgba(196,43,43,0.08),
              transparent 30%
            ),
            radial-gradient(
              circle at 20% 20%,
              rgba(212,129,10,0.05),
              transparent 25%
            )
          `,
        }}
      />

      {/* GRID */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,196,183,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,196,183,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* MAIN CONTAINER */}
      <div
        className="
          relative
          z-10
          w-full
          mx-auto
          grid
          lg:grid-cols-[48%_52%]
          items-center
        "
        style={{
          maxWidth: 1600,
          minHeight: "calc(100vh - 56px)",
          gap: "clamp(16px, 2vw, 32px)",
          padding:
            "clamp(24px,4vw,48px) clamp(16px,4vw,72px)",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            maxWidth: 640,
            paddingRight: 0,
          }}
        >
          <HeroText />
        </div>

        {/* RIGHT */}
        <div
          className="hidden lg:flex"
          style={{
            minHeight: 760,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Divider */}
          <div
            className="hidden lg:block absolute left-0 top-0 bottom-0"
            style={{
              width: 1,
              background:
                "linear-gradient(180deg, transparent, rgba(212,129,10,0.35) 15%, rgba(212,129,10,0.35) 85%, transparent)",
            }}
          />

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}