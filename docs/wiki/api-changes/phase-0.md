---
title: OpenAPI Changes — Phase 0 — Foundation Baseline
phase: 0
status: approved
filed: 2026-05-03
approved: 2026-05-03
owner: architect
deciders: user
gate: 2-approved
tags: [api, phase-0]
---

# OpenAPI Changes — Phase 0 — Foundation Baseline

> Gate 2 — APPROVED 2026-05-03. Phase 0 implementation is unblocked.
> Full spec: [`api/openapi.yaml`](../../api/openapi.yaml)

---

## Summary

Phase 0 establishes the `api/openapi.yaml` baseline: spec file format (OpenAPI 3.0.3),
security scheme registration (Clerk JWT), shared response schemas, reusable pagination
parameters, and two endpoints (`GET /health`, `GET /api/v1/me`). No domain endpoints are
introduced — those begin in Phase 1. The primary deliverable is a validated spec that drives
a working codegen pipeline, not API surface.

---

## What this baseline establishes

- `api/openapi.yaml` exists, validates, and is the declared single source of truth.
- Server info, contact, license, and env-driven base URL are set.
- `clerkJWT` security scheme is registered (bearer JWT). All protected endpoints reference it.
- Common response schemas: `Error` (RFC 7807 subset), `ValidationError`, `HealthResponse`, `AuthUser`, `PaginationMeta`.
- Reusable parameters: `cursor`, `pageSize`, `sortBy`, `sortOrder`, `filterQ`.
- Reusable responses: `Unauthorized` (401), `Forbidden` (403), `NotFound` (404), `UnprocessableEntity` (422), `InternalServerError` (500).
- Phase 1+ tag namespace declared (`clubs`, `seasons`, `tryouts`, `teams`, `players`, `practices`, `gyms`, `jerseys`, `comms`, `tournaments`, `payments`) — endpoints added per phase.
- Two live endpoints: `GET /health` (no auth) and `GET /api/v1/me` (Clerk JWT required).

---

## New endpoints (added)

| Method | Path | Auth | Purpose | Response schema |
|--------|------|------|---------|-----------------|
| GET | `/health` | none | Liveness + readiness probe for load balancers and CI | `HealthResponse` |
| GET | `/api/v1/me` | `clerkJWT` | Auth identity probe — returns Clerk user from validated JWT | `{ data: AuthUser }` |

### `GET /health` — design notes

- Intentionally **unversioned** (not under `/api/v1/`). Health probes must survive API version changes.
- Returns `200` for both `ok` and `degraded` states. The body discriminates. Returning `503` for degraded is a valid alternative but complicates load balancer configuration — `200` with body inspection is simpler.
- Subsystem detail (`db`, `redis`) included in body only when status is `degraded`, to avoid leaking infrastructure topology in the normal path.
- PDD exit criterion: `curl .../health` returns `200 {"status":"ok"}`.

### `GET /api/v1/me` — design notes

- Returns only Clerk-derived identity (no application data). Phase 1 extends this response with `clubMemberships` and role claims once the `ClubMembership` entity exists.
- PDD exit criterion (Deliverable 3 — Auth Scaffold): `curl -H "Authorization: Bearer {token}" .../api/v1/me` returns `200`; `curl .../api/v1/me` (no token) returns `401`.
- Response shape is `{ data: AuthUser }` — consistent with the envelope convention for all domain endpoints (see Conventions below).

---

## Modified endpoints

None. This is the initial baseline.

---

## New schemas (components)

| Schema | Purpose |
|--------|---------|
| `Error` | RFC 7807 problem-details subset. All 4xx/5xx use this shape. |
| `ValidationError` | Extends `Error`; adds `errors[]` array with `field` + `message` per invalid input. |
| `PaginationMeta` | Cursor pagination metadata (`total`, `pageSize`, `hasMore`, `nextCursor`). |
| `AuthUser` | Clerk-derived user identity (`clerkUserId`, `email`, `firstName`, `lastName`, `imageUrl`). |
| `HealthResponse` | Health probe response (`status`, `timestamp`, `version`, `subsystems`). |

---

## Breaking changes

None. This is the initial baseline — there is no prior spec to break.

---

## Cross-references

- PDD flows this serves: PDD-PHASE-0 Deliverable 2 (Codegen Pipeline), Deliverable 3 (Auth Scaffold Flow)
- ADR this introduces conventions for: ADR-005 (API design conventions — filed alongside this doc)
- Full spec: [`api/openapi.yaml`](../../api/openapi.yaml)

---

## Codegen pipeline design

### Tool choice: `openapi-typescript-codegen`

**Chosen:** [`openapi-typescript-codegen`](https://github.com/ferdikoomen/openapi-typescript-codegen) (npm: `openapi-typescript-codegen`)

**Rationale (one paragraph):** Three tools were assessed:

- `openapi-typescript-codegen` — generates a typed TypeScript client with service classes, request/response types, and error types. Mature, well-maintained, produces readable output. No runtime dependency beyond `node-fetch` or the built-in `fetch`. Works with OpenAPI 3.0.x.
- `orval` — generates React Query hooks directly, which is appealing for the frontend. But it embeds query-layer opinions into the codegen layer, making it harder to use the same SDK in server-side Next.js contexts or future non-React clients. Adds framework coupling we want to avoid.
- `openapi-zod-client` — generates Zod schemas alongside types. Appealing for runtime validation. But Zod schema generation from OpenAPI 3.0 has known edge-case gaps, and adding Zod as a generated-code dependency complicates the pipeline. Not worth it for Phase 0.

`openapi-typescript-codegen` gives typed service classes and enums without framework coupling. The frontend wraps the generated client in `web/src/api/client.ts` (the hand-maintained wrapper that adds auth token injection and TanStack Query integration). This keeps the generated layer thin and the hand-maintained layer in control of cross-cutting concerns.

### Where the generated SDK lives

- **Generated output:** `web/src/api/generated/` — **committed to the repository**.
- **Why committed, not gitignored:** The generated files are small, readable TypeScript. Committing them means (a) PRs show API contract changes as a diff, (b) CI doesn't need to regenerate before type-checking, and (c) the `api:check` script (see below) can fail the CI build if the committed files are out of date with the spec. A gitignored generated dir would require CI to always regenerate before typechecking, adding 5-15 seconds per run and hiding spec drift.

### Where the typed client wrapper lives

- **Hand-written wrapper:** `web/src/api/client.ts`
- **Purpose:** Injects the Clerk auth token into every request (see "Security scheme injection" below), configures the base URL from `NEXT_PUBLIC_API_BASE_URL`, and exports TanStack Query-friendly functions that wrap the generated service methods.
- All frontend code imports from `web/src/api/client.ts`. No file imports directly from `web/src/api/generated/`. This keeps the boundary clean: generated code changes don't force updates throughout the frontend.

### npm scripts

```
api:validate    Validates api/openapi.yaml with openapi-typescript-codegen's built-in linter (or swagger-cli validate). Fails on spec errors. Run before any generation.
api:generate    Runs openapi-typescript-codegen, outputs to web/src/api/generated/. Run after any spec change.
api:check       Regenerates in a temp dir, diffs against web/src/api/generated/. Exits non-zero if there is a diff (i.e., committed SDK is out of date). CI gate.
```

Root `package.json` scripts (illustrative; exact flags set by Backend Dev during scaffolding):

```json
"api:validate": "swagger-cli validate api/openapi.yaml",
"api:generate": "openapi-typescript-codegen --input api/openapi.yaml --output web/src/api/generated --client fetch",
"api:check": "npm run api:generate -- --output /tmp/api-check && diff -r /tmp/api-check web/src/api/generated || (echo 'SDK out of date. Run npm run api:generate and commit.' && exit 1)"
```

### CI gate

GitHub Actions step (in `.github/workflows/ci.yml`):

```yaml
- name: Check OpenAPI SDK is up to date
  run: npm run api:check
```

This step runs after `api:validate`. If the committed `web/src/api/generated/` does not match what the current `api/openapi.yaml` would generate, CI fails with an actionable error message. Developers cannot merge a spec change without regenerating the SDK.

---

## Server-side spec enforcement

### Tool: `express-openapi-validator`

The server uses [`express-openapi-validator`](https://github.com/cdimascio/express-openapi-validator) middleware to validate requests (and optionally responses) against the spec.

```
Development:    request validation ON  + response validation ON
Production:     request validation ON  + response validation OFF
```

**Rationale for the dev/prod split:** Response validation catches server-side bugs (returning the wrong shape) during development, where speed of feedback matters more than latency. In production, response validation adds ~1-5ms per request and would surface errors to the client for a backend bug that should surface only in logs. The trade-off: server bugs slip through in production silently (but are caught in development and in the QA gate). This is acceptable for v1 — re-evaluate in Phase 3 or when SLAs are formalized.

**Registration order in Express:** The validator middleware must be registered **after** auth middleware (so `req.user` is populated before per-endpoint auth guards run) but **before** route handlers (so invalid requests are rejected before business logic runs). The error handler for `express-openapi-validator` must be registered after all routes and before the generic Express error handler.

---

## Security scheme: Clerk JWT

### How the SDK injects the token

The hand-written `web/src/api/client.ts` wrapper:

1. Calls `await clerk.session?.getToken()` before each API call that requires auth.
2. Passes the token as `Authorization: Bearer {token}` in the request header.
3. On 401 response, calls `await clerk.session?.refresh()` and retries once. If still 401, redirects to sign-in.

The generated SDK receives the token via an `OpenAPI.TOKEN` global or a per-request header option (exact mechanism depends on `openapi-typescript-codegen`'s client template — Backend Dev to confirm during scaffolding). The wrapper handles this.

### How the server validates the token

1. Express auth middleware extracts the `Authorization` header.
2. Calls Clerk's `@clerk/clerk-sdk-node` `verifyToken()` utility, which:
   a. Fetches Clerk's JWKS endpoint (cached, TTL 1h) to get the signing key.
   b. Validates the JWT signature, expiry, and `iss` claim against `CLERK_JWKS_URL`.
3. If valid: populates `req.user` with `{ clerkUserId, email, firstName, lastName, orgId, orgRole }`.
4. If invalid: returns `401` with the `Unauthorized` response shape from the spec.
5. Endpoints marked `security: []` in the spec skip the auth middleware entirely (only `GET /health` in Phase 0).

`CLERK_JWKS_URL` is set in the server `.env` file. It is not hardcoded.

---

## Conventions for Phase 1+

These conventions are locked in Phase 0 and apply to all subsequent phases. They are also filed as ADR-005.

### URL pattern

```
/api/v1/{resource}                  Collection
/api/v1/{resource}/{id}             Single resource
/api/v1/{resource}/{id}/{sub}       Sub-resource collection (when ownership is clear)
/api/v1/{resource}/{id}/actions/{action}  Named action (non-CRUD verb)
```

Examples:
- `GET /api/v1/clubs` — list clubs
- `GET /api/v1/clubs/{clubId}` — get single club
- `GET /api/v1/clubs/{clubId}/teams` — teams owned by a club
- `POST /api/v1/tryouts/{tryoutId}/actions/close` — named action (close tryout)

Resource names are **plural nouns**. Named actions use `/actions/{action}` rather than verbs directly on the resource, to avoid verb/noun collision and keep OpenAPI operation IDs clean.

### Response envelope

All responses use:

```json
{ "data": <resource or array>, "meta": <pagination or null>, "error": null }
```

Error responses:

```json
{ "data": null, "error": <Error or ValidationError> }
```

`meta` is omitted for single-resource responses (non-list). List responses always include `meta: PaginationMeta`.

### Pagination: cursor-based (not offset)

All list endpoints use cursor-based pagination. Offset pagination (`?page=3`) is rejected.

**Why cursor over offset:**
- Offset pagination is unstable under concurrent writes: if a row is inserted at position 15 while the user is on page 2, they see a duplicate on page 3. In a club management context (coaches adding players, registrations streaming in), this is a realistic scenario.
- Cursor pagination is stable: the cursor encodes a position in the ordered result set, not an offset. New inserts don't shift positions for already-fetched items.
- The tradeoff: cursor pagination cannot jump to an arbitrary page. This is acceptable — no Phase 0-5 flow requires "jump to page 12."

Cursor encoding: opaque base64-encoded JSON `{ id, sortField, sortValue }`. Clients treat it as a black box. Server decodes and builds the `WHERE` clause accordingly.

### Error format: RFC 7807 problem-details (subset)

All errors use the `Error` schema which is a subset of RFC 7807. Fields:

- `type` — URI identifying the error category (use `about:blank` for generic HTTP errors; domain-specific codes get a real URI in Phase 2+)
- `title` — human-readable error type (not instance-specific)
- `status` — HTTP status code (redundant with HTTP response, included for clients that inspect the body)
- `detail` — instance-specific message (safe to display to the user in dev; sanitized in production)
- `instance` — request URI + request ID for log correlation

**Why RFC 7807:** It is an IETF standard. Using a standard shape means monitoring tools, API gateways, and client libraries can parse errors without custom logic. The `type` URI allows machine-readable error codes without inventing a proprietary code system.

### Field naming

- **JSON (request/response):** `camelCase` — e.g., `clubId`, `createdAt`, `firstName`
- **DB columns:** `snake_case` — e.g., `club_id`, `created_at`, `first_name`
- **Mapping location:** The repository layer (Knex queries) maps `snake_case` DB columns to `camelCase` JS objects. Controllers and services never see `snake_case` field names. This is enforced by convention — no automated mapper in Phase 0 — and documented in `docs/wiki/engineering/database-conventions.md`.

### Idempotency keys (Phase 5 — Payments)

Mutating endpoints in the Payments module (`POST /api/v1/payments`) will require an `Idempotency-Key` request header. The server stores `(key, response)` for 24h and returns the stored response for duplicate keys. The schema for this header will be added to the spec in Phase 5. Documenting the intent here so the server's middleware layer is designed to support it from Phase 0.

---

## What Phase 1 will add to this spec (informational)

This section is a preview for planning purposes. It is not a commitment — Phase 1 API changes will go through Gate 2 review at that time.

Expected Phase 1 additions:
- `POST /api/v1/clubs` — create club (coach)
- `GET /api/v1/clubs/{clubId}` — get club
- `POST /api/v1/seasons` — create season for a club
- `POST /api/v1/tryouts` — create tryout
- `POST /api/v1/tryouts/{id}/registrations` — public (unauthenticated) registration
- `GET /api/v1/tryouts/{id}/registrations` — list registrations (coach only)
- `POST /api/v1/tryouts/{id}/evaluations` — submit evaluation scores (coach)
- `POST /api/v1/tryouts/{id}/selections` — record selection decisions (head coach)
- `POST /api/v1/teams` — create team
- `GET /api/v1/teams/{id}/roster` — get roster
- `POST /api/v1/teams/{id}/roster` — add player to roster
- `GET /api/v1/me` — extended with `clubMemberships[]` and `activeRoles[]`

New schemas expected: `Club`, `Season`, `Tryout`, `TryoutRegistration`, `PlayerEvaluation`, `SelectionDecision`, `Team`, `RosterEntry`, `Player`.

---

## Versioning policy

The spec follows **SemVer**:

- **Patch** (0.1.x): non-breaking additions — new optional fields, new response properties, new optional query parameters.
- **Minor** (0.x.0): additive but notable changes — new endpoints, new required request fields (for new operations only), new schemas.
- **Major** (x.0.0): breaking changes — removing or renaming fields, changing response shape, removing endpoints. Breaking changes require a new ADR and a deprecation period (minimum one phase).

Current spec version: `0.1.0`. Phase 1 is expected to bump to `0.2.0` (minor — new endpoints).

---

## Approval scope

When you reply `OPENAPI-PHASE-0: approved`, you are approving:
- The two endpoints (`GET /health`, `GET /api/v1/me`) — their paths, auth gating, and response shapes
- The shared schemas: `Error`, `ValidationError`, `PaginationMeta`, `AuthUser`, `HealthResponse`
- The reusable parameters: `cursor`, `pageSize`, `sortBy`, `sortOrder`, `filterQ`
- The codegen tool choice (`openapi-typescript-codegen`) and pipeline design (`api:validate`, `api:generate`, `api:check`)
- The server-side enforcement approach (`express-openapi-validator`, dev/prod split)
- The Phase 1+ conventions: URL pattern, response envelope, cursor pagination, RFC 7807 errors, camelCase JSON / snake_case DB
- The idempotency key intent for Phase 5

After approval, ADRs 001-004 will be filed and engineering work (server + web scaffolds) begins.
