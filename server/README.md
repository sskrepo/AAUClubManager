# AAUClubManager — Server

Express + TypeScript backend API. See `api/openapi.yaml` for the API contract.

## Prerequisites

- Node.js >= 22
- Docker (for local Postgres + Redis)
- npm (workspace-aware — run from repo root or `server/`)

## Local setup

### 1. Start infrastructure

```bash
# Postgres
docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=aauclub_dev postgres:16

# Redis
docker run --rm -p 6379:6379 redis:7
```

### 2. Set environment variables

```bash
# From the repo root:
cp .env.local server/.env
# Or copy the example and fill in values:
cp server/.env.example server/.env
# Edit server/.env — never commit it
```

Key variables:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Dev/prod | Postgres connection string |
| `REDIS_URL` | Dev/prod | Redis connection string |
| `CLERK_SECRET_KEY` | For `/api/v1/me` | Clerk backend API key (sk_test_... for dev) |
| `RESEND_API_KEY` | For email delivery | Resend API key |
| `RESEND_FROM_EMAIL` | For email delivery | Verified sender email |
| `DIALOG360_API_KEY` | For WhatsApp delivery | 360dialog API key |
| `DIALOG360_BASE_URL` | For WhatsApp delivery | Sandbox: `https://waba-sandbox.360dialog.io/v1` |

### 3. Install dependencies

```bash
# From repo root:
npm install

# Or from server/:
npm install
```

### 4. Run the dev server

```bash
# From server/:
npm run dev

# Or from repo root:
npm run dev:server
```

Server starts on `http://localhost:3001`.

### 5. Run workers (separate terminal)

```bash
# From server/:
npm run dev:workers
```

## Available commands

```bash
npm run dev              # Start API server with hot reload
npm run dev:workers      # Start BullMQ workers with hot reload
npm run build            # Compile TypeScript to dist/
npm run typecheck        # Type-check without emitting
npm run lint             # ESLint
npm run test             # Vitest unit tests
npm run test:coverage    # Unit tests with coverage report
npm run test:integration # Integration tests (requires real DB + Redis)

# Dev scripts
npm run queue:test           # Enqueue a hello-world job
npm run notify:test:email    # Enqueue a test email (requires TEST_EMAIL + RESEND_API_KEY)
npm run notify:test:whatsapp # Enqueue a test WhatsApp (requires TEST_WHATSAPP_NUMBER + DIALOG360_API_KEY)
```

## Architecture

```
HTTP layer (routes/)
  ↓ calls
Service layer (services/) — business logic
  ↓ calls
Repository layer (db/repositories/) — DB queries via Knex
  ↓ uses
PostgreSQL (swappable via Knex)

Workers (workers/) — BullMQ + Redis — async jobs
  ↓ calls
Service layer (same services/)
```

## Endpoints (Phase 0)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | none | Liveness + readiness probe |
| GET | `/api/v1/me` | Bearer JWT | Returns authenticated Clerk user identity |

Full spec: `api/openapi.yaml`

## Testing

Unit tests are co-located with source files (`*.test.ts`). They mock all I/O.
Integration tests live in `src/__tests__/` and require real DB + Redis.

```bash
npm run test             # Unit tests only (fast, no infra needed)
npm run test:integration # Integration tests (requires Docker)
```

## Adding a new endpoint

1. Verify the endpoint exists in `api/openapi.yaml` (Architect owns the spec)
2. Add controller in `src/routes/`
3. Add service in `src/services/`
4. Add repo (if DB access needed) in `src/db/repositories/`
5. Write tests (unit + integration stubs)
6. Run `npm run typecheck && npm run test`
