---
title: "Phase 1 — Team Roster View"
phase: 1
flow: team-roster
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, team, roster, coach]
---

# Phase 1 — Team Roster View

## Persona + Entry Context

**Who:** Head Coach (full management), Assistant Coach (view-only on own team), Parent (view-only — limited PII shown).

**Device:** Desktop-primary. Mobile-responsive (roster cards stack to single column).

**Entry:**
- Coach: Dashboard → "Teams" → select team → "Roster" tab
- Parent: Dashboard → "My Teams" → select team → view roster

---

## Layout

### Teams List Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  Dashboard     │                                                     │
│  Tryouts       │  Teams                            [+ New Team]     │
│  Teams     ←   │                                                     │
│  Seasons       │  Spring 2026  [▾]   ← season filter               │
│  Coaches       │                                                     │
│  Settings      │  ┌──────────────────────────────────────────────┐  │
│                │  │  12U Elite                         9 players  │  │
│                │  │  Head Coach: Jordan Martinez                  │  │
│                │  │  Asst Coach: Remy Thompson                   │  │
│                │  │                              [View] [Manage]  │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                     │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  13U Select                       12 players  │  │
│                │  │  Head Coach: Jordan Martinez                  │  │
│                │  │  (no assistant coach assigned)               │  │
│                │  │                              [View] [Manage]  │  │
│                │  └──────────────────────────────────────────────┘  │
└────────────────┴────────────────────────────────────────────────────┘
```

### Team Detail Page — Tabs

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  Dashboard     │                                                     │
│  Tryouts       │  ← Teams                                          │
│  Teams     ←   │                                                     │
│  Seasons       │  12U Elite                      [Edit] [···]      │
│  Coaches       │  Spring 2026 · Head Coach: Jordan Martinez        │
│  Settings      │                                                     │
│                │  [Roster] [Coaches] [Schedule (Phase 2)]           │
│                │  ─────────────────────────────────────────────     │
│                │                         ← active tab              │
└────────────────┴────────────────────────────────────────────────────┘
```

### Roster Tab — Coach View (full management)

```
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                     │
│                │  [Roster]  [Coaches]  [Schedule (Phase 2)]         │
│                │  ────────────────────────────────────────          │
│                │                                                     │
│                │  9 players   [+ Add Player]  [Export CSV]         │
│                │  [Search players...]                               │
│                │                                                     │
│                │  ┌────────────────────────────────────────────┐    │
│                │  │  [Avatar] Maya Johnson        #12          │    │
│                │  │  Age 11 · Guard  · maya@email.com          │    │
│                │  │  Parent: Maria Johnson · +1 312-555-0100   │    │
│                │  │  Status: [Accepted ✓]                      │    │
│                │  │                           [Edit]  [···]    │    │
│                │  ├──────────────────────────────────────────── │    │
│                │  │  [Avatar] Tyler Brooks        #5           │    │
│                │  │  Age 12 · Forward · tyler@email.com        │    │
│                │  │  Parent: Sarah Brooks · +1 555-123-4567    │    │
│                │  │  Status: [Pending ⏳]                      │    │
│                │  │                           [Edit]  [···]    │    │
│                │  ├──────────────────────────────────────────── │    │
│                │  │  [Avatar] Alex Chen           #7           │    │
│                │  │  Age 11 · Center · alex@email.com          │    │
│                │  │  Parent: Wei Chen · (no phone)             │    │
│                │  │  Status: [Accepted ✓]                      │    │
│                │  │                           [Edit]  [···]    │    │
│                │  └────────────────────────────────────────────┘    │
└────────────────┴────────────────────────────────────────────────────┘
```

### Player Detail / Edit — Slide-Over Panel (480px right-side drawer)

Clicking "Edit" on a player row opens a right-side panel (not a full page). Roster table remains visible behind the overlay.

```
┌──────────────────────────────────────────────────────────────┐
│   [blurred main content — roster table]    ┌────────────────┐│
│                                            │ Maya Johnson [✕]││
│                                            │ ──────────────  ││
│                                            │ [Tabs]          ││
│                                            │ Profile Eval.   ││
│                                            │ ──────────────  ││
│                                            │ Jersey number   ││
│                                            │ ┌────────────┐  ││
│                                            │ │  #12       │  ││
│                                            │ └────────────┘  ││
│                                            │                  ││
│                                            │ Position         ││
│                                            │ ┌────────────┐  ││
│                                            │ │  Guard [▾] │  ││
│                                            │ └────────────┘  ││
│                                            │                  ││
│                                            │ Medical notes    ││
│                                            │ ┌────────────┐  ││
│                                            │ │  Asthma    │  ││
│                                            │ │  inhaler   │  ││
│                                            │ └────────────┘  ││
│                                            │ (coach-only)    ││
│                                            │                  ││
│                                            │ Emergency contact││
│                                            │ Name: Grandma   ││
│                                            │ Phone: 312-555  ││
│                                            │                  ││
│                                            │ [Save] [Cancel] ││
│                                            └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Roster Tab — Parent View (limited PII)

Parents see their player's team but not other players' contact details or parent info.

```
│  12U Elite · Spring 2026                                       │
│  Head Coach: Jordan Martinez                                   │
│                                                                │
│  Roster (9 players)                                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  [Avatar] Maya Johnson     #12  Guard    Age 11         │  │
│  │  [Avatar] Tyler Brooks     #5   Forward  Age 12         │  │
│  │  [Avatar] Alex Chen        #7   Center   Age 11         │  │
│  │  ... (other players — name, number, position only)       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Note: Contact details for other families are not shown.      │
```

### Coaches Tab

```
│  [Roster]  [Coaches]  [Schedule (Phase 2)]                     │
│  ─────────────────────────────────────────────────            │
│                                                                │
│  Head Coach                                                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  [Avatar] Jordan Martinez   jordan@springfieldelite.com │  │
│  │                                         [Remove] (HC)   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Assistant Coaches                                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  [Avatar] Remy Thompson     remy@example.com            │  │
│  │                                         [Remove]        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  [+ Assign Assistant Coach]   (dropdown of existing club coaches)
```

---

## Components Used

- `Tabs` — Roster / Coaches / Schedule tabs on team detail page
- `Table` — player list (or Card-based list rows as shown above — either works; card rows are more responsive)
- `Avatar` — player photo or initials, 40px
- `Badge` — roster acceptance status: "Accepted" (`success-100` + `success-500` + `CheckCircle` icon), "Pending" (`warning-100` + `warning-500` + `Clock` icon), "Declined" (`error-100` + `error-500` + `XCircle` icon)
- `Button` — "Add Player" (outline, `UserPlus`), "Export CSV" (ghost, `Download`), "Edit" (ghost), "Save" (primary), "Cancel" (ghost), "Remove" (ghost, destructive styling)
- `Dialog` — "Add Player" (if adding manually post-tryout); confirm for remove/delete
- Slide-over panel: custom `Sheet` component from shadcn (`Sheet`, `SheetContent`, `SheetHeader` — 480px right-side, slide in from right, overlay behind)
- `Input` — jersey number, emergency contact fields in edit panel
- `Select` — position dropdown in edit panel
- `Textarea` — medical notes in edit panel
- `DropdownMenu` — `[···]` row actions: "Edit", "Remove from Team", "Move to Another Team"
- `Separator` — between sections in edit panel
- Lucide icons: `UserPlus`, `Download`, `Edit2`, `MoreHorizontal`, `CheckCircle`, `Clock`, `XCircle`

---

## States

### Teams List — Empty State
```
[Users icon — 48px, neutral-400]
No teams yet
Teams are created when you run a tryout and assign players.
Create teams manually if you're not running a tryout this season.
[+ Create a team manually]
```

### Roster — Loading
- 4 Skeleton rows (avatar + 3 text lines each).

### Roster — Empty (team exists but no players assigned)
```
[User icon — 48px, neutral-400]
No players on this roster yet
Players are added after tryout selection or manually.
[+ Add Player]
```

### Edit Panel — Loading (opening)
- Sheet slides in from right; player data fetches; Skeleton content inside panel.

### Edit Panel — Save
- "Save" button: spinner + "Saving..." → API call → toast: "Maya Johnson updated." Panel stays open; data refreshes.

### Export CSV
- Clicking "Export CSV": browser downloads a CSV of all player data for that team (name, jersey number, position, DOB, parent email, parent phone). No new page.
- During generation: "Export CSV" button shows spinner briefly.

### Remove Player
- `[···]` → "Remove from Team": Confirm Dialog: "Remove Maya Johnson from 12U Elite? She will be moved to unassigned." → [Cancel] [Remove]

### Add Player Manually (non-tryout path)
- Small Dialog: enter player name, DOB, position, dominant hand; parent email (to invite parent as club member). Creates `Player` record and `RosterEntry` directly.

---

## Interactions

| Action | Result |
|--------|--------|
| Click "View" on team card | Navigates to Team detail → Roster tab |
| Click "Manage" on team card | Navigates to Team detail → Coaches tab |
| Click "Edit" on player row | Opens right-side Sheet panel for that player |
| Click `[···]` on player row | DropdownMenu: Edit / Remove from Team / Move to Another Team |
| Click "Export CSV" | Downloads CSV file |
| Click "Assign Assistant Coach" | Dropdown of coaches not yet on this team; clicking a name assigns them |
| Tab between tabs (Roster / Coaches) | Smooth tab switch; shadcn Tabs component |
| Search in roster | Filters rows by name in real-time (debounced 200ms) |

---

## Accessibility

- Team detail Tabs: Radix Tabs — keyboard navigable with arrow keys; active tab indicated by `aria-selected="true"`
- "Schedule (Phase 2)" tab: `aria-disabled="true"`, tooltip via `title="Practice scheduling coming in Phase 2"`, visually grayed out
- Player row `[···]` DropdownMenu: `aria-label="Options for Maya Johnson"`
- Sheet (slide-over): `role="dialog"`, `aria-label="Edit Maya Johnson"`, focus-trapped, Escape closes
- Acceptance status Badge: text ("Accepted") not color alone; icon (`CheckCircle`, `Clock`, `XCircle`) has `aria-hidden="true"` (icon is decorative; badge text conveys status)
- Parent phone "(no phone)" note: `aria-label="No phone number on file"` — not color-coded; plain text
- Medical notes field in edit panel: `aria-label="Medical notes — visible to coaches only"` (makes the privacy context explicit to screen reader users)
- Export CSV button: after download, `aria-live="polite"` announces "Roster CSV downloaded."
- Table (if Table component used instead of Card rows): `<caption>`, `scope="col"` on headers

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Teams list | `GET /teams?season_id=N` | `GET /teams` |
| Roster (coach view) | `GET /teams/{id}/roster` with parent contact | `GET /teams/{id}/roster` |
| Roster (parent view) | Same endpoint with PII filtered server-side by role | Same; `role` from JWT determines field visibility |
| Player detail | `GET /players/{id}` | `GET /players/{id}` |
| Update player | `PATCH /players/{id}` | `PATCH /players/{id}` |
| Export CSV | `GET /teams/{id}/roster/export` → CSV response | `GET /teams/{id}/roster/export` |
| Remove player | `DELETE /roster-entries/{id}` | `DELETE /roster-entries/{id}` |
| Assign coach | `POST /team-coaches` `{team_id, user_id, role}` | `POST /team-coaches` |
| Remove coach | `DELETE /team-coaches/{id}` | `DELETE /team-coaches/{id}` |

---

## Cross-References

- PDD-PHASE-1 flow: Team Roster (F8) / module-teams.md F1–F3
- Related mocks: [08-selection-workflow.md](08-selection-workflow.md) (players arrive here after selection), [12-parent-roster-acceptance.md](12-parent-roster-acceptance.md) (parent acceptance status shown here)
- Module wiki: [module-teams.md](../../../module-teams.md)

---

## Brand Placeholders Flagged

- **Header / sidebar:** Club name display + `primary-500` — pending PHASE-1.md item #2
- **Active tab indicator:** `primary-500` underline on active tab — pending brand confirmation
- **"Add Player" / primary action buttons:** `primary-500` — pending brand confirmation
- **"Schedule (Phase 2)" disabled tab:** neutral gray — not brand-dependent
