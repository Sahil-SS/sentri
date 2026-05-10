"use client";
import { useState, useEffect, useRef } from "react";
import { useVitals } from "@/context/VitalsContext";

export default function StatusBar() {
  const {
    backendStatus,
    lastSentMs,
    rowCursor,
    totalRows,
    vitalsSentCount,
    latestPrediction,
  } = useVitals();
  const [elapsed, setElapsed] = useState("--");
  const [txPulse, setTxPulse] = useState(false);
  const prevSent = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (lastSentMs) {
        const s = ((Date.now() - lastSentMs) / 1000).toFixed(1);
        setElapsed(`${s}s ago`);
      }
    }, 100);
    return () => clearInterval(id);
  }, [lastSentMs]);

  useEffect(() => {
    if (lastSentMs && lastSentMs !== prevSent.current) {
      prevSent.current = lastSentMs;
      setTxPulse(true);
      setTimeout(() => setTxPulse(false), 600);
    }
  }, [lastSentMs]);

  const dotColor =
    backendStatus === "ok"
      ? "#00ff7f"
      : backendStatus === "offline"
        ? "#ff3333"
        : "#ffaa00";

  const statusText =
    backendStatus === "ok"
      ? "Transmitting vitals"
      : backendStatus === "offline"
        ? "⚠ Backend offline"
        : "Connecting…";

  // AI prediction badge
  const predColor =
    latestPrediction?.severity === "high"
      ? "#ff3333"
      : latestPrediction?.severity === "medium"
        ? "#ffaa00"
        : "#00ff7f";

  const vitalsNeeded = Math.max(0, 6 - (vitalsSentCount || 0));

  return (
    <footer
      className="h-9 border-t border-[#1a2332] flex items-center justify-between px-5 text-[0.68rem] tracking-wide"
      style={{
        fontFamily: "Share Tech Mono, monospace",
        background: "#050a05",
        color: "#4a5568",
      }}
    >
      {/* Left: TX status */}
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300"
          style={{
            background: dotColor,
            boxShadow: txPulse ? `0 0 8px ${dotColor}` : "none",
          }}
        />
        <span
          style={{ color: backendStatus === "offline" ? "#ff3333" : "#4a5568" }}
        >
          {statusText}
        </span>
        <span className="opacity-50">·</span>
        <span>Last: {elapsed}</span>
      </div>

      {/* Center: AI prediction or warmup counter */}
      <div className="flex items-center gap-2">
        {latestPrediction ? (
          <>
            <span className="opacity-60">AI Risk:</span>
            <span style={{ color: predColor, fontWeight: 700 }}>
              {latestPrediction.risk_score?.toFixed(1)}%
            </span>
            <span
              className="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-widest"
              style={{ background: predColor + "22", color: predColor }}
            >
              {latestPrediction.severity}
            </span>
          </>
        ) : (
          <span className="opacity-50">
            {vitalsNeeded > 0
              ? `AI warming up · ${vitalsNeeded} more vital${vitalsNeeded !== 1 ? "s" : ""} needed`
              : "Processing first prediction…"}
          </span>
        )}
      </div>

      {/* Right: dataset row */}
      <span>
        Dataset: Kaggle Sepsis · Row {rowCursor} / {totalRows}
      </span>
    </footer>
  );
}
