"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

const G = 9.81;
const DEFAULT_OBJ_DENSITY = 500;
const DEFAULT_FLUID_DENSITY = 1000;
const DEFAULT_SIZE_CM = 10; // cube edge in cm

// Material presets: [labelTh, labelEn, density kg/m³]
const OBJECT_PRESETS: [string, string, number][] = [
  ["ไม้", "Wood", 700],
  ["น้ำแข็ง", "Ice", 917],
  ["พลาสติก", "Plastic", 950],
  ["อลูมิเนียม", "Aluminum", 2700],
  ["เหล็ก", "Iron", 7870],
];

const FLUID_PRESETS: [string, string, number][] = [
  ["น้ำมัน", "Oil", 850],
  ["น้ำ", "Water", 1000],
  ["น้ำเกลือ", "Saltwater", 1030],
  ["ปรอท", "Mercury", 13600],
];

/* ---- SVG Arrow helper ---- */
function Arrow({
  x1, y1, x2, y2, color, label, labelOffsetX = 0, labelOffsetY = 0,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; label?: string; labelOffsetX?: number; labelOffsetY?: number;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 4) return null;
  const ux = dx / len, uy = dy / len;
  const hl = Math.min(10, len * 0.35);
  const hx = x2 - ux * hl, hy = y2 - uy * hl;
  const px = -uy * 4, py = ux * 4;
  const mx = (x1 + x2) / 2 + labelOffsetX;
  const my = (y1 + y2) / 2 + labelOffsetY;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
      {label && (
        <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
          fontSize={10} fill={color} fontWeight={600} fontFamily="monospace">
          {label}
        </text>
      )}
    </g>
  );
}

export default function BuoyancyPage() {
  const { t } = useLang();

  const [objDensity, setObjDensity] = useState(DEFAULT_OBJ_DENSITY);
  const [fluidDensity, setFluidDensity] = useState(DEFAULT_FLUID_DENSITY);
  const [sizeCm, setSizeCm] = useState(DEFAULT_SIZE_CM);

  /* ---- physics ---- */
  const calc = useMemo(() => {
    const edgeM = sizeCm / 100;
    const V = edgeM * edgeM * edgeM; // m³

    const sinkRatio = objDensity / fluidDensity; // ratio
    const floats = sinkRatio < 1;
    const neutral = Math.abs(sinkRatio - 1) < 0.001;
    const submergedFrac = floats ? sinkRatio : 1.0; // clamped to 1 if sinking

    const V_sub = V * submergedFrac;
    const Fb = fluidDensity * V_sub * G;
    const W = objDensity * V * G;
    const netForce = Fb - W; // positive → net upward

    let status: "floats" | "sinks" | "neutral";
    if (neutral) status = "neutral";
    else if (floats) status = "floats";
    else status = "sinks";

    return { V, edgeM, sinkRatio, floats, neutral, submergedFrac, Fb, W, netForce, status };
  }, [objDensity, fluidDensity, sizeCm]);

  /* ---- SVG layout ---- */
  // Tank dimensions (SVG coords)
  const SVG_W = 600;
  const SVG_H = 360;
  const TANK_X = 150;   // tank left wall x
  const TANK_W = 200;   // tank inner width
  const TANK_TOP = 40;  // tank top inner y
  const TANK_BOT = 300; // tank bottom inner y
  const TANK_H = TANK_BOT - TANK_TOP;
  const WALL_T = 4;     // wall thickness

  // Fluid fills most of the tank
  const FLUID_LEVEL = TANK_TOP + TANK_H * 0.1; // fluid surface y (10% air gap)
  const FLUID_H = TANK_BOT - FLUID_LEVEL;

  // Object (cube cross-section)
  const maxEdgePx = TANK_W * 0.55;
  const objPx = Math.min(maxEdgePx, (sizeCm / 15) * maxEdgePx); // scale visually
  const objX = TANK_X + (TANK_W - objPx) / 2; // horizontally centered in tank

  // Vertical position: top of object in SVG coords
  // If floating: submergedFrac of the cube below fluid surface
  // If sinking: resting on tank bottom
  // If neutral: fully submerged, centered vertically
  let objY: number; // top of object
  if (calc.status === "sinks") {
    objY = TANK_BOT - objPx; // resting on bottom
  } else if (calc.status === "neutral") {
    // centered fully submerged
    const mid = (FLUID_LEVEL + TANK_BOT) / 2;
    objY = mid - objPx / 2;
  } else {
    // floating: position so submergedFrac is below fluid surface
    objY = FLUID_LEVEL - objPx * (1 - calc.submergedFrac);
  }

  const objCX = objX + objPx / 2; // center x of object

  // The y where fluid meets the cube (submerged boundary)
  const subBoundaryY = objY + objPx * (1 - calc.submergedFrac);

  // Arrow lengths: proportional to forces, max 90px
  const maxForce = Math.max(calc.W, calc.Fb, 1);
  const fbArrowLen = Math.max(15, (calc.Fb / maxForce) * 90);
  const wArrowLen = Math.max(15, (calc.W / maxForce) * 90);

  // Force arrows placed to the right of the tank
  const arrowX = TANK_X + TANK_W + 60;
  const objCY = objY + objPx / 2;

  // Status badge colors
  const statusColor =
    calc.status === "floats" ? "#22c55e" :
    calc.status === "sinks" ? "#ef4444" : "#3b82f6";
  const statusText =
    calc.status === "floats" ? t("ลอย", "Floats") :
    calc.status === "sinks" ? t("จม", "Sinks") : t("ลอยปริ่ม", "Neutral");

  function reset() {
    setObjDensity(DEFAULT_OBJ_DENSITY);
    setFluidDensity(DEFAULT_FLUID_DENSITY);
    setSizeCm(DEFAULT_SIZE_CM);
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">
          {t("ฟิสิกส์", "Physics")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("แรงลอยตัว", "Buoyancy Force")}</span>
      </div>

      {/* 2. Title */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        {t("แรงลอยตัว — หลักการของอาร์คิมีดิส", "Buoyancy force — Archimedes' principle")}
      </h1>

      {/* 3. Formula pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]"
          style={{ border: "1px solid var(--card-border)" }}>
          F<sub>b</sub> = <span className="font-medium text-[#3b82f6]">ρ<sub>f</sub> V g</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]"
          style={{ border: "1px solid var(--card-border)" }}>
          W = <span className="font-medium text-[#a855f7]">ρ<sub>o</sub> V g</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]"
          style={{ border: "1px solid var(--card-border)" }}>
          {t("สัดส่วนจม", "Submerged fraction")} = <span className="font-medium text-[var(--foreground)]">ρ<sub>o</sub> / ρ<sub>f</sub></span>
        </span>
      </div>

      {/* 4. Controls */}
      <p className="text-xs text-[var(--muted)] mb-2">{t("ตั้งค่า", "Settings")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        {/* Object density */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            ρ<sub>o</sub> — {t("ความหนาแน่นวัตถุ (kg/m³)", "Object density (kg/m³)")}
          </label>
          <input type="range" min={100} max={3000} step={10} value={objDensity}
            onChange={(e) => setObjDensity(Number(e.target.value))}
            className="w-full mb-1" />
          <input type="number" value={objDensity} min={100} max={14000} step={10}
            onChange={(e) => setObjDensity(Math.max(100, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-xl px-2 py-1.5 text-sm
                       bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>

        {/* Fluid density */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            ρ<sub>f</sub> — {t("ความหนาแน่นของเหลว (kg/m³)", "Fluid density (kg/m³)")}
          </label>
          <input type="range" min={500} max={14000} step={10} value={fluidDensity}
            onChange={(e) => setFluidDensity(Number(e.target.value))}
            className="w-full mb-1" />
          <input type="number" value={fluidDensity} min={500} max={14000} step={10}
            onChange={(e) => setFluidDensity(Math.max(500, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-xl px-2 py-1.5 text-sm
                       bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>

        {/* Cube size */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ขนาดลูกบาศก์ (ซม.)", "Cube edge size (cm)")}
          </label>
          <input type="range" min={5} max={15} step={1} value={sizeCm}
            onChange={(e) => setSizeCm(Number(e.target.value))}
            className="w-full mb-1" />
          <div className="flex items-center gap-2">
            <input type="number" value={sizeCm} min={5} max={15} step={1}
              onChange={(e) => setSizeCm(Math.min(15, Math.max(5, Number(e.target.value))))}
              className="w-full border border-[var(--card-border)] rounded-xl px-2 py-1.5 text-sm
                         bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
            <span className="text-xs text-[var(--muted)] whitespace-nowrap">cm</span>
          </div>
        </div>
      </div>

      {/* Object material presets */}
      <div className="mb-2">
        <p className="text-xs text-[var(--muted)] mb-1.5">{t("วัสดุวัตถุ", "Object material")}</p>
        <div className="flex flex-wrap gap-2">
          {OBJECT_PRESETS.map(([th, en, density]) => {
            const active = objDensity === density;
            return (
              <button key={en} onClick={() => setObjDensity(density)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
                style={{
                  background: active ? "var(--foreground)" : "var(--card-bg)",
                  color: active ? "var(--background)" : "var(--muted)",
                  border: "1px solid var(--card-border)",
                }}>
                {t(th, en)} <span className="opacity-60">{density}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fluid presets */}
      <div className="mb-4">
        <p className="text-xs text-[var(--muted)] mb-1.5">{t("ของเหลว", "Fluid")}</p>
        <div className="flex flex-wrap gap-2">
          {FLUID_PRESETS.map(([th, en, density]) => {
            const active = fluidDensity === density;
            return (
              <button key={en} onClick={() => setFluidDensity(density)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
                style={{
                  background: active ? "var(--foreground)" : "var(--card-bg)",
                  color: active ? "var(--background)" : "var(--muted)",
                  border: "1px solid var(--card-border)",
                }}>
                {t(th, en)} <span className="opacity-60">{density}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Reset button */}
      <div className="flex gap-2 mb-4">
        <button onClick={reset}
          className="px-5 py-2 rounded-full text-sm border border-[var(--card-border)]
                     hover:bg-[var(--card-bg)] active:scale-[0.98] transition-all">
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
      </div>

      {/* 6. Visualization */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4"
        style={{ boxShadow: "var(--shadow-sm)" }}>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          {/* ===== TANK ===== */}
          {/* Fluid background (gradient for depth) */}
          <defs>
            <linearGradient id="fluidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.38" />
            </linearGradient>
            <clipPath id="tankClip">
              <rect x={TANK_X} y={FLUID_LEVEL} width={TANK_W} height={FLUID_H} />
            </clipPath>
          </defs>

          {/* Fluid fill */}
          <rect x={TANK_X} y={FLUID_LEVEL} width={TANK_W} height={FLUID_H}
            fill="url(#fluidGrad)" />

          {/* Tank walls (left, right, bottom) */}
          <rect x={TANK_X - WALL_T} y={TANK_TOP - WALL_T}
            width={WALL_T} height={TANK_H + WALL_T * 2}
            fill="var(--foreground)" opacity="0.6" rx={2} />
          <rect x={TANK_X + TANK_W} y={TANK_TOP - WALL_T}
            width={WALL_T} height={TANK_H + WALL_T * 2}
            fill="var(--foreground)" opacity="0.6" rx={2} />
          <rect x={TANK_X - WALL_T} y={TANK_BOT}
            width={TANK_W + WALL_T * 2} height={WALL_T}
            fill="var(--foreground)" opacity="0.6" rx={2} />

          {/* Fluid surface line */}
          <line x1={TANK_X} y1={FLUID_LEVEL} x2={TANK_X + TANK_W} y2={FLUID_LEVEL}
            stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7} />

          {/* ===== OBJECT ===== */}
          {/* Submerged (darker) portion */}
          {(() => {
            const subTop = Math.max(objY, FLUID_LEVEL);
            const subBot = objY + objPx;
            const subH = Math.max(0, subBot - subTop);
            return subH > 0 ? (
              <rect x={objX} y={subTop} width={objPx} height={subH}
                fill="#f59e0b" fillOpacity={0.55}
                clipPath="url(#tankClip)" />
            ) : null;
          })()}

          {/* Above-fluid portion */}
          {(() => {
            const aboveBot = Math.min(objY + objPx, FLUID_LEVEL);
            const aboveH = Math.max(0, aboveBot - objY);
            return aboveH > 0 ? (
              <rect x={objX} y={objY} width={objPx} height={aboveH}
                fill="#f59e0b" fillOpacity={0.3} />
            ) : null;
          })()}

          {/* Object border */}
          <rect x={objX} y={objY} width={objPx} height={objPx}
            fill="none" stroke="#f59e0b" strokeWidth={2} rx={3} />

          {/* Object label */}
          <text x={objCX} y={objCY - 4} textAnchor="middle" dominantBaseline="central"
            fontSize={10} fill="#f59e0b" fontWeight={700}>
            {t("วัตถุ", "Object")}
          </text>
          <text x={objCX} y={objCY + 8} textAnchor="middle" dominantBaseline="central"
            fontSize={9} fill="#f59e0b" opacity={0.85}>
            {objDensity} kg/m³
          </text>

          {/* Fluid density label inside fluid */}
          <text x={TANK_X + TANK_W / 2} y={TANK_BOT - 14} textAnchor="middle"
            fontSize={10} fill="#3b82f6" fontWeight={600} opacity={0.8}>
            ρ<tspan fontSize={8}>f</tspan> = {fluidDensity} kg/m³
          </text>

          {/* ===== FORCE ARROWS ===== */}
          {/* Buoyancy arrow (upward, blue) */}
          <Arrow
            x1={arrowX} y1={objCY}
            x2={arrowX} y2={objCY - fbArrowLen}
            color="#3b82f6"
            label={`Fb=${calc.Fb.toFixed(1)}N`}
            labelOffsetX={-42}
          />

          {/* Weight arrow (downward, purple) */}
          <Arrow
            x1={arrowX + 20} y1={objCY}
            x2={arrowX + 20} y2={objCY + wArrowLen}
            color="#a855f7"
            label={`W=${calc.W.toFixed(1)}N`}
            labelOffsetX={40}
          />

          {/* Arrow axis label */}
          <text x={arrowX + 10} y={objCY} textAnchor="middle" dominantBaseline="central"
            fontSize={8} fill="var(--muted)" opacity={0.5}>●</text>

          {/* ===== STATUS BADGE ===== */}
          <rect x={TANK_X} y={TANK_TOP - 38} width={TANK_W} height={26} rx={13}
            fill={statusColor} fillOpacity={0.15} stroke={statusColor} strokeWidth={1.5} />
          <text x={TANK_X + TANK_W / 2} y={TANK_TOP - 25 + 1} textAnchor="middle"
            dominantBaseline="central" fontSize={13} fill={statusColor} fontWeight={700}>
            {statusText}
          </text>

          {/* Submerged fraction label (shown as a line on the object) */}
          {calc.status !== "sinks" && (
            <>
              <line x1={objX - 8} y1={FLUID_LEVEL} x2={objX - 2} y2={FLUID_LEVEL}
                stroke="#3b82f6" strokeWidth={1} />
              <line x1={objX - 8} y1={objY + objPx} x2={objX - 2} y2={objY + objPx}
                stroke="#f59e0b" strokeWidth={1} />
              <line x1={objX - 6} y1={FLUID_LEVEL} x2={objX - 6} y2={objY + objPx}
                stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
            </>
          )}

          {/* Submersion fraction annotation */}
          {calc.status === "floats" && (
            <text x={objX - 12} y={(FLUID_LEVEL + objY + objPx) / 2}
              textAnchor="end" dominantBaseline="central" fontSize={9}
              fill="var(--muted)" fontFamily="monospace">
              {(calc.submergedFrac * 100).toFixed(0)}%
            </text>
          )}
        </svg>
      </div>

      {/* 7. Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            ρ<sub>o</sub> — {t("วัตถุ", "Object")}
          </div>
          <div className="text-lg font-medium">{objDensity}</div>
          <div className="text-[10px] text-[var(--muted)]">kg/m³</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            ρ<sub>f</sub> — {t("ของเหลว", "Fluid")}
          </div>
          <div className="text-lg font-medium">{fluidDensity}</div>
          <div className="text-[10px] text-[var(--muted)]">kg/m³</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            {t("สัดส่วนจม", "Submerged")}
          </div>
          <div className="text-lg font-medium">
            {calc.status === "sinks"
              ? t("100% (จม)", "100% (sunk)")
              : `${(calc.submergedFrac * 100).toFixed(1)}%`}
          </div>
          <div className="text-[10px] text-[var(--muted)]">ρ<sub>o</sub>/ρ<sub>f</sub></div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3"
          style={{ borderColor: statusColor, borderWidth: 1.5 }}>
          <div className="text-[10px] mb-0.5 font-medium" style={{ color: statusColor }}>
            {t("สถานะ", "Status")}
          </div>
          <div className="text-base font-bold" style={{ color: statusColor }}>
            {statusText}
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[#3b82f6] mb-0.5 font-medium">F<sub>b</sub></div>
          <div className="text-lg font-medium text-[#3b82f6]">{calc.Fb.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">N</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[#a855f7] mb-0.5 font-medium">W</div>
          <div className="text-lg font-medium text-[#a855f7]">{calc.W.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">N</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            {t("แรงลัพธ์ (F", "Net force (F")}<sub>net</sub>)
          </div>
          <div className="text-lg font-medium"
            style={{ color: calc.netForce > 0.001 ? "#22c55e" : calc.netForce < -0.001 ? "#ef4444" : "#3b82f6" }}>
            {calc.netForce >= 0 ? "+" : ""}{calc.netForce.toFixed(2)}
          </div>
          <div className="text-[10px] text-[var(--muted)]">N</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">V</div>
          <div className="text-lg font-medium">{(calc.V * 1000).toFixed(3)}</div>
          <div className="text-[10px] text-[var(--muted)]">L (litre)</div>
        </div>
      </div>

      {/* 8. Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#3b82f6] opacity-60" />
          {t("ของเหลว", "Fluid")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#f59e0b] opacity-55" />
          {t("ส่วนที่จมอยู่ใต้ของเหลว", "Submerged portion")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#f59e0b] opacity-30" />
          {t("ส่วนที่อยู่เหนือของเหลว", "Above-fluid portion")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#3b82f6]" />
          {t("แรงลอยตัว F", "Buoyancy F")}<sub>b</sub>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#a855f7]" />
          {t("น้ำหนัก W", "Weight W")}
        </div>
      </div>
    </div>
  );
}
