"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

/* ---------------------------------------------------------------------------
 * Geometry & physics data, ported verbatim from the reference implementation
 * (induction.html). Only electrons move; protons are fixed in a hexagon.
 * ------------------------------------------------------------------------- */

type Offset = [number, number];
type Pt = { x: number; y: number; op: number };

const C = { x: 430, y: 210 };
const add = (o: Offset) => ({ x: C.x + o[0], y: C.y + o[1] });

// proton offsets (hexagon, fixed)
const PO: Offset[] = [[0, -62], [54, -31], [54, 31], [0, 62], [-54, 31], [-54, -31]];
// electron neutral spots (near protons)
const NEU: Offset[] = [[18, -50], [72, -19], [72, 43], [18, 74], [-36, 43], [-36, -19]];
// right cluster (electrons repelled to far side, negative rod)
const RC: Offset[] = [[30, -58], [68, -30], [82, 4], [70, 40], [38, 64], [58, 16]];
// left cluster (electrons attracted, positive rod) + 2 extra slots for grounded electrons
const LC: Offset[] = [
  [-30, -58], [-68, -30], [-82, 4], [-70, 40], [-38, 64], [-58, 16], [-44, -4], [-20, -40],
];
// even spread, 4 electrons (negative result)
const SP4: Offset[] = [[0, -56], [52, 22], [-52, 22], [0, 58]];
// even spread, 8 electrons (positive result)
const SP8: Offset[] = [
  [0, -58], [52, -28], [60, 18], [30, 56], [-30, 56], [-60, 18], [-52, -28], [0, 8],
];
// absolute helper spots
const GEXIT: Pt[] = [{ x: 420, y: 442, op: 0 }, { x: 440, y: 442, op: 0 }]; // electrons leaving to ground
const GHIDE: Pt[] = [{ x: 420, y: 472, op: 0 }, { x: 440, y: 472, op: 0 }]; // electrons waiting below ground

const PROTON_POS = PO.map(add);

function electronState(step: number, pol: "neg" | "pos"): Pt[] {
  const H: Pt = { x: C.x - 42, y: C.y - 4, op: 0 }; // generic hidden inside
  const e: Pt[] = Array.from({ length: 8 }, () => ({ ...H }));
  if (pol === "neg") {
    if (step === 0) { for (let i = 0; i < 6; i++) e[i] = { ...add(NEU[i]), op: 1 }; e[6] = GHIDE[0]; e[7] = GHIDE[1]; }
    if (step === 1) { for (let i = 0; i < 6; i++) e[i] = { ...add(RC[i]), op: 1 }; e[6] = GHIDE[0]; e[7] = GHIDE[1]; }
    if (step === 2) { for (let i = 0; i < 4; i++) e[i] = { ...add(RC[i]), op: 1 }; e[4] = GEXIT[0]; e[5] = GEXIT[1]; e[6] = GHIDE[0]; e[7] = GHIDE[1]; }
    if (step === 3) { for (let i = 0; i < 4; i++) e[i] = { ...add(RC[i]), op: 1 }; }
    if (step === 4) { for (let i = 0; i < 4; i++) e[i] = { ...add(SP4[i]), op: 1 }; }
  } else {
    // pos rod: electrons attracted to near side, ground SUPPLIES electrons
    if (step === 0) { for (let i = 0; i < 6; i++) e[i] = { ...add(NEU[i]), op: 1 }; e[6] = GHIDE[0]; e[7] = GHIDE[1]; }
    if (step === 1) { for (let i = 0; i < 6; i++) e[i] = { ...add(LC[i]), op: 1 }; e[6] = GHIDE[0]; e[7] = GHIDE[1]; }
    if (step === 2) { for (let i = 0; i < 6; i++) e[i] = { ...add(LC[i]), op: 1 }; e[6] = { ...add(LC[6]), op: 1 }; e[7] = { ...add(LC[7]), op: 1 }; }
    if (step === 3) { for (let i = 0; i < 8; i++) e[i] = { ...add(LC[i]), op: 1 }; }
    if (step === 4) { for (let i = 0; i < 8; i++) e[i] = { ...add(SP8[i]), op: 1 }; }
  }
  return e;
}

/* ---------------------------------------------------------------------------
 * Bilingual copy tables. Thai strings are preserved exactly as written in
 * the reference file; English is a faithful translation added alongside.
 * ------------------------------------------------------------------------- */

const TITLES: [string, string][] = [
  ["เริ่มต้น: ตัวนำเป็นกลาง", "Start: the conductor is neutral"],
  ["นำวัตถุมีประจุเข้าใกล้ (เกิดการเหนี่ยวนำ)", "Bring a charged object near (induction occurs)"],
  ["ต่อสายดิน (Grounding)", "Connect to ground (grounding)"],
  ["ตัดสายดินออก", "Disconnect the ground"],
  ["นำวัตถุมีประจุออก", "Remove the charged object"],
];

const DESC: Record<"neg" | "pos", [string, string][]> = {
  neg: [
    [
      "ตัวนำที่เป็นกลางมีจำนวนโปรตอน (+) และอิเล็กตรอน (−) เท่ากัน กระจายสม่ำเสมอทั้งก้อน ประจุสุทธิเท่ากับศูนย์",
      "A neutral conductor has equal numbers of protons (+) and electrons (−), spread evenly throughout. The net charge is zero.",
    ],
    [
      "นำแท่งประจุลบเข้าใกล้ อิเล็กตรอนในตัวนำถูกผลักให้ไปอยู่ด้านไกล เหลือด้านใกล้เป็นประจุบวก เกิดการแยกขั้ว (polarization) แต่ประจุสุทธิยังเป็นศูนย์",
      "Bringing the negative rod close pushes the conductor's electrons to the far side, leaving the near side positive. This is polarization, but the net charge is still zero.",
    ],
    [
      "ต่อสายดินเข้ากับตัวนำ อิเล็กตรอนส่วนที่ถูกผลัก ไหลออกจากตัวนำลงสู่ดิน เพราะโลกรับอิเล็กตรอนได้ไม่จำกัด",
      "Connecting the ground to the conductor lets the pushed electrons flow out into the ground, since the earth can absorb an essentially unlimited number of electrons.",
    ],
    [
      "ตัดสายดินออกขณะที่แท่งประจุยังอยู่ ตอนนี้ตัวนำมีอิเล็กตรอนน้อยกว่าโปรตอน จึงเหลือประจุบวกสุทธิค้างอยู่",
      "Disconnecting the ground while the rod is still nearby leaves the conductor with fewer electrons than protons, so a net positive charge remains.",
    ],
    [
      "นำแท่งประจุออก ประจุบวกที่เหลือกระจายทั่วตัวนำอย่างสม่ำเสมอ ผลลัพธ์: ตัวนำมีประจุบวก ซึ่งตรงข้ามกับแท่งที่นำมาเหนี่ยวนำ",
      "Removing the rod lets the remaining positive charge spread evenly over the conductor. Result: the conductor is positively charged, opposite to the rod used to induce it.",
    ],
  ],
  pos: [
    [
      "ตัวนำที่เป็นกลางมีจำนวนโปรตอน (+) และอิเล็กตรอน (−) เท่ากัน กระจายสม่ำเสมอทั้งก้อน ประจุสุทธิเท่ากับศูนย์",
      "A neutral conductor has equal numbers of protons (+) and electrons (−), spread evenly throughout. The net charge is zero.",
    ],
    [
      "นำแท่งประจุบวกเข้าใกล้ อิเล็กตรอนในตัวนำถูกดูดมาอยู่ด้านใกล้ เหลือด้านไกลเป็นประจุบวก เกิดการแยกขั้ว แต่ประจุสุทธิยังเป็นศูนย์",
      "Bringing the positive rod close pulls the conductor's electrons to the near side, leaving the far side positive. Polarization occurs, but the net charge is still zero.",
    ],
    [
      "ต่อสายดินเข้ากับตัวนำ อิเล็กตรอนจากดินไหลเข้ามาในตัวนำ เพราะถูกดูดโดยแท่งประจุบวก",
      "Connecting the ground to the conductor lets electrons flow in from the ground, pulled in by the positive rod.",
    ],
    [
      "ตัดสายดินออกขณะที่แท่งประจุยังอยู่ ตอนนี้ตัวนำมีอิเล็กตรอนมากกว่าโปรตอน จึงเหลือประจุลบสุทธิค้างอยู่",
      "Disconnecting the ground while the rod is still nearby leaves the conductor with more electrons than protons, so a net negative charge remains.",
    ],
    [
      "นำแท่งประจุออก ประจุลบที่เกินกระจายทั่วตัวนำอย่างสม่ำเสมอ ผลลัพธ์: ตัวนำมีประจุลบ ซึ่งตรงข้ามกับแท่งที่นำมาเหนี่ยวนำ",
      "Removing the rod lets the excess negative charge spread evenly over the conductor. Result: the conductor is negatively charged, opposite to the rod used to induce it.",
    ],
  ],
};

// [thaiLabel, englishLabel, badgeColor]
const NET: Record<"neg" | "pos", [string, string, string][]> = {
  neg: [
    ["เป็นกลาง (สุทธิ 0)", "Neutral (net 0)", "var(--muted)"],
    ["เป็นกลาง 0 (แยกขั้ว)", "Neutral 0 (polarized)", "var(--muted)"],
    ["กำลังถ่ายเทประจุ", "Charge transferring", "#f59e0b"],
    ["ประจุบวกสุทธิ +2", "Net positive charge +2", "#ef4444"],
    ["ประจุบวก +", "Positive charge +", "#ef4444"],
  ],
  pos: [
    ["เป็นกลาง (สุทธิ 0)", "Neutral (net 0)", "var(--muted)"],
    ["เป็นกลาง 0 (แยกขั้ว)", "Neutral 0 (polarized)", "var(--muted)"],
    ["กำลังถ่ายเทประจุ", "Charge transferring", "#f59e0b"],
    ["ประจุลบสุทธิ −2", "Net negative charge −2", "#3b82f6"],
    ["ประจุลบ −", "Negative charge −", "#3b82f6"],
  ],
};

const ROD_SIGN_X = [95, 135, 175, 215];
const STEP_COUNT = 5;
const CHARGE_TRANSITION = "transform 0.85s cubic-bezier(0.5,0,0.2,1), opacity 0.5s ease";

export default function InductionPage() {
  const { t } = useLang();

  const [step, setStep] = useState(0);
  const [pol, setPol] = useState<"neg" | "pos">("neg");

  const electrons = electronState(step, pol);
  const rodVisible = step >= 1 && step <= 3;
  const wireVisible = step === 2;
  const rodSign = pol === "neg" ? "−" : "+";
  const rodColor = pol === "neg" ? "#3b82f6" : "#ef4444";
  const [netTh, netEn, netColor] = NET[pol][step];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">
          {t("ฟิสิกส์", "Physics")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("การเหนี่ยวนำประจุ", "Electrostatic Induction")}</span>
      </div>

      {/* 2. Title */}
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
        {t("การเหนี่ยวนำประจุ ทีละขั้น", "Electrostatic induction, step by step")}
      </h1>
      <p className="text-sm text-[var(--muted)] mb-5">
        {t(
          "ประจุบวก (โปรตอน) ตรึงอยู่กับที่ ส่วนประจุลบ (อิเล็กตรอน) เคลื่อนที่ได้ กดปุ่มถัดไปเพื่อดูทีละขั้น",
          "Positive charges (protons) stay fixed in place, while negative charges (electrons) can move. Press next to see each step."
        )}
      </p>

      {/* 3. Polarity toggle */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3 mb-4">
        <label className="text-xs text-[var(--muted)] block mb-2">
          {t("แท่งที่นำมาเหนี่ยวนำ:", "Rod used to induce:")}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setPol("neg")}
            className={`flex-1 py-2 rounded-full text-sm font-medium border transition-all active:scale-[0.98] ${
              pol === "neg"
                ? "border-transparent text-white"
                : "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--background)]"
            }`}
            style={pol === "neg" ? { background: "#3b82f6" } : undefined}
          >
            {t("แท่งประจุลบ (−)", "Negative rod (−)")}
          </button>
          <button
            onClick={() => setPol("pos")}
            className={`flex-1 py-2 rounded-full text-sm font-medium border transition-all active:scale-[0.98] ${
              pol === "pos"
                ? "border-transparent text-white"
                : "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--background)]"
            }`}
            style={pol === "pos" ? { background: "#ef4444" } : undefined}
          >
            {t("แท่งประจุบวก (+)", "Positive rod (+)")}
          </button>
        </div>
      </div>

      {/* 4. Visualization */}
      <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4">
        {/* net charge badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{
            background: "var(--background)",
            border: "1px solid var(--card-border)",
            color: "var(--foreground)",
          }}
        >
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: netColor }} />
          {t(netTh, netEn)}
        </div>

        <svg viewBox="0 0 800 500" className="w-full h-auto">
          <defs>
            <radialGradient id="condgrad" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
          </defs>

          {/* ground bar */}
          <g>
            <line x1="250" y1="440" x2="610" y2="440" stroke="var(--foreground)" strokeWidth={4} strokeLinecap="round" />
            <line x1="270" y1="447" x2="300" y2="465" stroke="var(--muted)" strokeWidth={3} />
            <line x1="330" y1="447" x2="360" y2="465" stroke="var(--muted)" strokeWidth={3} />
            <line x1="390" y1="447" x2="420" y2="465" stroke="var(--muted)" strokeWidth={3} />
            <line x1="450" y1="447" x2="480" y2="465" stroke="var(--muted)" strokeWidth={3} />
            <line x1="510" y1="447" x2="540" y2="465" stroke="var(--muted)" strokeWidth={3} />
            <line x1="570" y1="447" x2="600" y2="465" stroke="var(--muted)" strokeWidth={3} />
            <text x={620} y={445} fill="var(--muted)" fontSize={13} textAnchor="start">
              {t("ดิน", "Ground")}
            </text>
          </g>

          {/* grounding wire, visible only during the grounding step */}
          <path
            d="M430 372 L430 440"
            stroke="#f59e0b"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
            style={{ opacity: wireVisible ? 1 : 0, transition: "opacity 0.4s" }}
          />

          {/* insulating stand */}
          <path d="M415 318 L445 318 L458 372 L402 372 Z" fill="#78716c" stroke="var(--muted)" strokeWidth={1.5} />
          <line x1="410" y1="332" x2="450" y2="332" stroke="var(--card-bg)" strokeWidth={1} />
          <line x1="407" y1="348" x2="453" y2="348" stroke="var(--card-bg)" strokeWidth={1} />

          {/* conductor */}
          <circle cx={C.x} cy={C.y} r={108} fill="url(#condgrad)" stroke="var(--muted)" strokeWidth={2.5} />
          <ellipse cx={400} cy={178} rx={46} ry={26} fill="rgba(255,255,255,0.3)" />

          {/* rod, visible only for steps 2 to 4 (index 1 to 3) */}
          <g style={{ opacity: rodVisible ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={70} y={192} width={185} height={38} rx={19} fill="#334155" stroke={rodColor} strokeWidth={2} />
            {ROD_SIGN_X.map((x) => (
              <g key={x}>
                <circle cx={x} cy={211} r={12} fill={rodColor} />
                <text x={x} y={217} textAnchor="middle" fontSize={16} fill="#fff" fontWeight={700}>
                  {rodSign}
                </text>
              </g>
            ))}
          </g>

          {/* protons (+), fixed, never move */}
          {PROTON_POS.map((p, i) => (
            <g key={`p${i}`} style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              <circle r={15} fill="#ef4444" />
              <text textAnchor="middle" y={6} fontSize={19} fill="#fff" fontWeight={700}>
                +
              </text>
            </g>
          ))}

          {/* electrons (−), mobile, animate between steps */}
          {electrons.map((e, i) => (
            <g
              key={`e${i}`}
              style={{
                transform: `translate(${e.x}px, ${e.y}px)`,
                opacity: e.op,
                transition: CHARGE_TRANSITION,
              }}
            >
              <circle r={15} fill="#3b82f6" />
              <text textAnchor="middle" y={6} fontSize={19} fill="#fff" fontWeight={700}>
                −
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 5. Step info */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="inline-flex items-center justify-center rounded-full w-7 h-7 text-sm font-semibold shrink-0"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {step + 1}
          </span>
          <span className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            {t(TITLES[step][0], TITLES[step][1])}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          {t(DESC[pol][step][0], DESC[pol][step][1])}
        </p>
      </div>

      {/* 6. Navigation: prev / dots / next */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-5 py-2 rounded-full text-sm border border-[var(--card-border)] hover:bg-[var(--card-bg)] active:scale-[0.98] transition-all disabled:opacity-35 disabled:cursor-default disabled:active:scale-100"
        >
          {t("‹ ก่อนหน้า", "‹ Previous")}
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={t(`ขั้นที่ ${i + 1}`, `Step ${i + 1}`)}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === step ? 40 : 28,
                background: i === step ? "var(--accent)" : "var(--card-border)",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(STEP_COUNT - 1, s + 1))}
          disabled={step === STEP_COUNT - 1}
          className="px-5 py-2 rounded-full text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 active:scale-[0.98] transition-all disabled:opacity-35 disabled:cursor-default disabled:active:scale-100"
        >
          {t("ถัดไป ›", "Next ›")}
        </button>
      </div>

      {/* 7. Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#ef4444]" />
          {t("โปรตอน (+) ตรึงที่", "Protons (+), fixed")}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]" />
          {t("อิเล็กตรอน (−) เคลื่อนที่", "Electrons (−), mobile")}
        </div>
      </div>
    </div>
  );
}
