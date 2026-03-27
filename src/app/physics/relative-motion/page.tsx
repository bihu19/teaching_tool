"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

type Scenario = {
  labelB: (t: (th: string, en: string) => string) => string;
  dirB: number;
  rel: (a: number, b: number) => number | null;
  formula: (t: (th: string, en: string) => string, a: number, b: number, r: number) => string;
  mirrorLabel: (t: (th: string, en: string) => string, r: number) => string;
  explain: (t: (th: string, en: string) => string, a: number, b: number, r: number) => string;
  relLabel: (t: (th: string, en: string) => string) => string;
};

const scenarios: Scenario[] = [
  {
    labelB: (t) => t("รถ B (ทิศเดียวกัน) km/h", "Car B (Same direction) km/h"),
    dirB: 1,
    rel: (a, b) => b - a,
    formula: (t, a, b, r) => {
      const abs = Math.abs(r);
      if (r > 0) return `v_rel = ${b} − ${a} = +${abs} km/h ${t("(B นำหน้าและกำลังห่างออก)", "(B ahead and moving away)")}`;
      if (r < 0) return `v_rel = ${b} − ${a} = −${abs} km/h ${t("(B อยู่ข้างหลังและกำลังห่างออก)", "(B behind and falling back)")}`;
      return `v_rel = ${b} − ${a} = 0 km/h ${t("(วิ่งเคียงกัน ไม่เคลื่อนที่ในกระจก)", "(side by side, stationary in mirror)")}`;
    },
    mirrorLabel: (t, r) => {
      const abs = Math.abs(r);
      if (r > 0) return t(`B เคลื่อนห่างออก ${abs} km/h`, `B moving away ${abs} km/h`);
      if (r < 0) return t(`B เคลื่อนเข้ามา ${abs} km/h`, `B approaching ${abs} km/h`);
      return t("B นิ่งอยู่กับที่", "B stationary");
    },
    explain: (t, a, b, r) => {
      const abs = Math.abs(r);
      if (r === 0)
        return t(
          "ในกระจก รถ B จะดูนิ่งสนิท ไม่เคลื่อนที่เลย เพราะทั้งคู่วิ่งเร็วเท่ากัน นี่คือหัวใจของการเคลื่อนที่สัมพัทธ์",
          "In the mirror, car B appears completely stationary because both cars are moving at the same speed. This is the essence of relative motion."
        );
      if (r > 0)
        return t(
          `ในกระจกข้าง คุณจะเห็นรถ B ค่อยๆ เคลื่อนออกไปข้างหน้าด้วยความเร็วแค่ ${abs} km/h แม้รถทั้งคู่วิ่งเร็วมากบนถนนจริงๆ`,
          `In the side mirror, you see car B gradually moving ahead at only ${abs} km/h, even though both cars are traveling fast on the actual road.`
        );
      return t(
        `ในกระจกข้าง รถ B ดูเหมือนเข้ามาใกล้ด้วยความเร็ว ${abs} km/h เพราะรถ A วิ่งเร็วกว่า B`,
        `In the side mirror, car B appears to approach at ${abs} km/h because car A is faster than B.`
      );
    },
    relLabel: (t) => t("B ในกระจก A", "B in A's mirror"),
  },
  {
    labelB: (t) => t("รถ B (สวนทางกัน) km/h", "Car B (Opposite dir.) km/h"),
    dirB: -1,
    rel: (a, b) => a + b,
    formula: (t, a, b, r) => `v_rel = ${a} + ${b} = ${r} km/h ${t("(เข้าหากัน ชนกัน)", "(approaching head-on)")}`,
    mirrorLabel: (t, r) => t(`B พุ่งเข้ามา ${r} km/h`, `B rushing in ${r} km/h`),
    explain: (t, a, b, r) =>
      t(
        `เมื่อรถสวนทาง ในกระจกจะเห็นรถ B พุ่งเข้ามาเร็วมากถึง ${r} km/h ความเร็วสัมพัทธ์คือผลบวกของทั้งสองฝั่ง`,
        `When cars travel in opposite directions, car B appears to rush in at ${r} km/h in the mirror. Relative speed is the sum of both speeds.`
      ),
    relLabel: (t) => t("ความเร็วสัมพัทธ์", "Relative Speed"),
  },
  {
    labelB: (t) => t("รถ B (ผู้สังเกตบนพื้น) km/h", "Car B (Ground observer) km/h"),
    dirB: 1,
    rel: () => null,
    formula: (t, a, b) =>
      t(
        `ผู้สังเกตบนพื้น: เห็น A = ${a} km/h, B = ${b} km/h (ความเร็วแท้จริง)`,
        `Ground observer: sees A = ${a} km/h, B = ${b} km/h (actual speeds)`
      ),
    mirrorLabel: (t) => t("มุมมองบุคคลที่ 3", "3rd person view"),
    explain: (t, a, b) =>
      t(
        `ผู้ยืนอยู่กับที่เห็นความเร็วจริง: A วิ่ง ${a} km/h และ B วิ่ง ${b} km/h เปรียบเทียบกับมุมมองกระจกที่เห็นเพียงความต่าง`,
        `A stationary observer sees actual speeds: A at ${a} km/h and B at ${b} km/h. Compare this to the mirror view which shows only the difference.`
      ),
    relLabel: (t) => t("ไม่ใช่สัมพัทธ์", "Not relative"),
  },
];

export default function RelativeMotionPage() {
  const { t } = useLang();
  const [scenario, setScenario] = useState(0);
  const [speedA, setSpeedA] = useState(60);
  const [speedB, setSpeedB] = useState(80);

  const sc = scenarios[scenario];
  const relSpeed = sc.rel(speedA, speedB);
  const r = relSpeed ?? 0;

  const birdRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef({ pA: 60, pB: 280, tx1: 480, tx2: 140, rdx: 0, mpB: 50, mtx1: 20, mtx2: 65, mrdx: 0 });

  const resetPositions = useCallback(() => {
    posRef.current = { pA: 60, pB: 280, tx1: 480, tx2: 140, rdx: 0, mpB: 50, mtx1: 20, mtx2: 65, mrdx: 0 };
  }, []);

  useEffect(() => {
    resetPositions();
  }, [scenario, resetPositions]);

  useEffect(() => {
    const birdSc = 0.016;
    const mSc = 0.012;
    const dirB = sc.dirB;

    const frame = () => {
      const p = posRef.current;
      const birdEl = birdRef.current;
      const W = birdEl?.offsetWidth ?? 420;

      p.pA += speedA * birdSc;
      p.pB += speedB * birdSc * dirB;
      p.tx1 -= speedA * birdSc * 0.25;
      p.tx2 -= speedA * birdSc * 0.25;
      p.rdx -= speedA * birdSc * 0.5;

      if (p.pA > W) p.pA = -70;
      if (dirB > 0 && p.pB > W) p.pB = -70;
      if (dirB < 0 && p.pB < -70) p.pB = W;
      if (p.tx1 < -15) p.tx1 += W + 20;
      if (p.tx2 < -15) p.tx2 += W + 20;

      const birdA = document.getElementById("birdA");
      const birdBEl = document.getElementById("birdB");
      const tree1 = document.getElementById("bird-tree1");
      const tree2 = document.getElementById("bird-tree2");
      const dashEl = document.getElementById("bird-road-dashes");

      if (birdA) birdA.style.left = Math.round(p.pA) + "px";
      if (birdBEl) {
        birdBEl.style.left = Math.round(p.pB) + "px";
        birdBEl.style.transform = dirB < 0 ? "scaleX(-1)" : "";
      }
      if (tree1) tree1.style.left = Math.round(p.tx1) + "px";
      if (tree2) tree2.style.left = Math.round(p.tx2) + "px";
      if (dashEl) {
        dashEl.style.backgroundImage =
          "repeating-linear-gradient(to right, #fbbf24 0px, #fbbf24 50px, transparent 50px, transparent 90px)";
        dashEl.style.backgroundPositionX = Math.round(p.rdx % 90) + "px";
      }

      let relV = 0;
      if (relSpeed !== null) relV = relSpeed;

      if (scenario === 1) {
        p.mpB += (speedA + speedB) * mSc * 0.8;
      } else if (scenario === 2) {
        p.mpB += speedB * mSc * 0.5;
      } else {
        p.mpB += relV * mSc;
      }

      p.mtx1 -= speedA * mSc * 0.08;
      p.mtx2 -= speedA * mSc * 0.08;
      p.mrdx -= speedA * mSc * 0.15;

      if (p.mpB > 110) p.mpB = -20;
      if (p.mpB < -20) p.mpB = 110;
      if (p.mtx1 < -5) p.mtx1 += 98;
      if (p.mtx2 < -5) p.mtx2 += 98;
      if (p.mtx1 > 88) p.mtx1 -= 98;
      if (p.mtx2 > 88) p.mtx2 -= 98;

      const mirrorB = document.getElementById("mirrorB");
      const mt1 = document.getElementById("mirrorTree1");
      const mt2 = document.getElementById("mirrorTree2");
      const mDashes = document.getElementById("mirrorDashes");

      if (mirrorB) {
        const distFromCenter = Math.abs(p.mpB - 44) / 44;
        const mCarScale = Math.max(0.4, 1 - distFromCenter * 0.5);
        mirrorB.style.left = Math.round(p.mpB) + "%";
        mirrorB.style.transform = `translateX(-50%) scaleX(${scenario === 1 ? -1 : 1}) scale(${mCarScale})`;
      }
      if (mt1) mt1.style.left = Math.round(p.mtx1) + "%";
      if (mt2) mt2.style.left = Math.round(p.mtx2) + "%";
      if (mDashes) {
        mDashes.style.backgroundImage =
          "repeating-linear-gradient(to right, #4b5563 0px, #4b5563 20px, transparent 20px, transparent 35px)";
        mDashes.style.backgroundPositionX = Math.round(p.mrdx % 35) + "px";
      }

      animRef.current = requestAnimationFrame(frame);
    };

    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, [speedA, speedB, scenario, sc.dirB, relSpeed]);

  const tabLabels = [
    t("ทิศเดียวกัน", "Same Direction"),
    t("สวนทางกัน", "Opposite Direction"),
    t("คนยืนบนพื้น", "Ground Observer"),
  ];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/physics" className="hover:underline">{t("ฟิสิกส์", "Physics")}</Link>
        <span>›</span>
        <span>{t("การเคลื่อนที่สัมพัทธ์", "Relative Motion")}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        🚗 {t("การเคลื่อนที่สัมพัทธ์", "Relative Motion")}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setScenario(i)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
              scenario === i
                ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                : "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--card-bg)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Bird's eye view */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden">
          <div className="text-xs font-medium text-[var(--muted)] px-3 pt-2 pb-1">
            {t("มุมมองจากด้านบน (Bird's eye)", "Bird's Eye View")}
          </div>
          <div
            ref={birdRef}
            className="relative w-full h-40 overflow-hidden"
            style={{ background: "linear-gradient(to bottom, #bfdbfe 0%, #bfdbfe 50%, #86efac 50%, #86efac 70%, #9ca3af 70%)" }}
          >
            <div className="absolute bottom-0 w-full h-[30%] bg-gray-600" />
            <div id="bird-road-dashes" className="absolute h-1 w-full" style={{ bottom: "12px" }} />
            <div id="bird-tree1" className="absolute" style={{ bottom: "30%", left: 480 }}>
              <div className="w-2.5 h-4 bg-green-600 rounded-[50%_50%_40%_40%] absolute bottom-2.5 left-0" />
              <div className="w-1.5 h-2.5 bg-amber-800 rounded-sm absolute bottom-0 left-[2.5px]" />
            </div>
            <div id="bird-tree2" className="absolute" style={{ bottom: "30%", left: 140 }}>
              <div className="w-2.5 h-4 bg-green-600 rounded-[50%_50%_40%_40%] absolute bottom-2.5 left-0" />
              <div className="w-1.5 h-2.5 bg-amber-800 rounded-sm absolute bottom-0 left-[2.5px]" />
            </div>
            <div id="birdA" className="absolute flex flex-col items-center" style={{ bottom: "30%", left: 60 }}>
              <div className="absolute -top-8 text-[10px] bg-[var(--background)] border border-[var(--card-border)] px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                {t("คุณ", "You")} {speedA}
              </div>
              <div className="relative w-16 h-[30px] bg-blue-500 rounded-md">
                <div className="absolute w-9 h-3.5 bg-blue-600 rounded-t-md -top-2.5 left-3.5" />
                <div className="absolute w-3 h-3 rounded-full bg-gray-800 border border-gray-400 -bottom-1.5 left-1.5" />
                <div className="absolute w-3 h-3 rounded-full bg-gray-800 border border-gray-400 -bottom-1.5 right-1.5" />
              </div>
            </div>
            <div id="birdB" className="absolute flex flex-col items-center" style={{ bottom: "30%", left: 280 }}>
              <div className="absolute -top-8 text-[10px] bg-[var(--background)] border border-[var(--card-border)] px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                {sc.dirB < 0 ? `← B ${speedB}` : `B ${speedB}`}
              </div>
              <div className="relative w-16 h-[30px] bg-orange-500 rounded-md">
                <div className="absolute w-9 h-3.5 bg-orange-600 rounded-t-md -top-2.5 left-3.5" />
                <div className="absolute w-3 h-3 rounded-full bg-gray-800 border border-gray-400 -bottom-1.5 left-1.5" />
                <div className="absolute w-3 h-3 rounded-full bg-gray-800 border border-gray-400 -bottom-1.5 right-1.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Mirror view */}
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden">
          <div className="text-xs font-medium text-[var(--muted)] px-3 pt-2 pb-1">
            {t("มุมมองกระจกข้าง (จากรถ A)", "Side Mirror View (from Car A)")}
          </div>
          <div className="relative w-full h-40 overflow-hidden bg-slate-800 rounded-b-xl">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[88%] h-[120px] rounded-[50%/30%] border-[3px] border-slate-400 overflow-hidden bg-slate-900">
              <div className="absolute top-0 w-full h-[45%] bg-gradient-to-b from-[#1e3a5f] to-[#1d4ed8]" />
              <div className="absolute top-[45%] w-full h-[10%] bg-[#4b7c2f]" />
              <div className="absolute bottom-0 w-full h-[45%] bg-gray-700" />
              <div id="mirrorDashes" className="absolute h-[3px] w-full" style={{ bottom: 14 }} />
              <div id="mirrorTree1" className="absolute" style={{ bottom: 18, left: "20%" }}>
                <div className="w-2 h-3.5 bg-[#1a4731] rounded-[50%_50%_40%_40%] absolute bottom-2 left-0" />
                <div className="w-1 h-2 bg-[#5c3317] rounded-sm absolute bottom-0 left-[2px]" />
              </div>
              <div id="mirrorTree2" className="absolute" style={{ bottom: 18, left: "65%" }}>
                <div className="w-2 h-3.5 bg-[#1a4731] rounded-[50%_50%_40%_40%] absolute bottom-2 left-0" />
                <div className="w-1 h-2 bg-[#5c3317] rounded-sm absolute bottom-0 left-[2px]" />
              </div>
              <div
                id="mirrorB"
                className="absolute flex flex-col items-center"
                style={{ bottom: 14, left: "50%", transform: "translateX(-50%)" }}
              >
                <div className="relative w-11 h-5 bg-orange-500 rounded">
                  <div className="absolute w-6 h-3 bg-orange-600 rounded-t -top-2 left-2.5" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-500 -bottom-1 left-1" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-500 -bottom-1 right-1" />
                </div>
              </div>
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-black/60 text-yellow-400 text-[10px] px-2 py-0.5 rounded-lg whitespace-nowrap z-10">
                {sc.mirrorLabel(t, r)}
              </div>
            </div>
            <div className="absolute bottom-2.5 left-0 right-0 text-center text-[10px] text-slate-500">
              {t("กระจกข้างซ้ายจากมุมมองผู้นั่งรถ A", "Left side mirror from car A's perspective")}
            </div>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <label className="text-xs text-[var(--muted)] w-36 shrink-0">
            {t("รถ A (คุณ) km/h", "Car A (You) km/h")}
          </label>
          <input type="range" min={0} max={120} value={speedA} onChange={(e) => setSpeedA(+e.target.value)} className="flex-1" />
          <span className="text-xs font-medium min-w-[50px] text-right">{speedA} km/h</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--muted)] w-36 shrink-0">{sc.labelB(t)}</label>
          <input type="range" min={0} max={120} value={speedB} onChange={(e) => setSpeedB(+e.target.value)} className="flex-1" />
          <span className="text-xs font-medium min-w-[50px] text-right">{speedB} km/h</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-1">{t("ความเร็ว A", "Speed A")}</div>
          <div className="text-xl font-medium">{speedA}</div>
          <div className="text-[11px] text-[var(--muted)]">km/h</div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-1">
            {scenario === 1 ? t("ความเร็ว B (สวน)", "Speed B (opp.)") : t("ความเร็ว B", "Speed B")}
          </div>
          <div className="text-xl font-medium">{speedB}</div>
          <div className="text-[11px] text-[var(--muted)]">km/h</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-center">
          <div className="text-[11px] text-[var(--muted)] mb-1">{sc.relLabel(t)}</div>
          <div className="text-xl font-medium text-blue-600 dark:text-blue-400">
            {relSpeed !== null ? Math.abs(relSpeed) : "–"}
          </div>
          <div className="text-[11px] text-[var(--muted)]">km/h</div>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-lg px-4 py-2.5 font-mono text-xs text-[var(--muted)] mb-3">
        {sc.formula(t, speedA, speedB, r)}
      </div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">
        {sc.explain(t, speedA, speedB, r)}
      </p>
    </div>
  );
}
