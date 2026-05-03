---
title: Module — Jersey Management
source: docs/raw/requirements-original.txt §7
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:jerseys, phase:2]
status: current
---

# Module: Jersey Management

## Purpose

Track jersey numbers per player, jersey colors per team, sizing, and ordering status (for clubs that order custom jerseys).

## Scope

### In scope
- Jersey number assignment per player per team
- Jersey color set per team (home + away)
- Sizing per player (size, requested vs. delivered)
- Order tracking (vendor name, order date, expected delivery)
- "Wear color X" communication for tournaments (handed to Module 8)

### Out of scope
- Vendor marketplace / quotes (manual entry initially)
- Real-time inventory at supplier (out of scope unless API exists)

## Personas

- **Head Coach** — manages all
- **Assistant Coach** — view-only on own team
- **Parent** — confirms sizing for player

## Key flows

### F1: Assign jersey numbers
1. After roster set (Module 2)
2. Open Team → "Jerseys"
3. Assign number per player (warn on duplicates within team)

### F2: Sizing
1. Parent receives sizing request notification
2. Parent enters size on player profile
3. Coach exports CSV for vendor

### F3: Track order
1. Coach enters order with vendor + expected delivery
2. Marks delivered when received
3. Per-player checkbox for distributed

## Data entities

- **TeamJerseyConfig** (Team, home color, away color)
- **PlayerJersey** (Player, Team, number, size, status: ordered/delivered/distributed)
- **JerseyOrder** (vendor, order date, expected, actual)

## Acceptance criteria

- Each player on a team has a jersey number (unique within team)
- Sizing collected per player
- Coach can export sizing CSV
- Order tracking for one season
