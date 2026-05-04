---
title: Engineering Conventions — Index
owner: dev-manager
updated: 2026-05-03
tags: [engineering, conventions]
---

# Engineering Conventions

Dev Manager-owned. Agents and human devs follow these docs when writing code, tests, migrations, or PRs.

Do not invent new conventions unilaterally. If two instances of a pattern appear, propose a convention by appending it here. The Dev Manager ratifies.

## Docs in this directory

| File | Covers |
|---|---|
| [coding-conventions.md](coding-conventions.md) | TypeScript style, naming, module structure, error handling |
| [testing-conventions.md](testing-conventions.md) | Unit vs integration vs E2E, what to test per layer, mock strategy |
| [database-conventions.md](database-conventions.md) | Knex patterns, migration naming, RDBMS-agnostic rules, snake_case→camelCase mapping |
| [git-conventions.md](git-conventions.md) | Branch naming, commit format, PR requirements, merge strategy |

## Cross-references

- API conventions: `docs/wiki/adr/ADR-005-api-design-conventions.md`
- Tech stack: `CLAUDE.md` — Tech Stack section
- Phase 0 task breakdown: `pmo/phase-briefs/PHASE-0-tasks.md`
