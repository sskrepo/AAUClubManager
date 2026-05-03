# AAUClubManager — Claude Rules

This project uses the **Dev Agent Team** at `/Users/sravansunkaranam/github/dev-agent-team/`. Agent prompts in `.claude/agents/` are symlinks to that canonical source. Updates there propagate to this project.

## Knowledge System (Wiki Pattern)

This project uses the [Karpathy LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern:

- **Raw sources** → `docs/raw/` (immutable inputs — PRDs, conversation logs)
- **Wiki** → `docs/wiki/` and `pmo/` (LLM-compiled living knowledge)
- **Schema** → this file

## Session Protocol (mandatory)

### Session Start
Every agent reads (in order):
1. This file (`CLAUDE.md`)
2. The relevant `dev-agent-team/shared/*-protocol.md` files
3. `docs/wiki/index.md` — what wiki pages exist
4. `docs/wiki/current-status.md` — where we are
5. `docs/wiki/log.md` — recent session history
6. `pmo/dashboard.md` — current phase, blockers, decisions
7. Topic-specific wiki pages relevant to the current task (don't read everything)

### During Work
- New decision → update relevant wiki page + file `pmo/decisions/DECISION-NNN-*.md` if user input needed
- New raw doc → register in `manifests/raw_sources.csv`
- Code changes → if they diverge from wiki, update wiki in same session

### Session End
- Append to `docs/wiki/log.md`: `## [YYYY-MM-DD] {agent} | {what changed}`
- Update `docs/wiki/current-status.md`
- Update `pmo/dashboard.md` rows you touched

### Conversation Logging
Hooks in `.claude/settings.json` automatically write every prompt/response to:
`~/Google Drive/AI Projects/Claude/Conversations/AAUClubManager/YYYY-MM-DD.md`

You don't need to do anything — it happens automatically. The `conversations/` symlink in this repo points to that folder for local access (gitignored).

## Project Structure

```
AAUClubManager/
├── CLAUDE.md                    # This file — session protocol
├── README.md                    # Project overview
├── KICKOFF.md                   # How to start the project
├── .claude/
│   ├── settings.json            # Hooks for conversation logging
│   ├── scripts/                 # Hook scripts
│   └── agents/                  # Symlinks to dev-agent-team/agents/
├── conversations/ → ~/Google Drive/...  # Symlink, gitignored
├── docs/
│   ├── raw/                     # Immutable raw sources (PRDs, etc.)
│   └── wiki/                    # LLM-compiled knowledge
│       ├── index.md             # Catalog of wiki pages
│       ├── log.md               # Session log
│       ├── current-status.md    # Where we are
│       ├── project-overview.md  # PM-owned: vision, personas
│       ├── architecture.md      # Architect-owned: system shape
│       ├── data-model.md        # Architect-owned
│       ├── api-design.md        # Architect-owned
│       ├── ux/                  # UX-owned
│       ├── engineering/         # Dev Manager-owned: conventions
│       ├── adr/                 # Architecture Decision Records
│       ├── integrations/        # One page per third-party integration
│       └── module-*.md          # One page per functional module
├── pmo/
│   ├── dashboard.md             # TPM-owned: live program view
│   ├── phases.md                # Phase scope and sequence
│   ├── stories/                 # User stories (PM writes)
│   ├── decisions/               # Decisions awaiting/recorded
│   ├── handoffs/                # Cross-agent handoff records
│   ├── uat/                     # QA UAT scenarios
│   └── bugs/                    # QA bug reports
├── manifests/
│   └── raw_sources.csv          # Index of every file in docs/raw/
├── api/
│   └── openapi.yaml             # API source of truth (Architect owns)
├── server/                      # Backend code (Backend Dev owns)
└── web/                         # Frontend code (Frontend Dev owns)
```

## Tech Stack

(Populated by Architect after Phase 0 decisions. Initial defaults:)

- **Backend:** Node.js + TypeScript + Express + Knex (RDBMS-agnostic)
- **Frontend:** Next.js 15 + TypeScript + Tailwind + shadcn/ui + TanStack Query
- **Auth:** Clerk
- **Notifications:** Resend (email) + Twilio (WhatsApp) — both day-1
- **DB:** PostgreSQL (swappable via Knex)
- **Background jobs:** BullMQ + Redis
- **API:** OpenAPI 3.0 spec → generated TypeScript SDK
- **Testing:** Vitest + Supertest (backend), Vitest + RTL (frontend), Playwright (E2E)

## API-First Discipline (mandatory)

- `api/openapi.yaml` is the single source of truth for all APIs
- After any spec change: `npm run api:generate` to regenerate types
- All client code uses the typed SDK from `web/src/api/client.ts` — no raw `fetch()`
- Server routes must match spec — divergence is a bug

## RDBMS Independence (mandatory)

- All DB access through Knex query builder
- No DB-specific features (Postgres JSONB, MySQL fulltext) without portable abstraction
- Migrations use Knex schema builder (DB-agnostic)
- Goal: swap Postgres → MySQL → SQLite without rewriting queries

## Project-Specific Agent Rules

(Add agent-specific behaviors that apply only to this project. The feedback-protocol.md in dev-agent-team handles permanent changes — this section is for project-only rules.)

(empty — populated as work progresses)

## Rules

- **Compile-first**: don't just answer, write conclusions into wiki pages
- **Writeback is mandatory**: durable knowledge → wiki
- **Wiki and code MUST agree**: if they don't, that's incomplete work
- **Raw files are immutable**: never edit `docs/raw/`. Compile into wiki instead.
- **Decisions are first-class**: file `pmo/decisions/DECISION-NNN-*.md` for anything user needs to weigh in on
- **Bring options, not problems**: every decision has 2-3 concrete options with pros/cons
- **One agent owns each artifact**: see [dev-agent-team/agents/](../dev-agent-team/agents/) for ownership
- **Tests + wiki land in same change as code**: never ship code without both
