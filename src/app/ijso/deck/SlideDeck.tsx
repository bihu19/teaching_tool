"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { useLang } from "@/components/LangContext";

export type Slide = { title: string; body: ReactNode; notes?: string };

/**
 * Slide deck shell shared by the IJSO lessons: breadcrumb, jump menu,
 * teacher notes, arrow-key and URL-hash navigation, and the progress footer.
 */
export default function SlideDeck({
  crumb,
  heading,
  slides,
}: {
  crumb: string;
  heading: string;
  slides: Slide[];
}) {
  const { t } = useLang();
  const [page, setPage] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const count = slides.length;

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(count - 1, i));
      setPage(next);
      window.history.replaceState(null, "", `#${next + 1}`);
    },
    [count]
  );

  // Open on the slide in the URL hash, e.g. #12
  useEffect(() => {
    const fromHash = () => {
      const n = Number(window.location.hash.slice(1));
      if (n >= 1 && n <= count) setPage(n - 1);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (/INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY/.test(tag)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(page + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(page - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(count - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, count, go]);

  const slide = slides[page];

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--muted)" }}>
        <Link href="/ijso" className="hover:underline">
          IJSO
        </Link>
        <span>&rsaquo;</span>
        <span>{crumb}</span>
      </div>

      {/* Title + deck tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          {heading}
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={page}
            onChange={(e) => go(Number(e.target.value))}
            aria-label={t("เลือกสไลด์", "Jump to slide")}
            className="max-w-[60vw] sm:max-w-xs border border-[var(--card-border)] rounded-full px-3 py-1.5 text-sm bg-[var(--background)] outline-none focus:border-[var(--accent)]"
          >
            {slides.map((s, i) => (
              <option key={i} value={i}>
                {i + 1}. {s.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowNotes((v) => !v)}
            aria-pressed={showNotes}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--card-border)] transition-all active:scale-[0.98] ${
              showNotes ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "hover:bg-[var(--card-bg)]"
            }`}
          >
            <NotebookPen size={14} strokeWidth={1.5} />
            {t("บันทึกครู", "Teacher notes")}
          </button>
        </div>
      </div>

      {/* Slide */}
      <section
        key={page}
        className="rounded-2xl p-5 sm:p-8 min-h-[480px]"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", boxShadow: "var(--shadow-sm)" }}
      >
        {slide.body}
        {showNotes && slide.notes && (
          <aside
            className="mt-6 rounded-2xl p-4 text-sm leading-relaxed"
            style={{ background: "var(--butter-soft)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
          >
            <span className="font-medium">{t("บันทึกครู: ", "Teacher note: ")}</span>
            {slide.notes}
          </aside>
        )}
      </section>

      {/* Footer nav */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-[var(--card-border)] hover:bg-[var(--card-bg)] active:scale-[0.98] transition-all disabled:opacity-35 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          {t("ก่อนหน้า", "Previous")}
        </button>
        <span className="text-xs font-mono whitespace-nowrap" style={{ color: "var(--muted)" }} aria-live="polite">
          {page + 1} / {count}
        </span>
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--card-border-strong)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${((page + 1) / count) * 100}%`,
              background: "var(--accent)",
              transition: "width var(--duration) var(--ease-out)",
            }}
          />
        </div>
        <button
          onClick={() => go(page + 1)}
          disabled={page === count - 1}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-85 active:scale-[0.98] transition-all disabled:opacity-35 disabled:pointer-events-none"
        >
          {t("ถัดไป", "Next")}
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
