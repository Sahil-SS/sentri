'use client';

import { createContext, useContext, useState } from 'react';

const VitalsContext = createContext(null);

export function VitalsProvider({ children }) {
  const [currentVitals, setCurrentVitals] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting'); // 'ok' | 'offline' | 'connecting'
  const [lastSentMs, setLastSentMs] = useState(null);
  const [rowCursor, setRowCursor] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  return (
    <VitalsContext.Provider value={{
      currentVitals, setCurrentVitals,
      selectedPatient, setSelectedPatient,
      backendStatus, setBackendStatus,
      lastSentMs, setLastSentMs,
      rowCursor, setRowCursor,
      totalRows, setTotalRows,
    }}>
      {children}
    </VitalsContext.Provider>
  );
}

export function useVitals() {
  const ctx = useContext(VitalsContext);
  if (!ctx) throw new Error('useVitals must be used inside VitalsProvider');
  return ctx;
}
