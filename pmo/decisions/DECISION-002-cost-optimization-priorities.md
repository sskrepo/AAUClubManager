---
title: DECISION-002 — Cost Optimization Priorities
status: awaiting-user-input
created: 2026-05-03
owner: architect
deciders: user
tags: [cost, tech-stack, scaling]
---

# DECISION-002 — Cost Optimization Priorities

## Why this decision exists

A cost-at-scale analysis of the current tech stack (`docs/wiki/cost-analysis.md`) reveals four choices where the user must make a deliberate call. Three of them have a narrow window before implementation locks them in. This document surfaces those calls with concrete options.

**Urgency:** Decisions A and C must be made before Phase 1 implementation begins. Decisions B and D can be made before Phase 3.

---

## Decision A — Auth Provider: Keep Clerk or Switch to Auth.js?

**What is at stake:** Clerk is free through ~10,000 MAU, then ~$0.02/MAU/month. At PMF (31,000 MAU, 100 clubs) that is ~$500–$700/mo. At SaaS scale (310,000 MAU) it is ~$5,000–$7,000/mo. Auth.js (NextAuth v5) is free at any scale.

**The window:** Once Phase 1 ships with Clerk's Organization model wired into every authorization guard, migrating to Auth.js costs 3–4 weeks eng-time. Doing it before Phase 1 implementation starts costs 2–3 weeks. The switching cost grows every phase.

### Option A1 — Keep Clerk (recommended if < 5,000 MAU within 12 months of launch)

- **Cost:** $0 through 10K MAU, then ~$500/mo at PMF, ~$5K/mo at SaaS scale
- **Eng-time:** $0 (already decided, zero new work)
- **Pro:** Best multi-tenant DX, hosted UI, Organizations model is exactly what we need
- **Con:** Expensive at scale; vendor lock-in on the org model
- **Trigger to revisit:** When MAU reaches 8,000 (before hitting the paid tier), evaluate switching

### Option A2 — Switch to Auth.js v5 before Phase 1

- **Cost:** $0 at any scale
- **Eng-time:** 2–3 weeks to implement auth, session management, and org/membership tables in DB
- **Pro:** Zero ongoing cost; no vendor dependency; full control
- **Con:** You write and maintain the org model, session handling, and social OAuth setup
- **When this is right:** If you expect to reach 30,000+ MAU within 18 months of launch

### Option A3 — Keep Clerk through Phase 2, reassess at Phase 3

- **Cost:** $0 through MVP launch (likely < 10K MAU during phases)
- **Eng-time:** $0 now; defer the decision with explicit trigger at 5K MAU
- **Pro:** Buy time; let real user numbers inform the decision
- **Con:** Each additional phase makes migration harder; risk of getting stuck

**Architect recommendation:** A3 if you expect slow early growth (< 30 clubs in year 1). A2 if you expect rapid adoption. A1 is fine if you are comfortable paying the Clerk bill at scale (the DX is genuinely excellent).

---

## Decision B — WhatsApp Provider: Keep Twilio or Switch to 360dialog at Phase 3?

**What is at stake:** Twilio WhatsApp is the largest cost driver. At PMF (100 clubs, ~84,000 conversations/month), Twilio costs ~$3,360/mo vs. 360dialog ~$1,680–$2,100/mo. Savings: ~$1,200–$1,700/month at PMF.

**The window:** Phase 3 is when WhatsApp production messages start. The notification abstraction (channel = parameter) makes switching providers a 2–3 day backend change — low switching cost. This decision should be made before Phase 3 provisioning begins.

### Option B1 — Keep Twilio

- **Cost:** ~$336/mo at early adopters, ~$3,360/mo at PMF, ~$29,400/mo at SaaS scale
- **Eng-time:** $0 (already in the plan)
- **Pro:** Best documentation, best support, easiest sandbox-to-production transition, most integrations
- **Con:** Premium pricing; ~40% more expensive than 360dialog
- **When this is right:** If eng-team bandwidth is the constraint and you want zero provider friction

### Option B2 — Switch to 360dialog at Phase 3 production activation

- **Cost:** ~$1,680–$2,100/mo at PMF, ~$14,000–$18,000/mo at SaaS scale
- **Eng-time:** 2–3 days (update notification service WhatsApp client implementation; no API contract change)
- **Pro:** 40–50% savings on the biggest cost line item; same Meta WhatsApp Business API features
- **Con:** Less documentation than Twilio; smaller support organization; requires new Meta BSP account setup
- **When this is right:** If you expect to reach 30+ clubs within 6 months of Phase 3 shipping

### Option B3 — Use Twilio sandbox for Phase 0-2 development, decide before Phase 3

- **Cost:** $0 during development (sandbox is free)
- **Eng-time:** $0 now
- **Pro:** Defer the production provider decision until Phase 3 is planned
- **Con:** Not a real decision — you still have to choose before Phase 3

**Architect recommendation:** B2. The notification abstraction makes this nearly risk-free. The savings are $1,200–$1,700/month at PMF — meaningful revenue retained. 360dialog is a legitimate BSP used by many SaaS teams.

---

## Decision C — File Storage: Cloudflare R2 or AWS S3?

**What is at stake:** File storage is not yet assigned to a provider. It becomes necessary in Phase 1 (jersey photos) and Phase 2 (gym photos). Phase 6 AI audio would increase storage volume 10–100× per club.

The key differentiator: Cloudflare R2 has **zero egress fees**. S3 charges $0.09/GB egress. At SaaS scale with 500 GB/month egress, that is $45/month. With AI audio it could be $500+/month.

### Option C1 — Cloudflare R2 (recommended)

- **Cost:** $0.015/GB storage, $0 egress. At PMF: ~$1.50/mo storage + $0 egress. At SaaS scale (AI audio): ~$50–$200/mo
- **Eng-time:** 1 day setup (S3-compatible API — code is identical, different endpoint)
- **Pro:** Zero egress; native Cloudflare CDN integration; future-proof for AI audio
- **Con:** Requires a Cloudflare account; slightly less ecosystem documentation than S3
- **When this is right:** Always — for this workload

### Option C2 — AWS S3

- **Cost:** $0.023/GB storage, $0.09/GB egress. At PMF: ~$6.80/mo. At SaaS scale (AI audio): $200–$600/mo
- **Eng-time:** 1 day setup
- **Pro:** Largest ecosystem, most documentation, integrates with AWS services
- **Con:** Egress fees compound with every user downloading images/audio; no meaningful technical advantage over R2 for this use case
- **When this is right:** If you are already deeply committed to AWS and want a single vendor

**Architect recommendation:** C1 (R2) without reservation. The code is identical (S3-compatible API). There is no upside to choosing S3 for this workload.

---

## Decision D — Observability Stack

**What is at stake:** Logs, error tracking, and uptime monitoring need to be in place from Phase 1. The question is how much to set up at MVP.

### Option D1 — Sentry free + Axiom free (recommended for MVP)

- **Cost:** $0 through ~10K MAU. Sentry Pro ~$26/mo when needed. Axiom paid ~$25/mo.
- **Eng-time:** 2–4 hours setup
- **Pro:** Zero cost, excellent DX (both tools), good free tiers that cover you well into PMF
- **Con:** Two separate tools; no unified dashboard
- **When this is right:** MVP through early-adopter tier

### Option D2 — Grafana Cloud free tier

- **Cost:** Free tier includes 14-day log retention, 10K series metrics
- **Eng-time:** 1 day setup (Loki for logs, Prometheus for metrics, Tempo for traces)
- **Pro:** Full unified stack; unlimited future growth without tool switching
- **Con:** More complex setup; Grafana Cloud free tier limits are tighter than Axiom's

### Option D3 — Self-hosted Grafana + Loki + Tempo on Hetzner

- **Cost:** ~$10–$20/mo hosting
- **Eng-time:** 2 days setup + ongoing maintenance
- **Pro:** Full control; zero SaaS dependency; unlimited retention
- **Con:** You maintain it; if it goes down you have no visibility
- **When this is right:** SaaS scale with ops team; not at MVP

**Architect recommendation:** D1 for MVP and early-adopter tiers. The free tiers are genuinely sufficient. Add Sentry Pro when error volume exceeds the free limit. Evaluate Grafana Cloud (or self-hosted) at PMF if unified observability becomes operationally important.

---

## Your input needed

Reply with your choices for A, B, C, D:

```
DECISION-002:
A: [A1 | A2 | A3]
B: [B1 | B2 | B3]
C: [C1 | C2]
D: [D1 | D2 | D3]
Notes: {anything}
```

Architect will update ADRs and wiki accordingly after your response.
