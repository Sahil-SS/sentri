"use client";
import { useState, useEffect } from "react";
import { useVitals } from "@/context/VitalsContext";

export default function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const { backendStatus } = useVitals();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
      setDate(
        now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const statusColor =
    backendStatus === "ok"
      ? "#00ff7f"
      : backendStatus === "offline"
        ? "#ff3333"
        : "#ffaa00";

  return (
    <header className="h-12 border-b border-[#1a2332] flex items-center justify-between px-5 sticky top-0 z-50 bg-[#050a05]">
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#00e5ff", boxShadow: "0 0 8px #00e5ff" }}
          />
          <span
            className="text-base font-semibold tracking-widest"
            style={{
              fontFamily: "Share Tech Mono, monospace",
              color: "#00e5ff",
            }}
          >
            SENTRI ICU
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: statusColor }}
          />
          <span
            className="text-[0.65rem] tracking-[0.2em]"
            style={{
              fontFamily: "Share Tech Mono, monospace",
              color: statusColor,
            }}
          >
            {backendStatus === "ok"
              ? "LIVE"
              : backendStatus === "offline"
                ? "OFFLINE"
                : "CONNECTING"}
          </span>
        </div>
      </div>

      {/* Center: Clock */}
      <div className="text-center">
        <div
          className="text-xl tracking-widest"
          style={{ fontFamily: "Share Tech Mono, monospace", color: "#00ff7f" }}
        >
          {time}
        </div>
        <div
          className="text-[0.6rem] tracking-widest"
          style={{ fontFamily: "Share Tech Mono, monospace", color: "#4a5568" }}
        >
          {date}
        </div>
      </div>

      {/* Right: Ward info */}
      <div
        className="text-right text-[0.7rem] tracking-wide"
        style={{ fontFamily: "Share Tech Mono, monospace", color: "#4a5568" }}
      >
        <div>Ward 4B · ICU</div>
        <div>Nurse: K. Sharma</div>
      </div>
    </header>
  );
}
