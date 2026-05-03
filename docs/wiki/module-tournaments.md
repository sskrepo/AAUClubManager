---
title: Module — Tournament Management
source: docs/raw/requirements-original.txt §9
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:tournaments, phase:4]
status: current
---

# Module: Tournament Management (Local + Travel)

## Purpose

Plan, publish, and run tournament participation for the club's teams. Includes local one-day tournaments and multi-day travel tournaments.

## Scope

### In scope
- **Tournament calendar:** Head Coach defines which tournaments which teams will play (across the season)
- **Publishing:** push schedule to parents
- **Per-game schedule:** tournament organizer sends bracket → coach enters game times → publishes to team
- **Parent confirmation:** parents confirm attendance per game/day (especially travel where parents may skip a day)
- **Jersey color callouts:** "wear away jerseys Saturday"
- **Travel tournaments:**
  - Hotel partnerships (negotiated rates with specific hotels)
  - Send hotel options + booking instructions to parents
  - Track who booked where (for team-meal logistics, carpools)

### Out of scope (initially)
- Hotel booking integration (parents book directly via the hotel; we send the rate code)
- Tournament discovery / registration (Tournament Finder is in backlog)
- In-game stats (handled by third-party in [module-analytics-integrations.md](module-analytics-integrations.md))

## Personas

- **Head Coach** — full control
- **Assistant Coach** — own team
- **Parent** — confirms attendance, books hotel, sees schedule
- **Player** — view-only

## Key flows

### F1: Add tournament to calendar
1. Head Coach opens "Tournaments"
2. Add tournament: name, dates, location, age groups, level
3. Assign teams playing → publish to those teams' parents

### F2: Game schedule publication
1. Tournament organizer sends bracket (PDF or web link) to coach
2. Coach enters games per team: opponent, court, time
3. Publish → email + WhatsApp to parents
4. Per-game: parents confirm attendance

### F3: Travel tournament hotel coordination
1. Head Coach negotiates rate with hotel(s) near venue
2. Adds hotel(s) with: name, distance to venue, rate code, booking link, deadline
3. Sends to parents → parents see options ranked by distance/price/amenities
4. Parents click through to hotel, book, mark "booked" in app
5. Coach sees who's where for team logistics

### F4: Jersey color call
1. Coach announces colors per game
2. Parents receive notification
3. Game card shows color (so parent can pack the right jersey)

## Data entities

- **Tournament** (name, dates, location, level)
- **TournamentTeam** (Tournament, Team, registered_at)
- **Game** (Tournament, Team, opponent, court, time, jersey_color)
- **GameAttendance** (Game, Player, confirmed: yes/no/maybe, parent_who_responded)
- **HotelOffer** (Tournament, hotel name, distance, rate, code, booking_link, deadline)
- **HotelBooking** (HotelOffer, Family, booked_at) — voluntary entry by parents

## Acceptance criteria

- Head Coach can build a tournament calendar for the season
- Parents confirm attendance per game
- Jersey color comms work
- For travel tournaments: hotel options are sent and parents can mark "booked"
