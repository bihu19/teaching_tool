"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { Trophy, ArrowUpRight, ExternalLink, Info } from "lucide-react";
import { POSN_EXAM_URL, ROUND_1_SUBJECTS, ROUND_2_SUBJECTS } from "./data";

export default function IjsoPage() {
  const { lang, t } = useLang();

  const facts = [
    {
      k: t("วิชาที่แข่งขัน", "Subjects contested"),
      v: t(
        "ทดสอบวิทยาศาสตร์พื้นฐาน 3 สาขา คือ ฟิสิกส์ เคมี และชีววิทยา ไม่มีวิชาโลกและอวกาศแยกต่างหาก",
        "Three core sciences only: physics, chemistry and biology. There is no separate earth and space science paper."
      ),
    },
    {
      k: t("ผู้ดูแลการคัดเลือกในไทย", "Who runs the Thai selection"),
      v: t(
        "มูลนิธิส่งเสริมโอลิมปิกวิชาการและพัฒนามาตรฐานวิทยาศาสตร์ศึกษา (สอวน.) ร่วมกับ สสวท.",
        "The Promotion of Academic Olympiad and Development of Science Education Foundation (POSN), together with IPST."
      ),
    },
    {
      k: t("คุณสมบัติผู้สมัคร", "Who can enter"),
      v: t(
        "กำลังศึกษาระดับมัธยมศึกษาตอนต้น และอายุไม่เกิน 15 ปี",
        "Currently enrolled in lower secondary school, aged no more than 15."
      ),
    },
    {
      k: t("เส้นทางลัดเข้ารอบ 2", "Fast track into round 2"),
      v: t(
        "นักเรียนโครงการพัฒนาอัจฉริยภาพทางวิทยาศาสตร์และคณิตศาสตร์ของ สสวท. และนักเรียนที่เคยเป็นผู้แทนแข่งขัน IMSO ระดับประถม",
        "Students in IPST's Science and Mathematics Talent Development Program, and students who previously represented Thailand at IMSO."
      ),
    },
  ];

  const timeline = [
    {
      when: t("มกราคม", "January"),
      title: t("รอบคัดเลือกที่ 1", "Selection round 1"),
      desc: t("สอบข้อเขียนแบบปรนัย 4 วิชา", "Multiple-choice written exam, four subjects."),
      subjects: t(
        "คณิตศาสตร์ · ฟิสิกส์ · เคมี · ชีววิทยา",
        "Mathematics · Physics · Chemistry · Biology"
      ),
      href: "/ijso/round-1",
    },
    {
      when: t("มีนาคม", "March"),
      title: t("รอบคัดเลือกที่ 2", "Selection round 2"),
      desc: t("สอบข้อเขียนแบบอัตนัย เขียนแสดงวิธีทำ 3 วิชา", "Free-response written exam with full working, three subjects."),
      subjects: t("ฟิสิกส์ · เคมี · ชีววิทยา", "Physics · Chemistry · Biology"),
      href: "/ijso/round-2",
    },
    {
      when: t("เมษายน ถึง พฤษภาคม", "April to May"),
      title: t("ค่ายอบรมเข้ม", "Intensive training camp"),
      desc: t(
        "อบรมและสอบคัดเลือกภายในค่าย ทั้งภาคทฤษฎีและปฏิบัติการ",
        "Residential training with internal testing, both theory and laboratory practical."
      ),
      subjects: t("ฟิสิกส์ · เคมี · ชีววิทยา · ปฏิบัติการ", "Physics · Chemistry · Biology · Lab practical"),
      href: null,
    },
    {
      when: t("ปลายปี", "Later in the year"),
      title: t("แข่งขันระดับนานาชาติ", "International competition"),
      desc: t(
        "ผู้แทนประเทศไทยลงแข่งขัน IJSO ในสนามนานาชาติ",
        "The Thai team competes at the international IJSO event."
      ),
      subjects: t("ทฤษฎี · ปรนัย · ปฏิบัติการ", "Theory · Multiple choice · Lab practical"),
      href: null,
    },
  ];

  const roundCards = [
    {
      href: "/ijso/round-1",
      label: t("รอบ 1", "Round 1"),
      title: t("รอบคัดเลือกที่ 1", "Selection round 1"),
      desc: t(
        "เนื้อหากว้าง ครอบคลุม 4 วิชา เน้นพื้นฐานระดับมัธยมต้น ดูกลุ่มเนื้อหาของแต่ละวิชาแบบละเอียด",
        "Broad and four subjects wide, built on lower-secondary fundamentals. Browse every topic group, subject by subject."
      ),
      subjects: ROUND_1_SUBJECTS,
      format: t("ปรนัย · ประมาณ 90 นาทีต่อวิชา", "Multiple choice · about 90 minutes per subject"),
    },
    {
      href: "/ijso/round-2",
      label: t("รอบ 2", "Round 2"),
      title: t("รอบคัดเลือกที่ 2", "Selection round 2"),
      desc: t(
        "เจาะลึก 3 วิชาวิทยาศาสตร์ ขอบเขตเข้าใกล้เนื้อหาสากลของ IJSO และต้องเขียนแสดงวิธีทำ",
        "Deeper on the three sciences, close to the international IJSO syllabus, and every answer needs full working."
      ),
      subjects: ROUND_2_SUBJECTS,
      format: t("อัตนัย · ประมาณ 90 นาทีต่อวิชา", "Free response · about 90 minutes per subject"),
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex items-center justify-center rounded-full w-10 h-10"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Trophy size={20} strokeWidth={1.5} />
        </div>
        <h1
          className="text-3xl"
          style={{
            fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
          }}
        >
          {lang === "th" ? (
            <>
              เส้นทางสู่ <em style={{ color: "var(--accent-deep)", fontStyle: "italic" }}>IJSO</em>
            </>
          ) : (
            <>
              the road to <em style={{ color: "var(--accent-deep)", fontStyle: "italic" }}>IJSO</em>
            </>
          )}
        </h1>
      </div>
      <p className="text-sm leading-relaxed mb-8 max-w-xl" style={{ color: "var(--muted)" }}>
        {t(
          "การแข่งขันวิทยาศาสตร์โอลิมปิกระหว่างประเทศ ระดับมัธยมศึกษาตอนต้น จัดครั้งแรกเมื่อปี 2547 ที่ประเทศอินโดนีเซีย และไทยเข้าร่วมมาตั้งแต่ครั้งแรก หน้านี้สรุปขั้นตอนการคัดเลือกและขอบเขตเนื้อหาที่ต้องเตรียม",
          "The International Junior Science Olympiad is the lower-secondary science olympiad, first held in 2004 in Indonesia, with Thailand competing since the first edition. This page maps the selection pathway and the content you need to prepare."
        )}
      </p>

      {/* What IJSO is */}
      <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {t("ทำความรู้จัก", "The basics")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {facts.map((f) => (
          <div
            key={f.k}
            className="rounded-2xl p-4"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="text-[10px] uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
              {f.k}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {f.v}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {t("ไทม์ไลน์การคัดเลือก", "Selection timeline")}
      </h2>
      <div className="mb-10">
        {timeline.map((step, i) => {
          const isLast = i === timeline.length - 1;
          const body = (
            <div
              className="rounded-2xl p-4 transition-all"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "var(--shadow-sm)",
                transitionDuration: "var(--duration)",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono mb-1" style={{ color: "var(--accent)" }}>
                    {step.when}
                  </div>
                  <h3 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
                    {step.desc}
                  </p>
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[11px] font-mono"
                    style={{ background: "var(--background)", color: "var(--muted)", border: "1px solid var(--card-border)" }}
                  >
                    {step.subjects}
                  </span>
                </div>
                {step.href && (
                  <span className="shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </span>
                )}
              </div>
            </div>
          );

          return (
            <div key={step.title} className="flex gap-4">
              {/* Rail */}
              <div className="flex flex-col items-center shrink-0 pt-4">
                <span
                  className="inline-flex items-center justify-center rounded-full w-7 h-7 text-xs font-mono font-medium"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {i + 1}
                </span>
                {!isLast && (
                  <span className="flex-1 w-px my-1" style={{ background: "var(--card-border-strong)" }} />
                )}
              </div>

              <div className={isLast ? "flex-1 pt-3" : "flex-1 pt-3 pb-3"}>
                {step.href ? (
                  <Link href={step.href} className="block group">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Round detail cards */}
      <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {t("เจาะเนื้อหาแต่ละรอบ", "Content by round")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {roundCards.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group rounded-2xl p-5 transition-all"
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
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-medium mb-3"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {r.label}
            </span>
            <h3
              className="text-base font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors"
              style={{ color: "var(--foreground)" }}
            >
              {r.title}
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
              {r.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {r.subjects.map((s) => (
                <span
                  key={s.key}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{ background: `var(${s.softVar})`, color: s.chipText }}
                >
                  {t(s.name[0], s.name[1])}
                </span>
              ))}
            </div>

            <p className="text-[11px] font-mono" style={{ color: "var(--muted)" }}>
              {r.format}
            </p>
          </Link>
        ))}
      </div>

      {/* Past papers */}
      <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
        {t("ข้อสอบเก่า", "Past papers")}
      </h2>
      <a
        href={POSN_EXAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start justify-between gap-4 rounded-2xl p-5 mb-6 transition-all"
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
            {t("คลังข้อสอบ IJSO ของ สอวน.", "The POSN IJSO exam archive")}
          </h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {t(
              "ดาวน์โหลดข้อสอบจริงของรอบ 1 และรอบ 2 ย้อนหลัง จากเว็บไซต์ สอวน. เพื่อดูแนวโจทย์และระดับความยากจริง",
              "Download the real round 1 and round 2 papers from previous years on the POSN site to see the true question style and difficulty."
            )}
          </p>
        </div>
        <span className="shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
          <ExternalLink size={16} strokeWidth={1.5} />
        </span>
      </a>

      {/* Caveat */}
      <div
        className="flex items-start gap-2 rounded-2xl p-4 text-xs leading-relaxed"
        style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--muted)" }}
      >
        <span className="shrink-0 mt-0.5" style={{ color: "var(--foreground)" }}>
          <Info size={14} strokeWidth={1.5} />
        </span>
        <span>
          {t(
            "ช่วงเวลาสอบ เวลาทำข้อสอบ และรายละเอียดรูปแบบอาจปรับเปลี่ยนในแต่ละปี ควรตรวจสอบประกาศฉบับล่าสุดจาก สอวน. ก่อนสมัครสอบจริงเสมอ",
            "Exam months, durations and format details shift a little from year to year. Always check the latest POSN announcement before you register."
          )}
        </span>
      </div>
    </div>
  );
}
