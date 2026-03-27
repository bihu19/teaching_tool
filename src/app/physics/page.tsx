import Link from "next/link";

const topics = [
  {
    name: "การเคลื่อนที่สัมพัทธ์",
    nameEn: "Relative Motion",
    description: "เรียนรู้แนวคิดการเคลื่อนที่สัมพัทธ์ผ่านมุมมอง Bird's eye และกระจกข้างรถ",
    href: "/physics/relative-motion",
    icon: "🚗",
  },
  {
    name: "การเคลื่อนที่ 1 มิติ",
    nameEn: "1D Motion Visualization",
    description: "จำลองการเคลื่อนที่แนวตรงด้วยสมการ x(t) = x₀ + v₀t + ½at² พร้อมกราฟเรียลไทม์",
    href: "/physics/1d-motion",
    icon: "📊",
  },
];

export default function PhysicsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">⚛️ ฟิสิกส์</h1>
      <p className="text-[var(--muted)] mb-8">Physics</p>

      <div className="grid gap-4">
        {topics.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex items-start gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:scale-[1.01] transition-all"
          >
            <span className="text-3xl mt-1">{t.icon}</span>
            <div>
              <h2 className="text-lg font-semibold group-hover:text-[var(--accent)]">{t.name}</h2>
              <p className="text-xs text-[var(--muted)] mb-1">{t.nameEn}</p>
              <p className="text-sm text-[var(--muted)]">{t.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
