import Image from "next/image";

type Props = {
  index: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
};

export default function TeamCard({
  index,
  name,
  role,
  specialty,
  image,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid var(--l01)",
        background: "rgba(13,16,23,0.82)",
        overflow: "hidden",
        position: "relative",
        transition: "300ms ease",
      }}
    >
      {/* top line */}
      <div
        style={{
          height: 1,
          background: "var(--l01)",
        }}
      />

      {/* image */}
<div
  style={{
    aspectRatio: "4 / 5",
    borderBottom: "1px solid var(--l01)",
    position: "relative",
    overflow: "hidden",
  }}
>
  <Image
    src={image}
    alt={name}
    fill
    style={{
      objectFit: "cover",
    }}
  />

  {/* dark overlay */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.08))",
    }}
  />

  {/* index */}
  <div
    style={{
      position: "absolute",
      top: 16,
      left: 16,
      fontFamily: "var(--f-mono)",
      fontSize: 10,
      color: "var(--t03)",
      letterSpacing: "0.12em",
      zIndex: 2,
    }}
  >
    {index}
  </div>
</div>
      {/* content */}
      <div
        style={{
          padding: "24px 22px",
        }}
      >
        {/* role */}
        <div
          style={{
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 10,
              color: "var(--amber)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {role}
          </span>
        </div>

        {/* name */}
        <h3
          style={{
            margin: 0,
            marginBottom: 16,
            fontFamily: "var(--f-cond)",
            fontSize: 36,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--t00)",
            textTransform: "uppercase",
          }}
        >
          {name}
        </h3>

        {/* divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "var(--l00)",
            marginBottom: 18,
          }}
        />

        {/* specialty */}
        <p
          style={{
            margin: 0,
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            lineHeight: 1.9,
            color: "var(--t02)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {specialty}
        </p>
      </div>
    </div>
  );
}