"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

type OrganKey =
  | "mouth"
  | "esophagus"
  | "stomach"
  | "smallIntestine"
  | "largeIntestine"
  | "rectum"
  | "liver"
  | "pancreas"
  | "gallbladder";

interface OrganData {
  key: OrganKey;
  thName: string;
  enName: string;
  color: string;
  selectedColor: string;
  process: { th: string; en: string };
  enzymes: { th: string; en: string };
  absorbed: { th: string; en: string };
  helper?: { th: string; en: string };
}

const mainTractOrgans: OrganData[] = [
  {
    key: "mouth",
    thName: "ปาก",
    enName: "Mouth",
    color: "bg-pink-300",
    selectedColor: "ring-pink-500",
    process: {
      th: "การบดเคี้ยวอาหาร, น้ำลายผสมกับอาหาร",
      en: "Mechanical digestion by chewing, saliva mixes with food",
    },
    enzymes: {
      th: "อะไมเลส (Amylase) - ย่อยแป้งเป็นน้ำตาลมอลโทส",
      en: "Amylase - breaks down starch into maltose",
    },
    absorbed: {
      th: "ไม่มีการดูดซึม",
      en: "No absorption occurs",
    },
  },
  {
    key: "esophagus",
    thName: "หลอดอาหาร",
    enName: "Esophagus",
    color: "bg-amber-200",
    selectedColor: "ring-amber-500",
    process: {
      th: "การบีบตัวแบบ Peristalsis ส่งอาหารลงกระเพาะ",
      en: "Peristalsis pushes food down to the stomach",
    },
    enzymes: {
      th: "ไม่มี",
      en: "None",
    },
    absorbed: {
      th: "ไม่มีการดูดซึม",
      en: "No absorption occurs",
    },
  },
  {
    key: "stomach",
    thName: "กระเพาะอาหาร",
    enName: "Stomach",
    color: "bg-red-400",
    selectedColor: "ring-red-600",
    process: {
      th: "กรดเกลือ (HCl) ฆ่าเชื้อโรค, ย่อยโปรตีน",
      en: "Hydrochloric acid (HCl) kills germs, digests protein",
    },
    enzymes: {
      th: "เพปซิน (Pepsin) - ย่อยโปรตีนเป็นเพปไทด์",
      en: "Pepsin - breaks down protein into peptides",
    },
    absorbed: {
      th: "แอลกอฮอล์, ยาบางชนิด",
      en: "Alcohol, some medications",
    },
  },
  {
    key: "smallIntestine",
    thName: "ลำไส้เล็ก",
    enName: "Small Intestine",
    color: "bg-yellow-300",
    selectedColor: "ring-yellow-500",
    process: {
      th: "การย่อยและดูดซึมหลัก, น้ำดีช่วยย่อยไขมัน",
      en: "Main site of digestion and absorption, bile helps digest fat",
    },
    enzymes: {
      th: "ทริปซิน (Trypsin), ไลเปส (Lipase), มอลเทส (Maltase), แลกเทส (Lactase)",
      en: "Trypsin, Lipase, Maltase, Lactase",
    },
    absorbed: {
      th: "กลูโคส, กรดอะมิโน, กรดไขมัน, วิตามิน, แร่ธาตุ",
      en: "Glucose, amino acids, fatty acids, vitamins, minerals",
    },
    helper: {
      th: "ตับสร้างน้ำดี, ตับอ่อนสร้างเอนไซม์",
      en: "Liver produces bile, Pancreas produces enzymes",
    },
  },
  {
    key: "largeIntestine",
    thName: "ลำไส้ใหญ่",
    enName: "Large Intestine",
    color: "bg-amber-700 text-white",
    selectedColor: "ring-amber-800",
    process: {
      th: "ดูดซึมน้ำและเกลือแร่, แบคทีเรียสร้างวิตามิน K",
      en: "Absorbs water and minerals, bacteria produce vitamin K",
    },
    enzymes: {
      th: "ไม่มี (แบคทีเรียช่วยย่อย)",
      en: "None (bacteria assist digestion)",
    },
    absorbed: {
      th: "น้ำ, เกลือแร่, วิตามิน K, วิตามิน B12",
      en: "Water, minerals, vitamin K, vitamin B12",
    },
  },
  {
    key: "rectum",
    thName: "ทวารหนัก",
    enName: "Rectum/Anus",
    color: "bg-amber-900 text-white",
    selectedColor: "ring-amber-950",
    process: {
      th: "เก็บกากอาหาร, ขับถ่ายออกจากร่างกาย",
      en: "Stores waste, expels it from the body",
    },
    enzymes: {
      th: "ไม่มี",
      en: "None",
    },
    absorbed: {
      th: "ไม่มี",
      en: "None",
    },
  },
];

const helperOrgans: OrganData[] = [
  {
    key: "liver",
    thName: "ตับ",
    enName: "Liver",
    color: "bg-teal-600 text-white",
    selectedColor: "ring-teal-700",
    process: {
      th: "ผลิตน้ำดี (Bile) เพื่อย่อยไขมัน, กำจัดสารพิษ",
      en: "Produces bile to digest fat, detoxifies substances",
    },
    enzymes: {
      th: "น้ำดี (Bile) - ช่วยแตกตัวไขมัน (Emulsification)",
      en: "Bile - emulsifies fats",
    },
    absorbed: {
      th: "ไม่มี (อวัยวะช่วยย่อย)",
      en: "None (helper organ)",
    },
  },
  {
    key: "gallbladder",
    thName: "ถุงน้ำดี",
    enName: "Gallbladder",
    color: "bg-emerald-500 text-white",
    selectedColor: "ring-emerald-600",
    process: {
      th: "เก็บและเข้มข้นน้ำดีจากตับ, ปล่อยน้ำดีเข้าลำไส้เล็ก",
      en: "Stores and concentrates bile from the liver, releases bile into the small intestine",
    },
    enzymes: {
      th: "ไม่มี (เก็บน้ำดี)",
      en: "None (stores bile)",
    },
    absorbed: {
      th: "ไม่มี (อวัยวะช่วยย่อย)",
      en: "None (helper organ)",
    },
  },
  {
    key: "pancreas",
    thName: "ตับอ่อน",
    enName: "Pancreas",
    color: "bg-green-500 text-white",
    selectedColor: "ring-green-600",
    process: {
      th: "ผลิตเอนไซม์ย่อยอาหารและฮอร์โมนอินซูลิน",
      en: "Produces digestive enzymes and insulin hormone",
    },
    enzymes: {
      th: "ทริปซิน (Trypsin), ไลเปส (Lipase), อะไมเลส (Amylase)",
      en: "Trypsin, Lipase, Amylase",
    },
    absorbed: {
      th: "ไม่มี (อวัยวะช่วยย่อย)",
      en: "None (helper organ)",
    },
  },
];

const allOrgans = [...mainTractOrgans, ...helperOrgans];

const smallIntestineSections = [
  { th: "ดูโอดีนัม (Duodenum)", en: "Duodenum" },
  { th: "เจจูนัม (Jejunum)", en: "Jejunum" },
  { th: "ไอเลียม (Ileum)", en: "Ileum" },
];

export default function DigestiveSystemPage() {
  const { t } = useLang();
  const [selected, setSelected] = useState<OrganKey | null>(null);
  const [foodPosition, setFoodPosition] = useState<number>(-1);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const autoPlayRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOrgan = allOrgans.find((o) => o.key === selected) ?? null;

  const startAutoPlay = useCallback(() => {
    autoPlayRef.current = true;
    setAutoPlaying(true);
    let idx = 0;

    const step = () => {
      if (!autoPlayRef.current) return;
      if (idx >= mainTractOrgans.length) {
        autoPlayRef.current = false;
        setAutoPlaying(false);
        setFoodPosition(-1);
        return;
      }
      setSelected(mainTractOrgans[idx].key);
      setFoodPosition(idx);
      idx++;
      timerRef.current = setTimeout(step, 2000);
    };

    step();
  }, []);

  const stopAutoPlay = useCallback(() => {
    autoPlayRef.current = false;
    setAutoPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleOrganClick = (key: OrganKey) => {
    if (autoPlaying) stopAutoPlay();
    setSelected(key);
    const idx = mainTractOrgans.findIndex((o) => o.key === key);
    if (idx >= 0) setFoodPosition(idx);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/biology" className="hover:underline">
          {t("ชีววิทยา", "Biology")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("ระบบย่อยอาหาร", "Digestive System")}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {t("ระบบย่อยอาหาร", "Digestive System")}
      </h1>
      <p className="text-[var(--muted)] mb-6">
        {t(
          "คลิกที่อวัยวะเพื่อดูรายละเอียดของกระบวนการย่อยอาหาร",
          "Click on an organ to see details about the digestion process"
        )}
      </p>

      {/* Auto-play button */}
      <button
        onClick={autoPlaying ? stopAutoPlay : startAutoPlay}
        className="mb-6 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          background: autoPlaying ? "var(--accent)" : "var(--card-bg)",
          border: "1px solid var(--card-border)",
          color: "var(--foreground)",
        }}
      >
        {autoPlaying
          ? t("⏹ หยุด", "⏹ Stop")
          : t("▶ เล่นอัตโนมัติ", "▶ Auto-play Journey")}
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Diagram */}
        <div
          className="relative flex-shrink-0 rounded-2xl p-6"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            width: "100%",
            maxWidth: "400px",
            minHeight: "640px",
            margin: "0 auto",
          }}
        >
          {/* Vertical connecting line */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "60px",
              bottom: "40px",
              width: "3px",
              background: "var(--card-border)",
              zIndex: 0,
            }}
          />

          {/* Food particle indicator */}
          {foodPosition >= 0 && foodPosition < mainTractOrgans.length && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-in-out"
              style={{
                top: `${60 + foodPosition * 90}px`,
                transform: "translateX(-50%) translateX(-40px)",
              }}
            >
              <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-orange-600 flex items-center justify-center text-xs shadow-lg animate-pulse">
                🍎
              </div>
            </div>
          )}

          {/* Main tract organs */}
          {mainTractOrgans.map((organ, idx) => {
            const isSelected = selected === organ.key;
            const topPos = 48 + idx * 90;

            return (
              <button
                key={organ.key}
                onClick={() => handleOrganClick(organ.key)}
                className={`absolute left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-2xl text-sm font-medium cursor-pointer transition-all duration-200 ${organ.color} ${
                  isSelected ? `ring-4 ${organ.selectedColor} scale-110 shadow-lg` : "hover:scale-105 shadow"
                }`}
                style={{
                  top: `${topPos}px`,
                  minWidth: organ.key === "smallIntestine" ? "180px" : organ.key === "largeIntestine" ? "160px" : "120px",
                  textAlign: "center",
                }}
              >
                {t(organ.thName, organ.enName)}
                {organ.key === "smallIntestine" && (
                  <div className="text-[10px] mt-0.5 opacity-75">
                    {smallIntestineSections.map((s) => t(s.th, s.en)).join(" · ")}
                  </div>
                )}
              </button>
            );
          })}

          {/* Helper organs - positioned to the side */}
          {/* Liver */}
          <button
            onClick={() => handleOrganClick("liver")}
            className={`absolute z-10 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${helperOrgans[0].color} ${
              selected === "liver" ? `ring-4 ${helperOrgans[0].selectedColor} scale-110 shadow-lg` : "hover:scale-105 shadow"
            }`}
            style={{ top: "290px", right: "16px" }}
          >
            {t("ตับ", "Liver")}
          </button>

          {/* Gallbladder */}
          <button
            onClick={() => handleOrganClick("gallbladder")}
            className={`absolute z-10 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${helperOrgans[1].color} ${
              selected === "gallbladder" ? `ring-4 ${helperOrgans[1].selectedColor} scale-110 shadow-lg` : "hover:scale-105 shadow"
            }`}
            style={{ top: "330px", right: "16px" }}
          >
            {t("ถุงน้ำดี", "Gallbladder")}
          </button>

          {/* Pancreas */}
          <button
            onClick={() => handleOrganClick("pancreas")}
            className={`absolute z-10 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${helperOrgans[2].color} ${
              selected === "pancreas" ? `ring-4 ${helperOrgans[2].selectedColor} scale-110 shadow-lg` : "hover:scale-105 shadow"
            }`}
            style={{ top: "370px", right: "16px" }}
          >
            {t("ตับอ่อน", "Pancreas")}
          </button>

          {/* Dashed lines from helper organs to small intestine */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ overflow: "visible" }}
          >
            {/* Liver to small intestine area */}
            <line
              x1="65%"
              y1="306px"
              x2="55%"
              y2="340px"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.5"
            />
            {/* Gallbladder to small intestine area */}
            <line
              x1="65%"
              y1="346px"
              x2="55%"
              y2="345px"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.5"
            />
            {/* Pancreas to small intestine area */}
            <line
              x1="65%"
              y1="386px"
              x2="55%"
              y2="350px"
              stroke="var(--muted)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.5"
            />
          </svg>

          {/* Helper label */}
          <div
            className="absolute text-[10px] font-medium"
            style={{ top: "268px", right: "16px", color: "var(--muted)" }}
          >
            {t("อวัยวะช่วยย่อย", "Helper Organs")}
          </div>
        </div>

        {/* Detail Panel */}
        <div
          className="flex-1 rounded-2xl p-6"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            minHeight: "300px",
          }}
        >
          {selectedOrgan ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${selectedOrgan.color} flex items-center justify-center text-lg font-bold shadow`}
                >
                  {selectedOrgan.thName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedOrgan.thName}</h2>
                  <p className="text-sm text-[var(--muted)]">
                    {selectedOrgan.enName}
                  </p>
                </div>
              </div>

              {selectedOrgan.key === "smallIntestine" && (
                <div className="mb-4 p-3 rounded-lg" style={{ background: "var(--background)" }}>
                  <p className="text-xs font-medium text-[var(--muted)] mb-1">
                    {t("ส่วนประกอบ", "Sections")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {smallIntestineSections.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {t(s.th, s.en)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Process */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                    ⚙
                  </span>
                  {t("กระบวนการ", "Process")}
                </h3>
                <p className="text-sm ml-7" style={{ color: "var(--foreground)" }}>
                  {t(selectedOrgan.process.th, selectedOrgan.process.en)}
                </p>
              </div>

              {/* Enzymes */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                    🧪
                  </span>
                  {t("เอนไซม์/สารเคมี", "Enzymes/Chemicals")}
                </h3>
                <p className="text-sm ml-7" style={{ color: "var(--foreground)" }}>
                  {t(selectedOrgan.enzymes.th, selectedOrgan.enzymes.en)}
                </p>
              </div>

              {/* Absorbed */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-xs">
                    💧
                  </span>
                  {t("สารอาหารที่ดูดซึม", "Nutrients Absorbed")}
                </h3>
                <p className="text-sm ml-7" style={{ color: "var(--foreground)" }}>
                  {t(selectedOrgan.absorbed.th, selectedOrgan.absorbed.en)}
                </p>
              </div>

              {/* Helper info */}
              {selectedOrgan.helper && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-teal-100 text-teal-700 flex items-center justify-center text-xs">
                      🏥
                    </span>
                    {t("อวัยวะช่วยย่อย", "Helper Organs")}
                  </h3>
                  <p className="text-sm ml-7" style={{ color: "var(--foreground)" }}>
                    {t(selectedOrgan.helper.th, selectedOrgan.helper.en)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-4">👈</div>
              <p className="text-lg font-medium mb-2">
                {t("เลือกอวัยวะเพื่อดูรายละเอียด", "Select an organ to view details")}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {t(
                  "คลิกที่อวัยวะในแผนภาพ หรือกดปุ่มเล่นอัตโนมัติ",
                  "Click an organ in the diagram, or press the auto-play button"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
