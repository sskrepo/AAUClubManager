---
title: ADR-002 — Database: Knex + PostgreSQL
status: accepted
created: 2026-05-03
decided: 2026-05-03
owner: architect
deciders: user, architect
supersedes: ~
tags: [arch, data, database]
---

# ADR-002 — Database: Knex + PostgreSQL

## Context

AAUClubManager requires a relational data store for multi-tenant operational
data: clubs, seasons, teams, rosters, practices, gyms, jerseys, tournaments,
and payments. Key constraints:

- **RDBMS-agnostic** — CLAUDE.md mandates no DB-specific features without a
  portable abstraction. The goal is the ability to run on Postgres, MySQL, or
  SQLite without rewriting queries.
- **Multi-tenancy via row-level scoping** — All entities carry a `club_id` FK.
  No separate schemas or databases per tenant.
- **Migrations as code** — Schema changes must be tracked, reversible, and
  runnable without manual SQL.
- **Phase 0 scaffold** — The data layer must be in place before any domain
  work begins. It is a hard dependency for all backend dev work.

Hosting provider is deliberately deferred — this ADR covers the query layer
and engine; the managed service (Neon, Supabase, Hetzner, RDS, Railway, Render)
is a separate operational decision the user makes before the first deploy.

## Decision

Use **Knex** as the query builder and **PostgreSQL** as the database engine.

- All DB access goes through Knex. No raw SQL strings outside of Knex's
  `knex.raw()` (reserved for edge cases; must be reviewed).
- Migrations use Knex schema builder (`knex.schema.createTable` etc.) — no raw
  `CREATE TABLE` DDL.
- No Postgres-specific features (JSONB, arrays, `RETURNING`, RLS, `pg_trgm`)
  are used unless explicitly wrapped in a portability abstraction approved by
  an ADR addendum.
- The repository layer is the only place Knex is imported. Controllers and
  services operate on plain TypeScript objects.
- Soft-delete pattern: `deleted_at TIMESTAMP NULL` on entities that must
  preserve history (Players, Seasons). Hard-delete only for transient records.
- Audit fields on all primary entities: `created_at`, `updated_at`
  (managed by Knex hooks, not application code).

## Rationale

- **Knex keeps queries portable.** It compiles to SQL for any supported RDBMS.
  The `client` config is the only change needed to run against a different engine.
  This matters: early dev uses SQLite for fast iteration; CI can use SQLite or
  Postgres; production runs Postgres.
- **Postgres is the right production engine.** Mature ecosystem, strong
  connection pooling options (PgBouncer), wide managed-service support, and a
  permissive license. It is the de facto default for Node.js backend apps.
- **Knex migrations are battle-tested.** The `knex migrate:latest` / `rollback`
  workflow is standard; CI runs migrations on every PR.
- **Repository boundary contains all DB knowledge.** Service tests can stub the
  repository; integration tests hit a real DB. The layered boundary is enforced
  by convention (and flagged in code review if violated).

## Consequences

**Positive:**
- Portable queries: Postgres → MySQL → SQLite swap is a config change, not a
  rewrite
- Migrations as code means schema history is version-controlled and reproducible
- SQLite in CI/dev enables fast, dependency-free test runs
- No ORM magic: queries are explicit and predictable; N+1 problems are visible

**Negative / tradeoffs:**
- Knex DX is more verbose than Prisma. Joins and upserts require more boilerplate
  than Prisma's `include` / `upsert`. This is a deliberate tradeoff for
  portability over ergonomics.
- No type-safe query builder out of the box. Types must be maintained manually
  or via a codegen step (e.g., `knex-types`). Divergence between types and
  schema is a runtime risk — mitigated by integration tests on every migration.
- Connection pooling must be configured explicitly. At PMF (31K MAU), practice-
  time traffic spikes require PgBouncer or the managed provider's built-in
  pooler. This is an operational concern, not a code concern, but it must be
  planned before Phase 3.

**Reversibility:** The Knex → alternative query builder migration is moderate
effort (~1–2 weeks). The engine swap (Postgres → another RDBMS) is low-effort
if no Postgres-specific features were used. Both are containable.

## Hosting Provider (deferred — user decision before first deploy)

The ADR does not prescribe a hosting provider. Options and their tradeoffs are
in `docs/wiki/cost-analysis.md` Decision 3. Recommended path:

- **Development:** SQLite (Knex SQLite client — no server required)
- **CI:** PostgreSQL via Docker or GitHub Actions service container
- **MVP / early adopters:** Neon (generous free tier, DB branching for PRs)
- **PMF (~30+ clubs):** Evaluate Hetzner self-managed Postgres via Coolify
  (3–5× cheaper than managed services; 1–2 days migration from Neon)

## Alternatives Considered

- **Prisma** — Excellent DX, type-safe query client, active development.
  Rejected because Prisma's Prisma Schema Language (PSL) is a custom DSL that
  couples the project to the Prisma ecosystem. Migrations generated by Prisma
  are Postgres-biased and harder to audit. The portability requirement is not
  achievable with Prisma without significant workarounds.
- **Drizzle ORM** — TypeScript-native, SQL-first, growing fast. Rejected at
  this decision point due to relative immaturity (fewer production case studies,
  smaller ecosystem). Re-evaluate for Phase 6+ or a future project.
- **Raw `pg` driver** — Maximum control, zero abstraction overhead. Rejected
  because it requires manual query parameterization (SQL injection risk surface),
  no migration runner, and no cross-RDBMS portability. The engineering overhead
  is not justified.
- **TypeORM** — Rejected due to notoriously unpredictable migration generation
  and decorator-heavy API that conflicts with the project's functional style.

## References

- `CLAUDE.md` — RDBMS Independence section (mandatory project rule)
- `docs/wiki/cost-analysis.md` — Decision 3: DB hosting provider cost curve
- `docs/wiki/architecture-options.md` — Phase 0 infrastructure checklist
- `docs/wiki/data-model.md` — entity-relationship model (Architect-maintained,
  future deliverable)
- ADR-005 — API conventions (repository layer owns snake_case → camelCase mapping)
