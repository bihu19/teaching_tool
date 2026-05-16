"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

const W = 720, H = 380;
const CX = 360, CY = 190;
const F_PX = 100;
const OBJ_H = 60;
const LENS_HALF = 110;
const RIGHT_EDGE = W - 8;

type LensType = "convex" | "concave";
type Preset = "gt2f" | "at2f" | "btf2f" | "atf" | "ltf";

const PRESET_DO: Record<Preset, number> = {
  gt2f: 280,
  at2f: 200,
  btf2f: 150,
  atf: 100,
  ltf: 60,
};

const PRESET_LABELS_TH: Record<Preset, string> = {
  gt2f: "u > 2f",
  at2f: "u = 2f",
  btf2f: "f < u < 2f",
  atf: "u = f",
  ltf: "u < f",
};

type RaySeg = { pts: [number, number][]; color: string; dashed?: boolean };

function extendRight(px: number, py: number, dx: number, dy: number): [number, number] {
  if (Math.abs(dx) < 0.001) return [px, py];
  const t = (RIGHT_EDGE - px) / dx;
  return [RIGHT_EDGE, py + t * dy];
}

function buildRays(lensType: LensType, do_px: number): {
  rays: RaySeg[];
  v: number;
  mag: number;
  img_x: number | null;
  img_tip_y: number | null;
} {
  const f = lensType === "convex" ? F_PX : -F_PX;
  const denom = 1 / f - 1 / do_px;
  const v = Math.abs(denom) < 0.0001 ? Infinity : 1 / denom;
  const u = -do_px;
  const mag = isFinite(v) ? v / u : Infinity;

  const obj_x = CX - do_px;
  const obj_ty = CY - OBJ_H;
  const img_x = isFinite(v) ? CX + v : null;
  const img_tip_y = isFinite(v) && isFinite(mag) ? CY - mag * OBJ_H : null;

  const F_near_x = CX - F_PX;
  const F_far_x = CX + F_PX;

  const R = { r1: "#ef4444", r2: "#3b82f6", r3: "#22c55e" };
  const rays: RaySeg[] = [];

  if (lensType === "convex") {
    const h1 = obj_ty;
    // Ray 1: parallel → exits through F_far
    const dir1 = [F_far_x - CX, CY - h1] as [number, number];
    const end1: [number, number] =
      img_x !== null && img_tip_y !== null && v > 0
        ? [img_x, img_tip_y]
        : extendRight(CX, h1, dir1[0], dir1[1]);
    rays.push({ pts: [[obj_x, h1], [CX, h1], end1], color: R.r1 });

    // Ray 2: through centre
    const end2: [number, number] =
      img_x !== null && img_tip_y !== null && v > 0
        ? [img_x, img_tip_y]
        : extendRight(CX, CY, CX - obj_x, CY - obj_ty);
    rays.push({ pts: [[obj_x, obj_ty], [CX, CY], end2], color: R.r2 });

    // Ray 3: through near focal point → parallel
    if (do_px !== F_PX) {
      const dxF = F_near_x - obj_x;
      const dyF = CY - obj_ty;
      const t3 = dxF !== 0 ? (CX - obj_x) / dxF : 0;
      const hitY3 = obj_ty + t3 * dyF;
      const endX3 = img_x !== null && v > 0 ? img_x : RIGHT_EDGE;
      const endY3 = hitY3;

      if (do_px > F_PX) {
        rays.push({ pts: [[obj_x, obj_ty], [F_near_x, CY], [CX, hitY3], [endX3, endY3]], color: R.r3 });
      } else {
        // Object inside F — ray goes straight to lens, ext back toward F_near
        rays.push({ pts: [[obj_x, obj_ty], [CX, hitY3], [endX3, endY3]], color: R.r3 });
        rays.push({ pts: [[CX, hitY3], [F_near_x, CY]], color: R.r3, dashed: true });
      }
    }

    // Virtual image (v < 0): draw dashed back-extensions
    if (isFinite(v) && v < 0 && img_x !== null && img_tip_y !== null) {
      rays.push({ pts: [[CX, h1], [img_x, img_tip_y]], color: R.r1, dashed: true });
      rays.push({ pts: [[CX, CY], [img_x, img_tip_y]], color: R.r2, dashed: true });
    }
  } else {
    // Concave lens
    const h1 = obj_ty;

    // Ray 1: parallel → diverges from F_near
    const dx1a = CX - F_near_x; // = F_PX
    const dy1a = h1 - CY;
    const end1 = extendRight(CX, h1, dx1a, dy1a);
    rays.push({ pts: [[obj_x, h1], [CX, h1], end1], color: R.r1 });
    // dashed back-ext to img_tip
    if (img_x !== null && img_tip_y !== null) {
      rays.push({ pts: [[CX, h1], [img_x, img_tip_y]], color: R.r1, dashed: true });
    }

    // Ray 2: through centre
    const end2 = extendRight(CX, CY, CX - obj_x, CY - obj_ty);
    rays.push({ pts: [[obj_x, obj_ty], [CX, CY], end2], color: R.r2 });
    if (img_x !== null && img_tip_y !== null) {
      rays.push({ pts: [[CX, CY], [img_x, img_tip_y]], color: R.r2, dashed: true });
    }

    // Ray 3: aimed at F_far → exits parallel
    const dx3 = F_far_x - obj_x;
    const t3 = (CX - obj_x) / dx3;
    const hitY3 = obj_ty + t3 * (CY - obj_ty);
    const end3 = extendRight(CX, hitY3, 1, 0);
    rays.push({ pts: [[obj_x, obj_ty], [CX, hitY3], end3], color: R.r3 });
    if (img_x !== null && img_tip_y !== null) {
      rays.push({ pts: [[CX, hitY3], [img_x, img_tip_y]], color: R.r3, dashed: true });
    }
  }

  return { rays, v, mag, img_x, img_tip_y };
}

function SummaryRow({
  active, objPos, imgPos, imgType, size,
}: {
  active: boolean; objPos: string; imgPos: string; imgType: string; size: string;
}) {
  return (
    <tr style={{
      background: active ? "var(--accent-soft)" : "transparent",
      color: active ? "var(--accent)" : "var(--foreground)",
      fontWeight: active ? 600 : 400,
    }}>
      <td className="py-1 pr-3 text-xs">{objPos}</td>
      <td className="py-1 pr-3 text-xs">{imgPos}</td>
      <td className="py-1 pr-3 text-xs">{imgType}</td>
      <td className="py-1 text-xs">{size}</td>
    </tr>
  );
}

export default function OpticsPage() {
  const { t } = useLang();
  const [lensType, setLensType] = useState<LensType>("convex");
  const [preset, setPreset] = useState<Preset>("gt2f");

  const do_px = PRESET_DO[preset];
  const { rays, v, mag, img_x, img_tip_y } = buildRays(lensType, do_px);

  const obj_x = CX - do_px;
  const obj_ty = CY - OBJ_H;
  const F_near_x = CX - F_PX;
  const F_far_x = CX + F_PX;

  const imageReal = isFinite(v) && v > 0;
  const imgColor = imageReal ? "#22c55e" : "#a855f7";

  const do_cm = (do_px / F_PX * 20).toFixed(0);
  const v_cm = isFinite(v) ? (v / F_PX * 20).toFixed(1) : "∞";
  const magStr = isFinite(mag) ? mag.toFixed(2) : "—";

  const arrowTipDir = (tipY: number) => (tipY < CY ? 10 : -10);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>&rsaquo;</span>
        <span>{t("แสงและเลนส์", "Optics — lenses")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        {t("แสงและเลนส์", "Optics — lenses")}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        {t(
          "สำรวจการเกิดภาพของเลนส์นูนและเลนส์เว้า เมื่อวางวัตถุที่ตำแหน่งต่างๆ",
          "Explore image formation for convex and concave lenses at different object positions."
        )}
      </p>

      {/* Formula pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          <span className="text-[var(--foreground)]">1/f = 1/v − 1/u</span>
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          m = v/u
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          f = {lensType === "convex" ? "+20" : "−20"} cm
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-2">{t("ชนิดเลนส์", "Lens type")}</label>
          <div className="flex gap-2">
            {(["convex", "concave"] as LensType[]).map((lt) => (
              <button
                key={lt}
                onClick={() => setLensType(lt)}
                className="flex-1 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
                style={{
                  background: lensType === lt ? "var(--foreground)" : "transparent",
                  color: lensType === lt ? "var(--background)" : "var(--foreground)",
                  border: lensType === lt ? "none" : "1px solid var(--card-border)",
                }}
              >
                {lt === "convex" ? t("เลนส์นูน", "Convex") : t("เลนส์เว้า", "Concave")}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-xs text-[var(--muted)] mb-1">{t("ชนิด", "Type")}</div>
          <div className="text-base font-medium" style={{ color: "var(--foreground)" }}>
            {lensType === "convex"
              ? t("เลนส์นูน — รวมแสง (f > 0)", "Convex — converging (f > 0)")
              : t("เลนส์เว้า — กระจายแสง (f < 0)", "Concave — diverging (f < 0)")}
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">
            {lensType === "convex"
              ? t("สามารถเกิดทั้งภาพจริงและภาพเสมือน", "Can form real or virtual images")
              : t("เกิดเฉพาะภาพเสมือนหัวตั้งเสมอ", "Always forms virtual upright images")}
          </div>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="mb-4">
        <div className="text-xs text-[var(--muted)] mb-2">{t("ตำแหน่งวัตถุ", "Object position")}</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PRESET_LABELS_TH) as Preset[]).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
              style={{
                background: preset === p ? "var(--foreground)" : "transparent",
                color: preset === p ? "var(--background)" : "var(--muted)",
                border: preset === p ? "none" : "1px solid var(--card-border)",
              }}
            >
              {PRESET_LABELS_TH[p]}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Ray diagram */}
      <div
        className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* Principal axis */}
          <line x1={0} y1={CY} x2={W} y2={CY} stroke="var(--muted)" strokeWidth={1} opacity={0.35} />

          {/* 2F markers */}
          <circle cx={F_near_x - F_PX} cy={CY} r={3} fill="var(--muted)" opacity={0.5} />
          <text x={F_near_x - F_PX} y={CY + 16} textAnchor="middle" fontSize={10} fill="var(--muted)" opacity={0.7}>
            2F
          </text>
          <circle cx={F_far_x + F_PX} cy={CY} r={3} fill="var(--muted)" opacity={0.5} />
          <text x={F_far_x + F_PX} y={CY + 16} textAnchor="middle" fontSize={10} fill="var(--muted)" opacity={0.7}>
            2F′
          </text>

          {/* Focal point markers */}
          <circle cx={F_near_x} cy={CY} r={4} fill="#f59e0b" opacity={0.85} />
          <text x={F_near_x} y={CY + 16} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={700}>
            F
          </text>
          <circle cx={F_far_x} cy={CY} r={4} fill="#f59e0b" opacity={0.85} />
          <text x={F_far_x} y={CY + 16} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={700}>
            F′
          </text>

          {/* Lens body */}
          {lensType === "convex" ? (
            <g>
              <path
                d={`M ${CX} ${CY - LENS_HALF} Q ${CX + 30} ${CY} ${CX} ${CY + LENS_HALF} Q ${CX - 30} ${CY} ${CX} ${CY - LENS_HALF}`}
                fill="#3b82f6"
                fillOpacity={0.1}
                stroke="#3b82f6"
                strokeWidth={1.5}
              />
              {/* Outward arrows */}
              <polygon
                points={`${CX},${CY - LENS_HALF - 2} ${CX - 5},${CY - LENS_HALF + 10} ${CX + 5},${CY - LENS_HALF + 10}`}
                fill="#3b82f6"
              />
              <polygon
                points={`${CX},${CY + LENS_HALF + 2} ${CX - 5},${CY + LENS_HALF - 10} ${CX + 5},${CY + LENS_HALF - 10}`}
                fill="#3b82f6"
              />
            </g>
          ) : (
            <g>
              <path
                d={`M ${CX} ${CY - LENS_HALF} Q ${CX - 24} ${CY} ${CX} ${CY + LENS_HALF} Q ${CX + 24} ${CY} ${CX} ${CY - LENS_HALF}`}
                fill="#a855f7"
                fillOpacity={0.1}
                stroke="#a855f7"
                strokeWidth={1.5}
              />
              {/* Inward arrows */}
              <polygon
                points={`${CX},${CY - LENS_HALF + 12} ${CX - 5},${CY - LENS_HALF + 2} ${CX + 5},${CY - LENS_HALF + 2}`}
                fill="#a855f7"
              />
              <polygon
                points={`${CX},${CY + LENS_HALF - 12} ${CX - 5},${CY + LENS_HALF - 2} ${CX + 5},${CY + LENS_HALF - 2}`}
                fill="#a855f7"
              />
            </g>
          )}

          {/* Rays */}
          {rays.map((ray, i) => (
            <polyline
              key={i}
              points={ray.pts.map(([x, y]) => `${x},${y}`).join(" ")}
              stroke={ray.color}
              strokeWidth={ray.dashed ? 1.2 : 1.8}
              strokeDasharray={ray.dashed ? "5 3" : undefined}
              fill="none"
              opacity={ray.dashed ? 0.6 : 0.9}
            />
          ))}

          {/* Object arrow */}
          <line x1={obj_x} y1={CY} x2={obj_x} y2={obj_ty} stroke="#ef4444" strokeWidth={2.5} />
          <polygon
            points={`${obj_x},${obj_ty} ${obj_x - 5},${obj_ty + 10} ${obj_x + 5},${obj_ty + 10}`}
            fill="#ef4444"
          />
          <text x={obj_x} y={obj_ty - 8} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={600}>
            {t("วัตถุ", "Object")}
          </text>

          {/* Image arrow */}
          {img_x !== null && img_tip_y !== null && isFinite(v) && (
            <>
              <line
                x1={img_x} y1={CY} x2={img_x} y2={img_tip_y}
                stroke={imgColor}
                strokeWidth={2.5}
                strokeDasharray={imageReal ? undefined : "6 3"}
              />
              <polygon
                points={`${img_x},${img_tip_y} ${img_x - 5},${img_tip_y + arrowTipDir(img_tip_y)} ${img_x + 5},${img_tip_y + arrowTipDir(img_tip_y)}`}
                fill={imgColor}
              />
              <text
                x={img_x}
                y={img_tip_y - 10 * (img_tip_y < CY ? 1 : -1) - 4}
                textAnchor="middle"
                fontSize={11}
                fill={imgColor}
                fontWeight={600}
              >
                {t("ภาพ", "Image")}
              </text>
            </>
          )}

          {/* No image label */}
          {!isFinite(v) && (
            <text x={W - 12} y={CY - 14} textAnchor="end" fontSize={11} fill="var(--muted)">
              {t("ไม่เกิดภาพ (ขนานกัน)", "No image (parallel rays)")}
            </text>
          )}

          {/* Object-side label */}
          <text x={CX - 20} y={H - 8} textAnchor="end" fontSize={10} fill="var(--muted)" opacity={0.6}>
            {t("← ฝั่งวัตถุ", "← Object side")}
          </text>
          <text x={CX + 20} y={H - 8} textAnchor="start" fontSize={10} fill="var(--muted)" opacity={0.6}>
            {t("ฝั่งภาพ →", "Image side →")}
          </text>
        </svg>
      </div>

      {/* Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ระยะวัตถุ u", "Object dist. u")}</div>
          <div className="text-lg font-medium">{do_cm} cm</div>
          <div className="text-[10px] text-[var(--muted)]">= {(do_px / F_PX).toFixed(2)}f</div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ระยะภาพ v", "Image dist. v")}</div>
          <div className="text-lg font-medium">{v_cm} cm</div>
          <div className="text-[10px]" style={{ color: isFinite(v) ? (v > 0 ? "#22c55e" : "#a855f7") : "var(--muted)" }}>
            {isFinite(v) ? (v > 0 ? t("ภาพจริง", "Real image") : t("ภาพเสมือน", "Virtual image")) : "—"}
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("กำลังขยาย m", "Magnification m")}</div>
          <div className="text-lg font-medium">{magStr}</div>
          <div className="text-[10px] text-[var(--muted)]">
            {isFinite(mag)
              ? mag < 0
                ? t("หัวกลับ", "Inverted")
                : t("หัวตั้ง", "Upright")
              : "—"}
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ขนาดภาพ", "Image size")}</div>
          <div className="text-base font-medium">
            {isFinite(mag)
              ? Math.abs(mag) > 1.05
                ? t("ขยาย", "Magnified")
                : Math.abs(mag) < 0.95
                ? t("ย่อ", "Diminished")
                : t("เท่าเดิม", "Same size")
              : "—"}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-5">
        <div className="text-xs text-[var(--muted)] font-medium mb-3">
          {lensType === "convex"
            ? t("ตารางสรุป — เลนส์นูน", "Summary table — convex lens")
            : t("ตารางสรุป — เลนส์เว้า", "Summary table — concave lens")}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[var(--muted)]">
                <th className="text-left py-1 pr-3 text-xs font-medium">{t("ตำแหน่งวัตถุ", "Object pos.")}</th>
                <th className="text-left py-1 pr-3 text-xs font-medium">{t("ตำแหน่งภาพ", "Image pos.")}</th>
                <th className="text-left py-1 pr-3 text-xs font-medium">{t("ชนิดภาพ", "Image type")}</th>
                <th className="text-left py-1 text-xs font-medium">{t("ขนาด", "Size")}</th>
              </tr>
            </thead>
            <tbody>
              {lensType === "convex" ? (
                <>
                  <SummaryRow
                    active={preset === "gt2f"}
                    objPos="u > 2f"
                    imgPos="f < v < 2f"
                    imgType={t("จริง / หัวกลับ", "Real / inverted")}
                    size={t("ย่อ", "Diminished")}
                  />
                  <SummaryRow
                    active={preset === "at2f"}
                    objPos="u = 2f"
                    imgPos="v = 2f"
                    imgType={t("จริง / หัวกลับ", "Real / inverted")}
                    size={t("เท่าเดิม", "Same size")}
                  />
                  <SummaryRow
                    active={preset === "btf2f"}
                    objPos="f < u < 2f"
                    imgPos="v > 2f"
                    imgType={t("จริง / หัวกลับ", "Real / inverted")}
                    size={t("ขยาย", "Magnified")}
                  />
                  <SummaryRow
                    active={preset === "atf"}
                    objPos="u = f"
                    imgPos="∞"
                    imgType={t("ไม่เกิดภาพ", "No image")}
                    size="—"
                  />
                  <SummaryRow
                    active={preset === "ltf"}
                    objPos="u < f"
                    imgPos={t("ฝั่งวัตถุ", "Object side")}
                    imgType={t("เสมือน / หัวตั้ง", "Virtual / upright")}
                    size={t("ขยาย", "Magnified")}
                  />
                </>
              ) : (
                <>
                  <SummaryRow
                    active={preset === "gt2f"}
                    objPos="u > 2f"
                    imgPos={t("ฝั่งวัตถุ", "Object side")}
                    imgType={t("เสมือน / หัวตั้ง", "Virtual / upright")}
                    size={t("ย่อมาก", "More diminished")}
                  />
                  <SummaryRow
                    active={preset === "at2f"}
                    objPos="u = 2f"
                    imgPos={t("ฝั่งวัตถุ", "Object side")}
                    imgType={t("เสมือน / หัวตั้ง", "Virtual / upright")}
                    size={t("ย่อ", "Diminished")}
                  />
                  <SummaryRow
                    active={preset === "btf2f"}
                    objPos="f < u < 2f"
                    imgPos={t("ฝั่งวัตถุ", "Object side")}
                    imgType={t("เสมือน / หัวตั้ง", "Virtual / upright")}
                    size={t("ย่อ", "Diminished")}
                  />
                  <SummaryRow
                    active={preset === "atf"}
                    objPos="u = f"
                    imgPos={t("ฝั่งวัตถุ", "Object side")}
                    imgType={t("เสมือน / หัวตั้ง", "Virtual / upright")}
                    size={t("ย่อ", "Diminished")}
                  />
                  <SummaryRow
                    active={preset === "ltf"}
                    objPos="u < f"
                    imgPos={t("ฝั่งวัตถุ", "Object side")}
                    imgType={t("เสมือน / หัวตั้ง", "Virtual / upright")}
                    size={t("ย่อน้อยลง", "Less diminished")}
                  />
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-7 h-0.5 bg-[#ef4444]" />
          {t("รังสีที่ 1 (ขนานแกน)", "Ray 1 (parallel to axis)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-7 h-0.5 bg-[#3b82f6]" />
          {t("รังสีที่ 2 (ผ่านศูนย์กลาง)", "Ray 2 (through centre)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-7 h-0.5 bg-[#22c55e]" />
          {t("รังสีที่ 3 (ผ่านโฟกัส)", "Ray 3 (through focal pt.)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-7"
            style={{ height: 0, borderTop: "2px dashed var(--muted)" }}
          />
          {t("รังสีเสมือน (ต่อเส้นไปหลัง)", "Virtual ray (back-extension)")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#22c55e] opacity-70" />
          {t("ภาพจริง", "Real image")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#a855f7] opacity-70" />
          {t("ภาพเสมือน", "Virtual image")}
        </div>
      </div>
    </div>
  );
}
