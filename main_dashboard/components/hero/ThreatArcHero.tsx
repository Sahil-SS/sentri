export default function ThreatArcHero() {
  const radius = 70;
  const circumference =
    2 * Math.PI * radius;

  const progress = 78;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div
      className="
        relative
        w-[260px]
        h-[260px]
        sm:w-[300px]
        sm:h-[300px]
        flex
        items-center
        justify-center
      "
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        className="-rotate-90"
      >
        {/* TRACK */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(200,196,183,0.08)"
          strokeWidth="1"
        />

        {/* ARC */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--crimson)"
          strokeWidth="3"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            animation:
              "risk-arc-fill 1200ms var(--ease-out)",
          }}
        />
      </svg>

      {/* CENTER CONTENT */}
      <div
        className="
          absolute
          inset-0
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <div
          className="
            monument-number
            text-[var(--crimson)]
          "
          style={{
            fontSize:
              "clamp(64px, 10vw, 96px)",
            animation:
              "critical-pulse 2400ms linear infinite",
          }}
        >
          78
        </div>

        <p
          className="
            mt-2
            font-[var(--f-cond)]
            uppercase
            tracking-[0.2em]
            text-[13px]
            text-[var(--crimson)]
          "
        >
          Critical
        </p>

        <p
          className="
            mt-1
            text-[10px]
            tracking-[0.2em]
            uppercase
            text-[var(--t02)]
          "
        >
          Risk Index
        </p>
      </div>
    </div>
  );
}