---
title: Project Dashboard
source: derived from pmo/stories, pmo/decisions, pmo/handoffs
compiled_at: 2026-05-04T00:00:00Z
created: 2026-05-03
owner: tpm
tags: [meta, live]
status: current
---

# AAUClubManager — Dashboard

**Current phase:** Phase 1 — Core (Tryouts + Teams) — Gate 1 in progress
**Updated:** 2026-05-04 by tpm (Phase 0 close ceremony complete)

---

## Current Phase Kickoff

[PHASE-1-kickoff.md](phase-briefs/PHASE-1-kickoff.md) — **full brief** filed 2026-05-04. Two critical-path items require user action today (OCI credentials + brand identity). Five mid-phase items needed before first cloud deploy.

---

## What's waiting on you

**Single user-facing view:** [`pmo/pending-decisions/PHASE-1.md`](pending-decisions/PHASE-1.md) — **2 blocking** · 5 mid-phase · 3 open product questions · 0 done

All-phases index: [`pmo/pending-decisions/index.md`](pending-decisions/index.md)

### Blocking right now

| # | Item | Unblocks |
|---|------|---------|
| 1 | **OCI Object Storage credentials** — tenancy OCID, user OCID, fingerprint, private key, region, bucket name, namespace | Architect SDK validation → file-upload service design → Phase 1 backend implementation |
| 2 | **Brand identity** — primary color, logo, app name, app header convention | UX mocks → Gate 1 approval |

---

## Approval gates — Phase 1

### Gate 1 — PDD + UI Mocks (pending PM + UX deliverables)

- PDD-PHASE-1.md — in progress (PM)
- UI mocks: phase-1/ — in progress (UX; pending brand identity answers from user)
- Reply: `GATE-1-PHASE-1: approved` (or `PDD-PHASE-1:` / `MOCKS-PHASE-1:` separately)

### Gate 2 — OpenAPI Spec (blocked on Gate 1)

- Will surface here after Gate 1 passes
- Architect updates `api/openapi.yaml` + files `api-changes/phase-1.md`
- Reply: `OPENAPI-PHASE-1: approved`

---

## In-flight work — Phase 1

| Activity | Owner | Status | Notes |
|----------|-------|--------|-------|
| PDD-PHASE-1.md | pm | In progress | Covering: club creation, season setup, team creation, tryout creation, parent registration, evaluation, selection, parent acceptance |
| UX mocks — phase 1 | ux-designer | In progress | Tryout registration, evaluation UI (mobile), selection drag-and-drop, team roster page; pending brand identity answers from user |
| OCI SDK validation | architect | Blocked on user | Blocked on OCI credentials (item #1 above) |
| Gate 1 approval | user | Pending | Waiting for PM + UX deliverables |
| OpenAPI spec — Phase 1 | architect | Blocked on Gate 1 | — |
| Gate 2 approval | user | Pending | Waiting for Architect spec |
| Stories — Phase 1 | pm | Blocked on Gate 2 | — |
| Engineering tasks | dev-manager | Blocked on Gate 2 | — |
| Backend implementation | backend-dev | Blocked on Gate 2 | — |
| Frontend implementation | frontend-dev | Blocked on Gate 2 | — |
| QA validation | qa | Last in sequence | — |

---

## In-flight handoffs

(none)

---

## Done

- **Phase 0 closed 2026-05-04 (11/11 exit criteria met)** — retrospective at [`docs/wiki/phase-0-retrospective.md`](../docs/wiki/phase-0-retrospective.md)
- Phase 0 exit readiness: 11/11 criteria met, CI green (run 25353265537)
- GATE-1-PHASE-0 approved 2026-05-03
- GATE-2-PHASE-0 approved 2026-05-03
- dev-agent-team v0.1.1 through v0.1.5 promoted (5 protocol bumps in Phase 0)
- Project bootstrapped (dev-agent-team v0.1.1)
- Raw requirements ingested into wiki (10 module pages, personas, project overview)
- Backlog (Finder modules, Tournament Director persona) captured in `docs/wiki/backlog-future.md`
- Conversation logging hooks active (Google Drive)
- Architect technical analysis for DECISION-001 complete (`docs/wiki/architecture-options.md`)
- PM scope/value/risk analysis for DECISION-001 complete (`pmo/phases-comparison.md`)
- Phase 0 Kickoff Brief filed (status: completed)
- **DECISION-001 — Option B (Full Season Operations) chosen** (2026-05-03)
- `pmo/phases.md` updated with locked-in Phase 0-5 plan
- PDD-PHASE-0 filed and approved (Gate 1 passed 2026-05-03)
- UX mocks stub + design system seed filed and approved (Gate 1 passed 2026-05-03)
- ADRs 001-005 filed and accepted
- `server/` scaffold: 27/27 unit tests passing
- `web/` scaffold: 14/14 unit tests passing; build passing
- OpenAPI codegen pipeline wired; SDK committed
- Notification service + BullMQ workers shipped
- CI green (run 25353265537, commit 948277e, all 3 jobs)
- Base data model filed (`docs/wiki/data-model.md`)
- Engineering conventions docs (4 docs under `docs/wiki/engineering/`)

---

## Approval gates — Phase 0 (completed)

### Gate 1 — APPROVED 2026-05-03
- [PDD-PHASE-0.md](../docs/wiki/pdd/PDD-PHASE-0.md) — status: approved
- [ux/mocks/phase-0/index.md](../docs/wiki/ux/mocks/phase-0/index.md) — status: approved
- [ux/design-system.md](../docs/wiki/ux/design-system.md) — status: approved

### Gate 2 — APPROVED 2026-05-03
- [api-changes/phase-0.md](../docs/wiki/api-changes/phase-0.md) — status: approved
- [ADR-005-api-design-conventions.md](../docs/wiki/adr/ADR-005-api-design-conventions.md) — status: accepted
- [api/openapi.yaml](../api/openapi.yaml) — baseline locked

---

## Blocked

| Item | Blocked by | Action needed |
|------|-----------|---------------|
| OCI SDK validation | OCI credentials (user) | User delivers OCI credentials — see PHASE-1-kickoff.md item #1 |
| UX mocks (Gate 1) | Brand identity answers (user) | User answers brand identity questions — see PHASE-1-kickoff.md item #2 |
| OpenAPI Phase 1 spec | Gate 1 | PM + UX file deliverables; user approves Gate 1 |
| Phase 1 implementation | Gate 2 | Architect files spec; user approves Gate 2 |
| Notification live delivery | Resend FROM domain DNS + Redis hosted | User: complete Resend DNS verification + provision Redis |
| Production deploy | Postgres + Redis hosting + hosting platform | User completes mid-phase items 4-6 in PHASE-1.md |

---

## Risks / contradictions (from lint)

- No open risks as of Phase 0 close. Phase 0 lint clean.
- **Watch:** Brand identity answers still open — if not received before UX begins mocks, Gate 1 may require a re-review cycle.
- **Watch:** OCI is not yet validated by Architect. If S3-compatibility surface has gotchas (presigned URLs, CORS, multipart), file-upload service design may need revision — this is a known unknown, not a risk, as long as OCI credentials arrive in Phase 1 prep.

---

## Decisions awaiting your review

(none — no open decisions. Next expected: Observability stack at Phase 1 exit per DECISION-002-D.)

---

## Future-phase commitments

| Item | When | Action required |
|------|------|----------------|
| Meta WhatsApp template approvals | Phase 3 prerequisite (start NOW during Phase 1) | User submits templates to 360dialog for Meta approval. Minimum: tryout_selection_result, practice_schedule_change, practice_reminder, attendance_poll, payment_reminder. 1-3 days per template; submit in parallel. See [PHASE-3.md](pending-decisions/PHASE-3.md). |
| 360dialog production tier | Phase 3 prerequisite | Meta Business verification + custom WhatsApp templates approved. Sandbox sufficient through Phase 2. |
| Observability stack decision | Phase 1 exit | Architect files DECISION-NNN at Phase 1 exit: Sentry+Axiom vs Datadog vs self-hosted Loki/Grafana. |
| Production brand domain | Phase 1 exit task | Choose and register prod domain (HoopCourt, RosterWise, other candidates). `myhoopclub.com` is dev/UAT. |
| COPPA / GDPR posture | Phase 2 (PM flags if needed) | Phase 1 collects minors' data. PM will flag before Phase 2 ships publicly. |

---

## Recent decisions

- **Phase 0 closed (2026-05-04)** — 11/11 exit criteria met. CI green (run 25353265537). Phase 1 active.
- **Autonomous-dev protocol (2026-05-04)** — dev-agent-team v0.1.5. Agents no longer pause for file permissions; only pause for gates, DECISION-NNN, pending-decisions.
- **DECISION-002-B amended (2026-05-03)** — 360dialog from MVP; Twilio eliminated.
- **GATE-2-PHASE-0 approved (2026-05-03)** — api/openapi.yaml baseline locked.
- **DECISION-002 (decided 2026-05-03)** — Keep Clerk; 360dialog from MVP; OCI Object Storage; defer observability to Phase 1 exit.
- **GATE-1-PHASE-0 approved (2026-05-03)** — PDD, mocks stub, design system seed locked.
- **DECISION-001 (decided 2026-05-03)** — MVP scope: Option B — Full Season Operations.

---

## How to read this

- Blocking → things only you can do that are stopping agent work today
- Approval gates → PDD/mocks/OpenAPI approvals required from you
- In-flight → who's doing what right now
- Handoffs → cross-agent transitions in progress
- Blocked → stories waiting on something
- Risks → TPM lint findings

## Quick links

- [Phases](phases.md) — locked-in Phase 0-5 roadmap
- [Wiki index](../docs/wiki/index.md)
- [Current status (narrative)](../docs/wiki/current-status.md)
- [Phase 1 Kickoff Brief](phase-briefs/PHASE-1-kickoff.md) — your external setup checklist
- [Phase 0 Retrospective](../docs/wiki/phase-0-retrospective.md)
- [Pending decisions — Phase 1](pending-decisions/PHASE-1.md)
