/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
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

  /* ── SHELL ───────────────────────────────────── */
  .vigil-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--void);
    position: relative;
  }

  /* subtle dot grid — much lighter than before */
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
    z-index: 100;
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
    width: 18px;
    height: 18px;
    border: 1px solid var(--l02);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .intake-toggle-label {
    font-family: var(--f-cond);
    font-size: 13px;
    color: var(--t02);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .intake-toggle-hint {
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--t03);
    letter-spacing: 0.10em;
    margin-left: auto;
  }

  .intake-form-wrap {
    padding: 20px 24px 22px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    animation: intake-slide 200ms ease both;
  }

  .intake-field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }
  .intake-field-label {
    font-family: var(--f-cond);
    font-size: 11px;
    color: var(--t02);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 600;
  }
  .intake-text-input {
    height: 38px;
    padding: 0 12px;
    background: var(--s02);
    border: 1px solid var(--l01);
    color: var(--t00);
    font-family: var(--f-mono);
    font-size: 13px;
    letter-spacing: 0.10em;
    outline: none;
    transition: border-color 150ms;
    width: 180px;
    border-radius: var(--radius);
  }
  .intake-text-input::placeholder { color: var(--t03); }
  .intake-text-input:focus { border-color: var(--amber); }

  .intake-history-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }
  .intake-history-tabs {
    display: flex;
    gap: 0;
    border: 1px solid var(--l01);
    width: fit-content;
  }
  .intake-tab {
    height: 28px;
    padding: 0 14px;
    font-family: var(--f-cond);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    border-right: 1px solid var(--l01);
    color: var(--t02);
    cursor: pointer;
    transition: color 120ms, background 120ms;
  }
  .intake-tab:last-child { border-right: none; }
  .intake-tab.active {
    background: var(--amber-lo);
    color: var(--amber);
  }

  .intake-textarea {
    height: 64px;
    padding: 10px 12px;
    background: var(--s02);
    border: 1px solid var(--l01);
    color: var(--t00);
    font-family: var(--f-mono);
    font-size: 12px;
    letter-spacing: 0.06em;
    line-height: 1.6;
    outline: none;
    resize: none;
    width: 100%;
    transition: border-color 150ms;
    border-radius: var(--radius);
  }
  .intake-textarea::placeholder { color: var(--t03); }
  .intake-textarea:focus { border-color: var(--amber); }

  .intake-pdf-zone {
    height: 64px;
    border: 1px dashed var(--l02);
    background: var(--s02);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    transition: border-color 150ms, background 150ms;
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: var(--radius);
  }
  .intake-pdf-zone:hover,
  .intake-pdf-zone.drag-over {
    border-color: var(--amber);
    background: var(--amber-glow);
  }
  .intake-pdf-icon {
    width: 20px;
    height: 24px;
    border: 1.5px solid var(--t02);
    position: relative;
    flex-shrink: 0;
  }
  .intake-pdf-icon::before {
    content: '';
    position: absolute;
    top: -1px; right: -1px;
    width: 8px; height: 8px;
    background: var(--s02);
    border-left: 1.5px solid var(--t02);
    border-bottom: 1.5px solid var(--t02);
    clip-path: polygon(0 0, 100% 100%, 0 100%);
  }
  .intake-pdf-text {
    font-family: var(--f-mono);
    font-size: 11px;
    color: var(--t02);
    letter-spacing: 0.12em;
  }
  .intake-pdf-text span { color: var(--amber); }
  .intake-pdf-filename {
    font-family: var(--f-mono);
    font-size: 12px;
    color: var(--amber);
    letter-spacing: 0.08em;
  }
  .intake-pdf-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .intake-submit-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
    justify-content: flex-end;
  }
  .intake-submit-btn {
    height: 38px;
    padding: 0 22px;
    background: var(--amber-lo);
    border: 1px solid var(--l-amber);
    color: var(--amber);
    font-family: var(--f-cond);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 150ms, border-color 150ms;
    white-space: nowrap;
    border-radius: var(--radius);
  }
  .intake-submit-btn:hover {
    background: var(--amber-mid);
    border-color: var(--amber);
  }
  .intake-submit-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }
  .intake-divider {
    width: 1px;
    align-self: stretch;
    background: var(--l01);
    flex-shrink: 0;
    margin: 0 4px;
  }

  /* ── PATIENT RAIL ────────────────────────────── */
  .rail {
    width: 320px;
    border-right: 1px solid var(--l01);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background: var(--s00);
    position: sticky;
    top: 52px;
    height: calc(100vh - 52px);
    overflow: hidden;
  }
  .rail-header {
    height: 52px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--l01);
    flex-shrink: 0;
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
  .workspace {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-y: auto;
  }

  /* ── PATIENT STATUS BAND ─────────────────────── */
  .status-band {
    height: 60px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--l01);
    background: rgba(196,43,43,0.03);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 40;
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
    height: 38px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(196,43,43,0.05);
    border-bottom: 1px solid rgba(196,43,43,0.20);
    flex-shrink: 0;
    overflow: hidden;
  }
  .alert-icon {
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--crimson);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }
  .alert-icon::before,
  .alert-icon::after {
    content: '';
    position: absolute;
    width: 9px;
    height: 1.5px;
    background: var(--crimson);
  }
  .alert-icon::before { transform: rotate(45deg); }
  .alert-icon::after  { transform: rotate(-45deg); }
  .alert-text {
    font-family: var(--f-mono);
    font-size: 12px;
    color: var(--crimson);
    letter-spacing: 0.12em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── VIEW TABS ───────────────────────────────── */
  .view-tabs {
    display: flex;
    border-bottom: 1px solid var(--l01);
    flex-shrink: 0;
    background: var(--s01);
  }
  .view-tab {
    padding: 0 24px;
    height: 42px;
    font-family: var(--f-cond);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--t02);
    cursor: pointer;
    transition: color 150ms, border-color 150ms;
  }
  .view-tab.active {
    border-bottom-color: var(--amber);
    color: var(--amber);
  }

  /* ── PANEL CARD ──────────────────────────────── */
  .panel {
    background: var(--s01);
    border: 1px solid var(--l01);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .panel-hd {
    height: 54px;
    border-bottom: 1px solid var(--l01);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
    flex-shrink: 0;
  }
  .panel-title { font-family: var(--f-mono); font-size: 13px; color: var(--t00); letter-spacing: 0.14em; font-weight: 700; }
  .panel-sub   { font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.12em; margin-top: 4px; }

  /* ── SECTION WRAPPER ─────────────────────────── */
  .section { padding: 24px 24px 0; }
  .section:last-child { padding-bottom: 32px; }

  .section-title {
    font-family: var(--f-cond);
    font-size: 11px;
    color: var(--t03);
    letter-spacing: 0.26em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 14px;
  }

  /* ── CHART LEGEND ────────────────────────────── */
  .legend { display: flex; align-items: center; gap: 16px; }
  .legend-item { display: flex; align-items: center; gap: 6px; }
  .legend-line { width: 16px; height: 2px; }
  .legend-lbl  { font-family: var(--f-mono); font-size: 11px; color: var(--t02); }

  /* ── STATS STRIP ─────────────────────────────── */
  .stats-strip {
    display: grid;
    grid-template-columns: repeat(5,1fr);
    border-top: 1px solid var(--l01);
    flex-shrink: 0;
  }
  .stat-cell { padding: 14px 20px; border-right: 1px solid var(--l00); }
  .stat-cell:last-child { border-right: none; }
  .stat-lbl { font-family: var(--f-cond); font-size: 10px; color: var(--t02); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px; font-weight: 600; }
  .stat-val { font-family: var(--f-cond); font-size: 22px; font-weight: 700; letter-spacing: 0.02em; line-height: 1; }

  /* ── TEMPORAL TABLE ──────────────────────────── */
  .tbl-head-row {
    display: grid;
    grid-template-columns: 70px 100px 90px 90px;
    padding: 10px 22px;
    border-bottom: 1px solid var(--l01);
  }
  .tbl-hd { font-family: var(--f-cond); font-size: 11px; color: var(--t02); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
  .tbl-row {
    display: grid;
    grid-template-columns: 70px 100px 90px 90px;
    padding: 13px 22px;
    border-bottom: 1px solid var(--l00);
    align-items: center;
  }
  .tbl-row:last-child { border-bottom: none; }
  .tbl-param { font-family: var(--f-mono); font-size: 13px; color: var(--t01); font-weight: 700; }
  .tbl-val   { font-family: var(--f-mono); font-size: 13px; }
  .tbl-r     { text-align: right; }

  /* ── HISTORY BRIEF ───────────────────────────── */
  .hist-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
  .hist-cell { padding: 14px 20px; border-bottom: 1px solid var(--l00); border-right: 1px solid var(--l00); }
  .hist-cell:nth-child(3n) { border-right: none; }
  .hist-cell:nth-last-child(-n+3) { border-bottom: none; }
  .hist-key { font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.14em; margin-bottom: 5px; }
  .hist-val { font-family: var(--f-mono); font-size: 14px; color: var(--t01); font-weight: 700; }
  .hist-source { padding: 11px 20px; font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.10em; border-top: 1px solid var(--l00); }

  /* ── TWO-COL GRID ────────────────────────────── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .three-col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  /* ── THREAT ARC ──────────────────────────────── */
  .arc-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 22px 24px;
    border-bottom: 1px solid var(--l01);
    flex-shrink: 0;
  }
  .arc-label { font-family: var(--f-cond); font-size: 11px; color: var(--t02); letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; align-self: flex-start; margin-bottom: 16px; }
  .arc-svg-root { position: relative; }
  .arc-center {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -44%);
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    pointer-events: none;
  }
  .arc-score { font-family: var(--f-mono); font-size: 80px; font-weight: 700; line-height: 1; letter-spacing: -0.04em; animation: score-pulse 2400ms linear infinite; }
  .arc-sev   { font-family: var(--f-cond); font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; }
  .arc-idx   { font-family: var(--f-cond); font-size: 10px; color: var(--t02); text-transform: uppercase; letter-spacing: 0.22em; }

  /* ── INFERENCE PANEL ─────────────────────────── */
  .inf-wrap { padding: 20px 22px; flex: 1; }
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

  /* ── VITAL STREAMS ───────────────────────────── */
  .vital-stream {
    border-bottom: 1px solid var(--l01);
    padding: 0 0 6px;
  }
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

  /* ── TIMELINE ────────────────────────────────── */
  .timeline {
    height: 80px;
    border-top: 1px solid var(--l01);
    padding: 0 28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
    flex-shrink: 0;
    position: relative;
    background: var(--s01);
    overflow: hidden;
  }
  .tl-track {
    position: relative;
    width: 100%;
    height: 1px;
    background: var(--l01);
  }
  .tl-now {
    position: absolute;
    right: 0;
    top: -11px;
    font-family: var(--f-mono);
    font-size: 10px;
    color: var(--amber);
    letter-spacing: 0.10em;
  }
  .tl-now-cursor {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: var(--amber);
    vertical-align: middle;
    margin-left: 4px;
    animation: amber-blink 800ms linear infinite;
  }
  .tl-events { position: relative; width: 100%; height: 52px; }
  .tl-event  { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 4px; transform: translateX(-50%); }
  .tl-dot    { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid; margin-top: -4px; }
  .tl-etime  { font-family: var(--f-mono); font-size: 9px; color: var(--t02); }
  .tl-elbl   { font-family: var(--f-mono); font-size: 9px; text-align: center; line-height: 1.4; white-space: pre; }

  /* ── BOTTOM BAR ──────────────────────────────── */
  .bottombar {
    height: 38px;
    border-top: 1px solid var(--l01);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
    background: rgba(6,8,12,0.95);
  }
  .bb-keys { display: flex; gap: 20px; align-items: center; }
  .bb-key  { font-family: var(--f-mono); font-size: 10px; color: var(--t03); letter-spacing: 0.12em; }
  .bb-sep  { width: 1px; height: 12px; background: var(--l01); }
  .bb-right { display: flex; align-items: center; gap: 8px; }
  .bb-dot  { width: 7px; height: 7px; background: var(--amber); }
  .bb-live { font-family: var(--f-mono); font-size: 11px; color: var(--amber); letter-spacing: 0.12em; }

  /* ── TOOLTIP ─────────────────────────────────── */
  .ct-box {
    background: var(--s02);
    border: 1px solid var(--l02);
    padding: 12px 16px;
    min-width: 130px;
    border-radius: var(--radius);
  }
  .ct-time { font-family: var(--f-mono); font-size: 10px; color: var(--t02); margin-bottom: 10px; letter-spacing: 0.10em; }
  .ct-row  { font-family: var(--f-mono); font-size: 12px; display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
  .ct-lbl  { color: var(--t02); }
  .ct-val  { font-weight: 700; }

  /* ── NO-PATIENT PLACEHOLDER ──────────────────── */
  .no-patient {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--t03);
  }
  .no-patient-icon { font-size: 36px; opacity: 0.3; }
  .no-patient-text { font-family: var(--f-cond); font-size: 14px; letter-spacing: 0.20em; text-transform: uppercase; }
`;

/* ═══════════════════════════════════════════════════════════════
   PATIENT DATA (with full vitals per patient)
═══════════════════════════════════════════════════════════════ */
const PATIENTS = [
  {
    id: "P-001", name: "KUMAR, RAJESH M",  gender: "M", age: 67, risk: 78,
    status: "CRITICAL", bed: "BED 12", admitted: "07MAY26 08:00",
    alert: "CRITICAL · HR +22 FROM BASELINE · SPO2 DECLINING · TEMP RISING · ALERT AT 10:22:08",
    history: [
      ["AGE","67"], ["DIABETES","YES"], ["BMI","29.1"],
      ["SMOKER","NO"], ["HTN","YES"], ["SURGERY","NO"],
      ["HR₀","80BPM"], ["SBP₀","120MM"], ["DBP₀","80MM"],
    ],
    vitals: { hr: 109, spo2: 67, temp: 63, resp: 44, sbp: 118 },
    baseVitals: [82, 0.92, 0.45, 2.5],
    temporal: [
      { param:"HR",   slope:"+4.4/h",  accel:"↑ ACC", delta:"+22BPM", sC:"var(--amber)",   aC:"var(--amber)",  dC:"var(--crimson)" },
      { param:"SPO2", slope:"-1.0/h",  accel:"↑ ACC", delta:"-5PCT",  sC:"var(--crimson)", aC:"var(--amber)",  dC:"var(--crimson)" },
      { param:"TEMP", slope:"+0.28/h", accel:"– STB", delta:"+1.2°C", sC:"var(--amber)",   aC:"var(--t02)",    dC:"var(--amber)"   },
      { param:"RESP", slope:"+1.6/h",  accel:"↑ ACC", delta:"+8RPM",  sC:"var(--amber)",   aC:"var(--amber)",  dC:"var(--amber)"   },
      { param:"SBP",  slope:"-2.0/h",  accel:"– STB", delta:"-12MM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
    ],
    inference: [
      { name:"HR_SLOPE",   pct:31 },
      { name:"SPO2_SLOPE", pct:22 },
      { name:"TEMP_ACCEL", pct:16 },
      { name:"DIABETES",   pct:11 },
      { name:"RESP_SLOPE", pct:8  },
    ],
    chartBase: [82, 0.92, 0.45, 2.5],
    hrColor: "var(--crimson)",
  },
  {
    id: "P-002", name: "MEHTA, SUNITA F",  gender: "F", age: 54, risk: 45,
    status: "ELEVATED", bed: "BED 7", admitted: "07MAY26 10:15",
    alert: "ELEVATED · BP VARIABILITY HIGH · MONITORING HR TREND · ALERT AT 11:05:30",
    history: [
      ["AGE","54"], ["DIABETES","NO"], ["BMI","26.4"],
      ["SMOKER","YES"], ["HTN","YES"], ["SURGERY","YES"],
      ["HR₀","74BPM"], ["SBP₀","135MM"], ["DBP₀","88MM"],
    ],
    vitals: { hr: 88, spo2: 94, temp: 37, resp: 22, sbp: 148 },
    temporal: [
      { param:"HR",   slope:"+1.8/h",  accel:"– STB", delta:"+14BPM", sC:"var(--amber)",   aC:"var(--t02)",    dC:"var(--amber)"   },
      { param:"SPO2", slope:"-0.4/h",  accel:"– STB", delta:"-2PCT",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"TEMP", slope:"+0.10/h", accel:"– STB", delta:"+0.4°C", sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"RESP", slope:"+0.6/h",  accel:"– STB", delta:"+4RPM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SBP",  slope:"+3.2/h",  accel:"↑ ACC", delta:"+28MM",  sC:"var(--amber)",   aC:"var(--amber)",  dC:"var(--amber)"   },
    ],
    inference: [
      { name:"SBP_SLOPE",  pct:34 },
      { name:"HTN",        pct:24 },
      { name:"HR_SLOPE",   pct:18 },
      { name:"SMOKER",     pct:14 },
      { name:"TEMP_DELTA", pct:10 },
    ],
    chartBase: [74, 0.7, 0.38, 1.8],
    hrColor: "var(--amber)",
  },
  {
    id: "P-003", name: "PILLAI, ARJUN M",  gender: "M", age: 41, risk: 22,
    status: "STABLE", bed: "BED 3", admitted: "07MAY26 12:30",
    alert: "STABLE · ALL PARAMETERS WITHIN NORMAL RANGE · LAST CHECK 13:00",
    history: [
      ["AGE","41"], ["DIABETES","NO"], ["BMI","23.8"],
      ["SMOKER","NO"], ["HTN","NO"], ["SURGERY","NO"],
      ["HR₀","70BPM"], ["SBP₀","118MM"], ["DBP₀","76MM"],
    ],
    vitals: { hr: 72, spo2: 98, temp: 37, resp: 16, sbp: 120 },
    temporal: [
      { param:"HR",   slope:"+0.3/h",  accel:"– STB", delta:"+2BPM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SPO2", slope:"-0.1/h",  accel:"– STB", delta:"-0PCT",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"TEMP", slope:"+0.02/h", accel:"– STB", delta:"+0.1°C", sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"RESP", slope:"+0.1/h",  accel:"– STB", delta:"+1RPM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SBP",  slope:"+0.5/h",  accel:"– STB", delta:"+2MM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
    ],
    inference: [
      { name:"AGE",        pct:28 },
      { name:"BMI",        pct:22 },
      { name:"HR_STABLE",  pct:20 },
      { name:"SPO2_STBL",  pct:18 },
      { name:"TEMP_NORM",  pct:12 },
    ],
    chartBase: [70, 0.3, 0.28, 1.2],
    hrColor: "var(--t01)",
  },
  {
    id: "P-004", name: "NAIR, VIDYA F",    gender: "F", age: 58, risk: 18,
    status: "STABLE", bed: "BED 5", admitted: "07MAY26 09:45",
    alert: "STABLE · ROUTINE MONITORING ONLY · DISCHARGE PLANNED 08MAY26",
    history: [
      ["AGE","58"], ["DIABETES","NO"], ["BMI","24.5"],
      ["SMOKER","NO"], ["HTN","NO"], ["SURGERY","YES"],
      ["HR₀","68BPM"], ["SBP₀","115MM"], ["DBP₀","72MM"],
    ],
    vitals: { hr: 70, spo2: 99, temp: 37, resp: 15, sbp: 116 },
    temporal: [
      { param:"HR",   slope:"+0.2/h",  accel:"– STB", delta:"+2BPM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SPO2", slope:"0.0/h",   accel:"– STB", delta:"0PCT",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"TEMP", slope:"0.0/h",   accel:"– STB", delta:"0.0°C",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"RESP", slope:"0.0/h",   accel:"– STB", delta:"0RPM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SBP",  slope:"+0.2/h",  accel:"– STB", delta:"+1MM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
    ],
    inference: [
      { name:"SURGERY",    pct:30 },
      { name:"AGE",        pct:26 },
      { name:"SPO2_NORM",  pct:22 },
      { name:"HR_STABLE",  pct:14 },
      { name:"BP_STABLE",  pct:8  },
    ],
    chartBase: [68, 0.2, 0.20, 1.0],
    hrColor: "var(--t02)",
  },
  {
    id: "P-005", name: "SHARMA, PRIYA F",  gender: "F", age: 72, risk: 61,
    status: "CRITICAL", bed: "BED 9", admitted: "07MAY26 07:30",
    alert: "CRITICAL · RESP RATE ELEVATED · TEMP SPIKE 38.6°C · ALERT AT 09:45:12",
    history: [
      ["AGE","72"], ["DIABETES","YES"], ["BMI","31.2"],
      ["SMOKER","YES"], ["HTN","YES"], ["SURGERY","YES"],
      ["HR₀","78BPM"], ["SBP₀","130MM"], ["DBP₀","84MM"],
    ],
    vitals: { hr: 98, spo2: 91, temp: 39, resp: 28, sbp: 142 },
    temporal: [
      { param:"HR",   slope:"+2.8/h",  accel:"↑ ACC", delta:"+20BPM", sC:"var(--amber)",   aC:"var(--amber)",  dC:"var(--amber)"   },
      { param:"SPO2", slope:"-0.8/h",  accel:"↑ ACC", delta:"-4PCT",  sC:"var(--crimson)", aC:"var(--amber)",  dC:"var(--amber)"   },
      { param:"TEMP", slope:"+0.5/h",  accel:"↑ ACC", delta:"+2.4°C", sC:"var(--crimson)", aC:"var(--crimson)",dC:"var(--crimson)" },
      { param:"RESP", slope:"+3.2/h",  accel:"↑ ACC", delta:"+10RPM", sC:"var(--crimson)", aC:"var(--crimson)",dC:"var(--crimson)" },
      { param:"SBP",  slope:"+1.8/h",  accel:"↑ ACC", delta:"+12MM",  sC:"var(--amber)",   aC:"var(--amber)",  dC:"var(--amber)"   },
    ],
    inference: [
      { name:"RESP_SLOPE", pct:29 },
      { name:"TEMP_ACCEL", pct:24 },
      { name:"AGE",        pct:18 },
      { name:"DIABETES",   pct:16 },
      { name:"HR_SLOPE",   pct:13 },
    ],
    chartBase: [78, 1.4, 0.52, 3.2],
    hrColor: "var(--crimson)",
  },
  {
    id: "P-006", name: "REDDY, KIRAN M",   gender: "M", age: 45, risk: 14,
    status: "STABLE", bed: "BED 1", admitted: "07MAY26 11:00",
    alert: "STABLE · RECOVERING POST-PROCEDURE · VITALS NORMAL",
    history: [
      ["AGE","45"], ["DIABETES","NO"], ["BMI","22.0"],
      ["SMOKER","NO"], ["HTN","NO"], ["SURGERY","YES"],
      ["HR₀","65BPM"], ["SBP₀","112MM"], ["DBP₀","70MM"],
    ],
    vitals: { hr: 66, spo2: 99, temp: 37, resp: 14, sbp: 114 },
    temporal: [
      { param:"HR",   slope:"+0.1/h",  accel:"– STB", delta:"+1BPM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SPO2", slope:"0.0/h",   accel:"– STB", delta:"0PCT",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"TEMP", slope:"0.0/h",   accel:"– STB", delta:"0.0°C",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"RESP", slope:"0.0/h",   accel:"– STB", delta:"0RPM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SBP",  slope:"+0.1/h",  accel:"– STB", delta:"+2MM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
    ],
    inference: [
      { name:"SURGERY",    pct:32 },
      { name:"AGE",        pct:24 },
      { name:"BMI",        pct:20 },
      { name:"SPO2_NORM",  pct:14 },
      { name:"BP_STABLE",  pct:10 },
    ],
    chartBase: [65, 0.1, 0.18, 0.8],
    hrColor: "var(--t02)",
  },
  {
    id: "P-007", name: "BOSE, TARUN M",    gender: "M", age: 66, risk: 39,
    status: "ELEVATED", bed: "BED 11", admitted: "07MAY26 08:50",
    alert: "ELEVATED · HR VARIABILITY HIGH · MONITORING ARRHYTHMIA RISK",
    history: [
      ["AGE","66"], ["DIABETES","YES"], ["BMI","28.3"],
      ["SMOKER","YES"], ["HTN","NO"], ["SURGERY","NO"],
      ["HR₀","76BPM"], ["SBP₀","122MM"], ["DBP₀","78MM"],
    ],
    vitals: { hr: 91, spo2: 95, temp: 37, resp: 20, sbp: 128 },
    temporal: [
      { param:"HR",   slope:"+1.4/h",  accel:"↑ ACC", delta:"+15BPM", sC:"var(--amber)",   aC:"var(--amber)",  dC:"var(--amber)"   },
      { param:"SPO2", slope:"-0.3/h",  accel:"– STB", delta:"-1PCT",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"TEMP", slope:"+0.06/h", accel:"– STB", delta:"+0.3°C", sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"RESP", slope:"+0.8/h",  accel:"– STB", delta:"+4RPM",  sC:"var(--amber)",   aC:"var(--t02)",    dC:"var(--amber)"   },
      { param:"SBP",  slope:"+1.0/h",  accel:"– STB", delta:"+6MM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
    ],
    inference: [
      { name:"HR_VARIAB",  pct:32 },
      { name:"DIABETES",   pct:24 },
      { name:"SMOKER",     pct:20 },
      { name:"AGE",        pct:16 },
      { name:"RESP_SLOPE", pct:8  },
    ],
    chartBase: [76, 1.1, 0.40, 2.0],
    hrColor: "var(--amber)",
  },
  {
    id: "P-008", name: "IYER, MEERA F",    gender: "F", age: 52, risk: 11,
    status: "STABLE", bed: "BED 2", admitted: "07MAY26 13:10",
    alert: "STABLE · OBSERVATION ONLY · LOW RISK PROFILE",
    history: [
      ["AGE","52"], ["DIABETES","NO"], ["BMI","21.5"],
      ["SMOKER","NO"], ["HTN","NO"], ["SURGERY","NO"],
      ["HR₀","62BPM"], ["SBP₀","108MM"], ["DBP₀","68MM"],
    ],
    vitals: { hr: 63, spo2: 99, temp: 37, resp: 14, sbp: 109 },
    temporal: [
      { param:"HR",   slope:"+0.1/h",  accel:"– STB", delta:"+1BPM",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SPO2", slope:"0.0/h",   accel:"– STB", delta:"0PCT",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"TEMP", slope:"0.0/h",   accel:"– STB", delta:"0.0°C",  sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"RESP", slope:"0.0/h",   accel:"– STB", delta:"0RPM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
      { param:"SBP",  slope:"+0.1/h",  accel:"– STB", delta:"+1MM",   sC:"var(--t01)",     aC:"var(--t02)",    dC:"var(--t01)"     },
    ],
    inference: [
      { name:"AGE",        pct:30 },
      { name:"BMI",        pct:26 },
      { name:"SPO2_NORM",  pct:22 },
      { name:"HR_STABLE",  pct:14 },
      { name:"BP_STABLE",  pct:8  },
    ],
    chartBase: [62, 0.1, 0.16, 0.7],
    hrColor: "var(--t02)",
  },
];

const TIMELINE_EVENTS = [
  { t: "08:00", label: "ADMITTED",         color: "var(--t02)",     left: "4%"  },
  { t: "08:42", label: "ELEV/47\nALERT#1", color: "var(--amber)",   left: "40%" },
  { t: "10:08", label: "CRIT/78\nALERT#3", color: "var(--crimson)", left: "74%" },
];

/* ═══════════════════════════════════════════════════════════════
   CHART DATA GENERATORS
═══════════════════════════════════════════════════════════════ */
function makeChartData(base: number, slope: number | undefined, freq: number | undefined, amp: number | undefined, n = 30) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const totalMins = i * 10;
    const h = Math.floor((12 * 60 + 56 + totalMins) / 60) % 24;
    const m = (56 + totalMins) % 60;
    const t = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    out.push({
      t,
      hr: Math.round(
  base + i * (slope ?? 0) + Math.sin(i * (freq ?? 0)) * (amp ?? 0) + Math.random() * 1.2
),
      spo2: Math.round(98    - i * 0.19  - Math.abs(Math.sin(i * 0.31)) * 1.2),
      temp: +(36.6 + i * 0.056 + Math.sin(i * 0.22) * 0.11).toFixed(1),
      resp: Math.round(18    + i * 0.21  + Math.sin(i * 0.48) * 1.1),
      sbp:  Math.round(128   - i * 0.42  + Math.sin(i * 0.29) * 2.0),
    });
  }
  return out;
}

function makeVStream(
  base: number,
  slope: number,
  freq: number,
  amp: number,
  n: number = 20
) {
  return Array.from({ length: n }, (_, i) => {
    const totalMins = i * 14;
    const h = Math.floor((12 * 60 + 14 + totalMins) / 60) % 24;
    const m = (14 + totalMins) % 60;
    const t = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    const raw = base + i * slope + Math.sin(i * freq) * amp;
    return { t, v: Math.round(raw) };
  });
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function scoreColor(r: number) {
  if (r >= 60) return "var(--crimson)";
  if (r >= 35) return "var(--amber)";
  return "var(--t02)";
}

function patientClass(p: any, activeId: string) {
  const base = p.id === activeId ? " active" : "";
  if (p.risk >= 60) return "patient-row critical" + base;
  if (p.risk >= 35) return "patient-row elevated" + base;
  return "patient-row" + base;
}

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const upd = () => {
      const now = new Date();
      setTime([
        String(now.getHours()).padStart(2,"0"),
        String(now.getMinutes()).padStart(2,"0"),
        String(now.getSeconds()).padStart(2,"0"),
      ].join(":"));
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ═══════════════════════════════════════════════════════════════
   PATIENT INTAKE BAR
═══════════════════════════════════════════════════════════════ */
function PatientIntakeBar() {
  const [open, setOpen] = useState(false);
  const [historyMode, setHistoryMode] = useState("text");
  const [patientId, setPatientId] = useState("");
  const [historyText, setHistoryText] = useState("");
 const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const canSubmit = patientId.trim().length > 0 && (
    historyMode === "text" ? historyText.trim().length > 0 : pdfFile !== null
  );

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setPdfFile(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPdfFile(f);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    console.log("INTAKE SUBMIT", { patientId, historyMode, historyText, pdfFile });
    setPatientId(""); setHistoryText(""); setPdfFile(null); setOpen(false);
  }

  return (
    <div className="intake-bar">
      <div className="intake-bar-collapsed" onClick={() => setOpen(o => !o)}>
        <div className="intake-toggle-icon">
          <span style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"var(--amber)", lineHeight:1 }}>
            {open ? "−" : "+"}
          </span>
        </div>
        <span className="intake-toggle-label">New Patient Intake</span>
        <span className="intake-toggle-hint">
          {open ? "CLICK TO COLLAPSE" : "ENTER PATIENT ID · ATTACH HISTORY"}
        </span>
      </div>

      {open && (
        <div className="intake-form-wrap" onClick={e => e.stopPropagation()}>
          <div className="intake-field-group">
            <span className="intake-field-label">Patient ID</span>
            <input
              className="intake-text-input"
              type="text"
              placeholder="P-009"
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className="intake-divider" />
          <div className="intake-history-group">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span className="intake-field-label">Patient History</span>
              <div className="intake-history-tabs">
                <button className={`intake-tab${historyMode==="text"?" active":""}`} onClick={() => setHistoryMode("text")}>TEXT</button>
                <button className={`intake-tab${historyMode==="pdf"?" active":""}`} onClick={() => setHistoryMode("pdf")}>PDF</button>
              </div>
            </div>
            {historyMode === "text" ? (
              <textarea
                className="intake-textarea"
                placeholder="Enter patient history, comorbidities, medications, prior admissions…"
                value={historyText}
                onChange={e => setHistoryText(e.target.value)}
                spellCheck={false}
              />
            ) : (
              <div
                className={`intake-pdf-zone${dragOver?" drag-over":""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="intake-pdf-input" onChange={handleFileChange} />
                {pdfFile ? (
                  <span className="intake-pdf-filename">▪ {pdfFile.name}</span>
                ) : (
                  <>
                    <div className="intake-pdf-icon" />
                    <span className="intake-pdf-text">DROP PDF · OR <span>CLICK TO BROWSE</span></span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="intake-divider" />
          <div className="intake-submit-group">
            <button className="intake-submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
              REGISTER ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════════════════════ */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}) {  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};
  return (
    <div className="ct-box">
      <div className="ct-time">{label}</div>
      {[["HR",d.hr,"var(--amber)"],["SPO2",d.spo2,"var(--crimson)"],["TEMP",d.temp,"var(--t01)"],["RESP",d.resp,"var(--t02)"],["SBP",d.sbp,"var(--t02)"]].map(([k,v,c]) => (
        <div className="ct-row" key={k}>
          <span className="ct-lbl">{k}:</span>
          <span className="ct-val" style={{ color:c }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   THREAT ARC SVG
═══════════════════════════════════════════════════════════════ */
function ThreatArc({ score, size = 250 }: { score: number; size?: number }) {
  const cx = size/2, cy = size/2, r = size * 0.42;
  const TOTAL_DEG = 210, START_DEG = 195;

  function pxy(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arcPath(sd: number, ed: number) {
    const s = pxy(sd), e = pxy(ed);
    const la = (ed - sd) > 180 ? 1 : 0;
    return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r},0,${la},1,${e.x.toFixed(2)},${e.y.toFixed(2)}`;
  }

  const endDeg = START_DEG + (score / 100) * TOTAL_DEG;
  const ep = pxy(endDeg);
  const color = score >= 60 ? "var(--crimson)" : score >= 30 ? "var(--amber)" : "var(--t02)";
  const circ = 2 * Math.PI * r * (TOTAL_DEG / 360);
  const filled = (score / 100) * circ;
  const severity = score >= 60 ? "CRITICAL" : score >= 30 ? "ELEVATED" : "STABLE";

  return (
    <div className="arc-svg-root" style={{ width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={arcPath(START_DEG, START_DEG+TOTAL_DEG)} fill="none" stroke="var(--l01)" strokeWidth={1.5} strokeLinecap="square" />
        <path
          d={arcPath(START_DEG, endDeg)}
          fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="square"
          style={{ strokeDasharray:circ, strokeDashoffset:circ-filled, transition:"stroke-dashoffset 900ms ease-out" }}
        />
        <rect x={ep.x-5} y={ep.y-5} width={10} height={10} fill={color} />
        {[0,30,60,100].map(tick => {
          const deg = START_DEG + (tick/100)*TOTAL_DEG;
          const p = pxy(deg);
          const off = { x:(p.x-cx)*0.18, y:(p.y-cy)*0.18 };
          return (
            <text key={tick} x={p.x+off.x} y={p.y+off.y} textAnchor="middle" dominantBaseline="middle"
              fill="var(--t02)" fontSize={10} fontFamily="var(--f-mono)" letterSpacing="0.04em">{tick}</text>
          );
        })}
      </svg>
      <div className="arc-center">
        <div className="arc-score" style={{ color }}>{score}</div>
        <div className="arc-sev" style={{ color }}>{severity}</div>
        <div className="arc-idx">RISK INDEX</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VITAL STREAM CHART
═══════════════════════════════════════════════════════════════ */
function VitalStream({
  name,
  unit,
  color,
  currentVal,
  trend,
  base,
  slope,
  freq,
  amp,
}: {
  name: string;
  unit: string;
  color: string;
  currentVal: number;
  trend: number;
  base: number;
  slope: number;
  freq: number;
  amp: number;
}) {
  const data = makeVStream(base, slope, freq, amp);
  const tS = data[0]?.t ?? "";
  const tM = data[Math.floor(data.length/2)]?.t ?? "";
  const tE = data[data.length-1]?.t ?? "";
  return (
    <div className="vital-stream">
      <div className="vs-hd">
        <div className="vs-left">
          <span className="vs-vname">{name}</span>
          <span className="vs-unit">┊ {unit}</span>
        </div>
        <div className="vs-right">
          <span className="vs-val" style={{ color }}>{currentVal}</span>
          <span className="vs-trend" style={{ color }}>{trend}</span>
        </div>
      </div>
      <div className="vs-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.8} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="vs-times">
        <span className="vs-time">{tS}</span>
        <span className="vs-time">{tM}</span>
        <span className="vs-time">{tE} ▶</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPORAL TABLE
═══════════════════════════════════════════════════════════════ */
function TemporalTable({ rows }: { rows: any[] }) {
  return (
    <>
      <div className="panel-hd">
        <div>
          <div className="panel-title">TEMPORAL ANALYSIS</div>
          <div className="panel-sub">WINDOW: 6 RDG · 6HR EQUIV</div>
        </div>
      </div>
      <div className="tbl-head-row">
        <span className="tbl-hd">PARAM</span>
        <span className="tbl-hd">SLOPE</span>
        <span className="tbl-hd">ACCEL</span>
        <span className="tbl-hd tbl-r">ΔBASE</span>
      </div>
      {rows.map(r => (
        <div className="tbl-row" key={r.param}>
          <span className="tbl-param">{r.param}</span>
          <span className="tbl-val" style={{ color:r.sC }}>{r.slope}</span>
          <span className="tbl-val" style={{ color:r.aC }}>{r.accel}</span>
          <span className="tbl-val tbl-r" style={{ color:r.dC }}>{r.delta}</span>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HISTORY BRIEF
═══════════════════════════════════════════════════════════════ */
function HistoryBrief({ cells }: { cells: [string, string][] }) {
  return (
    <>
      <div className="panel-hd">
        <div className="panel-title">HISTORY BRIEF</div>
      </div>
      <div className="hist-grid">
        {cells.map(([k,v]) => (
          <div className="hist-cell" key={k}>
            <div className="hist-key">{k}</div>
            <div className="hist-val">{v}</div>
          </div>
        ))}
      </div>
      <div className="hist-source">SOURCE: PDF UPLOAD · PROCESSED 07MAY26 14:41</div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CHART
═══════════════════════════════════════════════════════════════ */
function MainChart({ patient, color }: { patient: any; color: string }) {
  const chartData = makeChartData(...(patient.chartBase as [number, number, number, number]));
  return (
    <div className="panel">
      <div className="panel-hd">
        <div>
          <div className="panel-title">COMPREHENSIVE VITAL ANALYSIS</div>
          <div className="panel-sub">PATIENT: {patient.name} · SYNCHRONIZED MULTI-PARAMETER VIEW</div>
        </div>
        <div className="legend">
          {[["HR","var(--amber)"],["SPO2","var(--crimson)"],["TEMP","var(--t01)"],["RESP","var(--t02)"],["SBP","var(--t02)"]].map(([l,c]) => (
            <div className="legend-item" key={l}>
              <div className="legend-line" style={{ background:c }} />
              <span className="legend-lbl">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height:360, padding:"16px 20px 10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top:6, right:8, bottom:0, left:0 }}>
            <defs>
              <linearGradient id="fillHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4810A" stopOpacity={0.40} />
                <stop offset="100%" stopColor="#D4810A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{ fontFamily:"var(--f-mono)", fontSize:10, fill:"var(--t02)" }} axisLine={{ stroke:"var(--l01)" }} tickLine={false} interval={4} />
            <YAxis tick={{ fontFamily:"var(--f-mono)", fontSize:10, fill:"var(--t02)" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="hr" stroke="#D4810A" strokeWidth={2} fill="url(#fillHr)" dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="stats-strip">
        {[
          ["HR VOLATILITY",  "HIGH",      "var(--crimson)"],
          ["SPO2 TREND",     "DECLINING", "var(--crimson)"],
          ["TEMP STABILITY", "UNSTABLE",  "var(--amber)"],
          ["RESP PATTERN",   "IRREGULAR", "var(--amber)"],
          ["BP VARIANCE",    "NORMAL",    "var(--t01)"],
        ].map(([lbl,val,col]) => (
          <div className="stat-cell" key={lbl}>
            <div className="stat-lbl">{lbl}</div>
            <div className="stat-val" style={{ color:col }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INFERENCE PANEL
═══════════════════════════════════════════════════════════════ */
function InferencePanel({
  patient,
  clock,
}: {
  patient: any;
  clock: string;
}) {
  return (
    <div className="panel" style={{ display:"flex", flexDirection:"column" }}>
      <div className="arc-wrap">
        <span className="arc-label">THREAT ARC</span>
        <ThreatArc score={patient.risk} size={250} />
      </div>
      <div className="inf-wrap">
        <div className="inf-title">INFERENCE PANEL</div>
        <div className="inf-sub">PRIMARY DRIVERS</div>
        {patient.inference.map((d: any) => (
          <div className="inf-row" key={d.name}>
            <span className="inf-name">{d.name}</span>
            <div className="inf-bar-bg">
              <div className="inf-bar-fill" style={{ width:`${d.pct * 3.0}%` }} />
            </div>
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
function VitalStreamsPanel({
  patient,
}: {
  patient: any;
}) {  const [base, slope, freq, amp] = patient.chartBase;
  const vitals = patient.vitals;
  const streams = [
    { name:"HR",   unit:"BPM", color:patient.hrColor,      val:vitals.hr,   trend:"▲", b:base,    s:slope,     f:freq,    a:amp   },
    { name:"SPO2", unit:"PCT", color:"var(--crimson)",      val:vitals.spo2, trend:"▼", b:98,      s:-0.19,     f:0.31,    a:1.2   },
    { name:"TEMP", unit:"°C",  color:"var(--crimson)",      val:vitals.temp, trend:"▲", b:36.6,    s:0.056,     f:0.22,    a:0.11  },
    { name:"RESP", unit:"RPM", color:"var(--amber)",        val:vitals.resp, trend:"▲", b:18,      s:0.21,      f:0.48,    a:1.0   },
    { name:"SBP",  unit:"MM",  color:"var(--t01)",          val:vitals.sbp,  trend:"▼", b:128,     s:-0.42,     f:0.29,    a:1.8   },
  ];
  return (
    <div className="panel">
      <div className="panel-hd">
        <div className="panel-title">VITAL STREAM CHARTS</div>
      </div>
      {streams.map(s => (
        <VitalStream key={s.name} name={s.name} unit={s.unit} color={s.color}
          currentVal={+s.val} trend={+s.trend} base={+s.b} slope={+s.s} freq={+s.f} amp={+s.a} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHART VIEW
═══════════════════════════════════════════════════════════════ */
function ChartView({
  patient,
  clock,
}: {
  patient: any;
  clock: string;
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div className="section">
       <MainChart patient={patient} color="#4ADE80" />
      </div>
      <div className="section">
        <div className="two-col">
          <div className="panel"><TemporalTable rows={patient.temporal} /></div>
          <div className="panel"><HistoryBrief cells={patient.history} /></div>
        </div>
      </div>
      <div className="section">
        <div className="two-col">
          <VitalStreamsPanel patient={patient} />
          <InferencePanel patient={patient} clock={clock} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMMAND VIEW
═══════════════════════════════════════════════════════════════ */
function CommandView({
  patient,
  clock,
}: {
  patient: any;
  clock: string;
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div className="section">
        <div className="three-col">
          <div className="panel"><TemporalTable rows={patient.temporal} /></div>
          <div className="panel"><HistoryBrief cells={patient.history} /></div>
          <InferencePanel patient={patient} clock={clock} />
        </div>
      </div>
      <div className="section">
        <MainChart patient={patient} color="#4ADE80" />
      </div>
      <div className="section">
        <VitalStreamsPanel patient={patient} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════════ */
function Timeline() {
  return (
    <div className="timeline">
      <div className="tl-track">
        <span className="tl-now">NOW <span className="tl-now-cursor" /></span>
      </div>
      <div className="tl-events">
        {TIMELINE_EVENTS.map(ev => (
          <div className="tl-event" key={ev.t} style={{ left:ev.left }}>
            <div className="tl-dot" style={{ background:ev.color, borderColor:ev.color }} />
            <span className="tl-etime">{ev.t}</span>
            <span className="tl-elbl" style={{ color:ev.color }}>{ev.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const clock = useClock();
  const [activeId, setActiveId] = useState("P-001");
  const [view, setView] = useState("chart");

  const patient = PATIENTS.find(p => p.id === activeId) ?? PATIENTS[0];
  const statusColor = scoreColor(patient.risk);
  const criticalCount = PATIENTS.filter(p => p.status === "CRITICAL").length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vigil-shell">
        <div className="vigil-bg-grid" />

        {/* ── TOPBAR ──────────────────────── */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="tb-label">SP-1</span>
            <div className="tb-div" />
            <span className="tb-vigil">SENTRI</span>
            <div className="tb-dot" />
            <span className="tb-amber">▲ +{criticalCount}</span>
          </div>
          <div className="topbar-mid">
            <div className="tb-live-dot" />
            <span style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"var(--amber)", letterSpacing:"0.16em" }}>
              LIVE ICU NETWORK
            </span>
          </div>
          <div className="topbar-right">
            <span className="tb-label">UNIT 3B · ICU</span>
            <div className="tb-div" />
            <span className="tb-crit">{criticalCount} CRITICAL</span>
            <div className="tb-div" />
            <span className="tb-label">{clock}</span>
          </div>
        </header>

        {/* ── INTAKE BAR ──────────────────── */}
        <PatientIntakeBar />

        {/* ── BODY ────────────────────────── */}
        <div className="vigil-body">

          {/* ── RAIL ──────────────────────── */}
          <aside className="rail">
            <div className="rail-header">
              <span className="rail-unit">UNIT 3B · ICU</span>
              <span className="rail-time">{clock}</span>
            </div>
            <div className="rail-patients">
              {PATIENTS.map((p, i) => (
                <div
                  key={p.id}
                  className={patientClass(p, activeId)}
                  style={{ animationDelay:`${i * 40}ms` }}
                  onClick={() => setActiveId(p.id)}
                >
                  <div className="pr-top">
                    <span className="pr-id">{p.id}</span>
                    <span className="pr-score" style={{ color:scoreColor(p.risk) }}>{p.risk}</span>
                  </div>
                  <div className="pr-name">{p.name}</div>
                  <div className="pr-meta">{p.gender} / {p.age} · {p.bed}</div>
                  <div className="pr-status" style={{ color:scoreColor(p.risk) }}>{p.status}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── WORKSPACE ─────────────────── */}
          <main className="workspace">

            {/* Status band */}
            <div className="status-band">
              <div className="sb-meta">
                <span className="sb-item">{patient.id}</span>
                <div className="sb-sep" />
                <span className="sb-name">{patient.name}</span>
                <div className="sb-sep" />
                <span className="sb-item">{patient.age}Y</span>
                <div className="sb-sep" />
                <span className="sb-item">{patient.bed}</span>
                <div className="sb-sep" />
                <span className="sb-item">ADM: {patient.admitted}</span>
              </div>
              <div className="sb-right">
                <span className="sb-score" style={{ color:statusColor }}>{patient.risk}</span>
                <span className="sb-sev" style={{ color:statusColor }}>{patient.status}</span>
              </div>
            </div>

            {/* Alert strip */}
            <div className="alert-strip">
              <div className="alert-icon" />
              <span className="alert-text">{patient.alert}</span>
            </div>

            {/* View tabs */}
            <div className="view-tabs">
              {[
                { key:"chart",   label:"CHART VIEW"   },
                { key:"command", label:"COMMAND VIEW"  },
              ].map(({ key, label }) => (
                <button key={key} className={`view-tab${view===key?" active":""}`} onClick={() => setView(key)}>
                  {label}
                </button>
              ))}
            </div>

            {/* Canvas */}
            <div style={{ flex:1, paddingBottom:24 }}>
              {view === "chart"   && <ChartView   patient={patient} clock={clock} />}
              {view === "command" && <CommandView patient={patient} clock={clock} />}
            </div>

            {/* Timeline */}
            <Timeline />

            {/* Bottom bar */}
            <footer className="bottombar">
              <div className="bb-keys">
                {["↑↓ NAV","ENTER SELECT","F9 ACK","F10 EXPAND","SPACE PAUSE","←→ PAN"].map((k, i, a) => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <span className="bb-key">{k}</span>
                    {i < a.length - 1 && <div className="bb-sep" />}
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