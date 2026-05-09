"use client";

import { createContext, useContext } from "react";
import { useVitalsSimulator } from "@/hooks/useVitalsSimulator";

const VitalsCtx = createContext(null);

export function VitalsProvider({ children }) {
  const sim = useVitalsSimulator();
  return <VitalsCtx.Provider value={sim}>{children}</VitalsCtx.Provider>;
}

export function useVitals() {
  const ctx = useContext(VitalsCtx);
  if (!ctx) throw new Error("useVitals must be used inside <VitalsProvider>");
  return ctx;
}
