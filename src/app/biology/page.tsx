"use client";

import { useLang } from "@/components/LangContext";

export default function BiologyPage() {
  const { t } = useLang();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🧬 {t("ชีววิทยา", "Biology")}</h1>
      <p className="text-[var(--muted)] mb-8">{t("Biology", "")}</p>
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-8 text-center">
        <p className="text-5xl mb-4">🚧</p>
        <p className="text-lg font-medium mb-2">{t("เร็วๆ นี้", "Coming Soon")}</p>
        <p className="text-sm text-[var(--muted)]">{t("เนื้อหาวิชาชีววิทยากำลังจัดทำ", "Biology content is being prepared")}</p>
      </div>
    </div>
  );
}
