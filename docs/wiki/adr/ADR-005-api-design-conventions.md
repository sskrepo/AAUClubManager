---
title: ADR-005 — API Design Conventions
status: accepted
created: 2026-05-03
decided: 2026-05-03
owner: architect
deciders: architect (proposed), user (approves at Gate 2)
supersedes: ~
tags: [arch, api, conventions]
---

# ADR-005 — API Design Conventions

## Context

Phase 0 establishes `api/openapi.yaml` as the single source of truth for all HTTP contracts.
Before Phase 1 domain endpoints are designed, the conventions that govern every endpoint
across all phases must be locked in. Conventions decided late — or decided per-endpoint
without a canonical reference — create inconsistency that is expensive to fix after clients
are in production.

Forces at play:

- The frontend is a TypeScript/Next.js app that consumes a generated SDK. Inconsistency in
  response shapes or error formats forces conditional handling throughout the frontend.
- The backend uses Express + Knex. DB columns are `snake_case`; JS/TypeScript convention is
  `camelCase`. The mapping location must be explicit.
- Phase 5 (Payments) will need idempotency guarantees for payment-recording endpoints. The
  server middleware layer must be designed to support this from Phase 0, not retrofitted.
- Phases 1-5 all involve list views with filtering, sorting, and pagination. A single
  pagination strategy must be chosen before Phase 1 to avoid per-module divergence.
- Error handling must be consistent across all endpoints so the client-side error boundary
  can be written once.

## Decision

The following conventions apply to all endpoints in `api/openapi.yaml`, from Phase 1 onward.
They are enforced via:
1. `express-openapi-validator` middleware on the server (request validation in dev + prod;
   response validation in dev only).
2. The generated SDK and hand-maintained `web/src/api/client.ts` wrapper on the client.
3. Code review: any endpoint that deviates from these conventions must cite an ADR addendum.

### 1. URL pattern

```
/api/v1/{resource}                          Resource collection
/api/v1/{resource}/{id}                     Single resource
/api/v1/{resource}/{id}/{subResource}       Sub-resource (when ownership is clear and depth ≤ 2)
/api/v1/{resource}/{id}/actions/{action}    Named action (non-CRUD)
```

Rules:
- Resource names are **plural nouns** (`clubs`, `teams`, `tryouts`).
- Sub-resource nesting is limited to one level (`/clubs/{id}/teams`), not deeper
  (`/clubs/{id}/teams/{id}/players` — use `/teams/{id}/players` instead).
- Named actions avoid verb-in-path collisions (`/tryouts/{id}/actions/close`, not
  `/closeTryout/{id}`). This keeps the path hierarchy clean and operation IDs unambiguous.
- All domain endpoints are under `/api/v1/`. Infrastructure endpoints (`/health`) are
  unversioned.

### 2. Response envelope

All responses use a consistent top-level envelope:

```typescript
// Success (single resource):
{ "data": Resource, "meta": null }

// Success (list):
{ "data": Resource[], "meta": PaginationMeta }

// Error:
{ "data": null, "error": Error | ValidationError }
```

The `error` key is absent on success responses (not `null`). The `meta` key is absent on
single-resource and error responses. This is stricter than `null` values — clients can use
a type guard on key presence rather than null checks.

### 3. Pagination: cursor-based

All list endpoints use cursor-based pagination. Offset-based pagination
(`?page=N&perPage=M`) is not used.

Parameters: `?cursor={opaque}&pageSize={N}&sortBy={field}&sortOrder={asc|desc}&q={text}`

Response metadata:
```json
{
  "total": 47,
  "pageSize": 20,
  "hasMore": true,
  "nextCursor": "eyJpZCI6NDJ9"
}
```

`total` may be omitted for expensive count queries — clients must not depend on it for
navigation logic. `hasMore` is always present and is the authoritative indicator.

Cursor encoding: base64-encoded JSON `{ id, sortField, sortValue }`. Clients treat it as
opaque. Cursors are invalidated by destructive operations (delete) on the resource — server
returns a `422` with `detail: "Cursor is no longer valid"` if a stale cursor is used.

### 4. Error format: RFC 7807 (subset)

All 4xx and 5xx responses use the `Error` schema:

```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Bearer token is expired. Refresh and retry.",
  "instance": "/api/v1/me?reqId=abc123"
}
```

Validation errors additionally include `errors[]`:

```json
{
  "type": "about:blank",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "Request body failed validation.",
  "errors": [
    { "field": "email", "message": "must be a valid email address", "value": "not-an-email" }
  ]
}
```

Domain-specific error codes (Phase 2+) use a real `type` URI:
`https://aauclubmanager.app/errors/{code}` — e.g., `https://aauclubmanager.app/errors/gym-conflict`.

### 5. Field naming

| Layer | Convention | Example |
|-------|-----------|---------|
| JSON (API request/response) | `camelCase` | `clubId`, `createdAt`, `firstName` |
| DB columns | `snake_case` | `club_id`, `created_at`, `first_name` |
| TypeScript variables | `camelCase` | standard TS convention |

The repository layer performs all `snake_case → camelCase` mapping. Controllers and services
operate entirely in `camelCase`. No `snake_case` field names appear above the repository
boundary.

### 6. Auth gating per endpoint

Every endpoint in the spec declares its security requirements explicitly:

- `security: []` — no auth required (e.g., `GET /health`, public tryout registration)
- `security: [{ clerkJWT: [] }]` — authenticated (valid Clerk JWT)
- Role gating (head_coach only, etc.) is enforced in the service layer, not the OpenAPI
  spec. The spec documents the required role in the endpoint `description` field.
  `express-openapi-validator` handles token validation; role checks are application logic.

### 7. Idempotency keys (Phase 5 — Payments)

Mutating endpoints in the Payments module will require an `Idempotency-Key` request header
(UUID v4). The server will store `(key → response)` for 24 hours and return the cached
response for duplicate requests. This prevents double-charging if a network retry fires
after the first request succeeds.

The header schema will be added to the spec in Phase 5. The server middleware supporting
idempotency must be designed (but not activated) in the Phase 0 scaffold so it can be
enabled per-endpoint without rework.

### 8. Spec versioning

The spec follows SemVer:

- **Patch (0.1.x):** Non-breaking additions — new optional response fields, new optional
  query params.
- **Minor (0.x.0):** Additive changes — new endpoints, new schemas, new required fields
  on new (not existing) operations.
- **Major (x.0.0):** Breaking changes — removed fields, renamed paths, changed response
  shapes. Requires a new ADR and a minimum one-phase deprecation period.

## Consequences

**Positive:**
- A single conventions document means engineers and agents can write new endpoints without
  re-deciding naming, envelope shape, or pagination — consistency is automatic.
- RFC 7807 errors let the client-side error boundary be written once and handle all API
  errors uniformly.
- Cursor pagination prevents duplicate/missing items in list views under concurrent writes —
  a real concern for tryout registrations and payment recording.
- The `camelCase`/`snake_case` split at the repository boundary keeps TypeScript idiomatic
  and DB schemas normalized without friction.
- Committing the generated SDK makes API contract changes visible in PRs as diffs.

**Negative / tradeoffs:**
- Cursor pagination cannot support "jump to page N" UIs. No Phase 0-5 flow requires this,
  but it is a real limitation.
- Response validation in development (via `express-openapi-validator`) adds latency to dev
  server responses (~2-5ms/request). Acceptable in dev; disabled in production.
- RFC 7807 requires the `type` field to be a URI. Using `about:blank` for generic errors is
  slightly unidiomatic but correct per the spec. Domain-specific URIs will be introduced
  gradually from Phase 2 onward.

**Reversibility:**
- URL patterns, envelope shape, and field naming conventions are **not easily reversible**
  after Phase 1 ships — changing them would break all clients. These must be right at Phase 0.
- Pagination strategy can be changed per-endpoint in a later phase (new endpoints can use
  offset if a strong reason emerges), but the default must remain cursor-based.
- Idempotency key design can be refined in Phase 5 without breaking the Phase 0 scaffold.

## Alternatives considered

**Offset pagination (rejected):** Simpler to implement and explain. Rejected because
concurrent inserts cause item duplication/skipping across pages — a realistic problem for
tryout registration (many parents registering simultaneously) and payment history.

**GraphQL (rejected):** Considered briefly given the complex, nested nature of the data
(Club → Season → Team → Player → PaymentRecord). GraphQL's flexibility would help frontend
developers fetch exactly the data they need. Rejected for Phase 0-5 because: (a) the
`express-openapi-validator` + codegen pipeline is simpler to operate, (b) GraphQL's
authorization model (field-level vs. type-level) is more complex for a multi-tenant app,
(c) the agent team's REST + OpenAPI workflow is already designed. Re-evaluate for Phase 6+
if Phase 5 frontend performance becomes an issue.

**JSONAPI (rejected):** Standardized envelope with hypermedia links. Rejected because the
JSONAPI envelope shape (`data: { type, id, attributes, relationships }`) is verbose and
requires custom deserialization in the generated SDK. The RFC 7807 error format is adopted
(it is JSONAPI-compatible) but the full JSONAPI response envelope is not.

**No envelope (`data` directly at root) (rejected):** Simpler for single-resource endpoints.
Rejected because list responses always need metadata, and adding `meta` at the root without
a `data` key causes structural inconsistency. A consistent envelope means the client can
always destructure `const { data, meta } = response` without branching.

## References

- [RFC 7807 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc7807)
- PDD-PHASE-0 — Deliverable 2 (Codegen Pipeline), Deliverable 3 (Auth Scaffold)
- `docs/wiki/api-changes/phase-0.md` — codegen pipeline design and enforcement details
- `api/openapi.yaml` — the spec these conventions govern
