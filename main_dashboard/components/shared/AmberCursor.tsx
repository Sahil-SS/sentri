export default function AmberCursor() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "8px",
        height: "14px",
        marginLeft: "6px",
        background: "var(--amber)",
        animation:
          "amber-cursor-blink 800ms linear infinite",
      }}
    />
  );
}