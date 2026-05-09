"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import MobileMenu from "./MobileMenu";
import { NAV_LINKS } from "@/lib/nav-links";

export default function Navbar() {
  const [scrolled, setScrolled] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`
          fixed
          top-0
          left-0
          w-full
          h-[56px]
          z-[9998]
          transition-all
          duration-300
          ${
            scrolled
              ? `
                bg-[rgba(8,10,15,0.85)]
                backdrop-blur-md
                border-b
                border-[var(--l01)]
              `
              : "bg-transparent"
          }
        `}
      >
        <div
          className="
            w-full
            h-full
            max-w-[1440px]
            mx-auto
            px-4
            md:px-8
            flex
            items-center
            justify-between
          "
        >
          {/* LEFT */}
          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              shrink-0
            "
          >
            <span
              className="
                text-[10px]
                tracking-[0.2em]
                text-[var(--t02)]
                uppercase
              "
            >
              SP-1
            </span>

            <span className="text-[var(--t02)]">
              ┊
            </span>

            <span
              className="
                font-[var(--f-cond)]
                uppercase
                tracking-[0.08em]
                text-sm
                text-[var(--t00)]
              "
            >
              Sentri
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            className="
              hidden
              md:flex
              items-center
              gap-8
            "
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  font-[var(--f-cond)]
                  uppercase
                  tracking-[0.12em]
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

          {/* RIGHT */}
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            {/* CTA */}
            <Link href="/dashboard">
            <button
              className="
                hidden
                md:flex
                btn
                btn-primary-amb
                h-[36px]
                px-4
                text-[12px]
              "
            >
              Launch Demo →
            </button>
              </Link>

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setMenuOpen(true)
              }
              className="
                md:hidden
                text-[var(--t01)]
                hover:text-[var(--amber)]
                transition-colors
              "
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}