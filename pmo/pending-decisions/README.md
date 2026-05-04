---
title: Pending Decisions — User-Facing Index
owner: tpm
created: 2026-05-03
tags: [meta, user-tasks, pending]
---

# Pending Decisions

**Single place to see what's waiting on you.** One file per phase. Updated by agents (primarily TPM) as the project moves.

## What lives here

This directory tracks anything that needs the user (you) to act:

- 🚨 **Blocking** — credentials, accounts, decisions that gate active dev work
- 🟡 **Mid-phase** — things needed before the current phase exits, not today
- 📝 **Open product questions** — non-blocking answers (brand color, logo, etc.)
- 🔮 **Future-phase pre-knowns** — heads-up items for upcoming phases (don't act yet)
- ✅ **Done** — completed items, kept for audit trail

## How to use it

1. **At session start** — read [`PHASE-0.md`](PHASE-0.md) (or whichever phase is active) to see your queue
2. **When you complete an item** — either:
   - Tell the active agent in chat (e.g., "Clerk keys delivered: PUBLISHABLE_KEY=pk_test_..., SECRET_KEY=sk_test_..."), and the agent updates this file
   - Or edit the file yourself: move the row from its current section into ✅ Done with the date
3. **TPM keeps trackers consistent** — when an item is marked done here, TPM also updates `pmo/dashboard.md` and `docs/wiki/current-status.md`

## File map

| Phase | File | Status |
|-------|------|--------|
| 0 — Foundation | [PHASE-0.md](PHASE-0.md) | 🟡 Active |
| 1 — Core (Tryouts + Teams) | [PHASE-1.md](PHASE-1.md) | 🔮 Preview (pre-known items only) |
| 2 — Operations | [PHASE-2.md](PHASE-2.md) | 🔮 Placeholder |
| 3 — Communications | [PHASE-3.md](PHASE-3.md) | 🔮 Preview (Meta templates) |
| 4 — Tournaments | [PHASE-4.md](PHASE-4.md) | 🔮 Placeholder |
| 5 — Payments | [PHASE-5.md](PHASE-5.md) | 🔮 Placeholder |
| All phases at a glance | [index.md](index.md) | Cross-phase counts |

## Who updates these files

- **TPM owns** this directory and is responsible for keeping it consistent with `pmo/dashboard.md` and `docs/wiki/current-status.md`
- **Any agent** can mark items done when the user delivers them in chat — but must also update the dashboard and current-status to match
- **The user** can edit any file directly; agents will reconcile on next session

## Relationship to other trackers

| File | Purpose | Audience |
|------|---------|----------|
| `pending-decisions/PHASE-N.md` (this directory) | What you owe right now | **You** |
| `pmo/dashboard.md` | Live program view (decisions, work, blockers) | You + agents |
| `docs/wiki/current-status.md` | Narrative snapshot, read at session start | Agents |
| `pmo/phase-briefs/PHASE-N-kickoff.md` | Definitive setup checklist (the "how-to" for each item) | You |
| `pmo/decisions/DECISION-NNN-*.md` | Formal decision records (closed once decided) | You + agents |

The pending-decisions files are a **lightweight, focused user view**. Everything here cross-links to the canonical source (kickoff briefs, decision docs, etc.) — the canonical source is authoritative; this is a presentation layer.
