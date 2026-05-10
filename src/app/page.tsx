"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { Calculator, Leaf, FlaskConical, Atom, ArrowUpRight } from "lucide-react";

const subjects = [
  {
    href: "/math",
    icon: <Calculator size={24} strokeWidth={1.5} />,
    accentVar: "--sky-soft",
    accentText: "#1D4ED8",
  },
  {
    href: "/biology",
    icon: <Leaf size={24} strokeWidth={1.5} />,
    accentVar: "--sage-soft",
    accentText: "#166534",
  },
  {
    href: "/chemistry",
    icon: <FlaskConical size={24} strokeWidth={1.5} />,
    accentVar: "--lilac-soft",
    accentText: "#6D28D9",
  },
  {
    href: "/physics",
    icon: <Atom size={24} strokeWidth={1.5} />,
    accentVar: "--accent-soft",
    accentText: "var(--accent)",
  },
];

export default function Home() {
  const { lang, t } = useLang();

  const subjectData = [
    {
      name: t("คณิตศาสตร์", "Mathematics"),
      description: t("พีชคณิต เรขาคณิต แคลคูลัส สถิติ", "Algebra, geometry, calculus, statistics"),
    },
    {
      name: t("ชีววิทยา", "Biology"),
      description: t("เซลล์ พันธุศาสตร์ ระบบนิเวศ วิวัฒนาการ", "Cells, genetics, ecology, evolution"),
    },
    {
      name: t("เคมี", "Chemistry"),
      description: t("อะตอม พันธะเคมี ปฏิกิริยา สารละลาย", "Atoms, bonds, reactions, solutions"),
    },
    {
      name: t("ฟิสิกส์", "Physics"),
      description: t("กลศาสตร์ คลื่น ไฟฟ้า แม่เหล็ก", "Mechanics, waves, electricity, magnetism"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Aurora hero */}
      <div
        className="flex flex-col items-center justify-center px-8 py-24 text-center"
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 0%, var(--accent-soft) 0%, var(--background) 65%)",
        }}
      >
        {/* Eyebrow */}
        <span
          className="inline-block rounded-full px-4 py-1.5 text-xs font-medium mb-8 tracking-wide uppercase"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid rgba(232, 98, 58, 0.20)",
          }}
        >
          {t("เครื่องมือการเรียนรู้", "Interactive learning tool")}
        </span>

        {/* Headline — Instrument Serif italic flourish */}
        <h1
          className="text-4xl sm:text-5xl leading-tight mb-5 max-w-xl"
          style={{
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          {lang === "th" ? (
            <>เรียนรู้วิทยาศาสตร์ <em style={{ color: "var(--accent-deep)", fontStyle: "italic" }}>อย่างลึกซึ้ง</em></>
          ) : (
            <>learn science <em style={{ color: "var(--accent-deep)", fontStyle: "italic" }}>deeply.</em></>
          )}
        </h1>

        <p
          className="text-base max-w-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {t(
            "บทเรียนแบบโต้ตอบสำหรับนักเรียนมัธยมปลาย คณิต ชีว เคมี ฟิสิกส์",
            "Interactive lessons for high-school students — bilingual, visual, no sign-up."
          )}
        </p>
      </div>

      {/* Subject cards */}
      <div className="px-8 pb-16 max-w-3xl mx-auto w-full -mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjectData.map((s, i) => {
            const meta = subjects[i];
            return (
              <Link
                key={meta.href}
                href={meta.href}
                className="group relative rounded-2xl p-6 transition-all"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  boxShadow: "var(--shadow-sm)",
                  transitionDuration: "var(--duration)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--shadow-md)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--shadow-sm)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                {/* Icon chip */}
                <div
                  className="inline-flex items-center justify-center rounded-full w-11 h-11 mb-4"
                  style={{
                    background: `var(${meta.accentVar})`,
                    color: meta.accentText,
                  }}
                >
                  {meta.icon}
                </div>

                <h2
                  className="text-lg font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {s.name}
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {s.description}
                </p>

                {/* Arrow */}
                <span
                  className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--muted)" }}
                >
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
