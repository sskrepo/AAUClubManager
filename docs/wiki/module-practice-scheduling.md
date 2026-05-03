---
title: Module — Practice Scheduling
source: docs/raw/requirements-original.txt §5
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:practice-scheduling, phase:2]
status: current
---

# Module: Practice Scheduling

## Purpose

Define recurring practice schedules per team (e.g., "Tuesdays + Thursdays, 6-8pm at Smith High School Gym") and let parents/players see what's coming.

## Scope

### In scope
- Recurring practice template per team (days of week, time, default gym)
- Generate practice instances (e.g., for the next 8 weeks)
- One-off changes (different gym for one session, cancel a session)
- Calendar view per team
- Parent calendar combining practices for all their players

### Out of scope (other modules)
- Booking the gym → [module-gyms.md](module-gyms.md)
- Communicating cancellations to parents → [module-practice-communications.md](module-practice-communications.md)
- Attendance taking → [module-practice-communications.md](module-practice-communications.md)
- Coach's notes during practice → [module-coaching-intelligence.md](module-coaching-intelligence.md)

## Personas

- **Head Coach** — defines club-wide schedule
- **Assistant Coach** — manages own team schedule
- **Parent** — views combined schedule for all players
- **Player** — views own team schedule

## Key flows

### F1: Set up team schedule
1. Open Team → "Schedule"
2. Enter recurring template: days, start/end time, default gym
3. Set season window (e.g., March 1 - May 31)
4. Click "Generate" → creates Practice instances for the window

### F2: One-off change
1. Open practice instance
2. Change gym, time, or cancel
3. Triggers communication (Module 7)

## Data entities

- **PracticeTemplate** (Team, days, time, gym)
- **Practice** (instance — date, time, gym, status: scheduled/cancelled/moved)

## Acceptance criteria

- Head/Asst Coach can define a recurring practice schedule
- Practices are generated for a configurable window
- Parents see a calendar combining all their players' practices
- One-off changes update the calendar and trigger communications
