---
title: Project Overview
source: docs/raw/requirements-original.txt
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [meta, vision]
status: current
---

# AAUClubManager — Project Overview

## Vision

A management platform for AAU (Amateur Athletic Union) basketball clubs that handles the full lifecycle: tryouts → team formation → operations (practice, gym, jersey, attendance) → tournaments → payments → coaching intelligence. The primary user is a **Head Coach** running a club; secondary users are **assistant coaches**, **parents**, and **players**.

The product replaces the patchwork of WhatsApp groups, email threads, spreadsheets, and paper rosters that AAU clubs currently rely on.

## Core value loop

```
Head Coach
   ↓ runs tryouts
Forms teams, assigns coaches
   ↓ communicates roster decisions to parents
Parents accept, pay
   ↓
Coach schedules practices, manages gym/jersey
   ↓ runs practices, takes notes (AI assistant)
Coach plans tournaments
   ↓ communicates schedules, jerseys, hotels (travel)
Coach analyzes games, gives player feedback (film study)
   ↓
Cycle continues; player skill improvement tracked over time
```

## Personas (summary — see [personas.md](personas.md) for detail)

- **Head Coach** — runs the club, all-powerful admin
- **Assistant Coach** — runs one team, scoped admin
- **Parent** — manages player on behalf of a child, primary communication recipient
- **Player** — receives feedback, views videos, tracks own development

## Functional Modules (in scope for MVP planning)

See per-module wiki pages:

1. [Tryouts & Onboarding](module-tryouts.md)
2. [Team Formation & Roster Management](module-teams.md)
3. [Payment Tracking](module-payments.md)
4. [Practice Scheduling](module-practice-scheduling.md)
5. [Gym Management](module-gyms.md)
6. [Jersey Management](module-jerseys.md)
7. [Practice Communications](module-practice-communications.md)
8. [Tournament Management (local + travel)](module-tournaments.md)
9. [Coaching & Skill Management (Practice Assistant + Film Study)](module-coaching-intelligence.md)
10. [Third-party Analytics Integrations](module-analytics-integrations.md)

## Out of scope for MVP (deferred backlog)

See [backlog-future.md](backlog-future.md). Includes Finder modules (AAU Clubs, Coaches, Gyms, Tournaments, Players, Referees, Scorers) and the Tournament Director persona — these turn the product into a marketplace and are intentionally deferred.

## Non-functional requirements (initial)

| Requirement | Why | Phase |
|------------|-----|-------|
| API-first | UI is one of many clients (web today, mobile/CLI later) | 0 |
| RDBMS-agnostic | DB engine should be swappable (Knex query builder, no Postgres-specific features) | 0 |
| Email + WhatsApp from day 1 | Parents use both; coaches use WhatsApp groups heavily today | 3 |
| Offline-tolerant for practice notes | Gyms have spotty wifi; coach voice-note capture must queue and sync | 6 |
| Multi-tenant | Each club is a tenant; data scoped per club | 0 |
| Role-based access | Head Coach > Assistant Coach > Parent/Player; data visibility differs | 0 |

## What success looks like (Year 1)

- A Head Coach can run an entire AAU season — tryouts to tournament season — without any external tools (WhatsApp groups, spreadsheets, paper)
- 50+ clubs onboarded
- Practice Assistant captures coach voice-notes and produces actionable feedback artifacts that coaches actually use

## What this is NOT

- Not a youth basketball stats/analytics platform (consume third-party for that)
- Not a recruiting/scouting platform (separate domain)
- Not a fantasy/league-management platform (those are leagues, not clubs)
- Not an e-commerce platform (jersey ordering is just tracking, not a store)
