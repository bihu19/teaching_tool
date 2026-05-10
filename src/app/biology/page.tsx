"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { Leaf, ArrowUpRight } from "lucide-react";

export default function BiologyPage() {
  const { t } = useLang();

  const topics = [
    {
      name: t("ระบบย่อยอาหาร", "Digestive System"),
      description: t(
        "เรียนรู้ระบบย่อยอาหารตั้งแต่ปากจนถึงทวารหนัก คลิกดูรายละเอียดการย่อยและดูดซึมในแต่ละขั้น",
        "Learn the digestive system from mouth to anus. Click each organ to see digestion and absorption details."
      ),
      href: "/biology/digestive-system",
    },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex items-center justify-center rounded-full w-10 h-10"
          style={{ background: "var(--sage-soft)", color: "#166534" }}
        >
          <Leaf size={20} strokeWidth={1.5} />
        </div>
        <h1
          className="text-3xl"
          style={{
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          {t("ชีววิทยา", "Biology")}
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {t("เลือกหัวข้อที่ต้องการเรียนรู้", "Choose a topic to explore.")}
      </p>

      <div className="grid gap-3">
        {topics.map((tp) => (
          <Link
            key={tp.href}
            href={tp.href}
            className="group flex items-start justify-between gap-4 rounded-2xl p-5 transition-all"
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
            <div>
              <h2
                className="text-base font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors"
                style={{ color: "var(--foreground)" }}
              >
                {tp.name}
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{tp.description}</p>
            </div>
            <span
              className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "var(--muted)" }}
            >
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
