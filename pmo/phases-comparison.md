---
title: MVP Options Comparison — A vs B vs C
source: DECISION-001-mvp-scope.md, all module wiki pages, raw requirements
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [meta, roadmap, decision:001]
status: current
---

# MVP Options Comparison — A vs B vs C

This document expands DECISION-001 so all three options are presented at the same level of
detail. It is a **plan-to-decide** document — the goal is to make trade-offs legible, not
to decide for you.

**Cross-reference:** The Architect is producing `docs/wiki/architecture-options.md` covering
tech sequencing, infra effort, and engineering risk per option. The phase names and numbers
in both documents are aligned 1:1. Read the Architect's doc for build-order and tech risk;
read this doc for scope, user value, and delivery risk.

---

## ★ AGENT-PACE RE-BASELINE (added 2026-05-03)

**Important:** This document was originally written assuming 1 human backend + 1 human
frontend engineer. With agent-driven development, the timelines compress significantly —
but not uniformly. Code-writing collapses 10-50×; external dependencies (Twilio approval,
DNS propagation, your decisions) do not compress.

| Phase | Original (human-pace) | Agent-pace realistic | Floor (no friction) | Ceiling (friction) |
|-------|----------------------|---------------------|--------------------|--------------------|
| Phase 0 — Foundation | 3.5 wks | **1-2 wks** (Twilio approval is long pole) | 1 wk | 3 wks |
| Phase 1 — Core | 6 wks | **1-2 wks** | 4 days | 3 wks |
| Phase 2 — Operations | 5 wks | **1-2 wks** | 4 days | 3 wks |
| Phase 3 — Practice Comms | 5 wks | **1-2 wks** | 5 days | 3 wks |
| Phase 4 — Tournaments (B only) | 5.5 wks | **1-2 wks** | 5 days | 3 wks |
| Phase 5 — Payments (B only) | 4 wks | **1-2 wks** | 5 days | 3 wks |
| **Option A total** | **~14 wks** | **~4-8 wks** (~1-2 months) | ~3 wks | ~12 wks |
| **Option B total** | **~23 wks** | **~6-12 wks** (~1.5-3 months) | ~4 wks | ~18 wks |
| **Option C total** | **~23 wks** | **~5-10 wks for ops + AI variance** | ~4 wks | ~24 wks (AI risk) |

**What compresses (agent code-writing):** CRUD endpoints, UI screens, tests, migrations,
SDK regeneration, refactors, documentation. Most "dev-week" activities collapse to hours.

**What does NOT compress (clock time / your time):**
- **External approvals** — Twilio WhatsApp Business: **1-3 weeks** (Meta business verification). This is the longest pole in Option A and B.
- **DNS propagation** — Resend domain verification: hours-days
- **Your decisions** — DECISION files, scope calls, UX trade-offs
- **Real-world testing** — does WhatsApp actually deliver, does the gym have wifi, does the schedule generator handle DST
- **Iteration based on usage** — coaches will use it differently than expected; expect re-design cycles
- **Bug fixes after each phase ships** — ~1 week per phase for real-world friction

**Why Option C variance is widest:** Phase 6-partial introduces 3 net-new third-party
integrations (STT, LLM, object storage) AND requires real-gym audio testing that can't be
agent-simulated. Best case ~5 wks total; worst case 6+ months if STT quality is unworkable.

**Practical implication:** Option B at agent pace is plausibly **a 6-10 week build** rather
than a 5.5-month commitment. The Twilio WhatsApp approval gate (start now, finishes in
~2 wks) is the single biggest schedule risk for any option.

**See [`pmo/phase-briefs/PHASE-0-kickoff.md`](phase-briefs/PHASE-0-kickoff.md) for the
external-dependency setup list — these are the items that actually pace the project.**

---

## Original analysis (human-pace, kept for context)

The remainder of this document uses the original 1-backend + 1-frontend baseline. Use the
agent-pace table above for actual project planning. Detailed scope/stories/risks below
remain accurate; only the dev-week numbers need translation.

Assumes: 1 backend engineer + 1 frontend engineer. Phase 0 (infra scaffolding, auth, design
system) is a shared prerequisite for all three options and is excluded from estimates below.

---

## Option A — "Coach's Daily Tool"

**Thesis:** Ship the smallest product that replaces the patchwork of WhatsApp groups and
spreadsheets for a single AAU season — tryouts through communications. Validate the user
base before extending.

---

### Phase A-1 — Core Club Setup (Weeks 1-4)

**Scope in:**
- Multi-tenant club creation; invite-based coach and parent accounts
- Head Coach defines season and creates teams (name, age group, level, coach assignment)
- Player profile creation (from tryout or manual import)
- Role-based access: Head Coach full admin, Assistant Coach scoped to own team(s),
  Parent read-only on their player, Player read-only on self
- Clerk auth fully wired

**Scope explicitly out:**
- Practice scheduling (Phase A-2)
- Communications (Phase A-3)
- Payments, tournaments, AI (deferred entirely from Option A)

**Key stories:**
- Create a club and invite coaches
- Define a season with multiple teams
- Import or manually add players to a roster
- Parent and player account creation via email invite
- Role-gated navigation (coach sees admin nav; parent sees player-only nav)

**Exit criteria:**
- Head Coach can log in, create a season, build two teams, and see a roster
- Parent can log in and see their child's team

**Effort:** S (3-4 weeks)

**Dependencies:** Phase 0 complete (auth, scaffold, design system seeded)

**What the coach can do at end of Phase A-1:**
Replace the paper roster and the spreadsheet of player contacts. Look up any player's
parent contact, jersey number, and medical notes in seconds.

---

### Phase A-2 — Tryouts + Practice Scheduling + Gym + Jersey (Weeks 5-11)

**Scope in:**
- Tryout event creation with public registration link
- Parent self-registration for tryout (creates parent + player account)
- Coach evaluation during tryout: per-player scoring on 5 dimensions, private notes
- Selection workflow: drag-to-team, offer notification via email + WhatsApp
- Parent acceptance/decline of roster spot
- Recurring practice template per team (days, time, default gym)
- Practice instance generation for a configurable window
- One-off practice changes (different gym, cancellation)
- Calendar view per team; parent calendar aggregating all players
- Gym registry: name, address, contact, conflict detection
- Jersey number assignment, sizing collection, order tracking
- Parent sizing-request notification; coach exports sizing CSV

**Scope explicitly out:**
- Attendance taking (Phase A-3)
- Parent absence notices (Phase A-3)
- Payments, tournaments, AI

**Key stories:**
- Coach creates tryout with registration link
- Parent registers child for tryout on mobile
- Coach scores players during tryout on tablet
- Head Coach runs selection and triggers notifications
- Parent accepts roster spot
- Coach sets recurring practice schedule for a team
- Parent views combined calendar for two kids on different teams
- Coach registers a gym and assigns to a practice
- Coach assigns jersey numbers; parent confirms sizing via notification
- Coach exports sizing CSV for vendor

**Exit criteria:**
- A coach can run a tryout from registration through selection notifications end to end
- Practice schedule is visible to all parents with the right calendar view
- Jersey sizing loop closes (parent input → CSV export)
- Notifications fire via email AND WhatsApp for tryout selection and sizing

**Effort:** L (6-7 weeks, heaviest phase — tryout flow alone is 4+ stories)

**Dependencies:** Phase A-1

**What the coach can do at end of Phase A-2:**
Run tryouts without paper forms, build rosters without a spreadsheet, publish a practice
schedule that parents can add to their calendar, and track jersey logistics in one place.
The seasonal entry point — the tryout — is fully covered.

---

### Phase A-3 — Practice Communications (Weeks 12-14)

**Scope in:**
- Parent reports player absence (tap practice → "Mark absent" + optional reason)
- Coach announcements: schedule change, gym change, cancellation
- Coach sends availability poll ("extra practice Saturday, who's in?")
- Coach takes attendance at practice on phone (pre-populated with flagged absences)
- Coach views attendance log per player across the season (absentee patterns)
- Read receipts on WhatsApp where available

**Scope explicitly out:**
- General chat (intentionally never — use WhatsApp for that)
- Tournament-specific communications (deferred)
- Payment reminders (deferred)

**Key stories:**
- Parent marks child absent from practice on mobile
- Coach receives absence notification; sees pre-practice attendance dashboard
- Coach changes gym for a practice instance and sends notification to team
- Coach cancels a practice and sends cancellation message
- Coach creates availability poll and sees aggregate response
- Coach takes attendance on phone at gym; attendance log builds

**Exit criteria:**
- Parent-to-coach and coach-to-parent communication flows work end to end
- Attendance log is populated after each practice; coach can see patterns
- Polls work end to end; response dashboard shows counts
- All communications fire via email + WhatsApp

**Effort:** M (3 weeks)

**Dependencies:** Phase A-2 (practices must exist before communications can reference them)

**What the coach can do at end of Phase A-3 (Option A complete):**
Run an entire AAU season without WhatsApp groups or spreadsheets. Tryout players, build
teams, publish schedules, manage gyms and jerseys, communicate changes instantly, and
track attendance over time. Payments and tournaments are still external.

---

### Option A — Total Timeline

**~14 calendar weeks** from Phase 0 completion (roughly 3.5 months).

### Option A — Top 3 Risks

1. **Delivery risk — tryout flow complexity.** The evaluation + selection + notification
   loop in Phase A-2 involves audio/WhatsApp integration, parent account creation on first
   login, and multi-coach scoring with hidden-until-selection visibility rules. This is the
   densest story cluster and is most likely to slip 1-2 weeks.

2. **Value risk — no payments, no tournaments.** A Head Coach who uses this from tryouts
   through communications will still be using a spreadsheet for fee tracking and a group
   text for tournament logistics. The "replace everything" promise is not fulfilled. Risk of
   low retention after initial adoption.

3. **Scope creep risk — "just add payment reminders."** Once coaches are using the
   communications module, the request to add a "who hasn't paid yet" nudge will feel
   trivially small. Without a firm scope boundary, Option A tends to grow into Option B
   mid-flight.

### Option A — What's deferred (features coach has expressed need for)

- Payment tracking and automated fee reminders (expressed directly in requirements)
- Tournament management — schedule, game-day communications, jersey color callouts
- Travel tournament hotel coordination
- AI practice assistant and film study
- Third-party analytics integrations

---

## Option B — "Full Season Operations"

**Thesis:** Ship the complete operational layer for an AAU season. A coach who finishes
tryouts at week 4 uses every module through the spring tournament season. The product earns
retention by being indispensable end-to-end.

Phases B-1 through B-3 are identical in scope to A-1 through A-3. They are listed with
reduced detail here; the differences begin at Phase B-4.

---

### Phase B-1 — Core Club Setup (Weeks 1-4)

Identical scope to Phase A-1.

**Effort:** S (3-4 weeks)

**What the coach can do:** Same as A-1 — replace roster spreadsheet.

---

### Phase B-2 — Tryouts + Scheduling + Gym + Jersey (Weeks 5-11)

Identical scope to Phase A-2.

**Effort:** L (6-7 weeks)

**What the coach can do:** Same as A-2 — run tryouts, publish schedules, manage jersey logistics.

---

### Phase B-3 — Practice Communications (Weeks 12-14)

Identical scope to Phase A-3.

**Effort:** M (3 weeks)

**What the coach can do:** Same as A-3 — replace WhatsApp groups for practice comms.

---

### Phase B-4 — Tournament Management (Weeks 15-19)

**Scope in:**
- Tournament calendar: Head Coach adds tournaments (name, dates, location, age groups)
- Assigns teams to tournaments; publishes to parents
- Per-game schedule entry: opponent, court, time per team
- Game schedule publication via email + WhatsApp
- Parent per-game attendance confirmation (yes/no/maybe)
- Jersey color call per game (notification to parents)
- Travel tournament: hotel options with distance, rate code, booking link, deadline
- Parent marks "booked" in app; coach sees who's where for logistics
- Game cancellation / schedule change notifications

**Scope explicitly out:**
- Hotel booking integration (parents book directly at the hotel link; we send the rate code)
- Tournament discovery / registration (Tournament Finder is in backlog)
- In-game stats (third-party, deferred to Phase 7)
- Online payment processing (Phase B-5 is tracking only)

**Key stories:**
- Coach adds a tournament and assigns teams; parents receive notification
- Coach enters game schedule after bracket released; parents see game times
- Parent confirms attendance for specific game days
- Coach posts jersey color for each game; parents see it on game card
- Coach adds hotel options for travel tournament with rate and booking link
- Parent marks hotel booked; coach sees headcount per hotel for meal planning
- Coach pushes game schedule change; parents re-confirm

**Exit criteria:**
- Coach can build a full tournament calendar for the season
- Parents can confirm per-game attendance
- Jersey color workflow closes end to end
- Travel tournament: at least one hotel workflow closed (coach adds → parent responds → coach
  sees dashboard)
- All comms fire via email + WhatsApp

**Effort:** M-L (4-5 weeks — travel hotel coordination has some complexity)

**Dependencies:** Phase B-3 (communications patterns already established); gym module
(Phase B-2) needed for booking context

**What the coach can do at end of Phase B-4:**
Plan the tournament season from the first event to the championship weekend. Parents know
their game schedule, jersey color, and hotel options before leaving home. The coach can
see at a glance who's confirmed for each day, who isn't, and where everyone is staying.

---

### Phase B-5 — Payment Tracking (Weeks 20-23)

**Scope in:**
- Head Coach defines fee per team (flat or installment plan)
- Installment schedule with due dates
- Parent-facing "owed / paid / remaining" dashboard with per-installment breakdown
- Head Coach marks payment received (date, amount, method)
- Receipt email to parent on recording
- Automated followup reminders: configurable schedule (7 days before, on due date, 3 days
  after), via email + WhatsApp
- Coach can snooze or customize reminder per parent
- Per-team financial dashboard: total owed, total received, outstanding by parent

**Scope explicitly out:**
- Online payment processing (Stripe or equivalent) — deferred to backlog
- Refunds, discounts, scholarships — deferred
- Accounting / tax reports — CSV export instead

**Key stories:**
- Coach defines fee schedule per team with two installments and due dates
- Parent views "what I owe this season" on dashboard
- Coach marks payment received; parent receives receipt email
- Automated reminder fires for overdue installment via WhatsApp
- Coach views per-team financial dashboard showing outstanding balances
- Coach snoozes a payment reminder for a specific parent

**Exit criteria:**
- Coach can set up fees for all teams in under 10 minutes
- Parent can see their complete payment status at any time
- Automated reminders fire on schedule; coach can audit reminder log
- Financial dashboard shows accurate outstanding totals

**Effort:** M (3-4 weeks — no payment processor = no PCI scope; complexity is in reminder
  scheduling and the per-parent UI)

**Dependencies:** Phase B-1 (teams and players must exist); Phase B-2 (tryout acceptance
creates the player-team link that triggers fee assignment)

**What the coach can do at end of Phase B-5 (Option B complete):**
Run the entire AAU season — tryouts, team formation, scheduling, practice management, gym
and jersey logistics, communication, tournament planning, travel hotel coordination, and
payment tracking — from a single platform. No spreadsheets, no WhatsApp groups, no
separate fee-tracking tool.

---

### Option B — Total Timeline

**~23 calendar weeks** from Phase 0 completion (roughly 5.5 months).

### Option B — Top 3 Risks

1. **Delivery risk — tournament + payment sequential dependency.** Phases B-4 and B-5 must
   come after B-3. If Phase B-2 (tryouts) slips 2 weeks, it cascades all the way to the
   payment module finishing at week 25+. The AAU season has real windows (spring tournament
   circuit typically runs March-June). Missing the season window is a critical adoption risk.

2. **Scope creep risk — travel hotel coordination becomes a product unto itself.** The
   "help parents find the right hotel" requirement from raw requirements is open-ended.
   Phase B-4 scopes this as a lightweight hotel-link-with-rate-code approach. Pressure to
   add hotel search, price comparison, or booking integrations will arrive the moment coaches
   see it. Must hold the line at "link + rate code + who booked."

3. **Market risk — undifferentiated against existing tools at launch.** Option B ships no
   AI features. SportsEngine, LeagueApps, and TeamSnap all handle scheduling, payments, and
   tournament communication. At launch, differentiation rests on WhatsApp-native
   notifications and the tryout-evaluation flow. That's a real differentiator but a narrow one.

### Option B — What's deferred

- AI Practice Assistant (Phase 6 — most-requested differentiator from requirements)
- Film Study Assistant (Phase 6)
- Third-party analytics integrations — Hudl, GameChanger (Phase 7)
- Online payment processing via Stripe (backlog)
- Finder marketplace modules (backlog)

---

## Option C — "Differentiated"

**Thesis:** Ship Phases 1-3 (the operations core) plus a simplified Practice Assistant from
Phase 6. Lead with the AI story on day one. Accept longer timeline and higher technical
risk in exchange for a meaningfully differentiated product at launch.

Phases C-1 through C-3 are identical in scope to A-1 through A-3.

---

### Phase C-1 — Core Club Setup (Weeks 1-4)

Identical scope to Phase A-1.

**Effort:** S (3-4 weeks)

---

### Phase C-2 — Tryouts + Scheduling + Gym + Jersey (Weeks 5-11)

Identical scope to Phase A-2.

**Effort:** L (6-7 weeks)

---

### Phase C-3 — Practice Communications (Weeks 12-14)

Identical scope to Phase A-3.

**Effort:** M (3 weeks)

---

### Phase C-4 — Practice Assistant (AI) — Simplified (Weeks 15-23)

This phase implements a **scoped-down version** of Module 10A (the full Practice Assistant).
The full spec is in `docs/wiki/module-coaching-intelligence.md`. The simplification removes
the technically hardest pieces (speaker diarization, real-time addressee inference) while
keeping the user-visible value.

**Scope in (simplified Practice Assistant):**
- "Start practice" command — begins a session for a specified team
- Continuous audio capture on coach's phone (requires wifi/4G at gym; note this as a
  known limitation)
- Post-practice transcription (not real-time — processes after "End practice" tap)
- Coach review screen: list of extracted notes (text + timestamp)
- Coach edits, confirms, or deletes individual notes
- Each note manually tagged to a player (coach picks from roster; no auto-identification
  in this phase — that's the hard AI problem)
- Drill suggestion per note: system queries a curated drill library, suggests 1-3 drills
  matching the note's focus area (keyword match or embedding search — Architect decides)
- Coach approves drill assignment → notification to player/parent with drill link
- Followup reminder: coach is reminded at start of next practice about any open items
  for specific players

**Scope explicitly out of C-4 (deferred to full Phase 6 if chosen):**
- Speaker diarization (who said what — very hard, defers to full phase 6)
- Automatic addressee inference (figuring out which player the coach is addressing from
  audio alone — ML problem, deferred)
- Pattern detection across multiple sessions (deferred — needs enough data)
- Film Study Assistant (separate sub-module, not in this phase)
- Video upload and annotation

**Key stories:**
- Coach taps "Start practice" for U13 Elite; app begins recording
- Coach taps "End practice"; transcript processes and notes appear within 2 minutes
- Coach sees list of extracted notes on review screen; taps to tag each to a player
- Coach deletes noise entries and confirms the real ones
- For a confirmed note, system suggests 2 drills from library; coach picks one
- Player receives notification: "Coach assigned a drill — watch this clip"
- Coach opens next practice; sees reminder panel "Open items from last practice"
- Coach adds a drill to the library manually (so it can be suggested later)

**Exit criteria:**
- Audio capture works end to end on a real iPhone/Android at a gym (wifi + LTE tested)
- Transcription is accurate enough that coach can review and edit in under 5 minutes
- Drill suggestion produces a non-empty result for at least 80% of confirmed notes
  (based on initial library seeded with 50+ drills)
- Player/parent receives notification with working drill link
- Followup reminder fires before the next scheduled practice

**Effort:** XL (8-9 weeks — audio capture, speech-to-text integration, drill library,
  review UI, notification wiring, and offline-tolerant recording all in one phase; this is
  the riskiest engineering phase of any option; see `docs/wiki/architecture-options.md`
  for tech risk detail)

**Dependencies:** Phase C-3 (player roster and practice sessions must exist); Architect
must decide STT provider (Deepgram / AssemblyAI / Whisper API) and file ADR before dev
starts; drill library must be seeded by content team before launch

**What the coach can do at end of Phase C-4 (Option C complete):**
Run a full operations season (same as Option A) plus record any practice with one tap,
get an AI-extracted note list per player, assign video drills from the library, and be
reminded about open items before the next session. This is a meaningfully different product
from anything else in the AAU market.

---

### Option C — Total Timeline

**~23 calendar weeks** from Phase 0 completion (roughly 5.5-6 months).

Note: same calendar estimate as Option B, but the risk distribution is very different.
Option B's late phases (tournaments, payments) are well-understood engineering problems.
Option C's Phase C-4 is novel AI infrastructure — the estimate has wider error bars
(best case 7 weeks, realistic 9 weeks, worst case 12 weeks if STT quality is problematic).

### Option C — Top 3 Risks

1. **Technical risk — AI quality gate.** If post-practice transcription accuracy is
   below ~80% word-error-rate on gym audio (background noise, multiple voices, sneaker
   squeaks), the note-review experience is painful rather than helpful. A coach who has to
   correct 60% of extracted notes will abandon the feature. This is the single highest
   risk item across all three options. Requires a proof-of-concept STT test in a real gym
   before committing to this phase.

2. **Delivery risk — Phase C-4 is a schedule wildcard.** If the STT integration hits
   unexpected issues (API rate limits, gym connectivity, iOS audio background mode
   restrictions), Phase C-4 can slip 3-4 weeks without any visible warning until it's
   too late. Option B's Phase B-4 and B-5 are lower-variance by comparison.

3. **UX risk — AI before basics are polished.** Coaches who encounter a broken drill
   assignment notification while their payment tracking is missing will lose trust in
   the whole product. The AI feature lands on a foundation that is solid (Phases C-1
   through C-3) but is missing two features coaches explicitly named — payments and
   tournaments. This creates a credibility gap: "fancy AI but I still use a spreadsheet
   for fees."

### Option C — What's deferred

- Payment tracking and automated reminders (expressed directly in requirements — high need)
- Tournament management (local + travel hotel coordination)
- Full Practice Assistant (speaker diarization, auto addressee inference, pattern detection)
- Film Study Assistant
- Third-party analytics integrations

---

## Side-by-Side Summary Table

| Dimension | Option A — Coach's Daily Tool | Option B — Full Season Ops | Option C — Differentiated |
|-----------|:-----------------------------:|:--------------------------:|:-------------------------:|
| Total phases | 3 | 5 | 4 |
| Total timeline | ~14 weeks (~3.5 months) | ~23 weeks (~5.5 months) | ~23 weeks (~5.5-6 months) |
| Timeline variance (best/worst) | 12-16 wk | 20-26 wk | 19-27 wk |
| Payments? | No | Yes (tracking only) | No |
| Tournaments? | No | Yes (local + travel) | No |
| AI features? | No | No | Yes (Practice Assistant, simplified) |
| WhatsApp day 1? | Yes | Yes | Yes |
| First shippable unit | Week 4 (roster) | Week 4 (roster) | Week 4 (roster) |
| Coach can demo complete season flow at week... | 14 | 23 | 23 |
| Risk profile | Low | Medium | High |
| Primary differentiation at launch | Simplicity + speed | End-to-end coverage | AI-assisted coaching |
| Biggest deferred pain point | Payments + tournaments | AI coaching tools | Payments + tournaments |
| Scope creep exposure | Low | Medium (travel hotel) | High (AI quality) |
| Fit for seasonal AAU calendar | Partial (misses tournament window) | Strong (full season) | Partial (misses tournament window) |
| Engineering novelty | Low (CRUD + notifications) | Low-medium (+scheduling logic) | High (STT + drill AI pipeline) |

---

## PM Recommendation

**Option B — Full Season Operations** — same recommendation as filed in DECISION-001, now
with more detail as supporting evidence.

**Reasoning:**

The original requirements name three pain points with equal weight: communication, payment
tracking, and tournament logistics. Option A solves one of three. Option C solves one of
three while adding a fourth thing (AI) that wasn't in the original pain list. Option B is
the only option that addresses what the coach actually said they need.

The seasonal window argument is material. AAU spring circuits run March through June. A club
that adopts the tool in January needs tournament management live by March or they'll wait
another year to see its value. A 23-week build that starts in January lands in late June —
one season behind. The implication is that **Phase 0 and Phase B-1 should start now**, not
after extended decision-making, to maximize the chance of catching the next season window.

Option C's AI differentiation is real and worth pursuing — but it's a Phase 2 story, not a
Phase 1 story. Coaches will only trust an AI practice assistant if the roster page works
correctly, their parents are getting WhatsApp notifications reliably, and the fee tracker
isn't a spreadsheet. Build credibility with the operations layer first, then layer in AI.
The right sequencing is: **Option B now → ship Phase 6 (Practice Assistant) as v1.5
roughly 6 months after launch**.

The one scenario where Option C beats Option B: if you have a specific marketing launch
tied to the AI story (a basketball conference, an influencer coach, a product-hunt moment)
and you're willing to accept the payment/tournament gap as a known trade-off for that
launch moment. That's a legitimate choice — it just requires accepting that coaches will
still be on spreadsheets for fees and on group texts for tournaments.

**If timeline pressure is severe** (runway concern, or a specific season window is the
target ship date): choose Option A, ship Phase B-4 (tournaments) and B-5 (payments) as a
v1.5 update 8 weeks later. Name it explicitly in `pmo/phases.md` so the team doesn't treat
v1.5 as optional.

---

## How to Respond

Reply with one of:
- `DECISION-001: A` — Coach's Daily Tool (~14 weeks)
- `DECISION-001: B` — Full Season Operations (~23 weeks) ← recommended
- `DECISION-001: C` — Differentiated with AI (~23 weeks, higher risk)
- `DECISION-001: A then B` — Ship A first, immediately sequence B-4 and B-5 as v1.5
- `DECISION-001: tell me more about X` — for any aspect you want elaborated

Once you decide, PM will draft Phase 1 stories and hand off to Architect.
