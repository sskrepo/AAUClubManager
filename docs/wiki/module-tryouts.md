---
title: Module — Tryouts & Onboarding
source: docs/raw/requirements-original.txt §1, §2
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:tryouts, phase:1]
status: current
---

# Module: Tryouts & Onboarding

## Purpose

Capture players entering the club, organize a tryout event, and select players into teams. This is the entry point of the club lifecycle.

## Scope

### In scope
- Create a tryout event (name, date, location, eligible age groups)
- Player + parent registration for the tryout
- Capture player attributes during tryout (age, position, dominant hand, height, evaluation notes)
- Coach evaluations (private, per-coach scoring)
- Selection workflow (place player on team or "not selected" or "waitlist")
- Notification to parents of selection results
- Parent acceptance/decline of the offered roster spot

### Out of scope (here — see other modules)
- Team naming and coach assignment → [module-teams.md](module-teams.md)
- Payment after acceptance → [module-payments.md](module-payments.md)
- Practice schedule for the team → [module-practice-scheduling.md](module-practice-scheduling.md)

## Personas

- **Head Coach** — creates the tryout, runs evaluations, makes final selections
- **Assistant Coach** — evaluates, recommends (no final selection authority)
- **Parent** — registers player, receives selection notification, accepts/declines

## Key flows

### F1: Head Coach creates a tryout
1. Click "New Tryout" on dashboard
2. Enter date, location, age groups eligible
3. Publish → registration link is live

### F2: Parent registers player
1. Land on tryout registration page (link from coach)
2. Create parent account (or sign in)
3. Add player(s) — name, DOB, position, dominant hand
4. Submit → confirmation email + WhatsApp

### F3: Coach evaluates during tryout
1. Open tryout on phone/tablet at the gym
2. See list of registered players
3. Tap player → enter scores (1-10) on dimensions: shooting, dribbling, defense, court IQ, athleticism
4. Optional: voice memo or text note
5. Saves to private coach view (not shared with other coaches until selection)

### F4: Selection
1. Head Coach reviews all evaluations side-by-side
2. Drags players into teams (or "not selected" / "waitlist")
3. Reviews team composition (positions, ages)
4. Clicks "Notify selections" → parents receive selection result via email + WhatsApp

### F5: Parent acceptance
1. Parent receives notification with link
2. Reviews team, coach name, fee, practice days (preview)
3. Clicks Accept or Decline
4. Acceptance triggers payment workflow

## Data entities (high-level — Architect refines)

- **Club** (top-level tenant)
- **Tryout** (event)
- **TryoutRegistration** (player + parent linked to tryout)
- **PlayerEvaluation** (coach-scored, per-tryout, per-coach)
- **SelectionDecision** (which team, status: offered/accepted/declined)

## Open questions / decisions needed

- Should evaluations be visible to other coaches before selection, or hidden until Head Coach reveals?
- Multiple tryouts in a season (initial + late callouts)?
- Reuse evaluations across years (returning players)?

(File DECISION-NNN-* if these need user input.)

## Acceptance criteria for the module (MVP)

- A Head Coach can create a tryout, parents can register, coaches can score, and selections trigger notifications — end to end, in one season cycle.
- Notifications go via email AND WhatsApp.
- A Parent's acceptance creates the link to the Payment workflow (handed off to Module 3).
