---
title: Cost-at-Scale Analysis — AAUClubManager Tech Stack
created: 2026-05-03
owner: architect
tags: [cost, scaling, tech-stack]
status: draft
---

# Cost-at-Scale Analysis — AAUClubManager Tech Stack

Pricing as of early 2026. All figures are estimates; verify against current vendor pricing pages before committing. Pricing changes frequently — treat ranges as order-of-magnitude, not binding quotes.

---

## Scale Tiers Used Throughout

| Tier | Clubs | Players | Parents | Coaches | Total MAU | Notifications/mo |
|---|---|---|---|---|---|---|
| **MVP / 1 club** | 1 | 100 | 200 | 10 | ~310 | ~3,000 |
| **Early adopters** | 10 | 1,000 | 2,000 | 100 | ~3,100 | ~30,000 |
| **PMF** | 100 | 10,000 | 20,000 | 1,000 | ~31,000 | ~300,000 |
| **SaaS scale** | 1,000 | 100,000 | 200,000 | 10,000 | ~310,000 | ~3,000,000 |

**Notification mix used:** 70% WhatsApp (~2,100 / 21,000 / 210,000 / 2,100,000), 25% email (~750 / 7,500 / 75,000 / 750,000), 5% SMS fallback (not costed separately — Twilio SMS is ~$0.0075/msg, minor at early tiers).

**Notification volume rationale:** AAU clubs send heavy bursts around practice schedule changes, game-day reminders, and payment due dates. 3,000 notifications per club per month is conservative (roughly 100/day average across a 30-day month for one club with multiple teams). The 70% WhatsApp assumption reflects that AAU coaches and parents are already on WhatsApp and expect that channel.

---

## TL;DR — Monthly Infrastructure Cost by Tier

### Current stack cost estimates

| Component | MVP | Early adopters | PMF | SaaS scale |
|---|---|---|---|---|
| Clerk (auth) | $0 | $0–$25 | $250–$500 | $2,000–$4,000 |
| Twilio WhatsApp | $0 | ~$100–$200 | ~$1,000–$2,000 | ~$10,000–$20,000 |
| Resend (email) | $0 | $0–$20 | $89–$200 | $400–$900 |
| PostgreSQL managed | $0–$25 | $25–$50 | $100–$300 | $500–$2,000 |
| Redis managed | $0–$10 | $10–$25 | $50–$100 | $200–$500 |
| Backend hosting | $0–$5 | $10–$25 | $50–$150 | $300–$1,000 |
| Frontend hosting | $0 | $0–$20 | $20–$50 | $50–$200 |
| File storage | $0 | $0–$5 | $10–$50 | $50–$500 |
| Observability | $0 | $0–$20 | $30–$100 | $100–$500 |
| **TOTAL (current stack)** | **~$0–$40** | **~$145–$365** | **~$1,600–$3,450** | **~$13,600–$29,600** |

### Cost-optimized alternative stack estimates

| Component | MVP | Early adopters | PMF | SaaS scale |
|---|---|---|---|---|
| Auth.js / Lucia (self-hosted) | $0 | $0 | $0 | $0 |
| 360dialog WhatsApp | $0 | ~$50–$100 | ~$600–$1,200 | ~$5,000–$10,000 |
| AWS SES (email) | $0 | $0–$1 | $7–$10 | $70–$100 |
| Neon / Hetzner PG | $0 | $0–$19 | $19–$100 | $100–$500 |
| Upstash Redis | $0 | $0–$10 | $20–$60 | $80–$300 |
| Hetzner + Coolify (backend) | $0–$5 | $5–$10 | $20–$50 | $80–$200 |
| Cloudflare Pages (frontend) | $0 | $0 | $0–$20 | $20–$50 |
| Cloudflare R2 (storage) | $0 | $0 | $5–$20 | $30–$200 |
| BetterStack / Axiom (obs.) | $0 | $0 | $25–$50 | $50–$200 |
| **TOTAL (cost-optimized)** | **~$0–$5** | **~$55–$140** | **~$696–$1,510** | **~$5,430–$11,550** |

**Gap at PMF tier (where real money starts):** Current stack ~$1,600–$3,450/mo vs. optimized ~$696–$1,510/mo. Savings of ~$900–$2,000/mo. At SaaS scale the gap widens to ~$8,000–$18,000/mo.

**The most important observation:** At MVP and early-adopter tiers the cost difference is trivial — under $200/mo either way. The cost curve bends sharply at PMF (100 clubs). All swaps that matter should be planned by the 30-club mark so they are done before PMF load hits.

---

## The 3 Biggest Cost Levers

**Call these out before reading the detail — they drive 85%+ of the bill.**

### Lever 1: Twilio WhatsApp — $1,000–$20,000/mo at scale

Twilio is the most expensive line item by far at PMF and SaaS tiers. At 210,000 WhatsApp messages/month (PMF), Twilio charges ~$0.005–$0.01/message for utility conversations, but the conversation-window model means many "conversations" cost $0.02–$0.07 each (the conversation fee) regardless of how many messages go into it. At 30,000+ conversations/month the bill becomes material.

360dialog is typically 30–50% cheaper than Twilio for the same Meta WhatsApp Business API volume. WATI sits between.

**Switching cost:** High eng-time now (2–3 days to switch provider), low eng-time later if the notification abstraction is clean. The abstraction IS already planned (channel = parameter). Plan the switch around 20–30 clubs.

### Lever 2: Clerk — $250–$4,000+/mo at scale

Clerk's free tier covers 10,000 MAU. At PMF (31,000 MAU) you are paying per-MAU. At SaaS scale (310,000 MAU) Clerk becomes one of the largest non-notification line items. The multi-tenant Organizations feature (which we need for club-as-org) is on the Pro plan at $0.02/MAU or similar.

Auth.js (NextAuth v5) with your own DB is free at any scale; Lucia is similar. The switching cost is 2–3 weeks eng-time (not days — auth is load-bearing). Switching after you have production users is painful. This decision is ideally made before Phase 1 implementation, not after.

### Lever 3: Database + Redis hosting provider — $500–$2,500/mo delta at scale

Managed Postgres on Supabase or Neon vs. self-hosted on Hetzner (via Coolify/Dokku) is a 3–5× cost difference at PMF+. Redis is similar. Since Knex keeps us RDBMS-agnostic, the hosting provider swap is purely operational. The migration is a pg_dump + restore, not a code change.

The switch is low eng-time (1–2 days) but has operational risk (downtime window, data integrity check). Plan it as a Phase 3 or Phase 4 infrastructure task.

---

## Decision 1: Auth — Clerk

### Current choice: Clerk

Clerk provides: hosted UI (sign-in, sign-up, user management), multi-tenant Organizations (club = org), role claims in JWT, social login, MFA, session management. It's an excellent DX choice for fast launch.

### Cost curve

Clerk pricing model: free up to 10,000 MAU (monthly active users). Above that, Pro plan at ~$0.02/MAU/month (verify at clerk.com/pricing — tiers and prices change).

| Tier | MAU | Free headroom | Overage | Estimated monthly |
|---|---|---|---|---|
| MVP | 310 | Under free tier | $0 | $0 |
| Early adopters | 3,100 | Under free tier | $0 | $0–$25 |
| PMF | 31,000 | 10,000 free | 21,000 × ~$0.02 | ~$420–$500 |
| SaaS scale | 310,000 | 10,000 free | 300,000 × ~$0.02 | ~$4,000–$6,000 |

Note: Clerk also charges per Organization on the Pro plan (~$1/org/month for Organizations above a free threshold). At 100 clubs = 100 orgs, that's ~$100/mo additional at PMF. At 1,000 clubs it's $1,000/mo. Verify the current Organizations add-on pricing — it has changed in the past.

Adjusted PMF total with org fees: ~$500–$700/mo. SaaS scale: ~$5,000–$7,000/mo.

### Alternatives

| Option | Auth infra cost | Eng-time to build | Multi-tenant support | Notes |
|---|---|---|---|---|
| **Clerk (current)** | $0 → $5K+/mo | ~0 (already decided) | Excellent (native Organizations) | Best DX; most expensive at scale |
| **Auth.js v5 (NextAuth)** | $0 at any scale | 2–3 weeks | DIY (DB table per org) | Self-hosted; session via DB/JWT; no hosted UI for OAuth |
| **Lucia** | $0 at any scale | 2–3 weeks | DIY | More control than Auth.js; same ops burden |
| **Supabase Auth** | $0–$25/mo | 3–5 days | DB-scoped (row-level) | Locks you to Supabase hosting; organization model is weaker |
| **WorkOS** | $0 → ~$500+/mo | 1 week | Excellent (orgs, SAML/SSO) | Better than Clerk for B2B/enterprise; overkill at MVP scale |
| **Stytch** | $0 → ~$200+/mo | 1 week | Good (orgs, M2M) | Better pricing at scale than Clerk; less DX-friendly |

### Tradeoff matrix

| Criterion | Clerk | Auth.js | WorkOS |
|---|---|---|---|
| Multi-tenant org support | Native, zero code | DIY (write your own org/membership tables) | Native, enterprise-grade |
| SAML/SSO (future school-district sales) | Add-on, expensive | Not included | Included |
| Social login UX (Google, Apple) | Hosted, beautiful | Configured per provider | Configured per provider |
| Eng-time at Phase 0 | ~0 (already built in) | 2–3 weeks to parity | 1 week |
| Monthly cost at PMF (100 clubs) | ~$500–$700 | ~$0 | ~$500+ |
| Monthly cost at SaaS scale | ~$5K–$7K | ~$0 | Similar to Clerk |
| Switching cost after Phase 1 | High (auth is everywhere) | — | High |

### Recommendation

Keep Clerk through MVP and early-adopter tiers — you get 10,000 MAU free and the DX investment is already made. Before you hit 5,000 MAU (roughly 15–20 clubs), decide whether to switch to Auth.js + your own org model. If you plan to sell to school districts or large organizations (SAML/SSO required), WorkOS becomes attractive. If the product stays with individual coaches, Auth.js at zero cost is compelling.

**The decision window is narrow:** Once Phase 1 ships with Clerk's organization model wired into every authorization guard, the migration cost rises to 3–4 weeks (touch every auth middleware call). Do this swap before Phase 1 implementation starts or explicitly accept the future migration cost.

---

## Decision 2: Notifications — Twilio WhatsApp + Resend Email

### Twilio WhatsApp

This is the most important cost decision in the stack. Twilio uses Meta's WhatsApp Business API pricing, which charges per conversation (a 24-hour window of messages to/from one user), not per message.

**Conversation categories (Meta pricing, early 2026 approximate):**
- Utility (order confirmations, schedule reminders): $0.02–$0.06/conversation (US)
- Service (user-initiated replies): $0.00–$0.02/conversation
- Marketing (promotional): $0.04–$0.10/conversation

All of our sends (practice reminders, payment due, game-time callouts) are utility conversations.

**Additional Twilio markup:** Twilio charges above Meta's base rate. Markup varies 5–20% depending on plan.

**Notification-to-conversation ratio:** In practice, a "conversation" window lasts 24 hours. If we send 3 messages to a parent in one day (practice reminder morning, update afternoon, confirmation evening), that's 1 conversation, not 3. Assume ~2.5 messages per conversation on average → conversation count = (messages × 0.4).

| Tier | WhatsApp msgs/mo | Conversations | ~$/conversation | Monthly cost |
|---|---|---|---|---|
| MVP | 2,100 | ~840 | $0.04 | ~$34 |
| Early adopters | 21,000 | ~8,400 | $0.04 | ~$336 |
| PMF | 210,000 | ~84,000 | $0.04 | ~$3,360 |
| SaaS scale | 2,100,000 | ~840,000 | $0.035 (volume) | ~$29,400 |

These numbers are sobering. Twilio WhatsApp is the biggest single cost driver at every tier beyond early adopters.

### Resend Email

Resend pricing: free tier ~3,000 emails/month. Pro: $20/month for 50,000 emails, $80/month for 200,000 emails, higher tiers available.

| Tier | Emails/mo | Monthly cost |
|---|---|---|
| MVP | 750 | $0 (free tier) |
| Early adopters | 7,500 | $20 |
| PMF | 75,000 | $80–$120 |
| SaaS scale | 750,000 | $400–$900 |

Email is not the problem. Resend's pricing is reasonable, deliverability is excellent, and the API is clean.

### WhatsApp Provider Alternatives

| Provider | Pricing model | Est. cost at PMF (84K conversations) | Notes |
|---|---|---|---|
| **Twilio (current)** | Per-conversation + markup | ~$3,360/mo | Best docs; most expensive |
| **360dialog** | Monthly platform fee ($5–50) + lower per-conversation | ~$1,680–$2,100/mo | ~40–50% cheaper than Twilio; self-service Meta BSP |
| **WATI** | Per-message + platform fee | ~$2,500/mo | Mid-tier; good UI for templates |
| **Vonage** | Per-conversation | ~$2,800/mo | Similar to Twilio |
| **MessageBird (Bird)** | Per-conversation | ~$2,500–$3,000/mo | Merged with SparkPost; some pricing instability |
| **Meta direct** | Base rate only, no markup | ~$1,680/mo (at $0.02 blended avg) | Requires direct BSP approval; significantly more complex setup; reserved for large-volume players |

360dialog is consistently the cheapest Meta BSP with minimal setup overhead. It has solid documentation and is used by many SaaS teams. The switch from Twilio to 360dialog is a 2–3 day backend change (update the notification service's WhatsApp client implementation — no API contract change since the abstraction hides the provider).

### Email Alternatives

| Provider | Cost at PMF (75K emails/mo) | Notes |
|---|---|---|
| **Resend (current)** | ~$80–$120/mo | Good DX; newer provider |
| **Postmark** | ~$75/mo | Excellent transactional deliverability; strong for receipts |
| **AWS SES** | ~$7.50/mo | $0.10/1,000 emails; requires DNS setup; no bounce/complaint UI built-in |
| **SendGrid** | ~$90–$120/mo | Mature; similar price to Resend at this volume |
| **Self-hosted (Postal)** | ~$10–$20/mo (hosting only) | 2–3 weeks eng-time; requires DKIM/SPF/DMARC expertise; risky for deliverability |

AWS SES is 10× cheaper than Resend at PMF scale but requires more operational setup (bounce/complaint webhooks, suppression list management). The switch is 1–2 days eng-time. Given Resend's pricing is manageable through PMF, defer SES migration to the SaaS-scale tier.

### Recommendation

Switch WhatsApp provider from Twilio to 360dialog around 20–30 clubs (early-adopter tier). The savings are meaningful ($1,500–$1,700/month at PMF) and the switch is low-effort given the notification abstraction. Keep Twilio's sandbox for Phase 0-2 development; at Phase 3 activation, provision 360dialog for production.

Keep Resend through PMF. Evaluate SES at 100K+ emails/month.

---

## Decision 3: Database — PostgreSQL Managed

### Current choice: Managed PostgreSQL (provider unspecified)

Since Knex keeps us RDBMS-agnostic, the DB cost is entirely a hosting decision. Data size estimate: ~1–5 MB/club/season (text-only — no media stored in DB). At 100 clubs: ~100–500 MB active data plus indexes. This is small — storage is not the cost driver. Compute and connection pooling are.

### Provider cost curve

| Provider | MVP | Early adopters | PMF | SaaS scale | Notes |
|---|---|---|---|---|---|
| **Supabase** (free/pro) | $0 | $25/mo | $100–$300/mo | $500–$2,000/mo | 2 GB free; Pro has connection pooler (PgBouncer built-in) |
| **Neon** (serverless PG) | $0 | $0–$19/mo | $69–$200/mo | $300–$1,000/mo | Autoscales; great for burst; branching for dev/preview |
| **Railway** | $0–$5 | $10–$25/mo | $50–$150/mo | $300–$800/mo | Convenient; less control |
| **Render** | $0–$7 | $7–$25/mo | $50–$150/mo | $300–$800/mo | Similar to Railway |
| **AWS RDS** | $20–$40 | $50–$100 | $150–$500/mo | $1,000–$5,000/mo | Expensive but battle-tested; Multi-AZ redundancy |
| **Crunchy Bridge** | $29/mo | $50–$100 | $150–$400/mo | $500–$2,000/mo | Postgres experts; strong extensions; slightly expensive |
| **Hetzner + self-host** | $5–$15/mo | $10–$20/mo | $20–$60/mo | $80–$300/mo | Cheapest compute; ops burden (backups, HA) |

**Key concern for this app: connection count.** At PMF with 31,000 MAU and multiple concurrent practice-time access spikes (all parents checking schedules simultaneously before practice), connection pooling is critical. Supabase and Neon both include PgBouncer or equivalent. Self-hosted solutions require you to configure PgBouncer separately.

**Multi-tenant data isolation:** We use `club_id` scoping at the query layer (not separate databases or schemas per tenant). This works fine through SaaS scale for this data volume. No DB provider change is needed to support multi-tenancy.

### Recommendation

Start on Neon (generous free tier, autoscaling, great dev branching for feature work). Migrate to Hetzner + managed Postgres (via Coolify) around 30–50 clubs if cost becomes meaningful. The migration is a pg_dump + restore. Budget 1 day eng-time. Keep Neon for dev/staging environments indefinitely (branching is genuinely useful).

---

## Decision 4: Cache + Queue — Redis (Managed) + BullMQ

### Current choice: Managed Redis + BullMQ

BullMQ is excellent: delayed jobs, repeatable jobs, prioritization, dead-letter queues. It requires Redis. The question is where Redis runs and what it costs.

### Redis provider cost curve

| Provider | MVP | Early adopters | PMF | SaaS scale | Notes |
|---|---|---|---|---|---|
| **Upstash** | $0 | $0–$10 | $20–$60 | $80–$300 | Serverless; pay-per-request; $0.2/100K commands; great for burst |
| **Redis Cloud** | $0 | $10–$25 | $50–$100 | $200–$500 | Managed by Redis Inc.; more predictable |
| **Railway Redis** | $0–$5 | $5–$15 | $20–$60 | $100–$300 | Convenient if already on Railway |
| **Render Redis** | $7 | $7–$20 | $20–$60 | $100–$300 | Similar |
| **ElastiCache** | $25+ | $50–$100 | $150–$300 | $500–$2,000 | AWS lock-in; expensive; only worth it on AWS |
| **Hetzner self-host** | $5 | $5–$10 | $10–$30 | $40–$150 | Cheapest; ops burden for HA + persistence |

Upstash is the right choice for this workload: notification bursts (many jobs at practice-time, quiet overnight) are ideal for serverless Redis billing. The command volume at PMF is manageable — 300K notifications/month through BullMQ generates roughly 5–10 Redis commands/job = ~2–3M commands/month = ~$4–$6 on Upstash. This is negligible.

### Alternatives to Redis + BullMQ

| Alternative | Setup cost | Ops burden | Feature parity | Monthly cost (PMF) |
|---|---|---|---|---|
| **pg-boss** (Postgres-backed queue) | 1–2 days | Same as DB | Good (delays, repeats, scheduled) | $0 (uses existing Postgres) |
| **river-queue** (Go; N/A for Node) | N/A | N/A | N/A | — |
| **AWS SQS** | 2–3 days | Low | Good (but no delayed retries natively) | ~$1–$5 |
| **Cloudflare Queues** | 2–3 days | Very low | Basic (no delays, no repeats) | ~$0–$5 |

**pg-boss is worth serious consideration.** It runs entirely in Postgres — no Redis, no additional service, no extra cost. It supports scheduled jobs (cron), delayed jobs, and retry. It lacks BullMQ's real-time dashboard, but that's an ops convenience, not a feature requirement.

Switching BullMQ to pg-boss eliminates Redis entirely at the cost of 1–2 weeks eng-time and slightly higher DB CPU at peak. At PMF scale, Redis cost is ~$20–$60/month — not catastrophic — so this is an optional optimization. The more compelling reason to do it is operational simplicity (one fewer service to manage).

### Recommendation

Use Upstash Redis for BullMQ through PMF. Evaluate pg-boss at the SaaS-scale tier if Redis cost climbs above $200/month or if ops burden is a concern. Do not switch now — the BullMQ investment is already designed in and the Upstash cost is negligible through early-adopter tier.

---

## Decision 5: Frontend Hosting — Vercel (assumed)

### Cost curve

Vercel pricing: Hobby = free (personal projects, bandwidth limits, no commercial SLA). Pro = $20/user/month flat + usage. Team = enterprise pricing.

The relevant costs on Pro:
- Bandwidth: 1 TB included in Pro; ~$0.15/GB overage
- Serverless function invocations: 1M included; $0.60/million overage
- Edge requests: generous free limits

For this app (Next.js 15 with API routes or a separate Express backend), the frontend serving static/SSR pages is the main workload. At PMF, 31,000 MAU × ~50 page loads/session × ~100 KB/page = ~155 GB bandwidth/month. Well within Pro limits.

| Tier | MAU | Bandwidth est. | Vercel cost |
|---|---|---|---|
| MVP | 310 | ~2 GB | $0 (hobby/pro flat) |
| Early adopters | 3,100 | ~15 GB | $20/mo (Pro flat) |
| PMF | 31,000 | ~150 GB | $20–$30/mo |
| SaaS scale | 310,000 | ~1,500 GB | $20 + ~$75 overage = ~$95/mo |

Vercel is not an expensive choice at any tier for this workload. The real risk is **vendor lock-in** on Next.js-specific features (ISR, edge middleware, image optimization). If you ever need to move away from Vercel, some Next.js features will require re-implementation.

### Alternatives

| Provider | Cost at PMF | Notes |
|---|---|---|
| **Vercel (assumed current)** | ~$20–$30/mo | Best Next.js DX; some lock-in |
| **Cloudflare Pages** | $0–$20/mo | Free tier very generous; global CDN; no Next.js-specific features (edge functions work but ISR is limited) |
| **Netlify** | $19–$100/mo | Similar DX to Vercel; Next.js support is decent but second-class |
| **Railway** | $5–$20/mo | Works; less specialized |
| **Self-host Next.js on Hetzner** | $5–$15/mo | Cheapest; requires PM2 or similar; loses Vercel DX |

### Recommendation

Stay on Vercel through PMF. The cost is trivial ($20–$30/mo) and the DX benefit is real. At SaaS scale, evaluate Cloudflare Pages if bandwidth costs climb — Cloudflare has no egress fees, which matters when serving 1TB+/month.

---

## Decision 6: Backend Hosting — Railway/Render (assumed)

### Cost curve

Railway pricing: $5/seat + resource-based ($0.000463/vCPU-second, $0.0000018/GB RAM-second). For a typical Express server:
- Idle: ~0.1 vCPU, 256 MB RAM
- Under load: ~0.5–1 vCPU, 512 MB RAM

Estimated monthly at 24/7 operation:
- 0.5 vCPU average × $0.000463 × 2,592,000 seconds = ~$600/mo?

Wait — Railway's actual pricing is more nuanced. They have a starter plan at $5/month with $5 credit included, and usage-based billing beyond that. A small Node.js Express server (0.5 vCPU, 512 MB) runs roughly $10–$20/month on Railway.

Render pricing: Free tier has sleep-on-idle (bad for production). Starter = $7/mo/service (0.5 CPU, 512 MB). Standard = $25/mo (1 CPU, 2 GB).

| Tier | Traffic profile | Railway/Render cost | Notes |
|---|---|---|---|
| MVP | Single process, light load | $0–$10 | Free tier viable with caveats |
| Early adopters | Single process, moderate load | $10–$25 | Starter plan sufficient |
| PMF | 2-3 processes (API + BullMQ worker) | $50–$150 | Need at least 2 services |
| SaaS scale | Horizontal scaling needed | $300–$1,000 | May need K8s or managed container |

### Alternatives

| Provider | Cost at PMF | Notes |
|---|---|---|
| **Railway/Render (current)** | $50–$150/mo | Great DX; limited horizontal scaling story |
| **Fly.io** | $30–$100/mo | Excellent for global deployment; good auto-scaling |
| **Hetzner + Coolify** | $20–$60/mo | 3–5× cheaper; 1–2 days setup; manual scaling |
| **AWS App Runner** | $50–$150/mo | Managed containers; easy auto-scaling; AWS lock-in |
| **GCP Cloud Run** | $20–$100/mo | Pay-per-request; zero idle cost; cold starts |
| **Cloudflare Workers** | $5–$20/mo | Requires restructuring away from Express; not worth it |

**Hetzner + Coolify** is the clear winner on cost (3–5× cheaper than Railway/Render) with acceptable ops burden (Coolify is a GUI deployment platform that handles zero-downtime deploys, env vars, SSL). The switch takes 1–2 days. Reserve this for the 20–30 club milestone.

### Recommendation

Start on Railway or Render (both are fine for MVP). Migrate to Hetzner + Coolify at the early-adopter tier (10–30 clubs). The savings ($30–$100/month) compound when you combine DB + Redis + backend all on Hetzner.

---

## Decision 7: Background Jobs — BullMQ Workers

BullMQ workers are separate processes from the API server. They consume Redis and need their own compute.

### Cost implications

BullMQ workers can run on the same infrastructure as the API server (co-located process), or as separate services. For this workload:

- At MVP: run worker in-process or as a second process on the same host. Cost: $0 additional.
- At early adopters: separate worker service. Cost: +$7–$10/mo (Render starter) or ~+$5 (Railway).
- At PMF: 2–3 worker processes for notification dispatch concurrency. Cost: +$20–$50/mo.
- At SaaS scale: dedicated worker fleet. Cost: +$100–$300/mo.

Workers are not a major cost driver. The Redis cost is the bigger lever (covered in Decision 4).

If switching to pg-boss (no Redis), the worker process still exists but uses Postgres for job state. Cost is effectively zero (uses existing DB).

---

## Decision 8: File Storage

**Not yet formally decided — this is a prerequisite flag.**

Phase 1 (jersey photos), Phase 2 (gym photos), Phase 4 (tournament documents), and Phase 6 (AI audio/video) all require object storage. This should be locked in Phase 1, not Phase 6.

### Options

| Provider | Storage cost | Egress cost | Notes |
|---|---|---|---|
| **AWS S3** | $0.023/GB | $0.09/GB | Industry standard; expensive egress |
| **Cloudflare R2** | $0.015/GB | **$0 egress** | This is the key differentiator |
| **Backblaze B2** | $0.006/GB | $0.01/GB (but free to CF CDN) | Cheapest storage; pair with Cloudflare for free egress |
| **Supabase Storage** | $0.021/GB | Included in plan | Convenient if using Supabase; vendor lock risk |
| **Bunny.net** | $0.01/GB | $0.01–$0.06/GB | CDN-first; good for media |

### Cost curve (assuming 1 GB/club/season for photos + documents, no video)

| Tier | Storage | Egress (50% of stored, monthly) | R2 cost | S3 cost |
|---|---|---|---|---|
| MVP | 1 GB | 0.5 GB | ~$0 | ~$0.05 |
| Early adopters | 10 GB | 5 GB | ~$0.15 | ~$0.68 |
| PMF | 100 GB | 50 GB | ~$1.50 | ~$6.80 |
| SaaS scale | 1 TB | 500 GB | ~$15 | ~$68 |

With Phase 6 AI audio (deferred to post-MVP), storage jumps 10–100× per club. At that point, R2's zero-egress advantage becomes significant. Plan for R2 from day one — the S3-compatible API means the code is identical (same SDK, just different endpoint URL).

### Recommendation

Use Cloudflare R2 from Phase 1. Zero egress fees are a structural advantage that compounds at every scale tier. The S3-compatible API means no code difference from AWS S3. File a Phase 1 prerequisite to provision the R2 bucket and add the credentials to the external dependencies roster.

---

## Decision 9: Observability

### Not yet formally decided — threshold recommendation

Observability components: error tracking, structured logs, metrics/APM.

### Cost curve and tier thresholds

| Tool | Free tier | Paid threshold | Cost at PMF | Notes |
|---|---|---|---|---|
| **Sentry** (errors) | 5K errors/mo | When you exceed free | $26–$80/mo | Best error DX; essential from Phase 1 |
| **Axiom** (logs) | 500 GB/mo free | Very generous | $0–$25/mo | Excellent DX; great free tier |
| **BetterStack** (logs + uptime) | Generous | ~5 GB/day logs | $0–$25/mo | Uptime monitoring included |
| **Logflare** | Generous | Usage-based | $0–$10/mo | Cloudflare-native |
| **Grafana Cloud** | 14-day retention | 90-day retention | $0–$50/mo | Full stack (Loki/Mimir/Tempo) |
| **Datadog** | No meaningful free tier | From day 1 | $300–$2,000+/mo | Enterprise; overkill until Series A |
| **Self-hosted (Loki+Grafana)** | $0 | Never (ops cost instead) | $10–$20 (hosting) | 1–2 days setup; maintenance ongoing |

**Recommendation by tier:**

- MVP and early adopters: Sentry free + Axiom free. Cost: $0. Add uptime monitoring via BetterStack free tier.
- PMF: Sentry Pro ($26/mo) + Axiom or BetterStack paid ($25/mo). Total: ~$50–$75/mo.
- SaaS scale: Evaluate Grafana Cloud or Datadog at this point. Until then, the simple stack suffices.

Datadog is never worth it at this scale. It is the AWS of observability — powerful, but priced for enterprises.

---

## Decision 10: API Codegen — `openapi-typescript-codegen`

### Cost

Zero. This is a build-time tool with no runtime or SaaS cost. No cost optimization needed.

**Build-time note:** At CI/CD, each `npm run api:generate` adds ~5–15 seconds to build time. At 50 PRs/month on GitHub Actions (free tier: 2,000 minutes/month for public repos; 500 for private), this is immaterial. Even on a paid plan ($4/extra 1,000 minutes), the codegen step adds < $0.01/build.

**One flag:** `openapi-typescript-codegen` is unmaintained. The successor is `hey-api/openapi-ts`. This is a 1-day migration with no runtime cost implication, but worth doing in Phase 1 before the codebase grows. File as a Phase 0 engineering task.

---

## Recommendations by Horizon

### "Change before Phase 1 implementation begins" (cheap to swap now, painful later)

1. **Auth provider decision** — Clerk vs. Auth.js. The organization model is wired into every authorization guard. Changing after Phase 1 ships means touching every auth check. Cost: ~2–3 weeks now if switching to Auth.js; ~3–4 weeks after Phase 1 ships. If Clerk's free tier (10K MAU) is sufficient through your growth horizon, keep it and revisit at 8,000 MAU. If you expect to reach 100 clubs (31K MAU) within 12 months of launch, switch to Auth.js now.

2. **File storage provider** — Choose R2 from Phase 1 and never revisit. S3 and R2 are API-compatible. Setting R2 up first costs nothing extra and avoids a painful migration when AI audio storage lands in Phase 6.

3. **Codegen tool** — Migrate from `openapi-typescript-codegen` to `hey-api/openapi-ts`. 1-day task, best done before Phase 1 generates 20+ endpoints.

### "Plan switch around early-adopter tier (~10–30 clubs)"

4. **WhatsApp provider** — Switch from Twilio to 360dialog. Savings: ~$1,500–$1,700/month at PMF. The notification abstraction makes this a 2–3 day backend change. Keep Twilio sandbox for development; provision 360dialog for Phase 3 production.

5. **Backend + DB hosting** — Migrate from Railway/Render to Hetzner + Coolify. Combine with DB migration off Neon free tier to Hetzner self-managed Postgres (or stay Neon for branching, move only if cost exceeds $100/mo). Total hosting savings at PMF: ~$100–$200/mo.

### "Acceptable to defer to PMF tier (~100 clubs)"

6. **Redis / BullMQ → pg-boss** — Only if ops burden of Redis becomes painful or cost exceeds $100/mo. At PMF, Upstash Redis for this workload is ~$20–$60/mo — not worth a migration that costs 1–2 weeks eng-time.

7. **Email — Resend → AWS SES** — Resend is $80–$120/mo at PMF. SES is $7.50. Savings of $70–$110/mo; migration takes 1–2 days. Defer until you're confident in your email infrastructure (bounce handling, suppression lists) and are spending > $100/mo on email.

8. **Observability paid tiers** — Sentry free + Axiom free covers you to ~10K MAU. Upgrade when you exhaust free tiers; the cost is low either way.

---

## Decisions Needed From User

These are the calls that only you can make. See `pmo/decisions/DECISION-002-cost-optimization-priorities.md` for the formal options.

**Decision A — Auth provider by Phase 1 start**
Switch to Auth.js (zero cost at scale, 2–3 weeks eng-time now) or keep Clerk (free through 10K MAU, $5K+/mo at SaaS scale, zero eng-time now)?

**Decision B — WhatsApp provider for Phase 3 production**
Switch to 360dialog (2–3 days eng-time, ~40–50% cheaper at scale) or keep Twilio (better docs/support, premium pricing)?

**Decision C — File storage provider for Phase 1**
Cloudflare R2 (zero egress, S3-compatible) or AWS S3 (more familiar, 3–5× more expensive at scale due to egress)? Recommend R2, but user should confirm.

**Decision D — Observability stack**
Start with Sentry free + Axiom free (recommended), or set up Grafana Cloud self-hosted from day one (more control, 1–2 days setup, overkill at MVP)?

---

## Summary of What Is Potentially Wrong in the Current Stack

Directness requested:

1. **Clerk at SaaS scale is expensive** (~$5K–$7K/mo at 310K MAU). It is not wrong for MVP. It is wrong if you expect to be at SaaS scale within 2 years and don't want to pay that bill. The window to switch cheaply is before Phase 1, not after.

2. **Twilio WhatsApp is the biggest cost driver** at every tier beyond early adopters. The notification abstraction (channel = parameter) was designed correctly — it makes switching providers a 2–3 day change. Use that investment. Plan the switch to 360dialog before Phase 3 production activation.

3. **File storage is not yet decided** — this is a gap. It should be on the Phase 1 external dependencies roster. R2 is the right default; the absence of a decision risks defaulting to S3 by inertia.

4. **`openapi-typescript-codegen` is unmaintained** — minor but real. 1-day fix in Phase 0/1.

Everything else (Postgres, Knex, BullMQ, Redis, Resend, Vercel, Next.js, Express) is fine through MVP and early-adopter tiers. None of it needs to change before you have real users and real data.

---

*Document owner: Architect. Last compiled: 2026-05-03. Pricing as of early 2026 — verify current rates at vendor pricing pages before acting on these numbers.*
