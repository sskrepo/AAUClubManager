---
title: DECISION-001 — MVP scope and phasing
status: open
created: 2026-05-03
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
- 5-6 months is acceptable runway for the value delivered

If timeline pressure is severe, fall back to Option A with explicit "Phase 4 + 5 in v1.5".

## Your call

Reply with:
- `DECISION-001: A` — Coach's Daily Tool (Phases 1-3)
- `DECISION-001: B` — Full Season Operations (Phases 1-5) ← recommended
- `DECISION-001: C` — Differentiated with AI (Phases 1-3 + 6-partial)
- `DECISION-001: tell me more about X` — for follow-up questions

---

## Decision

(awaiting user)

## Consequences

(filled after user decides)
