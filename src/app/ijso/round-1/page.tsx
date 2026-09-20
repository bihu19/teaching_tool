"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { ExternalLink, Info } from "lucide-react";
import SubjectTopics from "../SubjectTopics";
import { countTopics, POSN_EXAM_URL, ROUND_1_SUBJECTS } from "../data";

export default function IjsoRound1Page() {
  const { t } = useLang();

  const totalGroups = ROUND_1_SUBJECTS.reduce((sum, s) => sum + s.groups.length, 0);
  const totalTopics = ROUND_1_SUBJECTS.reduce((sum, s) => sum + countTopics(s), 0);

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--muted)" }}>
        <Link href="/ijso" className="hover:underline">
          IJSO
        </Link>
        <span>&rsaquo;</span>
        <span>{t("รอบคัดเลือกที่ 1", "Selection round 1")}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
        {t("รอบคัดเลือกที่ 1", "Selection round 1")}
      </h1>
      <p className="text-sm leading-relaxed mb-5 max-w-xl" style={{ color: "var(--muted)" }}>
        {t(
          "รอบแรกสอบเดือนมกราคม เป็นข้อสอบปรนัย 4 วิชา เน้นความกว้างและความรู้พื้นฐานระดับมัธยมต้น เป็นรอบเดียวที่มีคณิตศาสตร์ ด้านล่างคือกลุ่มเนื้อหาของแต่ละวิชาโดยละเอียด",
          "Round 1 runs in January as a multiple-choice paper across four subjects. It rewards breadth and solid lower-secondary fundamentals, and it is the only round that includes mathematics. Every topic group is listed below, subject by subject."
        )}
      </p>

      {/* Format pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {[
          t("มกราคม", "January"),
          t("ปรนัย", "Multiple choice"),
          t("4 วิชา", "4 subjects"),
          t("ประมาณ 90 นาทีต่อวิชา", "About 90 min per subject"),
        ].map((pill) => (
          <span
            key={pill}
            className="rounded-full px-3 py-1 text-xs font-mono"
            style={{ background: "var(--card-bg)", color: "var(--muted)", border: "1px solid var(--card-border)" }}
          >
            {pill}
          </span>
        ))}
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {ROUND_1_SUBJECTS.map((s) => (
          <a
            key={s.key}
            href={`#${s.key}`}
            className="rounded-2xl p-3 block transition-all"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="text-[10px] mb-0.5" style={{ color: "var(--muted)" }}>
              {t(s.name[0], s.name[1])}
            </div>
            <div className="text-lg font-medium" style={{ color: s.chipText }}>
              {s.groups.length}
            </div>
            <div className="text-[10px]" style={{ color: "var(--muted)" }}>
              {t("กลุ่มเนื้อหา", "topic groups")}
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs mb-8" style={{ color: "var(--muted)" }}>
        {t(
          `รวมทั้งหมด ${totalGroups} กลุ่มเนื้อหา ${totalTopics} หัวข้อย่อย กดที่แต่ละกลุ่มเพื่อดูหัวข้อย่อย`,
          `${totalGroups} topic groups and ${totalTopics} subtopics in total. Tap any group to see what sits inside it.`
        )}
      </p>

      {/* Subjects */}
      {ROUND_1_SUBJECTS.map((s) => (
        <SubjectTopics key={s.key} subject={s} />
      ))}

      {/* Past papers */}
      <a
        href={POSN_EXAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start justify-between gap-4 rounded-2xl p-5 mb-4 transition-all"
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
          <h3
            className="text-base font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            {t("ฝึกจากข้อสอบจริง", "Practise on the real papers")}
          </h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {t(
              "ดาวน์โหลดข้อสอบรอบ 1 ย้อนหลังจากคลังข้อสอบของ สอวน. แล้วจับเวลาทำจริงทีละวิชา",
              "Download past round 1 papers from the POSN archive and sit them under time, one subject at a time."
            )}
          </p>
        </div>
        <span className="shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
          <ExternalLink size={16} strokeWidth={1.5} />
        </span>
      </a>

      {/* Caveat */}
      <div
        className="flex items-start gap-2 rounded-2xl p-4 mb-6 text-xs leading-relaxed"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
      >
        <span className="shrink-0 mt-0.5" style={{ color: "var(--foreground)" }}>
          <Info size={14} strokeWidth={1.5} />
        </span>
        <span>
          {t(
            "ขอบเขตเนื้อหาอ้างอิงจากหลักสูตรสากลของ IJSO และประกาศของ สอวน. น้ำหนักของแต่ละหัวข้อในข้อสอบจริงอาจต่างกันไปในแต่ละปี",
            "The scope here follows the international IJSO syllabus and POSN announcements. How heavily each topic is weighted varies from year to year."
          )}
        </span>
      </div>

      {/* Next */}
      <Link
        href="/ijso/round-2"
        className="inline-block px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-[0.98]"
        style={{ background: "var(--foreground)", color: "var(--background)" }}
      >
        {t("ดูเนื้อหารอบ 2", "See round 2 content")}
      </Link>
    </div>
  );
}
