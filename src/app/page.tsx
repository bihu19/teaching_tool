"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function Home() {
  const { t } = useLang();

  const subjects = [
    {
      name: t("คณิตศาสตร์", "Mathematics"),
      nameEn: "Mathematics",
      icon: "📐",
      href: "/math",
      color: "from-blue-500 to-blue-700",
      description: t("พีชคณิต เรขาคณิต แคลคูลัส สถิติ", "Algebra, Geometry, Calculus, Statistics"),
    },
    {
      name: t("ชีววิทยา", "Biology"),
      nameEn: "Biology",
      icon: "🧬",
      href: "/biology",
      color: "from-green-500 to-green-700",
      description: t("เซลล์ พันธุศาสตร์ ระบบนิเวศ วิวัฒนาการ", "Cells, Genetics, Ecology, Evolution"),
    },
    {
      name: t("เคมี", "Chemistry"),
      nameEn: "Chemistry",
      icon: "⚗️",
      href: "/chemistry",
      color: "from-purple-500 to-purple-700",
      description: t("อะตอม พันธะเคมี ปฏิกิริยาเคมี สารละลาย", "Atoms, Bonds, Reactions, Solutions"),
    },
    {
      name: t("ฟิสิกส์", "Physics"),
      nameEn: "Physics",
      icon: "⚛️",
      href: "/physics",
      color: "from-orange-500 to-orange-700",
      description: t("กลศาสตร์ คลื่น ไฟฟ้า แม่เหล็ก ฟิสิกส์นิวเคลียร์", "Mechanics, Waves, Electricity, Magnetism, Nuclear"),
    },
  ];

  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">📚 Puay Teach</h1>
          <p className="text-lg text-[var(--muted)]">
            {t("เลือกวิชาที่ต้องการเรียนรู้", "Choose a subject to learn")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subjects.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 hover:scale-[1.02] transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="text-4xl mb-3">{s.icon}</div>
              <h2 className="text-xl font-semibold mb-1">{s.name}</h2>
              <p className="text-sm text-[var(--muted)]">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
