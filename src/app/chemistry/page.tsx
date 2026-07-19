"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { FlaskConical, ArrowUpRight } from "lucide-react";

export default function ChemistryPage() {
  const { t } = useLang();

  const topics = [
    {
      name: t("รูปร่างโมเลกุล", "Molecular Shape (VSEPR)"),
      description: t(
        "เรียนรู้รูปร่างโมเลกุลตามทฤษฎี VSEPR เลือกจำนวนพันธะและคู่อิเล็กตรอนโดดเดี่ยว แล้วดูรูปร่างที่เปลี่ยนไป",
        "Learn molecular geometry using VSEPR theory. Adjust bonding pairs and lone pairs to see how the shape changes."
      ),
      href: "/chemistry/molecular-shape",
    },
    {
      name: t("ตารางธาตุและแนวโน้ม", "Periodic Table & Trends"),
      description: t(
        "สำรวจแนวโน้มในตารางธาตุ — ขนาดอะตอม, ขนาดไอออน, IE₁, EA, EN และความว่องไว — ด้วยปุ่มไฮไลต์สีสันสดใส",
        "Explore periodic trends — atomic size, ionic size, IE₁, EA, EN, and reactivity — with one-click color highlights."
      ),
      href: "/chemistry/periodic-table",
    },
    {
      name: t("อันดับของอัตราการเกิดปฏิกิริยา", "Reaction Rate Order"),
      description: t(
        "เลือกอันดับปฏิกิริยา (0, 1, 2, 3) แล้วดูกราฟความเข้มข้นกับเวลา พร้อมสมการอัตรา สมการเชิงปริพันธ์ และครึ่งชีวิต",
        "Choose a reaction order (0, 1, 2, 3) and explore the concentration–time graph, with rate laws, integrated equations, and half-lives."
      ),
      href: "/chemistry/reaction-order",
    },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex items-center justify-center rounded-full w-10 h-10"
          style={{ background: "var(--lilac-soft)", color: "#6D28D9" }}
        >
          <FlaskConical size={20} strokeWidth={1.5} />
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
          {t("เคมี", "Chemistry")}
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
