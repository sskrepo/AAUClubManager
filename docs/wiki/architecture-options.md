---
title: Architecture Options — Technical Analysis for DECISION-001
source: pmo/decisions/DECISION-001-mvp-scope.md, docs/wiki/module-*.md
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: architect
tags: [phase:0, kind:architecture, decision:001]
status: current
---

# Architecture Options — Technical Companion to DECISION-001

This document is the **technical companion** to `pmo/phases-comparison.md` (PM-owned, scope/stories/value/timeline per option). This document owns: infrastructure sequencing, engineering effort, integration surface, and technical risk. Do not duplicate scope narrative — defer to the PM doc for that.

---

## ★ AGENT-PACE RE-BASELINE (added 2026-05-03)

**Important:** Dev-week estimates throughout this document assume 1 human backend + 1 human
frontend engineer. With agent-driven development, code-writing collapses 10-50× but
external dependencies, real-world testing, and decision cycles do not.

**Revised totals (agent-driven realistic):**

- **Option A:** ~4-8 weeks (~1-2 months), down from ~5 months
- **Option B:** ~6-12 weeks (~1.5-3 months), down from ~7.5 months
- **Option C:** ~5-10 weeks for ops + 4-12 weeks variance for AI work, down from ~7-7.5 months — **Option C variance is widest** because real-gym STT quality testing isn't agent-simulatable

**Critical-path items that gate timeline regardless of agent pace:**

| Item | Lead time | Phase needed by |
|------|----------|-----------------|
| Twilio WhatsApp Business API approval (Meta business verification) | **1-3 weeks** | Phase 3 |
| Stripe KYC (if Phase 5 expands to online payments) | 1-2 weeks | future |
| Resend domain DNS propagation | hours | Phase 1 |
| User decisions (DECISION files) | varies | every phase |
| Real-world UAT (coach actually uses at a real practice/tournament) | days per phase | every phase exit |

The Twilio item is the single longest pole for Options A and B. **It must start in Phase 0**
even though it's not used until Phase 3. See [`pmo/phase-briefs/PHASE-0-kickoff.md`](../../pmo/phase-briefs/PHASE-0-kickoff.md).

**Per-phase agent-pace estimates:**

| Phase | Human-pace (this doc) | Agent-pace realistic | Comment |
|-------|----------------------|---------------------|---------|
| Phase 0 — Foundation | 3.5 wks | 1-2 wks | Long pole = Twilio approval running in parallel |
| Phase 1 — Core | 6 wks | 1-2 wks | Tryout flow has the most user-decision points |
| Phase 2 — Operations | 5 wks | 1-2 wks | Schedule edge cases need real-world testing |
| Phase 3 — Practice Comms | 5 wks | 1-2 wks | Webhook integration testing only confirms post-Twilio approval |
| Phase 4 — Tournaments | 5.5 wks | 1-2 wks | Travel hotel UX needs real parent test |
| Phase 5 — Payments | 4 wks | 1-2 wks | Reminder schedule reliability needs days of real cron observation |
| Phase 6-partial — AI (Option C only) | 8-10 wks | 4-12 wks | Cannot compress; real gym audio test required |

**The remainder of this document uses original human-pace dev-week numbers** — the analysis
of integrations, risks, ADRs, and critical paths is unchanged in substance. Only the
calendar-time projection needs translation.

---

## Original analysis (human-pace, kept for context)

Cross-reference: [pmo/phases-comparison.md](../../pmo/phases-comparison.md) (PM parallel document — may not be written yet; sync phase names when it lands).

Baseline stack assumed throughout (from CLAUDE.md):
- Backend: Node.js + TypeScript + Express + Knex
- Frontend: Next.js 15 + TypeScript + Tailwind + shadcn/ui + TanStack Query
- Auth: Clerk
- Notifications: Resend (email) + Twilio (WhatsApp)
- DB: PostgreSQL (via Knex, RDBMS-agnostic)
- Background jobs: BullMQ + Redis
- API: OpenAPI 3.0 spec + generated TypeScript SDK
- Testing: Vitest + Supertest / RTL, Playwright E2E

Any deviation from this baseline is flagged explicitly.

---

## Option A — "Coach's Daily Tool" (Phases 1-3)

Modules: Tryouts, Teams, Practice Scheduling, Gym Management, Jersey Management, Practice Communications.

### Phase 0 — Foundation (shared by all options)

**Infrastructure required:**
- Monorepo scaffold (`server/`, `web/`), TypeScript project setup, ESLint/Prettier
- Clerk tenant setup: multi-tenant org model (Club = Clerk Organization), role claims (head_coach, assistant_coach, parent, player)
- Knex + PostgreSQL connection, migration runner, seed scripts
- BullMQ + Redis: install and wire queue infrastructure (even if no jobs run in Phase 0 — avoids rework later)
- OpenAPI 3.0 skeleton + SDK codegen pipeline (`npm run api:generate`)
- Resend + Twilio accounts provisioned; notification service abstraction written (channel = parameter)
- CI pipeline (build + lint + test)
- Structured logging (Pino) + request-ID middleware
- Base data model: Club, User, ClubMembership (role-scoped), Season

**Net-new third-party integrations introduced:** Clerk, Resend, Twilio, PostgreSQL/Redis

**Engineering effort — Phase 0:**
- Backend: 2 dev-weeks (scaffold + auth middleware + DB + queue infra + notification service skeleton)
- Frontend: 1.5 dev-weeks (Next.js scaffold + Clerk provider + design system seed + OpenAPI SDK wiring)
- Total: ~3.5 dev-weeks

**Notes:** Phase 0 is identical across all three options. The queue and notification infrastructure set up here pays forward into every subsequent phase.

---

### Phase 1 — Core (Tryouts + Teams)

**Infrastructure required:**
- Data model: Club, Season, Tryout, TryoutRegistration, PlayerEvaluation, SelectionDecision, Team, TeamCoach, Roster, Player, ParentChildLink, User
- Multi-tenancy: all queries scoped by `club_id`; Knex query helpers enforce this
- Role-based authorization middleware (head_coach vs. assistant_coach guards)
- Notification jobs: selection result emails + WhatsApp via BullMQ (async, queued — not inline)
- Public registration endpoint (unauthenticated — tryout sign-up link); rate-limited
- File/attachment placeholder for evaluation notes (voice memo deferred to Phase 6, text only here)
- Soft-delete pattern established for Player records (players leave clubs but history must persist)
- Audit log table (who changed what, when) — establish pattern now, applies to all entities

**Net-new integrations:** none beyond Phase 0 baseline

**Engineering effort — Phase 1:**
- Backend: 3 dev-weeks (data model, API routes for tryout + team CRUD, evaluation scoring, selection workflow, notification jobs)
- Frontend: 3 dev-weeks (tryout creation flow, public registration page, evaluation UI on mobile-friendly layout, selection drag-and-drop, roster management, team dashboard)
- Total: ~6 dev-weeks

**Critical path:** Clerk multi-tenant org model must be correct before any team-scoped authorization can be built. Auth middleware is Phase 0 exit gate for Phase 1.

---

### Phase 2 — Operations (Practice Scheduling + Gym + Jersey)

**Infrastructure required:**
- Data model additions: PracticeTemplate, Practice, Gym, GymBooking, TeamJerseyConfig, PlayerJersey, JerseyOrder
- Recurring schedule expansion engine (generate N Practice instances from a template) — pure business logic, runs in-process (no queue needed unless generating months at once; keep simple initially)
- Conflict detection query: overlapping GymBookings on same gym + time (pure SQL, no third-party)
- Parent calendar API: aggregate practices across all of a parent's players (cross-team query, scoped by parent's ParentChildLink records)
- CSV export endpoint (jersey sizing) — streaming response, no third-party
- Notification trigger wired to practice changes (calls notification service from Phase 0)

**Net-new integrations:** none

**Engineering effort — Phase 2:**
- Backend: 2.5 dev-weeks (scheduling logic, gym CRUD + conflict detection, jersey assignment + order tracking, calendar aggregation API)
- Frontend: 2.5 dev-weeks (schedule setup UI, calendar views per team + per parent, gym registry UI, jersey assignment UI + CSV export)
- Total: ~5 dev-weeks

---

### Phase 3 — Communications (Practice Communications)

**Infrastructure required:**
- Data model additions: PracticeAttendance, CommunicationMessage, Poll, PollResponse
- Notification delivery from BullMQ: this phase is heavy on outbound messaging. Queue workers must be stable and observable (dead-letter handling, retry with backoff)
- Read-receipt tracking: Resend provides delivery/open webhooks; Twilio provides delivery status callbacks. Inbound webhook handlers needed.
- Poll response aggregation: real-time aggregate view for coach (server-sent events or polling — no WebSocket needed yet; SSE is simpler and stateless)
- Attendance pre-fill from PollResponse (if parent said "absent", pre-populate attendance)
- Rate limiting on notification dispatch (Twilio + Resend have per-second limits)

**Net-new integrations:** Resend webhooks (delivery receipts), Twilio status callbacks — new inbound webhook surface, but same providers

**Engineering effort — Phase 3:**
- Backend: 2.5 dev-weeks (attendance CRUD, message dispatch pipeline, poll engine, webhook handlers, SSE endpoint for live poll results)
- Frontend: 2.5 dev-weeks (absence reporting UI, coach broadcast UI, poll creation + live results, attendance marking at practice — mobile-optimized)
- Total: ~5 dev-weeks

**Option A total (all phases including Phase 0):** ~19.5 dev-weeks (~5 months at 1 backend + 1 frontend, allowing for overhead)

---

### Option A — Technical Risk Assessment

| Risk | Severity | Notes |
|------|----------|-------|
| Clerk multi-tenant model wrong | High | If org/role model is misconfigured, all authorization is wrong. Fix early in Phase 0. |
| Notification deliverability | Medium | Resend + Twilio are proven, but WhatsApp Business API approval can take 1-2 weeks. Start account setup before Phase 3. |
| Recurring schedule edge cases | Low-Medium | DST transitions, holiday skipping, mid-season schedule changes require careful date arithmetic. Use a date library (date-fns). |
| Mobile UX at practice | Low-Medium | Coach uses phone in a gym. Attendance and evaluation UIs must work with one hand, large tap targets. UX risk, not infra risk. |
| Data model extensibility | Low | If data model is not multi-season-aware from day 1, historical data queries become painful. Season entity must scope all operational data. |

---

### Option A — Reusability if Scope Expands Later

Everything built in Option A is the foundation for B and C. Specifically:

- The multi-tenant auth model, Club/Season/Team/Player data model, and notification pipeline are reused verbatim in B and C.
- The BullMQ/Redis queue infrastructure (established Phase 0) absorbs payment reminders (B Phase 5) and AI job queues (C Phase 6-partial) without changes.
- The notification service abstraction (channel = parameter) means adding payment reminder jobs in B is a new job type, not a new integration.
- Estimate: ~85% of Option A codebase carries forward unchanged into B or C.

---

## Option B — "Full Season Operations" (Phases 1-5)

Scope: All of Option A (Phases 1-3) + Tournaments (Phase 4) + Payment Tracking (Phase 5).

### Phases 0-3

Same as Option A in all technical respects. See above.

---

### Phase 4 — Tournaments

**Infrastructure required:**
- Data model additions: Tournament, TournamentTeam, Game, GameAttendance, HotelOffer, HotelBooking
- No payment integration needed here (hotel booking is external — parents click out to hotel's booking URL; we only track status). HotelBooking.booked_at is a self-reported field.
- Notification jobs: tournament schedule publication, game-time reminders, jersey color announcements — heavy notification volume but same Resend + Twilio channels
- Game attendance confirmation: poll-like pattern reusing Poll/PollResponse infrastructure from Phase 3 (or a specialized GameAttendance variant — either works; prefer reuse)
- Jersey color comms: thin layer on top of CommunicationMessage from Phase 3
- No new external APIs required for local tournaments
- Travel tournament: hotel offer management is pure data CRUD + notification dispatch. No hotel API integration (intentionally out of scope — parents book directly)

**Net-new integrations:** none (all notification via existing Resend + Twilio)

**Engineering effort — Phase 4:**
- Backend: 2.5 dev-weeks (tournament + game CRUD, hotel offer CRUD, game attendance, notification jobs)
- Frontend: 3 dev-weeks (tournament calendar UI, game schedule per team, parent confirmation flow, hotel options display, coach jersey-color broadcast UI — the tournament calendar is UI-heavy)
- Total: ~5.5 dev-weeks

---

### Phase 5 — Payment Tracking

**Infrastructure required:**
- Data model additions: FeeSchedule, Installment, Payment, ReminderRule, ReminderLog
- Scheduled reminder jobs in BullMQ: cron-style jobs that evaluate which parents are overdue and enqueue notification jobs. This is the first use of BullMQ's repeatable/scheduled job feature.
- Coach manual payment recording: simple CRUD, no payment processor
- Parent payment status view: query against FeeSchedule + Installment + Payment
- CSV/export of payment status for Head Coach (for external accounting)
- Receipt email triggered on payment recording (uses Resend)

**Note on online payments (Stripe):** The module wiki explicitly defers Stripe integration to a "Phase 5 expansion." This document treats Phase 5 as tracking-only (no Stripe). If the user wants online payments in MVP, that adds ~2 backend dev-weeks for Stripe integration + PCI compliance posture review + webhook handling. File a separate decision when ready.

**Net-new integrations:** none for tracking-only. (Stripe = future expansion, not in this scope.)

**Engineering effort — Phase 5:**
- Backend: 2 dev-weeks (fee schedule CRUD, installment engine, payment recording, scheduled reminder jobs, receipt emails, export endpoint)
- Frontend: 2 dev-weeks (fee setup UI, parent payment dashboard, coach payment tracking per team, reminder configuration UI)
- Total: ~4 dev-weeks

**Option B total (all phases including Phase 0):** ~29 dev-weeks (~7-7.5 months at 1 backend + 1 frontend, with overhead)

---

### Option B — Technical Risk Assessment

| Risk | Severity | Notes |
|------|----------|-------|
| All Option A risks | (inherited) | See Option A table |
| Scheduled job reliability | Medium | BullMQ repeatable jobs for payment reminders must survive Redis restarts and deploys without double-firing. Use idempotency keys on reminder sends. |
| Tournament notification volume | Medium | If a club has 10 teams and 20 tournaments, notification volume spikes. Resend + Twilio rate limits must be respected; queue worker concurrency must be tuned. |
| Travel tournament UX complexity | Low-Medium | Hotel options, distance ranking, booking link — manageable data problem, but the parent UX needs to be clean or it's ignored. UX risk more than infra. |
| Stripe (if added later) | High (when added) | PCI scope analysis required. Stripe.js on frontend keeps us out of PCI scope if card data never touches our server. Plan ahead so adding Stripe later doesn't require a re-architecture. |
| Data model: Season scoping at scale | Low | With 5 phases of data, Season FK integrity becomes important. Enforce in migrations, validate in integration tests. |

---

### Option B — Reusability if Scope Expands to C Later

- Adding AI (Option C's differentiator) after shipping B means adding Phase 6 (partial) on top of a mature, stable foundation.
- The queue infrastructure, notification pipeline, and player data model all support AI extensions without change.
- Estimated rework if expanding B → C: minimal (~5% rework, mostly adding new entities and job types).

---

## Option C — "Differentiated" (Phases 1-3 + Phase 6 partial: Practice Assistant)

Scope: All of Option A (Phases 1-3) + a simplified Practice Assistant from Phase 6. No Tournaments, no Payments.

### Phases 0-3

Same as Option A in all technical respects. See above. Total: ~19.5 dev-weeks.

---

### Phase 6-partial — Practice Assistant (simplified)

The full Phase 6 has two sub-modules: Practice Assistant (10A) and Film Study (10B). Option C ships only Practice Assistant, in a simplified form:
- Audio capture + speech-to-text → coaching note extraction
- Coach review and edit of notes
- Drill suggestion (from a static drill library, not live AI search)
- Assignment to player + notification
- Follow-up reminder at next practice

Film Study (10B) and pattern detection across sessions are deferred.

**Infrastructure required:**

New third-party integrations introduced (all are net-new, none exist in Phases 0-3):

1. **Speech-to-text provider** (e.g., Deepgram, AssemblyAI, or OpenAI Whisper API): receives audio file, returns transcript with timestamps. Provider choice requires an ADR (see "ADRs forced early" section).
2. **LLM API** (e.g., OpenAI GPT-4o, Anthropic Claude API): receives transcript, extracts coaching notes per player, tags player names. This is the core AI step. Provider choice requires an ADR.
3. **Object storage** (e.g., AWS S3 or compatible): audio files from practice sessions are too large for DB storage. Requires a CDN-accessible storage bucket with signed URL generation. This is a net-new infrastructure component not required in A or B.
4. **Drill library content**: a seeded static table (DrillLibrary) of drill name + video URL. The video URLs link to existing public content (YouTube, etc.) — no video hosting needed for Phase 6-partial. LLM matches coaching note focus areas to drill library entries.

**Data model additions:** PracticeSession, CoachingNote, DrillLibrary, DrillAssignment

**New background job types:**
- `transcribe-session`: triggered when coach ends practice, uploads audio. Sends audio to STT provider, stores transcript.
- `extract-notes`: triggered after transcription complete, sends transcript + player roster to LLM, receives structured note list.
- `assign-drill`: triggered when coach approves note, finds matching drills, queues notification to player.
- `followup-reminder`: scheduled job at next practice T-24h, reminds coach of pending discussion items.

**Async pipeline design:** The AI pipeline (record → upload → transcribe → extract → review) is inherently async and may take 2-10 minutes for a 2-hour practice session. The frontend polls or uses SSE to surface pipeline status to the coach. WebSocket is not required — SSE + a status field on PracticeSession is sufficient.

**Privacy/consent surface:** Audio recording in a gym with minors requires explicit consent UX. A consent acknowledgement flow must be implemented before recording begins. This is a legal/UX requirement that has no analogue in A or B.

**Offline tolerance:** Gyms have spotty wifi (noted in project-overview.md non-functional requirements). Audio capture must queue locally and upload when connectivity returns. This requires a service worker or native app capability on the frontend. Next.js + service worker is feasible but adds frontend complexity. If the web app is the only client, this is a meaningful UX investment.

**Net-new integrations introduced in Phase 6-partial:**
- Speech-to-text API (Deepgram / AssemblyAI / OpenAI Whisper)
- LLM completions API (OpenAI / Anthropic)
- Object storage (AWS S3 or compatible — Cloudflare R2, Backblaze B2)

**Engineering effort — Phase 6-partial:**
- Backend: 4.5 dev-weeks (STT integration + async pipeline, LLM prompt engineering + structured output parsing, S3 integration + signed URLs, drill library seeding, four job types, status polling endpoint, consent model)
- Frontend: 3.5 dev-weeks (practice session UI with start/stop/upload, pipeline status polling, coach review + edit of extracted notes, drill suggestion cards, assignment flow, offline queue for audio — this last item is the hardest frontend task in the whole project)
- Total: ~8 dev-weeks

**Why this is larger than it looks:** The 8 dev-weeks does not include the time to tune LLM prompt quality. Coaching note extraction requires the LLM to:
(a) correctly identify which player the coach is addressing (speaker + name inference),
(b) separate action items from general commentary,
(c) output structured JSON with player_id, note_text, focus_area.

Getting this working reliably for a domain-specific use case (sports coaching, gym vocabulary, informal speech) takes iteration. Budget 1-2 additional backend dev-weeks for prompt iteration and evaluation. This is the primary technical risk of Option C.

**Option C total (all phases including Phase 0):** ~27.5-29.5 dev-weeks (~7-7.5 months at 1 backend + 1 frontend + AI work, which realistically requires one engineer focused on the AI pipeline)

---

### Option C — Technical Risk Assessment

| Risk | Severity | Notes |
|------|----------|-------|
| All Option A risks | (inherited) | See Option A table |
| LLM note extraction accuracy | High | If the model misidentifies which player a coaching note is about, it's a trust-breaking failure. Requires evaluation harness with real coaching transcripts before ship. No way to know quality until real data exists. |
| Speech-to-text accuracy in gym | High | Gym acoustics (bouncing balls, squeaky shoes, multiple speakers) significantly degrade STT accuracy. Must test with real gym audio — studio audio tests are not representative. |
| Speaker diarization / player identification | High | Identifying who the coach is talking to is the hardest part. Options: (1) coach says player name explicitly and LLM extracts it, (2) diarization identifies coach vs. others. Option 1 is simpler and more reliable. Must decide before building. |
| Offline audio capture on web | Medium | Service workers for audio buffering in a web app are non-trivial. If audio is lost due to connectivity, the whole session is lost. Mitigation: incremental chunk upload rather than one big file at end. |
| Object storage setup | Low | AWS S3 or R2 — well-understood. But signed URL generation, CORS configuration, and storage cost management must be planned. |
| LLM API cost at scale | Medium | At 50+ clubs, each running 2 practices/week, a 2-hour session transcript is ~15-30k tokens. At GPT-4o pricing, that's ~$0.15-0.30/session. Manageable but must be monitored. Include cost monitoring from day 1. |
| Consent + privacy (minors) | Medium | Audio recording minors in a gym. Must have explicit per-parent consent flow, clear data retention policy, and audio deletion capability. Legal review recommended before shipping. |
| AI as differentiator requires quality | High | If the AI feature is buggy or unhelpful, it's worse than not having it. Coaches will share negative experiences. The value prop requires the feature to actually work, not just exist. |

---

### Option C — Reusability if Scope Expands to B Later

- Adding Tournaments + Payments (B's additions) after shipping C is straightforward — they have no dependency on AI infrastructure.
- The S3 + STT + LLM integrations are specific to coaching intelligence and don't benefit Tournament or Payment modules.
- Estimated rework if expanding C → B: minimal (~5% rework, adding Phase 4-5 work on top of stable foundation).

---

## Technical Comparison Table

| Dimension | Option A (Phases 1-3) | Option B (Phases 1-5) | Option C (Phases 1-3 + 6-partial) |
|-----------|----------------------|----------------------|----------------------------------|
| **Phase 0 (foundation)** | 3.5 wks | 3.5 wks | 3.5 wks |
| **Phase 1 (Tryouts + Teams)** | 6 wks | 6 wks | 6 wks |
| **Phase 2 (Operations)** | 5 wks | 5 wks | 5 wks |
| **Phase 3 (Comms)** | 5 wks | 5 wks | 5 wks |
| **Phase 4 (Tournaments)** | — | 5.5 wks | — |
| **Phase 5 (Payments)** | — | 4 wks | — |
| **Phase 6-partial (AI)** | — | — | 8-10 wks |
| **Total dev-weeks** | ~19.5 wks | ~29 wks | ~27.5-29.5 wks |
| **Calendar time (1 BE + 1 FE)** | ~5 months | ~7.5 months | ~7-7.5 months |
| **Net-new third-party integrations** | 4 (Clerk, Resend, Twilio, Postgres/Redis) | 4 (same, no new ones) | 7 (+ STT API, LLM API, Object Storage) |
| **Riskiest component** | Clerk multi-tenant model | Scheduled job reliability | LLM note extraction accuracy + gym STT quality |
| **Foundation reuse if scope expands** | 85% carries into B or C | N/A (already full B) | 85% carries into B; AI infra is additive |
| **Deploys Stripe (payments online)** | No | No (tracking only) | No |
| **Requires AI provider ADR before start** | No | No | Yes — by Phase 6 start (ADR-NNN-ai-provider) |
| **Requires object storage ADR before start** | No | No | Yes — by Phase 6 start (ADR-NNN-object-storage) |
| **Requires STT provider ADR before start** | No | No | Yes — by Phase 6 start (ADR-NNN-stt-provider) |
| **Legal/consent surface** | Standard | Standard | Audio recording of minors — requires consent UX + legal review |
| **Offline engineering required** | No | No | Yes — gym audio capture with spotty wifi |

---

## Critical Path and Sequencing Constraints (all options)

These sequencing constraints apply regardless of which option is chosen:

1. **Clerk multi-tenant org model before any Phase 1 work.** The Club-as-org, role-as-claim model must be locked in Phase 0. Changing it later requires touching every authorization guard.

2. **Notification service abstraction before Phase 3 communications work.** The notification service (Resend + Twilio, channel = parameter) must be written in Phase 0, even if no notifications are sent until Phase 3. Phase 1 uses it for selection results; Phase 3 uses it heavily.

3. **Season entity established in Phase 1.** All operational data (practices, rosters, payments, tournaments) is scoped to a Season. If Season is added later, retrofitting FK constraints is painful.

4. **BullMQ infrastructure in Phase 0, even if unused.** Adding a queue later breaks the notification service and requires re-wiring Phase 3's message dispatch.

5. **Option C only: AI provider selected before Phase 6-partial begins.** The STT + LLM integration shapes the job pipeline design. Choosing between providers after pipeline is built means significant rework. File ADRs at the start of Phase 6-partial design.

6. **Option C only: Consent UX must ship with the first recording feature, not as a follow-up.** Legal exposure from recording minors without explicit consent is a hard blocker.

7. **Option B only: Stripe readiness.** If online payments are a future expansion of Phase 5, the FeeSchedule + Installment + Payment data model must be Stripe-compatible from day 1 (e.g., store Stripe PaymentIntent IDs). Design the model to accommodate this even if Stripe isn't integrated yet.

---

## ADRs Forced Early by Each Option

ADRs that must be decided and recorded before implementation can begin:

**All options (Phase 0 entry gates):**
- ADR-001: Auth provider (Clerk — already decided in CLAUDE.md; file to make formal)
- ADR-002: DB engine + query builder (PostgreSQL + Knex — already decided; file to make formal)
- ADR-003: Notification channels (Resend + Twilio — already decided; file to make formal)
- ADR-004: Background jobs (BullMQ + Redis — already decided; file to make formal)

**Option C only (required before Phase 6-partial design begins):**
- ADR-NNN: Speech-to-text provider (Deepgram vs. AssemblyAI vs. OpenAI Whisper) — cost, accuracy, real-time vs. batch, diarization support
- ADR-NNN: LLM provider (OpenAI GPT-4o vs. Anthropic Claude API) — cost, structured output support, latency
- ADR-NNN: Object storage provider (AWS S3 vs. Cloudflare R2 vs. Backblaze B2) — cost, geographic latency, signed URL TTL
- ADR-NNN: Audio capture strategy (browser MediaRecorder + chunked upload vs. native app requirement) — this may determine whether a mobile app is needed earlier than planned

These are noted here but not written — per the task scope, file ADRs only after the option is chosen.

---

## Technical Recommendation

**The technically cleanest option is B**, with a clear rationale and one important caveat.

**Why B over A:** Option A's foundation is identical to B's first three phases. If the user later decides to add Tournaments and Payments (extremely likely given they are pain points confirmed in the raw requirements), they pay the Phase 4 and Phase 5 development cost anyway — just later, when the codebase is larger and there are live users depending on it. Shipping B upfront means those modules are designed and integrated before the system has production complexity. The technical risk of adding Phase 4-5 is low: they introduce no new third-party integrations beyond the baseline stack, and the BullMQ payment reminder jobs are straightforward extensions of Phase 3's notification pipeline.

**Why B over C:** Option C's AI differentiator carries three high-severity technical risks (LLM extraction accuracy, STT quality in gym acoustics, offline capture) that cannot be de-risked without real-world data — data that only exists once coaches are actually using the app. Shipping AI on top of an unproven foundation is a compounded risk: if coaches don't trust the basics (roster, schedule, communication), they will not use the AI assistant, and any quality issues in the AI layer will permanently damage trust in the product. The right sequencing is: stabilize the daily-use foundation (A or B), then introduce AI as a feature coaches already trust the platform enough to try.

Additionally, Option C at 27.5-29.5 dev-weeks is comparable in calendar time to Option B (29 dev-weeks), but Option C leaves out Payments and Tournaments — the modules the raw requirements and DECISION-001 context identify as primary coach pain points. Option C trades two high-value, low-risk modules for one high-risk, speculative module.

**The caveat about B:** "Full Season Operations" in ~7.5 months assumes a single backend + single frontend engineer. If timeline is a hard constraint (e.g., must ship before an AAU season opens), Option A is the right fallback — it ships in ~5 months with the same foundation, and B can be completed as v1.5 immediately after. This is not a technical objection to B; it is a scheduling one.

**If Option C is chosen:** Strongly recommend a technical spike (2 dev-weeks, one engineer) at Phase 6-partial start to test STT accuracy with real gym audio before committing to the full pipeline build. The spike should answer: (1) which STT provider produces acceptable accuracy on gym audio, and (2) can the LLM reliably extract player-tagged coaching notes from a messy 2-hour transcript? If the spike fails, the team can descope AI and ship Option A's foundation without any rework.

---

*Document owner: Architect. Cross-reference: [pmo/phases-comparison.md](../../pmo/phases-comparison.md) (PM-owned). Last compiled: 2026-05-03.*
