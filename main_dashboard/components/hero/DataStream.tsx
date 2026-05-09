const DATA = [
  "P-001  KUMAR    HR:102▲",
  "P-005  SHARMA   SPO2:93▼",
  "P-002  MEHTA    TEMP:38.4▲",
  "────────────────────",
  "PREDICTIONS: 1,247",
  "ALERTS TODAY: 3",
  "ACCURACY: 94.2%",
];

export default function DataStream() {
  return (
    <div
      className="
        w-full
        max-w-[220px]
        border
        border-[var(--l01)]
        bg-[var(--s01)]
        p-4
        overflow-hidden
      "
    >
      <div
        className="
          flex
          flex-col
          gap-2
          text-[10px]
          text-[var(--t02)]
          tracking-[0.08em]
        "
      >
        {DATA.map((line, index) => (
          <div
            key={index}
            style={{
              animation:
                "data-stream 4s linear infinite",
              animationDelay: `${index * 120}ms`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}