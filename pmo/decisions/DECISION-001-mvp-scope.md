---
title: DECISION-001 — MVP scope and phasing
status: decided
created: 2026-05-03
decided: 2026-05-03
owner: pm
deciders: user
tags: [phase:0, kind:scope]
---

# DECISION-001 — MVP scope and phasing

## Context

The original requirements describe 10 functional modules ranging from basic admin (tryouts, teams, payments) to AI-heavy coaching tools (practice assistant, film study) to third-party integrations. Plus a backlog of marketplace/Finder features.

We need to decide **what's in v1 (MVP)** vs. what gets sequenced into later phases. The proposed phase plan in `pmo/phases.md` slots all 10 modules into Phases 1-7 — but "MVP" can mean different things depending on launch goals:

- Launch fast to get usage signal? → narrower scope
- Launch with the differentiated AI assistant? → wider scope but slower
- Launch broadly but shallowly? → covers more ground but each module is bare-bones

This decision frames every story PM writes from here on.

## Options

### Option A — "Coach's Daily Tool" MVP (Phases 1-3)
**Scope:** Tryouts + Teams + Practice Scheduling + Gym Mgmt + Jersey Mgmt + Practice Communications.

- ✅ **Pros:**
  - Smallest viable product a Head Coach can use end-to-end for a season
  - Shippable in ~3 months
  - Replaces WhatsApp groups + spreadsheets immediately — clearest value
  - Foundation for everything else
- ⚠️ **Cons:**
  - No payments tracking (Phase 5 deferred)
  - No tournaments (Phase 4 deferred) — but tournaments are seasonal, may be tolerable
  - No AI features — undifferentiated vs. simple competitors
- **Effort:** M (3 months, 1 backend + 1 frontend)
- **Reversibility:** N/A (foundation)

### Option B — "Full Season Operations" MVP (Phases 1-5)
**Scope:** All of A + Tournaments + Payments.

- ✅ **Pros:**
  - Coach can run a full season from tryouts through tournaments + collect fees
  - More complete value prop = easier to sell
  - Tournaments + payments are pain points users will pay to solve
- ⚠️ **Cons:**
  - ~5-6 months to ship
  - More surface area to maintain pre-revenue
  - Travel-tournament hotel coordination is complex
- **Effort:** L (5-6 months)
- **Reversibility:** Easy to defer Phase 4 or 5 separately if needed

### Option C — "Differentiated" MVP (Phases 1-3 + Phase 6 partial)
**Scope:** A + Practice Assistant (Phase 6 sub-module, simplified).

- ✅ **Pros:**
  - Ships the differentiated AI feature on day 1
  - Stronger marketing story ("the coaching app with an AI assistant")
  - Validates the AI thesis early
- ⚠️ **Cons:**
  - AI features are technically risky — harder to estimate
  - May ship AI before basics are polished — bad UX trade-off
  - No payments, no tournaments
- **Effort:** L (5-6 months, 2 backend + 1 frontend + AI infra)
- **Reversibility:** Can defer Practice Assistant if it slips

## Recommendation

**Option B — Full Season Operations.**

Reasoning:
- AAU coaches' biggest stated pain points are communication, payment tracking, and tournament logistics — Option A leaves out two of three
- Tournaments are seasonal; missing the season window means waiting a year for adoption
- AI features (Option C) are differentiation, but only matter if the basics are solid first — coaches won't trust a half-baked AI assistant if their roster page is broken

## Updated timeline (agent-pace, added 2026-05-03)

The original phases-comparison.md and architecture-options.md were calibrated for 1 human
backend + 1 human frontend engineer. With agent-driven development, the realistic total is:

- **Option A: ~4-8 weeks** (down from ~14 wks original estimate)
- **Option B: ~6-12 weeks** (down from ~23 wks) ← still recommended
- **Option C: ~5-10 weeks for ops + 4-12 weeks for AI** (down from ~23 wks, but with widest variance)

**The Twilio WhatsApp Business API approval (1-3 weeks of Meta business verification) is the
single longest external lead time for any option.** Start it on day 1 — see
[`pmo/phase-briefs/PHASE-0-kickoff.md`](../phase-briefs/PHASE-0-kickoff.md).

The recommendation is unchanged: Option B remains the best balance of value and risk. The
shorter timeline strengthens the argument — committing to a 6-12 week project is easier than
to a 5-6 month one, and the Phase 4 (Tournaments) + Phase 5 (Payments) modules become
materially more affordable to include.

If timeline pressure is severe (target a specific season window with tight runway), fall back
to Option A with explicit "Phase 4 + 5 in v1.5" — but at agent pace, even Option B fits
inside most reasonable seasonal launch windows.

## Your call

Reply with:
- `DECISION-001: A` — Coach's Daily Tool (Phases 1-3, ~4-8 wks agent-pace)
- `DECISION-001: B` — Full Season Operations (Phases 1-5, ~6-12 wks agent-pace) ← recommended
- `DECISION-001: C` — Differentiated with AI (Phases 1-3 + 6-partial, ~5-10 wks ops + 4-12 wks AI variance)
- `DECISION-001: A then B` — Ship A as v1, then sequence B-4 + B-5 immediately after as v1.5
- `DECISION-001: tell me more about X` — for follow-up questions

---

## Decision (2026-05-03)

**User chose Option B — Full Season Operations.**

Recorded as the source of truth for project scope. Locks in MVP as Phases 1-5: Tryouts, Teams, Practice Scheduling, Gym Management, Jersey Management, Practice Communications, Tournaments, Payment Tracking.

## Consequences

### What this enables
- Coach can run an entire AAU season end-to-end from one platform
- Tournament management (local + travel hotel coordination) ships in v1
- Payment tracking + automated reminders ship in v1
- Realistic agent-pace timeline: ~6-12 weeks from Phase 0 start (depending on Twilio approval lead time and real-world friction)

### What this rules out for v1
- AI Practice Assistant (deferred to Phase 6 / v1.5)
- Film Study Assistant (deferred to Phase 6 / v1.5)
- Third-party analytics integrations (deferred to Phase 7)
- Online payment processing via Stripe (deferred to Phase 5 expansion / v1.5)
- All Finder marketplace features and Tournament Director persona (in `docs/wiki/backlog-future.md`)

### What now changes
- `pmo/phases.md` — phases 1-5 are locked in; PM and Architect fill in concrete scope/dependencies per phase
- Phase 0 (Foundation) is **unblocked** — Architect can file ADRs (Clerk, Knex+Postgres, Resend+Twilio, BullMQ+Redis), backend/frontend scaffolding can begin, in parallel with user's external dependency setup from `pmo/phase-briefs/PHASE-0-kickoff.md`
- For Phase 1+: the new v0.1.3 gate workflow applies (PDD + UI mocks → Gate 1 → OpenAPI spec → Gate 2 → engineering)
- DECISION-001 closes as `decided`. Future scope changes for Phases 4 or 5 require a new DECISION file (don't silently mutate this one).

### Cross-references
- [`pmo/phases-comparison.md`](../phases-comparison.md) — full Option B scope analysis
- [`docs/wiki/architecture-options.md`](../../docs/wiki/architecture-options.md) — Option B technical analysis
- [`pmo/phase-briefs/PHASE-0-kickoff.md`](../phase-briefs/PHASE-0-kickoff.md) — external dependencies user must handle in Phase 0
