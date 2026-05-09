import { ReactNode } from "react";
import clsx from "clsx";

type Variant =
  | "standard"
  | "elevated"
  | "amber"
  | "crit";

interface PanelProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Panel({
  children,
  variant = "standard",
  className,
}: PanelProps) {
  return (
    <div
      className={clsx(
        "panel",
        {
          "panel-standard": variant === "standard",
          "panel-elevated": variant === "elevated",
          "panel-amber": variant === "amber",
          "panel-crit": variant === "crit",
        },
        className
      )}
    >
      {children}
    </div>
  );
}