---
title: Project Dashboard
source: derived from pmo/stories, pmo/decisions, pmo/handoffs
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: tpm
tags: [meta, live]
status: current
---

# AAUClubManager — Dashboard

**Current phase:** Phase 0 — Foundation — GATE 2 IN PROGRESS (Architect drafting OpenAPI baseline)
**Updated:** 2026-05-03 by tpm

## Current Phase Kickoff

[PHASE-0-kickoff.md](phase-briefs/PHASE-0-kickoff.md) — continue the critical-path external setup items (Twilio WhatsApp approval is the long pole, ~1-3 weeks lead time)

---

## Approval gates — Phase 0

### Gate 1 — PDD + UI Mocks — APPROVED 2026-05-03

- [PDD-PHASE-0.md](../docs/wiki/pdd/PDD-PHASE-0.md) — status: approved
- [ux/mocks/phase-0/index.md](../docs/wiki/ux/mocks/phase-0/index.md) — status: approved
- [ux/design-system.md](../docs/wiki/ux/design-system.md) — status: approved

### Gate 2 — OpenAPI Spec (active — drafting)

Architect is now unblocked to draft the Phase 0 OpenAPI spec (health endpoint) and file `docs/wiki/api-changes/phase-0.md`. This goes to Gate 2 approval before Dev Manager, Backend, and Frontend can pick up any implementation work.

Approval syntax (when Architect files):
- `GATE-2-PHASE-0: approved` — approves spec and proceeds to implementation
- `OPENAPI-PHASE-0: needs changes — {description}` — request changes

---

## Open product questions (non-blocking — answer when ready)

These do not block Gate 2 or Architect's OpenAPI work. Answer anytime during Phase 0; answers are needed before Phase 1 mocks are finalized.

**Brand identity**
1. **Primary color** — Do you have a brand color? A hex code or direction ("navy", "orange") is enough. UX seeded "Club Blue" (`#3b82f6`) as placeholder — confirm or replace. Without confirmation, Phase 1 mocks will use the placeholder.
2. **Logo / app name** — Do you have a logo (SVG preferred)? Is "AAUClubManager" the final brand name, or is there a shorter name (e.g., "ClubMgr", "Hoops HQ")? Placeholder acceptable for Phase 0; must be resolved before Phase 1 mocks.
3. **App header display** — Should the app header show "AAU Club Manager" (generic) or the specific club name per tenant after login? Affects multi-tenant UI pattern from Phase 1 onward.

**Infrastructure**
4. **Domain name** — What domain have you purchased or will use? Needed for Resend `FROM` address and deployment URL config. If undecided, agents use `aauclubmanager.app` as placeholder.
5. **Hosting platform** — Vercel (web) + Railway or Render (server) vs. a unified platform? Determines CI/CD and env var strategy. See PHASE-0-kickoff.md item 7.

**Phase 3 risk**
6. **WhatsApp sender strategy** — Pursue Twilio WhatsApp Business approval now (1-3 wk lead), or stay on Twilio sandbox through Phase 2 and switch for Phase 3? Either is valid; decision determines how test scripts are configured. Recommend starting approval now to avoid Phase 3 delay.

---

## In-flight work — Phase 0

| Activity | Owner | Status | Notes |
|---|---|---|---|
| External setup checklist | **user** | in progress | See PHASE-0-kickoff.md (10 items) |
| OpenAPI baseline (Gate 2) | architect | drafted, awaiting Gate 2 | api/openapi.yaml + api-changes/phase-0.md + ADR-005 filed |
| ADR-001 Auth (Clerk) | architect | in progress | Unblocked by Gate 1 |
| ADR-002 DB (Knex+Postgres) | architect | in progress | Unblocked by Gate 1 |
| ADR-003 Notifications (Resend+Twilio) | architect | in progress | Unblocked by Gate 1 |
| ADR-004 Background jobs (BullMQ+Redis) | architect | in progress | Unblocked by Gate 1 |
| `server/` scaffold (Express+TS+Knex) | backend-dev | blocked on Gate 2 | Auth wiring follows Clerk keys |
| `web/` scaffold (Next.js+Tailwind+shadcn) | frontend-dev | blocked on Gate 2 | Auth wiring follows Clerk keys |
| OpenAPI codegen pipeline | architect + backend-dev | blocked on Gate 2 | |
| CI (GitHub Actions) | dev-manager | blocked on Gate 2 + GitHub repo | User must provide repo URL |
| Notification service abstraction | backend-dev | blocked on Gate 2 + credentials | |
| Engineering conventions docs | dev-manager | blocked on Gate 2 | |

## In-flight handoffs

(none yet — Phase 0 implementation hasn't kicked off)

## Done

- Project bootstrapped (dev-agent-team v0.1.1)
- Raw requirements ingested into wiki (10 module pages, personas, project overview)
- Backlog (Finder modules, Tournament Director persona) captured in `docs/wiki/backlog-future.md`
- Conversation logging hooks active (Google Drive)
- Architect technical analysis for DECISION-001 complete (`docs/wiki/architecture-options.md`)
- PM scope/value/risk analysis for DECISION-001 complete (`pmo/phases-comparison.md`)
- Both companion docs re-baselined with agent-pace estimates
- Phase 0 Kickoff Brief filed
- dev-agent-team v0.1.2 — Phase Kickoff Brief protocol
- dev-agent-team v0.1.3 — Phase Deliverables & Approval Gates protocol
- **DECISION-001 — Option B (Full Season Operations) chosen** (2026-05-03)
- `pmo/phases.md` updated with locked-in Phase 0-5 plan
- PDD-PHASE-0 filed and approved (Gate 1 passed 2026-05-03)
- UX mocks stub + design system seed filed and approved (Gate 1 passed 2026-05-03)
- **GATE-1-PHASE-0 approved by user (2026-05-03)**

## Blocked

| Item | Blocked by | Action needed |
|------|-----------|---------------|
| All agent implementation work (server, web, CI) | Gate 2 | Await Architect's OpenAPI spec + your approval |
| Auth scaffolding (server + web) | Clerk publishable + secret keys | User completes #2 in PHASE-0-kickoff.md |
| Notification service test | Resend + Twilio credentials | User completes #1 + #3 in PHASE-0-kickoff.md |
| GitHub Actions CI | GitHub repo URL | User completes #8 in PHASE-0-kickoff.md |
| Production deploy | Postgres + Redis hosting + hosting platform | User completes #5, #6, #7 in PHASE-0-kickoff.md |

## Risks / contradictions (from lint)

- `pmo/phases.md` previously stated "No PDD/UI mocks/Gate workflow for Phase 0" — contradicted v0.1.3 protocol. Fixed in prior session.
- `docs/wiki/ux/mocks/phase-0/index.md` (stub) quoted the now-corrected phases.md text ("No PDD/UI mocks/Gate workflow for Phase 0"). The quote is stale but low-severity — the stub is informational only and approval has now passed.
- Design system open questions (brand color, logo, app name) are parked in "Open product questions" above and do not require resolution before Gate 2.

## Recent decisions

- **GATE-1-PHASE-0 approved (2026-05-03)** — PDD, mocks stub, and design system seed locked. Gate 2 now active.
- **DECISION-001 (decided 2026-05-03)** — MVP scope: **Option B — Full Season Operations** (Phases 1-5: Tryouts, Teams, Practice Scheduling, Gym, Jersey, Practice Comms, Tournaments, Payments). Agent-pace ETA: 6-12 weeks. AI features deferred to Phase 6 / v1.5+.

---

## How to read this

- Open product questions → things only you can answer (non-blocking, async)
- In-flight → who's doing what right now
- Handoffs → cross-agent transitions in progress
- Blocked → stories waiting on something
- Risks → TPM lint findings (stale wiki, code/spec drift, etc.)

## Quick links
- [Phases](phases.md) — locked-in Phase 0-5 roadmap
- [Wiki index](../docs/wiki/index.md)
- [Current status (narrative)](../docs/wiki/current-status.md)
- [Phase 0 Kickoff Brief](phase-briefs/PHASE-0-kickoff.md) — your external setup checklist
