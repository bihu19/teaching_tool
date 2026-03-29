"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

const G = 9.81;

export default function EnergyPage() {
  const { t } = useLang();

  /* ---- user controls ---- */
  const [height, setHeight] = useState(20);
  const [v0, setV0] = useState(0); // initial downward speed (m/s)
  const [mass, setMass] = useState(1);

  /* ---- animation state ---- */
  const [playing, setPlaying] = useState(false);
  const [curY, setCurY] = useState(20); // current height
  const [curV, setCurV] = useState(0); // current speed
  const [curT, setCurT] = useState(0);

  const playingRef = useRef(false);
  const tRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const animRef = useRef(0);
  const paramsRef = useRef({ height: 20, v0: 0, mass: 1 });

  useEffect(() => {
    paramsRef.current = { height, v0, mass };
  }, [height, v0, mass]);

  /* ---- energy calculations ---- */
  const totalE = mass * G * height + 0.5 * mass * v0 * v0;
  const pe = mass * G * Math.max(0, curY);
  const ke = Math.max(0, totalE - pe);
  const speed = curV;

  /* ---- animation loop ---- */
  const tick = useCallback((ts: number) => {
    if (!playingRef.current) return;
    if (lastTsRef.current === null) lastTsRef.current = ts;
    const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
    lastTsRef.current = ts;
    tRef.current += dt;

    const { height: h, v0: iv } = paramsRef.current;
    const tt = tRef.current;

    // y(t) = h - v0*t - 0.5*g*t²
    const y = h - iv * tt - 0.5 * G * tt * tt;
    const v = iv + G * tt;

    if (y <= 0) {
      // hit ground
      setCurY(0);
      setCurV(Math.sqrt(iv * iv + 2 * G * h));
      setCurT(tt);
      playingRef.current = false;
      setPlaying(false);
      return;
    }

    setCurY(y);
    setCurV(v);
    setCurT(tt);
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const togglePlay = () => {
    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
    } else {
      playingRef.current = true;
      setPlaying(true);
      lastTsRef.current = null;
      animRef.current = requestAnimationFrame(tick);
    }
  };

  const resetSim = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    playingRef.current = false;
    setPlaying(false);
    tRef.current = 0;
    lastTsRef.current = null;
    setCurY(height);
    setCurV(v0);
    setCurT(0);
  }, [height, v0]);

  useEffect(() => {
    resetSim();
  }, [height, v0, mass, resetSim]);

  /* ---- SVG constants ---- */
  const COL_H = 360; // column height in SVG
  const COL_W = 80;
  const SVG_W = 340;
  const SVG_H = COL_H + 60;
  const TOP_Y = 30;
  const BOT_Y = TOP_Y + COL_H;
  const BALL_R = 14;

  // Map height to SVG y
  const maxH = Math.max(height, 1);
  const ballSvgY = BOT_Y - (curY / maxH) * COL_H;

  // Energy bar dimensions
  const BAR_W = 40;
  const BAR_MAX_H = COL_H;
  const maxE = Math.max(totalE, 0.01);
  const peBarH = (pe / maxE) * BAR_MAX_H;
  const keBarH = (ke / maxE) * BAR_MAX_H;
  const teBarH = (totalE / maxE) * BAR_MAX_H;

  // Time to hit ground (for progress bar)
  const tHit = (-v0 + Math.sqrt(v0 * v0 + 2 * G * height)) / G;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>&rsaquo;</span>
        <span>{t("พลังงาน", "Energy")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        ⚡ {t("พลังงานในการตกอิสระ", "Free Fall Energy")}
      </h1>

      {/* Formulas */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          PE = <span className="font-medium text-[#3b82f6]">mgh</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          KE = <span className="font-medium text-[#f59e0b]">½mv²</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          E<sub>total</sub> = <span className="font-medium text-[#22c55e]">PE + KE = {t("คงที่", "const")}</span>
        </span>
      </div>

      {/* Controls */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ตั้งค่า", "Settings")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ความสูง h (เมตร)", "Height h (m)")}
          </label>
          <input type="range" min={1} max={100} step={1} value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full mb-1" />
          <input type="number" value={height} min={1} max={500} step={1}
            onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ความเร็วเริ่มต้น v₀ (m/s) ↓", "Initial velocity v₀ (m/s) ↓")}
          </label>
          <input type="range" min={0} max={30} step={0.5} value={v0}
            onChange={(e) => setV0(Number(e.target.value))}
            className="w-full mb-1" />
          <input type="number" value={v0} min={0} max={100} step={0.5}
            onChange={(e) => setV0(Math.max(0, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("มวล m (กิโลกรัม)", "Mass m (kg)")}
          </label>
          <input type="number" value={mass} min={0.1} max={100} step={0.1}
            onChange={(e) => setMass(Math.max(0.1, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button onClick={togglePlay}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 active:scale-[0.98]">
          {playing
            ? t("⏸ หยุด", "⏸ Pause")
            : curT > 0 && curY > 0
            ? t("▶ ต่อ", "▶ Resume")
            : t("▶ ปล่อยลูกบอล", "▶ Drop Ball")}
        </button>
        <button onClick={resetSim}
          className="px-5 py-2 rounded-lg text-sm border border-[var(--card-border)] hover:bg-[var(--card-bg)] active:scale-[0.98]">
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
      </div>

      {/* Visualization: ball column + energy bars */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-4 overflow-x-auto">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto max-h-[480px] mx-auto" style={{ maxWidth: 400 }}>
          {/* ===== HEIGHT COLUMN ===== */}
          {/* vertical scale */}
          <line x1={60} y1={TOP_Y} x2={60} y2={BOT_Y} stroke="var(--card-border)" strokeWidth={1} />
          {/* height ticks */}
          {Array.from({ length: 6 }).map((_, i) => {
            const frac = i / 5;
            const sy = BOT_Y - frac * COL_H;
            const hVal = frac * maxH;
            return (
              <g key={i}>
                <line x1={55} y1={sy} x2={60} y2={sy} stroke="var(--muted)" strokeWidth={1} />
                <text x={50} y={sy + 4} textAnchor="end" fontSize={9} fill="var(--muted)">
                  {hVal.toFixed(0)} m
                </text>
              </g>
            );
          })}

          {/* Ground */}
          <line x1={40} y1={BOT_Y} x2={120} y2={BOT_Y} stroke="var(--foreground)" strokeWidth={2} />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={50 + i * 16} y1={BOT_Y} x2={44 + i * 16} y2={BOT_Y + 10}
              stroke="var(--muted)" strokeWidth={1} opacity={0.5} />
          ))}

          {/* Ball */}
          <circle cx={80} cy={ballSvgY} r={BALL_R}
            fill="#ef4444" stroke="#dc2626" strokeWidth={2} />
          <text x={80} y={ballSvgY + 1} textAnchor="middle" dominantBaseline="central"
            fontSize={8} fill="white" fontWeight={700}>
            {mass}kg
          </text>

          {/* Velocity arrow */}
          {curV > 0.5 && (
            <g>
              <line x1={80} y1={ballSvgY + BALL_R + 2}
                x2={80} y2={ballSvgY + BALL_R + 2 + Math.min(50, curV * 2)}
                stroke="#f59e0b" strokeWidth={2.5} />
              <polygon
                points={`${80},${ballSvgY + BALL_R + 2 + Math.min(50, curV * 2) + 6} ${75},${ballSvgY + BALL_R + 2 + Math.min(50, curV * 2) - 2} ${85},${ballSvgY + BALL_R + 2 + Math.min(50, curV * 2) - 2}`}
                fill="#f59e0b" />
            </g>
          )}

          {/* Height label */}
          <text x={80} y={ballSvgY - BALL_R - 8} textAnchor="middle"
            fontSize={10} fill="var(--foreground)" fontWeight={500}>
            h = {curY.toFixed(1)} m
          </text>

          {/* ===== ENERGY BARS ===== */}
          {/* PE bar */}
          <rect x={160} y={BOT_Y - peBarH} width={BAR_W} height={Math.max(0, peBarH)}
            fill="#3b82f6" fillOpacity={0.7} rx={3} />
          <text x={180} y={BOT_Y + 16} textAnchor="middle" fontSize={10}
            fill="#3b82f6" fontWeight={600}>PE</text>
          <text x={180} y={BOT_Y - peBarH - 6} textAnchor="middle" fontSize={9}
            fill="#3b82f6" fontWeight={500}>
            {pe.toFixed(1)} J
          </text>

          {/* KE bar */}
          <rect x={210} y={BOT_Y - keBarH} width={BAR_W} height={Math.max(0, keBarH)}
            fill="#f59e0b" fillOpacity={0.7} rx={3} />
          <text x={230} y={BOT_Y + 16} textAnchor="middle" fontSize={10}
            fill="#f59e0b" fontWeight={600}>KE</text>
          <text x={230} y={BOT_Y - keBarH - 6} textAnchor="middle" fontSize={9}
            fill="#f59e0b" fontWeight={500}>
            {ke.toFixed(1)} J
          </text>

          {/* Total E bar */}
          <rect x={260} y={BOT_Y - teBarH} width={BAR_W} height={Math.max(0, teBarH)}
            fill="#22c55e" fillOpacity={0.3} stroke="#22c55e" strokeWidth={1.5}
            strokeDasharray="4 3" rx={3} />
          <text x={280} y={BOT_Y + 16} textAnchor="middle" fontSize={10}
            fill="#22c55e" fontWeight={600}>E<tspan fontSize={7} dy={2}>total</tspan></text>
          <text x={280} y={BOT_Y - teBarH - 6} textAnchor="middle" fontSize={9}
            fill="#22c55e" fontWeight={500}>
            {totalE.toFixed(1)} J
          </text>

          {/* Stacked bar (PE + KE) */}
          <rect x={310} y={BOT_Y - peBarH} width={14} height={Math.max(0, peBarH)}
            fill="#3b82f6" fillOpacity={0.6} rx={2} />
          <rect x={310} y={BOT_Y - peBarH - keBarH} width={14} height={Math.max(0, keBarH)}
            fill="#f59e0b" fillOpacity={0.6} rx={2} />
          <text x={317} y={BOT_Y + 16} textAnchor="middle" fontSize={7}
            fill="var(--muted)">PE+KE</text>

          {/* Bar baseline */}
          <line x1={155} y1={BOT_Y} x2={330} y2={BOT_Y} stroke="var(--foreground)" strokeWidth={1} />
        </svg>
      </div>

      {/* Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("เวลา (t)", "Time (t)")}</div>
          <div className="text-lg font-medium">{curT.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">{t("วินาที", "seconds")}</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ความสูง (h)", "Height (h)")}</div>
          <div className="text-lg font-medium">{curY.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">{t("เมตร", "m")}</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[#3b82f6] mb-0.5 font-medium">PE (mgh)</div>
          <div className="text-lg font-medium text-[#3b82f6]">{pe.toFixed(1)}</div>
          <div className="text-[10px] text-[var(--muted)]">J</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[#f59e0b] mb-0.5 font-medium">KE (½mv²)</div>
          <div className="text-lg font-medium text-[#f59e0b]">{ke.toFixed(1)}</div>
          <div className="text-[10px] text-[var(--muted)]">J</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--accent)] rounded-xl p-3">
          <div className="text-[10px] text-[#22c55e] mb-0.5 font-medium">E<sub>total</sub></div>
          <div className="text-lg font-bold text-[#22c55e]">{totalE.toFixed(1)}</div>
          <div className="text-[10px] text-[var(--muted)]">J ({t("คงที่", "const")})</div>
        </div>
      </div>

      {/* Speed & extra readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ความเร็ว (v)", "Speed (v)")}</div>
          <div className="text-lg font-medium">{speed.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">m/s</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("เวลาตกถึงพื้น", "Time to ground")}</div>
          <div className="text-lg font-medium">{tHit.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">{t("วินาที", "seconds")}</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ความเร็วกระทบพื้น", "Impact speed")}</div>
          <div className="text-lg font-medium">{Math.sqrt(v0 * v0 + 2 * G * height).toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">m/s</div>
        </div>
      </div>

      {/* Energy conservation explanation */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-5">
        <div className="text-xs font-medium mb-2">
          {t("กฎการอนุรักษ์พลังงาน", "Conservation of Energy")}
        </div>
        <div className="text-sm text-[var(--muted)] space-y-1">
          <p>
            {t(
              "ในการตกอิสระ (ไม่มีแรงต้านอากาศ) พลังงานรวมของระบบคงที่ตลอดเวลา เมื่อลูกบอลตกลงมา พลังงานศักย์ (PE) จะเปลี่ยนไปเป็นพลังงานจลน์ (KE)",
              "In free fall (no air resistance), the total energy of the system remains constant. As the ball falls, potential energy (PE) converts to kinetic energy (KE)."
            )}
          </p>
          <p className="font-mono text-xs pt-1">
            <span className="text-[#3b82f6]">PE<sub>i</sub></span> +{" "}
            <span className="text-[#f59e0b]">KE<sub>i</sub></span> ={" "}
            <span className="text-[#3b82f6]">PE<sub>f</sub></span> +{" "}
            <span className="text-[#f59e0b]">KE<sub>f</sub></span> ={" "}
            <span className="text-[#22c55e] font-bold">{totalE.toFixed(1)} J</span>
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#3b82f6] opacity-70" />
          {t("พลังงานศักย์ (PE)", "Potential Energy (PE)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#f59e0b] opacity-70" />
          {t("พลังงานจลน์ (KE)", "Kinetic Energy (KE)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#22c55e] opacity-30 border border-[#22c55e]" />
          {t("พลังงานรวม (E)", "Total Energy (E)")}
        </div>
      </div>
    </div>
  );
}
