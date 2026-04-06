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
    {
      name: t("โพรเจกไทล์", "Projectile Motion"),
      description: t(
        "จำลองการเคลื่อนที่แบบโพรเจกไทล์ ปรับมุม ความเร็ว ความสูง แรงโน้มถ่วง และแรงต้านอากาศ เปรียบเทียบวิถีได้",
        "Simulate projectile motion with adjustable angle, velocity, height, gravity, and air drag. Compare trajectories."
      ),
      href: "/physics/projectile",
      icon: "🎯",
    },
    {
      name: t("งาน (Work)", "Work"),
      description: t(
        "คำนวณงานจากแรงที่กระทำต่อวัตถุบนพื้นราบ ปรับมุม ระยะทาง และแรงเสียดทานได้",
        "Calculate work done by a force on a box. Adjust angle, distance, and friction."
      ),
      href: "/physics/work",
      icon: "🔧",
    },
    {
      name: t("พลังงาน (Energy)", "Energy"),
      description: t(
        "สำรวจการอนุรักษ์พลังงานในการตกอิสระ ดูสมดุลระหว่างพลังงานศักย์และพลังงานจลน์",
        "Explore energy conservation in free fall. See the balance between PE and KE."
      ),
      href: "/physics/energy",
      icon: "⚡",
    },
    {
      name: t("แรงเสียดทาน (กล่องซ้อน)", "Friction (Stacked Boxes)"),
      description: t(
        "จำลองกล่องซ้อนกัน 2 ใบบนพื้น ตั้งค่าสัมประสิทธิ์แรงเสียดทานระหว่างผิวสัมผัส แสดง FBD และคำนวณความเร่งของแต่ละกล่อง",
        "Simulate two stacked boxes on a surface. Set friction coefficients between each surface, view free body diagrams, and calculate each box's acceleration."
      ),
      href: "/physics/friction",
      icon: "📦",
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
