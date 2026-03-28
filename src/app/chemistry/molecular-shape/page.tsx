"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

type Vec3 = [number, number, number];

type GeometryInfo = {
  nameTH: string;
  nameEN: string;
  bondAngle: string;
  examples: string;
  /** Unit-vector positions for bonding pairs in 3-D */
  bondPositions: Vec3[];
  /** Unit-vector positions for lone pairs in 3-D */
  lonePositions: Vec3[];
};

/* ---- 3-D unit-vector constants ---- */
const S89 = Math.sqrt(8 / 9);   // ≈ 0.9428
const S29 = Math.sqrt(2 / 9);   // ≈ 0.4714
const S23 = Math.sqrt(2 / 3);   // ≈ 0.8165
const S32 = Math.sqrt(3) / 2;   // ≈ 0.8660

const GEOMETRY_DATA: Record<string, GeometryInfo> = {
  /* ===== 1 bond (no real VSEPR but included for completeness) ===== */
  "1-0": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    examples: "HF, HCl, HBr",
    bondPositions: [[0, 1, 0]],
    lonePositions: [],
  },

  /* ===== 2 total electron domains — Linear ===== */
  "2-0": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "180°",
    examples: "CO₂, BeCl₂, CS₂",
    bondPositions: [[0, 1, 0], [0, -1, 0]],
    lonePositions: [],
  },
  "1-1": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    examples: "CO",
    bondPositions: [[0, 1, 0]],
    lonePositions: [[0, -1, 0]],
  },

  /* ===== 3 total electron domains — Trigonal Planar base ===== */
  "3-0": {
    nameTH: "สามเหลี่ยมแบน", nameEN: "Trigonal Planar",
    bondAngle: "120°",
    examples: "BF₃, SO₃, NO₃⁻, AlCl₃",
    bondPositions: [[0, 1, 0], [S32, -0.5, 0], [-S32, -0.5, 0]],
    lonePositions: [],
  },
  "2-1": {
    nameTH: "มุมงอ", nameEN: "Bent",
    bondAngle: "~117°",
    examples: "SO₂, O₃, SnCl₂, NO₂⁻",
    bondPositions: [[S32, -0.5, 0], [-S32, -0.5, 0]],
    lonePositions: [[0, 1, 0]],
  },

  /* ===== 4 total electron domains — Tetrahedral base ===== */
  "4-0": {
    nameTH: "ทรงสี่หน้า", nameEN: "Tetrahedral",
    bondAngle: "109.5°",
    examples: "CH₄, SiH₄, CCl₄, NH₄⁺",
    bondPositions: [[0, 1, 0], [S89, -1 / 3, 0], [-S29, -1 / 3, S23], [-S29, -1 / 3, -S23]],
    lonePositions: [],
  },
  "3-1": {
    nameTH: "พีระมิดฐานสามเหลี่ยม", nameEN: "Trigonal Pyramidal",
    bondAngle: "~107°",
    examples: "NH₃, NF₃, PH₃, PCl₃",
    bondPositions: [[S89, -1 / 3, 0], [-S29, -1 / 3, S23], [-S29, -1 / 3, -S23]],
    lonePositions: [[0, 1, 0]],
  },
  "2-2": {
    nameTH: "มุมงอ", nameEN: "Bent",
    bondAngle: "~104.5°",
    examples: "H₂O, H₂S, OF₂, SCl₂",
    bondPositions: [[S89, -1 / 3, 0], [-S29, -1 / 3, S23]],
    lonePositions: [[0, 1, 0], [-S29, -1 / 3, -S23]],
  },
  "1-2": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    examples: "—",
    bondPositions: [[S89, -1 / 3, 0]],
    lonePositions: [[0, 1, 0], [-S29, -1 / 3, S23]],
  },
  "1-3": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    examples: "—",
    bondPositions: [[0, 1, 0]],
    lonePositions: [[S89, -1 / 3, 0], [-S29, -1 / 3, S23], [-S29, -1 / 3, -S23]],
  },

  /* ===== 5 total electron domains — Trigonal Bipyramidal base ===== */
  "5-0": {
    nameTH: "สามเหลี่ยมคู่ฐาน", nameEN: "Trigonal Bipyramidal",
    bondAngle: "90° / 120°",
    examples: "PCl₅, PF₅, AsF₅",
    bondPositions: [
      [0, 1, 0], [0, -1, 0],                          // axial
      [1, 0, 0], [-0.5, 0, S32], [-0.5, 0, -S32],     // equatorial
    ],
    lonePositions: [],
  },
  "4-1": {
    nameTH: "กระดานหก", nameEN: "Seesaw",
    bondAngle: "90° / 120°",
    examples: "SF₄, TeCl₄, IF₄⁺",
    bondPositions: [
      [0, 1, 0], [0, -1, 0],        // axial
      [1, 0, 0], [-0.5, 0, S32],    // 2 equatorial bonds
    ],
    lonePositions: [[-0.5, 0, -S32]], // 1 equatorial lone pair
  },
  "3-2": {
    nameTH: "รูปตัวที", nameEN: "T-shaped",
    bondAngle: "90°",
    examples: "ClF₃, BrF₃, ICl₃",
    bondPositions: [
      [0, 1, 0], [0, -1, 0],  // axial
      [1, 0, 0],               // 1 equatorial bond
    ],
    lonePositions: [[-0.5, 0, S32], [-0.5, 0, -S32]], // 2 equatorial lone pairs
  },
  "2-3": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "180°",
    examples: "XeF₂, I₃⁻, KrF₂",
    bondPositions: [[0, 1, 0], [0, -1, 0]], // axial only
    lonePositions: [[1, 0, 0], [-0.5, 0, S32], [-0.5, 0, -S32]], // all equatorial
  },

  /* ===== 6 total electron domains — Octahedral base ===== */
  "6-0": {
    nameTH: "ทรงแปดหน้า", nameEN: "Octahedral",
    bondAngle: "90°",
    examples: "SF₆, SeF₆, IOF₅",
    bondPositions: [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ],
    lonePositions: [],
  },
  "5-1": {
    nameTH: "พีระมิดฐานสี่เหลี่ยม", nameEN: "Square Pyramidal",
    bondAngle: "~85°",
    examples: "BrF₅, IF₅, XeOF₄",
    bondPositions: [
      [0, 1, 0],
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1],
    ],
    lonePositions: [[0, -1, 0]],
  },
  "4-2": {
    nameTH: "สี่เหลี่ยมแบน", nameEN: "Square Planar",
    bondAngle: "90°",
    examples: "XeF₄, ICl₄⁻",
    bondPositions: [
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1],
    ],
    lonePositions: [[0, 1, 0], [0, -1, 0]],
  },
  "3-3": {
    nameTH: "รูปตัวที", nameEN: "T-shaped",
    bondAngle: "90°",
    examples: "—",
    bondPositions: [[1, 0, 0], [-1, 0, 0], [0, 0, 1]],
    lonePositions: [[0, 1, 0], [0, -1, 0], [0, 0, -1]],
  },
};

/* ---- 3-D math helpers ---- */
function rotatePoint(p: Vec3, rx: number, ry: number): Vec3 {
  // rotate around Y
  const cosY = Math.cos(ry), sinY = Math.sin(ry);
  const x1 = p[0] * cosY + p[2] * sinY;
  const y1 = p[1];
  const z1 = -p[0] * sinY + p[2] * cosY;
  // rotate around X
  const cosX = Math.cos(rx), sinX = Math.sin(rx);
  return [x1, y1 * cosX - z1 * sinX, y1 * sinX + z1 * cosX];
}

/* ================================================================ */
export default function MolecularShapePage() {
  const { t } = useLang();
  const [bondingPairs, setBondingPairs] = useState(4);
  const [lonePairs, setLonePairs] = useState(0);
  const [rotation, setRotation] = useState<[number, number]>([-0.35, 0.65]);
  const dragRef = useRef<{ sx: number; sy: number; sr: [number, number] } | null>(null);

  const clampBonding = (v: number) => Math.max(1, Math.min(6, v));
  const clampLone = (v: number) => Math.max(0, Math.min(Math.min(3, 6 - bondingPairs), v));

  const key = `${bondingPairs}-${lonePairs}`;
  const geometry = GEOMETRY_DATA[key];
  const totalDomains = bondingPairs + lonePairs;

  /* ---- SVG / projection constants ---- */
  const SIZE = 400;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const BOND_LEN = 130;
  const LONE_LEN = 95;
  const FOV = 4;
  const CENTRAL_R = 24;
  const OUTER_R = 16;

  const proj = (p: Vec3, len: number) => {
    const r = rotatePoint(p, rotation[0], rotation[1]);
    const s = FOV / (FOV + r[2]);
    return { x: CX + r[0] * len * s, y: CY - r[1] * len * s, z: r[2], s };
  };

  /* ---- pointer / touch handlers ---- */
  const onDown = (e: React.PointerEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, sr: [rotation[0], rotation[1]] };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setRotation([
      d.sr[0] + (e.clientY - d.sy) * 0.008,
      d.sr[1] + (e.clientX - d.sx) * 0.008,
    ]);
  };
  const onUp = () => {
    dragRef.current = null;
  };

  /* ---- build renderable arm list ---- */
  type Arm = {
    kind: "bond" | "lone";
    z: number;
    ex: number;
    ey: number;
    s: number;
    angle: number;
  };

  const arms: Arm[] = [];
  if (geometry) {
    for (const bp of geometry.bondPositions) {
      const p = proj(bp, BOND_LEN);
      arms.push({
        kind: "bond",
        z: p.z,
        ex: p.x,
        ey: p.y,
        s: p.s,
        angle: (Math.atan2(p.y - CY, p.x - CX) * 180) / Math.PI,
      });
    }
    for (const lp of geometry.lonePositions) {
      const p = proj(lp, LONE_LEN);
      arms.push({
        kind: "lone",
        z: p.z,
        ex: p.x,
        ey: p.y,
        s: p.s,
        angle: (Math.atan2(p.y - CY, p.x - CX) * 180) / Math.PI,
      });
    }
  }

  // split behind / in-front of center, sort each back→front
  const behind = arms.filter((a) => a.z >= 0).sort((a, b) => b.z - a.z);
  const inFront = arms.filter((a) => a.z < 0).sort((a, b) => b.z - a.z);

  const renderArm = (arm: Arm, i: number) => {
    const opacity = 0.45 + 0.55 * arm.s;
    if (arm.kind === "bond") {
      return (
        <g key={`arm-${i}`}>
          <line
            x1={CX} y1={CY} x2={arm.ex} y2={arm.ey}
            stroke="var(--foreground)" strokeWidth={3 * arm.s}
            opacity={opacity * 0.6}
          />
          <circle
            cx={arm.ex} cy={arm.ey} r={OUTER_R * arm.s}
            fill="#4ade80" stroke="#22c55e" strokeWidth={2}
            opacity={opacity}
          />
          <text
            x={arm.ex} y={arm.ey + 4 * arm.s}
            textAnchor="middle" fontSize={11 * arm.s}
            fill="#052e16" fontWeight={700} opacity={opacity}
          >
            X
          </text>
        </g>
      );
    }
    return (
      <g key={`arm-${i}`}>
        <line
          x1={CX} y1={CY} x2={arm.ex} y2={arm.ey}
          stroke="#c084fc" strokeWidth={2 * arm.s}
          strokeDasharray="6 4" opacity={opacity * 0.5}
        />
        <ellipse
          cx={arm.ex} cy={arm.ey}
          rx={18 * arm.s} ry={28 * arm.s}
          fill="#c084fc" fillOpacity={0.15 * opacity}
          stroke="#c084fc" strokeWidth={1.5}
          strokeDasharray="4 3"
          transform={`rotate(${arm.angle}, ${arm.ex}, ${arm.ey})`}
          opacity={opacity}
        />
        <text
          x={arm.ex} y={arm.ey + 4 * arm.s}
          textAnchor="middle" fontSize={10 * arm.s}
          fill="#c084fc" fontWeight={600} opacity={opacity}
        >
          LP
        </text>
      </g>
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/chemistry" className="hover:underline">
          {t("เคมี", "Chemistry")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("รูปร่างโมเลกุล", "Molecular Shape")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {t("รูปร่างโมเลกุลตามทฤษฎี VSEPR", "VSEPR Molecular Geometry Visualizer")}
      </h1>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* Bonding pairs */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
          <div className="text-xs text-[var(--muted)] mb-2">
            {t("คู่พันธะ (Bonding Pairs)", "Bonding Pairs")}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBondingPairs((b) => clampBonding(b - 1))}
              className="w-9 h-9 rounded-lg border border-[var(--card-border)] text-lg font-medium hover:bg-[var(--card-bg)] active:scale-95 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold w-8 text-center">{bondingPairs}</span>
            <button
              onClick={() => setBondingPairs((b) => clampBonding(b + 1))}
              className="w-9 h-9 rounded-lg border border-[var(--card-border)] text-lg font-medium hover:bg-[var(--card-bg)] active:scale-95 flex items-center justify-center"
            >
              +
            </button>
            <span className="text-xs text-[var(--muted)] ml-2">(1 – 6)</span>
          </div>
        </div>

        {/* Lone pairs */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
          <div className="text-xs text-[var(--muted)] mb-2">
            {t("คู่โดดเดี่ยว (Lone Pairs)", "Lone Pairs")}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLonePairs((l) => clampLone(l - 1))}
              className="w-9 h-9 rounded-lg border border-[var(--card-border)] text-lg font-medium hover:bg-[var(--card-bg)] active:scale-95 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold w-8 text-center">{lonePairs}</span>
            <button
              onClick={() => setLonePairs((l) => clampLone(l + 1))}
              className="w-9 h-9 rounded-lg border border-[var(--card-border)] text-lg font-medium hover:bg-[var(--card-bg)] active:scale-95 flex items-center justify-center"
            >
              +
            </button>
            <span className="text-xs text-[var(--muted)] ml-2">(0 – 3)</span>
          </div>
        </div>
      </div>

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {/* AXnEm notation */}
        <span className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-4 py-1.5 text-sm font-mono">
          AX<sub>{bondingPairs}</sub>E<sub>{lonePairs}</sub>
        </span>

        {/* Geometry name */}
        {geometry && (
          <span className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-4 py-1.5 text-sm font-medium">
            {t(geometry.nameTH, geometry.nameEN)}
          </span>
        )}

        {/* Bond angle */}
        {geometry && (
          <span className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-4 py-1.5 text-sm">
            {t("มุมพันธะ", "Bond angle")}:{" "}
            <span className="font-medium">{geometry.bondAngle}</span>
          </span>
        )}

        {/* Electron domains */}
        <span className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-4 py-1.5 text-sm text-[var(--muted)]">
          {t("โดเมนอิเล็กตรอน", "Electron domains")}: {totalDomains}
        </span>

        {/* Example molecules */}
        {geometry && geometry.examples !== "—" && (
          <span className="bg-[var(--accent-bg)] border border-[var(--accent-border,var(--card-border))] rounded-full px-4 py-1.5 text-sm">
            {t("ตัวอย่าง", "Examples")}:{" "}
            <span className="font-semibold">{geometry.examples}</span>
          </span>
        )}
      </div>

      {/* 3-D SVG Visualization */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex flex-col items-center justify-center mb-6 select-none">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="max-w-full h-auto cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* subtle background guide circle */}
          <circle
            cx={CX} cy={CY} r={BOND_LEN + OUTER_R + 8}
            fill="none" stroke="var(--card-border)"
            strokeWidth={1} strokeDasharray="4 4" opacity={0.3}
          />

          {geometry ? (
            <>
              {/* arms behind center */}
              {behind.map((arm, i) => renderArm(arm, i))}

              {/* central atom (always on top of behind arms) */}
              <circle
                cx={CX} cy={CY} r={CENTRAL_R}
                fill="#60a5fa" stroke="#3b82f6" strokeWidth={2.5}
              />
              <text
                x={CX} y={CY + 5}
                textAnchor="middle" fontSize={14}
                fill="#1e3a5f" fontWeight={700}
              >
                A
              </text>

              {/* arms in front of center */}
              {inFront.map((arm, i) => renderArm(arm, behind.length + i))}
            </>
          ) : (
            <text
              x={CX} y={CY}
              textAnchor="middle" fontSize={14} fill="var(--muted)"
            >
              {t(
                "ไม่มีข้อมูลสำหรับการจัดเรียงนี้",
                "No data for this configuration",
              )}
            </text>
          )}
        </svg>

        {/* Interaction hints */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-[var(--muted)]">
            {t("ลากเพื่อหมุนโมเลกุล 3 มิติ", "Drag to rotate the 3-D molecule")}
          </span>
          <button
            onClick={() => setRotation([-0.35, 0.65])}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] underline"
          >
            {t("รีเซ็ตมุมมอง", "Reset view")}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#60a5fa] border border-[#3b82f6]" />
          {t("อะตอมกลาง (A)", "Central atom (A)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#4ade80] border border-[#22c55e]" />
          {t("อะตอมที่เชื่อมต่อ (X)", "Bonded atom (X)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#c084fc] opacity-40 border border-[#c084fc]" />
          {t("คู่โดดเดี่ยว (E)", "Lone pair (E)")}
        </div>
      </div>
    </div>
  );
}
