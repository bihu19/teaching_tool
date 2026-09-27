"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLang } from "@/components/LangContext";

/* ── Shared building blocks for the mechanics slide deck ── */

export const fmt = (n: number, d = 2) => (Math.abs(n) < 1e-9 ? 0 : n).toFixed(d);

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-mono uppercase tracking-wide mb-2" style={{ color: "var(--accent)" }}>
      {children}
    </div>
  );
}

export function SlideTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl sm:text-2xl font-semibold mb-5 leading-snug" style={{ color: "var(--foreground)" }}>
      {children}
    </h2>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-base sm:text-lg leading-relaxed my-3" style={{ color: "var(--accent)" }}>
      {children}
    </div>
  );
}

export function Prompt({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-sm leading-relaxed pl-4 py-2 my-4"
      style={{ borderLeft: "3px solid var(--accent)", color: "var(--foreground)" }}
    >
      {children}
    </div>
  );
}

export function Small({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs leading-relaxed my-2" style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed my-2" style={{ color: "var(--foreground)" }}>
      {children}
    </p>
  );
}

/** Click-to-reveal answer block. */
export function Reveal({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="mt-3 pt-3 group" style={{ borderTop: "1px solid var(--card-border)" }}>
      <summary className="cursor-pointer text-sm font-medium select-none" style={{ color: "var(--accent)" }}>
        {label}
      </summary>
      <div className="text-sm leading-relaxed mt-2" style={{ color: "var(--foreground)" }}>
        {children}
      </div>
    </details>
  );
}

/** Inner panel used for labs and worked examples. */
export function Panel({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}
    >
      {children}
    </div>
  );
}

export function Split({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`grid grid-cols-1 gap-6 items-start ${wide ? "md:grid-cols-[0.85fr_1.3fr]" : "md:grid-cols-2"}`}>
      {children}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <label className="block text-xs" style={{ color: "var(--muted)" }}>
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono" style={{ color: "var(--accent)" }}>
          {display ?? value}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full my-2 cursor-pointer"
        style={{ accentColor: "var(--accent)" }}
      />
    </label>
  );
}

export function Readout({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-xs sm:text-sm my-3 min-h-[2.5em] leading-relaxed" style={{ color: "var(--foreground)" }}>
      {children}
    </div>
  );
}

export function PillButton({
  children,
  onClick,
  primary = false,
  pressed,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={pressed}
      className={`px-4 py-1.5 rounded-full text-sm transition-all active:scale-[0.98] ${
        primary
          ? "font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-85"
          : `border border-[var(--card-border)] hover:bg-[var(--card-bg)] ${pressed ? "bg-[var(--accent-soft)]" : ""}`
      }`}
    >
      {children}
    </button>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="text-left font-medium text-xs py-2 px-2"
                style={{ color: "var(--muted)", borderBottom: "1px solid var(--card-border-strong)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`py-3 px-2 align-top ${j === 1 ? "font-mono" : ""}`}
                  style={{ borderBottom: "1px solid var(--card-border)", color: "var(--foreground)" }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Quiz({ options, answer, explain }: { options: string[]; answer: number; explain: string }) {
  const { t } = useLang();
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === answer;
  return (
    <div className="grid gap-2 max-w-2xl">
      {options.map((o, i) => {
        const chosen = picked === i;
        return (
          <button
            key={o}
            onClick={() => setPicked(i)}
            className="text-left text-sm rounded-2xl px-4 py-3 transition-all active:scale-[0.99]"
            style={{
              background: "var(--background)",
              color: "var(--foreground)",
              border: chosen
                ? `2px solid ${correct ? "#22c55e" : "#f59e0b"}`
                : "1px solid var(--card-border)",
            }}
          >
            {o}
          </button>
        );
      })}
      <p className="text-sm min-h-[3em] leading-relaxed" aria-live="polite" style={{ color: "var(--foreground)" }}>
        {picked !== null && (
          <>
            <span className="font-medium" style={{ color: correct ? "#22c55e" : "#f59e0b" }}>
              {correct ? t("ถูกต้อง: ", "Correct: ") : t("ลองคิดอีกครั้ง: ", "Think again: ")}
            </span>
            {explain}
          </>
        )}
      </p>
    </div>
  );
}

/** SVG arrow with a filled head. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 2.5,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  dashed?: boolean;
}) {
  if (Math.hypot(x2 - x1, y2 - y1) < 1) return null;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 9;
  const head = [
    [x2, y2],
    [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)],
    [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)],
  ]
    .map((p) => p.join(","))
    .join(" ");
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - 6 * Math.cos(a)}
        y2={y2 - 6 * Math.sin(a)}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon points={head} fill={color} />
    </g>
  );
}

/** Small line chart with grid, used by the x–t / v–t lab. */
export function Plot({
  xmax,
  ymin,
  ymax,
  fn,
  tPoint,
  xLabel,
  yLabel,
}: {
  xmax: number;
  ymin: number;
  ymax: number;
  fn: (t: number) => number;
  tPoint: number;
  xLabel: string;
  yLabel: string;
}) {
  const clip = useId();
  const W = 300;
  const H = 220;
  const L = 42;
  const T = 22;
  const bw = W - L - 12;
  const bh = H - T - 40;
  const X = (x: number) => L + (x / xmax) * bw;
  const Y = (y: number) => T + bh - ((y - ymin) / (ymax - ymin)) * bh;
  const d = Array.from({ length: 161 }, (_, i) => {
    const x = (xmax * i) / 160;
    return `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(fn(x)).toFixed(1)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${yLabel} / ${xLabel}`}>
      <defs>
        <clipPath id={clip}>
          <rect x={L} y={T} width={bw} height={bh} />
        </clipPath>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const gx = L + (i * bw) / 4;
        const gy = T + (i * bh) / 4;
        return (
          <g key={i}>
            <line x1={gx} y1={T} x2={gx} y2={T + bh} stroke="var(--card-border-strong)" />
            <line x1={L} y1={gy} x2={L + bw} y2={gy} stroke="var(--card-border-strong)" />
            <text x={gx} y={T + bh + 14} fontSize="10" textAnchor="middle" fill="var(--muted)">
              {fmt((xmax * i) / 4, 0)}
            </text>
            <text x={L - 5} y={gy + 3} fontSize="10" textAnchor="end" fill="var(--muted)">
              {fmt(ymax - ((ymax - ymin) * i) / 4, 1)}
            </text>
          </g>
        );
      })}
      <text x={L} y={T - 8} fontSize="11" fill="var(--foreground)">
        {yLabel}
      </text>
      <text x={L + bw} y={H - 4} fontSize="11" textAnchor="end" fill="var(--muted)">
        {xLabel}
      </text>
      <g clipPath={`url(#${clip})`}>
        {ymin < 0 && ymax > 0 && (
          <line x1={L} y1={Y(0)} x2={L + bw} y2={Y(0)} stroke="var(--muted)" strokeWidth={1.2} />
        )}
        <path d={d} fill="none" stroke="#3b82f6" strokeWidth={2.2} />
      </g>
      <circle cx={X(tPoint)} cy={Y(fn(tPoint))} r={5} fill="#f59e0b" />
    </svg>
  );
}

/**
 * Drives a 0..max value forward in real time (play / pause / reset).
 * The ref mirrors state so the RAF loop never reads a stale value.
 */
export function usePlayback(max: number, rate: number) {
  const [value, setValueState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const valueRef = useRef(0);

  const setValue = useCallback((v: number) => {
    valueRef.current = v;
    setValueState(v);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last: number | null = null;
    const step = (now: number) => {
      if (last === null) last = now;
      const dt = Math.min((now - last) / 1000, 0.06);
      last = now;
      const next = Math.min(max, valueRef.current + dt * rate);
      setValue(next);
      if (next >= max) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, max, rate, setValue]);

  const toggle = () => {
    if (!playing && valueRef.current >= max) setValue(0);
    setPlaying((p) => !p);
  };
  const reset = () => {
    setPlaying(false);
    setValue(0);
  };
  const scrub = (v: number) => {
    setPlaying(false);
    setValue(v);
  };

  return { value, playing, toggle, reset, scrub };
}
