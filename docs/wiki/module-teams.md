---
title: Module — Team Formation & Roster Management
source: docs/raw/requirements-original.txt §2
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:teams, phase:1]
status: current
---

# Module: Team Formation & Roster Management

## Purpose

Define the teams in a club (number, names, age divisions, levels) and assign coaches and players to each team. Roster is the foundation everything else operates on.

## Scope

### In scope
- Create teams with name, age group (e.g., 11U, 12U), level (Select, Elite, Recreational)
- Assign Head/Assistant Coach to a team
- Manage team roster (add/remove players)
- Player can be on at most one team per season (configurable)
- Roster history (who was on what team in past seasons)
- Player profile (extends beyond tryout: jersey number, parent contact, emergency contact, medical notes)

### Out of scope
- Team's practice schedule → [module-practice-scheduling.md](module-practice-scheduling.md)
- Team's tournament schedule → [module-tournaments.md](module-tournaments.md)

## Personas

- **Head Coach** — creates teams, assigns coaches, manages all rosters
- **Assistant Coach** — view-only on roster of own team(s)
- **Parent** — view-only on player's team and other team members (limited PII)
- **Player** — view-only on own team

## Key flows

### F1: Head Coach defines teams for the season
1. Open "Teams" page
2. Click "New season" → enter season name (e.g., "Spring 2027")
3. Add teams — name, age, level, head coach
4. Save

### F2: Assign players to teams (often after tryouts)
1. From tryout selection (Module 1) → players auto-assigned to chosen team
2. Or manually: drag player from "unassigned pool" to a team
3. Assign jersey numbers (Module 6 takes over for jersey logistics)

### F3: Player profile management
1. Open a player's profile
2. Edit attributes: jersey number, parent contacts, emergency contact, medical notes
3. Save

## Data entities

- **Season** (e.g., Spring 2027)
- **Team** (in a Season, has a coach, has a roster)
- **TeamCoach** (Head Coach can assign multiple coaches per team)
- **Roster** (Team ↔ Player, with start/end date for mid-season changes)
- **Player** (extends from Tryout)
- **ParentChildLink** (which parents manage which players)

## Acceptance criteria for the module (MVP)

- Head Coach can define teams, assign coaches, build rosters from tryouts.
- Parents and Players can see their team(s).
- Roster changes are logged (audit trail).
- Multi-season support: rosters from past seasons remain queryable.
