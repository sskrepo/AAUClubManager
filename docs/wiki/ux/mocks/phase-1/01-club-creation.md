---
title: "Phase 1 — Club Creation (First-Run Wizard)"
phase: 1
flow: club-creation
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, club, onboarding]
---

# Phase 1 — Club Creation (First-Run Wizard)

## Persona + Entry Context

**Who:** Director (Head Coach with club-level admin authority). Has just completed Clerk Organization creation (or was brought to the app after Clerk's org-creation flow). This is their first authenticated session in the app. No club record exists in the DB yet (Clerk webhook `organization.created` has fired and created the `clubs` row, but the club has no timezone, locale, or other metadata set).

**Device:** Desktop (club setup is a one-time admin task; not a mobile flow).

**Entry:** After sign-up and Clerk org creation → Clerk redirects to `/dashboard`. Middleware detects no completed club profile → redirects to `/onboarding/club`.

---

## Layout

### Step 1 of 3 — Club Details

```
┌─────────────────────────────────────────────────────────────────────┐
│  [AAUClubManager wordmark]                          [User menu ▾]   │
│  (BRAND PLACEHOLDER: wordmark + color)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │  Step 1 of 3                                             │      │
│   │  ●───────○───────○                                       │      │
│   │  Details    Season    Done                               │      │
│   │                                                          │      │
│   │  Set up your club                                        │      │
│   │  You can change these later in Club Settings.            │      │
│   │                                                          │      │
│   │  Club name *                                             │      │
│   │  ┌────────────────────────────────────────────────────┐  │      │
│   │  │  Springfield Elite Basketball                      │  │      │
│   │  └────────────────────────────────────────────────────┘  │      │
│   │  Pre-filled from Clerk Organization name. Edit if needed. │      │
│   │                                                          │      │
│   │  Timezone *                                              │      │
│   │  ┌────────────────────────────────────────────────────┐  │      │
│   │  │  America/Chicago (US Central)               [▾]   │  │      │
│   │  └────────────────────────────────────────────────────┘  │      │
│   │  Affects how season dates and practice times display.    │      │
│   │                                                          │      │
│   │  City / State (optional)                                 │      │
│   │  ┌────────────────────────────────────────────────────┐  │      │
│   │  │  Springfield, IL                                   │  │      │
│   │  └────────────────────────────────────────────────────┘  │      │
│   │                                                          │      │
│   │                             [Continue →]                 │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Step 2 of 3 — First Season

```
┌─────────────────────────────────────────────────────────────────────┐
│  [AAUClubManager wordmark]                          [User menu ▾]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │  Step 2 of 3                                             │      │
│   │  ●───────●───────○                                       │      │
│   │  Details    Season    Done                               │      │
│   │                                                          │      │
│   │  Create your first season                                │      │
│   │  A season scopes your tryouts, teams, and schedules.     │      │
│   │                                                          │      │
│   │  Season name *                                           │      │
│   │  ┌────────────────────────────────────────────────────┐  │      │
│   │  │  Spring 2026                                       │  │      │
│   │  └────────────────────────────────────────────────────┘  │      │
│   │                                                          │      │
│   │  Start date *              End date *                    │      │
│   │  ┌─────────────────────┐  ┌─────────────────────┐       │      │
│   │  │  Mar 1, 2026  [Cal] │  │  May 31, 2026 [Cal] │       │      │
│   │  └─────────────────────┘  └─────────────────────┘       │      │
│   │                                                          │      │
│   │  [← Back]                           [Create season →]   │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Step 3 of 3 — Done

```
┌─────────────────────────────────────────────────────────────────────┐
│  [AAUClubManager wordmark]                          [User menu ▾]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │  Step 3 of 3                                             │      │
│   │  ●───────●───────●                                       │      │
│   │  Details    Season    Done                               │      │
│   │                                                          │      │
│   │  ✓  Springfield Elite Basketball is ready!               │      │
│   │                                                          │      │
│   │  Next steps:                                             │      │
│   │  • Invite your coaching staff                            │      │
│   │  • Create a tryout                                       │      │
│   │  • Build your team roster                                │      │
│   │                                                          │      │
│   │                        [Go to Dashboard]                 │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components Used

- `Card` — centered wizard container, max-width 560px, `mx-auto mt-16`
- `Button` — "Continue →" (primary), "← Back" (ghost), "Go to Dashboard" (primary)
- `Input` — Club name, City/State, Season name
- `Select` — Timezone dropdown (IANA timezone list, grouped by continent)
- `Calendar` (via `Popover`) — start/end date pickers
- `Separator` — between step indicator and form content
- Step indicator: custom inline component (three circles + lines); active = `primary-500` fill, done = `primary-700` fill with check icon, upcoming = `neutral-200` outline
- Lucide icons: `CheckCircle` (step 3 success), `ArrowLeft` (Back), `ArrowRight` (Continue)

---

## States

### Default (each step)
- Step 1: Club name pre-filled from Clerk org name (editable). Timezone defaults to browser-detected timezone (if detectable) or `America/New_York`. City/State empty.
- Step 2: Season name empty (placeholder "e.g. Spring 2026"). Dates empty.
- Step 3: Club name shown as confirmation. Three next-step bullets.

### Loading (Continue / Create season buttons)
- Button shows spinner icon (16px Lucide `Loader2` rotating) + "Saving..." label. Button is `disabled`. No layout shift.

### Error (API / validation)
- Field-level: shadcn Form error message below the field, `text-error-500 text-sm`. Field border turns `error-500`.
- Server error: Alert component at top of card (`variant="destructive"`). Shows the RFC 7807 `detail` string. Example: "A club with this name already exists in your organization."
- Network error: same Alert with "Something went wrong. Please try again." + retry option.

### Success (step transition)
- Step 1 → 2: no toast; just step indicator advances + form replaces.
- Step 2 → 3: no toast; success state shown inline.
- Step 3 → Dashboard: page navigation (no toast needed; they're now in the full app).

---

## Interactions

| Action | Result |
|--------|--------|
| Type in Club name | Updates field; no live validation until Continue |
| Select timezone | Dropdown shows IANA zones grouped by region; searchable |
| Click date pickers | Calendar popover opens; select single date |
| End date < start date | Inline error: "End date must be after start date" |
| Click Continue (step 1) | Validates required fields → saves Club metadata via API → advances to step 2 |
| Click ← Back (step 2) | Returns to step 1; previously entered data preserved |
| Click Create season (step 2) | Validates dates → saves Season via API → advances to step 3 |
| Click Go to Dashboard | Navigates to `/dashboard` |
| Skip season step | No skip — creating a first season is required; coach cannot run tryouts without a season |

---

## Accessibility

- Wizard card has `role="main"` and `aria-label="Club setup wizard, step N of 3"`
- Step indicator circles: `aria-current="step"` on active step; `aria-label="Step N: {name}, {status}"` on each circle
- Date pickers: Calendar follows Radix Calendar ARIA pattern; keyboard navigable (arrow keys to change date, Enter to select)
- Timezone Select: searchable, filtered via keyboard input
- Error Alert: `role="alert"` ensures screen readers announce immediately
- Form fields: all have explicit `<label>` elements linked by `htmlFor`/`id`; required fields annotated with `aria-required="true"`
- On step advance: focus moves to the heading of the new step (via `useEffect` → `ref.focus()`)

---

## Data Shown / API Endpoints (Forward-Look)

| Step | Data written | API endpoint (Architect to spec at Gate 2) |
|------|-----------|--------------------------------------------|
| Step 1 | `Club.name`, `Club.timezone`, city/state (if stored) | `PATCH /clubs/{clubId}` or `POST /clubs` (if club doesn't exist yet) |
| Step 2 | `Season.name`, `Season.starts_on`, `Season.ends_on`, `Season.status = 'upcoming'` | `POST /seasons` |
| Step 3 | Read-only confirmation | — |

The Club row is created by the Clerk webhook (`organization.created`) — step 1 only fills in the metadata that Clerk doesn't know (timezone, city/state). The API for step 1 is a PATCH, not a POST.

---

## Cross-References

- PDD-PHASE-1 flow: Club Creation (F1)
- Related mocks: [02-season-setup.md](02-season-setup.md) (season setup is also reachable from Settings after onboarding)
- Module wiki: [module-teams.md](../../../module-teams.md) — Season entity

---

## Brand Placeholders Flagged

- **Header wordmark:** "AAUClubManager" text — awaiting final app name and logo asset
- **Header color:** `primary-500` (`#3b82f6`) — awaiting brand color confirmation
- **Step indicator active color:** uses `primary-500` — will update when brand color confirmed
