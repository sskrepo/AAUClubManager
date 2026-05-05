---
title: "Phase 1 — Season Setup"
phase: 1
flow: season-setup
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, season, director]
---

# Phase 1 — Season Setup

## Persona + Entry Context

**Who:** Director / Head Coach. Already has a club set up. Wants to create a new season (e.g., transitioning from Spring 2026 to Fall 2026).

**Device:** Desktop.

**Entry:** From the app Dashboard → "Seasons" in the sidebar → "New Season" button. Or from first-run wizard step 2 (same form, same fields — wizard context differs in heading only).

This screen is the standalone post-onboarding version (not wizard). The wizard version of season setup is shown in [01-club-creation.md](01-club-creation.md) step 2.

---

## Layout

### Seasons List Page (entry point)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
│  (BRAND PLACEHOLDER: club name in header per tenant convention)      │
├────────────────┬────────────────────────────────────────────────────┤
│  Navigation    │                                                     │
│  ─────────     │  Seasons                    [+ New Season]         │
│  Dashboard     │                                                     │
│  Tryouts       │  Active                                            │
│  Teams         │  ┌──────────────────────────────────────────────┐  │
│  Seasons   ←   │  │  Spring 2026                    [Active] ●   │  │
│  Coaches       │  │  Mar 1 – May 31, 2026                        │  │
│  Settings      │  │  4 teams · 63 players · 1 tryout             │  │
│                │  │                        [View]  [Edit]  [···] │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                     │
│                │  Past seasons                                       │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  Fall 2025                      [Archived]   │  │
│                │  │  Sep 1 – Dec 15, 2025                        │  │
│                │  │  3 teams · 51 players · 1 tryout             │  │
│                │  │                                   [View]     │  │
│                │  └──────────────────────────────────────────────┘  │
└────────────────┴────────────────────────────────────────────────────┘
```

### New Season Form (Dialog or Slide-Over Panel)

Design decision: season creation opens as a Dialog (modal), not a full page navigation, because it is a short form (3 fields). This keeps context (the seasons list) visible behind the modal.

```
┌─────────────────────────────────────────────────────────────────────┐
│  [blurred/dimmed background — seasons list page]                     │
│                                                                       │
│   ┌──────────────────────────────────────┐                          │
│   │  New Season                      [✕] │                          │
│   │  ──────────────────────────────────  │                          │
│   │                                      │                          │
│   │  Season name *                       │                          │
│   │  ┌──────────────────────────────┐    │                          │
│   │  │  e.g. Fall 2026              │    │                          │
│   │  └──────────────────────────────┘    │                          │
│   │                                      │                          │
│   │  Start date *                        │                          │
│   │  ┌──────────────────────────────┐    │                          │
│   │  │  Pick a date         [Cal ▾] │    │                          │
│   │  └──────────────────────────────┘    │                          │
│   │                                      │                          │
│   │  End date *                          │                          │
│   │  ┌──────────────────────────────┐    │                          │
│   │  │  Pick a date         [Cal ▾] │    │                          │
│   │  └──────────────────────────────┘    │                          │
│   │                                      │                          │
│   │  ⚠ Creating this season will not    │                          │
│   │  archive your current active season. │                          │
│   │  Activate it from the Seasons page.  │                          │
│   │                                      │                          │
│   │  [Cancel]          [Create Season]   │                          │
│   └──────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Edit Season Form (same Dialog, pre-filled)

Same form layout. Title changes to "Edit Season — Spring 2026." "Create Season" button label becomes "Save Changes." The status field is added:

```
│   Status                                      │
│   ┌──────────────────────────────────────┐    │
│   │  Upcoming                      [▾]   │    │
│   │  (Upcoming / Active / Archived)      │    │
│   └──────────────────────────────────────┘    │
│   ⚠ Setting to Active will archive any        │
│   currently active season.                    │
```

### Season Detail View (full page, read-only summary)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  Navigation    │                                                     │
│                │  ← Seasons                                         │
│                │                                                     │
│                │  Spring 2026                     [Edit]  [···]     │
│                │  Mar 1 – May 31, 2026            [Active] ●        │
│                │                                                     │
│                │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│                │  │  Teams   │  │ Players  │  │ Tryouts  │         │
│                │  │    4     │  │   63     │  │    1     │         │
│                │  └──────────┘  └──────────┘  └──────────┘         │
│                │                                                     │
│                │  Teams in this season                               │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  12U Elite      8 players   J. Martinez      │  │
│                │  │  13U Select     9 players   R. Thompson      │  │
│                │  │  ...                                         │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                     │
│                │  [+ Create Tryout]   [+ Add Team]                  │
└────────────────┴────────────────────────────────────────────────────┘
```

---

## Components Used

- `Card` — season list items; stat summary cards in detail view
- `Button` — "New Season" (primary, `Plus` icon), "View" (outline), "Edit" (ghost), "Create Season" (primary), "Cancel" (ghost), "← Seasons" (ghost, `ArrowLeft` icon)
- `Dialog` — create/edit season modal (Radix Dialog, focus-trapped)
- `Input` — Season name field
- `Calendar` (via `Popover`) — date pickers for start/end
- `Select` — Status dropdown in Edit mode
- `Badge` — season status tag: "Active" (`success-500` background), "Upcoming" (`warning-100` + `warning-500` text), "Archived" (`neutral-100` + `neutral-600` text)
- `Alert` — info box about not auto-archiving current season
- `DropdownMenu` — `[···]` row actions: "Edit", "Activate", "Archive", "Delete"
- Lucide icons: `Plus`, `Calendar`, `ArrowLeft`, `MoreHorizontal`

---

## States

### Seasons List — Empty State
- No seasons exist yet (only possible on first run before wizard completes).
- Center-aligned empty state inside the content area:
  ```
  [Calendar icon — 48px, neutral-400]
  No seasons yet
  Create your first season to start organizing tryouts and teams.
  [+ Create your first season]
  ```

### Seasons List — Loading
- Two Skeleton cards replacing the season list items (same height as a real card, `rounded-lg`).

### Create Season — Loading (submitting)
- "Create Season" button: spinner + "Creating..." label, `disabled`. Dialog does not close until success.

### Create Season — Success
- Dialog closes automatically. Toast: "Fall 2026 season created." (Sonner, `success` variant, 4s). New season card appears at top of "Upcoming" section.

### Create Season — Error
- Alert inside Dialog (`variant="destructive"`): RFC 7807 `detail` string. Dialog stays open.

### Edit Season — Activate warning
- When changing status to "Active": Alert inside Dialog: "This will archive your current active season (Spring 2026). Team and tryout data will be preserved."

---

## Interactions

| Action | Result |
|--------|--------|
| Click "New Season" button | Opens create Dialog; focus moves to Season name input |
| Press Escape in Dialog | Closes Dialog; focus returns to "New Season" button |
| Click "View" on season card | Navigates to Season Detail page |
| Click "Edit" on season card | Opens Edit Dialog pre-filled with season data |
| Click `[···]` on season card | DropdownMenu with: View / Edit / Activate / Archive / Delete |
| Click "Activate" | Confirm Dialog: "Activate Fall 2026? This will archive Spring 2026." → [Cancel] [Activate] |
| Click "Archive" | Confirm Dialog: "Archive Spring 2026? You can still view this season's data." → [Cancel] [Archive] |
| End date before start date | Inline error on end date field: "End date must be after start date." Create Season button disabled. |
| Click "+ Create Tryout" from detail | Navigates to tryout creation form with season pre-selected |

---

## Accessibility

- Dialog uses Radix Dialog: focus-trapped to modal when open, returns to trigger on close
- Backdrop click closes Dialog (Radix default behavior)
- Season status Badge: text label ("Active", "Upcoming", "Archived") not color alone
- `[···]` DropdownMenu trigger has `aria-label="Season options for Spring 2026"`
- Confirm Dialogs: destructive action button is visually distinct (red/error variant) and labeled clearly ("Activate" / "Archive", not "OK")
- Date pickers: Calendar keyboard navigation per Radix Calendar (arrow keys, Enter)
- Empty state: `role="status"` on the empty-state container

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Seasons list | `GET /seasons` (filtered by `club_id`, ordered by `starts_on DESC`) | `GET /seasons` |
| Season stat cards | Aggregate counts (teams, players, tryouts) from joined tables | `GET /seasons/{id}/summary` or inline in list response |
| Create Season | `POST /seasons` with `{name, starts_on, ends_on}` | `POST /seasons` |
| Edit Season | `PATCH /seasons/{id}` with changed fields | `PATCH /seasons/{id}` |
| Activate Season | `PATCH /seasons/{id}` with `{status: 'active'}` | `PATCH /seasons/{id}` |
| Archive Season | `PATCH /seasons/{id}` with `{status: 'archived'}` | `PATCH /seasons/{id}` |

---

## Cross-References

- PDD-PHASE-1 flow: Season Setup (F2)
- Related mocks: [01-club-creation.md](01-club-creation.md) (wizard step 2 is the same form), [04-tryout-creation.md](04-tryout-creation.md) (tryout requires a season)
- Module wiki: [module-teams.md](../../../module-teams.md) — Season entity

---

## Brand Placeholders Flagged

- **App header:** "Club Name" (per-tenant) — awaiting final app header convention decision (generic vs per-tenant; PHASE-1.md item #2)
- **Header/sidebar accent color:** uses `primary-500` (`#3b82f6`) — awaiting brand confirmation
- **Active nav indicator** on "Seasons" sidebar item: `primary-500` left border + background — awaiting brand confirmation
