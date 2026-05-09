'use client';

import { useEffect, useRef } from 'react';
import { useVitals } from '@/context/VitalsContext';
import { postVitals } from '@/lib/api';

export function useVitalsSimulator(patientRows) {
  const {
    setCurrentVitals,
    setBackendStatus,
    setLastSentMs,
    setRowCursor,
    setTotalRows,
    selectedPatient,
  } = useVitals();

  const cursorRef = useRef(0);

  useEffect(() => {
    cursorRef.current = 0;
  }, [selectedPatient]);

  useEffect(() => {
    if (!patientRows || patientRows.length === 0) return;

    setTotalRows(patientRows.length);

    const tick = async () => {
      const idx = cursorRef.current % patientRows.length;
      const row = patientRows[idx];
      setCurrentVitals(row);
      setRowCursor(idx);
      cursorRef.current += 1;

      const result = await postVitals(row);
      if (result.ok) {
        setBackendStatus('ok');
        setLastSentMs(Date.now());
      } else {
        setBackendStatus('offline');
        setLastSentMs(Date.now());
      }
    };

    tick();
    const id = setInterval(tick, 3000); // 3 seconds between data updates
    return () => clearInterval(id);
  }, [patientRows]);
}
