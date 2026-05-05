---
title: PHASE 0 — Foundation — Engineering Task Breakdown
phase: 0
status: active
filed: 2026-05-03
owner: dev-manager
tags: [phase:0, engineering, tasks]
---

# PHASE 0 — Engineering Task Breakdown

> Source of truth: [PDD-PHASE-0.md](../../docs/wiki/pdd/PDD-PHASE-0.md) (Gate 1 approved 2026-05-03), [api/openapi.yaml](../../api/openapi.yaml) (Gate 2 approved 2026-05-03).
> Backend Dev and Frontend Dev execute against this list. Do not expand scope.

---

## Sequencing summary

1. **Start immediately (no blockers):** TASK-001 through TASK-007 (server scaffold without auth wiring, codegen pipeline, BullMQ hello-world scaffold, health endpoint stub, CI file, engineering conventions). These need only the repo and local Docker Redis — no external credentials.

2. **Credential-gated work:**
   - Clerk keys (`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) unlock: TASK-008 (auth middleware), TASK-009 (web Clerk provider + sign-in pages), TASK-010 (auth smoke test).
   - Resend + 360dialog keys + Redis URL (production) unlock: TASK-013 (notification test scripts against real providers).
   - GitHub repo URL unlocks: TASK-020 (CI push + branch protection).

3. **Recommended Backend order:** TASK-001 → TASK-002 → TASK-003 → TASK-005 → TASK-006 → TASK-007 (parallel: TASK-008 when Clerk keys land) → TASK-013 → TASK-014 → TASK-015 → TASK-016.

4. **Recommended Frontend order:** TASK-009 can start in parallel with TASK-001 (Next.js scaffold has no server dependency). TASK-011 (codegen + client.ts) depends only on the codegen scripts TASK-003 produces. TASK-012 (auth shell) depends on TASK-009 + Clerk keys.

5. **Convergence point:** When TASK-003 is done (codegen pipeline wired, `npm run api:generate` works), Frontend runs it locally and stops using any hand-written fetch stubs. At that point BE and FE are truly working against the same typed contract.

---

## Deliverable 1 — Architecture Decision Records (ADRs 001-004)

> Owner: Architect (not Backend/Frontend dev). Included here for completeness and sequencing visibility.

### TASK-001 [architect]
**File ADR-001 (Clerk), ADR-002 (Knex+Postgres), ADR-003 (Resend+360dialog), ADR-004 (BullMQ+Redis)**

- Acceptance: All four files exist at `docs/wiki/adr/ADR-00N-*.md` with `status: accepted`. Content matches stack decisions in `CLAUDE.md` and DECISION-002 (as revised 2026-05-03 — 360dialog from MVP, Twilio eliminated).
- Dependencies: None — Gate 1 passed.
- Credential blockers: None.
- Effort: S (each ADR is 1-2 pages of rationale; stack is already decided).

---

## Deliverable 2 — OpenAPI Codegen Pipeline

> Primarily Backend Dev (scripts, server-side validator). Frontend Dev runs the output.

### TASK-002 [backend]
**Root package.json: add `api:validate`, `api:generate`, `api:check` scripts**

- What: Add `swagger-cli` (dev dep at root) and `openapi-typescript-codegen` (dev dep in `web/`). Wire three npm scripts in root `package.json`:
  - `api:validate` — `swagger-cli validate api/openapi.yaml`
  - `api:generate` — `openapi-typescript-codegen --input api/openapi.yaml --output web/src/api/generated --client fetch`
  - `api:check` — regenerate to temp dir, diff against committed `web/src/api/generated/`, exit 1 if diff exists
- Acceptance: `npm run api:validate` passes cleanly on the committed `api/openapi.yaml`. `npm run api:generate` completes without error and writes non-empty files to `web/src/api/generated/`. `npm run api:check` exits 0 when SDK is in sync, exits 1 after manually deleting a generated file.
- Dependencies: Repo initialized with root `package.json`.
- Credential blockers: None.
- Effort: S.

### TASK-003 [backend]
**Initial SDK generation: commit `web/src/api/generated/` to repo**

- What: Run `npm run api:generate` once. Inspect output. Commit the generated files. Add a `// DO NOT EDIT` header comment notice via the codegen config (or manually if the tool doesn't support it). Confirm the generated types include `HealthResponse`, `AuthUser`, `Error`, `ValidationError`, `PaginationMeta`, `getHealth()`, `getMe()`.
- Acceptance: `web/src/api/generated/` is committed and non-empty. `npm run api:check` exits 0 on a clean checkout.
- Dependencies: TASK-002.
- Credential blockers: None.
- Effort: S.

### TASK-004 [backend]
**Server middleware: `express-openapi-validator`**

- What: Install `express-openapi-validator`. Register it in `server/src/app.ts` (or equivalent entry point) after the auth middleware stub but before route handlers. Load `api/openapi.yaml` from the project root (relative path from server process cwd, or an absolute path derived from `__dirname`). Configure: request validation ON in all envs; response validation ON only when `NODE_ENV=development`. Register the OAV error handler after all routes and before the generic Express error handler.
- Acceptance: `GET /health` with a malformed response body (manually broken in a test) returns a 500 with the `Error` schema shape in dev. `GET /health` with a valid body returns 200. The middleware registration order matches the ADR-005 prescription (auth middleware → OAV → routes → OAV error handler → generic error handler).
- Dependencies: Server scaffold (TASK-005) must exist first — this is middleware registration.
- Credential blockers: None.
- Effort: S.

Note: TASK-004 depends on TASK-005. Sequence: TASK-005 → TASK-004.

---

## Deliverable 3 — Auth Scaffold (Clerk)

### TASK-005 [backend]
**`server/` scaffold: Express + TypeScript + Knex + Pino, no auth wiring yet**

- What: Initialize `server/` with:
  - `package.json` with deps: `express`, `knex`, `pg`, `pino`, `pino-http`, `dotenv`, `cors`
  - Dev deps: `typescript`, `@types/express`, `@types/node`, `vitest`, `supertest`, `@types/supertest`, `tsx` (or `ts-node`), `nodemon`
  - `tsconfig.json` (strict mode, `target: ES2022`, `moduleResolution: bundler` or `node16`)
  - `src/app.ts` — Express app factory (no listen; export the `app` for testing)
  - `src/server.ts` — calls `app.listen()`, used only in production startup
  - `src/routes/health.ts` — implements `GET /health` per the OpenAPI spec exactly (status, timestamp, version, subsystems). Subsystem checks: Knex `.raw('SELECT 1')` for DB; Redis ping for Redis. On check failure: returns `degraded` with the failed subsystem noted; does NOT return 500 (a degraded but live server is still a 200).
  - Pino logger configured; `pino-http` request logging middleware added.
  - Knex config in `src/db/knex.ts` — reads `DATABASE_URL` from env; connection pool: min 2, max 10.
  - `src/config.ts` — all env vars read here; fail-fast if required vars are absent.
  - `.env.example` — lists all required vars with descriptions.
- Acceptance: `npm run dev` starts the server. `curl http://localhost:3001/health` returns `{"status":"ok","timestamp":"...","version":"0.1.0"}` (DB + Redis checks pass with local Docker). `npm run build` produces a `dist/` with no TS errors. `npm run typecheck` exits 0.
- Dependencies: None (can start immediately).
- Credential blockers: Local dev uses Docker Postgres + Docker Redis. Production `DATABASE_URL`/`REDIS_URL` needed only for deploy validation — not for the scaffold task.
- Effort: M.

### TASK-006 [backend]
**Auth middleware: Clerk JWT validation**

- What: Install `@clerk/clerk-sdk-node`. Create `src/middleware/auth.ts`:
  - Extract `Authorization: Bearer {token}` header.
  - Call `clerkClient.verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })`.
  - On success: populate `req.user = { clerkUserId, email, firstName, lastName }` (shape derived from Clerk JWT claims).
  - On failure (missing token, invalid, expired): return `401` with the `Unauthorized` response shape from the spec (RFC 7807 subset: `{ type, title, status, detail }`).
  - Endpoints with `security: []` in the spec bypass this middleware (only `GET /health` in Phase 0).
- Register auth middleware globally in `app.ts` with an exclusion list (or register only on versioned routes under `/api/v1/`).
- Create `src/routes/me.ts` — `GET /api/v1/me` handler that reads `req.user` and returns `{ data: AuthUser }` per spec.
- Add TypeScript declaration merging for `req.user` in `src/types/express.d.ts`.
- Acceptance: `curl -H "Authorization: Bearer {valid-token}" http://localhost:3001/api/v1/me` returns `200` with `{ data: { clerkUserId, email, ... } }`. `curl http://localhost:3001/api/v1/me` (no token) returns `401` with RFC 7807 body. Invalid token returns `401`. `GET /health` (no token) still returns `200` (excluded from auth middleware).
- Dependencies: TASK-005. Clerk keys from user.
- Credential blockers: `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` required.
- Effort: M.

### TASK-007 [frontend]
**`web/` scaffold: Next.js 15 + TypeScript + Tailwind + shadcn/ui**

- What: Initialize `web/` using `create-next-app` with TypeScript, Tailwind, App Router. Then:
  - Install `shadcn/ui` and initialize (`npx shadcn-ui init`). Choose "New York" style, CSS variables on.
  - Install TanStack Query v5 (`@tanstack/react-query`). Set up `QueryClientProvider` in a root layout client component.
  - Configure `NEXT_PUBLIC_API_BASE_URL` env var (default: `http://localhost:3001`).
  - Scaffold `web/src/app/layout.tsx` as the root layout (no Clerk yet — that's TASK-009).
  - Scaffold `web/src/app/page.tsx` — static placeholder: "AAUClubManager — Phase 0 scaffold".
  - `next.config.ts` — allow `NEXT_PUBLIC_API_BASE_URL` passthrough.
  - `.env.local.example` — lists `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Acceptance: `npm run dev` in `web/` starts with no errors. `npm run build` exits 0. `npm run typecheck` exits 0. The placeholder page renders at `localhost:3000`.
- Dependencies: None (can start in parallel with TASK-005).
- Credential blockers: None for the scaffold itself; Clerk keys needed for TASK-009.
- Effort: M.

### TASK-008 [frontend]
**Clerk provider + sign-in/sign-up routes + protected route middleware**

- What: Install `@clerk/nextjs`. Wrap the app:
  - `web/src/app/layout.tsx` — wrap with `<ClerkProvider publishableKey={NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>`.
  - `web/src/middleware.ts` — Clerk's `authMiddleware()` (or `clerkMiddleware()` per Next.js 15 pattern) protecting all routes except `/sign-in`, `/sign-up`, and `/_next/*` static assets.
  - `web/src/app/sign-in/[[...sign-in]]/page.tsx` — render `<SignIn />` component.
  - `web/src/app/sign-up/[[...sign-up]]/page.tsx` — render `<SignUp />` component.
  - `web/src/app/(authenticated)/layout.tsx` — protected layout shell. A route group for all pages that require auth. Contains an `<AuthenticatedShell>` client component that shows a "Dashboard" heading and the user's email.
  - `web/src/app/(authenticated)/page.tsx` — the post-login landing: authenticated placeholder with user's name visible.
- Acceptance: Fresh browser (cleared cookies) hits `http://localhost:3000` → redirected to Clerk sign-in. After signing in, redirected to authenticated shell showing user's name. `npm run build` exits 0. TypeScript strict check passes.
- Dependencies: TASK-007. Clerk keys.
- Credential blockers: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Effort: M.

### TASK-009 [frontend]
**`web/src/api/client.ts` — hand-written SDK wrapper with Clerk token injection**

- What: Create the typed client wrapper that all frontend code imports from (never from `web/src/api/generated/` directly):
  - Reads `NEXT_PUBLIC_API_BASE_URL` for the base URL.
  - Before each auth-required call: `await clerk.session?.getToken()` to get the JWT.
  - Injects `Authorization: Bearer {token}` header.
  - On 401: calls `await clerk.session?.refresh()` and retries once; if still 401, redirects to sign-in.
  - Exports TanStack Query-friendly functions: e.g., `export function useMe() { return useQuery({ queryKey: ['me'], queryFn: () => getMeClient() }) }`.
  - For Phase 0, exports: `useHealth()` (no auth) and `useMe()` (auth required).
  - `getHealth()` and `getMe()` delegate to the generated service in `web/src/api/generated/`.
- Acceptance: `useMe()` called in an authenticated page returns `{ data: { clerkUserId, email, ... } }` matching the OpenAPI `AuthUser` schema. `useHealth()` returns the `HealthResponse`. If the Clerk session expires, the 401 retry-and-redirect chain fires correctly. TypeScript strict check passes — no `any` types.
- Dependencies: TASK-003 (generated SDK must exist), TASK-008 (Clerk provider must be wired).
- Credential blockers: Clerk keys (transitive, via TASK-008).
- Effort: M.

### TASK-010 [both — backend + frontend]
**E2E auth smoke test (manual + automated)**

- What: Verify the complete auth flow end-to-end.
  - **Manual:** Fresh browser → sign in → authenticated shell visible → open DevTools Network tab → confirm `GET /api/v1/me` returns `200`.
  - **Automated (Supertest — server):** Unit test in `server/src/routes/me.test.ts` that mocks `verifyToken` to return a valid Clerk payload, then asserts `GET /api/v1/me` returns `200` with `{ data: { clerkUserId, email } }`. Also asserts that `GET /api/v1/me` with no token returns `401` with the RFC 7807 error body.
  - **Automated (RTL — frontend):** Component test in `web/src/app/(authenticated)/page.test.tsx` that renders the authenticated shell with a mocked `useMe()` return and asserts the user's email is visible.
- Acceptance: Both automated test suites pass with `npm run test` in server/ and web/. Manual walkthrough succeeds without JS console errors.
- Dependencies: TASK-006, TASK-009.
- Credential blockers: Clerk keys (transitive).
- Effort: S.

---

## Deliverable 4 — Notification Service Abstraction + Test Send

### TASK-011 [backend]
**Notification service abstraction: channel-agnostic interface**

> **Decision note (2026-05-03):** This task was originally written with `TwilioWhatsAppProvider` as the MVP WhatsApp implementation. Same-day user direction changed the WhatsApp provider to 360dialog from MVP, eliminating Twilio from the stack entirely. The abstraction design (`IWhatsAppProvider` interface) is unchanged and remains correct — only the default implementation class and env var names are updated. See ADR-003-notifications-resend-360dialog and DECISION-002-B (revised).

- What: Create `server/src/services/notification/` with:
  - `types.ts` — TypeScript interface `NotificationPayload { channel: 'email' | 'whatsapp'; to: string; subject?: string; body: string; }`.
  - `notification.service.ts` — `NotificationService` class with `send(payload: NotificationPayload): Promise<void>`. Internally switches on `payload.channel` to the correct provider implementation.
  - `providers/email.provider.ts` — wraps Resend SDK. Install `resend` package. Reads `RESEND_API_KEY`, `RESEND_FROM_EMAIL` from env. Implements `sendEmail(to, subject, body)`.
  - `providers/whatsapp.provider.ts` — implements `IWhatsAppProvider` using the 360dialog REST API directly (no official Node SDK; use `node-fetch` or the built-in `fetch`). Class name: `Dialog360WhatsAppProvider`. Reads `DIALOG360_API_KEY`, `DIALOG360_WHATSAPP_FROM` from env. The 360dialog send message endpoint is `POST https://waba.360dialog.io/v1/messages` with `Authorization: {DIALOG360_API_KEY}` header. Implements `sendWhatsApp(to, body)`.
  - CRITICAL (DECISION-002-B, revised): The `NotificationService.send()` method must depend on the `IWhatsAppProvider` interface, not on `Dialog360WhatsAppProvider` directly. If 360dialog ever needs to be replaced, the change is entirely in `providers/whatsapp.provider.ts` — no changes to `notification.service.ts`, no changes to any BullMQ job handlers, no changes to any calling code. The abstraction is unchanged from the original design; only the implementation class changes.
  - Missing credential handling: if `RESEND_API_KEY` is absent when the email provider is instantiated, throw a descriptive `ConfigurationError` at startup (not at send time). Same for `DIALOG360_API_KEY`.
- Acceptance: `NotificationService` class is instantiatable and passes unit tests with provider stubs. TypeScript interface `IWhatsAppProvider` exists and `Dialog360WhatsAppProvider` implements it. Swapping to any future WhatsApp provider requires only creating a new file implementing `IWhatsAppProvider` and updating the DI injection point — no other changes.
- Dependencies: TASK-005 (server scaffold must exist).
- Credential blockers: None for the abstraction itself. Test scripts (TASK-013) need real keys.
- Effort: M.

### TASK-012 [backend]
**BullMQ worker: `send-notification` queue**

- What: Install `bullmq` and `ioredis`. Create:
  - `server/src/workers/notification.worker.ts` — BullMQ `Worker` on queue name `send-notification`. Job handler calls `NotificationService.send(job.data)`. On provider error: catches, logs with Pino, marks job `failed` (do not crash the worker process). Redis connection via `REDIS_URL`.
  - `server/src/workers/index.ts` — starts all workers; exported and called from `server.ts`.
  - Worker startup logs: `[INFO] notification worker started` via Pino.
- Acceptance: Worker starts without error when `REDIS_URL` points at local Docker Redis. A manually enqueued job (via Redis CLI or test script) is processed and the Pino log line appears. A job with a bad payload (missing `channel`) fails gracefully with a logged error — no unhandled exception.
- Dependencies: TASK-011 (notification service), TASK-005 (Knex/Pino/config already initialized).
- Credential blockers: `REDIS_URL` (local Docker Redis works for dev).
- Effort: M.

### TASK-013 [backend]
**Dev scripts: `notify:test:email` and `notify:test:whatsapp`**

> **Decision note (2026-05-03):** WhatsApp provider is 360dialog (not Twilio). Env vars and API call target updated accordingly.

- What: Two scripts in `server/scripts/` (run with `tsx`):
  - `notify-test-email.ts` — instantiates a BullMQ `Queue` on `send-notification`, enqueues `{ channel: 'email', to: process.env.TEST_EMAIL, subject: 'AAUClubManager Phase 0 Test', body: 'Notification service works.' }`, logs the job ID, exits.
  - `notify-test-whatsapp.ts` — same pattern with `{ channel: 'whatsapp', to: process.env.TEST_WHATSAPP_NUMBER, body: 'AAUClubManager Phase 0 Test - WhatsApp works.' }`. The worker calls `Dialog360WhatsAppProvider` which POSTs to the 360dialog REST API.
  - Add `notify:test:email` and `notify:test:whatsapp` npm scripts in `server/package.json`.
  - Add `TEST_EMAIL` and `TEST_WHATSAPP_NUMBER` to `.env.example`.
- Acceptance: Running `npm run notify:test:email` enqueues a job (confirmed by logged job ID). When the worker is running and Resend credentials are present, the email arrives in the developer's inbox within 30 seconds. WhatsApp message arrives when 360dialog credentials are present and the recipient's phone has WhatsApp. When credentials are absent: job is enqueued but worker marks it `failed` with a readable Pino error log — no crash, no unhandled exception.
- Dependencies: TASK-012.
- Credential blockers: For the script itself: none. For the actual delivery: `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (email), `DIALOG360_API_KEY` + `DIALOG360_WHATSAPP_FROM` (WhatsApp).
- Effort: S.

---

## Deliverable 5 — BullMQ Hello-World Job

### TASK-014 [backend]
**BullMQ hello-world queue + worker**

- What: Create:
  - `server/src/workers/hello.worker.ts` — BullMQ `Worker` on queue `hello-world`. Job handler logs: `[INFO] hello-world job processed: {job.data.message}` via Pino. Marks `completed`.
  - `server/scripts/queue-test.ts` — enqueues `{ message: 'Phase 0 queue test' }` on `hello-world` queue, then exits.
  - npm script: `queue:test` in `server/package.json`.
  - Add hello worker to `server/src/workers/index.ts`.
- Acceptance: `npm run queue:test` enqueues the job. Within 1 second (with worker running), the Pino log line `[INFO] hello-world job processed: Phase 0 queue test` appears. Redis connection verified implicitly.
- Dependencies: TASK-005 (Pino, config), TASK-012 (BullMQ/ioredis already installed as deps — install in TASK-012, reuse here).
- Credential blockers: `REDIS_URL` (local Docker Redis works).
- Effort: S.

---

## Deliverable 6 — CI Pipeline

### TASK-015 [backend]
**Vitest unit test suites: health route, auth middleware, notification service**

- What: Write unit tests using Vitest + Supertest covering:
  - `server/src/routes/health.test.ts`: GET /health returns 200 with correct shape when DB+Redis are healthy; returns 200 with `degraded` and subsystem detail when one check fails. Mock Knex and Redis pings.
  - `server/src/middleware/auth.test.ts`: valid token → `req.user` populated; missing token → 401 RFC 7807; expired/invalid token → 401.
  - `server/src/routes/me.test.ts`: with mocked valid `req.user` → returns 200 `{ data: AuthUser }`; no user → 401.
  - `server/src/services/notification/notification.service.test.ts`: `send()` with `channel: 'email'` calls email provider; `channel: 'whatsapp'` calls `IWhatsAppProvider` (stub — do not depend on `Dialog360WhatsAppProvider` directly in tests); missing provider credential throws `ConfigurationError` at instantiation.
- Acceptance: `npm run test` in `server/` runs all suites and passes. Coverage report includes the above modules. No Vitest `any` suppressions.
- Dependencies: TASK-006, TASK-011.
- Credential blockers: None — all external dependencies mocked.
- Effort: M.

### TASK-016 [frontend]
**Vitest unit test suites: client wrapper, authenticated shell**

- What:
  - `web/src/api/client.test.ts`: mock the generated SDK; assert `useMe()` injects Bearer token; assert 401 triggers refresh-and-retry.
  - `web/src/app/(authenticated)/page.test.tsx`: render with mocked `useMe()` returning `{ data: { email: 'test@example.com', ... } }`; assert user's email renders.
- Acceptance: `npm run test` in `web/` passes all suites.
- Dependencies: TASK-009, TASK-008.
- Credential blockers: None — all Clerk SDK calls mocked.
- Effort: S.

### TASK-017 [backend]
**GitHub Actions CI workflow**

- What: Create `.github/workflows/ci.yml`. Workflow triggers on `push` and `pull_request` to any branch. Steps in order:
  1. `actions/checkout` + `actions/setup-node` (Node 20, npm cache).
  2. `npm ci` (root).
  3. `npm run api:validate` (validates openapi.yaml).
  4. `npm run api:check` (fails if committed SDK is out of date with spec).
  5. In `server/`: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`.
  6. In `web/`: `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.
  - Use a matrix strategy if server/web steps can run in parallel — they can (no runtime dependency between them at CI lint/test time).
  - `npm run lint` scripts: `eslint src/` in both server and web. ESLint configs to be created as part of this task.
  - No secrets required for CI to pass (all tests mock external services).
- Acceptance: A passing CI run visible in GitHub Actions on the first push to the repo. `api:check` step catches a deliberate SDK-out-of-date condition (manually tested). Lint and typecheck catch a deliberate type error (manually tested).
- Dependencies: TASK-002 (api:check script), TASK-015, TASK-016 (tests must exist to run).
- Credential blockers: GitHub repo URL (user must create the repo and provide the remote URL).
- Effort: S.

---

## Deliverable 7 — Design System Seed

> Owner: UX Designer. Already filed (`docs/wiki/ux/design-system.md`). Dev Manager notes one engineering follow-up.

### TASK-018 [frontend]
**Wire design system tokens into `web/`: Tailwind config + CSS variables**

- What: Translate the design system decisions from `docs/wiki/ux/design-system.md` into the Tailwind config and CSS variables:
  - `web/tailwind.config.ts` — extend the theme with the brand color palette (Club Blue and scale), typography scale (font families, sizes), and spacing tokens from the design system doc.
  - `web/src/app/globals.css` — declare CSS custom properties for color tokens (matching shadcn/ui's CSS variable convention) so that shadcn components pick up the brand colors automatically.
  - Install any font packages referenced in the design system (e.g., Google Fonts via `next/font`).
- Acceptance: shadcn/ui `<Button>` and `<Card>` components render with brand colors in the authenticated shell. `npm run build` exits 0.
- Dependencies: TASK-007 (web scaffold must exist), design system doc must be approved (it is, Gate 1 passed).
- Credential blockers: None. Note: Brand color is currently a placeholder (`#3b82f6`). This task should be run with the placeholder and flagged as "pending brand confirmation" — it takes 15 minutes to update when the user confirms the final color.
- Effort: S.

---

## Deliverable 8 — Base Data Model (wiki only)

> Owner: Architect. No code tasks in Phase 0 — migrations run in Phase 1.
> Engineering follow-up: Backend Dev must confirm Knex migration naming convention matches `docs/wiki/engineering/database-conventions.md` before writing Phase 1 migrations.

### TASK-019 [architect]
**File `docs/wiki/data-model.md` with Club, User, ClubMembership, Season entities**

- Acceptance: Page exists with table definitions (column names in `snake_case`, types, FK constraints, index strategy noted). Foreign keys and indexes are annotated. Knex migration filename pattern is specified.
- Dependencies: None.
- Credential blockers: None.
- Effort: S.

---

## Deliverable 9 — Engineering Conventions

> Owner: Dev Manager. See `/docs/wiki/engineering/` — seeded in this session.

### TASK-020 [dev-manager]
**Seed `docs/wiki/engineering/` convention docs**

- What: Four docs — `coding-conventions.md`, `testing-conventions.md`, `database-conventions.md`, `git-conventions.md`. Filed in this session. Content is substantive, not placeholder headings.
- Acceptance: All four files exist and contain actionable rules agents and devs can follow immediately.
- Dependencies: None.
- Credential blockers: None.
- Effort: S.
- Status: DONE (filed this session).

---

## Dependency graph (readable)

```
TASK-001 (ADRs)                — no deps, start immediately
TASK-002 (codegen scripts)     — no deps, start immediately
TASK-003 (initial SDK gen)     — depends on TASK-002
TASK-005 (server scaffold)     — no deps, start immediately
TASK-007 (web scaffold)        — no deps, start immediately in parallel

TASK-004 (OAV middleware)      — depends on TASK-005
TASK-006 (auth middleware)     — depends on TASK-005 + CLERK keys
TASK-008 (Clerk provider web)  — depends on TASK-007 + CLERK keys
TASK-009 (client.ts wrapper)   — depends on TASK-003 + TASK-008

TASK-011 (notif service)       — depends on TASK-005
TASK-012 (notif worker)        — depends on TASK-011
TASK-013 (notify test scripts) — depends on TASK-012 + provider creds (soft)
TASK-014 (hello-world job)     — depends on TASK-005 (BullMQ deps shared with TASK-012)

TASK-015 (BE tests)            — depends on TASK-006, TASK-011
TASK-016 (FE tests)            — depends on TASK-008, TASK-009
TASK-017 (CI workflow)         — depends on TASK-002, TASK-015, TASK-016
                                 + GitHub repo URL (user)

TASK-010 (auth smoke test)     — depends on TASK-006, TASK-009
TASK-018 (design tokens)       — depends on TASK-007
TASK-019 (data model wiki)     — no deps (architect)
TASK-020 (conventions)         — no deps (DONE)
```

---

## Credential blockers summary

| Credential | Unlocks tasks |
|---|---|
| `CLERK_SECRET_KEY` + `CLERK_PUBLISHABLE_KEY` | TASK-006, TASK-008, TASK-009, TASK-010 |
| `RESEND_API_KEY` + `RESEND_FROM_EMAIL` | TASK-013 (email test delivery) |
| `DIALOG360_API_KEY` + `DIALOG360_WHATSAPP_FROM` | TASK-013 (WhatsApp test delivery) |
| GitHub repo URL | TASK-017 (CI push + branch protection) |
| `REDIS_URL` (production) | TASK-013, TASK-014 (local Docker Redis works for dev) |
| `DATABASE_URL` (production) | TASK-005 health subsystem check (local Docker Postgres works for dev) |

---

## Phase 0 exit checklist (engineering view)

- [x] TASK-001: ADRs 001-004 filed (ADR-003 = Resend+360dialog) — Architect ✅
- [x] TASK-002 + TASK-003: `npm run api:generate` completes, SDK committed — BE ✅ (2026-05-03)
- [x] TASK-004: `express-openapi-validator` registered — BE ✅ (2026-05-03)
- [x] TASK-005: `GET /health` returns `200` (local Docker) — BE ✅ (2026-05-03; degraded path unit-tested)
- [x] TASK-006 + TASK-008 + TASK-009: auth flow works end-to-end — BE middleware ✅ (2026-05-03); FE ✅ (2026-05-04)
- [ ] TASK-010: auth smoke test passes (manual + automated) — BE unit tests ✅; manual walkthrough pending (needs local Docker)
- [x] TASK-011 + TASK-012 + TASK-013: notification service, workers, and dev scripts shipped — BE ✅ (2026-05-03); live delivery test pending real creds/Docker Redis
- [x] TASK-014: hello-world queue job + script shipped — BE ✅ (2026-05-03)
- [x] TASK-015 + TASK-016: all unit tests pass — BE 27/27 ✅; FE 14/14 ✅
- [x] TASK-017: CI workflow filed (.github/workflows/ci.yml) — BE ✅ (2026-05-03); green run pending first push to GitHub
- [x] TASK-018: design tokens wired — FE ✅ (2026-05-04)
- [ ] TASK-019: data model wiki filed — Architect (pending)
- [x] TASK-020: conventions docs filed — Dev Manager ✅ (DONE)
