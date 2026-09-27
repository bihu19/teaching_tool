"use client";

import { useState, type ReactNode } from "react";
import { useLang } from "@/components/LangContext";
import { PillButton, Readout, Slider, Small } from "../deck/ui";

const NA = 6.02e23;

/** Trim trailing zeros: 0.500 → 0.5 */
export const trim = (n: number, d = 3) => Number(n.toFixed(d)).toString();

/** Scientific notation with a superscript exponent. */
export function Sci({ n }: { n: number }) {
  if (!n) return <>0</>;
  const p = Math.floor(Math.log10(n));
  return (
    <>
      {trim(n / 10 ** p, 3)} × 10<sup>{p}</sup>
    </>
  );
}

/** Stacked fraction used in unit-cancellation chains. */
export function Fraction({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <span className="inline-flex flex-col text-center align-middle leading-relaxed">
      <span className="px-2" style={{ borderBottom: "1px solid currentColor" }}>
        {top}
      </span>
      <span className="px-2">{bottom}</span>
    </span>
  );
}

/** A unit struck through because it cancels. */
export function Cancel({ children }: { children: ReactNode }) {
  return (
    <span style={{ textDecoration: "line-through", textDecorationColor: "var(--accent)", textDecorationThickness: 2 }}>
      {children}
    </span>
  );
}

const SUBSTANCES = [
  { key: "O₂", mm: 32, color: "#ef4444" },
  { key: "H₂O", mm: 18, color: "#3b82f6" },
  { key: "CO₂", mm: 44, color: "#a855f7" },
];

/* ── Lab 1: mass → moles → molecules ── */
export function MassLab() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const [mass, setMass] = useState(64);
  const s = SUBSTANCES[idx];
  const n = mass / s.mm;
  // Bars compare the three substances at the same mass; scale fixed to the max possible (128 g H₂O).
  const maxN = 128 / 18;

  return (
    <div>
      <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
        {t("สาร", "Substance")}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {SUBSTANCES.map((sub, i) => (
          <PillButton key={sub.key} onClick={() => setIdx(i)} pressed={i === idx}>
            {sub.key} · {sub.mm} g/mol
          </PillButton>
        ))}
      </div>
      <Slider label={t("มวล (g)", "Mass (g)")} value={mass} min={0} max={128} onChange={setMass} />
      <Readout>
        {mass} g ÷ {s.mm} g/mol = {trim(n)} mol
        <br />→ <Sci n={n * NA} /> {t("โมเลกุล", "molecules")}
      </Readout>

      <svg viewBox="0 0 400 130" className="w-full h-auto mt-2" role="img" aria-label={t("จำนวนโมลของแต่ละสารที่มวลเท่ากัน", "Moles of each substance at the same mass")}>
        {SUBSTANCES.map((sub, i) => {
          const ni = mass / sub.mm;
          const y = 12 + i * 38;
          const w = (ni / maxN) * 250;
          const active = i === idx;
          return (
            <g key={sub.key} opacity={active ? 1 : 0.45}>
              <text x={0} y={y + 16} fontSize="12" fill="var(--foreground)" fontWeight={active ? 600 : 400}>
                {sub.key}
              </text>
              <rect x={44} y={y} width={250} height={22} rx={11} fill="var(--card-border-strong)" />
              {w > 0 && <rect x={44} y={y} width={Math.max(w, 22)} height={22} rx={11} fill={sub.color} />}
              <text x={302} y={y + 16} fontSize="12" fill="var(--foreground)">
                {trim(ni, 2)} mol
              </text>
            </g>
          );
        })}
      </svg>
      <Small>
        {t(
          "แถบแสดงจำนวนโมลของทั้งสามสารที่มวลเท่ากัน จำนวนโมเลกุลแปรผันตามจำนวนโมล",
          "Bars compare moles of all three substances at this same mass. Molecule count is proportional to moles."
        )}
      </Small>
      <div className="mt-3">
        <PillButton onClick={() => { setIdx(0); setMass(64); }}>{t("รีเซ็ต", "Reset")}</PillButton>
      </div>
    </div>
  );
}

/* ── Lab 2: molarity in a beaker ── */
export function ConcentrationLab() {
  const { t } = useLang();
  const [n, setN] = useState(0.2);
  const [vol, setVol] = useState(500);
  const litres = vol / 1000;
  const c = n / litres;

  // Beaker: 1000 mL fills the full inner height.
  const bx = 120;
  const by = 20;
  const bw = 160;
  const bh = 180;
  const liquidH = (vol / 1000) * bh;
  const top = by + bh - liquidH;
  const dots = Math.round(n * 40);
  // Deterministic scatter so dots don't jump on every render.
  const pts = Array.from({ length: dots }, (_, i) => {
    const fx = ((i * 0.6180339887) % 1 + 1) % 1;
    const fy = ((i * 0.7548776662 + 0.3) % 1 + 1) % 1;
    return [bx + 10 + fx * (bw - 20), top + 8 + fy * Math.max(liquidH - 16, 1)];
  });
  const shade = Math.min(0.15 + c * 0.25, 0.75);

  return (
    <div>
      <svg viewBox="0 0 400 225" className="w-full h-auto" role="img" aria-label={t("บีกเกอร์สารละลาย", "Beaker of solution")}>
        <rect x={bx} y={top} width={bw} height={liquidH} fill="#a855f7" opacity={shade} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.2} fill="#a855f7" />
        ))}
        <path
          d={`M${bx},${by - 6} L${bx},${by + bh} L${bx + bw},${by + bh} L${bx + bw},${by - 6}`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={2}
        />
        {[250, 500, 750, 1000].map((m) => {
          const y = by + bh - (m / 1000) * bh;
          return (
            <g key={m}>
              <line x1={bx + bw - 14} y1={y} x2={bx + bw} y2={y} stroke="var(--muted)" />
              <text x={bx + bw + 6} y={y + 4} fontSize="10" fill="var(--muted)">
                {m} mL
              </text>
            </g>
          );
        })}
        <text x={bx - 8} y={by + bh - liquidH / 2 + 4} fontSize="12" textAnchor="end" fill="var(--foreground)">
          {trim(c, 2)} M
        </text>
      </svg>
      <Slider label={t("ปริมาณตัวละลาย (mol)", "Amount of solute (mol)")} value={n} min={0} max={1} step={0.05} onChange={setN} display={trim(n)} />
      <Slider label={t("ปริมาตรสารละลายสุดท้าย (mL)", "Final solution volume (mL)")} value={vol} min={100} max={1000} step={50} onChange={setVol} />
      <Readout>
        {vol} mL = {trim(litres)} L
        <br />
        {trim(n)} mol ÷ {trim(litres)} L = {trim(c)} mol/L
      </Readout>
      <Small>{t("1 จุด ≈ 0.025 mol • ความเข้มของสีแสดงความเข้มข้น", "1 dot ≈ 0.025 mol • colour depth shows concentration")}</Small>
      <div className="mt-3">
        <PillButton onClick={() => { setN(0.2); setVol(500); }}>{t("รีเซ็ต", "Reset")}</PillButton>
      </div>
    </div>
  );
}

/* ── Lab 3: limiting reactant for 2 H₂ + O₂ → 2 H₂O ── */
export function LimitingLab() {
  const { t } = useLang();
  const [h, setH] = useState(3);
  const [o, setO] = useState(2);
  const x = Math.min(h / 2, o);
  const water = 2 * x;
  const hLeft = h - 2 * x;
  const oLeft = o - x;

  const status =
    h === 0 && o === 0
      ? t("ไม่มีสารตั้งต้น จึงไม่เกิดปฏิกิริยา", "No reactants: no reaction.")
      : h / 2 === o
        ? t("สัดส่วนพอดี ไม่มีสารเหลือ", "Stoichiometric amounts: neither reactant is in excess.")
        : h / 2 < o
          ? t("H₂ เป็นสารกำหนดปริมาณ", "H₂ is limiting.")
          : t("O₂ เป็นสารกำหนดปริมาณ", "O₂ is limiting.");

  const rows = [
    { label: t("H₂ เหลือ", "H₂ left"), v: hLeft, color: "#3b82f6" },
    { label: t("O₂ เหลือ", "O₂ left"), v: oLeft, color: "#ef4444" },
    { label: t("H₂O ที่เกิด", "H₂O formed"), v: water, color: "#22c55e" },
  ];

  return (
    <div>
      <Slider label={t("H₂ เริ่มต้น (mol)", "Initial H₂ (mol)")} value={h} min={0} max={8} step={0.5} onChange={setH} />
      <Slider label={t("O₂ เริ่มต้น (mol)", "Initial O₂ (mol)")} value={o} min={0} max={4} step={0.5} onChange={setO} />
      <svg viewBox="0 0 400 140" className="w-full h-auto mt-1" role="img" aria-label={t("ปริมาณหลังปฏิกิริยา", "Amounts after reaction")}>
        {rows.map((r, i) => {
          const y = 8 + i * 40;
          const w = (r.v / 8) * 240;
          return (
            <g key={i}>
              <text x={0} y={y + 16} fontSize="12" fill="var(--foreground)">
                {r.label}
              </text>
              <rect x={90} y={y} width={240} height={22} rx={11} fill="var(--card-border-strong)" />
              {w > 0 && <rect x={90} y={y} width={Math.max(w, 22)} height={22} rx={11} fill={r.color} />}
              <text x={338} y={y + 16} fontSize="12" fill="var(--foreground)">
                {trim(r.v)} mol
              </text>
            </g>
          );
        })}
      </svg>
      <Readout>
        <span className="font-sans font-medium">{status}</span>
        <br />ξ = min({trim(h)}/2, {trim(o)}) = {trim(x)} mol
      </Readout>
      <Small>
        {t(
          "สเกล 0–8 mol • ปฏิกิริยาสมบูรณ์ในอุดมคติ แถบแสดงปริมาณ ไม่ได้แสดงการเคลื่อนที่ของโมเลกุล",
          "Scale 0–8 mol • ideal complete reaction; bars show amounts, not molecular motion."
        )}
      </Small>
      <div className="mt-3">
        <PillButton onClick={() => { setH(3); setO(2); }}>{t("รีเซ็ต", "Reset")}</PillButton>
      </div>
    </div>
  );
}
