"use client";

import { useLang } from "@/components/LangContext";
import { Calculator } from "lucide-react";

export default function MathPage() {
  const { t } = useLang();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex items-center justify-center rounded-full w-10 h-10"
          style={{ background: "var(--sky-soft)", color: "#1D4ED8" }}
        >
          <Calculator size={20} strokeWidth={1.5} />
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
          {t("คณิตศาสตร์", "Mathematics")}
        </h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {t("เลือกหัวข้อที่ต้องการเรียนรู้", "Choose a topic to explore.")}
      </p>

      <div
        className="rounded-2xl p-10 text-center"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <p
          className="text-lg font-semibold mb-2"
          style={{
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            color: "var(--foreground)",
          }}
        >
          {t("เร็วๆ นี้", "Coming soon.")}
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {t("เนื้อหาวิชาคณิตศาสตร์กำลังจัดทำ", "Mathematics content is being prepared.")}
        </p>
      </div>
    </div>
  );
}
