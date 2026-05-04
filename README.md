# AAUClubManager

Management platform for AAU (Amateur Athletic Union) basketball clubs. Tryouts → teams → operations → tournaments → payments → coaching intelligence.

## Status

**Phase 0 — Setup.** Awaiting MVP scope decision. See [pmo/dashboard.md](pmo/dashboard.md) for live status.

## Quick Start

```bash
cd /Users/sravansunkaranam/github/AAUClubManager
cat KICKOFF.md
```

Then in Claude Code: `TPM, status please.`

## Built With

This project uses the [Dev Agent Team](../dev-agent-team/) — a reusable team of 8 Claude Code subagents (PM, Architect, UX, TPM, Dev Manager, Backend, Frontend, QA) that follow the Karpathy LLM Wiki pattern for knowledge management.

## Tech Stack (proposed; will be ratified by Architect ADRs in Phase 0)

- **Backend:** Node.js + TypeScript + Express + Knex (RDBMS-agnostic)
- **Frontend:** Next.js 15 + TypeScript + Tailwind + shadcn/ui
- **API:** OpenAPI 3.0 spec → generated TypeScript SDK (UI is one client of many)
- **DB:** PostgreSQL (swappable via Knex)
- **Auth:** Clerk
- **Notifications:** Email + WhatsApp from day 1 (Resend + 360dialog)
- **Background jobs:** BullMQ + Redis
- **Testing:** Vitest, Supertest, Playwright

## Visibility

| What you want | Where to look |
|---------------|--------------|
| Live status | [pmo/dashboard.md](pmo/dashboard.md) |
| Narrative status | [docs/wiki/current-status.md](docs/wiki/current-status.md) |
| What's been decided | [pmo/decisions/](pmo/decisions/) |
| What's awaiting your input | Top of dashboard ("🔴 Decisions awaiting your review") |
| All wiki pages | [docs/wiki/index.md](docs/wiki/index.md) |
| Conversation logs | `~/Google Drive/AI Projects/Claude/Conversations/AAUClubManager/` |

## Layout

```
AAUClubManager/
├── CLAUDE.md            # Session protocol (read first when in Claude Code)
├── KICKOFF.md           # How to start
├── README.md            # This file
├── .claude/             # Hooks + agent symlinks
├── conversations/ →     # Symlink to Google Drive logs (gitignored)
├── docs/
│   ├── raw/             # Original requirements (immutable)
│   └── wiki/            # LLM-compiled knowledge
├── pmo/                 # Program management — dashboard, decisions, stories, etc.
├── manifests/           # Raw-sources index
├── api/                 # OpenAPI spec
├── server/              # Backend (TBD)
└── web/                 # Frontend (TBD)
```
