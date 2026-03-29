@AGENTS.md

# Puay Teach — Project Guide

Interactive educational tool for Thai high-school students covering Math, Biology, Chemistry, and Physics. All pages are **bilingual (Thai/English)** with interactive visualizations.

---

## Tech Stack

- **Next.js 16.2.1** (App Router, Turbopack)
- **React 19.2.4** with TypeScript
- **Tailwind CSS 4** — utility classes only, no component library
- **No external UI/chart libraries** — all visualizations use raw SVG or Canvas

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (LangProvider + Sidebar wrapper)
│   ├── globals.css             ← CSS variables (light/dark) + Tailwind import
│   ├── page.tsx                ← Homepage — subject cards grid
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
| Chemistry | `/chemistry`  | `/chemistry/molecular-shape`                                               |
| Physics   | `/physics`    | `/physics/relative-motion`, `/physics/1d-motion`, `/physics/projectile`, `/physics/work`, `/physics/energy` |

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
  description: t("คำอธิบายไทย", "English description"),
  href: "/<subject>/<topic-slug>",
  icon: "🔬",  // emoji icon
},
```

### Step 3 — Update the Sidebar

Add an entry to the matching subject's `topics` array in `src/components/Sidebar.tsx`:

```tsx
{ name: t("ชื่อไทย", "English Name"), href: "/<subject>/<topic-slug>" },
```

### Step 4 — (Only for new subjects) Update the Homepage

If adding an entirely new subject, also add a card to `src/app/page.tsx`.

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

  // --- State ---
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

      {/* 2. Title */}
      <h1 className="text-2xl font-bold mb-6">
        🔬 {t("หัวข้อไทย", "Topic Name")}
      </h1>

      {/* 3. Formula pills (optional) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <span className="bg-[var(--card-bg)] rounded-full px-3 py-1 text-xs font-mono text-[var(--muted)]">
          F = <span className="font-medium text-[var(--foreground)]">ma</span>
        </span>
      </div>

      {/* 4. Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
          <label className="text-xs text-[var(--muted)] block mb-1">
            {t("ป้ายไทย", "Label")}
          </label>
          <input
            type="number" value={param}
            onChange={(e) => setParam(Number(e.target.value))}
            className="w-full border border-[var(--card-border)] rounded-lg px-2 py-1.5 text-sm
                       bg-[var(--background)] outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* 5. Action buttons (optional — for animations) */}
      <div className="flex gap-2 mb-4">
        <button className="px-5 py-2 rounded-lg text-sm font-medium
                           bg-[var(--foreground)] text-[var(--background)]
                           hover:opacity-85 active:scale-[0.98]">
          {t("▶ เริ่ม", "▶ Start")}
        </button>
        <button className="px-5 py-2 rounded-lg text-sm border border-[var(--card-border)]
                           hover:bg-[var(--card-bg)] active:scale-[0.98]">
          {t("↺ รีเซ็ต", "↺ Reset")}
        </button>
      </div>

      {/* 6. Visualization (SVG or Canvas) */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 mb-4">
        <svg viewBox="0 0 600 300" className="w-full h-auto">
          {/* ... */}
        </svg>
      </div>

      {/* 7. Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3">
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

## Styling Rules

### Always use CSS variables — never hardcode colors

```tsx
// ✅ Correct
className="bg-[var(--card-bg)] border border-[var(--card-border)]"
className="text-[var(--muted)]"
className="text-[var(--foreground)]"
className="bg-[var(--background)]"
className="focus:border-[var(--accent)]"

// ❌ Wrong — breaks dark mode
className="bg-gray-100 border-gray-200"
className="text-gray-500"
```

### Available CSS variables

| Variable          | Light       | Dark        | Use for                     |
|-------------------|-------------|-------------|-----------------------------|
| `--background`    | `#ffffff`   | `#0a0a0a`   | Page background, inputs     |
| `--foreground`    | `#171717`   | `#ededed`   | Primary text, borders       |
| `--card-bg`       | `#f5f5f5`   | `#1a1a1a`   | Cards, panels, sections     |
| `--card-border`   | `#e5e5e5`   | `#2a2a2a`   | Card/input borders          |
| `--accent`        | `#3b82f6`   | `#3b82f6`   | Links, focus rings, active  |
| `--accent-hover`  | `#2563eb`   | `#2563eb`   | Hover state for accent      |
| `--muted`         | `#737373`   | `#a3a3a3`   | Secondary text, labels      |

### Fixed accent colors for visualizations

Use Tailwind palette colors directly for SVG/Canvas elements (these are semantic and don't change with dark mode):

| Color     | Hex       | Use for                          |
|-----------|-----------|----------------------------------|
| Blue      | `#3b82f6` | Primary/default, PE energy       |
| Green     | `#22c55e` | Positive values, success states  |
| Red       | `#ef4444` | Applied force, negative values   |
| Orange    | `#f59e0b` | Friction, KE energy, warnings   |
| Purple    | `#a855f7` | Weight, lone pairs, secondary   |
| Light green | `#4ade80` | Bonded atoms, positive work    |

### Common UI patterns

```
Cards:         bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3
Inputs:        border border-[var(--card-border)] rounded-lg px-2 py-1.5 text-sm
               bg-[var(--background)] outline-none focus:border-[var(--accent)]
Primary btn:   bg-[var(--foreground)] text-[var(--background)] hover:opacity-85
Secondary btn: border border-[var(--card-border)] hover:bg-[var(--card-bg)]
Muted text:    text-[var(--muted)]
Small label:   text-xs text-[var(--muted)]
Tiny label:    text-[10px] text-[var(--muted)]
Hover scale:   hover:scale-[1.01] transition-all
Active press:  active:scale-[0.98]
Page padding:  p-4 sm:p-8 max-w-4xl mx-auto
Responsive:    grid grid-cols-1 sm:grid-cols-3 gap-3
```

---

## Visualization Guidelines

### SVG (preferred for static/interactive diagrams)

- Use `viewBox` for responsive scaling: `<svg viewBox="0 0 600 300" className="w-full h-auto">`
- Wrap in a card container: `bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4`
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
  const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05); // cap delta
  lastTsRef.current = ts;
  // ... update physics ...
  animRef.current = requestAnimationFrame(tick);
}, []);

const togglePlay = () => { /* flip playingRef, setPlaying, start/cancel RAF */ };
const reset = () => { /* cancel RAF, reset all refs and state */ };

// Reset when params change
useEffect(() => { reset(); }, [param1, param2, reset]);
```

---

## Do NOT

- Install external charting libraries (recharts, chart.js, d3, three.js, etc.)
- Use `<Image>` from next/image for SVG visualizations — use inline `<svg>` or `<canvas>`
- Hardcode Thai-only strings in UI — always use `t(thai, english)`
- Hardcode light-mode colors — always use CSS variables for background/text/borders
- Create separate CSS/SCSS files — use Tailwind utility classes only
- Add server components for interactive pages — all topic pages need `"use client"`
- Forget to update **both** the subject landing page and the Sidebar when adding a topic

---

## Checklist for New Pages

- [ ] File created at `src/app/<subject>/<topic-slug>/page.tsx`
- [ ] Starts with `"use client";`
- [ ] Uses `useLang()` and `t()` for all user-facing text
- [ ] Has breadcrumb navigation back to subject
- [ ] Has a clear `<h1>` title with emoji
- [ ] Controls use card containers with proper styling
- [ ] Visualization uses SVG or Canvas (no external libraries)
- [ ] All colors use CSS variables (dark-mode safe)
- [ ] Responsive grid layout (`grid-cols-1 sm:grid-cols-N`)
- [ ] Subject landing page updated with new topic entry
- [ ] Sidebar updated with new topic link
