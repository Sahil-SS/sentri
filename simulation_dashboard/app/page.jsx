'use client';

import { useState, useEffect, useRef } from 'react';
import { VitalsProvider, useVitals } from '@/context/VitalsContext';
import { parseCSV, getPatientIds } from '@/lib/dataLoader';
import { useVitalsSimulator } from '@/hooks/useVitalsSimulator';
import PatientSelector from '@/components/PatientSelector';
import VitalsMonitor from '@/components/VitalsMonitor';

function Dashboard() {
  const [patientMap, setPatientMap] = useState({});
  const [patientIds, setPatientIds] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const { selectedPatient, setSelectedPatient, currentVitals } = useVitals();

  useEffect(() => {
    fetch('/Simulated_Dataset.csv')
      .then(r => {
        if (!r.ok) throw new Error('CSV not found — put Simulated_Dataset.csv in /public/');
        return r.text();
      })
      .then(text => {
        const map = parseCSV(text);
        const allIds = getPatientIds(map);
        const first5 = allIds.slice(0, 5); // ← only first 5 patient IDs
        setPatientMap(map);
        setPatientIds(first5);
        if (first5.length > 0) setSelectedPatient(first5[0]);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const rows = selectedPatient && patientMap[selectedPatient]
    ? patientMap[selectedPatient]
    : [];

  useVitalsSimulator(rows);

  if (loading) return <Splash text="INITIALIZING SENTRI ICU…" />;
  if (error)   return <Splash text={error} isError />;

  const v = currentVitals;

  return (
    <div style={{ background: '#e8e8e8', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{
        height: 60,
        background: '#060a0f',
        borderBottom: '1px solid #1a2332',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 11, height: 11, borderRadius: '50%',
              background: '#0066ff', boxShadow: '0 0 10px #0066ff',
            }} />
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#0066ff',
              letterSpacing: '0.12em',
            }}>SENTRI ICU</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="pulse-dot" style={{
              width: 9, height: 9, borderRadius: '50%', background: '#00ff7f',
            }} />
            <span style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.72rem',
              color: '#00ff7f',
              letterSpacing: '0.22em',
            }}>LIVE</span>
          </div>
        </div>

        {/* Clock */}
        <Clock />

        {/* Ward info */}
        <div style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.75rem',
          color: '#6b7a8d',
          textAlign: 'right',
          lineHeight: 1.8,
          letterSpacing: '0.04em',
        }}>
          <div>Ward 4B · ICU</div>
          <div>Nurse: K. Sharma</div>
        </div>
      </div>

      {/* ── Selector bar ── */}
      <div style={{
        background: '#0d1117',
        borderBottom: '2px solid #cccccc',
        padding: '10px 28px',
        display: 'flex', alignItems: 'center', gap: 28,
      }}>
        <PatientSelector patientIds={patientIds} />
        <InfoChip label="Age"  val={v?.age  != null ? `${Math.round(v.age)} yr` : '---'} />
        <InfoChip label="Hour" val={v?.hour != null ? Math.round(v.hour)        : '---'} />
        <span style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.68rem',
          color: '#4a5568',
          marginLeft: 'auto',
          letterSpacing: '0.05em',
        }}>
          {patientIds.length} patients loaded · updating every 3s
        </span>
      </div>

      {/* ── Monitor ── */}
      <VitalsMonitor />

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

// ── Clock ────────────────────────────────────────────────────────────────────
function Clock() {
  const [t, setT] = useState('--:--:--');
  const [d, setD] = useState('');
  useEffect(() => {
    const f = () => {
      const n = new Date();
      setT(n.toTimeString().slice(0, 8));
      setD(n.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '1.4rem',
        color: '#00ff7f',
        letterSpacing: '0.12em',
        fontWeight: 600,
      }}>{t}</div>
      <div style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '0.6rem',
        color: '#6b7a8d',
        letterSpacing: '0.08em',
      }}>{d}</div>
    </div>
  );
}

// ── Info chip ────────────────────────────────────────────────────────────────
function InfoChip({ label, val }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{
        fontSize: '0.55rem',
        letterSpacing: '0.2em',
        color: '#4a5568',
        textTransform: 'uppercase',
        fontFamily: 'DM Sans, sans-serif',
      }}>{label}</span>
      <span style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '1rem',
        color: '#e8edf2',
        fontWeight: 600,
      }}>{val}</span>
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { backendStatus, lastSentMs, rowCursor, totalRows } = useVitals();
  const [elapsed, setElapsed] = useState('--');
  const [glow, setGlow]       = useState(false);
  const prevMs                = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (lastSentMs) setElapsed(((Date.now() - lastSentMs) / 1000).toFixed(1) + 's ago');
    }, 100);
    return () => clearInterval(id);
  }, [lastSentMs]);

  useEffect(() => {
    if (!lastSentMs || lastSentMs === prevMs.current) return;
    prevMs.current = lastSentMs;
    setGlow(true);
    setTimeout(() => setGlow(false), 500);
  }, [lastSentMs]);

  const dc = backendStatus === 'ok' ? '#00ff7f'
           : backendStatus === 'offline' ? '#ff3333'
           : '#ffaa00';

  return (
    <div style={{
      height: 38,
      background: '#060a0f',
      borderTop: '1px solid #1a2332',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px',
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '0.68rem',
      color: '#6b7a8d',
      letterSpacing: '0.05em',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: dc,
          boxShadow: glow ? `0 0 12px ${dc}` : 'none',
          transition: 'box-shadow 0.3s',
        }} />
        <span style={{ color: backendStatus === 'offline' ? '#ff3333' : 'inherit' }}>
          {backendStatus === 'offline' ? '⚠ Backend offline' : 'Sending vitals to backend'}
        </span>
      </div>
      <span>Last transmitted: {elapsed}</span>
      <span>Dataset: Kaggle Sepsis · Row {rowCursor} of {totalRows}</span>
    </div>
  );
}

// ── Splash ───────────────────────────────────────────────────────────────────
function Splash({ text, isError }) {
  const c = isError ? '#ff3333' : '#00ff7f';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#e8e8e8',
      fontFamily: 'Share Tech Mono, monospace',
      color: c, fontSize: '0.95rem', letterSpacing: '0.15em',
      flexDirection: 'column', gap: 18,
    }}>
      {!isError && (
        <div style={{
          width: 40, height: 40,
          border: `2px solid ${c}`, borderTopColor: 'transparent',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
      )}
      <span style={{ textAlign: 'center', padding: '0 20px' }}>{text}</span>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <VitalsProvider>
      <Dashboard />
    </VitalsProvider>
  );
}
