/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getPatients,
  getDashboardData,
  registerPatient,
  acknowledgeAlert,
  type Patient,
  type DashboardResponse,
  type DashboardAlert,
  type RegisterPatientPayload,
} from "../../backend/api";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&family=Barlow+Condensed:wght@400;600;700;800&display=swap');

  :root {
    --void:    #06080C;
    --bone:    #CEC9BA;
    --amber:   #D4810A;
    --crimson: #C42B2B;

    --s00: #06080C;
    --s01: #0A0D14;
    --s02: #0F1219;
    --s03: #141820;
    --s04: #191E28;

    --t00: #CEC9BA;
    --t01: rgba(206,201,186,0.78);
    --t02: rgba(206,201,186,0.48);
    --t03: rgba(206,201,186,0.28);
    --t04: rgba(206,201,186,0.12);

    --amber-lo:    rgba(212,129,10,0.10);
    --amber-mid:   rgba(212,129,10,0.18);
    --amber-glow:  rgba(212,129,10,0.05);
    --crimson-lo:  rgba(196,43,43,0.08);
    --crimson-glow:rgba(196,43,43,0.04);

    --l00: rgba(206,201,186,0.04);
    --l01: rgba(206,201,186,0.09);
    --l02: rgba(206,201,186,0.16);
    --l-amber: rgba(212,129,10,0.32);
    --l-crit:  rgba(196,43,43,0.38);

    --f-mono: 'IBM Plex Mono', 'Courier New', monospace;
    --f-cond: 'Barlow Condensed', 'Arial Narrow', sans-serif;

    --radius: 2px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #__next {
    height: 100%;
    background: var(--void);
  }

  body {
    background: var(--void);
    color: var(--t00);
    font-family: var(--f-mono);
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
  }

  ::-webkit-scrollbar        { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track  { background: transparent; }
  ::-webkit-scrollbar-thumb  { background: var(--l02); border-radius: 2px; }

  /* ── ANIMATIONS ─────────────────────────────── */
  @keyframes crit-pulse {
    0%,100% { border-left-color: var(--crimson); }
    50%      { border-left-color: rgba(196,43,43,0.22); }
  }
  @keyframes amber-blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes score-pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.45; }
  }
  @keyframes row-enter {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes intake-slide {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ══════════════════════════════════════════════
     EMERGENCY ALERT ANIMATIONS
  ══════════════════════════════════════════════ */
  @keyframes emergency-border-pulse {
    0%   { box-shadow: inset 0 0 0 3px rgba(196,43,43,0.95), inset 0 0 40px rgba(196,43,43,0.12); }
    40%  { box-shadow: inset 0 0 0 5px rgba(196,43,43,1),    inset 0 0 80px rgba(196,43,43,0.22); }
    100% { box-shadow: inset 0 0 0 3px rgba(196,43,43,0.95), inset 0 0 40px rgba(196,43,43,0.12); }
  }
  @keyframes emergency-scan {
    0%   { transform: translateY(-100vh); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateY(100vh);  opacity: 0; }
  }
  @keyframes corner-flicker {
    0%,100% { opacity: 1; }
    30%     { opacity: 0.2; }
    60%     { opacity: 0.8; }
  }
  @keyframes emergency-banner-in {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes emergency-text-blink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.15; }
  }
  @keyframes radial-pulse {
    0%   { transform: scale(0.6); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  /* ── ACK BUTTON PULSE (draws the eye) ────────── */
  @keyframes ack-btn-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(206,201,186,0.0); }
    50%     { box-shadow: 0 0 0 6px rgba(206,201,186,0.22); }
  }

  /* ── EMERGENCY OVERLAY ───────────────────────── */
  .emergency-overlay {
    position: fixed;
    inset: 0;
    z-index: 9990;
    pointer-events: none;
    animation: emergency-border-pulse 1.1s ease-in-out infinite;
  }
  .emergency-scan-line {
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(196,43,43,0.6) 20%,
      rgba(196,43,43,0.95) 50%,
      rgba(196,43,43,0.6) 80%,
      transparent 100%
    );
    animation: emergency-scan 2.6s linear infinite;
  }
  .emergency-corner {
    position: absolute;
    width: 48px;
    height: 48px;
    animation: corner-flicker 1.4s ease-in-out infinite;
  }
  .emergency-corner--tl { top: 8px;  left: 8px;  border-top: 2px solid var(--crimson); border-left: 2px solid var(--crimson); }
  .emergency-corner--tr { top: 8px;  right: 8px; border-top: 2px solid var(--crimson); border-right: 2px solid var(--crimson); animation-delay: 0.35s; }
  .emergency-corner--bl { bottom: 8px; left: 8px;  border-bottom: 2px solid var(--crimson); border-left: 2px solid var(--crimson); animation-delay: 0.7s; }
  .emergency-corner--br { bottom: 8px; right: 8px; border-bottom: 2px solid var(--crimson); border-right: 2px solid var(--crimson); animation-delay: 1.05s; }
  .emergency-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 55%,
      rgba(196,43,43,0.10) 80%,
      rgba(196,43,43,0.22) 100%
    );
    animation: score-pulse 1.8s ease-in-out infinite;
  }

  /* ── EMERGENCY BANNER ────────────────────────── */
  .emergency-banner {
    position: fixed;
    top: 52px;
    left: 0; right: 0;
    z-index: 9995;
    height: 48px;
    background: rgba(196,43,43,0.96);
    border-bottom: 1px solid rgba(196,43,43,0.4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    animation: emergency-banner-in 300ms cubic-bezier(0,0,0.2,1) both;
    backdrop-filter: blur(4px);
    pointer-events: all;
    gap: 16px;
  }
  .emergency-banner-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    overflow: hidden;
  }
  .emergency-banner-icon {
    width: 20px; height: 20px;
    border: 2px solid rgba(206,201,186,0.9);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .emergency-banner-icon::before,
  .emergency-banner-icon::after {
    content: '';
    position: absolute;
    width: 11px; height: 2px;
    background: rgba(206,201,186,0.9);
  }
  .emergency-banner-icon::before { transform: rotate(45deg); }
  .emergency-banner-icon::after  { transform: rotate(-45deg); }
  .emergency-banner-label {
    font-family: var(--f-cond);
    font-size: 15px; font-weight: 800;
    color: #fff;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    flex-shrink: 0;
    animation: emergency-text-blink 1.1s linear infinite;
  }
  .emergency-banner-message {
    font-family: var(--f-mono);
    font-size: 11px;
    color: rgba(255,255,255,0.82);
    letter-spacing: 0.10em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .emergency-banner-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }
  .emergency-banner-score {
    font-family: var(--f-cond);
    font-size: 32px; font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .emergency-ack-btn {
    height: 34px;
    padding: 0 20px;
    border: 2px solid rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.10);
    color: #fff;
    font-family: var(--f-cond);
    font-size: 14px; font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: var(--radius);
    transition: background 150ms, transform 80ms;
    animation: ack-btn-pulse 1.4s ease-in-out infinite;
    white-space: nowrap;
  }
  .emergency-ack-btn:hover {
    background: rgba(255,255,255,0.22);
    transform: scale(1.03);
  }
  .emergency-ack-btn:active {
    transform: scale(0.97);
    background: rgba(255,255,255,0.30);
  }

  /* ── SHELL ───────────────────────────────────── */
  .vigil-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--void);
    position: relative;
  }
  .vigil-shell.emergency-active {
    padding-top: 48px;
  }

  .vigil-bg-grid {
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(206,201,186,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    z-index: 0;
  }

  .vigil-body {
    flex: 1;
    display: flex;
    position: relative;
    z-index: 1;
  }

  /* ── TOPBAR ──────────────────────────────────── */
  .topbar {
    height: 52px;
    border-bottom: 1px solid var(--l01);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: rgba(6,8,12,0.97);
    backdrop-filter: blur(16px);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 9999;
  }
  .topbar-left  { display: flex; align-items: center; gap: 16px; }
  .topbar-mid   { display: flex; align-items: center; gap: 10px; position: absolute; left: 50%; transform: translateX(-50%); }
  .topbar-right { display: flex; align-items: center; gap: 20px; }

  .tb-label  { font-family: var(--f-mono); font-size: 11px; color: var(--t03); letter-spacing: 0.18em; }
  .tb-vigil  { font-family: var(--f-cond); font-size: 20px; color: var(--t00); letter-spacing: 0.22em; font-weight: 800; }
  .tb-amber  { font-family: var(--f-cond); font-size: 13px; color: var(--amber); letter-spacing: 0.12em; font-weight: 700; }
  .tb-crit   { font-family: var(--f-mono); font-size: 11px; color: var(--crimson); letter-spacing: 0.14em; font-weight: 700; }
  .tb-div    { width: 1px; height: 18px; background: var(--l01); }
  .tb-dot    { width: 8px; height: 8px; background: var(--amber); flex-shrink: 0; }
  .tb-live-dot { width: 8px; height: 8px; background: var(--crimson); border-radius: 50%; animation: score-pulse 1600ms linear infinite; flex-shrink: 0; }

  .topbar.emergency {
    background: rgba(30,6,6,0.98);
    border-bottom-color: rgba(196,43,43,0.45);
  }

  /* ── PATIENT INTAKE BAR ──────────────────────── */
  .intake-bar {
    border-bottom: 1px solid var(--l01);
    background: var(--s01);
    flex-shrink: 0;
    position: relative;
    z-index: 50;
  }
  .intake-bar-collapsed {
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 14px;
    cursor: pointer;
    user-select: none;
    transition: background 150ms;
  }
  .intake-bar-collapsed:hover { background: rgba(206,201,186,0.02); }
  .intake-toggle-icon {
    width: 18px; height: 18px;
    border: 1px solid var(--l02);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .intake-toggle-label {
    font-family: var(--f-cond);
    font-size: 13px; color: var(--t02);
    letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600;
  }
  .intake-toggle-hint {
    font-family: var(--f-mono);
    font-size: 10px; color: var(--t03);
    letter-spacing: 0.10em; margin-left: auto;
  }
  .intake-form-wrap {
    padding: 20px 24px 22px;
    display: flex; align-items: flex-start; gap: 20px;
    animation: intake-slide 200ms ease both;
  }
  .intake-field-group { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
  .intake-field-label {
    font-family: var(--f-cond);
    font-size: 11px; color: var(--t02);
    letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600;
  }
  .intake-text-input {
    height: 38px; padding: 0 12px;
    background: var(--s02); border: 1px solid var(--l01);
    color: var(--t00); font-family: var(--f-mono);
    font-size: 13px; letter-spacing: 0.10em;
    outline: none; transition: border-color 150ms;
    width: 180px; border-radius: var(--radius);
  }
  .intake-text-input::placeholder { color: var(--t03); }
  .intake-text-input:focus { border-color: var(--amber); }
  .intake-history-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0; }
  .intake-history-tabs { display: flex; gap: 0; border: 1px solid var(--l01); width: fit-content; }
  .intake-tab {
    height: 28px; padding: 0 14px;
    font-family: var(--f-cond); font-size: 11px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    background: transparent; border: none; border-right: 1px solid var(--l01);
    color: var(--t02); cursor: pointer;
    transition: color 120ms, background 120ms;
  }
  .intake-tab:last-child { border-right: none; }
  .intake-tab.active { background: var(--amber-lo); color: var(--amber); }
  .intake-textarea {
    height: 64px; padding: 10px 12px;
    background: var(--s02); border: 1px solid var(--l01);
    color: var(--t00); font-family: var(--f-mono);
    font-size: 12px; letter-spacing: 0.06em; line-height: 1.6;
    outline: none; resize: none; width: 100%;
    transition: border-color 150ms; border-radius: var(--radius);
  }
  .intake-textarea::placeholder { color: var(--t03); }
  .intake-textarea:focus { border-color: var(--amber); }
  .intake-pdf-zone {
    height: 64px; border: 1px dashed var(--l02);
    background: var(--s02);
    display: flex; align-items: center; justify-content: center; gap: 12px;
    cursor: pointer; transition: border-color 150ms, background 150ms;
    width: 100%; position: relative; overflow: hidden;
    border-radius: var(--radius);
  }
  .intake-pdf-zone:hover, .intake-pdf-zone.drag-over { border-color: var(--amber); background: var(--amber-glow); }
  .intake-pdf-icon { width: 20px; height: 24px; border: 1.5px solid var(--t02); position: relative; flex-shrink: 0; }
  .intake-pdf-icon::before {
    content: '';
    position: absolute; top: -1px; right: -1px;
    width: 8px; height: 8px;
    background: var(--s02);
    border-left: 1.5px solid var(--t02); border-bottom: 1.5px solid var(--t02);
    clip-path: polygon(0 0, 100% 100%, 0 100%);
  }
  .intake-pdf-text { font-family: var(--f-mono); font-size: 11px; color: var(--t02); letter-spacing: 0.12em; }
  .intake-pdf-text span { color: var(--amber); }
  .intake-pdf-filename { font-family: var(--f-mono); font-size: 12px; color: var(--amber); letter-spacing: 0.08em; }
  .intake-pdf-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .intake-submit-group { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; justify-content: flex-end; }
  .intake-submit-btn {
    height: 38px; padding: 0 22px;
    background: var(--amber-lo); border: 1px solid var(--l-amber);
    color: var(--amber); font-family: var(--f-cond);
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: background 150ms, border-color 150ms;
    white-space: nowrap; border-radius: var(--radius);
  }
  .intake-submit-btn:hover { background: var(--amber-mid); border-color: var(--amber); }
  .intake-submit-btn:disabled { opacity: 0.35; cursor: default; }
  .intake-divider { width: 1px; align-self: stretch; background: var(--l01); flex-shrink: 0; margin: 0 4px; }

  /* ── PATIENT RAIL ────────────────────────────── */
  .rail {
    width: 320px;
    border-right: 1px solid var(--l01);
    display: flex; flex-direction: column;
    flex-shrink: 0;
    background: var(--s00);
    position: sticky; top: 52px;
    height: calc(100vh - 52px);
    overflow: hidden;
  }
  .rail-header {
    height: 52px; padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--l01); flex-shrink: 0;
  }
  .rail-unit { font-family: var(--f-cond); font-size: 14px; color: var(--t00); letter-spacing: 0.16em; font-weight: 700; }
  .rail-time { font-family: var(--f-mono); font-size: 12px; color: var(--t02); }
  .rail-patients { flex: 1; overflow-y: auto; }

  .patient-row {
    padding: 18px 20px 16px;
    border-bottom: 1px solid var(--l00);
    border-left: 3px solid transparent;
    cursor: pointer;
    transition: background 180ms ease, border-left-color 180ms ease;
    animation: row-enter 300ms ease both;
    position: relative;
  }
  .patient-row:hover   { background: rgba(206,201,186,0.025); }
  .patient-row.active  { background: var(--s03); }
  .patient-row.critical {
    border-left-color: var(--crimson);
    animation: row-enter 300ms ease both, crit-pulse 2400ms linear infinite;
    background: rgba(196,43,43,0.025);
  }
  .patient-row.critical.active { background: rgba(196,43,43,0.05); }
  .patient-row.elevated { border-left-color: var(--amber); }
  .patient-row.elevated.active { background: rgba(212,129,10,0.04); }

  .pr-top  { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .pr-id   { font-family: var(--f-mono); font-size: 11px; color: var(--t03); letter-spacing: 0.18em; }
  .pr-score{ font-family: var(--f-cond); font-size: 38px; line-height: 1; font-weight: 700; }
  .pr-name { font-family: var(--f-cond); font-size: 22px; line-height: 1.1; color: var(--t00); font-weight: 600; text-transform: uppercase; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pr-meta { font-family: var(--f-mono); font-size: 11px; color: var(--t02); letter-spacing: 0.10em; }
  .pr-status { font-family: var(--f-cond); font-size: 11px; letter-spacing: 0.16em; font-weight: 700; margin-top: 5px; }

  /* ── WORKSPACE ───────────────────────────────── */
  .workspace { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }

  /* ── STATUS BAND ─────────────────────────────── */
  .status-band {
    height: 60px; padding: 0 28px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--l01);
    background: rgba(196,43,43,0.03);
    flex-shrink: 0; position: sticky; top: 0; z-index: 40;
  }
  .sb-meta  { display: flex; align-items: center; gap: 0; flex-wrap: nowrap; overflow: hidden; }
  .sb-item  { font-family: var(--f-mono); font-size: 12px; color: var(--t01); letter-spacing: 0.13em; white-space: nowrap; }
  .sb-name  { font-family: var(--f-cond); font-size: 20px; color: var(--t00); font-weight: 700; letter-spacing: 0.08em; white-space: nowrap; }
  .sb-sep   { width: 1px; height: 16px; background: var(--l01); margin: 0 16px; flex-shrink: 0; }
  .sb-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .sb-score { font-family: var(--f-cond); font-size: 52px; line-height: 1; font-weight: 700; }
  .sb-sev   { font-family: var(--f-mono); font-size: 12px; letter-spacing: 0.18em; font-weight: 700; }

  /* ── ALERT STRIP ─────────────────────────────── */
  .alert-strip {
    height: 38px; padding: 0 28px;
    display: flex; align-items: center; gap: 12px;
    background: rgba(196,43,43,0.05);
    border-bottom: 1px solid rgba(196,43,43,0.20);
    flex-shrink: 0; overflow: hidden;
  }
  .alert-icon {
    width: 16px; height: 16px;
    border: 1.5px solid var(--crimson);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative;
  }
  .alert-icon::before, .alert-icon::after {
    content: '';
    position: absolute; width: 9px; height: 1.5px;
    background: var(--crimson);
  }
  .alert-icon::before { transform: rotate(45deg); }
  .alert-icon::after  { transform: rotate(-45deg); }
  .alert-text {
    font-family: var(--f-mono); font-size: 12px; color: var(--crimson);
    letter-spacing: 0.12em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* ── VIEW TABS ───────────────────────────────── */
  .view-tabs { display: flex; border-bottom: 1px solid var(--l01); flex-shrink: 0; background: var(--s01); }
  .view-tab {
    padding: 0 24px; height: 42px;
    font-family: var(--f-cond); font-size: 13px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    background: transparent; border: none; border-bottom: 2px solid transparent;
    color: var(--t02); cursor: pointer;
    transition: color 150ms, border-color 150ms;
  }
  .view-tab.active { border-bottom-color: var(--amber); color: var(--amber); }

  /* ── PANELS ──────────────────────────────────── */
  .panel { background: var(--s01); border: 1px solid var(--l01); border-radius: var(--radius); overflow: hidden; }
  .panel-hd {
    height: 54px; border-bottom: 1px solid var(--l01);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 22px; flex-shrink: 0;
  }
  .panel-title { font-family: var(--f-mono); font-size: 13px; color: var(--t00); letter-spacing: 0.14em; font-weight: 700; }
  .panel-sub   { font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.12em; margin-top: 4px; }

  .section { padding: 24px 24px 0; }
  .section:last-child { padding-bottom: 32px; }
  .section-title { font-family: var(--f-cond); font-size: 11px; color: var(--t03); letter-spacing: 0.26em; text-transform: uppercase; font-weight: 600; margin-bottom: 14px; }

  .legend { display: flex; align-items: center; gap: 16px; }
  .legend-item { display: flex; align-items: center; gap: 6px; }
  .legend-line { width: 16px; height: 2px; }
  .legend-lbl  { font-family: var(--f-mono); font-size: 11px; color: var(--t02); }

  .stats-strip { display: grid; grid-template-columns: repeat(5,1fr); border-top: 1px solid var(--l01); flex-shrink: 0; }
  .stat-cell { padding: 14px 20px; border-right: 1px solid var(--l00); }
  .stat-cell:last-child { border-right: none; }
  .stat-lbl { font-family: var(--f-cond); font-size: 10px; color: var(--t02); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; }
  .stat-val { font-family: var(--f-cond); font-size: 22px; font-weight: 700; letter-spacing: 0.02em; line-height: 1; }

  .tbl-head-row { display: grid; grid-template-columns: 70px 100px 90px 90px; padding: 10px 22px; border-bottom: 1px solid var(--l01); }
  .tbl-hd { font-family: var(--f-cond); font-size: 11px; color: var(--t02); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
  .tbl-row { display: grid; grid-template-columns: 70px 100px 90px 90px; padding: 13px 22px; border-bottom: 1px solid var(--l00); align-items: center; }
  .tbl-row:last-child { border-bottom: none; }
  .tbl-param { font-family: var(--f-mono); font-size: 13px; color: var(--t01); font-weight: 700; }
  .tbl-val   { font-family: var(--f-mono); font-size: 13px; }
  .tbl-r     { text-align: right; }

  .hist-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
  .hist-cell { padding: 14px 20px; border-bottom: 1px solid var(--l00); border-right: 1px solid var(--l00); }
  .hist-cell:nth-child(3n) { border-right: none; }
  .hist-cell:nth-last-child(-n+3) { border-bottom: none; }
  .hist-key { font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.14em; margin-bottom: 5px; }
  .hist-val { font-family: var(--f-mono); font-size: 14px; color: var(--t01); font-weight: 700; }
  .hist-source { padding: 11px 20px; font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.10em; border-top: 1px solid var(--l00); }

  .two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  .arc-wrap { display: flex; flex-direction: column; align-items: center; padding: 32px 22px 24px; border-bottom: 1px solid var(--l01); flex-shrink: 0; }
  .arc-label { font-family: var(--f-cond); font-size: 11px; color: var(--t02); letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; align-self: flex-start; margin-bottom: 16px; }
  .arc-svg-root { position: relative; }
  .arc-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -44%); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; pointer-events: none; }
  .arc-score { font-family: var(--f-mono); font-size: 80px; font-weight: 700; line-height: 1; letter-spacing: -0.04em; animation: score-pulse 2400ms linear infinite; }
  .arc-sev   { font-family: var(--f-cond); font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; }
  .arc-idx   { font-family: var(--f-cond); font-size: 10px; color: var(--t02); text-transform: uppercase; letter-spacing: 0.22em; }

  .inf-wrap  { padding: 20px 22px; flex: 1; }
  .inf-title { font-family: var(--f-cond); font-size: 12px; color: var(--t00); letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
  .inf-sub   { font-family: var(--f-mono); font-size: 10px; color: var(--t02); letter-spacing: 0.12em; margin-bottom: 18px; }
  .inf-row   { display: flex; align-items: center; gap: 10px; margin-bottom: 13px; }
  .inf-name  { font-family: var(--f-mono); font-size: 12px; color: var(--t01); width: 100px; flex-shrink: 0; }
  .inf-bar-bg   { flex: 1; height: 9px; background: rgba(212,129,10,0.12); border-radius: 1px; }
  .inf-bar-fill { height: 100%; background: var(--amber); border-radius: 1px; transition: width 600ms ease; }
  .inf-pct   { font-family: var(--f-mono); font-size: 12px; color: var(--t01); width: 30px; text-align: right; flex-shrink: 0; }
  .inf-footer { display: flex; flex-direction: column; gap: 6px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--l00); }
  .inf-frow   { display: flex; gap: 8px; font-family: var(--f-mono); font-size: 11px; }
  .inf-fkey   { color: var(--t02); min-width: 140px; flex-shrink: 0; }
  .inf-fval   { color: var(--t01); }

  .vital-stream { border-bottom: 1px solid var(--l01); padding: 0 0 6px; }
  .vital-stream:last-child { border-bottom: none; }
  .vs-hd { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px 10px; }
  .vs-left { display: flex; align-items: center; gap: 8px; }
  .vs-vname { font-family: var(--f-cond); font-size: 14px; color: var(--t01); letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; }
  .vs-unit  { font-family: var(--f-mono); font-size: 11px; color: var(--t03); }
  .vs-right { display: flex; align-items: center; gap: 6px; }
  .vs-val   { font-family: var(--f-mono); font-size: 24px; font-weight: 700; }
  .vs-trend { font-family: var(--f-mono); font-size: 14px; }
  .vs-chart  { height: 80px; padding: 6px 16px; }
  .vs-times  { display: flex; justify-content: space-between; padding: 2px 20px 4px; }
  .vs-time   { font-family: var(--f-mono); font-size: 9px; color: var(--t03); }

  .timeline { height: 80px; border-top: 1px solid var(--l01); padding: 0 28px; display: flex; flex-direction: column; justify-content: center; gap: 0; flex-shrink: 0; position: relative; background: var(--s01); overflow: hidden; }
  .tl-track { position: relative; width: 100%; height: 1px; background: var(--l01); }
  .tl-now { position: absolute; right: 0; top: -11px; font-family: var(--f-mono); font-size: 10px; color: var(--amber); letter-spacing: 0.10em; }
  .tl-now-cursor { display: inline-block; width: 1px; height: 12px; background: var(--amber); vertical-align: middle; margin-left: 4px; animation: amber-blink 800ms linear infinite; }
  .tl-events { position: relative; width: 100%; height: 52px; }
  .tl-event  { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 4px; transform: translateX(-50%); }
  .tl-dot    { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid; margin-top: -4px; }
  .tl-etime  { font-family: var(--f-mono); font-size: 9px; color: var(--t02); }
  .tl-elbl   { font-family: var(--f-mono); font-size: 9px; text-align: center; line-height: 1.4; white-space: pre; }

  .bottombar { height: 38px; border-top: 1px solid var(--l01); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; background: rgba(6,8,12,0.95); }
  .bb-keys { display: flex; gap: 20px; align-items: center; }
  .bb-key  { font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.12em; }
  .bb-sep  { width: 1px; height: 12px; background: var(--l01); }
  .bb-right { display: flex; align-items: center; gap: 8px; }
  .bb-dot  { width: 7px; height: 7px; background: var(--amber); }
  .bb-live { font-family: var(--f-mono); font-size: 11px; color: var(--amber); letter-spacing: 0.12em; }

  .ct-box { background: var(--s02); border: 1px solid var(--l02); padding: 12px 16px; min-width: 130px; border-radius: var(--radius); }
  .ct-time { font-family: var(--f-mono); font-size: 10px; color: var(--t02); margin-bottom: 10px; letter-spacing: 0.10em; }
  .ct-row  { font-family: var(--f-mono); font-size: 12px; display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
  .ct-lbl  { color: var(--t02); }
  .ct-val  { font-weight: 700; }

  .no-patient { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--t03); }
  .no-patient-icon { font-size: 36px; opacity: 0.3; }
  .no-patient-text { font-family: var(--f-cond); font-size: 14px; letter-spacing: 0.20em; text-transform: uppercase; }

  .awaiting-vitals { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--t03); padding: 48px; text-align: center; }
  .awaiting-vitals-title { font-family: var(--f-cond); font-size: 16px; letter-spacing: 0.20em; text-transform: uppercase; color: var(--amber); }
  .awaiting-vitals-sub { font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.12em; color: var(--t03); line-height: 1.8; }

  /* ── RAIL MOBILE TOGGLE — hidden on desktop ── */
  .rail-mobile-toggle {
    display: none;
  }

  /* ══════════════════════════════════════════════
     MOBILE RESPONSIVE — ≤768px
  ══════════════════════════════════════════════ */
  @media (max-width: 768px) {

    /* ── TOPBAR ── */
    .topbar { padding: 0 14px; }
    .topbar-mid { display: none; }
    .topbar-right { gap: 10px; }
    .tb-label { font-size: 9px; letter-spacing: 0.10em; }
    .tb-vigil { font-size: 16px; }
    .tb-div   { display: none; }

    /* ── EMERGENCY BANNER ── */
    .emergency-banner {
      top: 52px;
      height: auto;
      min-height: 48px;
      padding: 10px 14px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .emergency-banner-left { flex-wrap: wrap; gap: 8px; }
    .emergency-banner-message { width: 100%; white-space: normal; }
    .emergency-banner-score { font-size: 22px; }
    .emergency-ack-btn { height: 30px; padding: 0 14px; font-size: 12px; }

    /* ── INTAKE BAR ── */
    .intake-bar-collapsed { padding: 0 14px; }
    .intake-toggle-hint { display: none; }
    .intake-form-wrap {
      flex-direction: column;
      gap: 14px;
      padding: 16px 14px 18px;
    }
    .intake-divider { width: 100%; height: 1px; align-self: auto; margin: 0; }
    .intake-text-input { width: 100%; }
    .intake-field-group { width: 100%; }
    .intake-history-group { width: 100%; }
    .intake-submit-group { width: 100%; }
    .intake-submit-btn { width: 100%; }

    /* ── RAIL TOGGLE BUTTON ── */
    .rail-mobile-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 40px;
      padding: 0 14px;
      border-bottom: 1px solid var(--l01);
      background: var(--s01);
      cursor: pointer;
      flex-shrink: 0;
    }
    .rail-mobile-toggle-label {
      font-family: var(--f-cond);
      font-size: 12px;
      color: var(--t02);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 600;
      flex: 1;
    }
    .rail-mobile-toggle-count {
      font-family: var(--f-mono);
      font-size: 11px;
      color: var(--amber);
      letter-spacing: 0.12em;
    }
    .rail-mobile-toggle-arrow {
      font-family: var(--f-mono);
      font-size: 12px;
      color: var(--t03);
      transition: transform 200ms;
    }
    .rail-mobile-toggle-arrow.open { transform: rotate(180deg); }

    /* ── BODY LAYOUT ── */
    .vigil-body { flex-direction: column; }

    /* ── RAIL — collapsed by default, toggled open ── */
    .rail {
      width: 100%;
      height: auto;
      max-height: 0;
      overflow: hidden;
      position: static;
      border-right: none;
      border-bottom: 1px solid var(--l01);
      transition: max-height 300ms cubic-bezier(0,0,0.2,1);
    }
    .rail.rail-open {
      max-height: 280px;
      overflow-y: hidden;
    }
    .rail-header { padding: 0 14px; height: 44px; }
    .rail-patients {
      flex: none;
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      overflow-y: hidden;
      height: 236px;
    }
    .patient-row {
      min-width: 150px;
      max-width: 180px;
      border-bottom: none;
      border-left: none;
      border-top: 3px solid transparent;
      flex-shrink: 0;
    }
    .patient-row.critical {
      border-top-color: var(--crimson);
      border-left-color: transparent;
      animation: row-enter 300ms ease both, crit-pulse 2400ms linear infinite;
    }
    .patient-row.elevated {
      border-top-color: var(--amber);
      border-left-color: transparent;
    }
    .pr-score { font-size: 28px; }
    .pr-name  { font-size: 16px; }

    /* ── WORKSPACE ── */
    .workspace { min-width: 0; }

    /* ── STATUS BAND ── */
    .status-band {
      height: auto;
      min-height: 48px;
      padding: 8px 14px;
      flex-wrap: wrap;
      gap: 4px;
      position: static;
    }
    .sb-meta { flex-wrap: wrap; gap: 4px; overflow: visible; }
    .sb-sep  { display: none; }
    .sb-score { font-size: 32px; }
    .sb-sev   { font-size: 10px; }
    .sb-item  { font-size: 11px; }

    /* ── ALERT STRIP ── */
    .alert-strip { padding: 0 14px; height: auto; min-height: 38px; padding-block: 8px; }

    /* ── VIEW TABS ── */
    .view-tab { padding: 0 12px; font-size: 11px; letter-spacing: 0.10em; }

    /* ── SECTION PADDING ── */
    .section { padding: 12px 12px 0; }
    .section:last-child { padding-bottom: 18px; }

    /* ── GRIDS ── */
    .two-col   { grid-template-columns: 1fr !important; gap: 12px; }
    .three-col { grid-template-columns: 1fr !important; gap: 12px; }

    /* ── STATS STRIP ── */
    .stats-strip { grid-template-columns: repeat(3, 1fr) !important; }
    .stat-cell { padding: 10px 12px; }
    .stat-val  { font-size: 16px; }
    .stat-lbl  { font-size: 9px; }

    /* ── TEMPORAL TABLE ── */
    .tbl-head-row { grid-template-columns: 50px 76px 66px 66px; padding: 8px 12px; }
    .tbl-row      { grid-template-columns: 50px 76px 66px 66px; padding: 10px 12px; }
    .tbl-param    { font-size: 11px; }
    .tbl-val      { font-size: 11px; }

    /* ── HISTORY GRID ── */
    .hist-grid { grid-template-columns: 1fr 1fr !important; }
    .hist-cell:nth-child(3n)        { border-right: 1px solid var(--l00); }
    .hist-cell:nth-child(2n)        { border-right: none; }
    .hist-cell:nth-last-child(-n+2) { border-bottom: none; }
    .hist-cell:nth-last-child(3)    { border-bottom: 1px solid var(--l00); }
    .hist-cell { padding: 12px 14px; }

    /* ── PANEL HEADER ── */
    .panel-hd { padding: 0 14px; height: auto; min-height: 44px; flex-wrap: wrap; gap: 8px; padding-block: 10px; }
    .panel-title { font-size: 11px; }
    .legend   { flex-wrap: wrap; gap: 8px; }

    /* ── MAIN CHART HEIGHT ── */
    .main-chart-height { height: 220px !important; }

    /* ── ARC ── */
    .arc-score { font-size: 56px !important; }
    .arc-wrap  { padding: 18px 14px 14px; }

    /* ── INFERENCE ── */
    .inf-wrap  { padding: 16px 14px; }
    .inf-name  { width: 80px; font-size: 11px; }
    .inf-fkey  { min-width: 110px; font-size: 10px; }
    .inf-fval  { font-size: 10px; }

    /* ── VITAL STREAM ── */
    .vs-hd  { padding: 10px 14px 8px; }
    .vs-val { font-size: 20px; }
    .vs-chart { height: 60px; padding: 4px 10px; }
    .vs-times { padding: 2px 14px 4px; }

    /* ── TIMELINE ── */
    .timeline { height: 64px; padding: 0 14px; }

    /* ── BOTTOM BAR ── */
    .bottombar { padding: 0 14px; }
    .bb-keys   { gap: 8px; overflow: hidden; }
    .bb-key    { font-size: 9px; letter-spacing: 0.06em; }
    .bb-sep    { display: none; }
    .bb-right  { gap: 6px; }
    .bb-live   { font-size: 9px; }
  }

  @media (max-width: 480px) {
    .stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
    .tbl-head-row { grid-template-columns: 42px 64px 56px 56px; padding: 8px 10px; }
    .tbl-row      { grid-template-columns: 42px 64px 56px 56px; padding: 9px 10px; }
    .bb-keys { display: none; }
    .arc-score { font-size: 44px !important; }
    .view-tab { padding: 0 10px; font-size: 10px; }
    .topbar-right .tb-crit { display: none; }
    .tb-amber { display: none; }
    .pr-score { font-size: 24px; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function severityToStatus(severity: string): "CRITICAL" | "ELEVATED" | "STABLE" {
  if (severity === "high") return "CRITICAL";
  if (severity === "medium") return "ELEVATED";
  return "STABLE";
}
function riskToScore(riskScore: number): number {
  return Math.round(Math.min(100, Math.max(0, riskScore)));
}
function buildTemporalRows(hist: any[]) {
  if (!hist || hist.length < 2) return [];
  const first = hist[0], last = hist[hist.length - 1];
  const hours = hist.length > 1 ? hist.length - 1 : 1;
  const slope = (a: number, b: number) => ((b - a) / hours).toFixed(1);
  const delta = (a: number, b: number, unit: string) => {
    const d = b - a;
    return (d >= 0 ? "+" : "") + d.toFixed(0) + unit;
  };
  const accel = (vals: number[]) => {
    if (vals.length < 3) return "– STB";
    const half = Math.floor(vals.length / 2);
    const r1 = (vals[half] - vals[0]) / half;
    const r2 = (vals[vals.length - 1] - vals[half]) / (vals.length - 1 - half);
    return r2 > r1 * 1.15 ? "↑ ACC" : "– STB";
  };
  const col = (v: number, warn: number, crit: number) =>
    v >= crit ? "var(--crimson)" : v >= warn ? "var(--amber)" : "var(--t01)";
  const hrs  = hist.map((v: any) => v.heart_rate ?? 0);
  const spo2 = hist.map((v: any) => v.spo2 ?? 0);
  const temp = hist.map((v: any) => v.temperature ?? 0);
  const resp = hist.map((v: any) => v.respiratory_rate ?? 0);
  const sbp  = hist.map((v: any) => v.systolic_bp ?? 0);
  return [
    { param:"HR",   slope:`${slope(first.heart_rate??0,last.heart_rate??0)}/h`,   accel:accel(hrs),  delta:delta(first.heart_rate??0,last.heart_rate??0,"BPM"), sC:col(Math.abs((last.heart_rate??0)-(first.heart_rate??0)),10,20), aC:accel(hrs)==="↑ ACC"?"var(--amber)":"var(--t02)", dC:col(Math.abs((last.heart_rate??0)-(first.heart_rate??0)),10,20) },
    { param:"SPO2", slope:`${slope(first.spo2??0,last.spo2??0)}/h`,               accel:accel(spo2), delta:delta(first.spo2??0,last.spo2??0,"PCT"),             sC:col(Math.abs((last.spo2??0)-(first.spo2??0)),2,5),             aC:accel(spo2)==="↑ ACC"?"var(--amber)":"var(--t02)", dC:col(Math.abs((last.spo2??0)-(first.spo2??0)),2,5) },
    { param:"TEMP", slope:`${slope(first.temperature??0,last.temperature??0)}/h`, accel:accel(temp), delta:delta(first.temperature??0,last.temperature??0,"°C"),sC:col(Math.abs((last.temperature??0)-(first.temperature??0)),0.5,1.5), aC:accel(temp)==="↑ ACC"?"var(--amber)":"var(--t02)", dC:col(Math.abs((last.temperature??0)-(first.temperature??0)),0.5,1.5) },
    { param:"RESP", slope:`${slope(first.respiratory_rate??0,last.respiratory_rate??0)}/h`, accel:accel(resp), delta:delta(first.respiratory_rate??0,last.respiratory_rate??0,"RPM"), sC:col(Math.abs((last.respiratory_rate??0)-(first.respiratory_rate??0)),4,8), aC:accel(resp)==="↑ ACC"?"var(--amber)":"var(--t02)", dC:col(Math.abs((last.respiratory_rate??0)-(first.respiratory_rate??0)),4,8) },
    { param:"SBP",  slope:`${slope(first.systolic_bp??0,last.systolic_bp??0)}/h`, accel:accel(sbp),  delta:delta(first.systolic_bp??0,last.systolic_bp??0,"MM"),sC:col(Math.abs((last.systolic_bp??0)-(first.systolic_bp??0)),10,20), aC:accel(sbp)==="↑ ACC"?"var(--amber)":"var(--t02)", dC:col(Math.abs((last.systolic_bp??0)-(first.systolic_bp??0)),10,20) },
  ];
}
function buildHistoryCells(patient: Patient): [string,string][] {
  return [
    ["AGE",      patient.age ? `${patient.age}` : "–"],
    ["DIABETES", patient.diabetes ? "YES" : "NO"],
    ["BMI",      patient.bmi ? `${patient.bmi}` : "–"],
    ["SMOKER",   patient.smoker ? "YES" : "NO"],
    ["HTN",      patient.baseline_sbp && patient.baseline_sbp > 130 ? "YES" : "NO"],
    ["HEART DIS",patient.heart_disease ? "YES" : "NO"],
    ["HR₀",      patient.baseline_hr  ? `${patient.baseline_hr}BPM`  : "–"],
    ["SBP₀",     patient.baseline_sbp ? `${patient.baseline_sbp}MM`  : "–"],
    ["DBP₀",     patient.baseline_dbp ? `${patient.baseline_dbp}MM`  : "–"],
  ];
}
function buildInference(explanation: string[]): { name: string; pct: number }[] {
  if (!explanation || explanation.length === 0) return [];
  const base = [33,25,18,14,10];
  return explanation.map((e, i) => ({
    name: e.split(" ").slice(0,2).join("_").toUpperCase().slice(0,12),
    pct: base[i] ?? Math.max(5, 30 - i * 6),
  }));
}
function buildTimelineEvents(alerts: DashboardAlert[]) {
  const leftPcts = ["4%","40%","74%"];
  return alerts.slice(0,3).map((a,i) => {
    const t = a.timestamp ? new Date(a.timestamp).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) : "--:--";
    const color = a.severity==="high" ? "var(--crimson)" : a.severity==="medium" ? "var(--amber)" : "var(--t02)";
    const label = a.severity==="high" ? `CRIT\nALRT#${i+1}` : a.severity==="medium" ? `ELEV\nALRT#${i+1}` : `INFO\nALRT#${i+1}`;
    return { t, label, color, left: leftPcts[i] ?? `${20+i*30}%` };
  });
}
function scoreColor(r: number) {
  if (r >= 90) return "var(--crimson)";
  if (r >= 50) return "var(--amber)";
  return "var(--t02)";
}
function patientRowClass(riskScore: number, status: string, activeId: string, patientId: string) {
  const base = patientId === activeId ? " active" : "";
  if (riskScore >= 90 || status === "CRITICAL") return "patient-row critical" + base;
  if (riskScore >= 50 || status === "ELEVATED") return "patient-row elevated" + base;
  return "patient-row" + base;
}
function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const upd = () => {
      const now = new Date();
      setTime([String(now.getHours()).padStart(2,"0"),String(now.getMinutes()).padStart(2,"0"),String(now.getSeconds()).padStart(2,"0")].join(":"));
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ═══════════════════════════════════════════════════════════════
   CHART DATA GENERATORS
═══════════════════════════════════════════════════════════════ */
function makeChartDataFromHistory(hist: any[]) {
  if (!hist || hist.length === 0) return [];
  return hist.map((v: any) => {
    const ts = v.timestamp ? new Date(v.timestamp) : new Date();
    const t = `${String(ts.getHours()).padStart(2,"0")}:${String(ts.getMinutes()).padStart(2,"0")}`;
    return { t, hr: v.heart_rate??0, spo2: v.spo2??0, temp: v.temperature??0, resp: v.respiratory_rate??0, sbp: v.systolic_bp??0 };
  });
}
function makeChartData(base: number, slope: number, freq: number, amp: number, n=30) {
  const out = [];
  for (let i=0;i<n;i++) {
    const totalMins=i*10, h=Math.floor((12*60+56+totalMins)/60)%24, m=(56+totalMins)%60;
    const t=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    out.push({t,hr:Math.round(base+i*slope+Math.sin(i*freq)*amp+Math.random()*1.2),spo2:Math.round(98-i*0.19-Math.abs(Math.sin(i*0.31))*1.2),temp:+(36.6+i*0.056+Math.sin(i*0.22)*0.11).toFixed(1),resp:Math.round(18+i*0.21+Math.sin(i*0.48)*1.1),sbp:Math.round(128-i*0.42+Math.sin(i*0.29)*2.0)});
  }
  return out;
}
function makeVStream(base: number, slope: number, freq: number, amp: number, n=20) {
  return Array.from({length:n},(_,i)=>{
    const totalMins=i*14,h=Math.floor((12*60+14+totalMins)/60)%24,m=(14+totalMins)%60;
    const t=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    return {t,v:Math.round(base+i*slope+Math.sin(i*freq)*amp)};
  });
}
function makeVStreamFromHistory(hist: any[], key: string) {
  if (!hist || hist.length===0) return [];
  return hist.map((v: any)=>{
    const ts=v.timestamp?new Date(v.timestamp):new Date();
    const t=`${String(ts.getHours()).padStart(2,"0")}:${String(ts.getMinutes()).padStart(2,"0")}`;
    return {t, v:v[key]??0};
  });
}

/* ═══════════════════════════════════════════════════════════════
   EMERGENCY OVERLAY
═══════════════════════════════════════════════════════════════ */
function EmergencyOverlay({
  active,
  riskScore,
  alertMessage,
  onAck,
}: {
  active: boolean;
  riskScore: number;
  alertMessage: string;
  onAck: () => void;
}) {
  if (!active) return null;
  return (
    <>
      <div className="emergency-overlay">
        <div className="emergency-scan-line" />
        <div className="emergency-vignette" />
        <div className="emergency-corner emergency-corner--tl" />
        <div className="emergency-corner emergency-corner--tr" />
        <div className="emergency-corner emergency-corner--bl" />
        <div className="emergency-corner emergency-corner--br" />
      </div>
      <div className="emergency-banner">
        <div className="emergency-banner-left">
          <div className="emergency-banner-icon" />
          <span className="emergency-banner-label">⊠ CRITICAL ALERT</span>
          <span className="emergency-banner-message">{alertMessage}</span>
        </div>
        <div className="emergency-banner-right">
          <span className="emergency-banner-score">{riskScore}</span>
          <button className="emergency-ack-btn" onClick={onAck}>
            ✓ ACKNOWLEDGE
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PATIENT INTAKE BAR
═══════════════════════════════════════════════════════════════ */
function PatientIntakeBar({ onRegistered }: { onRegistered?: () => void }) {
  const [open, setOpen] = useState(false);
  const [historyMode, setHistoryMode] = useState("text");
  const [patientId, setPatientId] = useState("");
  const [historyText, setHistoryText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = !submitting && patientId.trim().length > 0 && (historyMode === "text" ? historyText.trim().length > 0 : pdfFile !== null);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setPdfFile(f);
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPdfFile(f);
  }
  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true); setError(null);
    try {
      const payload: RegisterPatientPayload = { patient_id: patientId.trim(), history_text: historyMode === "text" ? historyText.trim() : (pdfFile?.name ?? "") };
      await registerPatient(payload);
      setPatientId(""); setHistoryText(""); setPdfFile(null); setOpen(false);
      onRegistered?.();
    } catch (err: any) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="intake-bar">
      <div className="intake-bar-collapsed" onClick={() => setOpen(o => !o)}>
        <div className="intake-toggle-icon">
          <span style={{fontFamily:"var(--f-mono)",fontSize:12,color:"var(--amber)",lineHeight:1}}>{open?"−":"+"}</span>
        </div>
        <span className="intake-toggle-label">New Patient Intake</span>
        <span className="intake-toggle-hint">{open ? "CLICK TO COLLAPSE" : "ENTER PATIENT ID · ATTACH HISTORY"}</span>
      </div>
      {open && (
        <div className="intake-form-wrap" onClick={e => e.stopPropagation()}>
          <div className="intake-field-group">
            <span className="intake-field-label">Patient ID</span>
            <input className="intake-text-input" type="text" placeholder="P-009" value={patientId} onChange={e => setPatientId(e.target.value)} spellCheck={false} autoComplete="off" />
            {error && <span style={{fontFamily:"var(--f-mono)",fontSize:10,color:"var(--crimson)",letterSpacing:"0.10em"}}>{error}</span>}
          </div>
          <div className="intake-divider" />
          <div className="intake-history-group">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span className="intake-field-label">Patient History</span>
              <div className="intake-history-tabs">
                <button className={`intake-tab${historyMode==="text"?" active":""}`} onClick={()=>setHistoryMode("text")}>TEXT</button>
                <button className={`intake-tab${historyMode==="pdf"?" active":""}`}  onClick={()=>setHistoryMode("pdf")}>PDF</button>
              </div>
            </div>
            {historyMode === "text" ? (
              <textarea className="intake-textarea" placeholder="Enter patient history, comorbidities, medications, prior admissions…" value={historyText} onChange={e => setHistoryText(e.target.value)} spellCheck={false} />
            ) : (
              <div className={`intake-pdf-zone${dragOver?" drag-over":""}`} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop}>
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="intake-pdf-input" onChange={handleFileChange} />
                {pdfFile ? <span className="intake-pdf-filename">▪ {pdfFile.name}</span> : (<><div className="intake-pdf-icon" /><span className="intake-pdf-text">DROP PDF · OR <span>CLICK TO BROWSE</span></span></>)}
              </div>
            )}
          </div>
          <div className="intake-divider" />
          <div className="intake-submit-group">
            <button className="intake-submit-btn" onClick={handleSubmit} disabled={!canSubmit}>{submitting ? "REGISTERING…" : "REGISTER ▶"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════════════════════ */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string | number }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};
  return (
    <div className="ct-box">
      <div className="ct-time">{label}</div>
      {[["HR",d.hr,"var(--amber)"],["SPO2",d.spo2,"var(--crimson)"],["TEMP",d.temp,"var(--t01)"],["RESP",d.resp,"var(--t02)"],["SBP",d.sbp,"var(--t02)"]].map(([k,v,c])=>(
        <div className="ct-row" key={k}><span className="ct-lbl">{k}:</span><span className="ct-val" style={{color:c}}>{v}</span></div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   THREAT ARC
═══════════════════════════════════════════════════════════════ */
function ThreatArc({ score, size=250 }: { score: number; size?: number }) {
  const cx=size/2, cy=size/2, r=size*0.42;
  const TOTAL_DEG=210, START_DEG=195;
  function pxy(deg: number) { const rad=((deg-90)*Math.PI)/180; return {x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)}; }
  function arcPath(sd: number, ed: number) { const s=pxy(sd),e=pxy(ed),la=ed-sd>180?1:0; return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r},0,${la},1,${e.x.toFixed(2)},${e.y.toFixed(2)}`; }
  const endDeg=START_DEG+(score/100)*TOTAL_DEG, ep=pxy(endDeg);
  const color=score>=90?"var(--crimson)":score>=50?"var(--amber)":"var(--t02)";
  const circ=2*Math.PI*r*(TOTAL_DEG/360), filled=(score/100)*circ;
  const severity=score>=90?"CRITICAL":score>=50?"ELEVATED":"STABLE";
  return (
    <div className="arc-svg-root" style={{width:size,height:size}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={arcPath(START_DEG,START_DEG+TOTAL_DEG)} fill="none" stroke="var(--l01)" strokeWidth={1.5} strokeLinecap="square" />
        <path d={arcPath(START_DEG,endDeg)} fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="square" style={{strokeDasharray:circ,strokeDashoffset:circ-filled,transition:"stroke-dashoffset 900ms ease-out"}} />
        <rect x={ep.x-5} y={ep.y-5} width={10} height={10} fill={color} />
        {[0,30,60,100].map(tick=>{const deg=START_DEG+(tick/100)*TOTAL_DEG,p=pxy(deg),off={x:(p.x-cx)*0.18,y:(p.y-cy)*0.18};return(<text key={tick} x={p.x+off.x} y={p.y+off.y} textAnchor="middle" dominantBaseline="middle" fill="var(--t02)" fontSize={10} fontFamily="var(--f-mono)" letterSpacing="0.04em">{tick}</text>);})}
      </svg>
      <div className="arc-center">
        <div className="arc-score" style={{color}}>{score}</div>
        <div className="arc-sev" style={{color}}>{severity}</div>
        <div className="arc-idx">RISK INDEX</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VITAL STREAM
═══════════════════════════════════════════════════════════════ */
function VitalStream({ name, unit, color, currentVal, trendDir, data, base, slope, freq, amp }: { name:string;unit:string;color:string;currentVal:number;trendDir:"up"|"down"|"flat";data?:{t:string;v:number}[];base:number;slope:number;freq:number;amp:number }) {
  const streamData = data && data.length > 0 ? data : makeVStream(base,slope,freq,amp);
  const tS=streamData[0]?.t??"", tM=streamData[Math.floor(streamData.length/2)]?.t??"", tE=streamData[streamData.length-1]?.t??"";
  const trendIcon = trendDir==="up"?"▲":trendDir==="down"?"▼":"–";
  return (
    <div className="vital-stream">
      <div className="vs-hd">
        <div className="vs-left"><span className="vs-vname">{name}</span><span className="vs-unit">┊ {unit}</span></div>
        <div className="vs-right"><span className="vs-val" style={{color}}>{currentVal}</span><span className="vs-trend" style={{color}}>{trendIcon}</span></div>
      </div>
      <div className="vs-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={streamData}><Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} dot={false} isAnimationActive={false} /></LineChart>
        </ResponsiveContainer>
      </div>
      <div className="vs-times"><span className="vs-time">{tS}</span><span className="vs-time">{tM}</span><span className="vs-time">{tE} ▶</span></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPORAL TABLE
═══════════════════════════════════════════════════════════════ */
function TemporalTable({ rows }: { rows: any[] }) {
  return (
    <>
      <div className="panel-hd"><div><div className="panel-title">TEMPORAL ANALYSIS</div><div className="panel-sub">WINDOW: 6 RDG · 6HR EQUIV</div></div></div>
      <div className="tbl-head-row"><span className="tbl-hd">PARAM</span><span className="tbl-hd">SLOPE</span><span className="tbl-hd">ACCEL</span><span className="tbl-hd tbl-r">ΔBASE</span></div>
      {rows.length === 0 ? (
        <div style={{padding:"18px 22px",fontFamily:"var(--f-mono)",fontSize:11,color:"var(--t03)",letterSpacing:"0.12em"}}>AWAITING 6 READINGS FOR ANALYSIS</div>
      ) : rows.map(r=>(
        <div className="tbl-row" key={r.param}>
          <span className="tbl-param">{r.param}</span>
          <span className="tbl-val" style={{color:r.sC}}>{r.slope}</span>
          <span className="tbl-val" style={{color:r.aC}}>{r.accel}</span>
          <span className="tbl-val tbl-r" style={{color:r.dC}}>{r.delta}</span>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HISTORY BRIEF
═══════════════════════════════════════════════════════════════ */
function HistoryBrief({ cells }: { cells: [string,string][] }) {
  return (
    <>
      <div className="panel-hd"><div className="panel-title">HISTORY BRIEF</div></div>
      <div className="hist-grid">{cells.map(([k,v])=><div className="hist-cell" key={k}><div className="hist-key">{k}</div><div className="hist-val">{v}</div></div>)}</div>
      <div className="hist-source">SOURCE: GEMINI EXTRACT · PROCESSED VIA BACKEND</div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CHART
═══════════════════════════════════════════════════════════════ */
function MainChart({ patientName, chartData }: { patientName:string; chartData:any[] }) {
  return (
    <div className="panel">
      <div className="panel-hd">
        <div><div className="panel-title">COMPREHENSIVE VITAL ANALYSIS</div><div className="panel-sub">PATIENT: {patientName} · SYNCHRONIZED MULTI-PARAMETER VIEW</div></div>
        <div className="legend">
          {[["HR","var(--amber)"],["SPO2","var(--crimson)"],["TEMP","var(--t01)"],["RESP","var(--t02)"],["SBP","var(--t02)"]].map(([l,c])=>(
            <div className="legend-item" key={l}><div className="legend-line" style={{background:c}} /><span className="legend-lbl">{l}</span></div>
          ))}
        </div>
      </div>
      <div className="main-chart-height" style={{height:360,padding:"16px 20px 10px"}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{top:6,right:8,bottom:0,left:0}}>
            <defs>
              <linearGradient id="fillHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4810A" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#D4810A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{fontFamily:"var(--f-mono)",fontSize:10,fill:"var(--t02)"}} axisLine={{stroke:"var(--l01)"}} tickLine={false} interval={4} />
            <YAxis tick={{fontFamily:"var(--f-mono)",fontSize:10,fill:"var(--t02)"}} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="hr" stroke="#D4810A" strokeWidth={2} fill="url(#fillHr)" dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="stats-strip">
        {[["HR VOLATILITY","HIGH","var(--crimson)"],["SPO2 TREND","DECLINING","var(--crimson)"],["TEMP STABILITY","UNSTABLE","var(--amber)"],["RESP PATTERN","IRREGULAR","var(--amber)"],["BP VARIANCE","NORMAL","var(--t01)"]].map(([lbl,val,col])=>(
          <div className="stat-cell" key={lbl}><div className="stat-lbl">{lbl}</div><div className="stat-val" style={{color:col}}>{val}</div></div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INFERENCE PANEL
═══════════════════════════════════════════════════════════════ */
function InferencePanel({ riskScore, inference, clock }: { riskScore:number; inference:{name:string;pct:number}[]; clock:string }) {
  return (
    <div className="panel" style={{display:"flex",flexDirection:"column"}}>
      <div className="arc-wrap">
        <span className="arc-label">THREAT ARC</span>
        <ThreatArc score={riskScore} size={250} />
      </div>
      <div className="inf-wrap">
        <div className="inf-title">INFERENCE PANEL</div>
        <div className="inf-sub">PRIMARY DRIVERS</div>
        {inference.length === 0 ? (
          <div style={{fontFamily:"var(--f-mono)",fontSize:11,color:"var(--t03)",letterSpacing:"0.10em",lineHeight:1.8}}>AWAITING AI INFERENCE<br />NEED 6 VITALS READINGS</div>
        ) : inference.map((d: any)=>(
          <div className="inf-row" key={d.name}>
            <span className="inf-name">{d.name}</span>
            <div className="inf-bar-bg"><div className="inf-bar-fill" style={{width:`${Math.min(100,d.pct*3.0)}%`}} /></div>
            <span className="inf-pct">{d.pct}%</span>
          </div>
        ))}
        <div className="inf-footer">
          <div className="inf-frow"><span className="inf-fkey">MODEL CONFIDENCE:</span><span className="inf-fval">87.4%</span></div>
          <div className="inf-frow"><span className="inf-fkey">WINDOW:</span><span className="inf-fval">6 RDG / 6HR</span></div>
          <div className="inf-frow"><span className="inf-fkey">UPDATED:</span><span className="inf-fval">{clock}</span></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VITAL STREAMS PANEL
═══════════════════════════════════════════════════════════════ */
function VitalStreamsPanel({ latestVitals, historicalVitals, hrColor }: { latestVitals:any; historicalVitals:any[]; hrColor:string }) {
  const hrData   = makeVStreamFromHistory(historicalVitals, "heart_rate");
  const spo2Data = makeVStreamFromHistory(historicalVitals, "spo2");
  const tempData = makeVStreamFromHistory(historicalVitals, "temperature");
  const respData = makeVStreamFromHistory(historicalVitals, "respiratory_rate");
  const sbpData  = makeVStreamFromHistory(historicalVitals, "systolic_bp");
  const streams = [
    {name:"HR",   unit:"BPM",color:hrColor,         val:latestVitals?.heart_rate??0,      trendDir:"up"   as const,data:hrData,   b:80,  s:0.3,   f:0.4,  a:2   },
    {name:"SPO2", unit:"PCT",color:"var(--crimson)", val:latestVitals?.spo2??0,            trendDir:"down" as const,data:spo2Data, b:98,  s:-0.19, f:0.31, a:1.2 },
    {name:"TEMP", unit:"°C", color:"var(--crimson)", val:latestVitals?.temperature??0,     trendDir:"up"   as const,data:tempData, b:36.6,s:0.056, f:0.22, a:0.11},
    {name:"RESP", unit:"RPM",color:"var(--amber)",   val:latestVitals?.respiratory_rate??0,trendDir:"up"   as const,data:respData, b:18,  s:0.21,  f:0.48, a:1.0 },
    {name:"SBP",  unit:"MM", color:"var(--t01)",     val:latestVitals?.systolic_bp??0,     trendDir:"down" as const,data:sbpData,  b:128, s:-0.42, f:0.29, a:1.8 },
  ];
  return (
    <div className="panel">
      <div className="panel-hd"><div className="panel-title">VITAL STREAM CHARTS</div></div>
      {streams.map(s=><VitalStream key={s.name} name={s.name} unit={s.unit} color={s.color} currentVal={s.val} trendDir={s.trendDir} data={s.data} base={s.b} slope={s.s} freq={s.f} amp={s.a} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHART VIEW
═══════════════════════════════════════════════════════════════ */
function ChartView({ patientName, chartData, temporalRows, historyCells, latestVitals, historicalVitals, riskScore, inference, hrColor, clock }: any) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      <div className="section"><MainChart patientName={patientName} chartData={chartData} /></div>
      <div className="section"><div className="two-col"><div className="panel"><TemporalTable rows={temporalRows} /></div><div className="panel"><HistoryBrief cells={historyCells} /></div></div></div>
      <div className="section"><div className="two-col"><VitalStreamsPanel latestVitals={latestVitals} historicalVitals={historicalVitals} hrColor={hrColor} /><InferencePanel riskScore={riskScore} inference={inference} clock={clock} /></div></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMMAND VIEW
═══════════════════════════════════════════════════════════════ */
function CommandView({ patientName, chartData, temporalRows, historyCells, latestVitals, historicalVitals, riskScore, inference, hrColor, clock }: any) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      <div className="section"><div className="three-col"><div className="panel"><TemporalTable rows={temporalRows} /></div><div className="panel"><HistoryBrief cells={historyCells} /></div><InferencePanel riskScore={riskScore} inference={inference} clock={clock} /></div></div>
      <div className="section"><MainChart patientName={patientName} chartData={chartData} /></div>
      <div className="section"><VitalStreamsPanel latestVitals={latestVitals} historicalVitals={historicalVitals} hrColor={hrColor} /></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════════ */
function Timeline({ events }: { events:{t:string;label:string;color:string;left:string}[] }) {
  return (
    <div className="timeline">
      <div className="tl-track"><span className="tl-now">NOW <span className="tl-now-cursor" /></span></div>
      <div className="tl-events">
        {events.map((ev,idx)=>(
          <div className="tl-event" key={idx} style={{left:ev.left}}>
            <div className="tl-dot" style={{background:ev.color,borderColor:ev.color}} />
            <span className="tl-etime">{ev.t}</span>
            <span className="tl-elbl" style={{color:ev.color}}>{ev.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RAIL PATIENT SHAPE
═══════════════════════════════════════════════════════════════ */
interface RailPatient { patient_id: string; age?: number; riskScore: number; status: "CRITICAL" | "ELEVATED" | "STABLE"; }

/* ═══════════════════════════════════════════════════════════════
   ROOT DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const clock = useClock();
  const [activeId, setActiveId] = useState<string>("");
  const [view, setView] = useState("chart");
  const [railOpen, setRailOpen] = useState(false); // mobile rail toggle

  const [localAcked, setLocalAcked] = useState(false);

  const [railPatients, setRailPatients]   = useState<RailPatient[]>([]);
  const [dashboard, setDashboard]         = useState<DashboardResponse | null>(null);
  const [loadingList, setLoadingList]     = useState(true);
  const [loadingDash, setLoadingDash]     = useState(false);
  const [listError, setListError]         = useState<string | null>(null);

  /* ── Fetch patient list ─────────────────────── */
  const fetchPatients = useCallback(async () => {
    setLoadingList(true); setListError(null);
    try {
      const patients = await getPatients();
      const shaped: RailPatient[] = patients.map(p => ({ patient_id: p.patient_id, age: p.age, riskScore: 0, status: "STABLE" as const }));
      setRailPatients(shaped);
      if (shaped.length > 0 && !activeId) setActiveId(shaped[0].patient_id);
    } catch (err: any) {
      setListError(err?.message ?? "Failed to load patients");
    } finally {
      setLoadingList(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  /* ── Reset localAcked when switching patients ── */
  useEffect(() => { setLocalAcked(false); }, [activeId]);

  /* ── Fetch dashboard + poll every 30s ──────── */
  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    async function fetchDash() {
      setLoadingDash(true);
      try {
        const data = await getDashboardData(activeId);
        if (!cancelled) {
          const newCritical = (data.activeAlerts ?? []).some(
            (a: DashboardAlert) => a.severity === "high" && !a.acknowledged
          );
          if (newCritical) setLocalAcked(false);
          setDashboard(data);
          const score  = riskToScore(data.latestPrediction?.risk_score ?? 0);
          const status = severityToStatus(data.latestPrediction?.severity ?? "low");
          setRailPatients(prev => prev.map(p => p.patient_id === activeId ? {...p, riskScore: score, status} : p));
        }
      } catch { /* keep previous state */ } finally {
        if (!cancelled) setLoadingDash(false);
      }
    }
    fetchDash();
    const poll = setInterval(fetchDash, 30_000);
    return () => { cancelled = true; clearInterval(poll); };
  }, [activeId]);

  /* ── Acknowledge alert ──────────────────────── */
  async function handleAckAlert(alertId?: string) {
    setLocalAcked(true);
    const first = alertId ?? activeAlerts.find((a: DashboardAlert) => !a.acknowledged && a._id)?._id;
    if (!first) return;
    try {
      await acknowledgeAlert(first);
      if (activeId) { const data = await getDashboardData(activeId); setDashboard(data); }
    } catch { /* keep local ack */ }
  }

  /* ── Derived values ─────────────────────────── */
  const riskScore    = riskToScore(dashboard?.latestPrediction?.risk_score ?? 0);
  const statusLabel  = severityToStatus(dashboard?.latestPrediction?.severity ?? "low");
  const statusColor  = scoreColor(riskScore);
  const criticalCount = railPatients.filter(p => p.status === "CRITICAL").length;

  const latestVitals     = dashboard?.latestVitals ?? null;
  const historicalVitals = dashboard?.historicalVitals ?? [];
  const activeAlerts     = dashboard?.activeAlerts ?? [];
  const patientRecord    = dashboard?.patient ?? null;

  const hasUnackedCritical = activeAlerts.some(
    (a: DashboardAlert) => a.severity === "high" && !a.acknowledged
  );

  const isEmergency = !localAcked && (riskScore >= 90 || hasUnackedCritical);

  const alertText = activeAlerts.length > 0
    ? activeAlerts.map((a: DashboardAlert) => a.message).join(" · ")
    : "NO ACTIVE ALERTS · ALL PARAMETERS NOMINAL";

  const temporalRows   = buildTemporalRows(historicalVitals);
  const historyCells   = patientRecord ? buildHistoryCells(patientRecord) : [];
  const inference      = buildInference(dashboard?.latestPrediction?.explanation ?? []);
  const timelineEvents = buildTimelineEvents(activeAlerts);
  const chartData      = historicalVitals.length > 0 ? makeChartDataFromHistory(historicalVitals) : makeChartData(80,0.3,0.4,2);
  const hrColor        = statusLabel === "CRITICAL" ? "var(--crimson)" : statusLabel === "ELEVATED" ? "var(--amber)" : "var(--t01)";
  const patientAge     = patientRecord?.age;

  /* ── F9 keyboard shortcut ───────────────────── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "F9") { e.preventDefault(); handleAckAlert(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlerts]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <EmergencyOverlay
        active={isEmergency && !!activeId}
        riskScore={riskScore}
        alertMessage={alertText}
        onAck={() => handleAckAlert()}
      />

      <div className={`vigil-shell${isEmergency && activeId ? " emergency-active" : ""}`}>
        <div className="vigil-bg-grid" />

        {/* ── TOPBAR ──────────────────────────── */}
        <header className={`topbar${isEmergency && activeId ? " emergency" : ""}`}>
          <div className="topbar-left">
            <span className="tb-label">SP-1</span>
            <div className="tb-div" />
            <span className="tb-vigil">SENTRI</span>
            <div className="tb-dot" />
            <span className="tb-amber">▲ +{criticalCount}</span>
          </div>
          <div className="topbar-mid">
            <div className="tb-live-dot" />
            <span style={{fontFamily:"var(--f-mono)",fontSize:12,color:"var(--amber)",letterSpacing:"0.16em"}}>LIVE ICU NETWORK</span>
          </div>
          <div className="topbar-right">
            <span className="tb-label">UNIT 3B · ICU</span>
            <div className="tb-div" />
            <span className="tb-crit">{criticalCount} CRITICAL</span>
            <div className="tb-div" />
            <span className="tb-label">{clock}</span>
          </div>
        </header>

        {/* ── INTAKE BAR ──────────────────────── */}
        <PatientIntakeBar onRegistered={fetchPatients} />

        {/* ── MOBILE RAIL TOGGLE ──────────────── */}
        <div
          className="rail-mobile-toggle"
          onClick={() => setRailOpen(o => !o)}
        >
          <span className="rail-mobile-toggle-label">
            PATIENTS · {railPatients.length}
          </span>
          {criticalCount > 0 && (
            <span className="rail-mobile-toggle-count">
              {criticalCount} CRITICAL
            </span>
          )}
          <span className={`rail-mobile-toggle-arrow${railOpen ? " open" : ""}`}>
            ▼
          </span>
        </div>

        {/* ── BODY ────────────────────────────── */}
        <div className="vigil-body">

          {/* ── RAIL ────────────────────────── */}
          <aside className={`rail${railOpen ? " rail-open" : ""}`}>
            <div className="rail-header">
              <span className="rail-unit">UNIT 3B · ICU</span>
              <span className="rail-time">{clock}</span>
            </div>
            <div className="rail-patients">
              {loadingList && <div style={{padding:"24px 20px",fontFamily:"var(--f-mono)",fontSize:11,color:"var(--t03)",letterSpacing:"0.14em"}}>LOADING PATIENTS…</div>}
              {!loadingList && listError && <div style={{padding:"16px 20px",fontFamily:"var(--f-mono)",fontSize:10,color:"var(--crimson)",letterSpacing:"0.12em",lineHeight:1.6}}>FETCH ERROR<br />{listError}</div>}
              {!loadingList && !listError && railPatients.length === 0 && <div style={{padding:"24px 20px",fontFamily:"var(--f-mono)",fontSize:11,color:"var(--t03)",letterSpacing:"0.14em",lineHeight:1.8}}>NO PATIENTS REGISTERED<br /><span style={{fontSize:10,color:"var(--t04)"}}>USE INTAKE FORM ABOVE</span></div>}
              {railPatients.map((p,i)=>(
                <div
                  key={p.patient_id}
                  className={patientRowClass(p.riskScore,p.status,activeId,p.patient_id)}
                  style={{animationDelay:`${i*40}ms`}}
                  onClick={()=>{ setActiveId(p.patient_id); setRailOpen(false); }}
                >
                  <div className="pr-top">
                    <span className="pr-id">{p.patient_id}</span>
                    <span className="pr-score" style={{color:scoreColor(p.riskScore)}}>{p.riskScore}</span>
                  </div>
                  <div className="pr-name">{p.patient_id}</div>
                  <div className="pr-meta">{p.age ? `AGE ${p.age}` : "–"}</div>
                  <div className="pr-status" style={{color:scoreColor(p.riskScore)}}>{p.status}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── WORKSPACE ───────────────────── */}
          <main className="workspace">
            {!activeId ? (
              <div className="no-patient">
                <div className="no-patient-icon">⊕</div>
                <div className="no-patient-text">SELECT OR REGISTER A PATIENT</div>
              </div>
            ) : (
              <>
                {/* Status band */}
                <div className="status-band">
                  <div className="sb-meta">
                    <span className="sb-item">{activeId}</span>
                    {patientAge && <><div className="sb-sep" /><span className="sb-item">{patientAge}Y</span></>}
                    {loadingDash && <><div className="sb-sep" /><span className="sb-item" style={{color:"var(--t03)"}}>SYNCING…</span></>}
                  </div>
                  <div className="sb-right">
                    <span className="sb-score" style={{color:statusColor}}>{riskScore}</span>
                    <span className="sb-sev"   style={{color:statusColor}}>{statusLabel}</span>
                  </div>
                </div>

                {/* Alert strip */}
                <div className="alert-strip">
                  <div
                    className="alert-icon"
                    style={{cursor:activeAlerts.length>0?"pointer":"default"}}
                    onClick={()=>{const first=activeAlerts.find((a:DashboardAlert)=>!a.acknowledged&&a._id);if(first?._id)handleAckAlert(first._id);}}
                    title={activeAlerts.length>0?"Click to acknowledge":undefined}
                  />
                  <span className="alert-text">{alertText}</span>
                </div>

                {/* View tabs */}
                <div className="view-tabs">
                  {[{key:"chart",label:"CHART VIEW"},{key:"command",label:"COMMAND VIEW"}].map(({key,label})=>(
                    <button key={key} className={`view-tab${view===key?" active":""}`} onClick={()=>setView(key)}>{label}</button>
                  ))}
                </div>

                {/* Canvas */}
                <div style={{flex:1,paddingBottom:24}}>
                  {view==="chart" && <ChartView patientName={activeId} chartData={chartData} temporalRows={temporalRows} historyCells={historyCells} latestVitals={latestVitals} historicalVitals={historicalVitals} riskScore={riskScore} inference={inference} hrColor={hrColor} clock={clock} />}
                  {view==="command" && <CommandView patientName={activeId} chartData={chartData} temporalRows={temporalRows} historyCells={historyCells} latestVitals={latestVitals} historicalVitals={historicalVitals} riskScore={riskScore} inference={inference} hrColor={hrColor} clock={clock} />}
                </div>

                <Timeline events={timelineEvents} />
              </>
            )}

            <footer className="bottombar">
              <div className="bb-keys">
                {["↑↓ NAV","ENTER SELECT","F9 ACK","F10 EXPAND","SPACE PAUSE","←→ PAN"].map((k,i,a)=>(
                  <div key={k} style={{display:"flex",alignItems:"center",gap:14}}>
                    <span className="bb-key">{k}</span>
                    {i<a.length-1&&<div className="bb-sep" />}
                  </div>
                ))}
              </div>
              <div className="bb-right">
                <div className="bb-dot" />
                <span className="bb-live">LIVE STREAM ACTIVE</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}