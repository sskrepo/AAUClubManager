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

**Current phase:** Phase 0 — Foundation 🟡 IN PROGRESS
**Updated:** 2026-05-03 by tpm

## 📋 Current Phase Kickoff

→ **[PHASE-0-kickoff.md](phase-briefs/PHASE-0-kickoff.md)** — start the 🚨 critical-path external setup items now (Twilio WhatsApp approval is the long pole, ~1-3 weeks lead time)

## 🔴 Decisions awaiting your review

(none — DECISION-001 closed)

## 🟡 In-flight work — Phase 0

| Activity | Owner | Status | Notes |
|---|---|---|---|
| External setup checklist | **user** | 🟡 in progress | See PHASE-0-kickoff.md (10 items) |
| ADR-001 Auth (Clerk) | architect | 📝 ready to file | Formalize decision in CLAUDE.md |
| ADR-002 DB (Knex+Postgres) | architect | 📝 ready to file | |
| ADR-003 Notifications (Resend+Twilio) | architect | 📝 ready to file | |
| ADR-004 Background jobs (BullMQ+Redis) | architect | 📝 ready to file | |
| `server/` scaffold (Express+TS+Knex) | backend-dev | ⏸️ blocked on Clerk keys | Can start without — auth wired later |
| `web/` scaffold (Next.js+Tailwind+shadcn) | frontend-dev | ⏸️ blocked on Clerk keys | Can start without — auth wired later |
| Design system seed | ux-designer | 📝 ready to start | |
| OpenAPI codegen pipeline | architect + backend-dev | 📝 ready to start | |
| CI (GitHub Actions) | dev-manager | ⏸️ blocked on GitHub repo | |
| Notification service abstraction | backend-dev | ⏸️ blocked on Resend+Twilio keys | |
| Engineering conventions docs | dev-manager | 📝 ready to start | |

## 📋 In-flight handoffs

(none yet — Phase 0 work hasn't kicked off in code yet)

## ✅ Done

- ✅ Project bootstrapped (dev-agent-team v0.1.1)
- ✅ Raw requirements ingested into wiki (10 module pages, personas, project overview)
- ✅ Backlog (Finder modules, Tournament Director persona) captured in `docs/wiki/backlog-future.md`
- ✅ Conversation logging hooks active (Google Drive)
- ✅ Architect technical analysis for DECISION-001 complete (`docs/wiki/architecture-options.md`)
- ✅ PM scope/value/risk analysis for DECISION-001 complete (`pmo/phases-comparison.md`)
- ✅ Both companion docs re-baselined with agent-pace estimates
- ✅ Phase 0 Kickoff Brief filed
- ✅ dev-agent-team v0.1.2 — Phase Kickoff Brief protocol
- ✅ dev-agent-team v0.1.3 — Phase Deliverables & Approval Gates protocol
- ✅ **DECISION-001 — Option B (Full Season Operations) chosen** (2026-05-03)
- ✅ `pmo/phases.md` updated with locked-in Phase 0-5 plan

## 🚧 Blocked

| Item | Blocked by | Action needed |
|------|-----------|---------------|
| Auth scaffolding (server + web) | Clerk publishable + secret keys | User completes #2 in PHASE-0-kickoff.md |
| Notification service test | Resend + Twilio credentials | User completes #1 + #3 in PHASE-0-kickoff.md |
| GitHub Actions CI | Repo URL | User completes #8 in PHASE-0-kickoff.md |
| Production deploy | Postgres + Redis hosting + hosting platform | User completes #5, #6, #7 in PHASE-0-kickoff.md |

(None of these block the START of work — agents can write code that uses placeholder env vars and wire up real credentials when delivered.)

## ⚠️ Risks / contradictions (from lint)

(none — first lint after Phase 0 closes)

## 📜 Recent decisions

- **DECISION-001 (decided 2026-05-03)** — MVP scope: **Option B — Full Season Operations** (Phases 1-5: Tryouts, Teams, Practice Scheduling, Gym, Jersey, Practice Comms, Tournaments, Payments). Agent-pace ETA: 6-12 weeks. AI features deferred to Phase 6 / v1.5+.

---

## How to read this

- 🔴 **Decisions** → things only you can answer. Reply: "DECISION-NNN: option X"
- 🟡 **In-flight** → who's doing what right now
- 📋 **Handoffs** → cross-agent transitions in progress
- 🚧 **Blocked** → stories waiting on something
- ⚠️ **Risks** → TPM lint findings (stale wiki, code/spec drift, etc.)

## Quick links
- [Phases](phases.md) — locked-in Phase 0-5 roadmap
- [Wiki index](../docs/wiki/index.md)
- [Current status (narrative)](../docs/wiki/current-status.md)
- [Phase 0 Kickoff Brief](phase-briefs/PHASE-0-kickoff.md) — your external setup checklist
