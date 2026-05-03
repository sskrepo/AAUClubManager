---
title: Module — Gym Management
source: docs/raw/requirements-original.txt §6
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:gyms, phase:2]
status: current
---

# Module: Gym Management

## Purpose

Track gyms the club uses (school gyms, rec centers, private facilities), their availability, contact info, and the bookings the club has made there.

## Scope

### In scope
- Gym registry: name, address, contact (manager email/phone), parking notes, capacity
- Booking records: which Practice instances or Tournament games are at which gym
- Conflict detection: two practices at the same gym at the same time
- Coach's "favorites" / fallback gyms

### Out of scope (initially)
- Online gym discovery / booking marketplace (deferred to backlog Finder modules)
- Payments to gym (track in Payments module if/when added)

## Personas

- **Head Coach** — manages gym registry and bookings
- **Assistant Coach** — view-only

## Key flows

### F1: Register a gym
1. Open "Gyms" page
2. Add gym with details
3. Save

### F2: Book a gym for a practice
1. Default gym set on PracticeTemplate (Module 4)
2. Override per Practice if needed
3. System checks for conflicts with other club bookings

## Data entities

- **Gym** (name, address, contact, capacity, notes)
- **GymBooking** (Gym ↔ Practice or Game, time range, status)

## Acceptance criteria

- Head Coach can register gyms
- Practices and Games reference a Gym
- Conflicts within club bookings are flagged
