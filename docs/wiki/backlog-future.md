---
title: Backlog — Deferred Features
source: docs/raw/requirements-original.txt (bottom section)
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [backlog, deferred]
status: current
---

# Backlog — Deferred Features

These features came up in the original requirements but are intentionally deferred from the active roadmap. They turn AAUClubManager from a **club management tool** into a **marketplace platform** — a much bigger scope.

Re-evaluate after Phases 0-7 ship and we have real usage data.

## Finder Modules (Marketplace / Discovery)

Discovery features that connect users across clubs.

### For Parents/Players
- **AAU Clubs Finder** — find clubs in my area by age, level, fees
- **Shooting Practice Finder** — drop-in shooting sessions, individual coaches
- **Strength Training / Conditioning Finder** — sports performance facilities
- **Coach Finder** — independent skills coaches for individual training

### For Coaches
- **Gym Finder** — discover gyms beyond your usual ones (rates, availability)
- **Tournament Finder** — discover tournaments to register for
- **Players Finder** — discover players looking for clubs (especially mid-season)

### For Tournament Directors (new persona)
- **Referee Finder** — pool of referees available for tournament dates
- **Scorer Finder** — scorekeepers/clock operators
- **AAU Clubs Finder** — invite clubs to register
- **Gym Finder** — venue sourcing

## New Persona: Tournament Director

Currently AAUClubManager is for clubs. The Tournament Director persona — someone who runs a tournament, not a club — is a separate user category. Adding them means:
- New role/auth flows
- New domain entities (Tournament-as-a-product, registrations from clubs)
- Likely a separate "side" of the product

This is a meaningful expansion that probably justifies a separate product or major version.

## Online Payments

Phase 5's payment module is tracking + reminders only. Online payment processing (Stripe, etc.) is deferred. Consider adding when:
- Multiple clubs ask for it
- We're confident in the financial flow
- We're prepared for refund/dispute handling

## Auto-generated Highlights

In Module 10 (Coaching Intelligence), automatic highlight generation from game video is out of MVP. Consider when:
- Film Study Assistant is mature
- We have enough labeled data for training
- Customer demand validates effort

## Re-prompt timing

When the user signals readiness, the PM should:
1. Survey which deferred features are most demanded
2. Propose a Phase 8+ scope decision
3. File a DECISION-NNN-* with options

Until then, this page exists so the team doesn't lose track of original-requirement signal.
