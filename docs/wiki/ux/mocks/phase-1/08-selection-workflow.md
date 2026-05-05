---
title: "Phase 1 — Selection Workflow (Score Review + Team Assignment)"
phase: 1
flow: selection-workflow
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, selection, coach, drag-and-drop]
---

# Phase 1 — Selection Workflow

## Persona + Entry Context

**Who:** Head Coach only. (Assistant Coaches can evaluate but cannot make final selection decisions.)

**Device:** Desktop-primary. This is a complex multi-column workflow. Tablet (768px) works with a simplified layout. Mobile is read-only (coach can view their own scores but cannot drag-and-drop on mobile — the board is too wide).

**Entry:** Tryout detail page → "Make Selections" button (visible only after tryout is in "Evaluation complete" or "Evaluation in progress" state). Or from Dashboard "Tryouts" card with "Pending selection" status.

**What this screen does:** Head Coach sees all registered players, their aggregated evaluation scores (average across all coaches who scored them), and drags players into team columns or marks them as "Not Selected" / "Waitlist." When satisfied, clicks "Send Notifications" to trigger email + WhatsApp to all parents.

---

## Layout

### Selection Board (desktop — primary layout)

The board uses a kanban-style column layout. Columns are horizontally scrollable if there are many teams.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                                         [User menu ▾]  │
├────────────┬────────────────────────────────────────────────────────────────────────┤
│  Dashboard │                                                                         │
│  Tryouts ← │  12U Spring Tryout 2026 — Selection Board              [Undo] [Help?]  │
│  Teams     │  23 players · 3 teams defined · 8 evaluated · 15 not evaluated         │
│  ...       │                                                                         │
│            │  ⚠ 15 players have not been evaluated yet. You can still run selection, │
│            │  but unscored players will show average: —                              │
│            │                                                                         │
│            │  [Sort by: Avg score ▾]  [Filter: All age groups ▾]  [View scores]    │
│            │                                                                         │
│            ├──────────────┬─────────────────┬─────────────────┬──────────────────── │
│            │  UNASSIGNED  │  12U ELITE      │  12U SELECT     │  NOT SELECTED       │
│            │  (23)        │  (0/12)         │  (0/12)         │  (0)                │
│            │  ─────────── │  ─────────────  │  ───────────    │  ──────────────     │
│            │              │  J. Martinez    │                 │                     │
│            │  ┌─────────┐ │  (Head Coach)   │  R. Thompson    │  Drag players here  │
│            │  │ Maya J. │ │  ─────────────  │  (Asst Coach)   │  to mark as not    │
│            │  │ Age 11  │ │                 │  ───────────    │  selected          │
│            │  │ Guard   │ │                 │                 │                     │
│            │  │ ★ 7.8   │ │                 │                 │                     │
│            │  └─────────┘ │                 │                 │                     │
│            │              │                 │                 │                     │
│            │  ┌─────────┐ │                 │                 │                     │
│            │  │ Tyler B.│ │                 │                 │                     │
│            │  │ Age 12  │ │                 │                 │                     │
│            │  │ Forward │ │                 │                 │                     │
│            │  │ ★ 8.2   │ │                 │                 │                     │
│            │  └─────────┘ │                 │                 │                     │
│            │  ...         │                 │                 │                     │
│            │              │                 │                 │                     │
│            │  + WAITLIST  │                 │                 │                     │
│            │  (0)         │                 │                 │                     │
│            ├──────────────┴─────────────────┴─────────────────┴──────────────────── │
│            │                                                                         │
│            │  [Send Notifications →]   (disabled until at least 1 player assigned)  │
└────────────┴─────────────────────────────────────────────────────────────────────────┘
```

**Column definitions:**
- **UNASSIGNED** — all registered players start here; Head Coach drags from here
- **Team columns** — one per team defined for this season/tryout (e.g., "12U Elite", "12U Select"); column header shows team name + coach name + current count/max
- **NOT SELECTED** — drag here to mark player as not making any team
- **WAITLIST** — drag here to place on waitlist (single shared waitlist; see Open Product Question #2 in index.md)

**Player card (in any column):**
```
┌──────────────────────┐
│ [Avatar 32px]        │
│ Maya Johnson    ★7.8  │
│ Age 11 · Guard       │
│ [View scores]        │
└──────────────────────┘
```
- Star + average score: calculated as average of all coaches' scores across all 5 dimensions
- "View scores": opens a popover with per-coach, per-dimension breakdown table
- Card is draggable (mouse: click+drag; keyboard: Space to grab, arrow keys to move, Space to drop)

### Score Breakdown Popover (on "View scores" click)

```
┌──────────────────────────────────────┐
│  Maya Johnson — Scores               │
│  ─────────────────────────────────   │
│  Dimension     Coach 1   Coach 2  Avg│
│  Shooting        7         8      7.5│
│  Dribbling       6         7      6.5│
│  Defense         9         8      8.5│
│  Court IQ        7         8      7.5│
│  Athleticism     8         9      8.5│
│  ─────────────────────────────────   │
│  Overall average              ★ 7.7  │
│                                      │
│  Notes:                              │
│  Coach 1: "Great on defense"         │
│  Coach 2: "Good court vision"        │
│                                      │
│                           [Close]    │
└──────────────────────────────────────┘
```

Coach names are anonymized in this view (shown as "Coach 1", "Coach 2") so Head Coach makes decisions on aggregate merit, not on which coach scored whom. This is a deliberate UX choice — surfacing as an open product question.

### Send Notifications Confirmation Dialog

```
┌──────────────────────────────────────┐
│  Send selection notifications?   [✕] │
│  ──────────────────────────────────  │
│                                      │
│  You're about to notify parents of   │
│  selection results for:              │
│                                      │
│  ✓ 12 players → 12U Elite           │
│  ✓ 10 players → 12U Select          │
│  ✗  1 players → Not selected        │
│  ≡  0 players → Waitlist            │
│                                      │
│  Notifications sent via:            │
│  ✉ Email (all 23 parents)           │
│  💬 WhatsApp (18 parents with phone) │
│                                      │
│  5 parents without WhatsApp will     │
│  receive email only.                 │
│                                      │
│  ⚠ 0 players still in Unassigned.  │
│  They will not receive notifications.│
│                                      │
│  This action cannot be undone.       │
│                                      │
│  [Cancel]       [Send Notifications] │
└──────────────────────────────────────┘
```

---

## Tablet Layout (768px)

On tablet, the kanban columns stack into a simplified list view. Drag-and-drop is replaced by a "Move to..." action button on each player card.

```
┌────────────────────────────────────────────┐
│  ← Tryouts  12U Spring — Selection        │
├────────────────────────────────────────────┤
│  [Filter ▾]  [Sort ▾]  [View board]       │
├────────────────────────────────────────────┤
│  Unassigned (23 players)                   │
│  ┌──────────────────────────────────────┐  │
│  │  [Avatar] Maya Johnson  ★7.8         │  │
│  │  Age 11 · Guard                      │  │
│  │                         [Move to ▾]  │  │
│  │  → 12U Elite / 12U Select / Waitlist │  │
│  │  → Not Selected                      │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

---

## Components Used

- `Card` — player cards (draggable on desktop); team column headers
- `Avatar` — player initials or photo, 32px in list
- `Badge` — team assignment status badge on column header
- `Button` — "Send Notifications" (primary, `Bell` icon), "Undo" (ghost, `Undo2` icon), "View scores" (ghost, `BarChart2` icon), "Cancel" / "Send Notifications" in Dialog
- `Dialog` — send notifications confirmation; score breakdown popover uses `Popover` (not Dialog — stays open while browsing)
- `Popover` — score breakdown per player
- `DropdownMenu` — "Sort by" and "Filter" controls; "Move to..." on tablet
- `Alert` — unevaluated players warning; unassigned players warning in Dialog
- `Checkbox` — optional: bulk-select players for batch assignment (Phase 1 nice-to-have)
- `Select` — Sort and Filter dropdowns in the toolbar
- Drag-and-drop: implemented with `@dnd-kit/core` (already a common choice in the React ecosystem; or HTML5 drag-and-drop API). Keyboard drag-and-drop must work (Space to grab, arrow keys to move columns, Space to drop).
- Lucide icons: `Bell`, `Undo2`, `BarChart2`, `Star`, `Mail`, `MessageSquare`, `GripVertical`

---

## States

### Loading (fetching registrations + evaluations)
- Four skeleton player cards in the Unassigned column; team columns show empty state skeleton.

### No Teams Defined
- Alert at top of board: "No teams defined yet. Go to Teams to create teams before running selection."
- Board columns show only "Unassigned" and "Not Selected."
- "Send Notifications" disabled.

### No Evaluations
- Alert: "No players have been evaluated yet. Run evaluations first, or proceed without scores."
- All scores show "—" instead of a number.
- Director can still run selection (manual judgment) — this is a valid workflow.

### Player Card — No Score (unevaluated)
- Score area shows "—" in neutral gray (`neutral-400`) instead of `★ 7.8`.

### Dragging a Card (desktop)
- Card being dragged: slightly scaled up (1.05), shadow increases (`shadow-lg`), opacity 0.9.
- Drop zone column highlights with `primary-100` background + `primary-500` border.
- Invalid drop target (outside a column): card snaps back to origin (animated, 150ms ease-in).

### Undo
- Last action (move) can be undone via the "Undo" button. Only one level of undo (simplest implementation). Undo is cleared when "Send Notifications" is clicked.

### Send Notifications — Sending
- Dialog "Send Notifications" button: spinner + "Sending..." Disabled. Dialog stays open.

### Send Notifications — Success
- Dialog closes. Toast: "Notifications sent to 23 parents." Board header updates: "Selections finalized — notifications sent." All player cards become read-only (no more dragging). "Send Notifications" button changes to "View notification status" (leads to a future notification log — out of scope Phase 1; button is disabled in Phase 1).

### Send Notifications — Error
- Alert inside Dialog: RFC 7807 `detail`. Retry option. Dialog stays open.

---

## Interactions

| Action | Result |
|--------|--------|
| Drag player card | Hover over column → column highlights → drop → card moves, column count updates |
| Space on player card (keyboard) | "Grabbed" state; arrow keys move between columns; Space to drop |
| Click "View scores" | Popover opens with score table; click outside or Escape to close |
| Click "Sort by: Avg score" | Re-sorts all column contents by average score, descending |
| Filter by age group | Hides cards not matching selected age group |
| Click "Undo" | Reverses last card move |
| Click "Send Notifications" button | Opens confirmation Dialog |
| Click "Send Notifications" in Dialog | Sends notifications; success state |
| Click "Cancel" in Dialog | Closes Dialog; no action |

---

## Accessibility

- Board container: `role="application"` with `aria-label="Player selection board for 12U Spring Tryout 2026"`
- Each column: `role="region"` with `aria-label="12U Elite team — 0 players assigned"`
- Draggable player card: `role="button"`, `aria-grabbed="true/false"`, `aria-label="Maya Johnson, age 11, Guard, average score 7.8. Press Space to grab and move."`, `aria-dropeffect="move"`
- After drop: `aria-live="polite"` region announces "Maya Johnson moved to 12U Elite."
- Keyboard drag path: Tab to card → Space to grab → Tab/Shift-Tab to navigate columns → Space to drop; Escape cancels drag and returns card to origin
- Score popover: `role="dialog"` with `aria-label="Scores for Maya Johnson"`; focus moves into popover; Escape closes it
- Alert for unevaluated players: `role="alert"`
- "Send Notifications" button disabled state: `aria-disabled="true"` + tooltip via `title` attribute explaining why ("Assign at least one player to a team first")
- Dialog: Radix Dialog; focus-trapped; returns focus to trigger on close

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Player list + scores | Aggregated evaluations per player | `GET /tryouts/{id}/registrations?include=scores` |
| Score breakdown | Per-coach evaluations | `GET /tryouts/{id}/registrations/{reg_id}/scores` |
| Teams available | `GET /teams?season_id=N` | `GET /teams` |
| Move player to team | `POST /selections` `{player_id, team_id, status: 'offered'}` | `POST /selections` |
| Move to Not Selected | `POST /selections` `{player_id, team_id: null, status: 'not_selected'}` | `POST /selections` |
| Move to Waitlist | `POST /selections` `{player_id, team_id: null, status: 'waitlist'}` | `POST /selections` |
| Undo | `DELETE /selections/{id}` (or `PATCH` with prior state) | `DELETE /selections/{id}` |
| Send Notifications | `POST /tryouts/{id}/notify-selections` | `POST /tryouts/{id}/notify-selections` |

**SelectionDecision entity fields (new — Architect to add to data model):**
- `tryout_registration_id` FK
- `team_id` FK (nullable for not-selected/waitlist)
- `status`: `offered` | `accepted` | `declined` | `not_selected` | `waitlist`
- `notified_at` timestamp (nullable — set when notification is sent)
- `coach_user_id` (who made the selection decision)

---

## Cross-References

- PDD-PHASE-1 flow: Selection Workflow (F7) / module-tryouts.md F4
- Related mocks: [07-coach-evaluation-mobile.md](07-coach-evaluation-mobile.md) (inputs), [10-selection-notification-email.md](10-selection-notification-email.md) and [11-selection-notification-whatsapp.md](11-selection-notification-whatsapp.md) (outputs), [12-parent-roster-acceptance.md](12-parent-roster-acceptance.md) (parent response)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md), [module-teams.md](../../../module-teams.md)

---

## Brand Placeholders Flagged

- **Column drop zone highlight:** `primary-100` background + `primary-500` border — pending brand confirmation
- **"Send Notifications" primary button:** `primary-500` — pending brand confirmation
- **Star icon (scores):** `secondary-500` (Court Orange) — this is brand accent color, not primary; is Court Orange acceptable for score stars? Flag for user if brand direction changes.
