---
title: Testing Conventions
owner: dev-manager
updated: 2026-05-03
tags: [engineering, conventions, testing, vitest]
---

# Testing Conventions

Tools: Vitest + Supertest (server), Vitest + React Testing Library (web), Playwright (E2E — Phase 1+).

Tests must ship in the same commit as the code they test. Code without tests is not reviewable.

---

## Test pyramid

```
                    E2E (Playwright)
                 few, slow, high confidence
            --------------------------------
          Integration (Supertest + real DB*)
       fewer, catches wiring bugs
  ----------------------------------------
   Unit (Vitest, mocked deps)
   many, fast, catches logic bugs
```

*Integration tests in Phase 0 use a local test DB (Docker Postgres). Mocked DB is acceptable for unit tests only.

---

## What to test at each layer

### Unit tests (Vitest — both server and web)

Test business logic in isolation. Mock all I/O (DB, Redis, HTTP, Clerk, Resend, 360dialog).

**Server — test these:**
- Service layer logic (e.g., `NotificationService.send()` calls the right provider; provider errors are caught and wrapped)
- Middleware behavior (auth middleware: valid token → req.user set; missing/invalid token → 401 with correct RFC 7807 body)
- Route handler responses (given a mocked req/res, does the handler return the correct shape?)
- Config validation (missing required env var throws `ConfigurationError` at startup)
- Error class hierarchy (custom errors serialize to correct HTTP status codes)

**Server — do NOT test:**
- Knex query builders in isolation (test them via integration)
- Third-party SDK internals (mock them at the boundary)

**Web — test these:**
- Custom hooks (`useMe()`, etc.) — mock the generated SDK client; assert hook state transitions (loading → data, loading → error)
- Components — render with mock data; assert user-visible content and interaction handlers
- `client.ts` token injection — mock Clerk's `getToken()`; assert `Authorization` header is set; mock a 401 response and assert the refresh-retry chain fires

**Web — do NOT test:**
- shadcn/ui components (they are library code)
- Next.js routing itself
- CSS / visual appearance (use manual QA or Storybook for that)

### Integration tests (Supertest)

Test the Express app as a whole, using a real DB connection and real Knex migrations (not mocked). Use a separate test database (`DATABASE_URL_TEST`).

Phase 0 integration scope:
- `GET /health`: returns 200 when DB and Redis are reachable; returns degraded shape when DB/Redis are faked to fail.
- `GET /api/v1/me`: returns 200 with correct AuthUser body when a valid Clerk JWT is presented (mock only the Clerk JWT verification — not the full Clerk SDK).

Integration tests run in CI using a Docker service (see `.github/workflows/ci.yml`).

### E2E tests (Playwright — Phase 1+)

Not applicable in Phase 0 (no UI screens to test). Playwright is added to `web/` as a dev dep in Phase 1 when the first real screen ships.

E2E scope (Phase 1+):
- Critical user flows only (sign-in, create club, register for tryout)
- Not: every edge case (that's unit territory)

---

## Test file location and naming

```
server/src/routes/health.test.ts       Co-located with the module under test
server/src/middleware/auth.test.ts
server/src/services/notification/notification.service.test.ts

web/src/api/client.test.ts
web/src/app/(authenticated)/page.test.tsx
web/src/hooks/useMe.test.ts
```

Pattern: `{module}.test.ts` or `{component}.test.tsx`, co-located with the file they test.

Integration tests:
```
server/src/__tests__/health.integration.test.ts
server/src/__tests__/me.integration.test.ts
```

---

## Vitest configuration

### Server (`server/vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.integration.test.ts'],
    coverage: { reporter: ['text', 'lcov'], exclude: ['src/scripts/**'] },
  },
});
```

Integration tests run separately:
```
vitest run --config vitest.integration.config.ts
```

### Web (`web/vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
  },
});
```

`web/src/test/setup.ts` runs `@testing-library/jest-dom/extend-expect` and any global mocks.

---

## Mocking rules

- **External services** (Resend, 360dialog, Clerk) are always mocked in unit tests. Never make real network calls in unit tests.
- **Knex / DB** is mocked in unit tests; real in integration tests. Use Vitest's `vi.mock()` at the module boundary.
- **BullMQ queues** are mocked in unit tests for notification service tests. The worker tests use a real in-memory Redis (via `ioredis-mock`) or a Docker Redis in CI.
- **Clerk JWT** verification (`clerkClient.verifyToken`) is mocked in unit tests by returning a fixed payload or throwing an error. Integration tests mock it at the middleware level (inject a pre-validated `req.user`).

**Prohibition:** Do not use `vi.mock()` on modules that are themselves the subject under test. Test the real implementation; mock its dependencies.

---

## Acceptance criteria for tests

A task's tests are "done" when:
1. Happy path: the primary success case is tested.
2. Error path(s): each distinct error condition has at least one test.
3. Edge cases: boundary values are tested where logic branches on them.
4. No test asserts on internal implementation details — tests assert on observable behavior (return values, side effects, rendered output).
5. `npm run test` in the relevant package passes with no failures and no skipped tests.

---

## Coverage targets

Phase 0: No enforced coverage percentage. Coverage report is generated but not gated in CI.
Phase 1: Coverage gate added to CI at 70% line coverage on `server/src/services/` and `server/src/routes/`.
Rationale: Enforcing coverage before there is enough code to have meaningful coverage produces coverage theater. The rule is: every behavior the PDD acceptance criteria reference must have a test.
