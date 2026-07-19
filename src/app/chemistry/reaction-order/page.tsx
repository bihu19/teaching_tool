"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

/* ----------------------------------------------------------------------------
 * Reaction rate order — concentration vs time
 *
 * For a reaction  A → products,  rate = k[A]^n
 *
 *  n = 0 : [A] = [A]₀ − kt                     (linear in [A])
 *  n = 1 : [A] = [A]₀ e^(−kt)  ⇔ ln[A] = ln[A]₀ − kt
 *  n = 2 : 1/[A] = 1/[A]₀ + kt
 *  n = 3 : 1/[A]² = 1/[A]₀² + 2kt
 * -------------------------------------------------------------------------- */

type OrderInfo = {
  n: 0 | 1 | 2 | 3;
  color: string;
  nameTH: string;
  nameEN: string;
  /** Differential rate law */
  rate: string;
  /** Integrated rate law */
  integrated: string;
  /** Linear form: plotting this vs t gives a straight line */
  linForm: string;
  /** Axis label for the linearised plot */
  linAxis: string;
  /** Half-life expression */
  half: string;
  /** Units of the rate constant k */
  kUnit: string;
};

const ORDERS: OrderInfo[] = [
  {
    n: 0,
    color: "#3b82f6",
    nameTH: "อันดับศูนย์",
    nameEN: "Zero order",
    rate: "rate = k[A]⁰ = k",
    integrated: "[A] = [A]₀ − kt",
    linForm: "[A] vs t",
    linAxis: "[A]",
    half: "t½ = [A]₀ / 2k",
    kUnit: "M·s⁻¹",
  },
  {
    n: 1,
    color: "#22c55e",
    nameTH: "อันดับหนึ่ง",
    nameEN: "First order",
    rate: "rate = k[A]¹",
    integrated: "ln[A] = ln[A]₀ − kt",
    linForm: "ln[A] vs t",
    linAxis: "ln[A]",
    half: "t½ = 0.693 / k",
    kUnit: "s⁻¹",
  },
  {
    n: 2,
    color: "#f59e0b",
    nameTH: "อันดับสอง",
    nameEN: "Second order",
    rate: "rate = k[A]²",
    integrated: "1/[A] = 1/[A]₀ + kt",
    linForm: "1/[A] vs t",
    linAxis: "1/[A]",
    half: "t½ = 1 / k[A]₀",
    kUnit: "M⁻¹·s⁻¹",
  },
  {
    n: 3,
    color: "#a855f7",
    nameTH: "อันดับสาม",
    nameEN: "Third order",
    rate: "rate = k[A]³",
    integrated: "1/[A]² = 1/[A]₀² + 2kt",
    linForm: "1/[A]² vs t",
    linAxis: "1/[A]²",
    half: "t½ = 3 / 2k[A]₀²",
    kUnit: "M⁻²·s⁻¹",
  },
];

/** Remaining concentration [A] at time t for the given order. */
function conc(n: number, A0: number, k: number, t: number): number {
  switch (n) {
    case 0:
      return Math.max(A0 - k * t, 0);
    case 1:
      return A0 * Math.exp(-k * t);
    case 2:
      return A0 / (1 + A0 * k * t);
    case 3:
      return A0 / Math.sqrt(1 + 2 * A0 * A0 * k * t);
    default:
      return A0;
  }
}

/** Linearising transform for the given order (straight line vs t). */
function linTransform(n: number, c: number): number {
  switch (n) {
    case 0:
      return c;
    case 1:
      return Math.log(c);
    case 2:
      return 1 / c;
    case 3:
      return 1 / (c * c);
    default:
      return c;
  }
}

function halfLife(n: number, A0: number, k: number): number {
  switch (n) {
    case 0:
      return A0 / (2 * k);
    case 1:
      return Math.LN2 / k;
    case 2:
      return 1 / (k * A0);
    case 3:
      return 3 / (2 * k * A0 * A0);
    default:
      return NaN;
  }
}

/* --- plot geometry --- */
const W = 600;
const H = 340;
const M = { l: 52, r: 18, t: 18, b: 40 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;
const N = 140; // samples per curve

export default function ReactionOrderPage() {
  const { t } = useLang();

  const [order, setOrder] = useState<0 | 1 | 2 | 3>(1);
  const [A0, setA0] = useState(1.0);
  const [k, setK] = useState(0.5);
  const [tMax, setTMax] = useState(10);
  const [compare, setCompare] = useState(false);
  const [linear, setLinear] = useState(false);

  const sel = ORDERS[order];

  const { curves, xTicks, yTicks, yLabel } = useMemo(() => {
    // Which orders get drawn as curves
    const shown =
      linear || !compare ? [ORDERS[order]] : ORDERS;

    // Sample raw data points for every shown order
    const raw = shown.map((o) => {
      const pts: { t: number; y: number }[] = [];
      for (let i = 0; i <= N; i++) {
        const time = (i / N) * tMax;
        const c = conc(o.n, A0, k, time);
        const y = linear ? linTransform(o.n, c) : c;
        pts.push({ t: time, y });
      }
      return { o, pts };
    });

    // y-axis range
    let yMin: number;
    let yMax: number;
    if (linear) {
      const vals = raw
        .flatMap((r) => r.pts.map((p) => p.y))
        .filter((v) => Number.isFinite(v));
      yMin = Math.min(...vals);
      yMax = Math.max(...vals);
      if (yMin === yMax) yMax = yMin + 1;
      // small padding
      const pad = (yMax - yMin) * 0.06;
      yMin -= pad;
      yMax += pad;
    } else {
      yMin = 0;
      yMax = A0;
    }

    const xOf = (time: number) => M.l + (time / tMax) * PW;
    const yOf = (v: number) => M.t + (1 - (v - yMin) / (yMax - yMin)) * PH;

    const curves = raw.map((r) => {
      const d = r.pts
        .filter((p) => Number.isFinite(p.y))
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.t).toFixed(1)} ${yOf(p.y).toFixed(1)}`)
        .join(" ");
      return { color: r.o.color, n: r.o.n, d };
    });

    // ticks
    const xTicks = Array.from({ length: 6 }, (_, i) => {
      const time = (i / 5) * tMax;
      return { x: xOf(time), label: time.toFixed(time < 1 && time > 0 ? 1 : 0) };
    });
    const yTicks = Array.from({ length: 5 }, (_, i) => {
      const v = yMin + (i / 4) * (yMax - yMin);
      return { y: yOf(v), label: v.toFixed(Math.abs(v) < 10 ? 2 : 1) };
    });

    const yLabel = linear
      ? sel.linAxis
      : t("[A] (mol·L⁻¹)", "[A] (mol·L⁻¹)");

    return { curves, xTicks, yTicks, yLabel };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, A0, k, tMax, compare, linear, t]);

  const rate0 = k * Math.pow(A0, order); // initial rate
  const th = halfLife(order, A0, k);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/chemistry" className="hover:underline">
          {t("เคมี", "Chemistry")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("อันดับปฏิกิริยา", "Reaction Order")}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        {t("อันดับของอัตราการเกิดปฏิกิริยา", "Reaction rate order")}
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
        {t(
          "สำหรับปฏิกิริยา A → ผลิตภัณฑ์ อัตรา = k[A]ⁿ — เลือกอันดับ n แล้วดูกราฟความเข้มข้นกับเวลา",
          "For a reaction A → products, rate = k[A]ⁿ. Choose the order n and watch how concentration changes with time."
        )}
      </p>

      {/* Rate equations — all four orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {ORDERS.map((o) => {
          const active = o.n === order;
          return (
            <button
              key={o.n}
              onClick={() => setOrder(o.n)}
              className="text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
              style={{
                background: active ? "var(--accent-soft)" : "var(--card-bg)",
                border: `1px solid ${active ? o.color : "var(--card-border)"}`,
                boxShadow: active ? "var(--shadow-md)" : "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: o.color }}
                />
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  n = {o.n} · {t(o.nameTH, o.nameEN)}
                </span>
              </div>
              <div
                className="text-sm mb-1"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--foreground)",
                }}
              >
                {o.rate}
              </div>
              <div
                className="text-xs"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--muted)",
                }}
              >
                {o.integrated}
              </div>
              <div className="text-[10px] mt-2" style={{ color: "var(--muted)" }}>
                {t("ครึ่งชีวิต", "Half-life")}: {o.half} · k [{o.kUnit}]
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ความเข้มข้นเริ่มต้น [A]₀ (M)", "Initial conc. [A]₀ (M)")}: {A0.toFixed(2)}
          </label>
          <input
            type="range" min={0.1} max={2} step={0.05} value={A0}
            onChange={(e) => setA0(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ค่าคงที่อัตรา k", "Rate constant k")}: {k.toFixed(2)}
          </label>
          <input
            type="range" min={0.05} max={2} step={0.05} value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ช่วงเวลา t (s)", "Time window t (s)")}: {tMax}
          </label>
          <input
            type="range" min={1} max={20} step={1} value={tMax}
            onChange={(e) => setTMax(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setLinear(false)}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
          style={
            !linear
              ? { background: "var(--foreground)", color: "var(--background)" }
              : { border: "1px solid var(--card-border)", color: "var(--foreground)" }
          }
        >
          {t("ความเข้มข้น–เวลา", "Concentration–time")}
        </button>
        <button
          onClick={() => setLinear(true)}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
          style={
            linear
              ? { background: "var(--foreground)", color: "var(--background)" }
              : { border: "1px solid var(--card-border)", color: "var(--foreground)" }
          }
        >
          {t("กราฟเส้นตรง", "Linearised plot")}
        </button>
        {!linear && (
          <button
            onClick={() => setCompare((c) => !c)}
            className="px-5 py-2 rounded-full text-sm border border-[var(--card-border)] hover:bg-[var(--card-bg)] active:scale-[0.98] transition-all"
            style={compare ? { background: "var(--card-bg)" } : undefined}
          >
            {compare ? t("✓ เทียบทุกอันดับ", "✓ Compare all orders") : t("เทียบทุกอันดับ", "Compare all orders")}
          </button>
        )}
      </div>

      {/* Graph */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* y gridlines + labels */}
          {yTicks.map((tick, i) => (
            <g key={`y${i}`}>
              <line
                x1={M.l} y1={tick.y} x2={W - M.r} y2={tick.y}
                stroke="var(--card-border)" strokeWidth={1}
              />
              <text
                x={M.l - 8} y={tick.y + 3} textAnchor="end"
                fontSize={11} fill="var(--muted)"
              >
                {tick.label}
              </text>
            </g>
          ))}
          {/* x labels */}
          {xTicks.map((tick, i) => (
            <text
              key={`x${i}`} x={tick.x} y={H - M.b + 18} textAnchor="middle"
              fontSize={11} fill="var(--muted)"
            >
              {tick.label}
            </text>
          ))}
          {/* axes */}
          <line x1={M.l} y1={M.t} x2={M.l} y2={H - M.b} stroke="var(--foreground)" strokeWidth={1.5} />
          <line x1={M.l} y1={H - M.b} x2={W - M.r} y2={H - M.b} stroke="var(--foreground)" strokeWidth={1.5} />
          {/* axis titles */}
          <text
            x={M.l + PW / 2} y={H - 4} textAnchor="middle"
            fontSize={12} fill="var(--muted)"
          >
            {t("เวลา t (s)", "Time t (s)")}
          </text>
          <text
            x={14} y={M.t + PH / 2} textAnchor="middle"
            fontSize={12} fill="var(--muted)"
            transform={`rotate(-90 14 ${M.t + PH / 2})`}
          >
            {yLabel}
          </text>
          {/* curves */}
          {curves.map((c) => (
            <path
              key={c.n}
              d={c.d}
              fill="none"
              stroke={c.color}
              strokeWidth={c.n === order ? 2.5 : 1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={compare && !linear && c.n !== order ? 0.55 : 1}
            />
          ))}
        </svg>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("อันดับ", "Order")}</div>
          <div className="text-lg font-medium" style={{ color: sel.color }}>n = {order}</div>
          <div className="text-[10px] text-[var(--muted)]">{t(sel.nameTH, sel.nameEN)}</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("อัตราเริ่มต้น", "Initial rate")}</div>
          <div className="text-lg font-medium">{rate0.toFixed(3)}</div>
          <div className="text-[10px] text-[var(--muted)]">M·s⁻¹</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ครึ่งชีวิต t½", "Half-life t½")}</div>
          <div className="text-lg font-medium">{th.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">s</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("หน่วยของ k", "Units of k")}</div>
          <div className="text-lg font-medium">{sel.kUnit}</div>
          <div className="text-[10px] text-[var(--muted)]">&nbsp;</div>
        </div>
      </div>

      {/* Note about linearised plot */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4 text-sm" style={{ color: "var(--muted)" }}>
        {linear
          ? t(
              `เมื่อ plot ${sel.linForm} จะได้เส้นตรงเสมอ นี่คือวิธีหาอันดับปฏิกิริยาจากข้อมูลการทดลอง — ลองสลับอันดับดูว่ากราฟไหนตรงที่สุด`,
              `Plotting ${sel.linForm} always gives a straight line. This is how reaction order is found from experimental data — try each order and see which one plots straight.`
            )
          : t(
              "ความชันของเส้นสัมพันธ์กับค่า k และอันดับ n สังเกตว่าอันดับต่างกันให้รูปทรงเส้นโค้งต่างกัน กดปุ่ม “กราฟเส้นตรง” เพื่อดูวิธีหาอันดับ",
              "The steepness of each curve depends on k and the order n. Notice how different orders give differently-shaped curves — tap “Linearised plot” to see how the order is identified."
            )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        {ORDERS.map((o) => (
          <div key={o.n} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: o.color }} />
            {t(o.nameTH, o.nameEN)} (n = {o.n})
          </div>
        ))}
      </div>
    </div>
  );
}
