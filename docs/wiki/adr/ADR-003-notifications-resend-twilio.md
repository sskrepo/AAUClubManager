---
title: ADR-003 — Notifications: Resend (email) + Twilio WhatsApp Business API
status: accepted
created: 2026-05-03
decided: 2026-05-03
owner: architect
deciders: user, architect
supersedes: ~
tags: [arch, notifications, integrations]
---

# ADR-003 — Notifications: Resend (email) + Twilio WhatsApp Business API

## Context

Notifications are a first-class feature, not a nice-to-have. The primary use
cases — practice schedule changes, absence confirmation, payment reminders,
selection results, tournament callouts — are the mechanism by which the app
delivers value to coaches and parents.

Requirements:
- **Day-1 email and WhatsApp delivery.** Both channels are needed from Phase 1
  (selection result notifications). Phase 3 is notification-heavy (practice
  comms, polls, attendance).
- **70/30 mix skewing WhatsApp.** AAU coaches and parents are already on
  WhatsApp. Email is the fallback and the channel for formal receipts/records.
- **Channel is a parameter, not a hard dependency.** The notification service
  must be abstracted so the provider behind each channel can be swapped without
  touching the callsite. This is a day-1 requirement, not a future refactor.
- **WhatsApp requires Meta Business verification.** Approval takes 1–3 weeks.
  This is the single longest-lead external dependency across all phases.

## Decision

- **Email:** Resend (`resend.com`)
- **WhatsApp:** Twilio WhatsApp Business API (Meta BSP) for Phase 0–2
  development and Phase 1–2 production
- **Future swap (pre-committed):** Twilio → 360dialog before Phase 3 production
  go-live (see "Future-phase commitment" below)

**Notification service abstraction (mandatory from Phase 0):**

```
server/src/services/notification/
  index.ts          # send(channel, recipient, template, payload) → void
  channels/
    email.ts        # Resend client
    whatsapp.ts     # WhatsApp provider client (initially Twilio; swappable)
  templates/        # Per-notification template definitions
```

The `send()` function takes `channel` as a parameter. Callers (job workers,
service layer) never import Resend or Twilio directly. Swapping the WhatsApp
provider means updating `whatsapp.ts` only — no callsite changes.

**BullMQ integration:** All notification sends are enqueued as BullMQ jobs
(see ADR-004). No notification is sent inline in a request handler. This
ensures retries, backoff, and dead-letter handling from day one.

## Rationale

**Resend (email):**
- Clean REST API, excellent deliverability, React Email template support
- Free tier covers ~3,000 emails/month (sufficient through early-adopter tier)
- $80–$120/mo at PMF (75K emails/month) — acceptable through SaaS scale
- No operational complexity (no SMTP to manage)

**Twilio WhatsApp for MVP:**
- Twilio's sandbox tier is available immediately, with no Meta approval needed
  for development and testing. This unblocks Phase 0 and Phase 1 dev work.
- Twilio has the best documentation of any WhatsApp BSP, lowest friction for
  initial integration, and a mature Node.js SDK.
- The sandbox → production promotion is well-documented and does not require
  code changes.

**WhatsApp provider abstraction (the critical design decision):**
The abstraction is not optional. DECISION-002-B committed to a provider swap
(Twilio → 360dialog) before Phase 3. If the notification service is not
abstracted from Phase 0, that swap becomes a large refactor across all
notification callsites instead of a 2–3 day change in one file.

## Future-Phase Commitment: Twilio → 360dialog (before Phase 3 production)

DECISION-002-B formally decided this swap. It is documented here so the
decision is part of the permanent architecture record.

**Why 360dialog:**
- ~40–50% cheaper than Twilio for the same Meta WhatsApp Business API volume
- At PMF (84K conversations/month): ~$1,680–$2,100/mo vs. Twilio's ~$3,360/mo
- Same underlying Meta API; the notification abstraction makes the swap ~2–3
  days backend work

**Why not 360dialog from day one:**
- Twilio's sandbox is immediately available with no Meta approval required.
  Starting on 360dialog requires Meta Business verification first (~1–3 weeks),
  which delays Phase 0 dev work with no practical benefit.
- Phase 1 and Phase 2 production notification volume is small (1 club). Twilio
  pricing is not a material cost at that scale.
- Using Twilio for dev/test, then 360dialog for Phase 3 production, gives the
  cleanest separation of concerns.

**Execution:** Before Phase 3 provisioning begins, the user must set up a
360dialog account and complete Meta Business verification. Architect will
update `whatsapp.ts` and environment variable references at that time.

## Consequences

**Positive:**
- Resend free tier + Twilio sandbox = $0 cost through Phase 2 development
- Notification abstraction means the Phase 3 provider swap costs 2–3 days,
  not weeks
- BullMQ retry/backoff gives reliable delivery without custom retry logic in
  the notification service
- Resend delivers structured webhook events (delivery, bounce, open) — Phase 3
  read-receipt tracking is enabled without additional integration work

**Negative / tradeoffs:**
- Twilio WhatsApp at scale (PMF) is the largest cost driver in the stack:
  ~$3,360/mo at 84K conversations. This is why the 360dialog swap is
  pre-committed — to capture the ~$1,200–$1,700/month savings before PMF load.
- Meta Business verification for WhatsApp (required for production on any BSP)
  takes 1–3 weeks. This must START in Phase 0 even though it is not needed
  until Phase 3. Missing this lead time delays Phase 3.
- WhatsApp conversation-window pricing (Meta charges per 24-hour window, not
  per message) means burst notification patterns can be expensive. Rate limiting
  and message batching (grouping messages within a conversation window) must be
  designed in Phase 3.
- Resend is a newer provider — less track record than SendGrid or SES. Fallback
  plan: SES (same 1–2 day migration cost as switching WhatsApp) if deliverability
  issues emerge.

**Reversibility:** High (by design). The notification abstraction makes
provider swaps low-cost. The channel abstraction means adding SMS or push as
a future channel is additive, not structural.

## Alternatives Considered

- **SendGrid (email)** — Mature, proven; similar pricing to Resend. Rejected
  in favor of Resend's cleaner API and React Email integration.
- **AWS SES (email)** — 10× cheaper than Resend at PMF scale. Rejected for MVP
  due to operational overhead (bounce/complaint webhooks, suppression list
  management). Revisit at SaaS scale when email spend exceeds $100/mo.
- **WATI (WhatsApp)** — Mid-tier BSP; ~$2,500/mo at PMF. Better UI than
  360dialog but more expensive. No advantage over 360dialog for our use case.
- **Vonage/MessageBird (WhatsApp)** — Comparable pricing to Twilio; no material
  advantage for our use case. Not evaluated deeply.
- **Meta direct BSP access** — Cheapest possible rate (no BSP markup). Requires
  direct Meta approval reserved for high-volume players; significantly higher
  setup complexity. Not viable at MVP/PMF scale.

## References

- `docs/wiki/cost-analysis.md` — Decision 2: full WhatsApp provider cost curve
  and alternatives matrix
- `pmo/decisions/DECISION-002-cost-optimization-priorities.md` — Decision B
  (swap to 360dialog before Phase 3) and Decision D (Resend keep through PMF)
- `docs/wiki/architecture-options.md` — Twilio WhatsApp lead time as critical
  path item; Phase 3 notification volume risk
- `pmo/phase-briefs/PHASE-0-kickoff.md` — Twilio WhatsApp Business approval
  as longest-lead external dependency (start in Phase 0)
- ADR-004 — BullMQ + Redis (notification jobs are BullMQ workers)
