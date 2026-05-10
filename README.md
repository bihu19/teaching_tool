# Puay Teach

Interactive educational tool for Thai high-school students covering Maths, Biology, Chemistry, and Physics. All lessons are **bilingual (Thai / English)** with interactive visualizations.

Built with Next.js 16 App Router, React 19, and Tailwind CSS 4. All visualizations use raw SVG or Canvas — no external charting libraries.

---

## Design system

This project uses the **PuayBigTutor** design system: warm cream surfaces, peach accent, Instrument Serif display type, and Manrope body text. The visual language is pastel-futurist — friendly and capable, never childish or corporate.

| Token | Value |
|---|---|
| Page background | `#FBF8F2` cream-50 |
| Card background | `#F6F1E7` cream-100 |
| Accent (peach) | `#E8623A` |
| Display font | Instrument Serif — italic flourish |
| Body font | Manrope 400–700 |
| Mono font | JetBrains Mono |
| Icons | Lucide at 1.5px stroke |

See `CLAUDE.md` for the full design token reference and component patterns.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          ← Root layout — fonts, Sidebar, LangProvider
│   ├── globals.css         ← PuayBigTutor CSS tokens + Tailwind
│   ├── page.tsx            ← Homepage
│   ├── math/               ← Mathematics (coming soon)
│   ├── biology/            ← Biology topics
│   ├── chemistry/          ← Chemistry topics
│   └── physics/            ← Physics topics
└── components/
    ├── Sidebar.tsx         ← Navigation sidebar
    └── LangContext.tsx     ← Thai / English context
```

---

## Adding a new topic

1. Create `src/app/<subject>/<topic-slug>/page.tsx` — start with `"use client";`
2. Add an entry to the `topics` array in `src/app/<subject>/page.tsx`
3. Add an entry to the subject's `topics` in `src/components/Sidebar.tsx`

See `CLAUDE.md` for the full page template and styling checklist.
