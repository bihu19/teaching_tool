"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

// ---------- physics helpers ----------
const DEG = Math.PI / 180;

type Point = { t: number; x: number; y: number; vx: number; vy: number };

function simulateIdeal(
  h0: number, v0: number, angle: number, g: number
): Point[] {
  const vx0 = v0 * Math.cos(angle * DEG);
  const vy0 = v0 * Math.sin(angle * DEG);
  const pts: Point[] = [];
  const dt = 0.01;
  for (let t = 0; t < 200; t += dt) {
    const x = vx0 * t;
    const y = h0 + vy0 * t - 0.5 * g * t * t;
    if (y < 0 && t > 0) {
      // interpolate landing
      const tPrev = t - dt;
      const yPrev = h0 + vy0 * tPrev - 0.5 * g * tPrev * tPrev;
      const tLand = tPrev + dt * (yPrev / (yPrev - y));
      pts.push({
        t: tLand,
        x: vx0 * tLand,
        y: 0,
        vx: vx0,
        vy: vy0 - g * tLand,
      });
      break;
    }
    pts.push({ t, x, y, vx: vx0, vy: vy0 - g * t });
  }
  return pts;
}

function simulateDrag(
  h0: number, v0: number, angle: number, g: number,
  mass: number, dragCoeff: number
): Point[] {
  const dt = 0.005;
  let x = 0, y = h0;
  let vx = v0 * Math.cos(angle * DEG);
  let vy = v0 * Math.sin(angle * DEG);
  const pts: Point[] = [{ t: 0, x, y, vx, vy }];
  const k = dragCoeff; // F_drag = -k * v  (linear drag for simplicity)

  for (let i = 1; i < 60000; i++) {
    const t = i * dt;
    const speed = Math.sqrt(vx * vx + vy * vy);
    const ax = -(k / mass) * vx;
    const ay = -g - (k / mass) * vy;
    // semi-implicit Euler
    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;

    if (y < 0) {
      // interpolate
      const prev = pts[pts.length - 1];
      const frac = prev.y / (prev.y - y);
      pts.push({
        t: prev.t + dt * frac,
        x: prev.x + (x - prev.x) * frac,
        y: 0,
        vx, vy,
      });
      break;
    }
    // subsample for rendering
    if (i % 4 === 0) pts.push({ t, x, y, vx, vy });
  }
  return pts;
}

// ---------- component ----------
export default function ProjectilePage() {
  const { t } = useLang();

  // parameters
  const [h0, setH0] = useState(0);
  const [v0, setV0] = useState(25);
  const [angle, setAngle] = useState(45);
  const [g, setG] = useState(9.81);
  const [mass, setMass] = useState(1);
  const [dragCoeff, setDragCoeff] = useState(0);
  const [showDrag, setShowDrag] = useState(false);

  // animation
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const playingRef = useRef(false);
  const progressRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const animRef = useRef(0);

  // canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // compute trajectories
  const ideal = simulateIdeal(h0, v0, angle, g);
  const drag = showDrag && dragCoeff > 0
    ? simulateDrag(h0, v0, angle, g, mass, dragCoeff)
    : null;

  const totalTime = ideal[ideal.length - 1]?.t ?? 1;
  const dragTime = drag ? drag[drag.length - 1]?.t ?? 1 : totalTime;
  const maxTime = Math.max(totalTime, dragTime);

  // derived stats (ideal)
  const vy0 = v0 * Math.sin(angle * DEG);
  const vx0 = v0 * Math.cos(angle * DEG);
  const tPeak = vy0 / g;
  const maxHeight = h0 + vy0 * tPeak - 0.5 * g * tPeak * tPeak;
  const range = ideal[ideal.length - 1]?.x ?? 0;

  // current point by progress
  function getPointAt(pts: Point[], prog: number): Point {
    const tTarget = prog * (pts[pts.length - 1]?.t ?? 0);
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].t >= tTarget) {
        const p = pts[i - 1], n = pts[i];
        const f = (tTarget - p.t) / (n.t - p.t || 1);
        return {
          t: tTarget,
          x: p.x + (n.x - p.x) * f,
          y: p.y + (n.y - p.y) * f,
          vx: p.vx + (n.vx - p.vx) * f,
          vy: p.vy + (n.vy - p.vy) * f,
        };
      }
    }
    return pts[pts.length - 1] ?? { t: 0, x: 0, y: 0, vx: 0, vy: 0 };
  }

  const curIdeal = getPointAt(ideal, progress);
  const curDrag = drag ? getPointAt(drag, Math.min(progress * totalTime / dragTime, 1)) : null;

  // ---------- drawing ----------
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const W = container.clientWidth;
    const H = 340;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const axisColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
    const textColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

    // bounds
    const allPts = drag ? [...ideal, ...drag] : ideal;
    let maxX = Math.max(...allPts.map(p => p.x), 1);
    let maxY = Math.max(...allPts.map(p => p.y), 1);
    maxX *= 1.1; maxY *= 1.15;

    const pad = { l: 50, r: 20, t: 20, b: 40 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;

    const sx = (x: number) => pad.l + (x / maxX) * pw;
    const sy = (y: number) => pad.t + ph - (y / maxY) * ph;

    // grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    const xStep = niceStep(maxX, 6);
    const yStep = niceStep(maxY, 5);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = textColor;
    for (let v = 0; v <= maxX; v += xStep) {
      const px = sx(v);
      ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, pad.t + ph); ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(v.toFixed(v >= 100 ? 0 : 1), px, pad.t + ph + 14);
    }
    for (let v = 0; v <= maxY; v += yStep) {
      const py = sy(v);
      ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(pad.l + pw, py); ctx.stroke();
      ctx.textAlign = "right";
      ctx.fillText(v.toFixed(v >= 100 ? 0 : 1), pad.l - 5, py + 3);
    }

    // axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ph); ctx.lineTo(pad.l + pw, pad.t + ph); ctx.stroke();

    // axis labels
    ctx.fillStyle = textColor;
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("x (m)", pad.l + pw / 2, H - 4);
    ctx.save();
    ctx.translate(12, pad.t + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("y (m)", 0, 0);
    ctx.restore();

    // ground
    ctx.fillStyle = isDark ? "rgba(134,239,172,0.08)" : "rgba(134,239,172,0.15)";
    ctx.fillRect(pad.l, sy(0), pw, pad.t + ph - sy(0));

    // initial height indicator
    if (h0 > 0) {
      ctx.strokeStyle = isDark ? "rgba(251,191,36,0.3)" : "rgba(251,191,36,0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(sx(0), sy(h0)); ctx.lineTo(sx(0), sy(0)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`h₀=${h0}m`, sx(0) + 4, sy(h0) + 4);
    }

    // draw trajectory — ideal
    drawPath(ctx, ideal, sx, sy, "#3b82f6", 2.5);

    // draw trajectory — drag
    if (drag) {
      drawPath(ctx, drag, sx, sy, "#ef4444", 2, [6, 4]);
    }

    // current position dots
    const prog = progressRef.current;
    const ci = getPointAt(ideal, prog);
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath(); ctx.arc(sx(ci.x), sy(ci.y), 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(sx(ci.x), sy(ci.y), 2.5, 0, Math.PI * 2); ctx.fill();

    if (drag) {
      const cd = getPointAt(drag, Math.min(prog * totalTime / dragTime, 1));
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(sx(cd.x), sy(cd.y), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(sx(cd.x), sy(cd.y), 2.5, 0, Math.PI * 2); ctx.fill();
    }

    // velocity vector on ideal
    const vScale = 0.6;
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx(ci.x), sy(ci.y));
    ctx.lineTo(sx(ci.x) + ci.vx * vScale, sy(ci.y) - ci.vy * vScale);
    ctx.stroke();
    // arrowhead
    const aLen = 6;
    const aAngle = Math.atan2(-ci.vy * vScale, ci.vx * vScale);
    const tipX = sx(ci.x) + ci.vx * vScale;
    const tipY = sy(ci.y) - ci.vy * vScale;
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - aLen * Math.cos(aAngle - 0.4), tipY - aLen * Math.sin(aAngle - 0.4));
    ctx.lineTo(tipX - aLen * Math.cos(aAngle + 0.4), tipY - aLen * Math.sin(aAngle + 0.4));
    ctx.fill();

    // legend
    const lx = pad.l + 10;
    const ly = pad.t + 14;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(lx, ly - 4, 16, 3);
    ctx.fillText(t("ไม่มีแรงต้าน", "No drag"), lx + 22, ly);
    if (drag) {
      ctx.fillStyle = "#ef4444";
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(lx, ly + 16); ctx.lineTo(lx + 16, ly + 16); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(t("มีแรงต้านอากาศ", "With air drag"), lx + 22, ly + 20);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideal, drag, h0, t]);

  function drawPath(
    ctx: CanvasRenderingContext2D, pts: Point[],
    sx: (x: number) => number, sy: (y: number) => number,
    color: string, lineW: number, dash?: number[]
  ) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    pts.forEach((p, i) => {
      const px = sx(p.x), py = sy(p.y);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
    if (dash) ctx.setLineDash([]);
  }

  function niceStep(range: number, targetTicks: number): number {
    const rough = range / targetTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    const res = rough / mag;
    if (res <= 1) return mag;
    if (res <= 2) return 2 * mag;
    if (res <= 5) return 5 * mag;
    return 10 * mag;
  }

  // ---------- animation loop ----------
  const tick = useCallback((ts: number) => {
    if (!playingRef.current) return;
    if (lastTsRef.current === null) lastTsRef.current = ts;
    const elapsed = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;
    const speed = 1 / Math.max(maxTime, 1); // real-time playback
    progressRef.current = Math.min(1, progressRef.current + elapsed * speed);
    setProgress(progressRef.current);
    draw();
    if (progressRef.current >= 1) {
      playingRef.current = false;
      setPlaying(false);
    } else {
      animRef.current = requestAnimationFrame(tick);
    }
  }, [maxTime, draw]);

  const togglePlay = () => {
    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
    } else {
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        setProgress(0);
      }
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
    progressRef.current = 0;
    lastTsRef.current = null;
    setProgress(0);
  }, []);

  // redraw on param change
  useEffect(() => {
    resetSim();
    // small delay so canvas size is settled
    const id = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(id);
  }, [h0, v0, angle, g, mass, dragCoeff, showDrag, draw, resetSim]);

  // resize
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  // ---------- slider helper ----------
  function Slider({
    label, value, onChange, min, max, step, unit, symbol,
  }: {
    label: string; value: number; onChange: (v: number) => void;
    min: number; max: number; step: number; unit: string; symbol: string;
  }) {
    return (
      <div className="flex items-center gap-3 mb-2">
        <label className="text-xs text-[var(--muted)] w-40 shrink-0">
          <span className="font-medium text-[var(--foreground)]">{symbol}</span> {label}
        </label>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="flex-1"
        />
        <span className="text-xs font-medium min-w-[60px] text-right">{value} {unit}</span>
      </div>
    );
  }

  const speedTotal = Math.sqrt(curIdeal.vx * curIdeal.vx + curIdeal.vy * curIdeal.vy);

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>›</span>
        <span>{t("โพรเจกไทล์", "Projectile Motion")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-2">
        🎯 {t("การเคลื่อนที่แบบโพรเจกไทล์", "Projectile Motion")}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        {t(
          "จำลองการเคลื่อนที่แบบโพรเจกไทล์ ปรับมุม ความเร็ว ความสูง และแรงต้านอากาศได้",
          "Simulate projectile motion. Adjust angle, velocity, height, and air resistance."
        )}
      </p>

      {/* Equations */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          x = <span className="font-medium text-[var(--foreground)]">v₀cos(θ)·t</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          y = <span className="font-medium text-[var(--foreground)]">h₀ + v₀sin(θ)·t − ½gt²</span>
        </span>
        {showDrag && dragCoeff > 0 && (
          <span className="bg-red-50 dark:bg-red-950 rounded-full px-3 py-1 text-xs font-mono text-red-600 dark:text-red-400">
            F<sub>drag</sub> = <span className="font-medium">−k·v</span>
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-4 mb-4">
        <p className="text-xs text-[var(--muted)] font-medium mb-3">{t("ตั้งค่าพารามิเตอร์", "Parameters")}</p>
        <Slider
          label={t("ความเร็วเริ่มต้น", "Initial Velocity")}
          symbol="v₀" value={v0} onChange={setV0}
          min={1} max={80} step={1} unit="m/s"
        />
        <Slider
          label={t("มุมยิง", "Launch Angle")}
          symbol="θ" value={angle} onChange={setAngle}
          min={0} max={90} step={1} unit="°"
        />
        <Slider
          label={t("ความสูงเริ่มต้น", "Initial Height")}
          symbol="h₀" value={h0} onChange={setH0}
          min={0} max={50} step={1} unit="m"
        />
        <Slider
          label={t("ค่าแรงโน้มถ่วง", "Gravity")}
          symbol="g" value={g} onChange={setG}
          min={1} max={20} step={0.1} unit="m/s²"
        />

        {/* Air drag toggle */}
        <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox" checked={showDrag}
              onChange={(e) => setShowDrag(e.target.checked)}
              className="w-4 h-4 accent-red-500"
            />
            <span className="text-sm font-medium text-red-500">
              {t("เปิดแรงต้านอากาศ", "Enable Air Drag")}
            </span>
          </label>

          {showDrag && (
            <>
              <Slider
                label={t("สัมประสิทธิ์แรงต้าน", "Drag Coefficient")}
                symbol="k" value={dragCoeff} onChange={setDragCoeff}
                min={0} max={2} step={0.05} unit="N·s/m"
              />
              <Slider
                label={t("มวลวัตถุ", "Mass")}
                symbol="m" value={mass} onChange={setMass}
                min={0.1} max={10} step={0.1} unit="kg"
              />
            </>
          )}
        </div>
      </div>

      {/* Play/Reset */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={togglePlay}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 active:scale-[0.98]"
        >
          {playing
            ? t("⏸ หยุด", "⏸ Pause")
            : progress > 0 && progress < 1
            ? t("▶ ต่อ", "▶ Resume")
            : t("▶ เริ่ม", "▶ Start")}
        </button>
        <button
          onClick={resetSim}
          className="px-5 py-2 rounded-lg text-sm border border-[var(--card-border)] hover:bg-[var(--card-bg)] active:scale-[0.98]"
        >
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
        {/* Progress slider */}
        <input
          type="range" min={0} max={1} step={0.002} value={progress}
          onChange={(e) => {
            const v = +e.target.value;
            progressRef.current = v;
            setProgress(v);
            draw();
          }}
          className="flex-1"
        />
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-3 mb-4 overflow-hidden">
        <canvas ref={canvasRef} className="w-full" style={{ height: 340 }} />
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
        {([
          { label: t("เวลา", "Time"), value: curIdeal.t.toFixed(2), unit: "s" },
          { label: "x", value: curIdeal.x.toFixed(2), unit: "m" },
          { label: "y", value: curIdeal.y.toFixed(2), unit: "m" },
          { label: "vₓ", value: curIdeal.vx.toFixed(2), unit: "m/s" },
          { label: "vᵧ", value: curIdeal.vy.toFixed(2), unit: "m/s" },
          { label: "|v|", value: speedTotal.toFixed(2), unit: "m/s" },
          {
            label: t("มุม v", "v angle"),
            value: (Math.atan2(curIdeal.vy, curIdeal.vx) / DEG).toFixed(1),
            unit: "°",
          },
          {
            label: "KE",
            value: (0.5 * mass * speedTotal * speedTotal).toFixed(1),
            unit: "J",
          },
        ] as { label: string; value: string; unit: string }[]).map((r) => (
          <div key={r.label} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-center">
            <div className="text-[10px] text-[var(--muted)]">{r.label}</div>
            <div className="text-sm font-medium">{r.value}</div>
            <div className="text-[9px] text-[var(--muted)]">{r.unit}</div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <p className="text-xs text-[var(--muted)] font-medium mb-2">{t("ผลลัพธ์ (ไม่มีแรงต้าน)", "Results (No Drag)")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("พิสัย", "Range")}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{range.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">m</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("ความสูงสูงสุด", "Max Height")}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{maxHeight.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">m</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("เวลาทั้งหมด", "Total Time")}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{totalTime.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">s</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("ความเร็วกระทบพื้น", "Impact Speed")}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {Math.sqrt(
              ideal[ideal.length - 1]?.vx ** 2 + ideal[ideal.length - 1]?.vy ** 2
            ).toFixed(2)}
          </div>
          <div className="text-[10px] text-[var(--muted)]">m/s</div>
        </div>
      </div>

      {/* If drag enabled, show comparison */}
      {drag && (
        <>
          <p className="text-xs text-[var(--muted)] font-medium mb-2">{t("ผลลัพธ์ (มีแรงต้านอากาศ)", "Results (With Air Drag)")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-red-50 dark:bg-red-950 rounded-xl p-3 text-center">
              <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("พิสัย", "Range")}</div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">{(drag[drag.length - 1]?.x ?? 0).toFixed(2)}</div>
              <div className="text-[10px] text-[var(--muted)]">m ({((1 - (drag[drag.length - 1]?.x ?? 0) / range) * 100).toFixed(0)}% {t("ลดลง", "less")})</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-xl p-3 text-center">
              <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("ความสูงสูงสุด", "Max Height")}</div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {Math.max(...drag.map(p => p.y)).toFixed(2)}
              </div>
              <div className="text-[10px] text-[var(--muted)]">m</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-xl p-3 text-center">
              <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("เวลาทั้งหมด", "Total Time")}</div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">{dragTime.toFixed(2)}</div>
              <div className="text-[10px] text-[var(--muted)]">s</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-xl p-3 text-center">
              <div className="text-[11px] text-[var(--muted)] mb-0.5">{t("ความเร็วกระทบพื้น", "Impact Speed")}</div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                {Math.sqrt(
                  (drag[drag.length - 1]?.vx ?? 0) ** 2 + (drag[drag.length - 1]?.vy ?? 0) ** 2
                ).toFixed(2)}
              </div>
              <div className="text-[10px] text-[var(--muted)]">m/s</div>
            </div>
          </div>
        </>
      )}

      {/* Theory section */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-5">
        <h3 className="text-sm font-semibold mb-3">{t("สรุปทฤษฎี", "Theory Summary")}</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-xs text-[var(--muted)] leading-relaxed">
          <div>
            <p className="font-medium text-[var(--foreground)] mb-1">{t("ไม่มีแรงต้านอากาศ", "Without Air Resistance")}</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>{t("แนวราบ: vₓ คงที่ตลอดการเคลื่อนที่", "Horizontal: vₓ is constant throughout")}</li>
              <li>{t("แนวดิ่ง: vᵧ ลดลงเรื่อยๆ ด้วยความเร่ง g", "Vertical: vᵧ decreases at rate g")}</li>
              <li>{t("พิสัยไกลสุดเมื่อ θ = 45° (ถ้า h₀ = 0)", "Maximum range at θ = 45° (if h₀ = 0)")}</li>
              <li>{t("วิถีเป็นรูปพาราโบลา", "Trajectory is a parabola")}</li>
              <li>{t("เวลาขึ้นสูงสุด: t = v₀sin(θ)/g", "Time to peak: t = v₀sin(θ)/g")}</li>
              <li>{t("ความสูงสูงสุด: H = h₀ + v₀²sin²(θ)/(2g)", "Max height: H = h₀ + v₀²sin²(θ)/(2g)")}</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-red-500 mb-1">{t("มีแรงต้านอากาศ", "With Air Resistance")}</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>{t("แรงต้าน F = −kv ทำให้ทั้ง vₓ และ vᵧ ลดลงเร็วขึ้น", "Drag force F = −kv reduces both vₓ and vᵧ faster")}</li>
              <li>{t("พิสัยสั้นลง ความสูงสูงสุดลดลง", "Range decreases, max height decreases")}</li>
              <li>{t("วิถีไม่สมมาตร — ขาลงชันกว่าขาขึ้น", "Trajectory is asymmetric — steeper descent")}</li>
              <li>{t("มุมที่ให้พิสัยไกลสุด < 45°", "Optimal angle for max range < 45°")}</li>
              <li>{t("มวลมากขึ้น → ผลกระทบจากแรงต้านน้อยลง", "More mass → less effect from drag")}</li>
              <li>{t("ต้องใช้วิธีเชิงตัวเลข (Euler) ในการคำนวณ", "Requires numerical methods (Euler) to solve")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
