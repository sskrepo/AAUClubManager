---
title: Phase 0 — Foundation — Retrospective
phase: 0
owner: tpm
created: 2026-05-04
status: complete
tags: [retrospective, phase:0]
---

# Phase 0 — Foundation — Retrospective

## Outcome

Phase 0 closed 2026-05-04. All 11 exit criteria met (100%). CI green on run 25353265537 (commit 948277e). Both approval gates passed. All agent-owned tasks complete. Phase 1 active.

---

## What shipped

- **ADRs 001-005** — Clerk (auth), Knex+Postgres (DB), Resend+360dialog (notifications), BullMQ+Redis (background jobs), API design conventions. All status: accepted.
- **`server/` scaffold** — Express + TypeScript + Knex + Pino; `GET /health` + `GET /api/v1/me`; Clerk JWT middleware; RFC 7807 error formatter; express-openapi-validator mounted. 27/27 unit tests passing.
- **`web/` scaffold** — Next.js 16 + Tailwind v4 + Clerk + TanStack Query; authenticated shell (`/dashboard`, `/me`); ClerkProvider + `proxy.ts` auth guard; sign-in/sign-up routes. 14/14 tests passing; build passing.
- **OpenAPI codegen pipeline** — `api:validate/generate/check` scripts; generated TypeScript SDK committed to `web/src/api/generated/`; `client.ts` wrapper with Clerk token injection + 401 retry.
- **Notification service abstraction** — `IWhatsAppProvider` + `IEmailProvider` interfaces; `Dialog360WhatsAppProvider` (base-URL-driven for sandbox/prod env flip); `ResendEmailProvider`; `NotificationService` orchestrator; BullMQ notification worker; dev scripts (`notify:test:email`, `notify:test:whatsapp`).
- **BullMQ + Redis integration** — hello-world worker; `queue:test` script; send-notification queue wired.
- **CI** — `.github/workflows/ci.yml` with three jobs: API (validate/generate), Server (lint+typecheck+test), Web (lint+typecheck+test+build). All green.
- **Design system seed** — `docs/wiki/ux/design-system.md` v0.1: palette (Club Blue `#3b82f6` placeholder), typography (Inter), spacing, shadcn/ui component catalog, accessibility baseline. Tailwind v4 `@theme` tokens in `globals.css`.
- **Engineering conventions** — 4 docs under `docs/wiki/engineering/`: coding, testing, database, git conventions.
- **Base data model** — `docs/wiki/data-model.md`: Club, User, ClubMembership, Season entities with Mermaid ER diagram, Knex-portable types, Clerk webhook sync strategy, multi-tenant scoping.
- **Phase 0 task breakdown** — `pmo/phase-briefs/PHASE-0-tasks.md`: 20 tasks across 4 agent roles.

---

## What worked

- **Parallel agent execution** — Architect filed ADRs while Backend Dev and Frontend Dev scaffolded in parallel. Zero sequential blocking between agent tracks once credentials arrived.
- **Credential delivery → immediate unblock pattern** — Each credential delivery (Clerk → Backend + Frontend unblocked; 360dialog sandbox key → all of Wave 2 unblocked). No agent sat idle waiting for a credential delivered to a different agent.
- **Base-URL-driven provider design** — `Dialog360WhatsAppProvider` targets sandbox vs production purely via `DIALOG360_BASE_URL` env var. No code changes needed when promoting to production at Phase 3. This pattern came from choosing 360dialog's sandbox early (correcting a misinformation in the initial brief that claimed "no sandbox equivalent").
- **dev-agent-team protocol evolution mid-phase** — Promoting patterns to canonical while they were being used (pending-decisions, autonomous-dev) meant later agents in the same phase were already working under the updated protocol.
- **Pending-decisions as a user-facing surface** — Separating "what's waiting on you" from the full dashboard gave the user a single place to look and reduced noise. The per-phase file + index pattern held up well.
- **Gate workflow for a foundation phase** — Initially treated Phase 0 as gate-exempt; corrected mid-phase to apply the universal gate workflow. This caught the discrepancy early and makes Phase 1 gates consistent.

---

## What was learned / surprises

- **360dialog does have a sandbox** — The initial brief said "no sandbox equivalent." This was wrong. 360dialog's sandbox (`+551146733492`, START to opt in) is sufficient for Phase 0 dev/test. Corrected in brief and wiki. Impact: Phase 0 implementation was not blocked on Meta Business verification.
- **Tailwind v4 + `npm ci` optional deps bug (#4828)** — CI failed on the web job because `npm ci` on Linux skips optional deps, breaking the PostCSS native binding that Tailwind v4 requires. Fix: patch root `package-lock.json` with linux oxide entries + disable PostCSS in vitest config. Not documented anywhere at the time — Frontend Dev had to diagnose from scratch.
- **Next.js 16 uses `proxy.ts` not `middleware.ts`** — Clerk's Next.js integration in v16 changed the convention. The Clerk docs at the time still showed `middleware.ts`. `proxy.ts` is the correct v16 pattern.
- **`clerk-sdk-node` is EOL** — `@clerk/backend` is the correct package. Would have been caught in the ADR phase but wasn't explicit in any doc; Backend Dev discovered during implementation.
- **Phase 0 gate workflow needed correction** — `phases.md` initially stated "No PDD/UI mocks/Gate workflow for Phase 0." Contradicted v0.1.3 protocol. Fixed; Gate 1 and Gate 2 applied to Phase 0 and both passed.
- **Resend DNS sub-step** — Delivering the Resend API key does not fully unblock email delivery. The domain verification sub-step (SPF/DKIM DNS records for `myhoopclub.com`) requires a separate user action. Tracked explicitly in pending-decisions.

---

## What carried over

These items were deliberately deferred — they do not invalidate Phase 0 exit.

| Item | Deferred to | Notes |
|------|-------------|-------|
| OCI Object Storage SDK validation | Phase 1 prep | Architect validates Node.js approach (`oci-sdk` vs S3-compat AWS SDK); user delivers OCI credentials |
| Observability stack decision | Phase 1 exit | Architect files DECISION-NNN comparing Sentry+Axiom vs Datadog vs self-hosted Loki/Grafana |
| Production hosting deploy | Phase 1 | Postgres + Redis hosting + hosting platform decision still open; local Docker sufficient for dev |
| Brand identity (color, logo, app name, app header) | Before Phase 1 Gate 1 | UX needs these before finalizing Phase 1 mocks |
| Resend DNS verification (`RESEND_FROM_EMAIL`) | Phase 1 mid-phase | DNS records for `myhoopclub.com` in Resend dashboard |
| Prod brand domain | Phase 1 exit task | `myhoopclub.com` is dev/UAT; prod brand domain (HoopCourt, RosterWise candidates) still TBD |
| Meta WhatsApp Business verification (360dialog production tier) | Phase 3 prerequisite | Sandbox sufficient through Phase 2; production Meta verification + custom template approval needed before Phase 3 |
| Manual smoke test (Docker stack) | Optional | Auth flow + queue + notify end-to-end; deferred as non-blocking for exit |
| WhatsApp message template submissions | Before Phase 3 | Submit during Phase 1–2 to allow Meta review lead time |

---

## dev-agent-team evolutions during Phase 0

| Version | Date | What changed |
|---------|------|-------------|
| v0.1.1 | 2026-05-03 | Added market research to PM responsibilities per user feedback |
| v0.1.2 | 2026-05-03 | Phase Kickoff Brief protocol — TPM files briefs at phase start listing external dependencies with lead times |
| v0.1.3 | 2026-05-03 | Phase Deliverables & Approval Gates protocol — mandatory Gate 1 (PDD + mocks) and Gate 2 (OpenAPI) per phase; Dev Manager cannot pick up engineering work until both gates pass |
| v0.1.4 | 2026-05-03 | Pending-decisions pattern promoted to canonical — `shared/pending-decisions-protocol.md`; per-phase user-facing tracking surface; TPM agent formally owns the directory |
| v0.1.5 | 2026-05-04 | Autonomous-dev protocol promoted to canonical — `shared/autonomous-dev-protocol.md`; agents no longer pause for file read/write permissions; only three pause exceptions: approval gates, DECISION-NNN filings, pending-decisions items |

---

## Metrics

| Metric | Value |
|--------|-------|
| Agent sessions | ~15 (across bootstrap, design, scaffold, CI fix) |
| Decisions filed | 2 (DECISION-001, DECISION-002; DECISION-002-B amended same day) |
| ADRs filed | 5 (ADR-001 through ADR-005) |
| Approval gates passed | 2 (Gate 1: 2026-05-03, Gate 2: 2026-05-03) |
| Server unit tests passing | 27 / 27 |
| Web unit tests passing | 14 / 14 |
| CI status | Green (run 25353265537, commit 948277e, all 3 jobs passing) |
| Source files committed | 28 server + 39 web = 67 total |
| dev-agent-team versions | v0.1.1 through v0.1.5 (5 protocol bumps) |
| External credentials delivered | 5 (Clerk keys, Resend key, 360dialog sandbox key, GitHub repo, myhoopclub.com domain) |

---

## Phase 1 entry checklist

Items to confirm or complete as Phase 1 kicks off:

- [ ] **OCI credentials** — deliver `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_REGION`, `OCI_BUCKET_NAME`, `OCI_NAMESPACE` so Architect can validate SDK approach in Phase 1 prep. **Start within 24 hours.**
- [ ] **Brand identity** — answer: primary color (or confirm `#3b82f6`), logo (SVG), app name (or confirm "AAUClubManager"), app header convention (generic vs per-tenant club name). Required before Gate 1 (UX mocks). **Answer before UX begins mocks.**
- [ ] **Resend DNS verification** — complete SPF/DKIM records for `myhoopclub.com` in Resend dashboard. Unblocks `RESEND_FROM_EMAIL`. ~1 hour DNS propagation.
- [ ] **Postgres hosting** — provision managed Postgres and deliver `DATABASE_URL`. Needed before Phase 1 deploy.
- [ ] **Redis hosting** — provision managed Redis and deliver `REDIS_URL`. Needed before Phase 1 deploy.
- [ ] **Hosting platform decision** — Vercel (web) + Railway/Render (server) vs unified. Needed before CI/CD configuration.
- [ ] **Clerk webhook secret** — configure Clerk webhook endpoint in dashboard (points to `/api/webhooks/clerk`), deliver `CLERK_WEBHOOK_SECRET`. Needed for User/Club sync in Phase 1.
- [ ] **Gate 1 approval** — once PM files PDD-PHASE-1.md and UX files mocks, approve before Architect updates OpenAPI spec.
- [ ] **Gate 2 approval** — once Architect files api-changes/phase-1.md, approve before implementation begins.
