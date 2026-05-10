@AGENTS.md

# Puay Teach — Project Guide

Interactive educational tool for Thai high-school students covering Math, Biology, Chemistry, and Physics. All pages are **bilingual (Thai/English)** with interactive visualizations.

---

## Tech Stack

- **Next.js 16.2.1** (App Router, Turbopack)
- **React 19.2.4** with TypeScript
- **Tailwind CSS 4** — utility classes only, no component library
- **lucide-react** — Lucide icons at 1.5px stroke (the only allowed icon set)
- **No external charting/UI libraries** — all visualizations use raw SVG or Canvas

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (LangProvider + Sidebar wrapper + Google Fonts)
│   ├── globals.css             ← PuayBigTutor CSS tokens + Tailwind import
│   ├── page.tsx                ← Homepage — aurora hero + subject cards
│   ├── <subject>/
│   │   ├── page.tsx            ← Subject landing page (topic list)
│   │   └── <topic-slug>/
│   │       └── page.tsx        ← Interactive topic page
│   └── ...
└── components/
    ├── Sidebar.tsx             ← Navigation sidebar (subjects + topics)
    └── LangContext.tsx         ← Bilingual context provider (th/en)
```

### Existing Subjects & Routes

| Subject   | Landing       | Topics                                                                     |
|-----------|---------------|----------------------------------------------------------------------------|
| Math      | `/math`       | *(coming soon)*                                                            |
| Biology   | `/biology`    | `/biology/digestive-system`                                                |
| Chemistry | `/chemistry`  | `/chemistry/molecular-shape`, `/chemistry/periodic-table`                  |
| Physics   | `/physics`    | `/physics/relative-motion`, `/physics/1d-motion`, `/physics/projectile`, `/physics/work`, `/physics/energy`, `/physics/friction` |

---

## How to Add a New Topic Page

### Step 1 — Create the page file

```
src/app/<subject>/<topic-slug>/page.tsx
```

Every topic page **must** start with `"use client";` (all visualizations need client-side state).

### Step 2 — Update the subject landing page

Add an entry to the `topics` array in `src/app/<subject>/page.tsx`:

```tsx
{
  name: t("ชื่อภาษาไทย", "English Name"),
  description: t("คำอธิบายไทย", "English description."),
  href: "/<subject>/<topic-slug>",
},
```

Note: no emoji icon — topic cards use text only.

### Step 3 — Update the Sidebar

Add an entry to the matching subject's `topics` array in `src/components/Sidebar.tsx`:

```tsx
{ name: t("ชื่อไทย", "English Name"), href: "/<subject>/<topic-slug>" },
```

### Step 4 — (Only for new subjects) Update the Homepage and Sidebar

If adding an entirely new subject, add a card to `src/app/page.tsx` and a subject entry to `src/components/Sidebar.tsx`. Choose a Lucide icon for the new subject.

---

## Page Template

Every interactive topic page follows this structure:

```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function TopicPage() {
  const { t } = useLang();

  const [param, setParam] = useState(0);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
        <Link href="/<subject>" className="hover:underline">
          {t("วิชาไทย", "Subject")}
        </Link>
        <span>&rsaquo;</span>
        <span>{t("หัวข้อไทย", "Topic Name")}</span>
      </div>

      {/* 2. Title — sentence case, no emoji */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
        {t("หัวข้อไทย", "Topic name")}
      </h1>

      {/* 3. Formula pills (optional) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          F = <span className="font-medium text-[var(--foreground)]">ma</span>
        </span>
      </div>

      {/* 4. Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ป้ายไทย", "Label")}
          </label>
          <input
            type="number" value={param}
            onChange={(e) => setParam(Number(e.target.value))}
            className="w-full border border-[var(--card-border)] rounded-xl px-2 py-1.5 text-sm
                       bg-[var(--background)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* 5. Action buttons — pill shape */}
      <div className="flex gap-2 mb-4">
        <button className="px-5 py-2 rounded-full text-sm font-medium
                           bg-[var(--foreground)] text-[var(--background)]
                           hover:opacity-85 active:scale-[0.98] transition-all">
          {t("▶ เริ่ม", "▶ Start")}
        </button>
        <button className="px-5 py-2 rounded-full text-sm border border-[var(--card-border)]
                           hover:bg-[var(--card-bg)] active:scale-[0.98] transition-all">
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
      </div>

      {/* 6. Visualization (SVG or Canvas) */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 mb-4">
        <svg viewBox="0 0 600 300" className="w-full h-auto">
          {/* ... */}
        </svg>
      </div>

      {/* 7. Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-3">
          <div className="text-[10px] text-[var(--muted)] mb-0.5">{t("ค่า", "Value")}</div>
          <div className="text-lg font-medium">42</div>
          <div className="text-[10px] text-[var(--muted)]">unit</div>
        </div>
      </div>

      {/* 8. Legend (optional) */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]" />
          {t("ป้ายไทย", "Label")}
        </div>
      </div>
    </div>
  );
}
```

---

## Bilingual (i18n) Rules

All user-facing text **must** use the `t()` helper:

```tsx
const { t } = useLang();

// Always: t("ภาษาไทย", "English")
t("ความเร็ว", "Velocity")
```

- First argument = **Thai**, second = **English**
- Never hardcode Thai-only or English-only strings in UI
- Variable names, code comments, and internal logic stay in English

---

## Design System — PuayBigTutor

This project uses the **PuayBigTutor** design system: warm cream surfaces, peach accent, Instrument Serif display type, and Manrope body text. The aesthetic is pastel-futurist — friendly and calm, never childish or corporate.

### Fonts

| Role | Font | CSS var |
|------|------|---------|
| Display / headlines | Instrument Serif, italic flourish | `var(--font-instrument-serif)` |
| Body / UI labels | Manrope | `var(--font-manrope)` |
| Monospace / formulas | JetBrains Mono | `var(--font-jetbrains-mono)` |

Use Instrument Serif italic on the key word in a headline — **max one italic flourish per headline**.

### Styling Rules

#### Always use CSS variables — never hardcode colors

```tsx
// Correct
className="bg-[var(--card-bg)] border border-[var(--card-border)]"
className="text-[var(--muted)]"
className="text-[var(--foreground)]"
className="bg-[var(--background)]"
className="focus:border-[var(--accent)]"

// Wrong — breaks dark mode and brand palette
className="bg-gray-100 border-gray-200"
className="text-gray-500"
```

### Available CSS variables

| Variable | Light | Dark | Use for |
|---|---|---|---|
| `--background` | `#FBF8F2` (cream-50) | `#1E1810` | Page background, inputs |
| `--card-bg` | `#F6F1E7` (cream-100) | `#2A221C` | Cards, panels, sections |
| `--card-border` | `rgba(26,17,5,0.08)` | `rgba(240,220,200,0.10)` | Card/input borders |
| `--foreground` | `#1A1108` (ink-900) | `#F0E8DC` | Primary text |
| `--muted` | `#7D6E5A` | `#A89882` | Secondary text, labels |
| `--accent` | `#E8623A` (peach-500) | `#E8623A` | Links, focus rings, active states |
| `--accent-hover` | `#C84E28` | `#F07855` | Hover state for accent elements |
| `--accent-soft` | `#FDE4D4` (peach-100) | `rgba(232,98,58,0.14)` | Chip backgrounds, icon containers |
| `--accent-deep` | `#9E3318` | `#FDBA9A` | Italic flourish color in headlines |
| `--sage-soft` | `#D4EDDA` | `rgba(34,197,94,0.12)` | Biology accent chips |
| `--sky-soft` | `#DBEAFE` | `rgba(59,130,246,0.12)` | Math accent chips |
| `--lilac-soft` | `#EDE9FE` | `rgba(168,85,247,0.12)` | Chemistry accent chips |
| `--shadow-sm` | warm 1-layer | — | Resting card lift |
| `--shadow-md` | warm 2-layer | — | Hover/lifted card state |

### Fixed accent colors for visualizations

Use Tailwind palette colors directly for SVG/Canvas elements (semantic, not affected by brand palette):

| Color | Hex | Use for |
|---|---|---|
| Blue | `#3b82f6` | Primary/default, PE energy |
| Green | `#22c55e` | Positive values, success |
| Red | `#ef4444` | Applied force, negative values |
| Orange | `#f59e0b` | Friction, KE energy |
| Purple | `#a855f7` | Weight, lone pairs |
| Light green | `#4ade80` | Bonded atoms, positive work |

### Common UI patterns

```
Cards:         bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4
               style={{ boxShadow: "var(--shadow-sm)" }}
Inputs:        border border-[var(--card-border)] rounded-xl px-2 py-1.5 text-sm
               bg-[var(--background)] outline-none focus:border-[var(--accent)]
Primary btn:   rounded-full px-5 py-2 bg-[var(--foreground)] text-[var(--background)] hover:opacity-85
Secondary btn: rounded-full px-5 py-2 border border-[var(--card-border)] hover:bg-[var(--card-bg)]
Icon chip:     rounded-full w-10 h-10 flex items-center justify-center
               style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
Muted text:    text-[var(--muted)]
Small label:   text-xs text-[var(--muted)]
Tiny label:    text-[10px] text-[var(--muted)]
Hover lift:    onMouseEnter → boxShadow: var(--shadow-md), transform: translateY(-1px)
Active press:  active:scale-[0.98]
Page padding:  p-4 sm:p-8 max-w-4xl mx-auto
Responsive:    grid grid-cols-1 sm:grid-cols-3 gap-3
```

### Brand rules

- **No emoji anywhere.** Use Lucide icons (1.5px stroke) for glyphs. Subject chips use `Calculator`, `Leaf`, `FlaskConical`, `Atom`.
- **No pure white.** Cream-50 (`#FBF8F2`) is the lightest surface.
- **Sentence case everywhere** — buttons, headings, labels, nav items.
- **Pill buttons only.** Use `rounded-full`, not `rounded-lg`.
- **Cards use `rounded-2xl`** (16px). No sharp corners ever.
- **One italic flourish per headline max.** Set in Instrument Serif italic, colored `var(--accent-deep)`.
- **Motion:** 260ms, `cubic-bezier(0.22, 1, 0.36, 1)`. No bounce, no scale > 1.02.

---

## Visualization Guidelines

### SVG (preferred for static/interactive diagrams)

- Use `viewBox` for responsive scaling: `<svg viewBox="0 0 600 300" className="w-full h-auto">`
- Wrap in a card container: `bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4`
- For draggable/interactive SVG: add `touch-none cursor-grab active:cursor-grabbing` classes
- Use `var(--foreground)` and `var(--muted)` for SVG strokes/text to respect dark mode

### Canvas (preferred for real-time animations with many frames)

- Use `requestAnimationFrame` for smooth animation loops
- Track animation state with `useRef` (not `useState`) to avoid excessive re-renders
- Sync React display state at ~20fps via `setState` calls inside the animation loop
- Use `useCallback` for animation tick functions
- Check `window.matchMedia("(prefers-color-scheme: dark)")` for canvas dark mode colors

### Animation pattern (play/pause/reset)

```tsx
const playingRef = useRef(false);
const animRef = useRef(0);
const lastTsRef = useRef<number | null>(null);

const tick = useCallback((ts: number) => {
  if (!playingRef.current) return;
  if (lastTsRef.current === null) lastTsRef.current = ts;
  const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
  lastTsRef.current = ts;
  // ... update physics ...
  animRef.current = requestAnimationFrame(tick);
}, []);

const togglePlay = () => { /* flip playingRef, setPlaying, start/cancel RAF */ };
const reset = () => { /* cancel RAF, reset all refs and state */ };

useEffect(() => { reset(); }, [param1, param2, reset]);
```

---

## Do NOT

- Install external charting libraries (recharts, chart.js, d3, three.js, etc.)
- Use emoji anywhere in UI — use Lucide icons instead
- Use `<Image>` from next/image for SVG visualizations — use inline `<svg>` or `<canvas>`
- Hardcode Thai-only strings in UI — always use `t(thai, english)`
- Hardcode colors — always use CSS variables for background/text/borders
- Use pure white (`#ffffff`) — `var(--background)` is cream-50, the lightest surface
- Use square/sharp corners for cards or buttons — always `rounded-2xl` or `rounded-full`
- Create separate CSS/SCSS files — use Tailwind utility classes only
- Add server components for interactive pages — all topic pages need `"use client"`
- Forget to update **both** the subject landing page and the Sidebar when adding a topic

---

## Checklist for New Pages

- [ ] File created at `src/app/<subject>/<topic-slug>/page.tsx`
- [ ] Starts with `"use client";`
- [ ] Uses `useLang()` and `t()` for all user-facing text
- [ ] Has breadcrumb navigation back to subject
- [ ] Has a clear `<h1>` in sentence case — no emoji in headings
- [ ] Controls use card containers with `rounded-2xl` and `var(--card-border)`
- [ ] Buttons are `rounded-full` (pill shape)
- [ ] Visualization uses SVG or Canvas (no external libraries)
- [ ] All colors use CSS variables (dark-mode safe)
- [ ] Responsive grid layout (`grid-cols-1 sm:grid-cols-N`)
- [ ] Subject landing page updated with new topic entry
- [ ] Sidebar updated with new topic link
