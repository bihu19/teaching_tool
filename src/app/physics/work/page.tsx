"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

const G = 9.81;

/* ---- SVG arrow helper ---- */
function Arrow({
  x1, y1, x2, y2, color, label, labelSide = "left", dashed,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; label?: string; labelSide?: "left" | "right"; dashed?: boolean;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 3) return null;
  const ux = dx / len, uy = dy / len;
  const hl = Math.min(10, len * 0.35);
  const hx = x2 - ux * hl, hy = y2 - uy * hl;
  const px = -uy * 4, py = ux * 4;
  const side = labelSide === "right" ? -1 : 1;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={2.5}
        strokeDasharray={dashed ? "6 4" : undefined} />
      <polygon points={`${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}`} fill={color} />
      {label && (
        <text
          x={(x1 + x2) / 2 + side * Math.abs(py) * 1.8 + side * Math.abs(px) * 1.8}
          y={(y1 + y2) / 2 + side * Math.abs(px) * 0.5}
          textAnchor="middle" dominantBaseline="central"
          fontSize={11} fill={color} fontWeight={600}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function WorkPage() {
  const { t } = useLang();

  /* ---- state ---- */
  const [force, setForce] = useState(50);
  const [angle, setAngle] = useState(30);
  const [distance, setDistance] = useState(5);
  const [mass, setMass] = useState(10);
  const [hasFriction, setHasFriction] = useState(false);
  const [muS, setMuS] = useState(0.5);
  const [muK, setMuK] = useState(0.3);

  /* enforce μs > μk */
  const handleMuS = (raw: number) => {
    const v = Math.max(0.01, Math.min(1, raw));
    setMuS(v);
    if (muK >= v) setMuK(Math.round((v - 0.01) * 100) / 100);
  };
  const handleMuK = (raw: number) => {
    setMuK(Math.max(0, Math.min(Math.round((muS - 0.01) * 100) / 100, raw)));
  };

  /* ---- physics calculations ---- */
  const calc = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const W = mass * G;
    const Fx = force * Math.cos(rad);
    const Fy = force * Math.sin(rad);
    const N = Math.max(0, W - Fy);
    const liftsOff = W - Fy <= 0;

    const fsMax = hasFriction ? muS * N : 0;
    const fk = hasFriction ? muK * N : 0;

    const canMove = liftsOff || Fx > fsMax;

    const Wapplied = canMove ? Fx * distance : 0;
    const Wfriction = canMove && hasFriction && !liftsOff ? -fk * distance : 0;
    const Wnet = Wapplied + Wfriction;

    return { rad, W, Fx, Fy, N, liftsOff, fsMax, fk, canMove, Wapplied, Wfriction, Wnet };
  }, [force, angle, distance, mass, hasFriction, muS, muK]);

  /* ---- main scene SVG constants ---- */
  const SVG_W = 600, SVG_H = 260;
  const GY = 195; // ground y
  const BS = 50; // box size
  const BX = 120; // box left-x
  const BY = GY - BS; // box top-y
  const BCX = BX + BS / 2, BCY = BY + BS / 2;

  // Force arrow end point
  const arrowLen = Math.min(120, force * 1.2);
  const FAX = BCX + arrowLen * Math.cos(-calc.rad);
  const FAY = BCY + arrowLen * Math.sin(-calc.rad); // SVG y is flipped

  /* ---- FBD SVG constants ---- */
  const FBD = 200;
  const FC = FBD / 2;
  const FBD_ARROW = 60;
  const fbdForceLen = Math.min(FBD_ARROW, force * 0.8);
  const fbdWeightLen = Math.min(FBD_ARROW, calc.W * 0.6);
  const fbdNormalLen = Math.min(FBD_ARROW, calc.N * 0.6);
  const fbdFrictionLen = hasFriction && calc.canMove ? Math.min(FBD_ARROW, calc.fk * 1.2) : 0;

  const statusText = calc.liftsOff
    ? t("กล่องลอย!", "Box lifts off!")
    : calc.canMove
    ? t("กล่องเคลื่อนที่ ✓", "Box moves ✓")
    : t("กล่องไม่เคลื่อนที่ ✕", "Box stays ✕");

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>&rsaquo;</span>
        <span>{t("งาน", "Work")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        🔧 {t("งาน (Work)", "Work")}
      </h1>

      {/* Formula */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          W = <span className="font-medium text-[var(--foreground)]">F · d · cos θ</span>
        </span>
        {hasFriction && (
          <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
            W<sub>f</sub> = <span className="font-medium text-[var(--foreground)]">−μ<sub>k</sub> · N · d</span>
          </span>
        )}
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          N = <span className="font-medium text-[var(--foreground)]">mg − F sin θ</span>
        </span>
      </div>

      {/* Controls row 1: Force, Angle, Mass */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ตั้งค่า", "Settings")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("แรง F (นิวตัน)", "Force F (N)")}
          </label>
          <input type="range" min={0} max={200} step={1} value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            className="w-full mb-1" />
          <input type="number" value={force} min={0} max={500} step={1}
            onChange={(e) => setForce(Math.max(0, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("มุม θ (องศา)", "Angle θ (degrees)")}
          </label>
          <input type="range" min={0} max={90} step={1} value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full mb-1" />
          <input type="number" value={angle} min={0} max={90} step={1}
            onChange={(e) => setAngle(Math.max(0, Math.min(90, Number(e.target.value))))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("มวล m (กิโลกรัม)", "Mass m (kg)")}
          </label>
          <input type="number" value={mass} min={0.1} step={1}
            onChange={(e) => setMass(Math.max(0.1, Number(e.target.value)))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
        </div>
      </div>

      {/* Controls row 2: Distance + Friction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Distance selector */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-2">
            {t("ระยะทาง d (เมตร)", "Distance d (meters)")}
          </label>
          <div className="flex gap-2">
            {[1, 5, 10].map((d) => (
              <button key={d}
                onClick={() => setDistance(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  distance === d
                    ? "bg-[var(--foreground)] text-[var(--background)] border-transparent"
                    : "border-[var(--card-border)] hover:bg-[var(--background)]"
                }`}
              >
                {d} m
              </button>
            ))}
          </div>
        </div>

        {/* Friction */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2 cursor-pointer">
            <input type="checkbox" checked={hasFriction}
              onChange={(e) => setHasFriction(e.target.checked)}
              className="accent-[var(--accent)]" />
            {t("มีแรงเสียดทาน", "Enable friction")}
          </label>
          {hasFriction && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-[var(--muted)] mb-0.5">μ<sub>s</sub> ({t("สถิต", "static")})</div>
                <input type="number" value={muS} min={0.01} max={1} step={0.01}
                  onChange={(e) => handleMuS(Number(e.target.value))}
                  className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
              </div>
              <div>
                <div className="text-[10px] text-[var(--muted)] mb-0.5">μ<sub>k</sub> ({t("จลน์", "kinetic")})</div>
                <input type="number" value={muK} min={0} max={Math.round((muS - 0.01) * 100) / 100} step={0.01}
                  onChange={(e) => handleMuK(Number(e.target.value))}
                  className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scene + Free Body Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Main scene */}
        <div className="sm:col-span-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            {t("แผนภาพแรง", "Force Diagram")}
          </div>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
            {/* Ground with hatching */}
            <line x1={0} y1={GY} x2={SVG_W} y2={GY} stroke="var(--foreground)" strokeWidth={2} />
            {Array.from({ length: 30 }).map((_, i) => (
              <line key={i}
                x1={i * 22} y1={GY} x2={i * 22 - 10} y2={GY + 14}
                stroke="var(--muted)" strokeWidth={1} opacity={0.4} />
            ))}

            {/* Distance bracket */}
            <line x1={BCX} y1={GY + 25} x2={BCX + distance * 30} y2={GY + 25}
              stroke="var(--accent)" strokeWidth={1.5} />
            <line x1={BCX} y1={GY + 20} x2={BCX} y2={GY + 30}
              stroke="var(--accent)" strokeWidth={1.5} />
            <line x1={BCX + distance * 30} y1={GY + 20} x2={BCX + distance * 30} y2={GY + 30}
              stroke="var(--accent)" strokeWidth={1.5} />
            <text x={BCX + (distance * 30) / 2} y={GY + 42}
              textAnchor="middle" fontSize={12} fill="var(--accent)" fontWeight={600}>
              d = {distance} m
            </text>

            {/* Box */}
            <rect x={BX} y={BY} width={BS} height={BS}
              fill="#60a5fa" fillOpacity={0.25} stroke="#3b82f6" strokeWidth={2} rx={4} />
            <text x={BCX} y={BCY + 4} textAnchor="middle" fontSize={13}
              fill="#3b82f6" fontWeight={700}>
              {mass} kg
            </text>

            {/* Applied force arrow */}
            <Arrow x1={BCX} y1={BCY}
              x2={FAX} y2={FAY}
              color="#ef4444" label={`F = ${force} N`} />

            {/* Angle arc */}
            {angle > 0 && angle < 90 && (
              <>
                <path
                  d={`M ${BCX + 30} ${BCY} A 30 30 0 0 ${angle > 0 ? 0 : 1} ${
                    BCX + 30 * Math.cos(-calc.rad)
                  } ${BCY + 30 * Math.sin(-calc.rad)}`}
                  fill="none" stroke="#ef4444" strokeWidth={1.2} opacity={0.7} />
                <text
                  x={BCX + 40 * Math.cos(-calc.rad / 2)}
                  y={BCY + 40 * Math.sin(-calc.rad / 2) + 4}
                  fontSize={11} fill="#ef4444" fontWeight={500}>
                  {angle}°
                </text>
              </>
            )}

            {/* Friction arrow (if applicable and box moves) */}
            {hasFriction && calc.canMove && !calc.liftsOff && calc.fk > 0 && (
              <Arrow x1={BX} y1={GY - 4}
                x2={BX - Math.min(80, calc.fk * 1.2)} y2={GY - 4}
                color="#f59e0b" label={`f = ${calc.fk.toFixed(1)} N`} labelSide="right" dashed />
            )}

            {/* Status badge */}
            <rect x={SVG_W - 180} y={10} width={170} height={28} rx={14}
              fill={calc.canMove ? "#22c55e" : "#ef4444"} fillOpacity={0.15}
              stroke={calc.canMove ? "#22c55e" : "#ef4444"} strokeWidth={1} />
            <text x={SVG_W - 95} y={29} textAnchor="middle" fontSize={12}
              fill={calc.canMove ? "#22c55e" : "#ef4444"} fontWeight={600}>
              {statusText}
            </text>
          </svg>
        </div>

        {/* Free body diagram */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[11px] text-[var(--muted)] font-medium mb-1">
            {t("แผนภาพวัตถุอิสระ (FBD)", "Free Body Diagram")}
          </div>
          <svg viewBox={`0 0 ${FBD} ${FBD}`} className="w-full h-auto">
            {/* Box dot */}
            <rect x={FC - 18} y={FC - 18} width={36} height={36}
              fill="#60a5fa" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={1.5} rx={4} />

            {/* Weight (down) */}
            <Arrow x1={FC} y1={FC + 18} x2={FC} y2={FC + 18 + fbdWeightLen}
              color="#a855f7" label={`mg = ${calc.W.toFixed(1)}`} labelSide="right" />

            {/* Normal (up) */}
            {!calc.liftsOff && calc.N > 0 && (
              <Arrow x1={FC} y1={FC - 18} x2={FC} y2={FC - 18 - fbdNormalLen}
                color="#22c55e" label={`N = ${calc.N.toFixed(1)}`} labelSide="right" />
            )}

            {/* Applied force (at angle) */}
            <Arrow
              x1={FC + 18} y1={FC}
              x2={FC + 18 + fbdForceLen * Math.cos(-calc.rad)}
              y2={FC + fbdForceLen * Math.sin(-calc.rad)}
              color="#ef4444" label={`F = ${force}`} />

            {/* Friction (left) */}
            {hasFriction && calc.canMove && !calc.liftsOff && fbdFrictionLen > 0 && (
              <Arrow x1={FC - 18} y1={FC}
                x2={FC - 18 - fbdFrictionLen} y2={FC}
                color="#f59e0b" label={`f = ${calc.fk.toFixed(1)}`} labelSide="right" dashed />
            )}
          </svg>
        </div>
      </div>

      {/* Force analysis */}
      {hasFriction && !calc.liftsOff && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-5">
          <div className="text-xs text-[var(--muted)] font-medium mb-2">
            {t("วิเคราะห์แรง", "Force Analysis")}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-[10px] text-[var(--muted)]">F cos θ ({t("แรงในแนวราบ", "horizontal")})</div>
              <div className="font-medium">{calc.Fx.toFixed(2)} N</div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)]">N ({t("แรงปกติ", "normal")})</div>
              <div className="font-medium">{calc.N.toFixed(2)} N</div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)]">f<sub>s,max</sub> = μ<sub>s</sub>N</div>
              <div className="font-medium">{calc.fsMax.toFixed(2)} N</div>
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)]">
                {calc.canMove
                  ? t("F cos θ > f_s,max → เคลื่อนที่", "F cos θ > f_s,max → moves")
                  : t("F cos θ ≤ f_s,max → ไม่เคลื่อนที่", "F cos θ ≤ f_s,max → static")}
              </div>
              <div className={`font-medium ${calc.canMove ? "text-green-500" : "text-red-500"}`}>
                {calc.Fx.toFixed(1)} {calc.canMove ? ">" : "≤"} {calc.fsMax.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Work results */}
      <p className="text-xs text-[var(--muted)] mb-1">{t("ผลลัพธ์งาน", "Work Results")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            W<sub>applied</sub> ({t("งานจากแรง F", "work by F")})
          </div>
          <div className="text-lg font-medium text-[#3b82f6]">
            {calc.Wapplied.toFixed(1)} <span className="text-xs font-normal">J</span>
          </div>
          <div className="text-[9px] text-[var(--muted)] font-mono mt-1">
            = F·d·cos θ
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            W<sub>friction</sub> ({t("งานแรงเสียดทาน", "friction work")})
          </div>
          <div className={`text-lg font-medium ${calc.Wfriction < 0 ? "text-[#ef4444]" : ""}`}>
            {calc.Wfriction.toFixed(1)} <span className="text-xs font-normal">J</span>
          </div>
          <div className="text-[9px] text-[var(--muted)] font-mono mt-1">
            = −μ<sub>k</sub>·N·d
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            W<sub>normal</sub> + W<sub>gravity</sub>
          </div>
          <div className="text-lg font-medium">
            0 <span className="text-xs font-normal">J</span>
          </div>
          <div className="text-[9px] text-[var(--muted)] font-mono mt-1">
            {t("ตั้งฉากกับการเคลื่อนที่", "⊥ to motion")}
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--accent)] rounded-xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">
            W<sub>net</sub> ({t("งานสุทธิ", "net work")})
          </div>
          <div className={`text-lg font-bold ${calc.Wnet > 0 ? "text-[#22c55e]" : calc.Wnet < 0 ? "text-[#ef4444]" : ""}`}>
            {calc.Wnet.toFixed(1)} <span className="text-xs font-normal">J</span>
          </div>
          <div className="text-[9px] text-[var(--muted)] font-mono mt-1">
            = W<sub>F</sub> + W<sub>f</sub>
          </div>
        </div>
      </div>

      {/* Work bar visualization */}
      {calc.canMove && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-5">
          <div className="text-xs text-[var(--muted)] font-medium mb-3">
            {t("แผนภาพงาน", "Work Breakdown")}
          </div>
          {(() => {
            const maxW = Math.max(Math.abs(calc.Wapplied), Math.abs(calc.Wfriction), Math.abs(calc.Wnet), 1);
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs w-16 text-right">W<sub>F</sub></span>
                  <div className="flex-1 h-6 bg-[var(--background)] rounded overflow-hidden">
                    <div className="h-full bg-[#3b82f6] rounded transition-all"
                      style={{ width: `${(Math.abs(calc.Wapplied) / maxW) * 100}%` }} />
                  </div>
                  <span className="text-xs w-20 text-[#3b82f6] font-medium">{calc.Wapplied.toFixed(1)} J</span>
                </div>
                {hasFriction && calc.Wfriction !== 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16 text-right">W<sub>f</sub></span>
                    <div className="flex-1 h-6 bg-[var(--background)] rounded overflow-hidden">
                      <div className="h-full bg-[#ef4444] rounded transition-all"
                        style={{ width: `${(Math.abs(calc.Wfriction) / maxW) * 100}%` }} />
                    </div>
                    <span className="text-xs w-20 text-[#ef4444] font-medium">{calc.Wfriction.toFixed(1)} J</span>
                  </div>
                )}
                <div className="flex items-center gap-2 border-t border-[var(--card-border)] pt-2">
                  <span className="text-xs w-16 text-right font-semibold">W<sub>net</sub></span>
                  <div className="flex-1 h-6 bg-[var(--background)] rounded overflow-hidden">
                    <div className={`h-full rounded transition-all ${calc.Wnet >= 0 ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}
                      style={{ width: `${(Math.abs(calc.Wnet) / maxW) * 100}%` }} />
                  </div>
                  <span className={`text-xs w-20 font-bold ${calc.Wnet >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {calc.Wnet.toFixed(1)} J
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
          {t("น้ำหนัก (mg)", "Weight (mg)")}
        </div>
        {hasFriction && (
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 bg-[#f59e0b] border-dashed" style={{ borderTop: "2px dashed #f59e0b", height: 0 }} />
            {t("แรงเสียดทาน (f)", "Friction (f)")}
          </div>
        )}
      </div>
    </div>
  );
}
