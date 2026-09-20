"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { useLang } from "@/components/LangContext";
import { countTopics, type Subject } from "./data";

/**
 * One subject block: header chip, blurb, optional caveat, then a stack of
 * collapsible topic groups. Used by both round pages.
 */
export default function SubjectTopics({ subject }: { subject: Subject }) {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mb-8" id={subject.key}>
      {/* Subject header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex items-center justify-center rounded-full w-10 h-10 text-sm font-semibold"
          style={{ background: `var(${subject.softVar})`, color: subject.chipText }}
        >
          {subject.groups.length}
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            {t(subject.name[0], subject.name[1])}
          </h2>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {t(
              `${subject.groups.length} กลุ่มเนื้อหา · ${countTopics(subject)} หัวข้อย่อย`,
              `${subject.groups.length} topic groups · ${countTopics(subject)} subtopics`
            )}
          </p>
        </div>
      </div>

      <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
        {t(subject.blurb[0], subject.blurb[1])}
      </p>

      {/* Caveat strip — only where the scope is indicative rather than published */}
      {subject.note && (
        <div
          className="flex items-start gap-2 rounded-2xl p-3 mb-3 text-xs leading-relaxed"
          style={{
            background: "var(--butter-soft)",
            border: "1px solid var(--card-border)",
            color: "var(--muted)",
          }}
        >
          <span className="shrink-0 mt-0.5" style={{ color: "var(--foreground)" }}>
            <Info size={14} strokeWidth={1.5} />
          </span>
          <span>{t(subject.note[0], subject.note[1])}</span>
        </div>
      )}

      {/* Topic groups */}
      <div className="grid gap-2">
        {subject.groups.map((group, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={group.title[1]}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderLeft: `3px solid ${subject.accent}`,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              >
                <span
                  className="inline-flex items-center justify-center rounded-full w-6 h-6 text-[11px] font-medium shrink-0"
                  style={{ background: `var(${subject.softVar})`, color: subject.chipText }}
                >
                  {i + 1}
                </span>
                <span
                  className="flex-1 text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {t(group.title[0], group.title[1])}
                </span>
                <span
                  className="text-[11px] font-mono shrink-0"
                  style={{ color: "var(--muted)" }}
                >
                  {group.items.length}
                </span>
                <span
                  className="shrink-0 transition-transform"
                  style={{
                    color: "var(--muted)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transitionDuration: "var(--duration)",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  <ChevronDown size={14} strokeWidth={1.5} />
                </span>
              </button>

              {isOpen && (
                <div className="flex flex-wrap gap-2 px-4 pb-4 pl-[3.25rem]">
                  {group.items.map((item) => (
                    <span
                      key={item[1]}
                      className="rounded-full px-3 py-1.5 text-xs leading-snug"
                      style={{
                        background: "var(--background)",
                        border: "1px solid var(--card-border)",
                        color: "var(--foreground)",
                      }}
                    >
                      {t(item[0], item[1])}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
