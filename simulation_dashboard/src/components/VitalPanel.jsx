'use client';

import { useEffect, useRef, useState } from 'react';

const RANGES = {
  hr:   [60,  100],
  spo2: [95,  100],
  temp: [36.1, 37.8],
  resp: [12,   20],
  map:  [70,  100],
};

export default function VitalPanel({ label, value, unit, color, rangeKey }) {
  const [flicker, setFlicker] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      setFlicker(true);
      const t = setTimeout(() => setFlicker(false), 220);
      prev.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  // Out-of-range coloring
  let displayColor = color;
  if (value !== null && value !== undefined) {
    const r = RANGES[rangeKey];
    if (r) {
      const n = parseFloat(value);
      if (n < r[0] || n > r[1]) {
        const severity = Math.abs(n < r[0] ? r[0] - n : n - r[1]);
        displayColor = severity > (r[1] - r[0]) * 0.25 ? '#ff3333' : '#ffaa00';
      }
    }
  }

  return (
    <div style={{
      flex: 1,
      minWidth: 110,
      background: '#000',
      padding: '12px 14px 10px',
      position: 'relative',
    }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 4,
        background: displayColor,
        transition: 'background 0.3s',
      }} />

      {/* Label */}
      <div style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        color: '#4a5568',
        textTransform: 'uppercase',
        marginTop: 6,
        fontWeight: 500,
      }}>{label}</div>

      {/* Number */}
      <div
        key={String(value)}
        className={flicker ? 'vital-flicker' : ''}
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
          fontWeight: 700,
          color: displayColor,
          lineHeight: 1.1,
          margin: '4px 0 3px',
          transition: 'color 0.3s',
        }}
      >
        {value ?? '--'}
      </div>

      {/* Unit */}
      <div style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.72rem',
        color: '#6b7a8d',
        letterSpacing: '0.04em',
      }}>{unit}</div>
    </div>
  );
}
