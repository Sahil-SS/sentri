interface SectionHeaderProps {
  number: string;
  title: string;
  eyebrow?: string;
}

export default function SectionHeader({
  number,
  title,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto">
      {/* Section Number */}
      <div
        className="
          section-number
          absolute
          right-0
          top-[-40px]
          select-none
          pointer-events-none
        "
      >
        {number}
      </div>

      {/* Eyebrow */}
      {eyebrow && (
        <p
          className="
            label
            mb-4
          "
        >
          {eyebrow}
        </p>
      )}

      {/* Title */}
      <h2
        className="
          relative
          z-10
          max-w-[800px]
        "
      >
        {title}
      </h2>
    </div>
  );
}