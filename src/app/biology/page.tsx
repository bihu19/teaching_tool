"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function BiologyPage() {
  const { t } = useLang();

  const topics = [
    {
      name: t("ระบบย่อยอาหาร", "Digestive System"),
      description: t(
        "เรียนรู้ระบบย่อยอาหารตั้งแต่ปากจนถึงทวารหนัก คลิกดูรายละเอียดการย่อยและดูดซึมในแต่ละขั้น",
        "Learn about the digestive system from mouth to anus. Click each organ to see digestion and absorption details."
      ),
      href: "/biology/digestive-system",
      icon: "🫁",
    },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🧬 {t("ชีววิทยา", "Biology")}</h1>
      <p className="text-[var(--muted)] mb-8">Biology</p>

      <div className="grid gap-4">
        {topics.map((tp) => (
          <Link
            key={tp.href}
            href={tp.href}
            className="group flex items-start gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:scale-[1.01] transition-all"
          >
            <span className="text-3xl mt-1">{tp.icon}</span>
            <div>
              <h2 className="text-lg font-semibold group-hover:text-[var(--accent)]">{tp.name}</h2>
              <p className="text-sm text-[var(--muted)]">{tp.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
