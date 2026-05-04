---
title: Coding Conventions
owner: dev-manager
updated: 2026-05-03
tags: [engineering, conventions, typescript]
---

# Coding Conventions

Applies to all TypeScript code in `server/` and `web/`. Violations are a blocking code review item.

---

## TypeScript

- **Strict mode everywhere.** `tsconfig.json` must include `"strict": true`. No `@ts-ignore` or `@ts-expect-error` without an explanatory comment. No `any` without an explicit suppression comment explaining why (and there should be very few).
- **Explicit return types on exported functions.** Inferred return types are acceptable for private/internal functions and arrow functions where the type is trivially obvious. Exported functions must declare their return type explicitly.
- **No `enum` — use `const` objects + `as const` unions instead.** Enums have surprising TS emit behavior. Use:
  ```ts
  export const Channel = { email: 'email', whatsapp: 'whatsapp' } as const;
  export type Channel = typeof Channel[keyof typeof Channel];
  ```
- **Prefer `interface` for object shapes used as types, `type` for unions and intersections.**
- **`unknown` over `any` for error handling:**
  ```ts
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
  }
  ```

---

## Naming

| Item | Convention | Example |
|---|---|---|
| Files (server) | `kebab-case.ts` | `notification.service.ts`, `auth.middleware.ts` |
| Files (web) | `kebab-case.tsx` for components, `kebab-case.ts` for utilities | `user-profile.tsx`, `format-date.ts` |
| Classes | `PascalCase` | `NotificationService` |
| Interfaces | `PascalCase` with `I` prefix for dependency-injected abstractions only | `IWhatsAppProvider` |
| Functions | `camelCase` | `sendNotification()` |
| Constants | `SCREAMING_SNAKE_CASE` for module-level constants; `camelCase` for local | `MAX_RETRIES`, `const defaultPageSize = 20` |
| React components | `PascalCase` | `AuthenticatedShell` |
| React hooks | `camelCase` with `use` prefix | `useMe()`, `useClubList()` |
| API response fields | `camelCase` | `clerkUserId`, `createdAt` |
| DB columns | `snake_case` — never leak above repository layer | `clerk_user_id`, `created_at` |
| Environment variables | `SCREAMING_SNAKE_CASE` | `CLERK_SECRET_KEY` |

---

## Module structure

### Server (`server/src/`)

```
server/src/
  app.ts               Express app factory (no listen)
  server.ts            Starts server (calls app.listen)
  config.ts            All env var reads; fail-fast on missing required vars
  db/
    knex.ts            Knex instance (singleton)
    migrations/        Knex migration files
  middleware/
    auth.ts            Clerk JWT validation
    error-handler.ts   Global Express error handler (last middleware)
  routes/
    health.ts          GET /health handler
    me.ts              GET /api/v1/me handler
    index.ts           Registers all route modules on the Express app
  services/
    notification/
      notification.service.ts
      types.ts
      providers/
        email.provider.ts
        whatsapp.provider.ts
  workers/
    hello.worker.ts
    notification.worker.ts
    index.ts           Starts all workers
  types/
    express.d.ts       Declaration merging for req.user
  scripts/             Dev-only scripts (tsx)
```

One concern per file. Services do not import from routes. Routes do not import from workers. Circular dependencies are a bug.

### Frontend (`web/src/`)

```
web/src/
  app/                 Next.js App Router pages
    (authenticated)/   Route group — all pages requiring Clerk auth
      layout.tsx
      page.tsx
    sign-in/
    sign-up/
    layout.tsx         Root layout (ClerkProvider, QueryClientProvider)
    globals.css
  api/
    generated/         Auto-generated — DO NOT EDIT
    client.ts          Hand-maintained wrapper — all frontend code imports from here
  components/
    ui/                shadcn/ui components (auto-added by `shadcn-ui add`)
    {feature}/         Feature-specific components
  hooks/               Custom React hooks beyond the ones in client.ts
  lib/                 Utility functions (format, parse, etc.)
  types/               Shared TypeScript types not generated from OpenAPI
```

---

## Error handling

### Server

- All errors propagate to the global Express error handler (`middleware/error-handler.ts`). Do not `res.status(500).json(...)` inline in route handlers.
- Route handlers are wrapped in a `tryCatch` async wrapper (or equivalent) that catches thrown errors and calls `next(err)`.
- Business errors (bad input, entity not found) throw typed error classes (`NotFoundError`, `ValidationError`, `ConfigurationError`) defined in `server/src/errors.ts`. The error handler maps these to the correct HTTP status + RFC 7807 body.
- Unhandled promise rejections in workers are caught at the Worker level — the worker process must not crash on a bad job.
- Never `console.log()`. Use Pino logger (`import { logger } from '../lib/logger'`).

### Frontend

- API errors are surfaced through TanStack Query's `error` state. Components check `isError` and render an error UI.
- The `client.ts` wrapper handles 401 → refresh → retry automatically. Components should not implement retry logic themselves.
- Never swallow errors silently. If an error is caught and not rethrown, log it.

---

## Imports

- Use absolute imports via TypeScript path aliases:
  - Server: `@/services/...`, `@/middleware/...` etc. (configure `paths` in `tsconfig.json`).
  - Web: `@/app/...`, `@/api/...`, `@/components/...` (Next.js configures this automatically).
- No relative `../../..` imports spanning more than two levels.
- No direct imports from `web/src/api/generated/` in component code — always go through `web/src/api/client.ts`.

---

## Config and secrets

- All environment variables read in `server/src/config.ts` only. Nowhere else. This makes missing-var failures predictable.
- `.env.example` must be kept up to date. Every new env var added to code must also be added to `.env.example` with a description.
- No secrets in code. No hardcoded URLs (use env vars with defaults for localhost).
