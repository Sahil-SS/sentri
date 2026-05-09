'use client';

import { useEffect, useRef } from 'react';

const Y_MIN   = -0.55;
const Y_MAX   =  1.10;
const Y_RANGE = Y_MAX - Y_MIN;

export default function WaveformChannel({ label, color, bufferRef, numericValue, unit, height = 100 }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const ctx = canvas.getContext('2d');
      const W   = canvas.width;
      const H   = canvas.height;

      if (W === 0 || H === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = '#0d1f0d';
      ctx.lineWidth   = 1;
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let x = 0; x < W; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Waveform
      const buf  = bufferRef.current;
      const len  = buf.length;
      const step = W / (len - 1);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth   = 2;
      ctx.lineJoin    = 'round';

      for (let i = 0; i < len; i++) {
        const x = i * step;
        const y = H - ((buf[i] - Y_MIN) / Y_RANGE) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [color, bufferRef]);

  return (
    <div style={{
      display: 'flex',
      height: `${height}px`,
      background: '#000',
      borderBottom: '1px solid #0d1a0d',
    }}>
      {/* Channel label */}
      <div style={{
        width: 48,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #0d1a0d',
      }}>
        <span style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.15em',
          color: color,
          writingMode: 'vertical-lr',
          transform: 'rotate(180deg)',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>{label}</span>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>

      {/* Numeric readout */}
      <div style={{
        width: 96,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderLeft: '1px solid #0d1a0d',
        background: '#000',
        gap: 3,
      }}>
        <span style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '2.4rem',
          fontWeight: 700,
          color: color,
          lineHeight: 1,
        }}>
          {numericValue ?? '--'}
        </span>
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.68rem',
          color: '#6b7a8d',
          letterSpacing: '0.05em',
        }}>{unit}</span>
      </div>
    </div>
  );
}
