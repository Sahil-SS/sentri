"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;

      const docHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const scrolled = scrollTop / docHeight;

      setProgress(scrolled * 100);
    };

    window.addEventListener("scroll", updateScroll);

    updateScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        updateScroll
      );
    };
  }, []);

  return (
    <div
      className="
        fixed
        left-0
        top-0
        z-[9999]
        w-[1px]
        bg-[var(--amber)]
      "
      style={{
        height: `${progress}%`,
      }}
    />
  );
}