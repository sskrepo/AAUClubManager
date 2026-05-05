---
title: "Phase 1 — Parent Registration (Signup + Player Registration)"
phase: 1
flow: parent-registration
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, parent, registration, tryout, multi-step]
---

# Phase 1 — Parent Registration

## Persona + Entry Context

**Who:** Parent. Came from the public tryout page (mock #05). May or may not have an existing account.

**Device:** Primarily mobile (arrived via shared link). Layout is mobile-first; same form works on desktop.

**Flow overview:** Multi-step form.
- Step 1: Clerk account creation (or sign-in if existing) — Clerk hosts this UI; we cannot customize it beyond redirect config
- Step 2: Parent profile (pre-populated from Clerk data; confirm/complete phone number)
- Step 3: Add player(s) — name, DOB, position, dominant hand, photo (optional)
- Step 4: Confirmation screen

**Key UX constraint:** The parent must create a Clerk account before we can persist a `TryoutRegistration`. So step 1 is necessarily Clerk's hosted sign-up. After Clerk auth, we redirect back to our app at step 2 with the tryout context preserved (via `?tryout=abc123` query param through Clerk's redirect chain).

---

## Layout

### Step 1 — Clerk Sign-Up (hosted by Clerk, not our UI)

This step is rendered by Clerk's hosted sign-up page. We pass `redirect_url=/register/tryout/abc123?step=2` so Clerk returns the user here after account creation.

**Our UI context:** We do NOT design this page. We only note the redirect parameters and the "Already have an account? Sign in" flow.

**Specification for Frontend Dev:** Configure Clerk's `signUpUrl` to include the tryout context. Ensure Clerk's afterSignUpUrl redirects to step 2 of our registration form.

---

### Step 2 — Parent Profile Confirmation (our UI, mobile-first)

```
┌─────────────────────────────┐
│  [Wordmark]                 │
├─────────────────────────────┤
│                             │
│  Registering for:           │
│  12U Spring Tryout 2026     │
│  Springfield Elite          │
│  ─────────────────          │
│                             │
│  Step 2 of 4                │
│  ○●──○──○                   │
│                             │
│  Your contact info          │
│  ─────────────────          │
│                             │
│  First name *               │
│  ┌─────────────────────┐    │
│  │  Maria              │    │
│  └─────────────────────┘    │
│  (pre-filled from Clerk)    │
│                             │
│  Last name *                │
│  ┌─────────────────────┐    │
│  │  Johnson            │    │
│  └─────────────────────┘    │
│                             │
│  Phone number *             │
│  ┌─────────────────────┐    │
│  │  +1 (312) 555-0100  │    │
│  └─────────────────────┘    │
│  Used for WhatsApp          │
│  notifications.             │
│                             │
│  ℹ We'll send selection     │
│  results and updates via    │
│  email and WhatsApp.        │
│                             │
│  [Continue →]               │
│                             │
└─────────────────────────────┘
```

### Step 3 — Add Player(s) (mobile-first)

```
┌─────────────────────────────┐
│  [Wordmark]                 │
├─────────────────────────────┤
│                             │
│  Registering for:           │
│  12U Spring Tryout 2026     │
│  ─────────────────          │
│                             │
│  Step 3 of 4                │
│  ○○●─○                      │
│                             │
│  Player information         │
│  ─────────────────          │
│                             │
│  ┌─────────────────────┐    │
│  │  PLAYER 1           │    │
│  │  ─────────────────  │    │
│  │                     │    │
│  │  Full name *        │    │
│  │  ┌───────────────┐  │    │
│  │  │  Maya Johnson │  │    │
│  │  └───────────────┘  │    │
│  │                     │    │
│  │  Date of birth *    │    │
│  │  ┌───────────────┐  │    │
│  │  │  MM/DD/YYYY   │  │    │
│  │  └───────────────┘  │    │
│  │  Must be eligible   │    │
│  │  for 11U or 12U.    │    │
│  │                     │    │
│  │  Position *         │    │
│  │  ┌───────────────┐  │    │
│  │  │  Guard  [▾]   │  │    │
│  │  └───────────────┘  │    │
│  │  Guard / Forward /  │    │
│  │  Center             │    │
│  │                     │    │
│  │  Dominant hand *    │    │
│  │  ○ Right  ○ Left   │    │
│  │                     │    │
│  │  Height (optional)  │    │
│  │  ┌───────────────┐  │    │
│  │  │  e.g. 5'2"    │  │    │
│  │  └───────────────┘  │    │
│  │                     │    │
│  │  Photo (optional)   │    │
│  │  ┌───────────────┐  │    │
│  │  │  [Upload] or  │  │    │
│  │  │  [Camera]     │  │    │
│  │  └───────────────┘  │    │
│  │  Helps coaches      │    │
│  │  identify your      │    │
│  │  player at tryouts. │    │
│  │                     │    │
│  │  Emergency contact  │    │
│  │  (optional)         │    │
│  │  ┌───────────────┐  │    │
│  │  │  Name         │  │    │
│  │  └───────────────┘  │    │
│  │  ┌───────────────┐  │    │
│  │  │  Phone        │  │    │
│  │  └───────────────┘  │    │
│  └─────────────────────┘    │
│                             │
│  + Add another player       │
│                             │
│  [← Back]     [Continue →]  │
│                             │
└─────────────────────────────┘
```

**"Add another player" behavior:** Tapping "Add another player" appends a second `PLAYER 2` card below, same fields. A parent can register multiple players in one submission. Maximum 5 players per registration session (practical limit; can be raised).

### Step 4 — Confirmation

```
┌─────────────────────────────┐
│  [Wordmark]                 │
├─────────────────────────────┤
│                             │
│  ✓ Registration submitted!  │
│                             │
│  We've received Maya        │
│  Johnson's registration for │
│  12U Spring Tryout 2026.    │
│                             │
│  What happens next:         │
│  1. Coach evaluates players │
│     at the tryout.          │
│  2. You'll receive a        │
│     selection result via    │
│     email and WhatsApp.     │
│  3. Accept or decline your  │
│     roster spot.            │
│                             │
│  Check your email and       │
│  WhatsApp for confirmation. │
│                             │
│  ─────────────────          │
│                             │
│  [View my registrations]    │
│  (goes to parent dashboard) │
│                             │
└─────────────────────────────┘
```

---

## Desktop Layout (1024px+)

On desktop, the multi-step form is centered in a Card (max-width 600px, `mx-auto`), with the tryout context shown at the top of the card. The sidebar is hidden — this is a focused registration flow, not the full app shell. Header is minimal (wordmark + user avatar).

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Wordmark]                                         [User avatar]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │  12U Spring Tryout 2026 · Springfield Elite Basketball   │       │
│  │  Sat May 10 · 9–12 AM · Springfield YMCA               │       │
│  │                                                          │       │
│  │  Step 3 of 4 — Player information                        │       │
│  │  ○○●─○                                                   │       │
│  │  ─────────────────────────────────────────────────────   │       │
│  │                                                          │       │
│  │  PLAYER 1                                                │       │
│  │  Full name *          Date of birth *                    │       │
│  │  ┌──────────────────┐ ┌──────────────────┐              │       │
│  │  │  Maya Johnson    │ │  MM/DD/YYYY      │              │       │
│  │  └──────────────────┘ └──────────────────┘              │       │
│  │                                                          │       │
│  │  Position *           Dominant hand *                    │       │
│  │  ┌──────────────────┐ ○ Right   ○ Left                  │       │
│  │  │  Guard     [▾]   │                                   │       │
│  │  └──────────────────┘                                   │       │
│  │                                                          │       │
│  │  Height (optional)    Photo (optional)                   │       │
│  │  ┌──────────────────┐ ┌──────────────────┐              │       │
│  │  │  e.g. 5'2"       │ │ [Upload / Camera]│              │       │
│  │  └──────────────────┘ └──────────────────┘              │       │
│  │                                                          │       │
│  │  Emergency contact (optional)                            │       │
│  │  ┌──────────────────┐ ┌──────────────────┐              │       │
│  │  │  Name            │ │  Phone           │              │       │
│  │  └──────────────────┘ └──────────────────┘              │       │
│  │                                                          │       │
│  │                         + Add another player             │       │
│  │                                                          │       │
│  │  [← Back]                             [Continue →]      │       │
│  └──────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components Used

- `Card` — step container (desktop); full-bleed sections (mobile)
- `Button` — "Continue" (primary), "← Back" (ghost), "+ Add another player" (ghost, `Plus` icon), "View my registrations" (outline)
- `Form` (shadcn) — react-hook-form integration for all player fields
- `Input` — name, height, emergency contact name/phone
- `Select` — position (Guard / Forward / Center)
- Radio group (shadcn `RadioGroup`) — dominant hand (Right / Left)
- Date input — DOB: `<input type="date">` with shadcn Input styling; or masked text input; displays as MM/DD/YYYY
- `Separator` — between player cards when multiple players added
- File upload zone — Photo: not a standard shadcn component; custom implementation using `<input type="file" accept="image/*" capture="user">` (camera capture on mobile). Drag-and-drop on desktop. Shows thumbnail preview after selection.
- Step indicator: same pattern as mock #01 (three circles + lines)
- Lucide icons: `Plus`, `ArrowLeft`, `ArrowRight`, `CheckCircle`, `Camera`, `Upload`

---

## States

### Step 2 — Phone Number Empty (Clerk user had no phone)
- Phone field shows empty placeholder; inline helper: "Required for WhatsApp notifications. If you don't have WhatsApp, leave blank — you'll receive email only."
- Phone is required-but-skippable: CTA becomes "Continue (email notifications only)" if phone is left blank. WhatsApp notifications are suppressed for this parent.

### Step 3 — Photo Upload States
- No photo selected: two-button zone: `[Upload photo]` | `[Take photo]`
- Photo selected: thumbnail preview (60×60px avatar preview), "Remove" link, "Change" link
- Upload in progress: spinner overlay on thumbnail
- Upload error (file too large, wrong type): inline error: "Photo must be a JPG or PNG under 5MB."
- Photo is stored in OCI Object Storage; URL saved to `Player.avatar_url`

### Step 3 — Age Ineligible
If the player's DOB does not match any eligible age group for the tryout (e.g., player is 9U but tryout is for 11U/12U):
- Inline error below DOB field: "This player's age (9) is not eligible for this tryout (ages 11–12). Contact your coach if you think this is wrong."
- Continue button disabled until resolved.

### Step 3 — Multiple Players
- Each player card has a "Remove player" link in the top-right corner (not shown on single-player view to reduce clutter).
- Removing a player card shows confirm: "Remove Player 2?" → [Cancel] [Remove]. Instant (no server call yet).

### Step 4 — Confirmation Email / WhatsApp Delivery
- If parent provided phone: "Check your email and WhatsApp for confirmation."
- If parent skipped phone: "Check your email for confirmation."
- Confirmation email (see mock #10 for template) and WhatsApp (mock #11) are sent asynchronously via BullMQ.

### Submission Loading
- "Continue" on step 3: button shows spinner + "Submitting..." All fields disabled. Form does not submit twice (idempotent: use a submit token or disabled state).

### Submission Error
- Alert inside the Card: RFC 7807 `detail` string. Retry button. Data not cleared.

---

## Interactions

| Action | Result |
|--------|--------|
| Tap "Continue" on step 2 | Validates phone format (E.164 if provided); patches `User` record; advances to step 3 |
| Tap "Continue" on step 3 | Validates all player fields; submits `TryoutRegistration` for each player; advances to step 4 |
| Tap "← Back" | Returns to previous step; data preserved |
| Tap "+ Add another player" | Appends new player card with empty fields; scrolls into view |
| Tap "Remove player" on card | Confirm Dialog → removes card |
| Tap "Upload photo" | Native file picker opens |
| Tap "Take photo" | Camera app opens (mobile only; file input with `capture="user"`) |
| DOB field entry | On blur: validates age against tryout eligible groups; shows eligibility helper text ("Age: 11 — Eligible for 12U" or error) |
| Tap "View my registrations" | Navigates to parent dashboard |

---

## Accessibility

- Step indicator: same ARIA pattern as mock #01 (`aria-current="step"`, `aria-label`)
- Multi-player form: each player card is a `<fieldset>` with `<legend>Player 1</legend>`, `<legend>Player 2</legend>`
- Radio group (dominant hand): `role="radiogroup"` with `aria-label="Dominant hand"`
- File upload: `<label>` wraps the hidden `<input type="file">` so the upload zone is keyboard-focusable and activatable via Enter/Space
- Photo thumbnail (after upload): `alt="Maya Johnson's tryout photo preview"`
- Age eligibility error: `aria-live="polite"` region announces "Player is not eligible for this tryout" on DOB blur
- "Remove player" buttons: `aria-label="Remove Player 2"` (not just "Remove")
- Phone field: `autocomplete="tel"`, `inputmode="tel"` for mobile keyboards
- DOB field: `autocomplete="bday"`, `inputmode="numeric"`

---

## Data Shown / API Endpoints (Forward-Look)

| Step | Data written | API endpoint |
|------|-------------|--------------|
| Step 2 | `User.first_name`, `User.last_name`, `User.phone` | `PATCH /users/me` |
| Step 3 | `Player` record per player; `TryoutRegistration` linking player to tryout; photo upload to OCI | `POST /tryouts/{id}/register` (idempotent; creates Player + TryoutRegistration in one transaction) |
| Step 4 | Read-only confirmation; notification jobs enqueued by server | — |

Photo upload: client gets a pre-signed OCI URL via `POST /media/upload-url`, uploads directly from browser to OCI (not through the Express server), then passes the resulting URL to the register endpoint.

---

## Cross-References

- PDD-PHASE-1 flow: Parent Registration (F5) / module-tryouts.md F2
- Related mocks: [05-public-tryout-page.md](05-public-tryout-page.md) (entry), [10-selection-notification-email.md](10-selection-notification-email.md) (confirmation email)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)

---

## Brand Placeholders Flagged

- **Header wordmark:** "AAUClubManager" — pending final app name
- **Primary button color:** `primary-500` — pending brand confirmation
- **Confirmation email + WhatsApp sent at step 4:** subject/body text pending; use templates from mock #10 and #11
