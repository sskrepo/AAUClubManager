---
title: Module — Third-Party Analytics Integrations
source: docs/raw/requirements-original.txt §10 (last sub-bullet)
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:analytics, phase:7, integrations]
status: current
---

# Module: Third-Party Analytics Integrations

## Purpose

Many AAU coaches already use third-party platforms (Hudl, Krossover, MaxPreps, GameChanger, etc.) for video and stats. Don't replicate; integrate. Pull stats, sync video links, merge into the player's development timeline so the coach has one view.

## Scope

### In scope
- Generic integration framework: connect Account → import data on schedule
- For each supported provider:
  - Auth (OAuth where possible, API key fallback)
  - Sync stats per game/player
  - Sync video links/clips
  - Map provider's player IDs to club's Player records
- Player development timeline shows merged data: stats from provider + film clips from Film Study + practice notes
- Coach can share a merged view with parent/player

### Out of scope (forever, intentionally)
- Replicating provider's analytics in our app
- Becoming a provider ourselves
- White-label embedding of provider's video player (link out is fine)

## Initial supported providers (subject to availability of APIs)

(Architect to validate availability and file ADRs in Phase 7)

- Hudl
- Krossover (now part of Hudl)
- MaxPreps
- GameChanger
- Synergy Sports (long shot)

## Personas

- **Head Coach** — connects accounts, sees merged data
- **Assistant Coach** — sees merged data for own team
- **Parent / Player** — sees merged player timeline

## Key flows

### F1: Connect provider
1. Coach opens "Integrations"
2. Click provider → OAuth flow or API key entry
3. Map provider's club/team to our club's teams
4. Save → first sync runs

### F2: Player ID mapping
1. After sync, system shows "matches" — provider player ↔ our Player
2. Coach confirms or corrects mappings
3. Future syncs auto-link

### F3: View merged timeline
1. Open Player → Timeline
2. See stats (from provider), notes (from Practice Assistant), clips (from Film Study), drills assigned
3. Timeline ordered chronologically

## Data entities

- **IntegrationConnection** (Club, Provider, auth tokens encrypted, status)
- **IntegrationMapping** (provider_id, our_id, kind: team/player/game)
- **ImportedStat** (Player, Game, provider, fields...)
- **ImportedVideo** (Game, provider, video_url, length, etc.)

## Acceptance criteria for the module (MVP within Phase 7)

- At least 2 providers integrate (start with Hudl + GameChanger)
- Data syncs nightly
- Player timeline merges data from at least 3 sources (stats, practice notes, film clips)
- No provider data overwrites our authoritative records
