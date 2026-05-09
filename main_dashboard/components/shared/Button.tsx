import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

type Variant =
  | "primary-crit"
  | "primary-amb"
  | "secondary"
  | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary-amb",
  className,
}: ButtonProps) {
  const classes = clsx(
    "btn",
    {
      "btn-primary-crit": variant === "primary-crit",
      "btn-primary-amb": variant === "primary-amb",
      "btn-secondary": variant === "secondary",
      "btn-ghost": variant === "ghost",
    },
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}