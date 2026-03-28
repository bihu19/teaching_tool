"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang } from "./LangContext";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>("/physics");
  const { lang, toggle, t } = useLang();

  const subjects = [
    {
      name: t("คณิตศาสตร์", "Mathematics"),
      icon: "📐",
      href: "/math",
      topics: [],
    },
    {
      name: t("ชีววิทยา", "Biology"),
      icon: "🧬",
      href: "/biology",
      topics: [
        { name: t("ระบบย่อยอาหาร", "Digestive System"), href: "/biology/digestive-system" },
      ],
    },
    {
      name: t("เคมี", "Chemistry"),
      icon: "⚗️",
      href: "/chemistry",
      topics: [
        { name: t("รูปร่างโมเลกุล", "Molecular Shape"), href: "/chemistry/molecular-shape" },
      ],
    },
    {
      name: t("ฟิสิกส์", "Physics"),
      icon: "⚛️",
      href: "/physics",
      topics: [
        { name: t("การเคลื่อนที่สัมพัทธ์", "Relative Motion"), href: "/physics/relative-motion" },
        { name: t("การเคลื่อนที่ 1 มิติ", "1D Motion"), href: "/physics/1d-motion" },
      ],
    },
  ];

  return (
    <>
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
          <p className="text-xs text-[var(--muted)]">{t("เครื่องมือการเรียนรู้", "Learning Tool")}</p>
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
                    {t("ภาพรวม", "Overview")}
                  </Link>
                  {s.topics.map((topic) => (
                    <Link
                      key={topic.href}
                      href={topic.href}
                      className={`block px-4 py-2 text-xs hover:bg-[var(--background)] ${
                        pathname === topic.href ? "font-medium text-[var(--accent)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              )}

              {s.topics.length === 0 && (
                <Link href={s.href} className="sr-only">
                  {s.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Language toggle */}
        <div className="px-5 py-4 border-t border-[var(--card-border)]">
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--card-border)] text-sm hover:bg-[var(--background)] transition-colors"
          >
            <span>{lang === "th" ? "🇬🇧" : "🇹🇭"}</span>
            <span>{lang === "th" ? "English" : "ภาษาไทย"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
