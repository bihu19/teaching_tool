"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { Atom, ArrowUpRight } from "lucide-react";

export default function PhysicsPage() {
  const { t } = useLang();

  const topics = [
    {
      name: t("การเคลื่อนที่สัมพัทธ์", "Relative Motion"),
      description: t(
        "เรียนรู้แนวคิดการเคลื่อนที่สัมพัทธ์ผ่านมุมมอง Bird's eye และกระจกข้างรถ",
        "Learn relative motion concepts through bird's eye view and side mirror perspectives."
      ),
      href: "/physics/relative-motion",
    },
    {
      name: t("การเคลื่อนที่ 1 มิติ", "1D Motion"),
      description: t(
        "จำลองการเคลื่อนที่แนวตรงด้วยสมการ x(t) = x₀ + v₀t + ½at² พร้อมกราฟเรียลไทม์",
        "Simulate linear motion with x(t) = x₀ + v₀t + ½at² and real-time graphs."
      ),
      href: "/physics/1d-motion",
    },
    {
      name: t("โพรเจกไทล์", "Projectile Motion"),
      description: t(
        "จำลองการเคลื่อนที่แบบโพรเจกไทล์ ปรับมุม ความเร็ว ความสูง แรงโน้มถ่วง และแรงต้านอากาศ",
        "Simulate projectile motion — adjust angle, velocity, height, gravity, and air drag."
      ),
      href: "/physics/projectile",
    },
    {
      name: t("งาน", "Work"),
      description: t(
        "คำนวณงานจากแรงที่กระทำต่อวัตถุบนพื้นราบ ปรับมุม ระยะทาง และแรงเสียดทานได้",
        "Calculate work done by a force on a box — adjust angle, distance, and friction."
      ),
      href: "/physics/work",
    },
    {
      name: t("พลังงาน", "Energy"),
      description: t(
        "สำรวจการอนุรักษ์พลังงานในการตกอิสระ ดูสมดุลระหว่างพลังงานศักย์และพลังงานจลน์",
        "Explore energy conservation in free fall — PE and KE in real time."
      ),
      href: "/physics/energy",
    },
    {
      name: t("แรงเสียดทาน (กล่องซ้อน)", "Friction — Stacked Boxes"),
      description: t(
        "จำลองกล่องซ้อนกัน 2 ใบบนพื้น ตั้งค่าสัมประสิทธิ์แรงเสียดทาน แสดง FBD และคำนวณความเร่ง",
        "Two stacked boxes on a surface — set friction coefficients, view FBDs, calculate accelerations."
      ),
      href: "/physics/friction",
    },
    {
      name: t("แสงและทัศนอุปกรณ์", "Optics — Lenses & Mirrors"),
      description: t(
        "สำรวจการเกิดภาพของเลนส์นูน เลนส์เว้า กระจกเว้า และกระจกนูน พร้อมรังสีทั้งสามเส้น",
        "Explore image formation for convex/concave lenses and mirrors — ray diagrams for all object positions."
      ),
      href: "/physics/optics",
    },
    {
      name: t("แรงลอยตัว", "Buoyancy Force"),
      description: t(
        "เรียนรู้หลักการของอาร์คิมีดิส ปรับความหนาแน่นของวัตถุและของเหลว แล้วดูว่าวัตถุลอยหรือจม",
        "Explore Archimedes' principle — adjust object and fluid density to see floating vs sinking."
      ),
      href: "/physics/buoyancy",
    },
    {
      name: t("การหักเหและการสะท้อนกลับหมด", "Refraction & Total Internal Reflection"),
      description: t(
        "สำรวจกฎของสเนลล์ ปรับมุมแสงจากปลาใต้น้ำ แล้วดูมุมวิกฤตของการสะท้อนกลับหมด",
        "Explore Snell's law — adjust the underwater light ray angle to find the critical angle for total internal reflection."
      ),
      href: "/physics/refraction",
    },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex items-center justify-center rounded-full w-10 h-10"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Atom size={20} strokeWidth={1.5} />
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
          {t("ฟิสิกส์", "Physics")}
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
