"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav-links";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  return (
    <div
      className={`
        fixed
        top-0
        right-0
        h-screen
        w-[280px]
        bg-[var(--s01)]
        border-l
        border-[var(--l01)]
        z-[9999]
        transition-transform
        duration-300
        ease-out
        p-6
        flex
        flex-col
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* TOP */}
      <div
        className="
          flex
          items-center
          justify-between
          mb-12
        "
      >
        <div>
          <p className="label">
            SP-1
          </p>

          <p
            className="
              mt-2
              font-[var(--f-cond)]
              uppercase
              tracking-[0.12em]
              text-sm
            "
          >
            Sentri
          </p>
        </div>

        <button
          onClick={onClose}
          className="
            text-[var(--t01)]
            hover:text-[var(--amber)]
            transition-colors
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* LINKS */}
      <nav
        className="
          flex
          flex-col
          gap-6
        "
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="
              font-[var(--f-cond)]
              uppercase
              tracking-[0.14em]
              text-[13px]
              text-[var(--t01)]
              hover:text-[var(--amber)]
              transition-colors
            "
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto">
        <button
          className="
            btn
            btn-primary-amb
            w-full
          "
        >
          Launch Demo →
        </button>
      </div>
    </div>
  );
}