"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function PhysicsPage() {
  const { t } = useLang();

  const topics = [
    {
      name: t("การเคลื่อนที่สัมพัทธ์", "Relative Motion"),
      description: t(
        "เรียนรู้แนวคิดการเคลื่อนที่สัมพัทธ์ผ่านมุมมอง Bird's eye และกระจกข้างรถ",
        "Learn relative motion concepts through bird's eye view and side mirror perspectives"
      ),
      href: "/physics/relative-motion",
      icon: "🚗",
    },
    {
      name: t("การเคลื่อนที่ 1 มิติ", "1D Motion Visualization"),
      description: t(
        "จำลองการเคลื่อนที่แนวตรงด้วยสมการ x(t) = x₀ + v₀t + ½at² พร้อมกราฟเรียลไทม์",
        "Simulate linear motion with equation x(t) = x₀ + v₀t + ½at² with real-time graphs"
      ),
      href: "/physics/1d-motion",
      icon: "📊",
    },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">⚛️ {t("ฟิสิกส์", "Physics")}</h1>
      <p className="text-[var(--muted)] mb-8">Physics</p>

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
