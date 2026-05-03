# AAUClubManager — Kickoff

This project is bootstrapped with the [Dev Agent Team](../dev-agent-team/).

## Your First Move

Open Claude Code in this directory:

```bash
cd /Users/sravansunkaranam/github/AAUClubManager
claude
```

Then say:

```
TPM, give me a status briefing and start Phase 0.
```

The TPM will:
1. Read the wiki + dashboard + open decisions
2. Brief you on current state
3. Coordinate the PM to ingest raw requirements
4. File the first DECISION (MVP scope) for your review

## How to Use the Team

### Invoke an agent
```
PM, write user stories for the tryouts module.
Architect, design the data model for payments.
UX, wireframe the parent onboarding flow.
TPM, status please.
```

The TPM is your default contact for "what's happening?"

### Make a decision
Open files in `pmo/decisions/` with status `open`. Reply with:
```
DECISION-007: I pick option B.
```

The agent who filed it (or TPM) will record your call and update affected wiki pages.

### Give an agent feedback
```
PM, your stories are too long. Cap at 5 acceptance criteria.
```

The agent will ask: (a) one-off, (b) project-only, or (c) permanent for all projects?
- (a) Just applies now
- (b) Updates `CLAUDE.md` for this project
- (c) Updates the agent prompt in `dev-agent-team/agents/` — every future project inherits

### Check status
Three views:

| View | What it shows |
|------|--------------|
| `pmo/dashboard.md` | Live program board: stories, status, decisions, blockers |
| `docs/wiki/current-status.md` | Narrative paragraph (what's happening, what's next) |
| `docs/wiki/log.md` | Chronological log (one line per session event) |

Or just ask: "TPM, status."

### See all agent prompts
```
ls -la .claude/agents/
```

These are symlinks to `/Users/sravansunkaranam/github/dev-agent-team/agents/`.

## Phase Plan (initial proposal — TPM/PM will refine)

| Phase | Scope | Outcome |
|-------|-------|---------|
| **0 — Setup** | Tech stack, scaffolding, auth, design system, MVP scope decision | Working dev environment |
| **1 — Core** | Tryouts, team formation, rosters, player/parent profiles | Onboarding flow |
| **2 — Operations** | Practice scheduling, gym mgmt, jersey mgmt, attendance | Coach daily workflow |
| **3 — Communications** | Email + WhatsApp notifications, polls, schedule changes | Parent-coach messaging |
| **4 — Tournaments** | Tournament CRUD, schedule publishing, travel coordination | Full tournament workflow |
| **5 — Payments** | Payment tracking, per-team views, followup reminders | Financial dashboard |
| **6 — Coaching Intelligence** | Practice assistant, film study, skill tracking | AI-assisted coaching |
| **7 — Integrations** | Third-party analytics, video platforms | Connected ecosystem |
| **8+ — Backlog** | Finder modules (clubs, gyms, coaches, referees), Tournament Director persona | Marketplace features |

## Conversation Logs

Every conversation is automatically logged to:
```
~/Google Drive/AI Projects/Claude/Conversations/AAUClubManager/YYYY-MM-DD.md
```

Google Drive syncs to the cloud. Logs are NOT committed to git.

The local `conversations/` symlink in this repo points to that folder for easy access.

## Help

- Agent prompts: `dev-agent-team/agents/*.md`
- Shared protocols: `dev-agent-team/shared/*.md`
- Conventions: `dev-agent-team/CONVENTIONS.md`
- Changelog (team evolution): `dev-agent-team/CHANGELOG.md`
