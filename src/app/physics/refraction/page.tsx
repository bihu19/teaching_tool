"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

// Medium presets: [labelTh, labelEn, n1]
const MEDIUM_PRESETS: [string, string, number][] = [
  ["น้ำ", "Water", 1.33],
  ["แก้ว", "Glass", 1.50],
  ["เพชร", "Diamond", 2.42],
];

const DEFAULT_ANGLE = 30;
const DEFAULT_MEDIUM_INDEX = 0; // Water

const N2 = 1.0; // air, fixed

const RAY_LEN = 140;

// SVG layout constants
const SVG_W = 600;
const SVG_H = 400;
const SURFACE_Y = 200; // water surface y
const HIT_X = 300;    // hit point x
const HIT_Y = SURFACE_Y;

// Fish label offset from ray end
const FISH_LABEL_OFFSET = 12;

// Convert degrees to radians
function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// Build SVG arc path for an angle annotation
// centerX, centerY: arc center (hit point)
// startAngle, endAngle: in radians from positive-x axis (SVG convention: y grows down)
// radius: arc radius
function arcPath(
  cx: number, cy: number,
  startAngle: number, endAngle: number,
  radius: number
): string {
  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy + radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy + radius * Math.sin(endAngle);
  // Always draw the shorter arc (large-arc-flag = 0)
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// Arrowhead polygon string
function arrowhead(
  tipX: number, tipY: number,
  dirX: number, dirY: number, // unit direction vector pointing TO tip
  size = 7
): string {
  const len = Math.sqrt(dirX * dirX + dirY * dirY);
  const ux = dirX / len, uy = dirY / len;
  const px = -uy, py = ux;
  const bx = tipX - ux * size;
  const by = tipY - uy * size;
  return `${tipX},${tipY} ${bx + px * (size * 0.4)},${by + py * (size * 0.4)} ${bx - px * (size * 0.4)},${by - py * (size * 0.4)}`;
}

export default function RefractionPage() {
  const { t } = useLang();

  const [theta1Deg, setTheta1Deg] = useState(DEFAULT_ANGLE);
  const [mediumIndex, setMediumIndex] = useState(DEFAULT_MEDIUM_INDEX);

  const [mediumTh, mediumEn, n1] = MEDIUM_PRESETS[mediumIndex];

  // Physics computations
  const calc = useMemo(() => {
    const thetaC_rad = Math.asin(N2 / n1); // critical angle, radians
    const thetaC_deg = (thetaC_rad * 180) / Math.PI;
    const theta1_rad = toRad(theta1Deg);

    const isTIR = theta1Deg > thetaC_deg + 0.5;
    const isCritical = !isTIR && Math.abs(theta1Deg - thetaC_deg) < 0.5;
    const isRefraction = !isTIR && !isCritical;

    let theta2_rad: number | null = null;
    let theta2_deg: number | null = null;

    if (isRefraction || isCritical) {
      const sinTheta2 = (n1 / N2) * Math.sin(theta1_rad);
      if (Math.abs(sinTheta2) <= 1) {
        theta2_rad = Math.asin(sinTheta2);
        theta2_deg = (theta2_rad * 180) / Math.PI;
      }
    }

    if (isCritical) {
      theta2_deg = 90;
      theta2_rad = Math.PI / 2;
    }

    return { thetaC_deg, theta1_rad, theta2_rad, theta2_deg, isTIR, isCritical, isRefraction };
  }, [theta1Deg, n1]);

  // SVG geometry
  // Incident ray: from fish (below surface, at angle θ₁ from downward normal)
  // θ₁ from the downward normal means the ray going DOWN from hit point is at θ₁.
  // Fish is below-left: ray goes DOWN and to the LEFT from hit point.
  // Direction from hit toward fish: downward normal is (0, +1), rotated by θ₁ to the left → (-sinθ₁, +cosθ₁)
  const incidentDX = -Math.sin(calc.theta1_rad);
  const incidentDY = Math.cos(calc.theta1_rad);
  const fishX = HIT_X + incidentDX * RAY_LEN;
  const fishY = HIT_Y + incidentDY * RAY_LEN;

  // Refracted ray: from hit point going UP and to the RIGHT at angle θ₂ from upward normal
  // Upward normal is (0, -1). Rotated by θ₂ to the right → (+sinθ₂, -cosθ₂)
  let refractedEndX: number | null = null;
  let refractedEndY: number | null = null;
  if (calc.theta2_rad !== null) {
    if (calc.isCritical) {
      // Refracted ray goes horizontally along the surface
      refractedEndX = HIT_X + RAY_LEN;
      refractedEndY = HIT_Y;
    } else {
      refractedEndX = HIT_X + Math.sin(calc.theta2_rad) * RAY_LEN;
      refractedEndY = HIT_Y - Math.cos(calc.theta2_rad) * RAY_LEN;
    }
  }

  // Reflected ray: mirror of incident across the normal (angle = θ₁ on the other side)
  // Direction DOWN and to the RIGHT from hit point: (+sinθ₁, +cosθ₁)
  const reflectedEndX = HIT_X + Math.sin(calc.theta1_rad) * RAY_LEN;
  const reflectedEndY = HIT_Y + Math.cos(calc.theta1_rad) * RAY_LEN;

  // Status badge
  const statusText = calc.isTIR
    ? t("สะท้อนกลับหมด / Total Internal Reflection", "Total Internal Reflection / สะท้อนกลับหมด")
    : calc.isCritical
    ? t("มุมวิกฤต / Critical angle", "Critical angle / มุมวิกฤต")
    : t("หักเห / Refraction", "Refraction / หักเห");

  const statusColor = calc.isTIR ? "#ef4444" : calc.isCritical ? "#f59e0b" : "#22c55e";
  const statusBgOpacity = 0.13;

  function reset() {
    setTheta1Deg(DEFAULT_ANGLE);
    setMediumIndex(DEFAULT_MEDIUM_INDEX);
  }

  // Angle arc helpers
  // θ₁ arc: between downward normal (angle = π/2 i.e. pointing down, SVG: +y) and incident ray direction (from hit to fish)
  // In SVG coords (y down), downward normal direction angle = π/2
  // Incident ray direction FROM hit to fish: angle = π + Math.atan2(incidentDY, incidentDX) if we measure from +x?
  // Actually let's compute the angles from +x axis (SVG convention)
  // Direction from hit toward fish: (incidentDX, incidentDY) → angle = atan2(incidentDY, incidentDX)
  const incidentAngleSVG = Math.atan2(incidentDY, incidentDX); // e.g. θ₁=30° → atan2(cos30, -sin30) = atan2(0.866, -0.5) ≈ 2.094 rad (120°)
  const normalDownAngle = Math.PI / 2; // pointing down, SVG: atan2(1,0) = π/2 = 90°

  // Arc from downward normal (π/2) to incident ray direction
  // We want the smaller arc between them
  // For incident ray: if θ₁=30°, incidentAngleSVG ≈ 120° (in degrees), normal = 90°, so arc from 90° to 120°
  // We draw arc in the counterclockwise direction (from normal to ray, sweeping through the angle)

  // θ₂ arc: between upward normal and refracted ray direction
  // Upward normal: angle = -π/2 (pointing up, SVG: atan2(-1,0) = -π/2)
  // Refracted ray from hit: (sinθ₂, -cosθ₂) → angle = atan2(-cosθ₂, sinθ₂)
  const normalUpAngle = -Math.PI / 2;
  let refractedAngleSVG: number | null = null;
  if (calc.theta2_rad !== null && !calc.isCritical) {
    const rdx = Math.sin(calc.theta2_rad);
    const rdy = -Math.cos(calc.theta2_rad);
    refractedAngleSVG = Math.atan2(rdy, rdx);
  }

  const ARC_R = 28; // small arc radius

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">
          {t("ฟิสิกส์", "Physics")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("การหักเหและการสะท้อนกลับหมด", "Refraction & TIR")}</span>
      </div>

      {/* 2. Title */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        {t("การหักเหและการสะท้อนกลับหมดของแสง", "Refraction and total internal reflection")}
      </h1>

      {/* 3. Formula pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span
          className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]"
          style={{ border: "1px solid var(--card-border)" }}
        >
          n<sub>1</sub> sin θ<sub>1</sub> ={" "}
          <span className="font-medium" style={{ color: "var(--foreground)" }}>
            n<sub>2</sub> sin θ<sub>2</sub>
          </span>
        </span>
        <span
          className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]"
          style={{ border: "1px solid var(--card-border)" }}
        >
          θ<sub>c</sub> = arcsin(n<sub>2</sub>/n<sub>1</sub>)
        </span>
      </div>

      {/* 4. Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Angle slider */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            θ<sub>1</sub> — {t("มุมตกกระทบ", "Incidence angle")}:{" "}
            <span className="font-medium" style={{ color: "var(--foreground)" }}>
              {theta1Deg}°
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={89}
            step={1}
            value={theta1Deg}
            onChange={(e) => setTheta1Deg(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-[var(--muted)] mt-0.5">
            <span>0°</span>
            <span style={{ color: statusColor, fontWeight: 600 }}>
              θ<sub>c</sub> = {calc.thetaC_deg.toFixed(1)}°
            </span>
            <span>89°</span>
          </div>
        </div>

        {/* Medium info */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3 flex flex-col justify-between">
          <label className="text-xs text-[var(--muted)] block mb-2">
            {t("ตัวกลาง (n", "Medium (n")}<sub>1</sub>)
          </label>
          <div className="flex flex-wrap gap-2">
            {MEDIUM_PRESETS.map(([th, en, n], idx) => {
              const active = mediumIndex === idx;
              return (
                <button
                  key={en}
                  onClick={() => setMediumIndex(idx)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
                  style={{
                    background: active ? "var(--accent-soft)" : "var(--background)",
                    color: active ? "var(--accent)" : "var(--muted)",
                    border: active
                      ? "1.5px solid var(--accent)"
                      : "1px solid var(--card-border)",
                  }}
                >
                  {t(th, en)}{" "}
                  <span style={{ opacity: 0.7 }}>{n.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Reset button */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={reset}
          className="px-5 py-2 rounded-full text-sm border border-[var(--card-border)]
                     hover:bg-[var(--card-bg)] active:scale-[0.98] transition-all"
        >
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
      </div>

      {/* 6. Visualization */}
      <div
        className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.32" />
            </linearGradient>
            <clipPath id="waterClip">
              <rect x={0} y={SURFACE_Y} width={SVG_W} height={SVG_H - SURFACE_Y} />
            </clipPath>
            <clipPath id="airClip">
              <rect x={0} y={0} width={SVG_W} height={SURFACE_Y} />
            </clipPath>
            <clipPath id="svgClip">
              <rect x={0} y={0} width={SVG_W} height={SVG_H} />
            </clipPath>
          </defs>

          {/* Air region (top) — cream/background */}
          <rect x={0} y={0} width={SVG_W} height={SURFACE_Y} fill="var(--background)" />

          {/* Water region (bottom) — translucent blue */}
          <rect x={0} y={SURFACE_Y} width={SVG_W} height={SVG_H - SURFACE_Y}
            fill="url(#waterGrad)" />

          {/* Water surface line */}
          <line
            x1={0} y1={SURFACE_Y} x2={SVG_W} y2={SURFACE_Y}
            stroke="var(--foreground)" strokeWidth={1} opacity={0.25}
          />

          {/* Region labels */}
          <text x={12} y={22} fontSize={10} fill="var(--muted)" opacity={0.6}>
            {t("อากาศ n₂ = 1.00", "Air n₂ = 1.00")}
          </text>
          <text x={12} y={SURFACE_Y + 16} fontSize={10} fill="#3b82f6" opacity={0.8}>
            {t(`${mediumTh} n₁ = ${n1.toFixed(2)}`, `${mediumEn} n₁ = ${n1.toFixed(2)}`)}
          </text>

          {/* Normal dashed line (vertical) */}
          <line
            x1={HIT_X} y1={100}
            x2={HIT_X} y2={300}
            stroke="var(--muted)" strokeWidth={1.2}
            strokeDasharray="4 4" opacity={0.4}
          />

          {/* ── FISH (at incident ray origin) ── */}
          {/* Simple fish: ellipse body + triangle tail + dot eye */}
          <g transform={`translate(${fishX}, ${fishY})`}>
            {/* body ellipse */}
            <ellipse cx={0} cy={0} rx={13} ry={7}
              fill="var(--card-bg)" fillOpacity={0.7}
              stroke="var(--foreground)" strokeWidth={1.2} opacity={0.8} />
            {/* tail triangle pointing away from hit (direction = incidentDX, incidentDY) */}
            {/* tail goes in the direction of the fish pointing away, i.e. away from hit */}
            <polygon
              points={`${13},0 ${19},${-5} ${19},${5}`}
              fill="var(--card-bg)" stroke="var(--foreground)" strokeWidth={1} opacity={0.7}
            />
            {/* eye */}
            <circle cx={-5} cy={-2} r={1.5} fill="var(--foreground)" opacity={0.75} />
            {/* label */}
            <text
              x={0} y={FISH_LABEL_OFFSET + 4}
              textAnchor="middle" fontSize={9}
              fill="var(--muted)" fontFamily="var(--font-manrope, sans-serif)"
            >
              {t("ปลา", "fish")}
            </text>
          </g>

          {/* ── INCIDENT RAY (fish → hit point) ── */}
          {/* Line from fish to hit */}
          <line
            x1={fishX} y1={fishY}
            x2={HIT_X} y2={HIT_Y}
            stroke="#f59e0b" strokeWidth={2.5}
            clipPath="url(#svgClip)"
          />
          {/* Arrowhead near hit point */}
          <polygon
            points={arrowhead(HIT_X, HIT_Y, -incidentDX, -incidentDY)}
            fill="#f59e0b"
          />

          {/* ── REFRACTED RAY (when not TIR) ── */}
          {!calc.isTIR && refractedEndX !== null && refractedEndY !== null && (
            <>
              <line
                x1={HIT_X} y1={HIT_Y}
                x2={refractedEndX} y2={refractedEndY}
                stroke="#f59e0b" strokeWidth={2.5}
                clipPath="url(#svgClip)"
              />
              {/* Arrowhead at far end */}
              {!calc.isCritical && (
                <polygon
                  points={arrowhead(
                    refractedEndX, refractedEndY,
                    Math.sin(calc.theta2_rad!), -Math.cos(calc.theta2_rad!)
                  )}
                  fill="#f59e0b"
                />
              )}
              {calc.isCritical && (
                <polygon
                  points={arrowhead(refractedEndX, refractedEndY, 1, 0)}
                  fill="#f59e0b"
                />
              )}
            </>
          )}

          {/* ── REFLECTED RAY ── */}
          <line
            x1={HIT_X} y1={HIT_Y}
            x2={reflectedEndX} y2={reflectedEndY}
            stroke="#3b82f6"
            strokeWidth={calc.isTIR ? 2.5 : 1.2}
            opacity={calc.isTIR ? 1 : 0.55}
            clipPath="url(#svgClip)"
          />
          {/* Arrowhead for reflected ray */}
          <polygon
            points={arrowhead(
              reflectedEndX, reflectedEndY,
              Math.sin(calc.theta1_rad), Math.cos(calc.theta1_rad)
            )}
            fill="#3b82f6"
            opacity={calc.isTIR ? 1 : 0.55}
          />

          {/* ── HUMAN OBSERVER (upper-right) ── */}
          {/* Simple silhouette: circle head + shoulder line */}
          <g>
            <circle cx={480} cy={72} r={10}
              fill="var(--card-bg)" stroke="var(--foreground)"
              strokeWidth={1.3} opacity={0.85} />
            {/* body / shoulders */}
            <line x1={480} y1={82} x2={480} y2={102}
              stroke="var(--foreground)" strokeWidth={1.3} opacity={0.7} />
            <line x1={462} y1={90} x2={498} y2={90}
              stroke="var(--foreground)" strokeWidth={1.3} opacity={0.7} />
            {/* arms angled down */}
            <line x1={462} y1={90} x2={456} y2={104}
              stroke="var(--foreground)" strokeWidth={1.3} opacity={0.7} />
            <line x1={498} y1={90} x2={504} y2={104}
              stroke="var(--foreground)" strokeWidth={1.3} opacity={0.7} />
            <text x={480} y={114} textAnchor="middle" fontSize={9}
              fill="var(--muted)" fontFamily="var(--font-manrope, sans-serif)">
              {t("ผู้สังเกต", "observer")}
            </text>
          </g>

          {/* ── ANGLE ARCS ── */}
          {/* θ₁ arc: between downward normal and incident ray, below surface */}
          {theta1Deg > 2 && (
            <g clipPath="url(#waterClip)">
              <path
                d={arcPath(HIT_X, HIT_Y, normalDownAngle, incidentAngleSVG, ARC_R)}
                fill="none" stroke="#f59e0b" strokeWidth={1.2} opacity={0.85}
              />
              {/* θ₁ label: midpoint of arc */}
              {(() => {
                const midAngle = (normalDownAngle + incidentAngleSVG) / 2;
                const lx = HIT_X + (ARC_R + 10) * Math.cos(midAngle);
                const ly = HIT_Y + (ARC_R + 10) * Math.sin(midAngle);
                return (
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                    fontSize={11} fill="#f59e0b" fontFamily="monospace" fontWeight={600}>
                    θ₁
                  </text>
                );
              })()}
            </g>
          )}

          {/* θ₂ arc: between upward normal and refracted ray, above surface */}
          {!calc.isTIR && !calc.isCritical && calc.theta2_rad !== null && calc.theta2_deg! > 2 && refractedAngleSVG !== null && (
            <g clipPath="url(#airClip)">
              <path
                d={arcPath(HIT_X, HIT_Y, normalUpAngle, refractedAngleSVG, ARC_R)}
                fill="none" stroke="#f59e0b" strokeWidth={1.2} opacity={0.85}
              />
              {(() => {
                const midAngle = (normalUpAngle + refractedAngleSVG) / 2;
                const lx = HIT_X + (ARC_R + 10) * Math.cos(midAngle);
                const ly = HIT_Y + (ARC_R + 10) * Math.sin(midAngle);
                return (
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                    fontSize={11} fill="#f59e0b" fontFamily="monospace" fontWeight={600}>
                    θ₂
                  </text>
                );
              })()}
            </g>
          )}

          {/* ── STATUS BADGE (top-center of SVG) ── */}
          {(() => {
            const badgeW = 280;
            const badgeH = 26;
            const bx = (SVG_W - badgeW) / 2;
            const by = 8;
            return (
              <g>
                <rect
                  x={bx} y={by} width={badgeW} height={badgeH}
                  rx={13}
                  fill={statusColor} fillOpacity={statusBgOpacity}
                  stroke={statusColor} strokeWidth={1.5}
                />
                <text
                  x={SVG_W / 2} y={by + badgeH / 2 + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={12} fill={statusColor} fontWeight={700}
                  fontFamily="var(--font-manrope, sans-serif)"
                >
                  {statusText}
                </text>
              </g>
            );
          })()}

          {/* θ_c tick on normal line to indicate critical angle */}
          {!calc.isTIR && !calc.isCritical && (
            <text x={HIT_X + 4} y={HIT_Y + 14} fontSize={9} fill="var(--muted)" opacity={0.55}
              fontFamily="monospace">
              {t("มุมวิกฤต", "θc")} {calc.thetaC_deg.toFixed(1)}°
            </text>
          )}
        </svg>
      </div>

      {/* 7. Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            n<sub>1</sub> — {t("ตัวกลาง", "Medium")}
          </div>
          <div className="text-base font-medium">{n1.toFixed(2)}</div>
          <div className="text-[10px] text-[var(--muted)]">
            {t(mediumTh, mediumEn)}
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            n<sub>2</sub> — {t("อากาศ", "Air")}
          </div>
          <div className="text-base font-medium">1.00</div>
          <div className="text-[10px] text-[var(--muted)]">{t("คงที่", "fixed")}</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            θ<sub>1</sub> — {t("มุมตกกระทบ", "Incidence")}
          </div>
          <div className="text-base font-medium">{theta1Deg}°</div>
          <div className="text-[10px] text-[var(--muted)]">{t("จากเส้นแนวฉาก", "from normal")}</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            θ<sub>2</sub> — {t("มุมหักเห", "Refraction")}
          </div>
          <div className="text-base font-medium">
            {calc.isTIR
              ? "—"
              : calc.isCritical
              ? "90°"
              : calc.theta2_deg !== null
              ? `${calc.theta2_deg.toFixed(1)}°`
              : "—"}
          </div>
          <div className="text-[10px]" style={{ color: calc.isTIR ? "#ef4444" : "var(--muted)" }}>
            {calc.isTIR ? t("สะท้อนกลับหมด", "TIR") : t("จากเส้นแนวฉาก", "from normal")}
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            θ<sub>c</sub> — {t("มุมวิกฤต", "Critical angle")}
          </div>
          <div className="text-base font-medium">{calc.thetaC_deg.toFixed(1)}°</div>
          <div className="text-[10px] text-[var(--muted)]">arcsin(n₂/n₁)</div>
        </div>

        <div
          className="bg-[var(--card-bg)] border rounded-2xl p-3"
          style={{ borderColor: statusColor, borderWidth: 1.5 }}
        >
          <div className="text-[10px] mb-0.5 font-medium" style={{ color: statusColor }}>
            {t("สถานะ", "Status")}
          </div>
          <div className="text-sm font-bold leading-tight" style={{ color: statusColor }}>
            {calc.isTIR
              ? t("สะท้อนกลับหมด", "TIR")
              : calc.isCritical
              ? t("วิกฤต", "Critical")
              : t("หักเห", "Refraction")}
          </div>
        </div>
      </div>

      {/* 8. Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-7 h-0.5 bg-[#f59e0b]" />
          {t("รังสีตกกระทบ / หักเห", "Incident / refracted ray")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-7 h-0.5 bg-[#3b82f6]" />
          {t("รังสีสะท้อน", "Reflected ray")}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-7"
            style={{ height: 0, borderTop: "2px dashed var(--muted)" }}
          />
          {t("เส้นแนวฉาก", "Normal line")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#3b82f6] opacity-25" />
          {t("น้ำ / ตัวกลาง", "Water / medium")}
        </div>
      </div>
    </div>
  );
}
