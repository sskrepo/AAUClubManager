---
title: PDD — Phase 1 — Core (Tryouts + Teams)
phase: 1
status: in-review
gate: 1-pending
filed: 2026-05-04
owner: pm
deciders: user
tags: [pdd, phase:1]
---

# PDD — Phase 1 — Core (Tryouts + Teams)

> Gate 1 in-review. Reply `GATE-1-PHASE-1: approved` (or `PDD-PHASE-1: approved` / `MOCKS-PHASE-1: approved` separately) to advance to Architect's OpenAPI Gate 2.

---

## 1. Phase scope

Phase 1 delivers the end-to-end tryout lifecycle: a Club Director sets up the club and its first season, invites coaches, coaches build and publish a tryout, parents register their players, coaches evaluate players courtside on mobile, the Head Coach selects players into teams, parents receive notifications and accept or decline their roster spots, and coaches view and manage the final roster. This phase activates all four end-user personas (Director, Head Coach, Assistant Coach, Parent) and lays the data foundation (Club, Season, Team, Player, Roster) every later phase builds on. Nothing from Phase 2 onward (practice scheduling, payments, tournaments, communications) ships here.

Full scope context: [`pmo/phases.md` — Phase 1](../../../pmo/phases.md).
External setup user must complete in parallel: [`pmo/phase-briefs/PHASE-1-kickoff.md`](../../../pmo/phase-briefs/PHASE-1-kickoff.md).

---

## 2. Personas affected

| Persona | Role in Phase 1 | Activates |
|---------|----------------|-----------|
| **Director** (often also Head Coach) | Creates the Clerk Org → Club → Season; invites coaches | Phase 1 |
| **Head Coach** | Creates tryouts; runs selection; creates teams; manages roster | Phase 1 |
| **Assistant Coach** | Evaluates players at tryout; view-only on final roster | Phase 1 |
| **Parent** | Registers player(s); receives selection notification; accepts/declines roster spot | Phase 1 |
| **Player** | Evaluated at tryout; appears on roster (no Player account in Phase 1 — parent-only) | No own account until Phase 2 |

Full definitions: [`docs/wiki/personas.md`](../personas.md).

---

## 3. Cross-cutting requirements

These apply to every flow in this phase without being repeated per flow.

**Multi-tenant isolation.** Every API request is scoped to the authenticated user's Club (resolved via Clerk Org claim on the JWT). Coaches see only their club's data. The Clerk Org webhook (`organization.created`, `user.created`) drives Club and User record creation in the database; server routes must validate club membership before serving any data.

**File uploads — OCI Object Storage.** Player profile photos and any future attachments are stored in OCI Object Storage. The upload flow uses pre-signed PUT URLs (server generates, browser uploads directly — no binary data through the Express server). OCI SDK validation is a Phase 1 prerequisite; see `pmo/pending-decisions/PHASE-1.md` item #1. File size limit: 5 MB per photo. Accepted types: JPEG, PNG, WebP.

**Notifications — Resend (email) + 360dialog (WhatsApp sandbox).** Every notification that goes to a parent fires on both channels concurrently via the BullMQ notification worker. Phase 1 uses 360dialog sandbox tier (free, 200-message cap, self-number only — production tier is a Phase 3 prerequisite). Resend requires DNS verification of `myhoopclub.com` before live delivery works (see `pmo/pending-decisions/PHASE-1.md` item #3). Notification jobs must be idempotent (safe to retry on failure).

**Mobile-first evaluation.** Mock #07 (Coach Evaluation) is designed mobile-primary (portrait, one-handed, 44×44px tap targets, bottom-sheet patterns). All other screens are desktop-primary and must be responsive to 768px tablet and 375px mobile breakpoints.

**Accessibility.** All Phase 1 screens target WCAG 2.1 AA as specified in the UX mocks index. Key requirements: 4.5:1 contrast, visible focus rings, no color-only status indicators, `aria-live` regions for dynamic content, `aria-describedby` on form error messages. The placeholder brand color (`#3b82f6`) passes AA; final brand color must be re-validated at implementation.

**Clerk Organizations + roles.** Clerk Org membership carries a `role` metadata field (`director`, `head_coach`, `assistant_coach`) which is embedded in the JWT. The Express auth middleware reads this role claim and the `ClubMembership.role` in the database must match. Parents are NOT Clerk Org members — they authenticate via Clerk (standard user) but hold a `parent` role in `ClubMembership` tied to the Club (added when they first register a player).

**COPPA note.** Phase 1 collects player data including DOB, which may cover minors under 13. Data is entered by parents, not players directly (no player accounts in Phase 1). PM will flag COPPA/GDPR posture formally before Phase 2 ships publicly.

---

## 4. User flows

### Flow 1 — Club creation (Director post-Clerk Org)

**Trigger:** A Director completes Clerk sign-up and creates a Clerk Organization. The `organization.created` webhook fires.

**Persona:** Director (who may also be Head Coach)

**Preconditions:** Director has a Clerk account. No Club record exists for this Clerk Org yet.

**Happy path:**
1. Director signs up via Clerk-hosted sign-in (email or Google).
2. Director creates a Clerk Organization (name = intended club name).
3. Clerk fires `organization.created` webhook to `POST /api/webhooks/clerk`.
4. Server webhook handler creates a `Club` record (`clerk_org_id`, `name`, `slug`, `timezone`, `locale`) and a `ClubMembership` record (`role: director`, `status: active`).
5. Next.js detects first-run state (club exists, no Season yet) and routes Director to the first-run wizard.
6. **Wizard Step 1 — Club details:** Director reviews/edits club name, sets timezone. Saves.
7. **Wizard Step 2 — First season:** Director enters season name (e.g., "Summer 2026"), start date, end date. Saves. Season record created with `status: setup`.
8. **Wizard Step 3 — Done screen:** Confirms "Your club is ready." Primary CTA: "Invite coaches."

**Alternative paths:**
- Webhook fires but Club already exists for that `clerk_org_id` (duplicate delivery): handler is idempotent — returns 200, no duplicate record.
- Director skips inviting coaches from Done screen: lands on Club dashboard (empty state with invite CTA).
- Director is also acting as Head Coach (solo operator): no invitation step needed; they proceed directly to tryout creation.

**Success criteria:**
- Given a new Clerk Org is created, when the webhook fires, then a `Club` record and `ClubMembership` (`role: director`) exist in the database within 5 seconds.
- Given the first-run wizard is complete, when the Director lands on the dashboard, then a Season record with their entered dates exists and status is `setup`.
- Given the wizard is shown, when the Director skips Step 2 (season creation), then the app does not crash — it falls back to a dashboard with a "Create your first season" prompt.

**Out of scope for Phase 1:** Club logo upload, custom club subdomain, multiple Directors, Club settings/preferences page.

**Cross-references:**
- Data model: `Club`, `ClubMembership`, `Season` (`docs/wiki/data-model.md`)
- UX mock: `docs/wiki/ux/mocks/phase-1/01-club-creation.md`
- Module: `docs/wiki/module-teams.md`

---

### Flow 2 — Season creation (Director)

**Trigger:** Director clicks "New Season" from the Seasons list page (post-wizard).

**Persona:** Director / Head Coach

**Preconditions:** Club exists. User is authenticated as `director` or `head_coach`.

**Happy path:**
1. Director opens Seasons page.
2. Clicks "New season."
3. Enters season name, start date, end date. Optionally marks as "Active."
4. Saves. Season record created with `status: setup` (or `active` if checked).
5. Season appears in the list with status badge and date range.

**Alternative paths:**
- A Season with overlapping dates already exists: server returns a validation warning (not a hard block in Phase 1 — just a toast warning). Hard conflict detection is Phase 2.
- Director sets end date before start date: inline validation error before form submission.
- Director edits an existing season: same form in edit mode; `updated_at` refreshes.

**Success criteria:**
- Given valid name + date range, when saved, then a `Season` record exists for the Club with the entered values.
- Given end date < start date, when attempting to save, then an inline error appears and no record is created.
- Given a Club with no seasons, when the Seasons page loads, then an empty state with "Create your first season" CTA is shown.

**Out of scope for Phase 1:** Season archiving, season-level settings (division structure, fee templates), copying settings from a prior season.

**Cross-references:**
- Data model: `Season`
- UX mock: `docs/wiki/ux/mocks/phase-1/02-season-setup.md`

---

### Flow 3 — Coach invitation and acceptance (Director invites Coach)

**Trigger:** Director clicks "Invite coach" from the Club dashboard or Coaches page.

**Persona:** Director (inviter), Head Coach or Assistant Coach (invitee)

**Preconditions:** Club exists, Season exists. Director is authenticated.

**Happy path:**
1. Director opens "Invite coach" dialog.
2. Enters invitee email address and selects role (`head_coach` or `assistant_coach`).
3. Clicks "Send invite." Server calls Clerk Org invite API; Clerk sends invitation email to the coach.
4. Server creates a `ClubMembership` record for the coach with `status: invited`, `invited_at: now`.
5. Coach receives Clerk invitation email with "Accept invitation" link.
6. Coach clicks link, authenticates via Clerk (new account or existing), lands on post-accept welcome screen showing the club name and their role.
7. Clerk fires `organizationMembership.created` webhook. Server updates `ClubMembership` to `status: active`, `accepted_at: now`.
8. Coach is now on the Coaches list in the Director's dashboard.

**Alternative paths:**
- Invitee email already has a Clerk account: Clerk sends the invite; they accept via the invite link (no duplicate account created).
- Coach ignores invite: membership stays `status: invited`; Director can resend or revoke from the Coaches page.
- Director invites same email twice: server detects existing `invited` membership for that club and returns a 409 error — "This person already has a pending invite."
- Clerk webhook for `organizationMembership.created` fires before the user finishes Clerk sign-up (timing edge): server handler is idempotent — if membership row exists with `invited` status, update it.

**Success criteria:**
- Given a valid email and role, when Director sends invite, then a Clerk Org invitation is sent and a `ClubMembership` row with `status: invited` is created.
- Given Coach clicks the invite link and authenticates, then `ClubMembership.status` updates to `active` and Coach can access the club dashboard.
- Given a duplicate invite for the same email+club, when Director submits, then a 409 error is returned and no duplicate row is created.

**Out of scope for Phase 1:** Bulk CSV coach import, coach profile editing (bio, photo), coach permission levels beyond role (`head_coach` / `assistant_coach`).

**Cross-references:**
- Data model: `User`, `ClubMembership`
- UX mock: `docs/wiki/ux/mocks/phase-1/03-coach-invitation.md`

---

### Flow 4 — Tryout creation (Head Coach)

**Trigger:** Head Coach clicks "New tryout" from the Tryouts page or dashboard CTA.

**Persona:** Head Coach

**Preconditions:** Club exists, at least one Season in `setup` or `active` status. User has `head_coach` or `director` role.

**Happy path:**
1. Coach opens the tryout creation form.
2. Fills in: tryout name, date (calendar picker), start time, location (free text — venue name + address), eligible age groups (multi-select: 8U–18U), max registrants (optional).
3. **Evaluation criteria:** Fixed five-dimension set for Phase 1: Shooting, Dribbling, Defense, Court IQ, Athleticism (each scored 1-10). Coach sees these pre-populated; cannot add/remove dimensions in Phase 1. (Custom criteria is v1.5.)
4. Coach sets registration deadline (date + time).
5. Optionally adds a public-facing description (rich-text not required — plain textarea).
6. Clicks "Save and get link." Tryout saved with `status: draft`.
7. Coach can preview the public page, then clicks "Publish" to set `status: published` and generate the shareable registration URL.
8. Coach copies the link and shares it (via text, email, or social media — outside the app).

**Alternative paths:**
- Coach saves as draft without publishing: tryout is visible in the coach's Tryouts list but registration link returns 404 to unauthenticated visitors.
- Coach edits a published tryout (updates time/location): changes take effect immediately; existing registrations are unaffected. No notification to registered parents in Phase 1 (Phase 3 owns broadcast comms).
- Coach sets max registrants and the limit is reached: registration form shows "Registration full" and new submissions are rejected (HTTP 422 from the API).

**Success criteria:**
- Given required fields (name, date, location, age groups, deadline), when saved and published, then a public registration URL is live and accessible without authentication.
- Given `status: draft`, when an unauthenticated user visits the tryout URL, then they receive a 404 (not a partially visible page).
- Given a tryout with max registrants set and that count reached, when a new parent submits registration, then the server rejects the submission with a clear "Registration is full" error.

**Out of scope for Phase 1:** Custom evaluation dimensions, multiple tryout sessions per event, tryout fees, tryout-level waitlist (waitlist is part of selection flow, not registration).

**Cross-references:**
- Data model: `Tryout`, `TryoutRegistration` (Phase 1 entities — Architect to specify)
- UX mock: `docs/wiki/ux/mocks/phase-1/04-tryout-creation.md`
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 5 — Public tryout page (unauthenticated Parent)

**Trigger:** Parent receives a shared tryout link and opens it in a browser (no account required).

**Persona:** Parent (unauthenticated)

**Preconditions:** Tryout exists with `status: published`. Link is valid.

**Happy path:**
1. Parent opens the public tryout URL (e.g., `myhoopclub.com/t/{slug}`).
2. Page loads without authentication: shows club name, tryout name, date, location, eligible age groups, registration deadline, short description.
3. Page includes "Register your player" CTA button.
4. Clicking CTA navigates to the parent registration flow (Flow 6).

**Alternative paths:**
- Tryout is in `draft` status: page returns 404.
- Tryout registration deadline has passed: page shows "Registration closed" state; CTA is disabled. Page still viewable (for reference).
- Tryout has hit max registrant cap: page shows "Registration full" state; CTA is disabled.
- Parent is already authenticated (has a session): CTA navigates directly to player registration (skips Clerk sign-up step).

**Success criteria:**
- Given a published tryout URL, when an unauthenticated user opens it, then key details are visible without any sign-in prompt blocking the page.
- Given a draft tryout URL, when opened, then the response is 404.
- Given a past-deadline tryout, when the page loads, then the CTA is disabled and "Registration closed" is shown.

**Out of scope for Phase 1:** SEO meta tags, social share preview cards (Open Graph), tryout calendar embeds, club public directory.

**Cross-references:**
- UX mock: `docs/wiki/ux/mocks/phase-1/05-public-tryout-page.md`
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 6 — Parent and player registration (new parent)

**Trigger:** Parent clicks "Register your player" from the public tryout page (Flow 5).

**Persona:** Parent (new to the platform)

**Preconditions:** Tryout is published, registration is open, and the parent does not have an existing account.

**Happy path (4-step form — per UX mock #06):**

**Step 1 — Clerk sign-up:** Parent creates an account via Clerk (email + password, or Google OAuth). Clerk session established. Parent is not yet a Clerk Org member (parent accounts are standard Clerk users, not Org members).

**Step 2 — Parent profile:** Parent enters first name, last name, phone number (WhatsApp-capable preferred — tooltip explains why). Saved to `User` record. A `ClubMembership` record is created with `role: parent`, `status: active` for the club that owns this tryout.

**Step 3 — Player registration:** Parent enters player details:
- Required: first name, last name, date of birth, position (Guard / Forward / Center), dominant hand (Left / Right / Both)
- Required: jersey size (YS / YM / YL / YXL / AS / AM / AL / AXL)
- Optional: height, weight, school name
- Player photo: optional at registration (coach can still identify players by name on the evaluation screen — mock #07 shows avatar fallback). **PM recommendation: optional, not required, in Phase 1.**
- Photo upload uses OCI pre-signed URL flow (if provided).

A `Player` record is created linked to the parent User. A `TryoutRegistration` record is created linking the Player to the Tryout.

**Step 4 — Confirmation:** Summary of registered player(s), tryout details. Two notifications are enqueued immediately:
- Confirmation email (Resend) to parent
- WhatsApp confirmation message (360dialog sandbox) to parent's phone

Parent sees "Add another player" option to register a second child for the same tryout (loops back to Step 3).

**Alternative paths:**
- Parent already has a Clerk account (Step 1): Clerk handles "sign in" instead of "sign up"; flow continues at Step 2 (parent profile may already exist — prefilled; skip if data is complete).
- Photo upload fails (network error, bad format, size > 5 MB): inline error shown; registration can still complete without a photo.
- WhatsApp notification fails (sandbox cap reached): email still sends; WhatsApp job is marked `failed` in BullMQ — no user-visible error (silent channel fallback in Phase 1).
- Registration deadline passes mid-form: server returns 422 on submission; user sees "Registration closed" error.

**Success criteria:**
- Given a new parent completes all 4 steps, then a `User`, `ClubMembership` (role: parent), `Player`, and `TryoutRegistration` record exist in the database.
- Given a photo is uploaded, then the file is accessible via OCI Object Storage and `Player.photo_url` is set.
- Given registration completes, then a confirmation email arrives in the parent's inbox within 60 seconds.
- Given photo upload fails, when the parent clicks "Submit" without a photo, then registration completes without the photo (no hard block).

**Out of scope for Phase 1:** Tryout fees at registration, player medical form (Phase 2), emergency contact at registration (added to roster profile post-selection), parent-sets-own-password-reset flow (Clerk handles this natively).

**Cross-references:**
- Data model: `User`, `ClubMembership`, `Player`, `TryoutRegistration`
- UX mock: `docs/wiki/ux/mocks/phase-1/06-parent-registration.md`
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 7 — Multiple players, one parent

**Trigger:** Parent clicks "Add another player" on the registration confirmation screen (Step 4 of Flow 6), or returns to register a second child.

**Persona:** Parent (already authenticated and has `ClubMembership` for the club)

**Preconditions:** Parent has completed Step 1 and Step 2 of Flow 6 (Clerk account + parent profile exist). Tryout is still open.

**Happy path:**
1. Parent clicks "Add another player" from the confirmation screen.
2. Flow returns to Step 3 (player form) — parent profile (Steps 1 & 2) are not repeated.
3. Parent enters details for the second player.
4. Confirmation screen shows both registered players.

**Alternative paths:**
- Second player has same name/DOB as first (possible if twins): server does not block — two separate `Player` records are created. Coach sees both on the evaluation list.
- Parent registers a player who is already registered for this tryout (same `Player.id` + `Tryout.id`): server returns 409 — "This player is already registered." No duplicate `TryoutRegistration` created.

**Success criteria:**
- Given a parent with one registered player, when they add a second player, then two `TryoutRegistration` records exist for the same tryout, each linked to the same parent `User`.
- Given a duplicate registration attempt (same player + tryout), when submitted, then a 409 error is returned and no duplicate record is created.

**Out of scope for Phase 1:** Registering players for different tryouts in one session (each tryout has its own registration URL — parent navigates to a different URL to register for a second tryout).

**Cross-references:**
- UX mock: `docs/wiki/ux/mocks/phase-1/06-parent-registration.md` (Step 3 — "Add another player" section)

---

### Flow 8 — Returning parent (existing account, new season)

**Trigger:** Returning parent opens the public tryout registration link and clicks "Register your player."

**Persona:** Parent (has a Clerk account + `ClubMembership` from a prior season)

**Preconditions:** Parent has authenticated via Clerk before. `User` and `ClubMembership` records already exist for this club.

**Happy path:**
1. Clerk sign-in (Step 1) — existing account, no new signup required.
2. Step 2 (parent profile) — pre-filled from existing `User` record. Parent confirms or updates phone number.
3. Step 3 (player form) — existing `Player` record(s) for this parent are shown as selectable cards ("Register [Player Name] for this tryout"). Parent can select an existing player or add a new one.
4. For selected existing players: `TryoutRegistration` is created; a new `PlayerEvaluation` slot is opened for this tryout. Prior season's evaluation data is NOT carried forward (coaches re-evaluate fresh each season).
5. Confirmation shown; notifications sent.

**Alternative paths:**
- Parent's prior-season player was "not selected" — player profile still exists; parent can re-register them for the new tryout.
- Parent had a player on a prior roster who aged out of all eligible age groups for this tryout: server validation checks `Player.date_of_birth` against tryout's `age_groups` — rejects registration with a clear message ("Your player does not meet the age requirements for this tryout").

**Success criteria:**
- Given a returning parent, when they reach Step 2, then their name and phone are pre-populated.
- Given a returning parent with an existing player, when they select that player, then a new `TryoutRegistration` is created without duplicating the `Player` record.
- Given a player whose age does not meet the tryout's age group, when the parent attempts to register them, then the server rejects with a clear age-eligibility error.

**Out of scope for Phase 1:** Reusing prior season's evaluation scores, player development timeline (Phase 7), returning-player fast-track (auto-registering returning players en masse — Phase 2 operation).

**Cross-references:**
- UX mock: `docs/wiki/ux/mocks/phase-1/06-parent-registration.md` (returning user path)

---

### Flow 9 — Coach evaluates players (tryout day, mobile-first)

**Trigger:** Coach opens the tryout in the app on their phone at the gym on tryout day.

**Persona:** Head Coach or Assistant Coach

**Preconditions:** Tryout exists with `status: published`. At least one player is registered. Coach has an active `ClubMembership` for this club.

**Happy path:**
1. Coach opens the app on their phone; navigates to the active tryout.
2. Player list is shown: each player card displays name, position, age, and avatar (or initials fallback).
3. Coach taps a player to open the evaluation screen.
4. **Evaluation dimensions (fixed for Phase 1):** Shooting, Dribbling, Defense, Court IQ, Athleticism — each scored 1-10 via a stepper control (large tap targets, thumb-reachable).
5. Coach optionally adds a text note (single textarea, no voice in Phase 1).
6. Coach taps "Save." A `PlayerEvaluation` record is created (or updated if draft already exists) with: `player_id`, `coach_id`, `tryout_id`, dimension scores, note, `updated_at`.
7. Player card in the list shows a "Evaluated" badge. Coach navigates to the next player.
8. Coach can leave and return (evaluation state persists as draft) — no "Submit all" required.

**Alternative paths:**
- Coach loses connectivity mid-evaluation: the app queues the save locally and syncs when connectivity returns (optimistic UI; failure case shows a retry toast).
- Coach wants to change a score after saving: they tap the player card again — form opens pre-filled with saved values; they edit and save again.
- Two coaches evaluate the same player: each coach's `PlayerEvaluation` is stored separately (coach_id differentiates). Scores are not averaged until the selection view.

**PM recommendation baked in:** Evaluations are private per-coach until the Head Coach opens the selection view. Assistant Coaches cannot see each other's scores or the Head Coach's scores during the evaluation phase. (This is a recommendation — see Open Questions #1 for user confirmation.)

**Success criteria:**
- Given a coach on the evaluation screen, when they score all five dimensions and save, then a `PlayerEvaluation` record exists with the correct scores, `coach_id`, and `tryout_id`.
- Given a coach saves a partial evaluation, when they return to the same player, then previously entered scores are pre-populated.
- Given two coaches evaluate the same player, then two separate `PlayerEvaluation` records exist (one per coach), each with its own scores.

**Out of scope for Phase 1:** Voice memos, video clip capture, custom evaluation dimensions (v1.5), evaluation comparison between coaches during evaluation phase (visible only in selection view).

**Cross-references:**
- Data model: `PlayerEvaluation` (Phase 1 entity — Architect to specify)
- UX mock: `docs/wiki/ux/mocks/phase-1/07-coach-evaluation-mobile.md` (MOBILE-FIRST)
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 10 — Multi-coach evaluation (aggregated scores in selection view)

**Trigger:** Head Coach opens the selection view after tryout day (evaluations collected from all coaches).

**Persona:** Head Coach

**Preconditions:** At least one `PlayerEvaluation` record exists. Head Coach is authenticated with `head_coach` or `director` role.

**Happy path:**
1. Head Coach opens the selection view for the tryout.
2. Each player is shown with their **aggregated score** — average of all coaches' scores across all five dimensions.
3. Head Coach can expand a player card to see the per-coach breakdown (Coach A: 7.2 avg, Coach B: 8.0 avg).
4. Score breakdown shows dimension-level detail per coach (for the expanded view).
5. Players with no evaluations yet are flagged with a "Not evaluated" badge.

**Alternative paths:**
- Only one coach evaluated all players (solo operation): aggregated score = that coach's score (no averaging needed).
- A player has evaluations from some coaches but not others: aggregated score uses only the coaches who submitted (no zero-imputation for missing coaches).

**PM recommendation:** In the selection view, per-coach scores are shown with the coach's name (not anonymized). Anonymous evaluation is a v1.5 option. (See Open Questions #1.)

**Success criteria:**
- Given evaluations from two coaches for the same player, when the selection view loads, then the aggregated score is the mathematical average of both coaches' dimension scores.
- Given a player with no evaluations, when shown in the selection view, then a "Not evaluated" badge appears and no score is shown.
- Given the Head Coach expands a player card, then individual per-coach scores are visible with the coach's name.

**Out of scope for Phase 1:** Weighted scoring (e.g., Head Coach's scores count 2x), evaluation comparison between individual coaches (just named breakdown), anonymization toggle.

**Cross-references:**
- Data model: `PlayerEvaluation`
- UX mock: `docs/wiki/ux/mocks/phase-1/08-selection-workflow.md`

---

### Flow 11 — Selection workflow (Head Coach selects players into teams)

**Trigger:** Head Coach clicks "Open selection" for a tryout with evaluations collected.

**Persona:** Head Coach

**Preconditions:** Tryout exists, at least some players have evaluations. Head Coach has created at least one Team for the current Season (or creates Teams inline).

**Happy path:**
1. Head Coach opens the selection board — a kanban-style view (mock #08) with columns: "Unassigned" (all registered players), one column per Team, "Waitlist," "Not Selected."
2. Each player card shows: name, position, age, aggregated score. Clicking a card shows the score breakdown (per Flow 10).
3. Head Coach drags player cards from "Unassigned" into a Team column, "Waitlist," or "Not Selected."
4. As teams fill, Head Coach reviews team composition (age distribution, position balance visible as badges on each team column header).
5. Head Coach can drag players between columns to adjust (unlimited edits before confirmation).
6. When satisfied, Head Coach clicks "Confirm selections and notify parents."
7. A confirmation dialog shows the counts: X players offered spots, Y on waitlist, Z not selected.
8. On confirmation: `SelectionDecision` records are created for each player with their status. Notification jobs are enqueued (one per player) — email (Resend) + WhatsApp (360dialog sandbox).

**Alternative paths:**
- Head Coach tries to put a player on two teams: system allows only one team assignment per player per season — dragging to a second team removes them from the first.
- Head Coach has not created any Teams yet: the board shows only "Unassigned," "Waitlist," and "Not Selected" columns. A prompt appears to create a team first. Team creation can be done inline from the selection board.
- Head Coach saves the board state without confirming: selections are persisted as `status: draft` — no notifications are sent until "Confirm selections and notify parents" is clicked.

**PM recommendation on waitlist:** Single shared waitlist (not per-team) for Phase 1 simplicity. Per-team waitlist is v1.5. (See Open Questions #2.)

**Success criteria:**
- Given a player is dragged into a Team column, then a `SelectionDecision` record is created/updated with `team_id` and `status: offered`.
- Given "Confirm selections and notify parents" is clicked, then notification jobs are enqueued for all players and the tryout status updates to `selections_sent`.
- Given a player is placed on two teams, then only the most recent team assignment persists (prior assignment is overwritten).
- Given the board is closed without confirming, then all placements are saved as drafts and no notifications are sent.

**Out of scope for Phase 1:** Per-team waitlist, waitlist priority ordering, automatic waitlist promotion when a spot opens, selection report export.

**Cross-references:**
- Data model: `SelectionDecision`, `Team`, `Roster`
- UX mock: `docs/wiki/ux/mocks/phase-1/08-selection-workflow.md`
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 12 — Team creation and roster assignment (Head Coach)

**Trigger:** Head Coach clicks "New team" from the Teams page (or inline from the selection board in Flow 11).

**Persona:** Head Coach

**Preconditions:** Season exists with `status: setup` or `active`. Head Coach is authenticated.

**Happy path:**
1. Head Coach opens "Teams" page for the current Season.
2. Clicks "New team."
3. Enters: team name (e.g., "Lightning 12U"), age group (12U), level (Select / Elite / Recreational).
4. Assigns Head Coach to the team (defaults to themselves; can reassign). Optionally assigns one or more Assistant Coaches from the club's coach list.
5. Saves. `Team` record and `TeamCoach` records are created.
6. Team appears in the Teams list with roster count "0 players."
7. Players are added to the team roster through the selection workflow (Flow 11) or manually (Flow 16).

**Alternative paths:**
- Head Coach creates a team with the same name as an existing team in the same Season: server returns a validation warning (not a hard block — duplicate names are allowed with a toast warning).
- No coaches are available to assign (club has only the Director): team is created with the Director as Head Coach.

**Success criteria:**
- Given required fields (name, age group, level), when saved, then a `Team` record exists for the Season.
- Given a team is created, then it appears in the Teams list with "0 players" count.
- Given coaches are assigned, then `TeamCoach` records exist for each assigned coach.

**Out of scope for Phase 1:** Team color/uniform assignment (Phase 2 — Jerseys module), team communication channels (Phase 3), team-level schedule (Phase 2).

**Cross-references:**
- Data model: `Team`, `TeamCoach`, `Season`
- UX mock: `docs/wiki/ux/mocks/phase-1/09-team-roster.md`
- Module: `docs/wiki/module-teams.md`

---

### Flow 13 — Selection notification (email + WhatsApp)

**Trigger:** Head Coach confirms selections in Flow 11 ("Confirm selections and notify parents"). System enqueues one notification job per player.

**Persona:** System (BullMQ worker) — triggered by Head Coach action

**Preconditions:** `SelectionDecision` records exist with status `offered`, `waitlisted`, or `not_selected`. Parent `User` records have email and (optionally) phone.

**Happy path (per player notification job):**
1. BullMQ worker picks up `send-selection-notification` job.
2. Worker reads `SelectionDecision` for the player: status, team name, coach name, acceptance deadline, acceptance link.
3. **Email (Resend):** Worker calls Resend API with the appropriate template variant:
   - `offered`: "Congratulations — [Player Name] has been offered a spot on [Team Name]!" with Accept/Decline CTA.
   - `waitlisted`: "[Player Name] is on the waitlist for [Club Name] tryouts."
   - `not_selected`: "[Player Name] was not selected for [Club Name] this season."
4. **WhatsApp (360dialog sandbox):** Worker calls 360dialog API with the equivalent template message.
5. Both sends logged; job marked `completed`.

**PM recommendation — multi-player parent with both players selected:** One email per player (not one combined email), for clearer attribution. Parent receives two separate emails if both children are selected. This is simpler to implement and less likely to cause confusion about which child's spot is being accepted. (See Open Questions #5.)

**Acceptance deadline:** Head Coach sets the deadline when publishing the tryout (or can update it before sending notifications). Default if not set: 72 hours from notification send time. **PM recommendation: Head Coach sets per-tryout; 72-hour default applied if omitted.** (See Open Questions #4.)

**Alternative paths:**
- Parent has no phone number (WhatsApp unavailable): email-only notification; WhatsApp job skipped (not failed — skipped intentionally).
- Resend API error (DNS not verified, rate limit): job retries up to 3 times with exponential backoff (BullMQ default). After 3 failures: job marked `failed`; logged. No user-visible error in Phase 1 (coach can manually re-send).
- 360dialog sandbox cap reached: job marked `failed`; email still sent (channels are independent jobs or independent steps within the same job).

**Success criteria:**
- Given a player with status `offered`, when the notification job completes, then the parent receives an email with the team name and an Accept/Decline CTA link.
- Given a parent has no phone number, when the notification job runs, then only email is attempted (no WhatsApp error thrown).
- Given Resend fails 3 times, then the job is marked `failed` in BullMQ and the error is logged — no unhandled exception.

**Out of scope for Phase 1:** Read receipts, delivery confirmations, notification history view for coaches, in-app notification center, SMS fallback.

**Cross-references:**
- UX mocks: `docs/wiki/ux/mocks/phase-1/10-selection-notification-email.md`, `docs/wiki/ux/mocks/phase-1/11-selection-notification-whatsapp.md`
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 14 — Parent accepts roster spot

**Trigger:** Parent clicks the Accept or Decline link in the selection notification (email or WhatsApp).

**Persona:** Parent

**Preconditions:** `SelectionDecision` exists with `status: offered`. Acceptance deadline has not passed. The acceptance link contains a signed token identifying the player and decision.

**Happy path (Accept):**
1. Parent clicks "Accept spot" link in email or WhatsApp message.
2. Link opens the acceptance page (mobile-optimized — mock #12). Page shows: player name, team name, head coach name, tryout date, acceptance deadline countdown.
3. **Authentication state:** Parent may or may not be signed into the app. The page uses a signed token in the URL (not requiring Clerk session) for one-click acceptance. If the parent is already signed in, their session is used for audit logging.
4. Parent clicks "Accept." Page shows confirmation: "You've accepted a spot for [Player Name] on [Team Name]!"
5. Server updates `SelectionDecision.status` to `accepted`, records `accepted_at` timestamp.
6. A `Roster` record is created (or confirmed) linking the Player to the Team for this Season.
7. A confirmation email (Resend) is sent to the parent.

**Happy path (Decline):**
1. Parent clicks "Decline spot" link.
2. Page shows: same info + optional free-text reason field.
3. Parent clicks "Decline." Server updates `SelectionDecision.status` to `declined`, records `declined_at`.
4. No roster record is created. Head Coach is NOT notified in Phase 1 (coach checks roster page for status — Phase 3 adds coach notification on decline).

**Alternative paths:**
- Acceptance deadline has passed when parent clicks link: page shows "Deadline passed — this offer has expired." `SelectionDecision.status` remains `offered` (no auto-update to expired in Phase 1 — coach manually manages). Expiry job is Phase 3.
- Parent clicks Accept a second time (idempotent): server detects existing `status: accepted` for this player+tryout and returns 200 with the same confirmation — no duplicate record.
- Token is invalid or tampered: server returns 400 "Invalid or expired acceptance link."

**PM recommendation on deadline:** Default 72 hours from notification send; Head Coach can set a different deadline per tryout. The countdown is shown on the acceptance page (mock #12).

**Success criteria:**
- Given a valid acceptance link clicked before the deadline, when "Accept" is clicked, then `SelectionDecision.status` is `accepted` and a `Roster` record exists for the player+team+season.
- Given "Decline" is clicked, then `SelectionDecision.status` is `declined` and no `Roster` record exists.
- Given the deadline has passed, when the link is clicked, then the page shows "Deadline passed" and no status change occurs.
- Given an invalid token, when the link is opened, then a 400 error page is shown.

**Out of scope for Phase 1:** Parent acceptance triggering a payment flow (Phase 5), coach notification on decline (Phase 3), waitlist auto-promotion on decline, acceptance by SMS reply.

**Cross-references:**
- Data model: `SelectionDecision`, `Roster`
- UX mock: `docs/wiki/ux/mocks/phase-1/12-parent-roster-acceptance.md`
- Module: `docs/wiki/module-tryouts.md`

---

### Flow 15 — Coach views team roster

**Trigger:** Coach navigates to a Team page from the Teams list.

**Persona:** Head Coach (full view), Assistant Coach (view-only on assigned team), Parent (limited view — own player only + teammates' names)

**Preconditions:** Team exists. At least one player has accepted their roster spot.

**Happy path (Head Coach):**
1. Head Coach opens a Team page.
2. Roster tab shows: player name, position, age group, jersey size, acceptance status badge (`accepted` / `offered` / `declined` / `not_responded`), player photo (or initials).
3. Coaches tab shows: assigned Head Coach + Assistant Coaches with contact info.
4. Head Coach can click a player row to open the player detail slide-over: full profile (name, DOB, position, dominant hand, jersey size, height, weight, school, photo, parent contacts). From here: edit player profile, remove from roster.
5. CSV export of the roster (name, position, jersey size, parent email, phone) — for Phase 2 jersey ordering. Button present in Phase 1 (even though Jersey module is Phase 2 — the export is a simple data dump).

**Happy path (Assistant Coach):**
1. Assistant Coach sees only teams they are assigned to.
2. Same roster view as Head Coach but: no "Remove player" button, no parent contact details visible (privacy — parent contact shown to Head Coach only).

**Happy path (Parent):**
1. Parent logs in and navigates to their player's team page.
2. Sees: team name, team roster (player names + positions + photos — no contact details for other players' parents), Head Coach name.
3. Does NOT see: other players' acceptance status, Jersey sizes, parent contacts of other players.

**Alternative paths:**
- Team has no accepted players yet: empty roster state with "Selections sent — waiting for acceptances" message.
- Coach is not assigned to this team: `403 Forbidden` — they see only their assigned teams in the Teams list.

**Success criteria:**
- Given a Head Coach views a team roster, then all players with `SelectionDecision.status` in [`offered`, `accepted`, `declined`] are shown with their acceptance status badge.
- Given an Assistant Coach views the same roster, then parent contact details are not visible.
- Given a Parent views the team page, then only player names, positions, and photos are visible (no contact details, no acceptance status of other players).

**Out of scope for Phase 1:** Practice schedule on the team page (Phase 2), team announcements (Phase 3), payment status on the roster (Phase 5).

**Cross-references:**
- Data model: `Team`, `Roster`, `Player`, `TeamCoach`
- UX mock: `docs/wiki/ux/mocks/phase-1/09-team-roster.md`
- Module: `docs/wiki/module-teams.md`

---

### Flow 16 — Roster changes (add/remove player post-selection)

**Trigger:** Head Coach clicks "Add player" or "Remove" on the Team Roster page (Flow 15).

**Persona:** Head Coach

**Preconditions:** Team exists. Season is `active`.

**Happy path (Add player manually):**
1. Head Coach clicks "Add player" on the roster page.
2. A search/select dialog shows players registered for any tryout in this season who are not already on a team (or allows searching all players in the club's history for returning-player adds without a tryout).
3. Head Coach selects a player and clicks "Add to roster."
4. A `Roster` record is created. An `AuditLog` entry is written: who added, when, from where (manual).
5. If the player was previously offered a spot and declined, their `SelectionDecision.status` remains `declined` — the manual add is separate from the acceptance flow.

**Happy path (Remove player):**
1. Head Coach clicks "Remove" on a player row.
2. A confirmation dialog: "Remove [Player Name] from [Team Name]? This action is logged."
3. Head Coach confirms.
4. `Roster.archived_at` is set to now (soft delete — player is no longer on the active roster). An `AuditLog` entry is written.
5. No automatic notification to the parent in Phase 1 (Phase 3 adds this).

**Alternative paths:**
- Head Coach tries to add a player who is already on another team in this season: server returns a 409 "This player is already on [Other Team Name]." Head Coach must remove from the other team first.
- Head Coach removes themselves from the roster assignment: not allowed via the roster UI (coach assignment is managed on the Team settings page — separate from the player roster).

**Success criteria:**
- Given a Head Coach adds a player manually, then a `Roster` record is created and an `AuditLog` entry is written with the coach's user ID and timestamp.
- Given a Head Coach removes a player, then `Roster.archived_at` is set (soft delete) and the player no longer appears in the active roster view.
- Given a player is on Team A and a coach tries to add them to Team B, then a 409 is returned and no second `Roster` record is created.

**Out of scope for Phase 1:** Parent notification on manual add/remove (Phase 3), mid-season transfer workflow, roster freeze dates.

**Cross-references:**
- Data model: `Roster`, `AuditLog` (Phase 1 entity — Architect to specify)
- UX mock: `docs/wiki/ux/mocks/phase-1/09-team-roster.md` (add/remove actions)
- Module: `docs/wiki/module-teams.md`

---

## 5. Out of scope for Phase 1

The following are explicitly deferred — do not implement, do not add hooks for them unless naturally emergent from the data model.

- **Payments of any kind** — no tryout fees, no registration fees, no team fees. Fee amounts may be displayed on the team detail page (from a future Phase 5 field) but no payment collection. (Phase 5)
- **Player accounts** — players do not log in. Parent account only. Player login + COPPA posture for under-13 is Phase 2. (Phase 2)
- **Practice scheduling** — no schedule builder, no practice calendar, no gym booking. (Phase 2)
- **Jersey logistics** — jersey number assignment, sizing CSV export for orders. CSV export button exists in Phase 1 but the Jersey module UI is Phase 2. (Phase 2)
- **In-app messaging / broadcast comms** — no coach-to-parent message threads, no broadcast blast from the app. Notifications in Phase 1 are system-generated only (confirmation, selection result). (Phase 3)
- **Attendance tracking** — no absence reporting, no attendance log. (Phase 3)
- **Tournament management** — no tournament calendar, no game scheduling, no hotel coordination. (Phase 4)
- **360dialog production tier** — all WhatsApp in Phase 1 is sandbox. Production Meta Business verification and approved templates are Phase 3 prerequisites.
- **Custom evaluation criteria** — fixed 5-dimension set (Shooting, Dribbling, Defense, Court IQ, Athleticism). Custom criteria are v1.5.
- **Waitlist auto-promotion** — if a player declines their spot, the next waitlisted player is NOT automatically notified. Head Coach manually manages waitlist movements in Phase 1.
- **Coach notifications on parent decline** — coach checks the roster page to see acceptance status. Push/email notification to coach on decline is Phase 3.
- **E2E Playwright tests** — scoped to Phase 1 exit (alongside deployment). Unit + integration tests ship with code per convention.
- **Observability stack** — Sentry/Axiom/Datadog decision is filed at Phase 1 exit per DECISION-002-D.
- **Multi-club (superadmin view)** — no platform-level admin in Phase 1. Each club is fully isolated.

---

## 6. Phase 1 exit criteria (testable checklist)

All of the following must be true before Phase 1 is closed and Phase 2 begins.

**End-to-end flows:**
- [ ] Director can create a Club via Clerk Org webhook and complete the first-run wizard
- [ ] Director can create a Season
- [ ] Director can invite a Coach; Coach can accept and access the club dashboard
- [ ] Head Coach can create and publish a tryout with a shareable URL
- [ ] Public tryout page is accessible without authentication
- [ ] Parent can register one or more players for a tryout (new + returning account paths)
- [ ] Coach can evaluate players on mobile (portrait, one-handed); evaluations persist across sessions
- [ ] Head Coach can view aggregated scores from multiple coaches in the selection view
- [ ] Head Coach can run the selection workflow (drag-and-drop) and confirm selections
- [ ] Selection notifications fire via email (Resend) AND WhatsApp (360dialog sandbox) for all three outcomes (offered / waitlisted / not_selected)
- [ ] Parent can accept a roster spot via signed link (no required Clerk login); status updates in DB
- [ ] Parent can decline; no roster record is created
- [ ] Head Coach can view the team roster with acceptance status badges
- [ ] Head Coach can add and remove players from a roster post-selection; audit log is written
- [ ] Assistant Coach sees only their assigned teams; no parent contact details visible
- [ ] Parent sees team roster (names + positions only — no other parents' contacts)

**Multi-tenant isolation:**
- [ ] Coach from Club A cannot access Club B's data (403 returned)
- [ ] Parent from Club A cannot see Club B's players (403 returned)

**Non-functional:**
- [ ] Evaluation screen is operable one-handed on 375px portrait mobile (manual test)
- [ ] All Phase 1 screens pass WCAG 2.1 AA contrast check for the final brand color
- [ ] All notification jobs are idempotent (safe to retry; no duplicate sends)
- [ ] File uploads succeed via OCI pre-signed URLs; oversized/bad-format files are rejected client-side before upload
- [ ] All API routes return 401 for unauthenticated requests (except public tryout page) and 403 for wrong-club requests
- [ ] CI passes (lint + typecheck + Vitest unit + integration tests) for all Phase 1 code

**External setup:**
- [ ] Resend DNS verification complete for `myhoopclub.com`; confirmation email actually lands in inbox (not spam)
- [ ] 360dialog sandbox messages arrive at developer's WhatsApp number
- [ ] OCI Object Storage: player photo upload + retrieval works end-to-end

---

## 7. Open questions for user

The following require user input before or during Gate 1 review. Items #1–5 were surfaced by UX during mock production. Item #6 is a Phase 0 carryover.

| # | Question | PM default (if no answer) | Blocks |
|---|----------|--------------------------|--------|
| 1 | **Evaluation visibility between coaches:** Should Assistant Coaches be able to see each other's scores (and the Head Coach's scores) during evaluation day? Or are all evaluations private per-coach until the Head Coach opens the selection view? | Private until selection view (PM recommendation above) | Story for evaluation visibility rules |
| 2 | **Waitlist type:** Single shared waitlist (one list across all teams) or per-team waitlist? | Single shared waitlist for Phase 1 (PM recommendation above) | Selection board column layout (mock #08) |
| 3 | **Player photo at registration:** Required, optional, or not collected at tryout registration? | Optional (PM recommendation — see Flow 6) | Mock #06 photo field requirement |
| 4 | **Acceptance deadline:** Does the Head Coach set a deadline per tryout, or is there a global club-level default? | Head Coach sets per-tryout; 72-hour default if not set (PM recommendation) | Mock #12 deadline countdown + notification template |
| 5 | **Multi-player parent notifications:** One email per player (e.g., two kids selected = two emails) or one combined email listing both? | One email per player (PM recommendation — clearer attribution) | Notification job design (Flow 13) |
| 6 | **Brand identity (carryover from Phase 0):** Primary color, logo, app name, app header display (generic "AAU Club Manager" vs. per-tenant club name). Mocks use `#3b82f6` (Club Blue) and "AAUClubManager" as placeholders. | Club Blue + "AAUClubManager" wordmark (UX placeholder) | UX mocks finalization; Gate 1 may require re-review if changed post-approval |

---

## 8. Dependencies on user

**Full setup checklist:** [`pmo/phase-briefs/PHASE-1-kickoff.md`](../../../pmo/phase-briefs/PHASE-1-kickoff.md)

**Live pending items:** [`pmo/pending-decisions/PHASE-1.md`](../../../pmo/pending-decisions/PHASE-1.md)

Summary of items blocking or mid-phase for Phase 1:

| Priority | Item | Unblocks |
|----------|------|---------|
| Blocking | OCI Object Storage credentials | Architect SDK validation; file-upload service design |
| Blocking | Brand identity (color, logo, app name, header) | UX mocks finalization; Gate 1 |
| Mid-phase | Resend DNS verification (`myhoopclub.com`) | Live email delivery in staging |
| Mid-phase | Postgres hosting (`DATABASE_URL`) | First cloud deploy |
| Mid-phase | Redis hosting (`REDIS_URL`) | BullMQ in cloud environment |
| Mid-phase | Hosting platform decision | CI/CD pipeline configuration |
| Mid-phase | Clerk webhook secret (`CLERK_WEBHOOK_SECRET`) | Club/User sync from Clerk Org events |

---

## 9. Gate 1 approval

UX filed 12 mocks at `docs/wiki/ux/mocks/phase-1/` (index: `docs/wiki/ux/mocks/phase-1/index.md`). All mocks use brand placeholders (Club Blue `#3b82f6`, "AAUClubManager" wordmark) — see Open Question #6.

To approve this PDD and the UX mocks together:

```
GATE-1-PHASE-1: approved
```

To approve separately:

```
PDD-PHASE-1: approved
MOCKS-PHASE-1: approved
```

To request changes:

```
PDD-PHASE-1: needs changes — {description}
MOCKS-PHASE-1: needs changes — {description}
```

After Gate 1 passes, Architect proceeds with `api/openapi.yaml` Phase 1 additions and files `docs/wiki/api-changes/phase-1.md` for Gate 2.
