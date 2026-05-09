'use client';

import { useVitals } from '@/context/VitalsContext';

export default function PatientSelector({ patientIds }) {
  const { selectedPatient, setSelectedPatient } = useVitals();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.55rem',
        letterSpacing: '0.2em',
        color: '#4a5568',
        textTransform: 'uppercase',
      }}>Patient ID</span>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <select
          value={selectedPatient || ''}
          onChange={e => setSelectedPatient(e.target.value)}
          style={{
            minWidth: 160,
            background: '#000',
            color: '#00e5ff',
            border: '1px solid #00e5ff',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.95rem',
            fontWeight: 600,
            padding: '6px 30px 6px 12px',
            borderRadius: '2px',
            appearance: 'none',
            outline: 'none',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {patientIds.map(pid => (
            <option key={pid} value={pid} style={{ background: '#0d1117', color: '#00e5ff' }}>
              {pid}
            </option>
          ))}
        </select>
        <span style={{
          position: 'absolute', right: 10, top: '50%',
          transform: 'translateY(-50%)',
          color: '#00e5ff', fontSize: '0.65rem',
          pointerEvents: 'none',
        }}>▼</span>
      </div>
    </div>
  );
}
