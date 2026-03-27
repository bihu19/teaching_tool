"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const subjects = [
  {
    name: "คณิตศาสตร์",
    nameEn: "Math",
    icon: "📐",
    href: "/math",
    color: "text-blue-500",
    topics: [],
  },
  {
    name: "ชีววิทยา",
    nameEn: "Biology",
    icon: "🧬",
    href: "/biology",
    color: "text-green-500",
    topics: [],
  },
  {
    name: "เคมี",
    nameEn: "Chemistry",
    icon: "⚗️",
    href: "/chemistry",
    color: "text-purple-500",
    topics: [],
  },
  {
    name: "ฟิสิกส์",
    nameEn: "Physics",
    icon: "⚛️",
    href: "/physics",
    color: "text-orange-500",
    topics: [
      { name: "การเคลื่อนที่สัมพัทธ์", href: "/physics/relative-motion" },
      { name: "การเคลื่อนที่ 1 มิติ", href: "/physics/1d-motion" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>("/physics");

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3 left-3 z-50 md:hidden bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-lg"
      >
        {open ? "✕" : "☰"}
      </button>

      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed md:static z-40 w-64 h-full bg-[var(--card-bg)] border-r border-[var(--card-border)] flex flex-col transition-transform md:translate-x-0`}
      >
        <Link href="/" className="block px-5 pt-5 pb-4 border-b border-[var(--card-border)]">
          <h1 className="text-lg font-bold">📚 Puay Teach</h1>
          <p className="text-xs text-[var(--muted)]">เครื่องมือการเรียนรู้</p>
        </Link>

        <nav className="flex-1 overflow-y-auto py-3">
          {subjects.map((s) => (
            <div key={s.href}>
              <button
                onClick={() => {
                  setExpanded(expanded === s.href ? null : s.href);
                }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-[var(--background)] transition-colors ${
                  pathname.startsWith(s.href) ? "bg-[var(--background)] font-medium" : ""
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <span className="flex-1 text-left">{s.name}</span>
                {s.topics.length > 0 && (
                  <span className="text-xs text-[var(--muted)]">
                    {expanded === s.href ? "▾" : "▸"}
                  </span>
                )}
              </button>

              {s.topics.length > 0 && expanded === s.href && (
                <div className="ml-11 border-l border-[var(--card-border)]">
                  <Link
                    href={s.href}
                    className={`block px-4 py-2 text-xs hover:bg-[var(--background)] ${
                      pathname === s.href ? "font-medium text-[var(--accent)]" : "text-[var(--muted)]"
                    }`}
                  >
                    ภาพรวม
                  </Link>
                  {s.topics.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`block px-4 py-2 text-xs hover:bg-[var(--background)] ${
                        pathname === t.href ? "font-medium text-[var(--accent)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              )}

              {s.topics.length === 0 && (
                <Link
                  href={s.href}
                  className="sr-only"
                >
                  {s.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
