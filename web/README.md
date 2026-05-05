# AAUClubManager — Web

Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui + TanStack Query

## Local Dev Setup

### Prerequisites

- Node.js >= 22
- The server (`server/`) running on port 3001 (for API calls)

### 1. Create `web/.env.local`

```sh
cp web/.env.local.example web/.env.local
```

Edit `web/.env.local` and fill in:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # From Clerk dashboard
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001   # Backend dev server
```

**NEVER** add `CLERK_SECRET_KEY` or any other secret keys to `web/.env.local` — those are server-only and belong in `server/.env`.

### 2. Install dependencies

From the repo root (npm workspaces):

```sh
npm install
```

### 3. Start the dev server

From the repo root:
```sh
npm run dev:web
```

Or from the `web/` directory:
```sh
npm run dev
```

The web app runs on **http://localhost:3000**.

### 4. (Optional) Start the backend

```sh
npm run dev:server    # from repo root
```

The backend runs on **http://localhost:3001**.

---

## Auth Smoke Test (TASK-010)

Verify the end-to-end auth pipeline:

1. Start both server and web: `npm run dev:server` and `npm run dev:web` from root.
2. Open **http://localhost:3000** in a fresh browser (no session).
3. Click **Sign In** and complete Clerk sign-in.
4. You should land on **http://localhost:3000/dashboard** showing your name.
5. Navigate to **http://localhost:3000/me**.
6. You should see your Clerk user data returned from the backend's `GET /api/v1/me`.

If the `/me` page shows "Backend request failed", the server is not running or `NEXT_PUBLIC_API_BASE_URL` is wrong.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run lint` | ESLint check |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |

---

## Project Structure

```
web/src/
  app/
    (authenticated)/          Route group — requires Clerk auth
      layout.tsx              Authenticated layout shell (server component)
      dashboard/
        page.tsx              Post-login landing — shows user name
        page.test.tsx
      me/
        page.tsx              Auth smoke test page
        me-client.tsx         Client component calling useMe()
        me-client.test.tsx
    sign-in/[[...sign-in]]/   Clerk sign-in (catch-all)
    sign-up/[[...sign-up]]/   Clerk sign-up (catch-all)
    globals.css               Design tokens (Tailwind v4 @theme)
    layout.tsx                Root layout (ClerkProvider, QueryClientProvider)
    page.tsx                  Public landing page (redirects auth users)
  api/
    generated/                Auto-generated from api/openapi.yaml — DO NOT EDIT
    client.ts                 Hand-maintained wrapper — import from here only
    client.test.ts
  components/
    authenticated-shell.tsx   Nav header for authenticated pages
    providers.tsx             TanStack QueryClientProvider
  lib/
    utils.ts                  cn() Tailwind merge utility
    design-tokens.md          Design token documentation
  test/
    setup.ts                  Vitest + jest-dom setup
```

---

## API Discipline

All backend API calls go through `web/src/api/client.ts` only.

```typescript
// DO
import { useMe, useHealth } from '@/api/client';

// DO NOT
import { AuthService } from '@/api/generated';       // bypass
const res = await fetch('/api/v1/me');               // raw fetch
```

---

## Design System

Tokens are in `web/src/app/globals.css` using Tailwind v4 `@theme` syntax.
Documentation: `web/src/lib/design-tokens.md`.

**Brand color placeholder:** `#3b82f6` (Club Blue). Pending user confirmation.
To update: change `--color-primary-*` in `globals.css`.

---

## Testing

Unit tests co-located with source files. Run with `npm run test`.

Test coverage:
- `client.ts` — token injection via OpenAPI.TOKEN, 401 handling
- `useMe` — loading/data/error states with mocked SDK
- `DashboardPage` — renders with user data, firstName/email/null fallbacks
- `MePageClient` — all three states (loading/error/data)

---

## Notes

- This app uses **Next.js 16** which renamed `middleware.ts` to `proxy.ts`.
  Clerk middleware is in `src/proxy.ts`.
- Tailwind v4 has no `tailwind.config.ts`. Tokens are set via `@theme` in CSS.
- The `web/src/api/generated/` directory is committed (not gitignored).
  Run `npm run api:generate` from the repo root after any spec change.
