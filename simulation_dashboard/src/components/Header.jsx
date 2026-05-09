'use client';

import { useState, useEffect } from 'react';
import { useVitals } from '@/context/VitalsContext';

export default function Header() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const { backendStatus } = useVitals();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
      setDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      height: '48px',
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--bg-panel-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: Brand + Live */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--accent-blue)',
            boxShadow: '0 0 8px var(--accent-blue)',
          }} />
          <span style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '1rem',
            color: 'var(--accent-blue)',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}>SENTRI ICU</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulse-dot" style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--status-ok)',
          }} />
          <span style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.65rem',
            color: 'var(--status-ok)',
            letterSpacing: '0.2em',
          }}>LIVE</span>
        </div>
      </div>

      {/* Center: Clock */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '1.2rem',
          color: 'var(--ecg-green)',
          letterSpacing: '0.1em',
        }}>{time}</div>
        <div style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.6rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.1em',
        }}>{date}</div>
      </div>

      {/* Right: Ward info */}
      <div style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        textAlign: 'right',
        letterSpacing: '0.05em',
      }}>
        <div>Ward 4B · ICU</div>
        <div>Nurse: K. Sharma</div>
      </div>
    </header>
  );
}
