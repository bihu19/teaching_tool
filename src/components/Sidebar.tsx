"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang } from "./LangContext";
import {
  Calculator,
  Leaf,
  FlaskConical,
  Atom,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Globe,
} from "lucide-react";

const subjectIcons: Record<string, React.ReactNode> = {
  "/math":      <Calculator size={18} strokeWidth={1.5} />,
  "/biology":   <Leaf        size={18} strokeWidth={1.5} />,
  "/chemistry": <FlaskConical size={18} strokeWidth={1.5} />,
  "/physics":   <Atom        size={18} strokeWidth={1.5} />,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>("/physics");
  const { lang, toggle, t } = useLang();

  const subjects = [
    {
      name: t("คณิตศาสตร์", "Mathematics"),
      href: "/math",
      topics: [],
    },
    {
      name: t("ชีววิทยา", "Biology"),
      href: "/biology",
      topics: [
        { name: t("ระบบย่อยอาหาร", "Digestive System"), href: "/biology/digestive-system" },
      ],
    },
    {
      name: t("เคมี", "Chemistry"),
      href: "/chemistry",
      topics: [
        { name: t("รูปร่างโมเลกุล", "Molecular Shape"), href: "/chemistry/molecular-shape" },
        { name: t("ตารางธาตุและแนวโน้ม", "Periodic Table & Trends"), href: "/chemistry/periodic-table" },
      ],
    },
    {
      name: t("ฟิสิกส์", "Physics"),
      href: "/physics",
      topics: [
        { name: t("การเคลื่อนที่สัมพัทธ์", "Relative Motion"), href: "/physics/relative-motion" },
        { name: t("การเคลื่อนที่ 1 มิติ", "1D Motion"), href: "/physics/1d-motion" },
        { name: t("โพรเจกไทล์", "Projectile Motion"), href: "/physics/projectile" },
        { name: t("งาน", "Work"), href: "/physics/work" },
        { name: t("พลังงาน", "Energy"), href: "/physics/energy" },
        { name: t("แรงเสียดทาน (กล่องซ้อน)", "Friction (Stacked Boxes)"), href: "/physics/friction" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
        className="fixed top-3 left-3 z-50 md:hidden bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
      </button>

      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed md:static z-40 w-64 h-full flex flex-col transition-transform md:translate-x-0`}
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--card-border)",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="block px-5 pt-5 pb-4 group"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <div className="flex items-baseline gap-0">
            <span
              className="text-lg leading-none"
              style={{
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              puay teach
            </span>
            <span
              style={{
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                fontStyle: "normal",
                color: "var(--accent)",
                fontSize: "1.125rem",
                lineHeight: 1,
              }}
            >
              .
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {t("เครื่องมือการเรียนรู้", "Learning tool")}
          </p>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {subjects.map((s) => {
            const isActive = pathname.startsWith(s.href);
            const isExpanded = expanded === s.href;

            return (
              <div key={s.href}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : s.href)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: isActive ? "var(--accent)" : "var(--foreground)",
                    background: isActive ? "var(--accent-soft)" : "transparent",
                    fontWeight: isActive ? "600" : "400",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--card-bg)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  <span style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}>
                    {subjectIcons[s.href]}
                  </span>
                  <span className="flex-1 text-left">{s.name}</span>
                  {s.topics.length > 0 && (
                    <span style={{ color: "var(--muted)" }}>
                      {isExpanded
                        ? <ChevronDown size={14} strokeWidth={1.5} />
                        : <ChevronRight size={14} strokeWidth={1.5} />}
                    </span>
                  )}
                </button>

                {s.topics.length > 0 && isExpanded && (
                  <div
                    className="ml-10 pb-1"
                    style={{ borderLeft: "1px solid var(--card-border)" }}
                  >
                    <Link
                      href={s.href}
                      className="block px-4 py-1.5 text-xs transition-colors"
                      style={{
                        color: pathname === s.href ? "var(--accent)" : "var(--muted)",
                        fontWeight: pathname === s.href ? "600" : "400",
                      }}
                    >
                      {t("ภาพรวม", "Overview")}
                    </Link>
                    {s.topics.map((topic) => (
                      <Link
                        key={topic.href}
                        href={topic.href}
                        className="block px-4 py-1.5 text-xs transition-colors"
                        style={{
                          color: pathname === topic.href ? "var(--accent)" : "var(--muted)",
                          fontWeight: pathname === topic.href ? "600" : "400",
                        }}
                      >
                        {topic.name}
                      </Link>
                    ))}
                  </div>
                )}

                {s.topics.length === 0 && (
                  <Link href={s.href} className="sr-only">{s.name}</Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Language toggle */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid var(--card-border)" }}>
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs transition-colors"
            style={{
              border: "1px solid var(--card-border)",
              color: "var(--muted)",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--card-bg)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
            }}
          >
            <Globe size={14} strokeWidth={1.5} />
            <span>{lang === "th" ? "English" : "ภาษาไทย"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
