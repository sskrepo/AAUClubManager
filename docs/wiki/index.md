# AAUClubManager — Wiki Index

## Meta
- [current-status](current-status.md) — where we are right now
- [log](log.md) — chronological session log
- [phase-0-retrospective](phase-0-retrospective.md) — Phase 0 closed 2026-05-04; what shipped, learned, and carried over

## Compiled by PM
- [project-overview](project-overview.md) — vision, value loop, modules in/out of scope
- [personas](personas.md) — Head Coach, Assistant Coach, Parent, Player + authority matrix
- [backlog-future](backlog-future.md) — Finder modules and Tournament Director persona (deferred)

### Planning documents
- [phases-comparison](../../pmo/phases-comparison.md) — phase-by-phase breakdown of MVP Options A/B/C for DECISION-001 (cross-ref: architecture-options.md). ★ agent-pace re-baseline at top.
- [phase-briefs/](../../pmo/phase-briefs/) — Phase Kickoff Briefs (TPM-owned, one per phase, lists external dependencies user must handle)
  - [PHASE-0-kickoff.md](../../pmo/phase-briefs/PHASE-0-kickoff.md) — Foundation phase, status: completed (2026-05-04)
  - [PHASE-1-kickoff.md](../../pmo/phase-briefs/PHASE-1-kickoff.md) — Core phase, status: awaiting-external-setup (active)

### Modules (one page per functional area)
- [module-tryouts](module-tryouts.md) — Phase 1 — tryouts & onboarding
- [module-teams](module-teams.md) — Phase 1 — team formation, rosters
- [module-payments](module-payments.md) — Phase 5 — payment tracking
- [module-practice-scheduling](module-practice-scheduling.md) — Phase 2 — recurring schedules
- [module-gyms](module-gyms.md) — Phase 2 — gym registry & bookings
- [module-jerseys](module-jerseys.md) — Phase 2 — jersey numbers, sizing, orders
- [module-practice-communications](module-practice-communications.md) — Phase 3 — comms & attendance
- [module-tournaments](module-tournaments.md) — Phase 4 — local + travel tournaments
- [module-coaching-intelligence](module-coaching-intelligence.md) — Phase 6 — practice + film AI assistants
- [module-analytics-integrations](module-analytics-integrations.md) — Phase 7 — third-party (Hudl, etc.)

### Market research
- [market-research/](market-research/) — competitor scans, positioning, sentiment (PM-owned, refresh quarterly)

### Per-phase deliverables (Gate 1 + Gate 2)
- [pdd/](pdd/) — Product Definition Documents (PM-owned, Gate 1)
  - [PDD-PHASE-0](pdd/PDD-PHASE-0.md) — Foundation — status: approved (Gate 1 passed)
  - [PDD-PHASE-1](pdd/PDD-PHASE-1.md) — Core (Tryouts + Teams) — status: in-review (Gate 1 pending)
- [ux/mocks/](ux/mocks/) — UI mocks per phase (UX-owned, Gate 1)
- [api-changes/](api-changes/) — Per-phase OpenAPI spec change summaries (Architect-owned, Gate 2)
  - [api-changes/phase-0](api-changes/phase-0.md) — Foundation baseline — status: approved (Gate 2 passed 2026-05-03)

## Compiled by Architect
- [architecture-options](architecture-options.md) — technical analysis of DECISION-001 options A/B/C (effort, integrations, risk, reusability). ★ agent-pace re-baseline at top.
- [cost-analysis](cost-analysis.md) — cost-at-scale analysis across 10 stack decisions at 4 scale tiers; top levers, alternatives, tradeoffs, horizon-based recommendations. Status: draft.
- (future — after DECISION-001 decided) [architecture](architecture.md)
- [data-model](data-model.md) — base entities: Club, User, ClubMembership, Season (Phase 0)
- (future) [api-design](api-design.md)
- [adr/ADR-001-auth-clerk](adr/ADR-001-auth-clerk.md) — status: accepted (decided 2026-05-03)
- [adr/ADR-002-database-knex-postgres](adr/ADR-002-database-knex-postgres.md) — status: accepted (decided 2026-05-03)
- [adr/ADR-003-notifications-resend-360dialog](adr/ADR-003-notifications-resend-360dialog.md) — status: accepted (decided 2026-05-03; revised same day: 360dialog from MVP, Twilio eliminated)
- [adr/ADR-004-background-jobs-bullmq-redis](adr/ADR-004-background-jobs-bullmq-redis.md) — status: accepted (decided 2026-05-03)
- [adr/ADR-005-api-design-conventions](adr/ADR-005-api-design-conventions.md) — status: accepted (Gate 2 approved 2026-05-03)
- (future) [integrations/](integrations/)

### Source of truth
- [`api/openapi.yaml`](../../api/openapi.yaml) — OpenAPI 3.0.3 spec baseline (Phase 0). Run `npm run api:generate` after changes.

## Compiled by UX
- [ux/design-system](ux/design-system.md) — v0.1 Phase 0 seed: palette, typography, spacing, shadcn/ui components catalog, accessibility baseline
- [ux/mocks/phase-0/index](ux/mocks/phase-0/index.md) — Phase 0 mocks stub (no flow mocks — foundation phase; Gate 1 approved 2026-05-03)
- [ux/mocks/phase-1/index](ux/mocks/phase-1/index.md) — Phase 1 mocks index (12 wireframe specs; Gate 1 pending)
  - [01-club-creation](ux/mocks/phase-1/01-club-creation.md) — first-run wizard (3 steps): club details, first season, done
  - [02-season-setup](ux/mocks/phase-1/02-season-setup.md) — season list, create/edit dialog, season detail
  - [03-coach-invitation](ux/mocks/phase-1/03-coach-invitation.md) — director invites coach; coach post-accept welcome screen
  - [04-tryout-creation](ux/mocks/phase-1/04-tryout-creation.md) — tryout form, list, detail management view
  - [05-public-tryout-page](ux/mocks/phase-1/05-public-tryout-page.md) — unauthenticated public landing; mobile-first
  - [06-parent-registration](ux/mocks/phase-1/06-parent-registration.md) — 4-step form: Clerk sign-up → parent profile → player(s) → confirmation
  - [07-coach-evaluation-mobile](ux/mocks/phase-1/07-coach-evaluation-mobile.md) — **MOBILE-FIRST** evaluation UI; stepper scoring, player list
  - [08-selection-workflow](ux/mocks/phase-1/08-selection-workflow.md) — kanban drag-and-drop selection board; score breakdown; send notifications
  - [09-team-roster](ux/mocks/phase-1/09-team-roster.md) — roster list (coach + parent views), player edit slide-over, coaches tab
  - [10-selection-notification-email](ux/mocks/phase-1/10-selection-notification-email.md) — Resend email template (selected / not-selected / waitlist)
  - [11-selection-notification-whatsapp](ux/mocks/phase-1/11-selection-notification-whatsapp.md) — 360dialog WhatsApp templates with Meta `{{N}}` parameters
  - [12-parent-roster-acceptance](ux/mocks/phase-1/12-parent-roster-acceptance.md) — accept/decline page (token-gated, mobile-first)
- (future) [ux/information-architecture](ux/information-architecture.md)
- (future) [ux/flows/](ux/flows/)
- (future) [ux/screens/](ux/screens/)
- (future) [ux/components/](ux/components/)

## Compiled by Dev Manager
(empty — activates in Phase 1)
- (future) [engineering/coding-conventions](engineering/coding-conventions.md)
- (future) [engineering/testing-strategy](engineering/testing-strategy.md)
- (future) [engineering/database-conventions](engineering/database-conventions.md)
- (future) [engineering/git-workflow](engineering/git-workflow.md)
