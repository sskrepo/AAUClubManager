---
title: Database Conventions
owner: dev-manager
updated: 2026-05-03
tags: [engineering, conventions, database, knex, migrations]
---

# Database Conventions

RDBMS independence is a hard constraint (see `CLAUDE.md`). All rules here exist to preserve that constraint.

---

## The RDBMS independence rule

- **Use Knex query builder for all DB access.** No raw SQL (`knex.raw()`) except for liveness checks (`SELECT 1`) and schema operations Knex schema builder cannot express.
- **No DB-specific features** without an abstraction layer:
  - No Postgres `JSONB` operators (`@>`, `?`)
  - No Postgres `ON CONFLICT DO UPDATE` (use a separate SELECT + UPDATE/INSERT pattern)
  - No MySQL fulltext search
  - No SQLite-specific pragmas in migration files
- **Migrations use Knex schema builder only** (`knex.schema.createTable()`, not `knex.raw('CREATE TABLE ...')`). If a schema operation is not possible via the schema builder, file a decision record before proceeding.

Violation of this rule is a blocking code review item. The goal: swap Postgres for MySQL or SQLite without rewriting queries.

---

## Column naming

- DB columns use `snake_case`: `club_id`, `created_at`, `first_name`.
- JSON API fields use `camelCase`: `clubId`, `createdAt`, `firstName`.
- **The repository layer is the only place where `snake_case → camelCase` mapping happens.** Controllers and services operate exclusively in `camelCase`. They never see DB column names.

Mapping pattern (in repository methods):

```ts
// In a repository method:
const rows = await knex('club_memberships')
  .select('id', 'club_id', 'user_id', 'role', 'created_at')
  .where({ club_id: clubId });

return rows.map(row => ({
  id: row.id,
  clubId: row.club_id,
  userId: row.user_id,
  role: row.role,
  createdAt: row.created_at,
}));
```

Do not use a generic camelCase mapper (e.g., `lodash.camelCase` on all keys). The explicit mapping is intentional: it makes column renames visible at the repository boundary, not silently swallowed by a mapper.

---

## Migrations

### Naming convention

```
{timestamp}_{action}_{entity}.ts
```

- `timestamp`: `YYYYMMDDHHmm` (e.g., `202605030900`)
- `action`: `create`, `add`, `drop`, `alter`, `seed`
- `entity`: the table or column being affected

Examples:
```
202605030900_create_clubs.ts
202605031000_create_users.ts
202605031100_create_club_memberships.ts
202605031200_add_season_year_to_seasons.ts
```

### Migration file structure

```ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('clubs', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name', 255).notNullable();
    table.string('clerk_org_id', 255).unique();
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('clubs');
}
```

Rules:
- Every migration must have a working `down()` function.
- Use `table.uuid('id').primary().defaultTo(knex.fn.uuid())` for primary keys. UUIDs only — no auto-increment integers (they are not portable and leak row counts).
- Use `table.timestamps(true, true)` for `created_at` and `updated_at` (Knex handles the defaults and auto-update).
- Foreign keys: declare explicitly. Example: `table.uuid('club_id').references('id').inTable('clubs').onDelete('CASCADE')`.
- Indexes: declare in the same migration as the column. Example: `table.index('clerk_org_id')`.

### When to run migrations

- Local dev: `npm run db:migrate` (runs all pending migrations against the local Docker Postgres).
- CI: Migrations run before integration tests in the CI workflow.
- Production: Migrations run as a pre-deploy step, not during server startup.

**Never run migrations in `server.ts` startup.** Migrations are a deployment concern, not a runtime concern.

---

## Knex configuration

```ts
// server/src/db/knex.ts
import Knex from 'knex';
import { config } from '../config';

export const knex = Knex({
  client: 'pg',           // swappable: 'mysql2', 'better-sqlite3'
  connection: config.databaseUrl,
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
});
```

The `client` string is the only thing that changes when swapping DB engines. All query builder calls remain identical.

---

## Repository pattern

All DB access goes through repository classes/functions in `server/src/db/repositories/`. Route handlers and services do not call `knex` directly.

```
server/src/db/repositories/
  club.repository.ts
  user.repository.ts
  club-membership.repository.ts
```

A repository:
- Accepts and returns domain objects (camelCase fields)
- Knows about table names and column names
- Handles the snake_case ↔ camelCase mapping
- Has no business logic — that belongs in services

Services call repositories. Repositories call Knex. Never the reverse.

---

## Transactions

Use Knex transactions for multi-table writes:

```ts
await knex.transaction(async (trx) => {
  const [club] = await trx('clubs').insert({ name }).returning('*');
  await trx('club_memberships').insert({ club_id: club.id, user_id, role: 'head_coach' });
});
```

Pass `trx` (the transaction object) to repository methods that need to participate in the transaction. Repository methods accept an optional `trx` parameter; when absent, they use the global `knex` instance.

---

## Phase 0 note

No production migrations run in Phase 0. The base entity schema (`Club`, `User`, `ClubMembership`, `Season`) is documented in `docs/wiki/data-model.md` but not applied to any database. Migrations begin in Phase 1 when the server is deployed.

Local dev: a Docker Postgres instance is used for integration tests. `docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16` is sufficient.
