"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

const G = 9.81;

/* ---- SVG arrow helper ---- */
function Arrow({
  x1, y1, x2, y2, color, label, labelSide = "left", dashed, fontSize = 10,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; label?: string; labelSide?: "left" | "right"; dashed?: boolean;
  fontSize?: number;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 3) return null;
  const ux = dx / len, uy = dy / len;
  const hl = Math.min(8, len * 0.35);
  const hx = x2 - ux * hl, hy = y2 - uy * hl;
  const px = -uy * 3.5, py = ux * 3.5;

  // Label is placed perpendicular to the arrow, clear of the line itself.
  // For a mostly-horizontal arrow: labelSide "left" → above, "right" → below.
  // For a mostly-vertical arrow:   labelSide "left" → left,  "right" → right.
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const side = labelSide === "right" ? 1 : -1;
  const offset = fontSize * 0.9 + 5;
  const isHorizontal = Math.abs(ux) >= Math.abs(uy);
  const labelX = isHorizontal ? mx : mx + side * offset;
  const labelY = isHorizontal ? my + side * offset : my;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={2}
        strokeDasharray={dashed ? "5 3" : undefined} />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle" dominantBaseline="central"
          fontSize={fontSize} fill={color} fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function FrictionPage() {
  const { t } = useLang();

  /* ---- state ---- */
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(5);
  const [F, setF] = useState(40);
  const [mu1, setMu1] = useState(0.4);
  const [mu2, setMu2] = useState(0.3);
  const [target, setTarget] = useState<"bottom" | "top">("bottom");

  /* ---- physics ---- */
  const calc = useMemo(() => {
    const W1 = m1 * G;
    const W2 = m2 * G;
    const N_between = m1 * G;
    const N_ground = (m1 + m2) * G;
    const f1_max = mu1 * N_between;
    const f2_max = mu2 * N_ground;

    let a_top = 0, a_bottom = 0;
    let f1_on_top = 0;   // friction on top box A (positive = rightward)
    let f1_on_bottom = 0; // friction on bottom box B from A (reaction, positive = rightward)
    let f2_on_bottom = 0; // friction from ground on B (positive = rightward, usually negative)
    let systemMoves = false;
    let boxesSlide = false;
    let status: "static" | "together" | "sliding" = "static";

    if (target === "bottom") {
      // Force F applied to bottom box B (rightward)
      const a_try = (F - f2_max) / (m1 + m2);

      if (a_try <= 0) {
        // System static
        status = "static";
        f2_on_bottom = -F; // ground friction balances F
        f1_on_top = 0;
        f1_on_bottom = 0;
      } else {
        systemMoves = true;
        const f1_needed = m1 * a_try; // friction needed on A to accelerate it

        if (f1_needed <= f1_max) {
          status = "together";
          a_top = a_try;
          a_bottom = a_try;
          f1_on_top = f1_needed;       // friction pushes A forward
          f1_on_bottom = -f1_needed;   // reaction pushes B backward
          f2_on_bottom = -f2_max;      // ground friction backward
        } else {
          status = "sliding";
          boxesSlide = true;
          a_top = f1_max / m1;
          a_bottom = (F - f1_max - f2_max) / m2;
          f1_on_top = f1_max;
          f1_on_bottom = -f1_max;
          f2_on_bottom = -f2_max;
        }
      }
    } else {
      // Force F applied to top box A (rightward)
      const a_try = (F - f2_max) / (m1 + m2);

      if (a_try <= 0) {
        // System might not move, but check if A slides on B
        // For A to be static: friction from B on A must balance F → f1_on_A = -F
        // |f1_on_A| ≤ f1_max?
        if (F <= f1_max) {
          // Everything static
          status = "static";
          f1_on_top = -F;
          f1_on_bottom = F; // reaction on B
          // Ground friction balances reaction: f2 = -F (if F ≤ f2_max)
          f2_on_bottom = -F;
        } else {
          // A slides on B
          systemMoves = true;
          boxesSlide = true;
          status = "sliding";
          a_top = (F - f1_max) / m1;
          f1_on_top = -f1_max;      // friction opposes A's motion (backward)
          f1_on_bottom = f1_max;    // reaction pushes B forward
          // Does B move? f1_max vs f2_max
          if (f1_max > f2_max) {
            a_bottom = (f1_max - f2_max) / m2;
            f2_on_bottom = -f2_max;
          } else {
            a_bottom = 0;
            f2_on_bottom = -f1_max; // ground friction only needs to match
          }
        }
      } else {
        systemMoves = true;
        // Moving together: friction on B from A must provide the push
        // For B: f1_on_B - f2_max = m2 * a_try
        const f1_needed_on_B = m2 * a_try + f2_max;

        if (f1_needed_on_B <= f1_max) {
          status = "together";
          a_top = a_try;
          a_bottom = a_try;
          f1_on_top = -f1_needed_on_B;  // friction on A (backward, reaction)
          f1_on_bottom = f1_needed_on_B; // friction on B (forward)
          f2_on_bottom = -f2_max;
        } else {
          status = "sliding";
          boxesSlide = true;
          a_top = (F - f1_max) / m1;
          f1_on_top = -f1_max;
          f1_on_bottom = f1_max;
          if (f1_max > f2_max) {
            a_bottom = (f1_max - f2_max) / m2;
            f2_on_bottom = -f2_max;
          } else {
            a_bottom = 0;
            f2_on_bottom = -f1_max;
          }
        }
      }
    }

    return {
      W1, W2, N_between, N_ground,
      f1_max, f2_max,
      f1_on_top, f1_on_bottom, f2_on_bottom,
      a_top, a_bottom,
      systemMoves, boxesSlide, status,
    };
  }, [m1, m2, F, mu1, mu2, target]);

  /* ---- Scene SVG ---- */
  const SVG_W = 600, SVG_H = 260;
  const GY = 215;
  const BOX_W = 90;
  const BOX_H_B = 55;
  const BOX_H_A = 45;
  const BX = 240;
  const BY_B = GY - BOX_H_B;
  const BY_A = BY_B - BOX_H_A;
  const BCX = BX + BOX_W / 2;
  const BCY_B = BY_B + BOX_H_B / 2;
  const BCY_A = BY_A + BOX_H_A / 2;

  const forceLen = Math.min(130, Math.max(25, F * 1.2));
  const targetY = target === "bottom" ? BCY_B : BCY_A;

  /* ---- FBD constants ---- */
  const FBD_S = 180;
  const FC = FBD_S / 2;
  const BOX_FBD = 26;
  const MAX_A = 55;

  const fbdScale = (val: number, maxVal: number) =>
    Math.max(10, (Math.abs(val) / Math.max(maxVal, 0.1)) * MAX_A);

  const maxForce = Math.max(
    calc.W1, calc.W2, calc.N_between, calc.N_ground,
    Math.abs(calc.f1_on_top), Math.abs(calc.f2_on_bottom), F, 1
  );

  const badgeColor = calc.status === "static" ? "#ef4444"
    : calc.status === "together" ? "#22c55e" : "#f59e0b";
  const badgeText = calc.status === "static"
    ? t("ไม่เคลื่อนที่", "Static")
    : calc.status === "together"
    ? t("เคลื่อนที่ด้วยกัน ✓", "Move together ✓")
    : t("กล่องไถลกัน ⚡", "Boxes slide ⚡");

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>&rsaquo;</span>
        <span>{t("แรงเสียดทาน (กล่องซ้อน)", "Friction (Stacked Boxes)")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        📦 {t("แรงและแรงเสียดทาน — กล่องซ้อนกัน", "Force & Friction — Stacked Boxes")}
      </h1>

      {/* Formula pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          ΣF = <span className="font-medium text-[var(--foreground)]">ma</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          f = <span className="font-medium text-[var(--foreground)]">μN</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          N<sub>ground</sub> = <span className="font-medium text-[var(--foreground)]">(m₁+m₂)g</span>
        </span>
      </div>

      {/* Controls */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ตั้งค่า", "Settings")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            m₁ — {t("กล่องบน A (kg)", "Top box A (kg)")}
          </label>
          <input type="range" min={0.5} max={50} step={0.5} value={m1}
            onChange={(e) => setM1(Number(e.target.value))} className="w-full mb-1" />
          <input type="number" value={m1} min={0.1} step={0.5}
            onChange={(e) => setM1(Math.max(0.1, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            m₂ — {t("กล่องล่าง B (kg)", "Bottom box B (kg)")}
          </label>
          <input type="range" min={0.5} max={50} step={0.5} value={m2}
            onChange={(e) => setM2(Number(e.target.value))} className="w-full mb-1" />
          <input type="number" value={m2} min={0.1} step={0.5}
            onChange={(e) => setM2(Math.max(0.1, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            F — {t("แรงที่ใช้ (N)", "Applied force (N)")}
          </label>
          <input type="range" min={0} max={200} step={1} value={F}
            onChange={(e) => setF(Number(e.target.value))} className="w-full mb-1" />
          <input type="number" value={F} min={0} step={1}
            onChange={(e) => setF(Math.max(0, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            μ₁ — {t("ระหว่างกล่อง", "Between boxes")}
          </label>
          <input type="range" min={0} max={1} step={0.01} value={mu1}
            onChange={(e) => setMu1(Number(e.target.value))} className="w-full mb-1" />
          <input type="number" value={mu1} min={0} max={2} step={0.01}
            onChange={(e) => setMu1(Math.max(0, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            μ₂ — {t("กล่องล่าง–พื้น", "Bottom box–Ground")}
          </label>
          <input type="range" min={0} max={1} step={0.01} value={mu2}
            onChange={(e) => setMu2(Number(e.target.value))} className="w-full mb-1" />
          <input type="number" value={mu2} min={0} max={2} step={0.01}
            onChange={(e) => setMu2(Math.max(0, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-2">
            {t("ออกแรงที่กล่อง", "Apply force to")}
          </label>
          <div className="flex gap-2">
            <button onClick={() => setTarget("top")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                target === "top"
                  ? "bg-[var(--foreground)] text-[var(--background)] border-transparent"
                  : "border-[var(--card-border)] hover:bg-[var(--background)]"
              }`}>
              {t("กล่องบน A", "Top A")}
            </button>
            <button onClick={() => setTarget("bottom")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                target === "bottom"
                  ? "bg-[var(--foreground)] text-[var(--background)] border-transparent"
                  : "border-[var(--card-border)] hover:bg-[var(--background)]"
              }`}>
              {t("กล่องล่าง B", "Bottom B")}
            </button>
          </div>
        </div>
      </div>

      {/* Scene SVG */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 mb-4">
        <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
          {t("แผนภาพ", "Diagram")}
        </div>
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
          {/* Ground */}
          <line x1={0} y1={GY} x2={SVG_W} y2={GY} stroke="var(--foreground)" strokeWidth={2} />
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={i} x1={i * 22} y1={GY} x2={i * 22 - 10} y2={GY + 12}
              stroke="var(--muted)" strokeWidth={1} opacity={0.4} />
          ))}

          {/* Bottom box B */}
          <rect x={BX} y={BY_B} width={BOX_W} height={BOX_H_B}
            fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2} rx={4} />
          <text x={BCX} y={BCY_B - 6} textAnchor="middle" fontSize={12} fill="#3b82f6" fontWeight={700}>
            B
          </text>
          <text x={BCX} y={BCY_B + 10} textAnchor="middle" fontSize={10} fill="#3b82f6">
            {m2} kg
          </text>

          {/* Top box A */}
          <rect x={BX} y={BY_A} width={BOX_W} height={BOX_H_A}
            fill="#f59e0b" fillOpacity={0.2} stroke="#f59e0b" strokeWidth={2} rx={4} />
          <text x={BCX} y={BCY_A - 5} textAnchor="middle" fontSize={12} fill="#f59e0b" fontWeight={700}>
            A
          </text>
          <text x={BCX} y={BCY_A + 9} textAnchor="middle" fontSize={10} fill="#f59e0b">
            {m1} kg
          </text>

          {/* μ labels at the interfaces */}
          <text x={BX + BOX_W + 12} y={BY_B - 3} fontSize={10} fill="var(--muted)">
            μ₁ = {mu1}
          </text>
          <text x={BX + BOX_W + 12} y={GY - 3} fontSize={10} fill="var(--muted)">
            μ₂ = {mu2}
          </text>

          {/* Applied force arrow (pointing right toward the box) */}
          {F > 0 && (
            <Arrow
              x1={BX - forceLen - 10} y1={targetY}
              x2={BX - 4} y2={targetY}
              color="#ef4444"
              label={`F = ${F} N`}
              labelSide="right"
            />
          )}

          {/* Ground friction arrow on B (backward = left) */}
          {calc.f2_on_bottom !== 0 && (
            <Arrow
              x1={BCX} y1={GY + 2}
              x2={BCX + Math.sign(calc.f2_on_bottom) * Math.min(80, Math.abs(calc.f2_on_bottom) * 0.8)} y2={GY + 2}
              color="#a855f7"
              label={`f₂ = ${Math.abs(calc.f2_on_bottom).toFixed(1)} N`}
              labelSide="right"
              dashed
            />
          )}

          {/* Friction between boxes label (shown at the interface) */}
          {calc.f1_on_top !== 0 && (
            <>
              {/* Friction arrow on A */}
              <Arrow
                x1={BX + BOX_W + 4} y1={BY_B - 2}
                x2={BX + BOX_W + 4 + Math.sign(calc.f1_on_top) * Math.min(60, Math.abs(calc.f1_on_top) * 0.8)} y2={BY_B - 2}
                color="#f59e0b"
                label={`f₁→A`}
                dashed
                fontSize={9}
              />
              {/* Friction arrow on B (reaction) */}
              <Arrow
                x1={BX + BOX_W + 4} y1={BY_B + 4}
                x2={BX + BOX_W + 4 + Math.sign(calc.f1_on_bottom) * Math.min(60, Math.abs(calc.f1_on_bottom) * 0.8)} y2={BY_B + 4}
                color="#3b82f6"
                label={`f₁→B`}
                labelSide="right"
                dashed
                fontSize={9}
              />
            </>
          )}

          {/* Status badge */}
          <rect x={10} y={10} width={180} height={28} rx={14}
            fill={badgeColor} fillOpacity={0.15} stroke={badgeColor} strokeWidth={1} />
          <text x={100} y={29} textAnchor="middle" fontSize={12}
            fill={badgeColor} fontWeight={600}>
            {badgeText}
          </text>

          {/* Acceleration arrows (if moving) */}
          {calc.a_top > 0.01 && (
            <Arrow
              x1={BX + BOX_W + 6} y1={BCY_A}
              x2={BX + BOX_W + 6 + Math.min(50, calc.a_top * 5)} y2={BCY_A}
              color="#f59e0b" label={`a₁ = ${calc.a_top.toFixed(2)}`} fontSize={9} />
          )}
          {calc.a_bottom > 0.01 && (
            <Arrow
              x1={BX + BOX_W + 6} y1={BCY_B}
              x2={BX + BOX_W + 6 + Math.min(50, calc.a_bottom * 5)} y2={BCY_B}
              color="#3b82f6" label={`a₂ = ${calc.a_bottom.toFixed(2)}`} fontSize={9} />
          )}
        </svg>
      </div>

      {/* Free Body Diagrams */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("แผนภาพวัตถุอิสระ (FBD)", "Free Body Diagrams")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* FBD for Top Box A */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            {t("กล่อง A (บน)", "Box A (Top)")}
          </div>
          <svg viewBox={`0 0 ${FBD_S} ${FBD_S}`} className="w-full h-auto">
            <rect x={FC - BOX_FBD / 2} y={FC - BOX_FBD / 2} width={BOX_FBD} height={BOX_FBD}
              fill="#f59e0b" fillOpacity={0.2} stroke="#f59e0b" strokeWidth={1.5} rx={3} />
            <text x={FC} y={FC + 3} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={700}>A</text>

            {/* Weight (down) */}
            <Arrow x1={FC} y1={FC + BOX_FBD / 2}
              x2={FC} y2={FC + BOX_FBD / 2 + fbdScale(calc.W1, maxForce)}
              color="#a855f7" label={`W₁ = ${calc.W1.toFixed(1)}`} labelSide="right" fontSize={9} />

            {/* Normal from B (up) */}
            <Arrow x1={FC} y1={FC - BOX_FBD / 2}
              x2={FC} y2={FC - BOX_FBD / 2 - fbdScale(calc.N_between, maxForce)}
              color="#22c55e" label={`N₁ = ${calc.N_between.toFixed(1)}`} labelSide="right" fontSize={9} />

            {/* Applied force on A (if target === "top", rightward) */}
            {target === "top" && F > 0 && (
              <Arrow x1={FC + BOX_FBD / 2} y1={FC}
                x2={FC + BOX_FBD / 2 + fbdScale(F, maxForce)} y2={FC}
                color="#ef4444" label={`F = ${F}`} fontSize={9} />
            )}

            {/* Friction from B on A (rightward if positive, leftward if negative) */}
            {calc.f1_on_top !== 0 && (
              <Arrow
                x1={FC + (calc.f1_on_top > 0 ? BOX_FBD / 2 : -BOX_FBD / 2)} y1={FC + 6}
                x2={FC + (calc.f1_on_top > 0 ? BOX_FBD / 2 : -BOX_FBD / 2) + Math.sign(calc.f1_on_top) * fbdScale(calc.f1_on_top, maxForce)}
                y2={FC + 6}
                color="#f59e0b" label={`f₁ = ${Math.abs(calc.f1_on_top).toFixed(1)}`} dashed fontSize={9} />
            )}
          </svg>
        </div>

        {/* FBD for Bottom Box B */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            {t("กล่อง B (ล่าง)", "Box B (Bottom)")}
          </div>
          <svg viewBox={`0 0 ${FBD_S} ${FBD_S}`} className="w-full h-auto">
            <rect x={FC - BOX_FBD / 2} y={FC - BOX_FBD / 2} width={BOX_FBD} height={BOX_FBD}
              fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={1.5} rx={3} />
            <text x={FC} y={FC + 3} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight={700}>B</text>

            {/* Weight W₂ (down, from center-left) */}
            <Arrow x1={FC - 8} y1={FC + BOX_FBD / 2}
              x2={FC - 8} y2={FC + BOX_FBD / 2 + fbdScale(calc.W2, maxForce)}
              color="#a855f7" label={`W₂ = ${calc.W2.toFixed(1)}`} labelSide="left" fontSize={9} />

            {/* Normal from A pushing down on B (from center-right, downward) */}
            <Arrow x1={FC + 8} y1={FC + BOX_FBD / 2}
              x2={FC + 8} y2={FC + BOX_FBD / 2 + fbdScale(calc.N_between, maxForce)}
              color="#f59e0b" label={`N₁ = ${calc.N_between.toFixed(1)}`} labelSide="right" fontSize={9} />

            {/* Normal from ground N₂ (up, from center) */}
            <Arrow x1={FC} y1={FC - BOX_FBD / 2}
              x2={FC} y2={FC - BOX_FBD / 2 - fbdScale(calc.N_ground, maxForce)}
              color="#22c55e" label={`N₂ = ${calc.N_ground.toFixed(1)}`} labelSide="right" fontSize={9} />

            {/* Applied force on B (if target === "bottom", rightward) */}
            {target === "bottom" && F > 0 && (
              <Arrow x1={FC + BOX_FBD / 2} y1={FC}
                x2={FC + BOX_FBD / 2 + fbdScale(F, maxForce)} y2={FC}
                color="#ef4444" label={`F = ${F}`} fontSize={9} />
            )}

            {/* Friction from A on B (reaction) */}
            {calc.f1_on_bottom !== 0 && (
              <Arrow
                x1={calc.f1_on_bottom > 0 ? FC + BOX_FBD / 2 : FC - BOX_FBD / 2} y1={FC - 6}
                x2={(calc.f1_on_bottom > 0 ? FC + BOX_FBD / 2 : FC - BOX_FBD / 2) + Math.sign(calc.f1_on_bottom) * fbdScale(calc.f1_on_bottom, maxForce)}
                y2={FC - 6}
                color="#f59e0b" label={`f₁ = ${Math.abs(calc.f1_on_bottom).toFixed(1)}`} dashed fontSize={9} />
            )}

            {/* Ground friction on B (leftward when negative) */}
            {calc.f2_on_bottom !== 0 && (
              <Arrow
                x1={FC + (calc.f2_on_bottom > 0 ? BOX_FBD / 2 : -BOX_FBD / 2)} y1={FC + 6}
                x2={FC + (calc.f2_on_bottom > 0 ? BOX_FBD / 2 : -BOX_FBD / 2) + Math.sign(calc.f2_on_bottom) * fbdScale(calc.f2_on_bottom, maxForce)}
                y2={FC + 6}
                color="#a855f7" label={`f₂ = ${Math.abs(calc.f2_on_bottom).toFixed(1)}`} dashed fontSize={9} />
            )}
          </svg>
        </div>
      </div>

      {/* Force analysis */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-5">
        <div className="text-xs text-[var(--muted)] font-medium mb-2">
          {t("วิเคราะห์แรง", "Force Analysis")}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-[10px] text-[var(--muted)]">N₁ ({t("ระหว่างกล่อง", "between boxes")})</div>
            <div className="font-medium">{calc.N_between.toFixed(2)} N</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted)]">N₂ ({t("จากพื้น", "from ground")})</div>
            <div className="font-medium">{calc.N_ground.toFixed(2)} N</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted)]">f₁,max = μ₁N₁</div>
            <div className="font-medium">{calc.f1_max.toFixed(2)} N</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--muted)]">f₂,max = μ₂N₂</div>
            <div className="font-medium">{calc.f2_max.toFixed(2)} N</div>
          </div>
        </div>
      </div>

      {/* Acceleration results */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ผลลัพธ์", "Results")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            a₁ ({t("กล่อง A", "Box A")})
          </div>
          <div className="text-lg font-medium text-[#f59e0b]">
            {calc.a_top.toFixed(2)} <span className="text-xs font-normal">m/s²</span>
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            a₂ ({t("กล่อง B", "Box B")})
          </div>
          <div className="text-lg font-medium text-[#3b82f6]">
            {calc.a_bottom.toFixed(2)} <span className="text-xs font-normal">m/s²</span>
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            f₁ ({t("ระหว่างกล่อง", "between boxes")})
          </div>
          <div className="text-lg font-medium">
            {Math.abs(calc.f1_on_top).toFixed(1)} <span className="text-xs font-normal">N</span>
          </div>
          <div className="text-[9px] text-[var(--muted)]">
            {t("สูงสุด", "max")} = {calc.f1_max.toFixed(1)} N
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            f₂ ({t("จากพื้น", "from ground")})
          </div>
          <div className="text-lg font-medium">
            {Math.abs(calc.f2_on_bottom).toFixed(1)} <span className="text-xs font-normal">N</span>
          </div>
          <div className="text-[9px] text-[var(--muted)]">
            {t("สูงสุด", "max")} = {calc.f2_max.toFixed(1)} N
          </div>
        </div>
      </div>

      {/* Equation breakdown */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-5">
        <div className="text-xs text-[var(--muted)] font-medium mb-3">
          {t("สมการการเคลื่อนที่ (Newton's 2nd Law)", "Equations of Motion (Newton's 2nd Law)")}
        </div>
        <div className="space-y-3 text-sm font-mono">
          {/* Box A equation */}
          <div>
            <div className="text-[10px] text-[#f59e0b] font-sans font-semibold mb-1">
              {t("กล่อง A (บน):", "Box A (Top):")}
            </div>
            {target === "top" ? (
              <div className="text-xs leading-relaxed">
                <span className="text-[#ef4444]">F</span>
                {" − "}
                <span className="text-[#f59e0b]">f₁</span>
                {" = m₁ · a₁"}
                <br />
                <span className="text-[var(--muted)]">
                  {F} − {Math.abs(calc.f1_on_top).toFixed(1)} = {m1} × {calc.a_top.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-xs leading-relaxed">
                <span className="text-[#f59e0b]">f₁</span>
                {" = m₁ · a₁"}
                <br />
                <span className="text-[var(--muted)]">
                  {Math.abs(calc.f1_on_top).toFixed(1)} = {m1} × {calc.a_top.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--card-border)]" />

          {/* Box B equation */}
          <div>
            <div className="text-[10px] text-[#3b82f6] font-sans font-semibold mb-1">
              {t("กล่อง B (ล่าง):", "Box B (Bottom):")}
            </div>
            {target === "bottom" ? (
              <div className="text-xs leading-relaxed">
                <span className="text-[#ef4444]">F</span>
                {" − "}
                <span className="text-[#f59e0b]">f₁</span>
                {" − "}
                <span className="text-[#a855f7]">f₂</span>
                {" = m₂ · a₂"}
                <br />
                <span className="text-[var(--muted)]">
                  {F} − {Math.abs(calc.f1_on_bottom).toFixed(1)} − {Math.abs(calc.f2_on_bottom).toFixed(1)} = {m2} × {calc.a_bottom.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-xs leading-relaxed">
                <span className="text-[#f59e0b]">f₁</span>
                {" − "}
                <span className="text-[#a855f7]">f₂</span>
                {" = m₂ · a₂"}
                <br />
                <span className="text-[var(--muted)]">
                  {Math.abs(calc.f1_on_bottom).toFixed(1)} − {Math.abs(calc.f2_on_bottom).toFixed(1)} = {m2} × {calc.a_bottom.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#ef4444]" />
          {t("แรงที่ใช้ (F)", "Applied force (F)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#22c55e]" />
          {t("แรงปกติ (N)", "Normal force (N)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#a855f7]" />
          {t("น้ำหนัก / แรงเสียดทานพื้น", "Weight / Ground friction")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-[#f59e0b]" style={{ borderTop: "2px dashed #f59e0b", height: 0 }} />
          {t("แรงเสียดทานระหว่างกล่อง", "Friction between boxes")}
        </div>
      </div>
    </div>
  );
}
