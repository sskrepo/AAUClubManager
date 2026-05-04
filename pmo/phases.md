---
title: Phases
source: DECISION-001 (Option B), pmo/phases-comparison.md, docs/wiki/architecture-options.md
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: tpm
tags: [meta, roadmap, decided]
status: current
---

# Phases — AAUClubManager (Option B locked)

DECISION-001 selected **Option B — Full Season Operations**. Phases 1-5 are MVP. Phases 6-7 (AI + Analytics) are post-MVP / v1.5+. Backlog (Finder modules, Tournament Director persona, online payments) in [`docs/wiki/backlog-future.md`](../docs/wiki/backlog-future.md).

Agent-pace timeline (realistic): **6-12 weeks** total from Phase 0 start. See [`pmo/phases-comparison.md`](phases-comparison.md) for floor/ceiling.

## Roadmap

| # | Name | Status | Scope | Agent-pace ETA | Stories |
|---|------|--------|-------|---------------|---------|
| 0 | Foundation | 🟡 active | Stack, scaffolding, auth, queue infra, design system, ADRs | 1-2 wks | n/a (no user flows) |
| 1 | Core | ⏳ planned | Tryouts, Teams, Player profiles, Multi-tenant auth | 1-2 wks | TBD post-PDD |
| 2 | Operations | ⏳ planned | Practice scheduling, Gym mgmt, Jersey mgmt | 1-2 wks | TBD post-PDD |
| 3 | Communications | ⏳ planned | Practice comms, attendance, polls, WhatsApp+email | 1-2 wks | TBD post-PDD |
| 4 | Tournaments | ⏳ planned | Local + travel tournaments, hotel coordination, jersey color | 1-2 wks | TBD post-PDD |
| 5 | Payments | ⏳ planned | Fee tracking, installments, automated reminders, financial dashboard | 1-2 wks | TBD post-PDD |
| **MVP** | **Option B v1** | — | All of 1-5 | **6-12 wks** | — |
| 6 | Coaching Intelligence | 🔮 post-MVP | Practice Assistant + Film Study (AI) | TBD | — |
| 7 | Analytics Integrations | 🔮 post-MVP | Hudl, GameChanger, etc. | TBD | — |

## Phase 0 — Foundation

**Goal:** Working dev environment + tech stack ratified + queue/notification infra in place. Nothing user-visible ships.

**External setup the user must complete (parallel with agent work):**
See [`pmo/phase-briefs/PHASE-0-kickoff.md`](phase-briefs/PHASE-0-kickoff.md). 360dialog account + Meta Business verification (1-7 days lead) is one of the external dependencies; Clerk and Resend are typically faster.

**Agent deliverables:**
- ADR-001: Auth provider (Clerk) — formal record
- ADR-002: DB engine + query builder (PostgreSQL + Knex)
- ADR-003: Notification channels (Resend + 360dialog)
- ADR-004: Background jobs (BullMQ + Redis)
- `server/` scaffold: Express + TypeScript + Knex + Pino + auth middleware + queue worker
- `web/` scaffold: Next.js 15 + Tailwind + shadcn/ui + Clerk provider + OpenAPI SDK wiring
- Notification service abstraction (channel = parameter)
- Initial `api/openapi.yaml` with `/health` endpoint
- `docs/wiki/ux/design-system.md` — colors, typography, spacing, components catalog
- `docs/wiki/architecture.md` — system shape
- `docs/wiki/data-model.md` — base entities (Club, User, ClubMembership, Season)
- `docs/wiki/engineering/{coding,testing,database,git}-conventions.md`
- CI: GitHub Actions (lint + test + build)

**Exit criteria:**
- All Phase 0 Kickoff Brief 🚨+🟡 items checked off by user
- ADRs 001-004 filed and accepted
- `server/` and `web/` scaffolds deployed; auth login works end-to-end
- BullMQ worker processes hello-world job
- Test email sends via Resend; test WhatsApp message sends via 360dialog
- Initial commit to GitHub with passing CI

**Note on Phase 0 gate workflow:** Phase 0 PDD covers infrastructure deliverables (no user flows); UX files an explicit no-mocks stub confirming nothing to mock. Gate 1 still applies — user must approve PDD + mocks stub before Architect finalizes the Phase 0 OpenAPI spec (health endpoint only) for Gate 2. Gate workflow is universal from Phase 0 onward per v0.1.3 protocol.

## Phase 1 — Core (Tryouts + Teams)

**Goal:** Coach can create a club, run a tryout, build teams, and parent/players have accounts.

**Modules covered:**
- [Tryouts & Onboarding](../docs/wiki/module-tryouts.md)
- [Team Formation & Roster Management](../docs/wiki/module-teams.md)

**Gate workflow:**
- TPM files Phase 1 Kickoff Brief
- PM writes [PDD-PHASE-1.md](../docs/wiki/pdd/) covering: club creation, season setup, team creation, tryout creation, parent registration, evaluation, selection, parent acceptance flows
- UX produces mocks for: tryout registration page, evaluation UI (mobile), selection drag-and-drop, team roster page
- Gate 1 — User approves PDD + mocks
- Architect updates `api/openapi.yaml` + files [api-changes/phase-1.md](../docs/wiki/api-changes/)
- Gate 2 — User approves OpenAPI changes
- PM writes detailed stories
- Dev Manager → Backend + Frontend implement → QA validates

**Exit criteria:**
- Coach can run a tryout end-to-end with notifications going out via email + WhatsApp
- Parent can accept a roster spot
- Multi-tenant authorization works (coach sees own club only, etc.)

## Phase 2 — Operations (Practice Scheduling + Gym + Jersey)

**Modules:**
- [Practice Scheduling](../docs/wiki/module-practice-scheduling.md)
- [Gym Management](../docs/wiki/module-gyms.md)
- [Jersey Management](../docs/wiki/module-jerseys.md)

**Gate workflow:** Same pattern as Phase 1.

**Exit criteria:**
- Coach can build recurring practice schedule for a team
- Parent calendar aggregates across multiple players
- Gym registry + conflict detection works
- Jersey number assignment + sizing CSV export works

## Phase 3 — Communications

**Module:**
- [Practice Communications](../docs/wiki/module-practice-communications.md)

**External dependency:** 360dialog account + Meta Business verification + at least one approved WhatsApp message template MUST be complete by Phase 3 start. (Started in Phase 0 to allow lead time.)

**Exit criteria:**
- Parent absence reporting works
- Coach broadcast (email + WhatsApp) works with read receipts
- Polls work end-to-end
- Attendance log builds across season

## Phase 4 — Tournaments

**Module:**
- [Tournament Management](../docs/wiki/module-tournaments.md)

**Exit criteria:**
- Coach can build full tournament calendar
- Per-game attendance confirmation works
- Travel tournament: hotel options publish, parents mark booked
- Jersey color callouts work

## Phase 5 — Payments

**Module:**
- [Payment Tracking](../docs/wiki/module-payments.md)

**Note:** Tracking only (no Stripe). Online payments deferred to v1.5 expansion.

**Exit criteria:**
- Coach can set up fees per team (with installments)
- Parents see what they owe
- Coach marks payments received; receipts go out
- Automated reminders fire on schedule via email + WhatsApp
- Per-team financial dashboard accurate

## Post-MVP (deferred — file new DECISION when ready)

### Phase 6 — Coaching Intelligence
- Practice Assistant (audio capture → transcription → coaching notes → drill assignment)
- Film Study Assistant (video annotation → clip extraction → assignment)

### Phase 7 — Analytics Integrations
- Hudl, GameChanger, MaxPreps integrations
- Player development timeline merging stats + notes + clips
