---
title: "Phase 1 — Coach Invitation (Director Invites; Coach Accepts)"
phase: 1
flow: coach-invitation
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, coaches, invitation, director]
---

# Phase 1 — Coach Invitation

## Persona + Entry Context

**Two actors in this flow:**

1. **Director** — sends the invitation from the Coaches page. Desktop. Already authenticated.
2. **Coach (invited)** — receives an email, clicks the link, creates a Clerk account (or signs in if they already have one), lands in the app as a coach member of the club.

**Invite mechanism:** Clerk Organization Invitations. Director initiates via the app UI; our backend calls Clerk's `invitations.create` API, which sends Clerk's built-in invite email. After the coach signs up/in through Clerk's hosted UI, a Clerk webhook fires (`organizationMembership.created`) and the backend creates the `ClubMembership` row with `role: 'coach'`.

The coach then lands on a post-invite welcome screen within the app.

---

## Layout

### Director View — Coaches Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Club Name]                                        [User menu ▾]   │
├────────────────┬────────────────────────────────────────────────────┤
│  Dashboard     │                                                     │
│  Tryouts       │  Coaches                         [+ Invite Coach]  │
│  Teams         │                                                     │
│  Seasons       │  ┌──────────────────────────────────────────────┐  │
│  Coaches   ←   │  │  [Avatar] Jordan Martinez       [Head Coach] │  │
│  Settings      │  │           jordan@springfieldelite.com        │  │
│                │  │           Member since Mar 1, 2026   [···]   │  │
│                │  ├──────────────────────────────────────────────┤  │
│                │  │  [Avatar] Remy Thompson          [Assistant] │  │
│                │  │           remy@example.com                   │  │
│                │  │           Member since Mar 1, 2026   [···]   │  │
│                │  ├──────────────────────────────────────────────┤  │
│                │  │  [  ?  ]  alex@newcoach.com        [Invited] │  │
│                │  │           Invited Apr 30, 2026               │  │
│                │  │                              [Resend] [···]  │  │
│                │  └──────────────────────────────────────────────┘  │
└────────────────┴────────────────────────────────────────────────────┘
```

### Invite Coach Dialog

```
┌─────────────────────────────────────────────────────────────────────┐
│  [blurred/dimmed background]                                         │
│                                                                       │
│   ┌──────────────────────────────────────┐                          │
│   │  Invite a coach                  [✕] │                          │
│   │  ──────────────────────────────────  │                          │
│   │                                      │                          │
│   │  Email address *                     │                          │
│   │  ┌──────────────────────────────┐    │                          │
│   │  │  coach@example.com           │    │                          │
│   │  └──────────────────────────────┘    │                          │
│   │                                      │                          │
│   │  Role *                              │                          │
│   │  ┌──────────────────────────────┐    │                          │
│   │  │  Assistant Coach       [▾]   │    │                          │
│   │  └──────────────────────────────┘    │                          │
│   │  Options: Head Coach / Assistant     │                          │
│   │                                      │                          │
│   │  ℹ They'll receive an email with a   │                          │
│   │  link to join Springfield Elite.     │                          │
│   │  The link expires in 7 days.         │                          │
│   │                                      │                          │
│   │  [Cancel]        [Send Invitation]   │                          │
│   └──────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Invited Coach View — Post-Clerk-Sign-Up Welcome Screen

After the invited coach clicks the Clerk email link, creates/signs into their Clerk account, and gets redirected back to the app:

```
┌─────────────────────────────────────────────────────────────────────┐
│  [AAUClubManager wordmark]                          [User menu ▾]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │                                                          │      │
│   │  ✓  Welcome to Springfield Elite Basketball!             │      │
│   │                                                          │      │
│   │  You've joined as an Assistant Coach.                    │      │
│   │                                                          │      │
│   │  You'll have access to:                                  │      │
│   │  • Your assigned teams' rosters                          │      │
│   │  • Player evaluations during tryouts                     │      │
│   │  • Practice schedules (Phase 2)                          │      │
│   │                                                          │      │
│   │  Your Head Coach will assign you to a team once          │      │
│   │  tryouts are complete.                                   │      │
│   │                                                          │      │
│   │                         [Go to Dashboard]               │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components Used

- `Card` — coach list items; welcome screen card (max-width 520px, centered)
- `Avatar` — coach initials or photo; `?` placeholder for pending-invite coach (gray background)
- `Badge` — role tag: "Head Coach" (`primary-100` bg + `primary-700` text), "Assistant" (`neutral-100` + `neutral-600` text), "Invited" (`warning-100` + `warning-500` text)
- `Button` — "Invite Coach" (primary, `UserPlus` icon), "Send Invitation" (primary), "Cancel" (ghost), "Resend" (outline, small), "Go to Dashboard" (primary)
- `Dialog` — invite form modal
- `Input` — email address field
- `Select` — Role dropdown ("Head Coach" / "Assistant Coach")
- `DropdownMenu` — `[···]` on active coach row: "View Profile", "Change Role", "Remove from Club"
- Lucide icons: `UserPlus`, `CheckCircle`, `Mail`, `MoreHorizontal`

---

## States

### Coaches Page — Empty State (no coaches yet, director is the only member)
```
[Users icon — 48px, neutral-400]
No coaches invited yet
Invite your first coach to help manage teams and run evaluations.
[+ Invite your first coach]
```

### Coaches Page — Loading
- Skeleton rows (3 rows): avatar circle + two text lines, same height as real rows.

### Invite Dialog — Sending
- "Send Invitation" button: spinner + "Sending..." label, `disabled`. Dialog stays open.

### Invite Dialog — Success
- Dialog closes. Toast: "Invitation sent to coach@example.com." (Sonner, 4s). A new pending-invite row appears in the list with `[Invited]` badge.

### Invite Dialog — Error (email already a member)
- Alert inside Dialog: "coach@example.com is already a member of this club." Dialog stays open.

### Invite Dialog — Error (Clerk API failure)
- Alert inside Dialog: RFC 7807 `detail` string. Retry button inside Alert.

### Resend Invitation
- Clicking "Resend" on a pending-invite row: inline loading state on the button → Toast: "Invitation resent to alex@newcoach.com." Expiry reset to 7 days.

### Coach accepted (webhook fires)
- The `[Invited]` row in the coaches list updates to `[Active]` status on next page load (no real-time push in Phase 1 — requires manual refresh or polling; note this in implementation handoff).

---

## Interactions

| Action | Result |
|--------|--------|
| Click "+ Invite Coach" | Opens invite Dialog; focus → email input |
| Type invalid email format | Inline error: "Enter a valid email address" (on blur) |
| Select role | Dropdown; options: "Head Coach", "Assistant Coach" |
| Click "Send Invitation" | Validates → calls backend → Clerk invitation API → toast on success |
| Click "Resend" | Re-sends invitation; button shows loading state |
| Click `[···]` on active coach | DropdownMenu: View Profile / Change Role / Remove from Club |
| Click "Remove from Club" | Confirm Dialog: "Remove Remy Thompson from Springfield Elite? They will lose access immediately." → [Cancel] [Remove] |
| Change Role | Inline confirm: "Change Remy Thompson to Head Coach?" → [Cancel] [Change Role] |
| Press Escape in Dialog | Closes Dialog |

---

## Accessibility

- Invite Dialog: Radix Dialog — focus-trapped, closes on Escape, returns focus to trigger
- `[···]` DropdownMenu trigger: `aria-label="Options for Jordan Martinez"`
- `[Invited]` badge is readable as text, not color-only
- Role Select: `aria-label="Coach role"` with description: "Head Coach has full club access. Assistant Coach is scoped to assigned teams."
- Welcome screen `CheckCircle` icon: `aria-hidden="true"` (decorative; text conveys success)
- Remove / Change Role confirm Dialogs: destructive actions use `variant="destructive"` on the confirm button; focus starts on Cancel (safer default per UX pattern)

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Coaches list | `GET /clubs/{clubId}/members?role=coach` | `GET /members` with role filter |
| Send invitation | `POST /invitations` → backend calls Clerk invitations API | `POST /invitations` |
| Resend invitation | `POST /invitations/{id}/resend` | `POST /invitations/{id}/resend` |
| Remove coach | `DELETE /members/{userId}` → removes `ClubMembership` + Clerk org membership | `DELETE /members/{userId}` |
| Change role | `PATCH /members/{userId}` with `{role}` | `PATCH /members/{userId}` |

**Note on Clerk sync:** When coach accepts, Clerk fires `organizationMembership.created` webhook → backend creates `ClubMembership` row. The coaches list is populated from our DB, not real-time from Clerk. Phase 1 implementation can poll or require manual refresh; push updates are a Phase 2 enhancement.

---

## Cross-References

- PDD-PHASE-1 flow: Coach Invitation (F3)
- Related mocks: [09-team-roster.md](09-team-roster.md) (coach assigned to team after joining)
- Module wiki: [module-teams.md](../../../module-teams.md) — TeamCoach entity
- Data model: `ClubMembership` entity — `docs/wiki/data-model.md`

---

## Brand Placeholders Flagged

- **App header:** Club name display pending (PHASE-1.md item #2)
- **Welcome screen wordmark:** "AAUClubManager" — pending final app name
- **Primary button color:** `primary-500` — pending brand confirmation
- **Invitation email (Clerk-sent):** Clerk's own email template; no custom branding applied in Phase 1. Custom email branding (logo, colors) requires Clerk's custom email domain feature — flagged for Phase 2 if needed.
