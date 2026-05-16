"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

const W = 720, H = 400;
const CX = 360, CY = 200;
const F_PX = 100;
const OBJ_H = 60;
const AP = 110; // aperture half-height
const RE = W - 8, LE = 8; // right/left edges

type OpticType = "convex-lens" | "concave-lens" | "concave-mirror" | "convex-mirror";
type Preset = "gt2f" | "at2f" | "btf2f" | "atf" | "ltf";

const PRESET_DO: Record<Preset, number> = {
  gt2f: 280, at2f: 200, btf2f: 150, atf: 100, ltf: 60,
};

type Seg = { pts: [number, number][]; color: string; dashed?: boolean };

function ext(px: number, py: number, dx: number, dy: number, side: "r" | "l"): [number, number] {
  if (Math.abs(dx) < 0.001) return [px, py];
  const edge = side === "r" ? RE : LE;
  const t = (edge - px) / dx;
  return [edge, py + t * dy];
}

// ── optics formula ──────────────────────────────────────────────────────────
function computeOptics(type: OpticType, do_px: number): { v: number; mag: number } {
  const isConvex = type.startsWith("convex");
  const isMirror = type.endsWith("mirror");
  const f = isConvex ? F_PX : -F_PX;

  // lens: 1/v = 1/f - 1/do   |   mirror: 1/v = 1/f + 1/do  (u = -do)
  const denom = isMirror ? 1 / f + 1 / do_px : 1 / f - 1 / do_px;
  const v = Math.abs(denom) < 0.0001 ? Infinity : 1 / denom;

  // lens m = v/u = -v/do  |  mirror m = -v/u = v/do
  const mag = isFinite(v) ? (isMirror ? v / do_px : -v / do_px) : Infinity;
  return { v, mag };
}

// ── lens rays ───────────────────────────────────────────────────────────────
function buildLensRays(
  isConvex: boolean, do_px: number, v: number, mag: number
): Seg[] {
  const obj_x = CX - do_px, obj_ty = CY - OBJ_H;
  const Fn = CX - F_PX, Ff = CX + F_PX; // near / far focal pts
  const img_x = isFinite(v) ? CX + v : null;
  const img_ty = isFinite(v) && isFinite(mag) ? CY - mag * OBJ_H : null;
  const R = "#ef4444", B = "#3b82f6", G = "#22c55e";
  const segs: Seg[] = [];
  const realImg = img_x !== null && img_ty !== null && v > 0;

  if (isConvex) {
    // Ray 1 – parallel → F_far
    const e1: [number, number] = realImg ? [img_x!, img_ty!] : ext(CX, obj_ty, Ff - CX, CY - obj_ty, "r");
    segs.push({ pts: [[obj_x, obj_ty], [CX, obj_ty], e1], color: R });

    // Ray 2 – centre
    const e2: [number, number] = realImg ? [img_x!, img_ty!] : ext(CX, CY, do_px, OBJ_H, "r");
    segs.push({ pts: [[obj_x, obj_ty], [CX, CY], e2], color: B });

    // Ray 3 – through F_near → parallel
    if (do_px !== F_PX) {
      const t3 = do_px / (do_px - F_PX);
      const hy3 = obj_ty + t3 * OBJ_H;
      if (do_px > F_PX) {
        const ex3: [number, number] = realImg ? [img_x!, img_ty!] : [RE, hy3];
        segs.push({ pts: [[obj_x, obj_ty], [Fn, CY], [CX, hy3], ex3], color: G });
      } else {
        segs.push({ pts: [[obj_x, obj_ty], [CX, hy3], [RE, hy3]], color: G });
        segs.push({ pts: [[CX, hy3], [Fn, CY]], color: G, dashed: true });
      }
    }

    // virtual image back-extensions
    if (img_x !== null && img_ty !== null && v < 0) {
      segs.push({ pts: [[CX, obj_ty], [img_x, img_ty]], color: R, dashed: true });
      segs.push({ pts: [[CX, CY], [img_x, img_ty]], color: B, dashed: true });
    }
  } else {
    // CONCAVE LENS
    // Ray 1 – parallel → diverges from F_near
    const e1 = ext(CX, obj_ty, F_PX, obj_ty - CY, "r");
    segs.push({ pts: [[obj_x, obj_ty], [CX, obj_ty], e1], color: R });
    if (img_x !== null && img_ty !== null)
      segs.push({ pts: [[CX, obj_ty], [img_x, img_ty]], color: R, dashed: true });

    // Ray 2 – centre
    segs.push({ pts: [[obj_x, obj_ty], [CX, CY], ext(CX, CY, do_px, OBJ_H, "r")], color: B });
    if (img_x !== null && img_ty !== null)
      segs.push({ pts: [[CX, CY], [img_x, img_ty]], color: B, dashed: true });

    // Ray 3 – aimed at F_far → parallel
    const t3c = do_px / (F_PX + do_px);
    const hy3c = obj_ty + t3c * OBJ_H;
    segs.push({ pts: [[obj_x, obj_ty], [CX, hy3c], ext(CX, hy3c, 1, 0, "r")], color: G });
    if (img_x !== null && img_ty !== null)
      segs.push({ pts: [[CX, hy3c], [img_x, img_ty]], color: G, dashed: true });
  }
  return segs;
}

// ── mirror rays ─────────────────────────────────────────────────────────────
function buildMirrorRays(
  isConcave: boolean, do_px: number, v: number, mag: number
): Seg[] {
  const obj_x = CX - do_px, obj_ty = CY - OBJ_H;
  const Ff = CX - F_PX;  // front focal pt (same side as object)
  const Fb = CX + F_PX;  // behind focal pt
  const img_x = isFinite(v) ? CX + v : null;
  const img_ty = isFinite(v) && isFinite(mag) ? CY - mag * OBJ_H : null;
  const R = "#ef4444", B = "#3b82f6", G = "#22c55e";
  const segs: Seg[] = [];
  const realImg = img_x !== null && img_ty !== null && v < 0;
  const imgPt: [number, number] | null = (img_x !== null && img_ty !== null) ? [img_x, img_ty] : null;

  // helper: extend reflected ray leftward, stopping at real image or left edge
  const endReal = (x0: number, y0: number, dx: number, dy: number): [number, number] =>
    realImg && imgPt ? imgPt : ext(x0, y0, dx, dy, "l");

  if (isConcave) {
    // Ray 1 – parallel → reflects through Ff
    const r1end = endReal(CX, obj_ty, Ff - CX, CY - obj_ty);
    segs.push({ pts: [[obj_x, obj_ty], [CX, obj_ty], r1end], color: R });
    if (!realImg && imgPt)
      segs.push({ pts: [[CX, obj_ty], imgPt], color: R, dashed: true });

    // Ray 2 – through pole → reflects symmetrically (normal = horizontal axis)
    const r2end = endReal(CX, CY, -do_px, OBJ_H);
    segs.push({ pts: [[obj_x, obj_ty], [CX, CY], r2end], color: B });
    if (!realImg && imgPt)
      segs.push({ pts: [[CX, CY], imgPt], color: B, dashed: true });

    // Ray 3 – through/from Ff → reflects parallel
    if (do_px !== F_PX) {
      if (do_px > F_PX) {
        // incident passes through Ff before mirror
        const dx3 = do_px - F_PX, hy3 = obj_ty + do_px / dx3 * OBJ_H;
        if (hy3 >= CY - AP && hy3 <= CY + AP) {
          const r3end = endReal(CX, hy3, -1, 0);
          segs.push({ pts: [[obj_x, obj_ty], [Ff, CY], [CX, hy3], r3end], color: G });
          if (!realImg && imgPt) segs.push({ pts: [[CX, hy3], imgPt], color: G, dashed: true });
        }
      } else {
        // object inside F: ray aimed away from Ff, extension passes through Ff
        const dx3 = F_PX - do_px;
        const hy3 = CY - OBJ_H * F_PX / dx3;
        if (hy3 >= CY - AP && hy3 <= CY + AP) {
          const r3end = endReal(CX, hy3, -1, 0);
          segs.push({ pts: [[obj_x, obj_ty], [CX, hy3], r3end], color: G });
          segs.push({ pts: [[obj_x, obj_ty], [Ff, CY]], color: G, dashed: true });
          if (!realImg && imgPt) segs.push({ pts: [[CX, hy3], imgPt], color: G, dashed: true });
        }
      }
    }
  } else {
    // CONVEX MIRROR – F is behind (Fb)
    // Ray 1 – parallel → diverges as if from Fb
    const r1end = ext(CX, obj_ty, CX - Fb, obj_ty - CY, "l");
    segs.push({ pts: [[obj_x, obj_ty], [CX, obj_ty], r1end], color: R });
    if (imgPt) segs.push({ pts: [[CX, obj_ty], imgPt], color: R, dashed: true });

    // Ray 2 – through pole
    const r2end = ext(CX, CY, -do_px, OBJ_H, "l");
    segs.push({ pts: [[obj_x, obj_ty], [CX, CY], r2end], color: B });
    if (imgPt) segs.push({ pts: [[CX, CY], imgPt], color: B, dashed: true });

    // Ray 3 – aimed at Fb → reflects parallel
    const dx3 = F_PX + do_px;
    const hy3 = obj_ty + do_px / dx3 * OBJ_H;
    if (hy3 >= CY - AP && hy3 <= CY + AP) {
      const r3end = ext(CX, hy3, -1, 0, "l");
      segs.push({ pts: [[obj_x, obj_ty], [CX, hy3], r3end], color: G });
      if (imgPt) segs.push({ pts: [[CX, hy3], imgPt], color: G, dashed: true });
    }
  }
  return segs;
}

// ── table row ────────────────────────────────────────────────────────────────
function Row({ active, c1, c2, c3, c4 }: {
  active: boolean; c1: string; c2: string; c3: string; c4: string;
}) {
  return (
    <tr style={{
      background: active ? "var(--accent-soft)" : "transparent",
      color: active ? "var(--accent)" : "var(--foreground)",
      fontWeight: active ? 600 : 400,
    }}>
      {[c1, c2, c3, c4].map((c, i) => (
        <td key={i} className="py-1 pr-3 text-xs">{c}</td>
      ))}
    </tr>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function OpticsPage() {
  const { t } = useLang();
  const [type, setType] = useState<OpticType>("convex-lens");
  const [preset, setPreset] = useState<Preset>("gt2f");

  const do_px = PRESET_DO[preset];
  const { v, mag } = computeOptics(type, do_px);
  const isMirror = type.endsWith("mirror");
  const isConvex = type.startsWith("convex");
  const isConcave = !isConvex;
  const segs = isMirror
    ? buildMirrorRays(isConcave, do_px, v, mag)
    : buildLensRays(isConvex, do_px, v, mag);

  const obj_x = CX - do_px, obj_ty = CY - OBJ_H;
  const img_x = isFinite(v) ? CX + v : null;
  const img_ty = isFinite(v) && isFinite(mag) ? CY - mag * OBJ_H : null;
  const realImg = isFinite(v) && (isMirror ? v < 0 : v > 0);
  const imgColor = realImg ? "#22c55e" : "#a855f7";
  const Ff = CX - F_PX, Fb = CX + F_PX;

  const do_cm = (do_px / F_PX * 20).toFixed(0);
  const v_cm = isFinite(v) ? (v / F_PX * 20).toFixed(1) : "∞";
  const magStr = isFinite(mag) ? mag.toFixed(2) : "—";
  const arrowDelta = (ty: number) => ty < CY ? 10 : -10;

  const MIRROR_D = 38; // mirror surface depth

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>&rsaquo;</span>
        <span>{t("แสงและทัศนอุปกรณ์", "Optics")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        {t("แสงและทัศนอุปกรณ์", "Optics — lenses & mirrors")}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-5">
        {t("สำรวจการเกิดภาพของเลนส์และกระจก พร้อมรังสีทั้งสามเส้น",
          "Explore image formation for lenses and mirrors with all three principal rays.")}
      </p>

      {/* formula pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono" style={{ color: "var(--foreground)" }}>
          {isMirror ? "1/f = 1/v + 1/u" : "1/f = 1/v − 1/u"}
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          m = {isMirror ? "−v/u" : "v/u"}
        </span>
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          f = {isConvex ? "+20" : "−20"} cm
        </span>
      </div>

      {/* type selector */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3 mb-3">
        <div className="text-xs text-[var(--muted)] mb-2">{t("ชนิดทัศนอุปกรณ์", "Optic type")}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["convex-lens", "concave-lens", "concave-mirror", "convex-mirror"] as OpticType[]).map((ot) => {
            const labels: Record<OpticType, [string, string]> = {
              "convex-lens":    ["เลนส์นูน", "Convex lens"],
              "concave-lens":   ["เลนส์เว้า", "Concave lens"],
              "concave-mirror": ["กระจกเว้า", "Concave mirror"],
              "convex-mirror":  ["กระจกนูน", "Convex mirror"],
            };
            const active = type === ot;
            return (
              <button key={ot} onClick={() => setType(ot)}
                className="py-2 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
                style={{
                  background: active ? "var(--foreground)" : "transparent",
                  color: active ? "var(--background)" : "var(--muted)",
                  border: active ? "none" : "1px solid var(--card-border)",
                }}>
                {t(labels[ot][0], labels[ot][1])}
              </button>
            );
          })}
        </div>
      </div>

      {/* preset buttons */}
      <div className="mb-4">
        <div className="text-xs text-[var(--muted)] mb-2">{t("ตำแหน่งวัตถุ", "Object position")}</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PRESET_DO) as Preset[]).map((p) => (
            <button key={p} onClick={() => setPreset(p)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
              style={{
                background: preset === p ? "var(--foreground)" : "transparent",
                color: preset === p ? "var(--background)" : "var(--muted)",
                border: preset === p ? "none" : "1px solid var(--card-border)",
              }}>
              {p === "gt2f" ? "u > 2f" : p === "at2f" ? "u = 2f"
                : p === "btf2f" ? "f < u < 2f" : p === "atf" ? "u = f" : "u < f"}
            </button>
          ))}
        </div>
      </div>

      {/* SVG diagram */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4"
        style={{ boxShadow: "var(--shadow-sm)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* axis */}
          <line x1={0} y1={CY} x2={W} y2={CY} stroke="var(--muted)" strokeWidth={1} opacity={0.3} />

          {/* focal markers */}
          {isMirror ? (
            <>
              {isConcave ? (
                /* concave mirror: F and 2F in front (left) */
                <>
                  <circle cx={Ff - F_PX} cy={CY} r={3} fill="var(--muted)" opacity={0.5} />
                  <text x={Ff - F_PX} y={CY + 16} textAnchor="middle" fontSize={10} fill="var(--muted)" opacity={0.7}>C</text>
                  <circle cx={Ff} cy={CY} r={4} fill="#f59e0b" />
                  <text x={Ff} y={CY + 16} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={700}>F</text>
                </>
              ) : (
                /* convex mirror: F and C behind (right), virtual */
                <>
                  <circle cx={Fb} cy={CY} r={4} fill="#f59e0b" opacity={0.5} />
                  <text x={Fb} y={CY + 16} textAnchor="middle" fontSize={11} fill="#f59e0b" opacity={0.7} fontWeight={700}>F</text>
                  <circle cx={Fb + F_PX} cy={CY} r={3} fill="var(--muted)" opacity={0.5} />
                  <text x={Fb + F_PX} y={CY + 16} textAnchor="middle" fontSize={10} fill="var(--muted)" opacity={0.7}>C</text>
                </>
              )}
            </>
          ) : (
            /* lens: F near and far, 2F both sides */
            <>
              <circle cx={Ff - F_PX} cy={CY} r={3} fill="var(--muted)" opacity={0.5} />
              <text x={Ff - F_PX} y={CY + 16} textAnchor="middle" fontSize={10} fill="var(--muted)" opacity={0.6}>2F</text>
              <circle cx={Ff} cy={CY} r={4} fill="#f59e0b" />
              <text x={Ff} y={CY + 16} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={700}>F</text>
              <circle cx={Fb} cy={CY} r={4} fill="#f59e0b" />
              <text x={Fb} y={CY + 16} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight={700}>F′</text>
              <circle cx={Fb + F_PX} cy={CY} r={3} fill="var(--muted)" opacity={0.5} />
              <text x={Fb + F_PX} y={CY + 16} textAnchor="middle" fontSize={10} fill="var(--muted)" opacity={0.6}>2F′</text>
            </>
          )}

          {/* optic body */}
          {!isMirror ? (
            isConvex ? (
              /* biconvex lens */
              <g>
                <path
                  d={`M ${CX} ${CY - AP} Q ${CX + 30} ${CY} ${CX} ${CY + AP} Q ${CX - 30} ${CY} ${CX} ${CY - AP}`}
                  fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1.5}
                />
                <polygon points={`${CX},${CY - AP - 2} ${CX - 5},${CY - AP + 10} ${CX + 5},${CY - AP + 10}`} fill="#3b82f6" />
                <polygon points={`${CX},${CY + AP + 2} ${CX - 5},${CY + AP - 10} ${CX + 5},${CY + AP - 10}`} fill="#3b82f6" />
              </g>
            ) : (
              /* biconcave lens – hourglass shape */
              <g>
                <path
                  d={`M ${CX - 20} ${CY - AP}
                      L ${CX + 20} ${CY - AP}
                      Q ${CX} ${CY} ${CX + 20} ${CY + AP}
                      L ${CX - 20} ${CY + AP}
                      Q ${CX} ${CY} ${CX - 20} ${CY - AP}
                      Z`}
                  fill="#a855f7" fillOpacity={0.15} stroke="#a855f7" strokeWidth={1.5}
                />
                <polygon points={`${CX},${CY - AP + 12} ${CX - 5},${CY - AP + 2} ${CX + 5},${CY - AP + 2}`} fill="#a855f7" />
                <polygon points={`${CX},${CY + AP - 12} ${CX - 5},${CY + AP - 2} ${CX + 5},${CY + AP - 2}`} fill="#a855f7" />
              </g>
            )
          ) : isConcave ? (
            /* concave mirror – bowl opening to left */
            <g>
              {/* hatched backing */}
              <path
                d={`M ${CX} ${CY - AP}
                    Q ${CX + MIRROR_D} ${CY} ${CX} ${CY + AP}
                    L ${CX + 14} ${CY + AP}
                    Q ${CX + MIRROR_D + 14} ${CY} ${CX + 14} ${CY - AP} Z`}
                fill="var(--muted)" fillOpacity={0.18}
              />
              {/* reflecting surface */}
              <path d={`M ${CX} ${CY - AP} Q ${CX + MIRROR_D} ${CY} ${CX} ${CY + AP}`}
                fill="none" stroke="var(--foreground)" strokeWidth={2.5} />
            </g>
          ) : (
            /* convex mirror – dome facing left */
            <g>
              <path
                d={`M ${CX} ${CY - AP}
                    Q ${CX - MIRROR_D} ${CY} ${CX} ${CY + AP}
                    L ${CX + 14} ${CY + AP}
                    Q ${CX - MIRROR_D + 14} ${CY} ${CX + 14} ${CY - AP} Z`}
                fill="var(--muted)" fillOpacity={0.18}
              />
              <path d={`M ${CX} ${CY - AP} Q ${CX - MIRROR_D} ${CY} ${CX} ${CY + AP}`}
                fill="none" stroke="var(--foreground)" strokeWidth={2.5} />
            </g>
          )}

          {/* rays */}
          {segs.map((s, i) => (
            <polyline key={i}
              points={s.pts.map(([x, y]) => `${x},${y}`).join(" ")}
              stroke={s.color} fill="none"
              strokeWidth={s.dashed ? 1.2 : 1.8}
              strokeDasharray={s.dashed ? "5 3" : undefined}
              opacity={s.dashed ? 0.6 : 0.9}
            />
          ))}

          {/* object arrow */}
          <line x1={obj_x} y1={CY} x2={obj_x} y2={obj_ty} stroke="#ef4444" strokeWidth={2.5} />
          <polygon points={`${obj_x},${obj_ty} ${obj_x - 5},${obj_ty + 10} ${obj_x + 5},${obj_ty + 10}`} fill="#ef4444" />
          <text x={obj_x} y={obj_ty - 8} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={600}>
            {t("วัตถุ", "Object")}
          </text>

          {/* image arrow */}
          {img_x !== null && img_ty !== null && isFinite(v) && (
            <>
              <line x1={img_x} y1={CY} x2={img_x} y2={img_ty}
                stroke={imgColor} strokeWidth={2.5}
                strokeDasharray={realImg ? undefined : "6 3"} />
              <polygon
                points={`${img_x},${img_ty} ${img_x - 5},${img_ty + arrowDelta(img_ty)} ${img_x + 5},${img_ty + arrowDelta(img_ty)}`}
                fill={imgColor} />
              <text x={img_x} y={img_ty - 10 * (img_ty < CY ? 1 : -1) - 4}
                textAnchor="middle" fontSize={11} fill={imgColor} fontWeight={600}>
                {t("ภาพ", "Image")}
              </text>
            </>
          )}
          {!isFinite(v) && (
            <text x={RE - 4} y={CY - 14} textAnchor="end" fontSize={11} fill="var(--muted)">
              {t("ไม่เกิดภาพ", "No image")}
            </text>
          )}

          {/* side labels */}
          {isMirror && (
            <text x={CX - 20} y={H - 6} textAnchor="end" fontSize={10} fill="var(--muted)" opacity={0.5}>
              {t("← หน้ากระจก", "← Front")}
            </text>
          )}
          {!isMirror && (
            <>
              <text x={CX - 20} y={H - 6} textAnchor="end" fontSize={10} fill="var(--muted)" opacity={0.5}>
                {t("← ฝั่งวัตถุ", "← Object side")}
              </text>
              <text x={CX + 20} y={H - 6} textAnchor="start" fontSize={10} fill="var(--muted)" opacity={0.5}>
                {t("ฝั่งภาพ →", "Image side →")}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {[
          {
            label: t("ระยะวัตถุ u", "Object dist. u"),
            val: `${do_cm} cm`,
            sub: `= ${(do_px / F_PX).toFixed(2)}f`,
            subColor: "var(--muted)",
          },
          {
            label: t("ระยะภาพ v", "Image dist. v"),
            val: `${v_cm} cm`,
            sub: isFinite(v)
              ? (realImg ? t("ภาพจริง", "Real") : t("ภาพเสมือน", "Virtual"))
              : "—",
            subColor: isFinite(v) ? (realImg ? "#22c55e" : "#a855f7") : "var(--muted)",
          },
          {
            label: t("กำลังขยาย m", "Magnification m"),
            val: magStr,
            sub: isFinite(mag)
              ? (mag < 0 ? t("หัวกลับ", "Inverted") : t("หัวตั้ง", "Upright"))
              : "—",
            subColor: "var(--muted)",
          },
          {
            label: t("ขนาดภาพ", "Image size"),
            val: isFinite(mag)
              ? (Math.abs(mag) > 1.05 ? t("ขยาย", "Magnified")
                : Math.abs(mag) < 0.95 ? t("ย่อ", "Diminished")
                : t("เท่าเดิม", "Same size"))
              : "—",
            sub: "",
            subColor: "var(--muted)",
          },
        ].map((c, i) => (
          <div key={i} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
            <div className="text-[10px] text-[var(--muted)] mb-0.5">{c.label}</div>
            <div className="text-lg font-medium">{c.val}</div>
            <div className="text-[10px]" style={{ color: c.subColor }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* summary table */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-5">
        <div className="text-xs text-[var(--muted)] font-medium mb-3">
          {t(`ตารางสรุป — ${type === "convex-lens" ? "เลนส์นูน" : type === "concave-lens" ? "เลนส์เว้า" : type === "concave-mirror" ? "กระจกเว้า" : "กระจกนูน"}`,
            `Summary — ${type === "convex-lens" ? "convex lens" : type === "concave-lens" ? "concave lens" : type === "concave-mirror" ? "concave mirror" : "convex mirror"}`)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[var(--muted)]">
                {[t("ตำแหน่งวัตถุ", "Object"), t("ตำแหน่งภาพ", "Image pos."),
                  t("ชนิดภาพ", "Type"), t("ขนาด", "Size")].map((h, i) => (
                  <th key={i} className="text-left py-1 pr-3 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {type === "convex-lens" && <>
                <Row active={preset === "gt2f"} c1="u > 2f" c2="f < v < 2f" c3={t("จริง/หัวกลับ", "Real/inverted")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "at2f"} c1="u = 2f" c2="v = 2f" c3={t("จริง/หัวกลับ", "Real/inverted")} c4={t("เท่าเดิม", "Same size")} />
                <Row active={preset === "btf2f"} c1="f < u < 2f" c2="v > 2f" c3={t("จริง/หัวกลับ", "Real/inverted")} c4={t("ขยาย", "Magnified")} />
                <Row active={preset === "atf"} c1="u = f" c2="∞" c3={t("ไม่เกิดภาพ", "No image")} c4="—" />
                <Row active={preset === "ltf"} c1="u < f" c2={t("ฝั่งวัตถุ", "Object side")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ขยาย", "Magnified")} />
              </>}
              {type === "concave-lens" && <>
                <Row active={preset === "gt2f"} c1="u > 2f" c2={t("ฝั่งวัตถุ", "Obj. side")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "at2f"} c1="u = 2f" c2={t("ฝั่งวัตถุ", "Obj. side")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "btf2f"} c1="f < u < 2f" c2={t("ฝั่งวัตถุ", "Obj. side")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "atf"} c1="u = f" c2={t("ฝั่งวัตถุ", "Obj. side")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "ltf"} c1="u < f" c2={t("ฝั่งวัตถุ", "Obj. side")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อน้อยกว่า", "Less dim.")} />
              </>}
              {type === "concave-mirror" && <>
                <Row active={preset === "gt2f"} c1="u > 2f" c2="f < v < 2f" c3={t("จริง/หัวกลับ", "Real/inverted")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "at2f"} c1="u = 2f" c2="v = 2f" c3={t("จริง/หัวกลับ", "Real/inverted")} c4={t("เท่าเดิม", "Same size")} />
                <Row active={preset === "btf2f"} c1="f < u < 2f" c2="v > 2f" c3={t("จริง/หัวกลับ", "Real/inverted")} c4={t("ขยาย", "Magnified")} />
                <Row active={preset === "atf"} c1="u = f" c2="∞" c3={t("ไม่เกิดภาพ", "No image")} c4="—" />
                <Row active={preset === "ltf"} c1="u < f" c2={t("หลังกระจก", "Behind mirror")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ขยาย", "Magnified")} />
              </>}
              {type === "convex-mirror" && <>
                <Row active={preset === "gt2f"} c1="u > 2f" c2={t("หลังกระจก", "Behind mirror")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อมาก", "More dim.")} />
                <Row active={preset === "at2f"} c1="u = 2f" c2={t("หลังกระจก", "Behind mirror")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "btf2f"} c1="f < u < 2f" c2={t("หลังกระจก", "Behind mirror")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "atf"} c1="u = f" c2={t("หลังกระจก", "Behind mirror")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อ", "Diminished")} />
                <Row active={preset === "ltf"} c1="u < f" c2={t("หลังกระจก", "Behind mirror")} c3={t("เสมือน/หัวตั้ง", "Virtual/upright")} c4={t("ย่อน้อยกว่า", "Less dim.")} />
              </>}
            </tbody>
          </table>
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        {[
          { color: "#ef4444", label: t("รังสีที่ 1 (ขนานแกน)", "Ray 1 (parallel)") },
          { color: "#3b82f6", label: t("รังสีที่ 2 (ผ่านศูนย์กลาง)", "Ray 2 (centre)") },
          { color: "#22c55e", label: t("รังสีที่ 3 (ผ่านโฟกัส)", "Ray 3 (focal pt.)") },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="inline-block w-7 h-0.5" style={{ background: color }} />
            {label}
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-7" style={{ height: 0, borderTop: "2px dashed var(--muted)" }} />
          {t("รังสีเสมือน", "Virtual ray")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#22c55e", opacity: 0.7 }} />
          {t("ภาพจริง", "Real image")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: "#a855f7", opacity: 0.7 }} />
          {t("ภาพเสมือน", "Virtual image")}
        </div>
      </div>
    </div>
  );
}
