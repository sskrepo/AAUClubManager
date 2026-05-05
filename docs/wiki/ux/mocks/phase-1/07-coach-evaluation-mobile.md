---
title: "Phase 1 — Coach Evaluation (Mobile-First)"
phase: 1
flow: coach-evaluation-mobile
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, evaluation, coach, mobile-first]
---

# Phase 1 — Coach Evaluation (Mobile-First)

## Persona + Entry Context

**Who:** Head Coach or Assistant Coach. On-site at the tryout gym. Has their smartphone in hand — potentially one-handed while watching players on court. May be moving around.

**Device:** MOBILE-FIRST. iPhone/Android, portrait orientation. Design must work perfectly at 375px width with one hand. Tablet (768px) is secondary. Desktop (1024px) exists as a fallback but is not the primary use case.

**Entry:** App → Tryouts → select the active tryout → "Start Evaluation" (or directly from notification). The evaluation list is the main screen for this flow.

**Key constraints:**
- Coaches cannot see each other's scores during evaluation (private per coach). Scores are aggregated only when Head Coach opens the selection view (#08).
- Coach may be offline briefly (gym with spotty WiFi). Offline state should degrade gracefully.
- Large tap targets (44px minimum) — coaches may be wearing gym gloves or have sweaty hands.
- Minimal typing — scores are numeric input via steppers/sliders, not typed text. Text notes are optional.

---

## Layout

### Mobile — Player List (evaluation home screen)

```
┌─────────────────────────────┐
│  ← Tryout  12U Spring '26   │
│  [Search 🔍]                │
├─────────────────────────────┤
│  23 players · 8 evaluated   │
│  ▓▓▓░░░░░░░░  35%          │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │  [Photo] Maya J.    │   │
│  │  Age 11 · Guard     │   │
│  │  ✓ Evaluated        │   │
│  │              [Edit] │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  [Photo] Tyler B.   │   │
│  │  Age 12 · Forward   │   │
│  │  — Not evaluated    │   │
│  │           [Evaluate]│   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │  [Photo] Alex C.    │   │
│  │  Age 11 · Center    │   │
│  │  — Not evaluated    │   │
│  │           [Evaluate]│   │
│  └─────────────────────┘   │
│                             │
│  [Show: All ▾]  [Sort ▾]   │
│                             │
└─────────────────────────────┘
```

Filter options ("Show" dropdown): All / Not Evaluated / Evaluated
Sort options: Registration order (default) / Name A–Z / Position

### Mobile — Player Evaluation Card (tap "Evaluate" or "Edit")

This is the core screen. It is a full-page view (not a modal) because it needs vertical space for 5 scoring dimensions.

```
┌─────────────────────────────┐
│  ← Player list              │
│                             │
│  Tyler Brooks               │
│  Age 12 · Forward · #8      │
│  [Photo avatar — 56px]      │
├─────────────────────────────┤
│                             │
│  SHOOTING          7 / 10   │
│  ─────────────────          │
│  [−]  ●━━━━━━━━━━━━━ [+]   │
│                             │
│  DRIBBLING         6 / 10   │
│  ─────────────────          │
│  [−]  ●━━━━━━━━━━━━ [+]    │
│                             │
│  DEFENSE           8 / 10   │
│  ─────────────────          │
│  [−]  ●━━━━━━━━━━━━━━ [+]  │
│                             │
│  COURT IQ          7 / 10   │
│  ─────────────────          │
│  [−]  ●━━━━━━━━━━━━━ [+]   │
│                             │
│  ATHLETICISM       9 / 10   │
│  ─────────────────          │
│  [−]  ●━━━━━━━━━━━━━━━ [+] │
│                             │
│  ─────────────────          │
│                             │
│  Notes (optional)           │
│  ┌─────────────────────┐   │
│  │  Great handles, can │   │
│  │  play PG if needed  │   │
│  └─────────────────────┘   │
│  (4 lines max; expandable)  │
│                             │
│  ─────────────────          │
│                             │
│  ┌─────────────────────┐   │
│  │  [Save Evaluation]  │   │
│  │   (primary button)  │   │
│  └─────────────────────┘   │
│  [Skip to next player →]    │
│                             │
└─────────────────────────────┘
```

**Scoring control design:** Each dimension uses a custom stepper row:
- `[−]` button (44×44px tap area) — decrements by 1, minimum 1
- Visual slider (track + thumb) — draggable, shows current value
- `[+]` button (44×44px tap area) — increments by 1, maximum 10
- Score displayed as large text (`text-2xl font-bold`) to the right of the dimension label

Default score for all dimensions: **5** (neutral midpoint, not 0). Coach must deliberately move off-center. This avoids the "forgot to score" ambiguity.

### Tablet Layout (768px) — Evaluation Card

On tablet, the player list and evaluation card appear side-by-side (two-column layout). The list remains on the left (300px), the evaluation card fills the right panel. The bottom sticky button moves to a footer inside the right panel.

```
┌──────────────────────────────────────────────────────────┐
│  ← Tryout  12U Spring '26                                │
├────────────────────┬─────────────────────────────────────┤
│ 23 players · 8 ev. │  Tyler Brooks — Forward             │
│ ┌──────────────┐   │  Age 12 · #8                        │
│ │[Photo]Maya J │   │                                     │
│ │ ✓ Evaluated  │   │  SHOOTING    7 ─────────────────── │
│ │       [Edit] │   │  [−] ●━━━━━━━━━━━━━━━━━━━━━━ [+]  │
│ ├──────────────┤   │                                     │
│ │[Photo]Tyler B│   │  DRIBBLING   6 ─────────────────── │
│ │  Evaluating ◄│   │  [−] ●━━━━━━━━━━━━━━━━━━━━━ [+]   │
│ ├──────────────┤   │                                     │
│ │[Photo]Alex C │   │  ... (all 5 dimensions)             │
│ │  — Pending   │   │                                     │
│ └──────────────┘   │  Notes:                             │
│                    │  ┌──────────────────────────────┐   │
│                    │  │  Great handles…               │   │
│                    │  └──────────────────────────────┘   │
│                    │                                     │
│                    │  [Save]    [← Prev]  [Next →]      │
└────────────────────┴─────────────────────────────────────┘
```

---

## Components Used

- `Card` — player list items; mobile evaluation card is full-page (no Card wrapper — edge-to-edge)
- `Avatar` — player photo or initials (56px on evaluation card, 40px in list)
- `Badge` — status: "Evaluated" (`success-100` + `success-500` text, `CheckCircle` icon), "Not evaluated" (`neutral-100` + `neutral-600`)
- `Button` — "Evaluate" (primary, full-width row action on mobile); "Edit" (outline); "Save Evaluation" (primary, full-width, sticky bottom); "Skip to next player" (ghost); `[−]` and `[+]` stepper buttons (ghost, square, 44×44px)
- `Textarea` — Notes field (4 rows visible, scrollable)
- `Input` (hidden) — backing store for each score value; the visible control is the custom stepper+slider
- `Progress` — evaluation completion bar in list header
- Custom stepper+slider: built from `<input type="range">` styled with Tailwind; min=1, max=10, step=1; paired with `[−]` / `[+]` Buttons for accessibility
- `Skeleton` — player list loading state
- Lucide icons: `Search`, `ChevronDown`, `CheckCircle`, `ArrowLeft`, `ArrowRight`

---

## States

### Player List — Loading
- 4 Skeleton cards (avatar circle + two text lines).

### Player List — Empty (no registrations yet)
```
[Users icon — 48px, neutral-400]
No players registered yet.
Share the registration link so parents can sign up.
```

### Player List — All Evaluated
- Progress bar: 100% (`success-500` fill). Badge next to count: "All evaluated!"
- Sticky bottom bar appears: "[Done — Go to Selection →]" (primary button, full-width). Navigates to selection workflow (#08).

### Evaluation Card — Navigating Between Players
- On "Skip to next player →": saves current state (even if incomplete — partial saves allowed) → loads next un-evaluated player
- On "← Player list": saves current state → returns to list

### Evaluation Card — Save
- "Save Evaluation" tapped: spinner on button + "Saving..." → API call → button returns to "Save Evaluation" state → Toast: "Tyler Brooks — Evaluation saved." (bottom of screen, 3s)
- After save: "Skip to next player" becomes "Next player →" (more confident language)

### Offline State
- Top-of-page banner (non-blocking, yellow `warning-100`): "You're offline. Scores will save when connection is restored."
- Scoring still works locally; submission queued (IndexedDB or optimistic update pattern). Note: full offline persistence is nice-to-have; at minimum, disable the save button and show the banner.

### Already Evaluated (Edit mode)
- Scores pre-filled with previously saved values. Notes pre-filled. "Save Evaluation" button label changes to "Update Evaluation."

---

## Interactions

| Action | Result |
|--------|--------|
| Tap "Evaluate" on player card | Opens full-page evaluation card for that player |
| Tap `[−]` on a dimension | Decrements score by 1 (min 1); slider thumb moves left; large score text updates |
| Tap `[+]` on a dimension | Increments score by 1 (max 10); slider thumb moves right |
| Drag slider thumb | Updates score continuously; `[−]` and `[+]` are the keyboard fallback |
| Tap Textarea | Keyboard rises; page scrolls to keep Notes in view (scroll behavior: `smooth`, `scrollIntoView({block:'nearest'})`) |
| Tap "Save Evaluation" | POSTs evaluation; toast confirmation; stays on player card |
| Tap "Skip to next player" | Auto-saves partial (no validation required) → next un-evaluated player loads |
| Tap "← Player list" | Auto-saves partial → returns to list |
| Filter "Not Evaluated" | List shows only players with no saved evaluation |
| Sort "Name A–Z" | Re-sorts list alphabetically |
| Tap search | Search input expands; filters by player name in real-time |

---

## Accessibility

- Evaluation card `<h1>`: player name ("Tyler Brooks")
- Each scoring dimension: `<fieldset>` + `<legend>{dimension name}</legend>`
- `[−]` button: `aria-label="Decrease shooting score"`, `aria-controls="score-shooting"`
- `[+]` button: `aria-label="Increase shooting score"`, `aria-controls="score-shooting"`
- Slider: `role="slider"`, `aria-valuenow`, `aria-valuemin="1"`, `aria-valuemax="10"`, `aria-label="Shooting score"`. Arrow keys work: Left/Down = decrement, Right/Up = increment.
- Score text is `aria-live="polite"` — screen reader announces value changes
- "Save Evaluation" button: `aria-label="Save evaluation for Tyler Brooks"`
- Player list "Evaluated" badge: `aria-label="Tyler Brooks, evaluation complete"`; "Not evaluated" badge: `aria-label="Tyler Brooks, not yet evaluated"`
- Progress bar in list header: `role="progressbar"`, `aria-valuenow`, `aria-label="Evaluation progress: 8 of 23 players evaluated"`
- Offline banner: `role="alert"`, `aria-live="assertive"` (more urgent than polite)
- Keyboard shortcut on tablet: pressing `S` while evaluation card is focused saves (documented as optional enhancement)

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Player list | `GET /tryouts/{id}/registrations` with `evaluated_by_me` flag | `GET /tryouts/{id}/registrations` |
| Save evaluation | `POST /evaluations` or `PUT /evaluations/{id}` (idempotent) | `POST /evaluations` |
| Update evaluation | Same endpoint (idempotent PUT) | `PUT /evaluations/{id}` |
| Evaluation progress | Derived: count of evaluations by current coach / total registrations | Included in `GET /tryouts/{id}/registrations` response |

**PlayerEvaluation entity fields (new — Architect to add to data model):**
- `tryout_registration_id` FK → `tryout_registrations.id`
- `coach_user_id` FK → `users.id`
- `score_shooting` int (1–10)
- `score_dribbling` int (1–10)
- `score_defense` int (1–10)
- `score_court_iq` int (1–10)
- `score_athleticism` int (1–10)
- `notes` text (nullable)
- `created_at`, `updated_at`

**Privacy note:** `GET /evaluations/{id}` must be scoped to the requesting coach. A coach cannot read another coach's evaluations. Aggregated scores (for selection) are only visible to the Head Coach via the selection endpoint, not via this evaluation endpoint.

---

## Cross-References

- PDD-PHASE-1 flow: Coach Evaluation (F6) / module-tryouts.md F3
- Related mocks: [04-tryout-creation.md](04-tryout-creation.md) (entry path), [08-selection-workflow.md](08-selection-workflow.md) (aggregates these scores)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)

---

## Brand Placeholders Flagged

- **Primary button color** (Evaluate, Save Evaluation): `primary-500` — pending brand confirmation
- **Slider thumb color:** uses `primary-500` — pending brand confirmation
- **Progress bar fill:** uses `primary-500` (list) and `success-500` (100% complete) — `success-500` is semantic, not brand-dependent; `primary-500` on list bar will update with brand color
- **App header:** minimal on mobile; shows "← Tryout | tryout name" — no full nav sidebar; not brand-affected beyond wordmark
