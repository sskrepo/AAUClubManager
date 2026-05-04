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

**Current phase:** Phase 0 — Foundation — IN EXECUTION (Gate 2 approved 2026-05-03)
**Updated:** 2026-05-03 by tpm

## 👤 What's waiting on you

**Single user-facing view:** [`pmo/pending-decisions/PHASE-0.md`](pending-decisions/PHASE-0.md) — 3 blocking · 4 mid-phase · 3 open product questions · 5 done.

All-phases index: [`pmo/pending-decisions/index.md`](pending-decisions/index.md)

## Current Phase Kickoff

[PHASE-0-kickoff.md](phase-briefs/PHASE-0-kickoff.md) — continue the critical-path external setup items (360dialog account setup is now the WhatsApp long pole — Architect is updating this brief)

[PHASE-1-kickoff.md (skeleton)](phase-briefs/PHASE-1-kickoff.md) — pre-known Phase 1 prerequisites filed; will be expanded when Phase 0 exits

---

## Approval gates — Phase 0

### Gate 1 — PDD + UI Mocks — APPROVED 2026-05-03

- [PDD-PHASE-0.md](../docs/wiki/pdd/PDD-PHASE-0.md) — status: approved
- [ux/mocks/phase-0/index.md](../docs/wiki/ux/mocks/phase-0/index.md) — status: approved
- [ux/design-system.md](../docs/wiki/ux/design-system.md) — status: approved

### Gate 2 — OpenAPI Spec — APPROVED 2026-05-03

- [api-changes/phase-0.md](../docs/wiki/api-changes/phase-0.md) — status: approved
- [ADR-005-api-design-conventions.md](../docs/wiki/adr/ADR-005-api-design-conventions.md) — status: accepted
- [api/openapi.yaml](../api/openapi.yaml) — baseline locked

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
6. **WhatsApp sender strategy** — RESOLVED (2026-05-03, DECISION-002-B amendment): 360dialog adopted from MVP. No Twilio. Set up 360dialog account, obtain API key, configure WhatsApp Business display name and phone number. Architect is updating PHASE-0-kickoff.md with step-by-step instructions.

---

## In-flight work — Phase 0

| Activity | Owner | Status | Notes |
|---|---|---|---|
| External setup checklist | **user** | in progress | See PHASE-0-kickoff.md (10 items) |
| OpenAPI baseline (Gate 2) | architect | DONE — approved 2026-05-03 | api/openapi.yaml + api-changes/phase-0.md + ADR-005 |
| ADR-001 Auth (Clerk) | architect | DONE 2026-05-03 | docs/wiki/adr/ADR-001-auth-clerk.md |
| ADR-002 DB (Knex+Postgres) | architect | DONE 2026-05-03 | docs/wiki/adr/ADR-002-database-knex-postgres.md |
| ADR-003 Notifications (Resend+360dialog) | architect | BEING REVISED 2026-05-03 | Architect renaming/updating per DECISION-002-B amendment |
| ADR-004 Background jobs (BullMQ+Redis) | architect | DONE 2026-05-03 | docs/wiki/adr/ADR-004-background-jobs-bullmq-redis.md |
| Engineering task breakdown (PHASE-0-tasks.md) | dev-manager | DONE 2026-05-03 | 20 tasks filed; pmo/phase-briefs/PHASE-0-tasks.md |
| Engineering conventions docs | dev-manager | DONE 2026-05-03 | docs/wiki/engineering/ — 4 convention docs seeded |
| `server/` scaffold (Express+TS+Knex) | backend-dev | ready to start — TASK-005 | No blockers; auth wiring (TASK-006) follows Clerk keys |
| `web/` scaffold (Next.js+Tailwind+shadcn) | frontend-dev | ready to start — TASK-007 | No blockers; Clerk wiring (TASK-008) follows Clerk keys |
| OpenAPI codegen pipeline scripts | backend-dev | ready to start — TASK-002, TASK-003 | No blockers |
| BullMQ hello-world job | backend-dev | ready to start — TASK-014 | Local Docker Redis sufficient |
| Notification service abstraction (360dialog) | backend-dev | ready to start — TASK-011 | Abstraction has no blockers; test delivery (TASK-013) needs 360dialog + Resend creds |
| Auth middleware (server) | backend-dev | blocked — TASK-006 | Needs CLERK_SECRET_KEY from user |
| Clerk provider + sign-in (web) | frontend-dev | blocked — TASK-008 | Needs CLERK_PUBLISHABLE_KEY from user |
| CI (GitHub Actions) | backend-dev | blocked — TASK-017 | Needs GitHub repo URL from user |

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
| Auth scaffolding (server + web) | Clerk publishable + secret keys | User completes #2 in PHASE-0-kickoff.md |
| Notification service test | Resend + 360dialog credentials | User completes kickoff items — Architect updating PHASE-0-kickoff.md |
| GitHub Actions CI | GitHub repo URL | User completes #8 in PHASE-0-kickoff.md |
| Production deploy | Postgres + Redis hosting + hosting platform | User completes #5, #6, #7 in PHASE-0-kickoff.md |

## Risks / contradictions (from lint)

- `pmo/phases.md` previously stated "No PDD/UI mocks/Gate workflow for Phase 0" — contradicted v0.1.3 protocol. Fixed in prior session.
- `docs/wiki/ux/mocks/phase-0/index.md` (stub) quoted the now-corrected phases.md text ("No PDD/UI mocks/Gate workflow for Phase 0"). The quote is stale but low-severity — the stub is informational only and approval has now passed.
- Design system open questions (brand color, logo, app name) are parked in "Open product questions" above and do not require resolution before Gate 2.

## Decisions awaiting your review

(none — Gate 2 approved 2026-05-03. No open decisions. Answer open product questions above when convenient.)

## Future-phase commitments

Decisions made now but executed in a later phase. Tracked here so nothing falls through the cracks.

Note: WhatsApp provider swap removed from future commitments — 360dialog adopted from MVP per same-day decision (2026-05-03). No swap needed; abstraction writes to 360dialog from Phase 0.

| Item | When | Action required |
|---|---|---|
| OCI Object Storage setup | Phase 1 prerequisite | User delivers: OCI tenancy OCID, compartment OCID, bucket name, API key/credentials. Architect validates Node.js SDK approach (official `oci-sdk` vs S3-compatible AWS SDK pointed at OCI endpoint) and S3-compatibility surface during Phase 1 prep. Tracked in PHASE-1-kickoff.md. |
| Revisit observability stack | Phase 1 exit | Architect to file DECISION-NNN at Phase 1 exit comparing Sentry + Axiom/BetterStack vs Datadog vs self-hosted Loki/Grafana. |

## Recent decisions

- **DECISION-002-B amended (2026-05-03)** — Use 360dialog from MVP; drop Twilio entirely. No future swap needed. 360dialog account (API key, WhatsApp Business display name, phone number) is now a Phase 0 external dependency. Architect updating ADR-003, cost-analysis, PHASE-0-kickoff, PHASE-0-tasks.
- **GATE-2-PHASE-0 approved (2026-05-03)** — OpenAPI baseline locked (api/openapi.yaml), api-changes/phase-0.md and ADR-005 accepted as canonical. Phase 0 implementation fully unblocked.
- **DECISION-002 (decided 2026-05-03)** — Keep Clerk; swap WhatsApp to 360dialog before Phase 3 production; OCI Object Storage for files (Architect to validate SDK/S3-compat in Phase 1 prep); defer observability decision to Phase 1 exit.
- **GATE-1-PHASE-0 approved (2026-05-03)** — PDD, mocks stub, and design system seed locked.
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
