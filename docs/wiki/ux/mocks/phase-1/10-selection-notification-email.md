---
title: "Phase 1 — Selection Notification Email Template"
phase: 1
flow: selection-notification-email
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, notification, email, selection, resend]
---

# Phase 1 — Selection Notification Email Template

## Persona + Entry Context

**Who (recipient):** Parent. Has just had their player evaluated at the tryout. Coach has run selection and clicked "Send Notifications."

**Channel:** Email via Resend. Sent from `noreply@myhoopclub.com` (placeholder; pending Resend DNS verification and final domain).

**Trigger:** `POST /tryouts/{id}/notify-selections` — server enqueues a BullMQ job per parent. The job renders the email template and sends via Resend.

**Two variants:** Selected (player offered a spot on a team) and Not Selected. These are separate template designs.

---

## Email Template — Selected Variant

### Subject Line
```
[Club Name]: Maya Johnson has been selected for 12U Elite!
```

### Full Template

```
FROM: Springfield Elite Basketball <noreply@myhoopclub.com>
TO: maria.johnson@email.com
SUBJECT: Springfield Elite Basketball: Maya Johnson has been selected for 12U Elite!

─────────────────────────────────────────────────────────────────
  [AAUClubManager wordmark or "Springfield Elite Basketball"]
  (BRAND PLACEHOLDER: final logo/wordmark here)
─────────────────────────────────────────────────────────────────

  Hi Maria,

  Great news! Maya Johnson has been selected to join:

  ┌─────────────────────────────────────────────────────┐
  │  Team:    12U Elite                                  │
  │  Season:  Spring 2026                                │
  │  Coach:   Jordan Martinez                            │
  └─────────────────────────────────────────────────────┘

  Please log in to accept or decline this roster spot.
  The offer expires in 72 hours.

  ┌─────────────────────────────────────────────────────┐
  │            [Accept Roster Spot →]                    │
  │     (button — primary color, BRAND PLACEHOLDER)     │
  └─────────────────────────────────────────────────────┘

  After accepting, you'll receive details about:
  • Practice schedule
  • Season fees and payment instructions
  • Team communication channels

─────────────────────────────────────────────────────────────────

  This notification was sent by Springfield Elite Basketball
  via AAUClubManager.

  Questions? Reply to this email or contact your coach:
  jordan@springfieldelite.com

  You're receiving this because your player registered for
  the 12U Spring Tryout 2026.

  Unsubscribe | Privacy Policy
─────────────────────────────────────────────────────────────────
```

### Template Variables

| Variable | Value | Source |
|----------|-------|--------|
| `{{club_name}}` | "Springfield Elite Basketball" | `clubs.name` |
| `{{parent_first_name}}` | "Maria" | `users.first_name` |
| `{{player_name}}` | "Maya Johnson" | `players.name` |
| `{{team_name}}` | "12U Elite" | `teams.name` |
| `{{season_name}}` | "Spring 2026" | `seasons.name` |
| `{{coach_name}}` | "Jordan Martinez" | `users.first_name + last_name` (team head coach) |
| `{{accept_url}}` | `https://app.myhoopclub.com/accept?token=...` | Time-limited signed JWT; 72-hour TTL |
| `{{coach_email}}` | "jordan@springfieldelite.com" | `users.email` (team head coach) |
| `{{offer_expiry_hours}}` | "72" | Configurable constant (default 72h) |

---

## Email Template — Not Selected Variant

### Subject Line
```
[Club Name]: An update on Maya Johnson's tryout
```

### Full Template

```
FROM: Springfield Elite Basketball <noreply@myhoopclub.com>
TO: maria.johnson@email.com
SUBJECT: Springfield Elite Basketball: An update on Maya Johnson's tryout

─────────────────────────────────────────────────────────────────
  [AAUClubManager wordmark or "Springfield Elite Basketball"]
─────────────────────────────────────────────────────────────────

  Hi Maria,

  Thank you for having Maya Johnson try out for
  Springfield Elite Basketball (Spring 2026).

  After careful evaluation, we are not able to offer
  a roster spot at this time.

  We truly appreciate Maya's effort and participation.
  We encourage her to try out again in future seasons.

─────────────────────────────────────────────────────────────────

  Questions? Contact your coach:
  jordan@springfieldelite.com

  This notification was sent by Springfield Elite Basketball
  via AAUClubManager.

  Unsubscribe | Privacy Policy
─────────────────────────────────────────────────────────────────
```

**Design decision:** The not-selected email is deliberately brief and warm. No roster details. No CTA button. The coach's email is included for direct follow-up. The language "not able to offer a roster spot at this time" is softer than "not selected" for the family-facing version (the internal system still uses status `not_selected`).

### Template Variables (not-selected)

| Variable | Value |
|----------|-------|
| `{{club_name}}` | `clubs.name` |
| `{{parent_first_name}}` | `users.first_name` |
| `{{player_name}}` | `players.name` |
| `{{season_name}}` | `seasons.name` |
| `{{coach_email}}` | team head coach's email |

---

## Waitlist Variant

### Subject Line
```
[Club Name]: Maya Johnson has been placed on the waitlist
```

### Body (brief)

```
Hi Maria,

Maya Johnson has been placed on the waitlist for
Springfield Elite Basketball (Spring 2026).

If a roster spot opens up, you'll be the first to know.

Questions? Contact your coach: jordan@springfieldelite.com
```

---

## Email Design Spec

**HTML email constraints (Resend renders HTML emails):**

| Element | Spec |
|---------|------|
| Max width | 600px centered |
| Background | `#f8fafc` (neutral-50) outer, `#ffffff` (neutral-0) inner card |
| Font | System stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif` (web fonts unreliable in email) |
| Heading font-size | 22px |
| Body font-size | 16px |
| Line height | 24px (1.5) |
| Primary button | Background `#2563eb` (primary-600 — slightly darker for email rendering safety), white text, 6px border-radius, 14px 28px padding, `font-size: 16px`, `font-weight: 600` |
| Button text | "Accept Roster Spot →" |
| Info box (selected variant) | Background `#eff6ff` (primary-50), border-left 3px solid `#3b82f6`, padding 16px |
| Footer text | `font-size: 12px`, color `#94a3b8` (neutral-400) |
| Logo/wordmark | Text fallback if no image; if image: max 200px wide, hosted in OCI |

**BRAND PLACEHOLDER NOTE:** The header wordmark renders as text "Springfield Elite Basketball" in Phase 1. If a club logo is uploaded, it replaces the text. Resend supports HTML/CSS-based email layout with image hosting. The logo URL becomes `{{club_logo_url}}` — null check required; show text fallback if null.

---

## Resend Implementation Notes

- Template is rendered server-side in TypeScript (Resend supports `react-email` or raw HTML; recommendation: use `react-email` for maintainability)
- Subject line is dynamic (includes club name, player name, team name or "update")
- `From` name: `{{club_name}} <noreply@myhoopclub.com>` — personalizes the sender
- `Reply-To`: coach's email address (so parent replies go to coach, not to noreply)
- `List-Unsubscribe` header: required for CAN-SPAM compliance; backend must implement a `/unsubscribe?token=...` endpoint
- Notification jobs are enqueued via BullMQ; one job per parent; jobs are independent (one failure does not block others)

---

## States / Delivery Scenarios

| Scenario | Handling |
|----------|---------|
| Parent has no email | Should not occur (Clerk requires email); log warning + skip |
| Email bounces (Resend webhook) | Log to notification delivery table; surface in future notification log UI (Phase 3) |
| Parent already accepted/declined | Do not resend unless coach explicitly triggers resend |
| Tryout has multiple players from same parent | Send one email per player, or one combined email? — **Open product question** (see index.md #5 note — this surfaces here too for multi-player families). For Phase 1: one email per player. Combine in Phase 3 if requested. |

---

## Cross-References

- PDD-PHASE-1 flow: Selection Notification (F9) / module-tryouts.md F4
- Related mocks: [08-selection-workflow.md](08-selection-workflow.md) (trigger), [11-selection-notification-whatsapp.md](11-selection-notification-whatsapp.md) (parallel WhatsApp), [12-parent-roster-acceptance.md](12-parent-roster-acceptance.md) ("Accept Roster Spot" link destination)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)
- Integration: `docs/wiki/integrations/resend.md` (if/when created)

---

## Brand Placeholders Flagged

- **Email "from" name:** `{{club_name}} <noreply@myhoopclub.com>` — club name from DB; email domain pending Resend DNS verification (PHASE-1.md item #3)
- **Logo/wordmark in email header:** Phase 1 uses club name text; requires club logo upload feature (not in Phase 1 scope) to show an image
- **Primary button color:** `#2563eb` (primary-600) — placeholder; will update with final brand color. Note: email HTML colors are hardcoded, not CSS variables — Architect/Frontend Dev must update the hardcoded hex when brand is confirmed.
- **App name in footer:** "AAUClubManager" — pending final app name decision (PHASE-1.md item #2)
