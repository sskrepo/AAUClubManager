---
title: "Phase 1 — Tryout Creation"
phase: 1
flow: tryout-creation
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, tryout, coach]
---

# Phase 1 — Tryout Creation

## Persona + Entry Context

**Who:** Head Coach (Director). Has an active season. Wants to create a tryout event so parents can register players.

**Device:** Desktop.

**Entry:** Dashboard → "Tryouts" in sidebar → "New Tryout" button. Or from a Season detail page → "Create Tryout."

---

## Layout

### Tryouts List Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  Dashboard     │                                                     │
│  Tryouts   ←   │  Tryouts                          [+ New Tryout]   │
│  Teams         │                                                     │
│  Seasons       │  Spring 2026   [▾]   ← season filter              │
│  Coaches       │                                                     │
│  Settings      │  ┌──────────────────────────────────────────────┐  │
│                │  │  12U / 13U Spring Tryout            [Draft]  │  │
│                │  │  Sat, May 10, 2026 · 9:00 AM – 12:00 PM     │  │
│                │  │  Springfield YMCA, Main Gym                  │  │
│                │  │  23 registered · Age: 11-13                  │  │
│                │  │           [Copy link]  [Edit]  [Publish]     │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                     │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  10U Spring Tryout                [Published] │  │
│                │  │  Sat, Apr 26, 2026 · 9:00 AM – 11:00 AM     │  │
│                │  │  West Side Rec Center                        │  │
│                │  │  41 registered · Age: 9-10                   │  │
│                │  │           [Copy link]   [View]  [Evaluate]   │  │
│                │  └──────────────────────────────────────────────┘  │
└────────────────┴────────────────────────────────────────────────────┘
```

### New Tryout Form (full page, not a Dialog — form has more fields)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  Dashboard     │                                                     │
│  Tryouts   ←   │  ← Tryouts                                        │
│  ...           │                                                     │
│                │  New Tryout                                        │
│                │                                                     │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  BASICS                                       │  │
│                │  │                                               │  │
│                │  │  Tryout name *                               │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  e.g. 12U Spring Tryout 2026           │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                               │  │
│                │  │  Season *                                    │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  Spring 2026                     [▾]   │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                               │  │
│                │  │  Eligible age groups *  (select all that apply) │
│                │  │  ☐ 9U   ☐ 10U   ☑ 11U   ☑ 12U   ☐ 13U   │  │  │
│                │  │  ☐ 14U  ☐ 15U   ☐ 16U   ☐ 17U   ☐ 18U   │  │  │
│                │  │                                               │  │
│                │  │  ─────────────────────────────────────────   │  │
│                │  │                                               │  │
│                │  │  DATE & LOCATION                              │  │
│                │  │                                               │  │
│                │  │  Date *                                      │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  Pick a date                  [Cal ▾]  │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                               │  │
│                │  │  Start time *         End time *             │  │
│                │  │  ┌──────────────┐     ┌──────────────┐       │  │
│                │  │  │  9:00 AM [▾] │     │ 12:00 PM [▾] │       │  │
│                │  │  └──────────────┘     └──────────────┘       │  │
│                │  │                                               │  │
│                │  │  Location / venue name *                     │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  Springfield YMCA, Main Gym             │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                               │  │
│                │  │  Address (optional)                          │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  123 Main St, Springfield, IL 62701    │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                               │  │
│                │  │  ─────────────────────────────────────────   │  │
│                │  │                                               │  │
│                │  │  REGISTRATION SETTINGS                        │  │
│                │  │                                               │  │
│                │  │  Registration deadline (optional)            │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  Pick a date                  [Cal ▾]  │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │  If set, parents cannot register after this.  │  │
│                │  │                                               │  │
│                │  │  Max registrations (optional)                │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  e.g. 40                               │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                               │  │
│                │  │  Notes for parents (optional)                │  │
│                │  │  ┌────────────────────────────────────────┐  │  │
│                │  │  │  Wear athletic shoes and comfortable   │  │  │
│                │  │  │  clothing. Bring water.                │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │  (Shown on the public tryout page)           │  │
│                │  │                                               │  │
│                │  │  [Save as Draft]            [Save & Publish] │  │
│                │  └──────────────────────────────────────────────┘  │
└────────────────┴────────────────────────────────────────────────────┘
```

### Tryout Detail / Management View (post-creation)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  ...           │                                                     │
│                │  ← Tryouts                                        │
│                │                                                     │
│                │  12U Spring Tryout 2026        [Published] ●       │
│                │  Sat May 10 · 9–12 AM · Springfield YMCA          │
│                │  Age groups: 11U, 12U                              │
│                │                                                     │
│                │  ┌────────────────────────────────────────┐        │
│                │  │  Registration link (share with parents) │        │
│                │  │  https://app.../tryout/abc123           │        │
│                │  │  [Copy link]  [Open public page]        │        │
│                │  └────────────────────────────────────────┘        │
│                │                                                     │
│                │  Registered players   23  /  40 max               │
│                │  ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░  57%                       │
│                │                                                     │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  Player name     Age  Position  Registered  │   │
│                │  │  Maya Johnson    11   Guard     Apr 28      │   │
│                │  │  Tyler Brooks    12   Forward   Apr 29      │   │
│                │  │  ...                                         │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                     │
│                │  [Edit Tryout]  [Start Evaluation →]               │
└────────────────┴────────────────────────────────────────────────────┘
```

---

## Components Used

- `Card` — tryout list items; tryout detail container; registration link box
- `Button` — "New Tryout" (primary, `Plus`), "Save as Draft" (outline), "Save & Publish" (primary), "Copy link" (ghost, `Copy` icon), "Edit Tryout" (outline), "Start Evaluation" (primary, `ClipboardList` icon)
- `Input` — Tryout name, Location, Address, Max registrations
- `Select` — Season, Start time, End time
- `Checkbox` — Age group multi-select (11 checkboxes: 8U–18U)
- `Calendar` (via `Popover`) — date and registration deadline
- `Textarea` — Notes for parents
- `Separator` — between form sections (Basics / Date+Location / Registration Settings)
- `Badge` — tryout status: "Draft" (`neutral-100` + `neutral-600`), "Published" (`success-100` + `success-500` text)
- `Progress` (shadcn) — registration fill bar in detail view
- `Table` — registered players list
- Lucide icons: `Plus`, `ClipboardList`, `Copy`, `ExternalLink`, `ArrowLeft`

---

## States

### Tryouts List — Empty State
```
[ClipboardList icon — 48px, neutral-400]
No tryouts yet
Create a tryout to start accepting player registrations.
[+ Create your first tryout]
```

### Tryouts List — Loading
- Two Skeleton cards.

### Form — Validation Errors
- Missing required fields: border turns `error-500`, error message below each field. "Save & Publish" and "Save as Draft" both remain enabled but submission triggers validation.
- End time before start time: "End time must be after start time."
- Registration deadline in the past: "Registration deadline cannot be in the past."

### Save as Draft
- Button: spinner + "Saving..." → Toast: "Tryout saved as draft." Redirects to Tryouts list.

### Save & Publish
- Button: spinner + "Publishing..." → Toast: "Tryout published. Share the registration link with parents." Redirects to Tryout detail page.

### Copy link
- Copies URL to clipboard. Button briefly shows `Check` icon + "Copied!" for 2 seconds, then reverts.

### Max registrations reached
- In detail view: registration bar shows 100%, badge changes to "Full." Public tryout page shows "Registration is now closed" state (see mock #05).

---

## Interactions

| Action | Result |
|--------|--------|
| Click "+ New Tryout" | Navigates to New Tryout form page |
| Select season from dropdown | Filters context; season is pre-selected if navigated from Season detail |
| Toggle age group checkboxes | Multi-select; at least one required |
| Click date picker | Calendar popover opens |
| Click time selects | Dropdown with 30-min intervals (6:00 AM – 10:00 PM) |
| Click "Save as Draft" | Saves without publishing; redirects to list; tryout not publicly accessible |
| Click "Save & Publish" | Saves + publishes; tryout is publicly accessible via the share link |
| Click "Copy link" in detail view | Copies tryout URL to clipboard; confirmation animation |
| Click "Edit Tryout" | Returns to form, pre-filled |
| Click "Start Evaluation" | Navigates to evaluation UI (mock #07) |
| Click "Published" on list card | Navigates to tryout detail |

---

## Accessibility

- Form sections use `<fieldset>` + `<legend>` for "Basics", "Date & Location", "Registration Settings"
- Age group checkboxes: `<fieldset>` with `<legend>Eligible age groups (select at least one)</legend>`
- Time selects: `aria-label="Start time"` / `aria-label="End time"`
- Calendar pickers: same ARIA pattern as other mocks (Radix Calendar)
- "Copy link" button: after copy, `aria-live="polite"` region announces "Link copied to clipboard"
- Progress bar in detail view: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label="Registration fill: 23 of 40 spots filled"`
- Table in detail view: `<caption>` "Registered players for 12U Spring Tryout 2026"; column headers with `scope="col"`

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Tryouts list | `GET /tryouts?season_id=N` | `GET /tryouts` |
| Create tryout | `POST /tryouts` | `POST /tryouts` |
| Edit tryout | `PATCH /tryouts/{id}` | `PATCH /tryouts/{id}` |
| Publish tryout | `PATCH /tryouts/{id}` `{status: 'published'}` | `PATCH /tryouts/{id}` |
| Registered players | `GET /tryouts/{id}/registrations` | `GET /tryouts/{id}/registrations` |
| Registration count | Derived from `tryout_registrations` count | included in tryout response |

**Tryout entity fields implied by this form:**
- `name`, `season_id`, `eligible_age_groups[]`, `date`, `start_time`, `end_time`, `location_name`, `location_address`, `registration_deadline`, `max_registrations`, `notes_for_parents`, `status` (`draft` | `published` | `closed` | `complete`)

---

## Cross-References

- PDD-PHASE-1 flow: Tryout Creation (F4) / module-tryouts.md F1
- Related mocks: [05-public-tryout-page.md](05-public-tryout-page.md), [06-parent-registration.md](06-parent-registration.md), [07-coach-evaluation-mobile.md](07-coach-evaluation-mobile.md)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)

---

## Brand Placeholders Flagged

- **Header:** Club name display + primary color — pending PHASE-1.md item #2
- **Published Badge color:** uses `success-500` — not brand-dependent; no change needed
- **"Start Evaluation" primary button:** uses `primary-500` — pending brand confirmation
