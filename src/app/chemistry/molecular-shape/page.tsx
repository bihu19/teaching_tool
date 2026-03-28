"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

type GeometryInfo = {
  nameTH: string;
  nameEN: string;
  bondAngle: string;
  /** 2D angles in radians for bonding pairs */
  bondAngles: number[];
  /** 2D angles in radians for lone pairs */
  loneAngles: number[];
};

const DEG = Math.PI / 180;

const GEOMETRY_DATA: Record<string, GeometryInfo> = {
  // 2 domains
  "1-0": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "180°",
    bondAngles: [0],
    loneAngles: [],
  },
  "2-0": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "180°",
    bondAngles: [0, 180 * DEG],
    loneAngles: [],
  },
  // 3 domains
  "3-0": {
    nameTH: "สามเหลี่ยมแบน", nameEN: "Trigonal Planar",
    bondAngle: "120°",
    bondAngles: [0, 120 * DEG, 240 * DEG],
    loneAngles: [],
  },
  "2-1": {
    nameTH: "มุมงอ", nameEN: "Bent",
    bondAngle: "~117°",
    bondAngles: [0, 120 * DEG],
    loneAngles: [240 * DEG],
  },
  "1-1": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    bondAngles: [0],
    loneAngles: [180 * DEG],
  },
  // 4 domains
  "4-0": {
    nameTH: "ทรงสี่หน้า", nameEN: "Tetrahedral",
    bondAngle: "109.5°",
    bondAngles: [0, 109.5 * DEG, 219 * DEG, 328.5 * DEG],
    loneAngles: [],
  },
  "3-1": {
    nameTH: "พีระมิดฐานสามเหลี่ยม", nameEN: "Trigonal Pyramidal",
    bondAngle: "~107°",
    bondAngles: [30 * DEG, 150 * DEG, 270 * DEG],
    loneAngles: [270 * DEG - 180 * DEG],
  },
  "2-2": {
    nameTH: "มุมงอ", nameEN: "Bent",
    bondAngle: "~104.5°",
    bondAngles: [0, 104.5 * DEG],
    loneAngles: [180 * DEG, 255 * DEG],
  },
  "1-2": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    bondAngles: [0],
    loneAngles: [120 * DEG, 240 * DEG],
  },
  "1-3": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "—",
    bondAngles: [0],
    loneAngles: [90 * DEG, 180 * DEG, 270 * DEG],
  },
  // 5 domains
  "5-0": {
    nameTH: "สามเหลี่ยมคู่ฐาน", nameEN: "Trigonal Bipyramidal",
    bondAngle: "90°/120°",
    bondAngles: [0, 120 * DEG, 240 * DEG, 90 * DEG, 270 * DEG],
    loneAngles: [],
  },
  "4-1": {
    nameTH: "กระดานหก", nameEN: "Seesaw",
    bondAngle: "90°/120°",
    bondAngles: [0, 120 * DEG, 90 * DEG, 270 * DEG],
    loneAngles: [240 * DEG],
  },
  "3-2": {
    nameTH: "รูปตัวที", nameEN: "T-shaped",
    bondAngle: "90°",
    bondAngles: [0, 90 * DEG, 270 * DEG],
    loneAngles: [120 * DEG, 240 * DEG],
  },
  "2-3": {
    nameTH: "เส้นตรง", nameEN: "Linear",
    bondAngle: "180°",
    bondAngles: [90 * DEG, 270 * DEG],
    loneAngles: [0, 120 * DEG, 240 * DEG],
  },
  // 6 domains
  "6-0": {
    nameTH: "ทรงแปดหน้า", nameEN: "Octahedral",
    bondAngle: "90°",
    bondAngles: [0, 90 * DEG, 180 * DEG, 270 * DEG, 60 * DEG, 300 * DEG],
    loneAngles: [],
  },
  "5-1": {
    nameTH: "พีระมิดฐานสี่เหลี่ยม", nameEN: "Square Pyramidal",
    bondAngle: "90°",
    bondAngles: [0, 90 * DEG, 180 * DEG, 270 * DEG, 45 * DEG],
    loneAngles: [225 * DEG],
  },
  "4-2": {
    nameTH: "สี่เหลี่ยมแบน", nameEN: "Square Planar",
    bondAngle: "90°",
    bondAngles: [0, 90 * DEG, 180 * DEG, 270 * DEG],
    loneAngles: [45 * DEG, 225 * DEG],
  },
  "3-3": {
    nameTH: "รูปตัวที", nameEN: "T-shaped",
    bondAngle: "90°",
    bondAngles: [0, 90 * DEG, 180 * DEG],
    loneAngles: [270 * DEG, 45 * DEG, 225 * DEG],
  },
};

export default function MolecularShapePage() {
  const { t } = useLang();
  const [bondingPairs, setBondingPairs] = useState(4);
  const [lonePairs, setLonePairs] = useState(0);

  const totalDomains = bondingPairs + lonePairs;

  const clampBonding = (val: number) => Math.max(1, Math.min(6, val));
  const clampLone = (val: number) => {
    const maxLone = Math.min(3, 6 - bondingPairs);
    return Math.max(0, Math.min(maxLone, val));
  };

  const key = `${bondingPairs}-${lonePairs}`;
  const geometry = GEOMETRY_DATA[key];

  const svgSize = 400;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const bondLength = 140;
  const loneLength = 100;
  const centralR = 24;
  const outerR = 16;

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
        {/* Bonding pairs control */}
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
            <span className="text-xs text-[var(--muted)] ml-2">(1 - 6)</span>
          </div>
        </div>

        {/* Lone pairs control */}
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
            <span className="text-xs text-[var(--muted)] ml-2">(0 - 3)</span>
          </div>
        </div>
      </div>

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {/* AXnEm notation */}
        <span className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-4 py-1.5 text-sm font-mono">
          AX
          <sub>{bondingPairs}</sub>
          E
          <sub>{lonePairs}</sub>
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
            {t("มุมพันธะ", "Bond angle")}: <span className="font-medium">{geometry.bondAngle}</span>
          </span>
        )}

        {/* Total domains */}
        <span className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-4 py-1.5 text-sm text-[var(--muted)]">
          {t("โดเมนอิเล็กตรอน", "Electron domains")}: {totalDomains}
        </span>
      </div>

      {/* SVG Visualization */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center justify-center mb-6">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="max-w-full h-auto"
        >
          {/* Background circle guide */}
          <circle
            cx={cx}
            cy={cy}
            r={bondLength + outerR + 8}
            fill="none"
            stroke="var(--card-border)"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.4}
          />

          {geometry ? (
            <>
              {/* Lone pair ovals */}
              {geometry.loneAngles.map((angle, i) => {
                const endX = cx + Math.cos(angle - Math.PI / 2) * loneLength;
                const endY = cy + Math.sin(angle - Math.PI / 2) * loneLength;
                const angleDeg = (angle * 180) / Math.PI - 90;
                return (
                  <g key={`lp-${i}`}>
                    {/* Lone pair dashed line */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={endX}
                      y2={endY}
                      stroke="#c084fc"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      opacity={0.6}
                    />
                    {/* Electron cloud oval */}
                    <ellipse
                      cx={endX}
                      cy={endY}
                      rx={18}
                      ry={28}
                      fill="#c084fc"
                      fillOpacity={0.15}
                      stroke="#c084fc"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                      transform={`rotate(${angleDeg}, ${endX}, ${endY})`}
                    />
                    {/* Label */}
                    <text
                      x={endX}
                      y={endY + 4}
                      textAnchor="middle"
                      fontSize={10}
                      fill="#c084fc"
                      fontWeight={600}
                    >
                      LP
                    </text>
                  </g>
                );
              })}

              {/* Bonding pairs */}
              {geometry.bondAngles.map((angle, i) => {
                const endX = cx + Math.cos(angle - Math.PI / 2) * bondLength;
                const endY = cy + Math.sin(angle - Math.PI / 2) * bondLength;
                return (
                  <g key={`bp-${i}`}>
                    {/* Bond line */}
                    <line
                      x1={cx}
                      y1={cy}
                      x2={endX}
                      y2={endY}
                      stroke="var(--foreground)"
                      strokeWidth={3}
                      opacity={0.6}
                    />
                    {/* Bonded atom */}
                    <circle
                      cx={endX}
                      cy={endY}
                      r={outerR}
                      fill="#4ade80"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                    <text
                      x={endX}
                      y={endY + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fill="#052e16"
                      fontWeight={700}
                    >
                      X
                    </text>
                  </g>
                );
              })}

              {/* Central atom */}
              <circle
                cx={cx}
                cy={cy}
                r={centralR}
                fill="#60a5fa"
                stroke="#3b82f6"
                strokeWidth={2.5}
              />
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fontSize={14}
                fill="#1e3a5f"
                fontWeight={700}
              >
                A
              </text>
            </>
          ) : (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              fontSize={14}
              fill="var(--muted)"
            >
              {t(
                "ไม่มีข้อมูลสำหรับการจัดเรียงนี้",
                "No data for this configuration"
              )}
            </text>
          )}
        </svg>
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
