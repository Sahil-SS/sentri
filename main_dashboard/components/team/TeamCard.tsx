type Props = {
  index: string;
  name: string;
  role: string;
  specialty: string;
};

export default function TeamCard({
  index,
  name,
  role,
  specialty,
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

      {/* image placeholder */}
      <div
        style={{
          aspectRatio: "4 / 5",
          borderBottom: "1px solid var(--l01)",
          background:
            "linear-gradient(180deg, rgba(243,241,234,0.03), rgba(243,241,234,0.01))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* placeholder grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(243,241,234,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,234,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* placeholder mark */}
        <div
          style={{
            width: 72,
            height: 72,
            border: "1px solid var(--l01)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              color: "var(--t03)",
              letterSpacing: "0.18em",
            }}
          >
            IMG
          </span>
        </div>

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