---
title: "Phase 1 — Public Tryout Page"
phase: 1
flow: public-tryout-page
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, tryout, public, parent, unauthenticated]
---

# Phase 1 — Public Tryout Page

## Persona + Entry Context

**Who:** Parent. Unauthenticated (no account, or not signed in). Has received a tryout registration link from the coach via text, WhatsApp, email, or social media share.

**Device:** Primarily mobile (link was likely shared via WhatsApp/SMS). Also tablet and desktop.

**Entry:** Direct link — e.g., `https://app.myhoopclub.com/t/abc123` (public, no auth required). No sign-in wall before seeing tryout info.

**Purpose of this page:** Give the parent enough information to decide to register. Clear CTA: "Register your player." After clicking, they go to the multi-step registration flow (mock #06).

---

## Layout

### Mobile Layout (375px — primary)

```
┌─────────────────────────────┐
│  [AAUClubManager]  [Sign in]│
│  (wordmark — BRAND PLACEHOLDER)
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │  Springfield Elite  │   │
│  │  Basketball         │   │
│  │  (Club badge/logo)  │   │
│  └─────────────────────┘   │
│                             │
│  12U Spring Tryout 2026     │
│  ─────────────────────      │
│                             │
│  📅 Saturday, May 10, 2026  │
│     9:00 AM – 12:00 PM      │
│                             │
│  📍 Springfield YMCA        │
│     Main Gym                │
│     123 Main St, Springfield│
│                             │
│  👥 Ages 11–12              │
│                             │
│  ─────────────────────      │
│  23 spots registered        │
│  17 spots remaining         │
│  ▓▓▓▓▓▓░░░░░  57% full     │
│                             │
│  ─────────────────────      │
│  About this tryout          │
│                             │
│  Wear athletic shoes and    │
│  comfortable clothing.      │
│  Bring water. Players       │
│  will complete skill        │
│  drills and scrimmage.      │
│                             │
│  ─────────────────────      │
│                             │
│  ┌─────────────────────┐   │
│  │  Register your player│   │
│  │     [primary CTA]   │   │
│  └─────────────────────┘   │
│                             │
│  Already have an account?   │
│  [Sign in to manage your   │
│   registrations]            │
│                             │
└─────────────────────────────┘
```

### Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [AAUClubManager wordmark]                              [Sign in]   │
│  (BRAND PLACEHOLDER)                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────┐  ┌──────────────────────────┐   │
│  │  [Club badge / logo area]     │  │  Register your player    │   │
│  │  Springfield Elite Basketball │  │                          │   │
│  │                               │  │  23 registered            │   │
│  │  12U Spring Tryout 2026       │  │  17 spots remaining       │   │
│  │                               │  │  ▓▓▓▓▓░░░░  57% full    │   │
│  │  📅 Sat, May 10, 2026         │  │                          │   │
│  │     9:00 AM – 12:00 PM        │  │  [Register your player]  │   │
│  │                               │  │  (primary button)        │   │
│  │  📍 Springfield YMCA          │  │                          │   │
│  │     123 Main St, Springfield  │  │  Already registered?     │   │
│  │                               │  │  [Sign in]               │   │
│  │  👥 Ages 11–12                │  └──────────────────────────┘   │
│  │                               │                                   │
│  │  About this tryout            │                                   │
│  │  Wear athletic shoes…         │                                   │
│  └───────────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components Used

- Header: minimal public header (logo/wordmark + "Sign in" link only — no authenticated nav)
- `Card` — registration action panel (desktop right column; mobile full-width card)
- `Button` — "Register your player" (primary, full-width on mobile, auto-width on desktop)
- `Progress` — registration fill bar (`aria-label="Registration: 23 of 40 spots filled"`)
- `Badge` — age group display: "Ages 11–12"
- `Separator` — between sections
- Lucide icons: `Calendar`, `MapPin`, `Users` (rendered inline as small icons before each info line)
- No shadcn `Alert` in default state — alert used for closed/full/cancelled states only

---

## States

### Default (open, spots available) — as shown above

### Registration Closed (deadline passed)

Replace the CTA card with:
```
┌──────────────────────────────┐
│  ⚠ Registration closed       │
│                              │
│  The registration deadline   │
│  was May 7, 2026.            │
│                              │
│  If you think this is an     │
│  error, contact your coach.  │
└──────────────────────────────┘
```
No "Register" button shown.

### Tryout Full (max registrations reached)

Replace the CTA card with:
```
┌──────────────────────────────┐
│  This tryout is full         │
│  ▓▓▓▓▓▓▓▓▓▓  100% full    │
│                              │
│  No spots are available.     │
│  Contact your coach about    │
│  being added to the waitlist.│
└──────────────────────────────┘
```

### Tryout Cancelled

Full page:
```
┌──────────────────────────────┐
│  This tryout has been        │
│  cancelled                   │
│                              │
│  Contact Springfield Elite   │
│  Basketball for details.     │
└──────────────────────────────┘
```

### Tryout Not Found / Invalid Link

```
┌──────────────────────────────┐
│  Tryout not found            │
│                              │
│  This link may have expired  │
│  or is incorrect. Check with │
│  your coach for the correct  │
│  registration link.          │
└──────────────────────────────┘
```
HTTP 404 — same minimal-header layout, no redirect to sign-in.

### Loading State

Skeleton content in place of tryout info fields. CTA card skeleton with button placeholder. Max 1s before showing real content.

---

## Interactions

| Action | Result |
|--------|--------|
| Tap/click "Register your player" | Navigates to parent registration flow (mock #06), with `tryout_id` passed as query param |
| Tap/click "Sign in" | Navigates to Clerk-hosted sign-in page; after auth, redirect back to this tryout's management view |
| Tap venue name / address | On mobile: triggers native maps deep-link (`geo:` or `maps://`); on desktop: opens Google Maps in new tab |
| Share this page | Standard browser share (no in-app share button needed; OS handles it) |

---

## Accessibility

- Page `<title>`: "12U Spring Tryout 2026 — Springfield Elite Basketball — Register"
- `<h1>`: "12U Spring Tryout 2026" (tryout name)
- `<h2>`: "Springfield Elite Basketball" (club name)
- Lucide icon rows (`Calendar`, `MapPin`, `Users`): icons are `aria-hidden="true"`; adjacent text carries the meaning
- Progress bar: `role="progressbar"` with `aria-valuenow="23"`, `aria-valuemax="40"`, `aria-label="Registration: 23 of 40 spots filled"`
- CTA button: full-width on mobile meets 44px height minimum; `aria-label="Register your player for 12U Spring Tryout 2026"`
- "Already registered? Sign in" link: sufficient contrast and not color-only
- Closed/Full/Cancelled Alert: `role="alert"` for screen reader announcement; also visible in layout as a prominent card replacement
- No CAPTCHA or verification on this public page — registration flow (mock #06) handles identity

---

## Data Shown / API Endpoints (Forward-Look)

| UI element | Data source | API endpoint |
|-----------|-------------|--------------|
| Tryout info (name, date, time, location, age groups, notes) | `GET /public/tryouts/{slug-or-id}` | `GET /public/tryouts/{id}` (no auth required) |
| Registration count / max | Same endpoint; include `registered_count` and `max_registrations` | Same |
| Tryout status | `status` field: `published` / `closed` / `cancelled` / `complete` | Same |

**Note:** This endpoint must be unauthenticated (no Clerk JWT required). The route prefix `/public/` signals this to the auth middleware. Rate-limiting applies (e.g., 100 req/min per IP) to prevent scraping.

---

## Cross-References

- PDD-PHASE-1 flow: Parent Registration (F5 entry) / module-tryouts.md F2
- Related mocks: [04-tryout-creation.md](04-tryout-creation.md) (coach creates and publishes), [06-parent-registration.md](06-parent-registration.md) (next step)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)

---

## Brand Placeholders Flagged

- **Header wordmark:** "AAUClubManager" — pending final app name
- **Header primary color / logo:** pending brand confirmation
- **Club badge area:** Shows club name as text. If the Director uploads a club logo in Settings (future feature), it appears here. Phase 1: text-only.
- **Page URL pattern (`/t/{id}`):** short URL for shareability; Architect to confirm slug routing
