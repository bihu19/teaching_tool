"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { ExternalLink, Info } from "lucide-react";
import SubjectTopics from "../SubjectTopics";
import { countTopics, POSN_EXAM_URL, ROUND_2_SUBJECTS, SUPPORTING_SKILLS } from "../data";

export default function IjsoRound2Page() {
  const { t } = useLang();

  const totalGroups = ROUND_2_SUBJECTS.reduce((sum, s) => sum + s.groups.length, 0);
  const totalTopics = ROUND_2_SUBJECTS.reduce((sum, s) => sum + countTopics(s), 0);

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--muted)" }}>
        <Link href="/ijso" className="hover:underline">
          IJSO
        </Link>
        <span>&rsaquo;</span>
        <span>{t("รอบคัดเลือกที่ 2", "Selection round 2")}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
        {t("รอบคัดเลือกที่ 2", "Selection round 2")}
      </h1>
      <p className="text-sm leading-relaxed mb-5 max-w-xl" style={{ color: "var(--muted)" }}>
        {t(
          "รอบสองสอบเดือนมีนาคม ตัดคณิตศาสตร์ออก เหลือ 3 วิชาวิทยาศาสตร์ แต่เป็นข้อสอบอัตนัยที่ต้องเขียนแสดงวิธีทำ ขอบเขตลึกขึ้นและเข้าใกล้หลักสูตรสากลของ IJSO",
          "Round 2 runs in March. Mathematics drops out, leaving the three sciences, but answers now need full written working. The scope goes deeper and moves close to the international IJSO syllabus."
        )}
      </p>

      {/* Format pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {[
          t("มีนาคม", "March"),
          t("อัตนัย เขียนแสดงวิธีทำ", "Free response with working"),
          t("3 วิชา", "3 subjects"),
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
      <div className="grid grid-cols-3 gap-2 mb-8">
        {ROUND_2_SUBJECTS.map((s) => (
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
          `รวม ${totalGroups} กลุ่มเนื้อหา ${totalTopics} หัวข้อย่อย เนื้อหาหลักเหมือนรอบ 1 แต่ข้อสอบถามลึกกว่าและต้องแสดงวิธีทำ`,
          `${totalGroups} topic groups and ${totalTopics} subtopics. The syllabus mirrors round 1, but the questions probe deeper and demand full working.`
        )}
      </p>

      {/* Subjects */}
      {ROUND_2_SUBJECTS.map((s) => (
        <SubjectTopics key={s.key} subject={s} />
      ))}

      {/* Supporting skills */}
      <div className="h-px mb-8" style={{ background: "var(--card-border-strong)" }} />
      <SubjectTopics subject={SUPPORTING_SKILLS} />

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
            {t("ฝึกเขียนแสดงวิธีทำจากข้อสอบจริง", "Practise full working on the real papers")}
          </h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {t(
              "ดาวน์โหลดข้อสอบรอบ 2 ย้อนหลังจากคลังข้อสอบของ สอวน. แล้วฝึกเขียนคำตอบให้ครบขั้นตอน",
              "Download past round 2 papers from the POSN archive and practise writing answers out in full."
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
            "ผู้ผ่านรอบ 2 จะเข้าค่ายอบรมเข้มช่วงเมษายนถึงพฤษภาคม ซึ่งเก็บทั้งภาคทฤษฎีและปฏิบัติการ ทักษะปฏิบัติการด้านบนจึงควรฝึกไว้ตั้งแต่ตอนนี้",
            "Whoever clears round 2 moves on to the April to May intensive camp, which tests theory and laboratory practical alike. The lab skills above are worth building now."
          )}
        </span>
      </div>

      {/* Back */}
      <Link
        href="/ijso/round-1"
        className="inline-block px-5 py-2 rounded-full text-sm transition-all active:scale-[0.98]"
        style={{ border: "1px solid var(--card-border)", color: "var(--foreground)" }}
      >
        {t("กลับไปดูเนื้อหารอบ 1", "Back to round 1 content")}
      </Link>
    </div>
  );
}
