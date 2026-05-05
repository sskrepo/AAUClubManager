---
title: "Phase 1 — Parent Roster Acceptance"
phase: 1
flow: parent-roster-acceptance
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, parent, acceptance, roster]
---

# Phase 1 — Parent Roster Acceptance

## Persona + Entry Context

**Who:** Parent. Has received a selection notification (email or WhatsApp) with a link.

**Device:** Primarily mobile (arrived via WhatsApp or email on phone). Must work perfectly on a 375px screen. Also desktop.

**Entry:** Clicks "Accept Roster Spot →" link in email, or taps the URL in WhatsApp message. URL format: `https://app.myhoopclub.com/accept?token={signed-jwt}`.

**Token behavior:**
- Time-limited signed JWT (default 72 hours from notification send time)
- Single-use: after accept or decline, token is invalidated
- Encodes: `tryout_registration_id`, `player_id`, `team_id`, `expiry`

**Auth status:** Parent may or may not be signed in. If not signed in, they are prompted to sign in (Clerk) before accepting. The token survives the Clerk sign-in redirect (appended to `redirect_url`).

---

## Layout

### Mobile — Default State (offer active, parent not yet decided)

```
┌─────────────────────────────┐
│  [Wordmark]    [Sign in]    │
│  (or user avatar if authed) │
├─────────────────────────────┤
│                             │
│  [Club badge — text]        │
│  Springfield Elite          │
│  Basketball                 │
│                             │
│  Roster spot offered!       │
│  ─────────────────          │
│                             │
│  Maya Johnson has been      │
│  selected for:              │
│                             │
│  ┌─────────────────────┐   │
│  │  Team               │   │
│  │  12U Elite          │   │
│  │  ─────────────────  │   │
│  │  Season             │   │
│  │  Spring 2026        │   │
│  │  ─────────────────  │   │
│  │  Head Coach         │   │
│  │  Jordan Martinez    │   │
│  │  ─────────────────  │   │
│  │  Offer expires in   │   │
│  │  ⏰ 47h 22m         │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │   ✓ Accept Spot     │   │
│  │   (primary button)  │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │   ✗ Decline         │   │
│  │   (outline button)  │   │
│  └─────────────────────┘   │
│                             │
│  ─────────────────          │
│                             │
│  Questions? Contact:        │
│  jordan@springfieldelite.   │
│  com                        │
│                             │
└─────────────────────────────┘
```

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Wordmark]                                      [User avatar ▾]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   ┌──────────────────────────────────────────────────────────┐      │
│   │  [Club badge]  Springfield Elite Basketball              │      │
│   │                                                          │      │
│   │  Roster spot offered!                                    │      │
│   │  ──────────────────────────────────────────────────────  │      │
│   │                                                          │      │
│   │  Maya Johnson has been selected for:                     │      │
│   │                                                          │      │
│   │  ┌────────────────┐  ┌────────────────┐                 │      │
│   │  │  Team          │  │  Season        │                 │      │
│   │  │  12U Elite     │  │  Spring 2026   │                 │      │
│   │  └────────────────┘  └────────────────┘                 │      │
│   │                                                          │      │
│   │  Head Coach: Jordan Martinez                             │      │
│   │  Offer expires: ⏰ 47h 22m                               │      │
│   │                                                          │      │
│   │  ──────────────────────────────────────────────────────  │      │
│   │                                                          │      │
│   │  [✓ Accept Roster Spot]      [✗ Decline]                │      │
│   │                                                          │      │
│   │  Questions? jordan@springfieldelite.com                  │      │
│   └──────────────────────────────────────────────────────────┘      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Accept — Confirmation State (after clicking Accept)

```
┌─────────────────────────────┐
│  [Wordmark]                 │
├─────────────────────────────┤
│                             │
│  ✓ Roster spot accepted!    │
│                             │
│  Maya Johnson is now on     │
│  the 12U Elite roster for   │
│  Spring 2026.               │
│                             │
│  Your coach will share      │
│  practice details soon.     │
│                             │
│  ─────────────────          │
│                             │
│  [View team roster]         │
│  [Go to dashboard]          │
│                             │
└─────────────────────────────┘
```

### Decline — Confirm Dialog (before final decline)

```
┌───────────────────────────┐
│  Decline roster spot?  [✕]│
│  ─────────────────────    │
│  Are you sure you want to │
│  decline Maya Johnson's   │
│  roster spot on 12U Elite?│
│                           │
│  This cannot be undone.   │
│                           │
│  [Keep offer]  [Decline]  │
└───────────────────────────┘
```

### Decline — After Confirmed

```
┌─────────────────────────────┐
│  [Wordmark]                 │
├─────────────────────────────┤
│                             │
│  Roster spot declined       │
│                             │
│  You've declined the roster │
│  spot for Maya Johnson.     │
│                             │
│  If this was a mistake,     │
│  contact your coach:        │
│  jordan@springfieldelite.   │
│  com                        │
│                             │
└─────────────────────────────┘
```

---

## States

### Offer Already Accepted

```
┌─────────────────────────────┐
│  Already accepted            │
│                             │
│  Maya Johnson accepted the  │
│  roster spot for 12U Elite  │
│  on May 2, 2026.            │
│                             │
│  [View team roster]         │
└─────────────────────────────┘
```

### Offer Already Declined

```
┌─────────────────────────────┐
│  Offer declined              │
│                             │
│  The roster spot for Maya   │
│  Johnson was declined.      │
│                             │
│  Contact your coach to      │
│  discuss options.           │
└─────────────────────────────┘
```

### Offer Expired

```
┌─────────────────────────────┐
│  This offer has expired     │
│                             │
│  The roster spot offer for  │
│  Maya Johnson expired on    │
│  May 4, 2026.               │
│                             │
│  Contact your coach:        │
│  jordan@springfieldelite.   │
│  com                        │
└─────────────────────────────┘
```

### Invalid / Tampered Token

```
┌─────────────────────────────┐
│  Invalid link               │
│                             │
│  This link is invalid or    │
│  has already been used.     │
│                             │
│  Check your email or        │
│  WhatsApp for the correct   │
│  link, or contact your      │
│  coach.                     │
└─────────────────────────────┘
```

### Not Signed In (unauthenticated parent lands on this page)

If parent is not signed in, they see the offer details but the action buttons are replaced with:

```
│  [Sign in to accept or decline]   │
│                                    │
│  (Clerk sign-in → redirects back  │
│  to this page after auth)          │
```

After sign-in, the page reloads with the full Accept / Decline buttons. The token in the URL is preserved through the Clerk redirect (appended to `afterSignInUrl`).

### Loading (page fetching offer details via token)

- Card shows Skeleton content: club name skeleton (100px wide), team info skeletons, buttons as Skeleton rectangles.
- Max 1s before real content.

### Accept — Submitting

- "✓ Accept Roster Spot" button: spinner + "Accepting..." Disabled. Decline button also disabled.
- On success: transitions to confirmation state (no separate page load; React state update).

### Decline — Submitting (after confirm Dialog)

- "Decline" button in Dialog: spinner + "Declining..." Disabled.

---

## Components Used

- Header: minimal (wordmark + sign-in link or user avatar) — same pattern as mock #05 public tryout page
- `Card` — offer details container (max-width 480px, `mx-auto`, centered)
- `Button` — "✓ Accept Roster Spot" (primary, full-width on mobile, `CheckCircle` icon), "✗ Decline" (outline, full-width on mobile, `XCircle` icon), "Keep offer" (outline), "Decline" in Dialog (destructive `variant="destructive"`)
- `Dialog` — decline confirmation (Radix Dialog; focus-trapped; Escape = "Keep offer")
- `Badge` — team name display (optional: subtle `primary-100` badge styling)
- Countdown timer: custom inline text ("⏰ 47h 22m") — computed from `offer_expiry` in token; updates every minute via `setInterval` on the client; renders `<time>` element
- `Separator` — between sections
- Lucide icons: `CheckCircle`, `XCircle`, `Clock`, `ArrowRight`

---

## Interactions

| Action | Result |
|--------|--------|
| Load page (valid token, unauthenticated) | Show offer details; show "Sign in to accept/decline" CTA |
| Load page (valid token, authenticated) | Show offer details; show Accept + Decline buttons |
| Load page (invalid token) | Show "Invalid link" state |
| Load page (expired token) | Show "Offer expired" state |
| Load page (already accepted) | Show "Already accepted" state with roster link |
| Tap "✓ Accept Roster Spot" | API call → update `SelectionDecision.status = 'accepted'` → success state shown |
| Tap "✗ Decline" | Opens confirm Dialog (not immediate action — too risky without confirm) |
| Tap "Decline" in Dialog | API call → update `SelectionDecision.status = 'declined'` → declined state shown |
| Tap "Keep offer" in Dialog | Closes Dialog; parent stays on the offer page |
| Tap "View team roster" (after accept) | Navigates to team roster page (mock #09, parent view) |
| Tap "Go to dashboard" | Navigates to parent dashboard |
| Countdown reaches 00h 00m | Page refreshes to "Offer expired" state; buttons disappear |

---

## Accessibility

- Page `<title>`: "Roster spot offer — Maya Johnson — 12U Elite — Springfield Elite Basketball"
- `<h1>`: "Roster spot offered!" or the appropriate state heading
- Accept button: `aria-label="Accept roster spot for Maya Johnson on 12U Elite"` (not just "Accept")
- Decline button: `aria-label="Decline roster spot for Maya Johnson on 12U Elite"`
- Countdown timer: `<time datetime="{ISO expiry}">47h 22m</time>`, `aria-live="off"` (it updates every minute but is not critical to announce constantly — screen reader users can read it when they focus it)
- Decline confirm Dialog: focus starts on "Keep offer" (safer default; destructive action is secondary); `role="alertdialog"`, `aria-label="Confirm declining roster spot"`
- States (expired, invalid, etc.): `role="status"` on state container for screen reader
- Coach email link: `href="mailto:jordan@springfieldelite.com"` — activatable on mobile via email app
- Signed-out state: "Sign in to accept or decline" button follows the same signed-in UX after Clerk auth; no information asymmetry

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Offer details (token decode) | Signed JWT decoded server-side; `SelectionDecision` + `Team` + `Season` fetched | `GET /accept?token={jwt}` → server validates token → returns offer details |
| Accept | `PATCH /selections/{id}` `{status: 'accepted'}` | `PATCH /selections/{id}` |
| Decline | `PATCH /selections/{id}` `{status: 'declined'}` | `PATCH /selections/{id}` |

**Token validation logic (server-side):**
1. Verify JWT signature (using `ACCEPT_TOKEN_SECRET` env var — different from Clerk secret)
2. Check `expiry` claim: if past, return expired state
3. Look up `SelectionDecision` by `tryout_registration_id`: if `status != 'offered'`, return already-acted state
4. Return offer details (team name, coach name, season name, expiry)

**After accept:** Server should:
- Update `SelectionDecision.status = 'accepted'`
- Create `RosterEntry` linking player to team
- Trigger confirmation notification (optional in Phase 1; BullMQ job)
- Invalidate the token (mark as used)

---

## Cross-References

- PDD-PHASE-1 flow: Parent Acceptance (F10) / module-tryouts.md F5
- Related mocks: [10-selection-notification-email.md](10-selection-notification-email.md) and [11-selection-notification-whatsapp.md](11-selection-notification-whatsapp.md) (source of the link), [09-team-roster.md](09-team-roster.md) (destination after accept)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)

---

## Brand Placeholders Flagged

- **Wordmark in header:** "AAUClubManager" — pending final app name
- **Accept button primary color:** `primary-500` — pending brand confirmation
- **Club badge area:** text-only ("Springfield Elite Basketball") — same as mock #05; logo upload is a future feature
- **Acceptance URL base domain (`myhoopclub.com`):** dev/UAT; backend must use `APP_BASE_URL` env var for link generation; will update to production domain at Phase 1 exit
