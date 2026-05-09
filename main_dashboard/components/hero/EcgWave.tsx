export default function EcgWave() {
  return (
    <svg
      viewBox="0 0 1200 300"
      className="
        absolute
        inset-0
        w-full
        h-full
        opacity-[0.08]
      "
      preserveAspectRatio="none"
    >
      <path
        d="
          M0 150
          L120 150
          L150 90
          L180 220
          L210 40
          L240 150
          L1200 150
        "
        fill="none"
        stroke="var(--bone)"
        strokeWidth="1"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        style={{
          animation:
            "ecg-draw 3s ease-out forwards",
        }}
      />
    </svg>
  );
}