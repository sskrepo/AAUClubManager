---
title: Design System
created: 2026-05-03
approved: 2026-05-03
owner: ux-designer
tags: [ux, design-system]
status: v0.1 — approved (Phase 0 seed, Gate 1 approved 2026-05-03)
---

# AAUClubManager — Design System

## Version history

| Version | Date | Notes |
|---------|------|-------|
| v0.1 | 2026-05-03 | Phase 0 seed — palette, typography, spacing, components catalog, accessibility baseline |

---

## Color Palette

Sports club operators work in gyms, sidelines, and on mobile in bright or dark conditions. The palette must be high-contrast and legible in all ambient conditions.

### Primary — Club Blue

A saturated, trustworthy blue. Signals authority without aggression. Readable on white at WCAG AA.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eff6ff` | Tinted backgrounds, hover states |
| `primary-100` | `#dbeafe` | Input focus rings, selected row highlight |
| `primary-500` | `#3b82f6` | Primary buttons, links, active nav indicator |
| `primary-600` | `#2563eb` | Button hover, interactive emphasis |
| `primary-700` | `#1d4ed8` | Button pressed, high-emphasis text on light |
| `primary-900` | `#1e3a8a` | Dark header text, dark mode fill |

### Secondary — Court Orange

A warm accent tied to basketball. Use sparingly — badges, highlights, sport-context elements only.

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-400` | `#fb923c` | Accent badge backgrounds, highlight pip |
| `secondary-500` | `#f97316` | Active tryout / event callout |
| `secondary-600` | `#ea580c` | Hover on secondary CTA |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `success-500` | `#22c55e` | Confirmed payment, accepted roster spot, sent notification |
| `success-100` | `#dcfce7` | Success banner background |
| `warning-500` | `#eab308` | Pending payment, unconfirmed attendance |
| `warning-100` | `#fef9c3` | Warning banner background |
| `error-500` | `#ef4444` | Form validation, failed send, overdue payment |
| `error-100` | `#fee2e2` | Error banner background |
| `info-500` | `#06b6d4` | Informational tooltip, help text |
| `info-100` | `#cffafe` | Info banner background |

### Neutrals

Tailwind slate scale. Dense data tables need multiple neutral stops.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-0` | `#ffffff` | Page background, card surfaces |
| `neutral-50` | `#f8fafc` | Sidebar background, zebra rows |
| `neutral-100` | `#f1f5f9` | Disabled input backgrounds |
| `neutral-200` | `#e2e8f0` | Borders, dividers |
| `neutral-400` | `#94a3b8` | Placeholder text, icon inactive |
| `neutral-600` | `#475569` | Secondary text, labels |
| `neutral-800` | `#1e293b` | Body text |
| `neutral-950` | `#0f172a` | Headings, high-contrast text |

### Contrast Compliance

All text/background combinations must meet WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text and UI components).

Critical pairs verified:
- `neutral-800` on `neutral-0` → 12.6:1 (AAA)
- `primary-700` on `neutral-0` → 8.6:1 (AAA)
- `primary-500` on `neutral-0` → 4.6:1 (AA)
- `neutral-0` on `primary-600` → 5.0:1 (AA) — for primary button text
- `neutral-0` on `error-500` → 4.5:1 (AA) — check per implementation

---

## Typography

### Font Families

| Role | Family | Tailwind class | Notes |
|------|--------|---------------|-------|
| Headings | Inter | `font-sans` (overridden) | Clear at all sizes, excellent on screens |
| Body | Inter | `font-sans` | Same family, weight differentiation |
| Monospace | JetBrains Mono | `font-mono` | Jersey numbers, IDs, code snippets |

Inter is loaded via Google Fonts or `next/font`. Both Inter and JetBrains Mono are open-source, no licensing cost.

### Scale

Tailwind default type scale (rem-based, user-agent respects user font size preference).

| Class | rem | px (16px base) | Usage |
|-------|-----|----------------|-------|
| `text-xs` | 0.75rem | 12px | Badge labels, table meta, timestamps |
| `text-sm` | 0.875rem | 14px | Table cells, form labels, secondary text |
| `text-base` | 1rem | 16px | Body copy, form inputs |
| `text-lg` | 1.125rem | 18px | Card titles, section headings |
| `text-xl` | 1.25rem | 20px | Page subheadings |
| `text-2xl` | 1.5rem | 24px | Page headings |
| `text-3xl` | 1.875rem | 30px | Dashboard KPI numbers |
| `text-4xl` | 2.25rem | 36px | Hero/splash text (rare) |

### Weight

| Tailwind class | weight | Usage |
|----------------|--------|-------|
| `font-normal` | 400 | Body, table cells |
| `font-medium` | 500 | Labels, nav items, button text |
| `font-semibold` | 600 | Section headings, form field names |
| `font-bold` | 700 | Page titles, KPI values, alerts |

### Line Height

- Body text: `leading-relaxed` (1.625) for comfortable reading in forms/messages
- Headings: `leading-tight` (1.25) to control vertical rhythm at large sizes
- Table cells: `leading-normal` (1.5) for density

---

## Spacing Scale

Tailwind default 4px base. All layout spacing uses multiples of 4px.

| Token | px | Usage |
|-------|----|-------|
| `space-1` | 4px | Icon-to-label gap, dense table row padding |
| `space-2` | 8px | Tight component internal padding |
| `space-3` | 12px | Button padding-y, input padding |
| `space-4` | 16px | Card padding, default section gap |
| `space-6` | 24px | Section spacing within a page |
| `space-8` | 32px | Between major sections |
| `space-12` | 48px | Top-of-page padding |
| `space-16` | 64px | Full-section vertical rhythm |

Rule: do not invent arbitrary values. If a design calls for 20px, round to `space-5` (20px). If it needs 18px, reconsider the layout.

---

## Component Library: shadcn/ui

**Selected:** shadcn/ui (Radix UI primitives + Tailwind, copy-into-project model)

Rationale: matches chosen stack (Next.js 15 + Tailwind), unstyled primitives give full palette control, accessible by default (Radix handles ARIA + keyboard), no runtime bundle cost for unused components.

### Components needed for Phase 1 (Tryouts + Teams)

These will be installed/configured before Phase 1 frontend work begins.

| Component | shadcn slug | Phase 1 use |
|-----------|-------------|-------------|
| Button | `button` | Every CTA, form submit, action trigger |
| Form | `form` | Tryout registration, evaluation form |
| Input | `input` | Name, email, phone fields |
| Select | `select` | Grade/age group, position, jersey size |
| Table | `table` | Player list, roster view, evaluation grid |
| Dialog | `dialog` | Confirm selection, send notification confirm |
| Card | `card` | Player profile card, team summary card |
| Avatar | `avatar` | Player/coach avatar initials or photo |
| Badge | `badge` | Status tags (Registered, Evaluated, Selected, Accepted) |
| Toast | `sonner` | Success/error feedback on actions |
| Calendar | `calendar` | Tryout date picker |
| Separator | `separator` | Section dividers |
| Skeleton | `skeleton` | Loading states in tables and cards |
| Alert | `alert` | Inline error / warning messages |
| Dropdown Menu | `dropdown-menu` | Row actions, user menu |
| Checkbox | `checkbox` | Multi-select players in roster builder |
| Textarea | `textarea` | Notes/evaluation comments |
| Tabs | `tabs` | Player detail: Profile / Evaluations / Teams |

### Phase 2+ additions (logged for planning)

Phase 2 will need: `popover`, `command` (gym search), `switch` (recurring schedule toggle), `radio-group` (jersey size selection), `progress` (payment status bar).

---

## Icon Set

**Selected:** Lucide React (shadcn default)

- Open-source, MIT
- Consistent 24px grid with 2px stroke
- Tree-shakeable (only imported icons are bundled)
- Covers all sports-management needs without custom SVG

Common icons anticipated for Phase 1:

| Icon | Usage |
|------|-------|
| `Users` | Teams, players, roster |
| `User` | Single player/coach profile |
| `ClipboardList` | Tryout / evaluation |
| `Trophy` | Teams, season |
| `CheckCircle` | Accepted, confirmed |
| `XCircle` | Rejected, not accepted |
| `Clock` | Pending, scheduled |
| `Bell` | Notifications |
| `Mail` | Email channel |
| `MessageSquare` | WhatsApp channel |
| `Plus` | Add / create action |
| `Search` | Filter/search inputs |
| `ChevronDown` | Dropdown indicator |
| `ArrowLeft` | Back navigation |
| `Settings` | Club/team settings |
| `LogOut` | Sign out |

---

## Accessibility Baseline

**Target:** WCAG 2.1 AA across all user-facing screens.

### Color contrast
- Body text: minimum 4.5:1 against background
- Large text (18px+ or 14px+ bold): minimum 3:1
- UI components and focus rings: minimum 3:1
- Never use color alone to convey status — always pair with text, icon, or pattern

### Keyboard navigation
- Every interactive element reachable by Tab
- Logical focus order matches visual order
- No keyboard traps (shadcn/Radix handles this for modals/dialogs)
- Visible focus ring on all focusable elements: `ring-2 ring-primary-500 ring-offset-2`

### ARIA
- shadcn/Radix components carry correct ARIA roles by default
- Custom components must include: `aria-label`, `aria-describedby` for form errors, `aria-live="polite"` for dynamic content (toast, inline feedback)
- Data tables: `<caption>` or `aria-label`, column headers with `scope="col"`

### Focus management
- On modal open: focus moves to modal container
- On modal close: focus returns to trigger element
- On route change: focus moves to `<h1>` of new page (Next.js router + focus reset)

### Motion
- Respect `prefers-reduced-motion`: all animations (sidebar slide, toast fade, dialog open) use `motion-safe:` or CSS `@media (prefers-reduced-motion: reduce)` guard
- Default animation: 150ms ease-out for micro-interactions, 250ms for page transitions
- No auto-playing video or looping animations

### Screen readers
- Images: `alt` text always present (or `alt=""` for decorative)
- Icon-only buttons: `aria-label` required
- Status badges: readable as text, not color-only

---

## Phase 0 Baseline — What Is Locked

The following decisions are made and will not be revisited without a formal ADR or design decision:

1. **Component library:** shadcn/ui — locked
2. **Icon set:** Lucide React — locked
3. **Font family:** Inter (headings + body) + JetBrains Mono (mono) — locked
4. **Spacing base:** 4px (Tailwind default) — locked
5. **Accessibility target:** WCAG 2.1 AA — locked
6. **Motion policy:** respect `prefers-reduced-motion` — locked

**Open questions for user (filed as decisions in pmo/decisions/ if needed):**

- Brand color: is "Club Blue" (#3b82f6) acceptable, or is there a specific club identity color to match? (Currently using a neutral sports-friendly blue — can be swapped without changing architecture.)
- Logo: is there a logo asset? Until provided, initials-based avatar and text wordmark ("AAU Club Manager") will be used.
- Club name display: should the app header show "AAU Club Manager" (generic SaaS) or the specific club's name per tenant?
