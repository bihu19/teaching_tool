"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function OneDMotionPage() {
  const { t } = useLang();
  const [x0, setX0] = useState(0);
  const [v0, setV0] = useState(5);
  const [a, setA] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [displayT, setDisplayT] = useState(0);
  const [displayX, setDisplayX] = useState(0);
  const [displayV, setDisplayV] = useState(5);

  const playingRef = useRef(false);
  const tRef = useRef(0);
  const trailRef = useRef<{ t: number; x: number; v: number; a: number }[]>([]);
  const lastTimeRef = useRef<number | null>(null);
  const animRef = useRef<number>(0);
  const paramsRef = useRef({ x0: 0, v0: 5, a: -1 });

  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const posLabelRef = useRef<HTMLDivElement>(null);
  const cxRef = useRef<HTMLCanvasElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const caRef = useRef<HTMLCanvasElement>(null);

  const MAX_T = 20;
  const SCALE = 6;

  // Keep params ref in sync
  useEffect(() => {
    paramsRef.current = { x0, v0, a };
  }, [x0, v0, a]);

  const drawGraph = useCallback(
    (canvas: HTMLCanvasElement | null, data: { t: number; y: number }[], color: string) => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const W = (parent?.clientWidth ?? 200) - 20;
      const H = 120;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
      const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";

      const pad = { t: 8, r: 4, b: 20, l: 36 };
      const pw = W - pad.l - pad.r;
      const ph = H - pad.t - pad.b;

      const xTicks = [0, 5, 10, 15, 20];
      ctx.fillStyle = textColor;
      ctx.font = "9px sans-serif";
      ctx.textAlign = "center";
      xTicks.forEach((tv) => {
        const px = pad.l + (tv / MAX_T) * pw;
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(px, pad.t);
        ctx.lineTo(px, pad.t + ph);
        ctx.stroke();
        ctx.fillText(tv + "s", px, pad.t + ph + 12);
      });

      if (data.length < 2) return;

      const vals = data.map((d) => d.y);
      let mn = Math.min(...vals),
        mx = Math.max(...vals);
      if (mn === mx) { mn -= 1; mx += 1; }
      const spread = mx - mn;
      mn -= spread * 0.1;
      mx += spread * 0.1;

      for (let i = 0; i <= 4; i++) {
        const y = pad.t + ph * (1 - i / 4);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(pad.l + pw, y);
        ctx.stroke();
        const v = mn + (mx - mn) * (i / 4);
        ctx.fillStyle = textColor;
        ctx.font = "9px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(v.toFixed(1), pad.l - 3, y + 3);
      }

      if (mn < 0 && mx > 0) {
        const zy = pad.t + ph * (1 - (0 - mn) / (mx - mn));
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(pad.l, zy);
        ctx.lineTo(pad.l + pw, zy);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = pad.l + (d.t / MAX_T) * pw;
        const y = pad.t + ph * (1 - (d.y - mn) / (mx - mn));
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      const last = data[data.length - 1];
      const lx = pad.l + (last.t / MAX_T) * pw;
      const ly = pad.t + ph * (1 - (last.y - mn) / (mx - mn));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fill();
    },
    []
  );

  const updateCarDOM = useCallback((curX: number, curV: number) => {
    const road = roadRef.current;
    const car = carRef.current;
    const label = posLabelRef.current;
    if (!road || !car || !label) return;

    const rw = road.clientWidth;
    const cx = rw / 2 + curX * SCALE;
    const clampX = Math.max(14, Math.min(rw - 44, cx));

    car.style.left = clampX - 16 + "px";
    car.style.transform = `translateY(-50%) scaleX(${curV < 0 ? -1 : 1})`;

    label.style.left = Math.max(4, Math.min(rw - 80, cx - 20)) + "px";
    label.textContent = "x = " + curX.toFixed(1) + " m";
  }, []);

  const tick = useCallback(
    (ts: number) => {
      if (!playingRef.current) return;
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = Math.min((ts - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = ts;
      tRef.current += dt;
      if (tRef.current > MAX_T) tRef.current = MAX_T;

      const { x0: cx0, v0: cv0, a: ca } = paramsRef.current;
      const curT = tRef.current;
      const curX = cx0 + cv0 * curT + 0.5 * ca * curT * curT;
      const curV = cv0 + ca * curT;

      trailRef.current.push({ t: curT, x: curX, v: curV, a: ca });

      // Direct DOM update for car — no React re-render needed
      updateCarDOM(curX, curV);

      // Update React state for readouts (throttled to ~20fps via RAF)
      setDisplayT(curT);
      setDisplayX(curX);
      setDisplayV(curV);

      drawGraph(
        cxRef.current,
        trailRef.current.map((d) => ({ t: d.t, y: d.x })),
        "#378ADD"
      );
      drawGraph(
        cvRef.current,
        trailRef.current.map((d) => ({ t: d.t, y: d.v })),
        "#1D9E75"
      );
      drawGraph(
        caRef.current,
        trailRef.current.map((d) => ({ t: d.t, y: d.a })),
        "#BA7517"
      );

      if (curT < MAX_T) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        playingRef.current = false;
        setPlaying(false);
      }
    },
    [drawGraph, updateCarDOM]
  );

  const togglePlay = () => {
    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      cancelAnimationFrame(animRef.current);
    } else {
      playingRef.current = true;
      setPlaying(true);
      lastTimeRef.current = null;
      animRef.current = requestAnimationFrame(tick);
    }
  };

  const resetSim = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    playingRef.current = false;
    setPlaying(false);
    tRef.current = 0;
    trailRef.current = [];
    lastTimeRef.current = null;
    setDisplayT(0);
    setDisplayX(x0);
    setDisplayV(v0);
    updateCarDOM(x0, v0);
    [cxRef, cvRef, caRef].forEach((ref) => {
      const c = ref.current;
      if (c) {
        c.width = (c.parentElement?.clientWidth ?? 200) - 20;
        c.getContext("2d")?.clearRect(0, 0, c.width, 120);
      }
    });
  }, [x0, v0, updateCarDOM]);

  useEffect(() => {
    resetSim();
  }, [x0, v0, a, resetSim]);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>›</span>
        <span>{t("การเคลื่อนที่ 1 มิติ", "1D Motion")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        📊 {t("การเคลื่อนที่ใน 1 มิติ", "1D Motion Visualization")}
      </h1>

      {/* Controls */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ตั้งค่าเริ่มต้น", "Initial Settings")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("การกระจัดเริ่มต้น (x₀)", "Initial Displacement (x₀)")}
          </label>
          <div className="text-lg font-medium">x₀</div>
          <div className="text-[10px] text-[var(--muted)] mb-2">{t("เมตร (m)", "meters (m)")}</div>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value) || 0)}
            step={1}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1.5 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ความเร็วเริ่มต้น (v₀)", "Initial Velocity (v₀)")}
          </label>
          <div className="text-lg font-medium">v₀</div>
          <div className="text-[10px] text-[var(--muted)] mb-2">{t("เมตร/วินาที (m/s)", "meters/second (m/s)")}</div>
          <input
            type="number"
            value={v0}
            onChange={(e) => setV0(parseFloat(e.target.value) || 0)}
            step={0.5}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1.5 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ความเร่ง (a)", "Acceleration (a)")}
          </label>
          <div className="text-lg font-medium">a</div>
          <div className="text-[10px] text-[var(--muted)] mb-2">{t("เมตร/วินาที² (m/s²)", "m/s²")}</div>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value) || 0)}
            step={0.5}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1.5 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* Equations */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          x(t) = <span className="font-medium text-[var(--foreground)]">x₀ + v₀t + ½at²</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          v(t) = <span className="font-medium text-[var(--foreground)]">v₀ + at</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          a = <span className="font-medium text-[var(--foreground)]">{t("คงที่", "constant")}</span>
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={togglePlay}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 active:scale-[0.98]"
        >
          {playing
            ? t("⏸ หยุด", "⏸ Pause")
            : displayT > 0 && displayT < MAX_T
            ? t("▶ ต่อ", "▶ Resume")
            : t("▶ เริ่ม", "▶ Start")}
        </button>
        <button
          onClick={resetSim}
          className="px-5 py-2 rounded-lg text-sm border border-[var(--card-border)] hover:bg-[var(--card-bg)] active:scale-[0.98]"
        >
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
      </div>

      {/* Road */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ถนน (มุมมองจากด้านบน)", "Road (Top View)")}</p>
      <div className="bg-[var(--card-bg)] rounded-xl p-4 mb-4 overflow-hidden">
        <div ref={roadRef} className="relative h-16 bg-[#4a4a4a] rounded-lg overflow-hidden">
          <div className="absolute top-0 bottom-0 w-0.5 bg-white opacity-30" style={{ left: "50%" }} />
          <div className="absolute top-0.5 text-[10px] text-white/50" style={{ left: "calc(50% + 4px)" }}>
            x=0
          </div>
          <div
            ref={carRef}
            className="absolute top-1/2 text-[28px] will-change-[left,transform]"
            style={{ left: "calc(50% - 16px)", transform: "translateY(-50%)" }}
          >
            🚗
          </div>
          <div
            ref={posLabelRef}
            className="absolute bottom-0.5 text-[10px] text-yellow-400 font-medium will-change-[left]"
            style={{ left: "calc(50% - 20px)" }}
          >
            x = {x0.toFixed(1)} m
          </div>
        </div>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {[
          { label: t("เวลา (t)", "Time (t)"), value: displayT.toFixed(1), unit: t("วินาที", "seconds") },
          { label: t("การกระจัด (x)", "Displacement (x)"), value: displayX.toFixed(2), unit: t("เมตร", "meters") },
          { label: t("ความเร็ว (v)", "Velocity (v)"), value: displayV.toFixed(2), unit: "m/s" },
          { label: t("ความเร่ง (a)", "Acceleration (a)"), value: a.toFixed(2), unit: "m/s²" },
        ].map((r) => (
          <div key={r.label} className="bg-[var(--card-bg)] rounded-xl p-3">
            <div className="text-[11px] text-[var(--muted)] mb-0.5">{r.label}</div>
            <div className="text-lg font-medium">{r.value}</div>
            <div className="text-[10px] text-[var(--muted)]">{r.unit}</div>
          </div>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--card-bg)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            x(t) — {t("การกระจัด", "Displacement")}
          </div>
          <canvas ref={cxRef} height={120} className="w-full" />
        </div>
        <div className="bg-[var(--card-bg)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            v(t) — {t("ความเร็ว", "Velocity")}
          </div>
          <canvas ref={cvRef} height={120} className="w-full" />
        </div>
        <div className="bg-[var(--card-bg)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            a(t) — {t("ความเร่ง", "Acceleration")}
          </div>
          <canvas ref={caRef} height={120} className="w-full" />
        </div>
      </div>
    </div>
  );
}
