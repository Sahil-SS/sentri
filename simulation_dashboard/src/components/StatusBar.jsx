'use client';

import { useState, useEffect, useRef } from 'react';
import { useVitals } from '@/context/VitalsContext';

export default function StatusBar() {
  const { backendStatus, lastSentMs, rowCursor, totalRows } = useVitals();
  const [elapsed, setElapsed] = useState('--');
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

  const statusDotColor = backendStatus === 'ok'
    ? 'var(--status-ok)'
    : backendStatus === 'offline'
    ? 'var(--status-critical)'
    : 'var(--status-warn)';

  const statusText = backendStatus === 'ok'
    ? 'Sending vitals to backend'
    : backendStatus === 'offline'
    ? '⚠ Backend offline'
    : 'Connecting to backend...';

  return (
    <footer style={{
      height: '36px',
      background: 'var(--bg-header)',
      borderTop: '1px solid var(--bg-panel-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '0.68rem',
      color: 'var(--text-secondary)',
      letterSpacing: '0.04em',
    }}>
      {/* Left: TX status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className={txPulse ? 'tx-pulse' : ''} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: statusDotColor,
          flexShrink: 0,
          transition: 'background 0.3s',
        }} />
        <span style={{ color: backendStatus === 'offline' ? 'var(--status-critical)' : 'var(--text-secondary)' }}>
          {statusText}
        </span>
      </div>

      {/* Center: last transmitted */}
      <span>Last transmitted: {elapsed}</span>

      {/* Right: dataset info */}
      <span>
        Dataset: Kaggle Sepsis · Row {rowCursor} of {totalRows}
      </span>
    </footer>
  );
}
