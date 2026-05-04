---
title: PDD — Phase 0 — Foundation
phase: 0
status: approved
filed: 2026-05-03
approved: 2026-05-03
owner: pm
deciders: user
gate: 1-approved
tags: [pdd, phase:0]
---

# PDD — Phase 0 — Foundation

> Gate 1 approved by user on 2026-05-03. Gate 2 (OpenAPI baseline) now active with Architect.

## Phase scope

Phase 0 establishes the technical and organizational foundation every later phase builds on. Nothing user-visible ships. The outputs are: a ratified tech stack (via ADRs), working server and web scaffolds, an auth scaffold (Clerk), a notification service abstraction, a BullMQ queue worker, an OpenAPI codegen pipeline, a design system seed, base engineering conventions, and CI.

Full scope: [`pmo/phases.md` — Phase 0](../../../pmo/phases.md).
External setup the user must complete in parallel: [`pmo/phase-briefs/PHASE-0-kickoff.md`](../../../pmo/phase-briefs/PHASE-0-kickoff.md).

## Personas affected

Phase 0 has no end-users. The only "users" of Phase 0 outputs are:

- **The dev team** — consumes scaffolds, ADRs, conventions, CI
- **The user (approver)** — reviews ADRs and external-setup decisions; approves this PDD

See [`docs/wiki/personas.md`](../personas.md) for full persona definitions. End-user personas (Head Coach, Assistant Coach, Parent, Player) activate starting Phase 1.

## Why Phase 0 needs a PDD

Per the v0.1.3 phase-deliverables-protocol, every phase requires a PDD before the Architect finalizes an OpenAPI spec and before the Dev Manager picks up tasks. Phase 0's "flows" are developer/agent workflows and infrastructure exercises, not end-user flows. Gate 1 for Phase 0 is: user approves this PDD. Gate 2 is: user approves the Phase 0 OpenAPI spec (the `/health` endpoint only). UX is filing a stub mocks page rather than wireframes — see note below.

## Note on UI mocks

Phase 0 has no user-facing flows. UX is filing `docs/wiki/ux/mocks/phase-0/stub.md` as a placeholder acknowledging there are no mocks for this phase. Gate 1 passes with PDD approval only; the mocks stub confirms UX has reviewed and concurs there is nothing to mock.

---

## Deliverables (in place of user flows)

Phase 0 does not have user flows. It has a set of agent deliverables that must be complete and verifiable before Phase 1 begins.

### Deliverable 1: Architecture Decision Records (ADRs 001-004)

**What:** Four ADRs formalizing stack decisions that were made during project setup (Clerk, Knex+Postgres, Resend+360dialog, BullMQ+Redis). These exist in `CLAUDE.md` as defaults; ADRs make them explicit with rationale and tradeoffs, creating a permanent record.

**Owner:** Architect

**Acceptance:** Each ADR filed at `docs/wiki/adr/ADR-00N-*.md`, status `accepted`.

| ADR | Topic | Decision |
|-----|-------|----------|
| ADR-001 | Auth provider | Clerk (multi-tenant org model, role claims) |
| ADR-002 | DB engine + query builder | PostgreSQL + Knex (RDBMS-agnostic by design) |
| ADR-003 | Notification channels | Resend (email) + 360dialog (WhatsApp) |
| ADR-004 | Background jobs | BullMQ + Redis |

**Done when:** All four ADRs filed, user has read and not objected. (No explicit approval gate — these are formalizations of already-made decisions. If the user wants to revisit a decision, file a new DECISION record.)

---

### Deliverable 2: Agent Workflow — OpenAPI Codegen Pipeline

**What:** The pipeline that turns `api/openapi.yaml` changes into a typed TypeScript SDK usable by the frontend. This is a developer workflow, not a user flow.

**Trigger:** An agent (or developer) modifies `api/openapi.yaml`.

**Happy path:**
1. Agent edits `api/openapi.yaml` (e.g., adds an endpoint).
2. Agent runs `npm run api:generate` from the project root.
3. Codegen tool reads the spec and regenerates `web/src/api/client.ts` (typed SDK).
4. Frontend code imports from `web/src/api/client.ts` — no raw `fetch()` calls.
5. TypeScript compilation validates the SDK against actual usage — mismatches are compile errors, not runtime surprises.

**Alternative paths:**
- If `openapi.yaml` is malformed: codegen fails with a lint error, agent fixes spec before regenerating.
- If an endpoint is removed from spec but still called in frontend: TypeScript compile error surfaces immediately.

**Success criteria:** Running `npm run api:generate` from a clean checkout completes without error and produces a non-empty `web/src/api/client.ts`. Running `npm run build` (web) succeeds.

**Out of scope:** Multi-client SDK generation (mobile, CLI). A single web SDK is sufficient for Phase 0.

---

### Deliverable 3: Auth Scaffold Flow — Clerk Login

**What:** The minimal end-to-end auth flow: unauthenticated user hits the web app, gets redirected to Clerk, authenticates, lands on an authenticated home page. No application functionality yet — just proof that Clerk is wired correctly.

**Trigger:** User navigates to the web app without a valid session.

**Preconditions:** Clerk application exists; `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` set in `.env`.

**Happy path:**
1. Browser loads `https://app.{domain}/` without a session cookie.
2. Next.js middleware detects unauthenticated request, redirects to Clerk-hosted sign-in page.
3. User signs in with email or Google.
4. Clerk redirects back to app with a session token.
5. Next.js middleware validates token; app renders an authenticated shell (no content yet — placeholder "Dashboard" heading acceptable).
6. Express `/api/health` endpoint, when called with the session token, returns `200 OK` and the authenticated user's Clerk ID in the response body.

**Alternative paths:**
- If user is already authenticated: skips sign-in, lands directly on app shell.
- Sign-in failure (wrong password, etc.): Clerk handles the error UX; app receives no session token and user stays on sign-in page.
- Invalid/expired token reaching Express: auth middleware returns `401 Unauthorized`.

**Success criteria:**
- A fresh browser (no session) hits the app and reaches the Clerk sign-in page.
- After successful sign-in, the browser reaches an authenticated app shell.
- `curl -H "Authorization: Bearer {token}" https://api.{domain}/api/health` returns `200`.
- `curl https://api.{domain}/api/health` (no token) returns `401`.

**Out of scope:**
- Multi-tenant organization setup (Phase 1 — the Clerk org model is configured but not exercised in Phase 0).
- Role-based route guards (Phase 1).
- User profile page, settings, any application data.

---

### Deliverable 4: Notification Service — Test Send Flow

**What:** Proof that the notification service abstraction works end-to-end: a queued job sends a test email via Resend and a test WhatsApp message via 360dialog.

**Trigger:** An agent (or developer) triggers the notification test job manually (via a test script or a dev-only API endpoint — not user-facing).

**Preconditions:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DIALOG360_API_KEY`, `DIALOG360_WHATSAPP_FROM`, and `REDIS_URL` are set in `.env`. Redis is running.

**Happy path — email:**
1. Developer triggers `npm run notify:test:email` (or equivalent dev script).
2. Script enqueues a `send-notification` BullMQ job with `channel: "email"`, `to: {developer's email}`, `subject: "AAUClubManager Phase 0 Test"`, `body: "Notification service works."`.
3. BullMQ worker picks up the job.
4. Worker calls the notification service with `channel: "email"`.
5. Notification service calls Resend API.
6. Developer's inbox receives the email.
7. Job status in BullMQ marked `completed`.

**Happy path — WhatsApp:**
1. Developer triggers `npm run notify:test:whatsapp` (or equivalent).
2. Script enqueues a `send-notification` job with `channel: "whatsapp"`, `to: {developer's WhatsApp number}`.
3. BullMQ worker calls notification service with `channel: "whatsapp"`.
4. Notification service calls 360dialog API.
5. Developer's WhatsApp receives the message.
6. Job status marked `completed`.

**Alternative paths:**
- If production 360dialog account isn't fully active yet: use the **360dialog sandbox tier** (free, send `START` to `+551146733492` to receive a sandbox API key). Sandbox base URL: `https://waba-sandbox.360dialog.io/v1`. Sandbox limits: 200 msg cap, can only message your own WhatsApp number, 3 predefined templates only. The `IWhatsAppProvider` abstraction is base-URL-driven so dev hits sandbox and prod hits production with no code change. Full Meta Business verification + at least one approved template must be complete before Phase 3 production go-live.
- If a channel credential is missing: worker catches the error, marks job `failed`, logs the error with Pino. No crash.
- If Redis is unreachable: job enqueue fails immediately with a clear error message.

**Success criteria:**
- Email arrives in developer's inbox within 30 seconds of triggering.
- WhatsApp message arrives in developer's WhatsApp (sandbox or production sender).
- BullMQ dashboard (or job status query) shows both jobs as `completed`.
- A missing credential produces a `failed` job status with a readable error log — not an unhandled crash.

**Out of scope:**
- Approved message templates (needed for Phase 3 production sends; sandbox templates are fine for Phase 0).
- Read receipts / delivery webhooks (Phase 3).
- Retry-with-backoff tuning (Phase 3).

---

### Deliverable 5: BullMQ Hello-World Job

**What:** Confirmation that the queue infrastructure works independently of the notification service — a synthetic "hello-world" job that the worker processes and logs.

**Trigger:** Developer runs `npm run queue:test` (dev-only script).

**Happy path:**
1. Script enqueues a `hello-world` job with `payload: { message: "Phase 0 queue test" }`.
2. BullMQ worker picks up the job within 1 second.
3. Worker logs: `[INFO] hello-world job processed: Phase 0 queue test` via Pino.
4. Job status: `completed`.

**Success criteria:** Job completes and the log line appears. Redis connection verified implicitly.

**Out of scope:** Concurrency tuning, dead-letter handling, scheduled/repeatable jobs (Phase 3/5).

---

### Deliverable 6: CI Pipeline

**What:** GitHub Actions workflow that runs on every push to any branch: lint, typecheck, test, build.

**Trigger:** `git push` to any branch.

**Happy path:**
1. Push triggers `.github/workflows/ci.yml`.
2. Workflow runs: ESLint (server + web), TypeScript typecheck, Vitest unit tests, `npm run build` for both server and web.
3. All steps pass: green check on the commit.

**Alternative paths:**
- Any step fails: CI red, PR blocked from merging (once branch protection rules are set).

**Success criteria:** A passing CI run visible in GitHub Actions on the initial commit.

**Out of scope:** E2E (Playwright) tests (no app screens to test yet), deployment pipeline (Phase 1 exit).

---

### Deliverable 7: Design System Seed

**What:** `docs/wiki/ux/design-system.md` — a written design system reference covering brand color palette, typography scale, spacing scale, and a catalog of shadcn/ui components that are pre-approved for use. No custom components yet.

**Owner:** UX Designer

**Acceptance:** The page exists, has at least a placeholder color palette and typography decisions, and is referenced from `docs/wiki/index.md`.

**Note on open questions:** See "Open questions for user" section below — brand color and logo are needed here.

**Out of scope:** Custom component designs, responsive breakpoints per screen, information architecture (Phase 1).

---

### Deliverable 8: Base Data Model (wiki only)

**What:** `docs/wiki/data-model.md` documenting the four base entities: `Club`, `User`, `ClubMembership` (with role), `Season`. These underpin every Phase 1+ module. No schema migrations are run against a production database in Phase 0 (migrations run when the server scaffold is deployed).

**Owner:** Architect

**Acceptance:** Page exists with ER diagram or table definitions for the four base entities. Foreign key constraints and index strategy noted.

**Out of scope:** All module-specific entities (tryout, team, payment, etc.) — those live in per-phase migrations.

---

### Deliverable 9: Engineering Conventions

**What:** Four convention docs created under `docs/wiki/engineering/`:
- `coding-conventions.md` — TypeScript style, naming, module structure
- `testing-conventions.md` — unit vs. integration vs. E2E, what to test per layer
- `database-conventions.md` — Knex patterns, migration naming, RDBMS-agnostic rules
- `git-conventions.md` — branch naming, commit format, PR requirements

**Owner:** Dev Manager

**Acceptance:** All four files exist with substantive content (not just headings).

---

## Out of scope for Phase 0 (explicitly)

- Any user-facing screens beyond the minimal auth shell (no dashboards, no forms, no data)
- Tryout, team, roster, schedule, payment, or tournament functionality
- Multi-tenant org guards (Clerk orgs configured but not tested with real flows)
- Role-based authorization beyond the auth middleware skeleton
- Production database with real data
- E2E tests (Playwright) — no app screens to drive
- Stripe or any payment processor
- AI/ML features of any kind
- Mobile app (web only throughout MVP)

---

## Phase 0 exit criteria (testable)

All of the following must be true before Phase 0 is closed and Phase 1 begins:

**External setup (user-owned):**
- [ ] All 🚨 critical-path items in PHASE-0-kickoff.md completed (Clerk keys, Resend verified domain, 360dialog account active with API key)
- [ ] All 🟡 mid-phase items completed (Postgres + Redis hosted, GitHub repo created, hosting platform selected)

**Agent deliverables:**
- [ ] ADRs 001-004 filed and status `accepted`
- [ ] `GET /api/health` returns `200` with auth check (authenticated = user ID in body; unauthenticated = 401)
- [ ] Web app auth scaffold: unauthenticated browser → Clerk sign-in → authenticated shell (verified manually)
- [ ] `npm run api:generate` runs without error and produces non-empty `web/src/api/client.ts`
- [ ] `npm run notify:test:email` → email arrives in developer inbox
- [ ] `npm run notify:test:whatsapp` → WhatsApp message arrives (sandbox or production sender)
- [ ] `npm run queue:test` → hello-world job completes and is logged
- [ ] CI passes (lint + typecheck + Vitest + build) on initial commit to GitHub
- [ ] `docs/wiki/ux/design-system.md` exists with color palette and typography decisions
- [ ] `docs/wiki/data-model.md` exists with base entities (Club, User, ClubMembership, Season)
- [ ] All four engineering convention docs exist under `docs/wiki/engineering/`

---

## Open questions for user

These need answers before or during Phase 0. They do not block PDD approval but should be resolved before the design system seed and domain/email setup are finalized.

1. **Brand color palette** — Do you have a primary color in mind for AAUClubManager? (A hex code or even a general direction like "blue/navy", "orange", "green" is enough. UX will build the palette from there.) Without this, UX will use a neutral placeholder in the design system that will need to be replaced before Phase 1 UX work begins.

2. **Logo / app name** — Do you have a logo (SVG preferred) or a wordmark? Is "AAUClubManager" the final product name, or is there a shorter brand name (e.g., "ClubMgr", "Hoops HQ")? UX needs this for the design system seed. A placeholder is acceptable for Phase 0 but should be resolved before Phase 1 UI mocks.

3. **Domain name** — What domain have you purchased or will you use? (Referenced in PHASE-0-kickoff.md item 4. Agents need it to configure Resend `FROM` address and deployment URLs.) If undecided, confirm so UX/backend can use a placeholder like `aauclubmanager.app`.

4. **Hosting platform choice** — Have you decided between Vercel (web) + Railway/Render (server) vs. a unified platform? (PHASE-0-kickoff.md item 7.) This determines how agents configure the deployment pipeline and environment variable strategy.

5. **WhatsApp sender strategy** — RESOLVED (2026-05-03): 360dialog adopted from MVP per DECISION-002-B amendment. Twilio not used. Required deliverables: 360dialog account, API key, WhatsApp Business display name, verified phone number, and at least one approved Meta template before Phase 3.

---

## Dependencies on user

Cross-reference: [`pmo/phase-briefs/PHASE-0-kickoff.md`](../../../pmo/phase-briefs/PHASE-0-kickoff.md) — the definitive checklist. The open questions above are the product/UX subset; the kickoff brief covers all external dependencies including technical credentials.

---

## Gate 1 approval

To approve this PDD (and the accompanying UX stub):

```
GATE-1-PHASE-0: approved
```

Or separately:
```
PDD-PHASE-0: approved
MOCKS-PHASE-0: approved
```

Or to request changes:
```
PDD-PHASE-0: needs changes — {description}
```

After Gate 1 passes, Architect proceeds with Phase 0 OpenAPI spec (the `/health` endpoint), which goes to Gate 2.
