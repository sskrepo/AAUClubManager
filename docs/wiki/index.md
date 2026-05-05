# AAUClubManager — Wiki Index

## Meta
- [current-status](current-status.md) — where we are right now
- [log](log.md) — chronological session log

## Compiled by PM
- [project-overview](project-overview.md) — vision, value loop, modules in/out of scope
- [personas](personas.md) — Head Coach, Assistant Coach, Parent, Player + authority matrix
- [backlog-future](backlog-future.md) — Finder modules and Tournament Director persona (deferred)

### Planning documents
- [phases-comparison](../../pmo/phases-comparison.md) — phase-by-phase breakdown of MVP Options A/B/C for DECISION-001 (cross-ref: architecture-options.md). ★ agent-pace re-baseline at top.
- [phase-briefs/](../../pmo/phase-briefs/) — Phase Kickoff Briefs (TPM-owned, one per phase, lists external dependencies user must handle)
  - [PHASE-0-kickoff.md](../../pmo/phase-briefs/PHASE-0-kickoff.md) — Foundation phase, awaiting user external setup

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
- [ux/mocks/](ux/mocks/) — UI mocks per phase (UX-owned, Gate 1)
- [api-changes/](api-changes/) — Per-phase OpenAPI spec change summaries (Architect-owned, Gate 2)
  - [api-changes/phase-0](api-changes/phase-0.md) — Foundation baseline — status: in-review (Gate 2 pending)

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
- [ux/mocks/phase-0/index](ux/mocks/phase-0/index.md) — Phase 0 mocks stub (no flow mocks — foundation phase; Gate 1 pending)
- (future) [ux/information-architecture](ux/information-architecture.md)
- (future) [ux/mocks/phase-1/](ux/mocks/phase-1/) — Phase 1 flow mocks (tryout registration, evaluation, selection, roster screens)
- (future) [ux/flows/](ux/flows/)
- (future) [ux/screens/](ux/screens/)
- (future) [ux/components/](ux/components/)

## Compiled by Dev Manager
(empty — activates in Phase 1)
- (future) [engineering/coding-conventions](engineering/coding-conventions.md)
- (future) [engineering/testing-strategy](engineering/testing-strategy.md)
- (future) [engineering/database-conventions](engineering/database-conventions.md)
- (future) [engineering/git-workflow](engineering/git-workflow.md)
