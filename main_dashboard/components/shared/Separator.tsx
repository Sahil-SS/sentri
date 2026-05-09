interface SeparatorProps {
  vertical?: boolean;
  className?: string;
}

export default function Separator({
  vertical = false,
  className = "",
}: SeparatorProps) {
  if (vertical) {
    return (
      <div
        className={className}
        style={{
          width: "1px",
          background: "var(--l01)",
        }}
      />
    );
  }

  return (
    <hr
      className={className}
      style={{
        border: "none",
        height: "1px",
        background: "var(--l00)",
      }}
    />
  );
}