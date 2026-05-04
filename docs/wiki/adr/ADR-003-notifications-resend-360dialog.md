---
title: ADR-003 — Notifications: Resend (email) + 360dialog WhatsApp Business API
status: accepted
created: 2026-05-03
decided: 2026-05-03
owner: architect
deciders: user, architect
supersedes: ~
tags: [arch, notifications, integrations]
---

# ADR-003 — Notifications: Resend (email) + 360dialog WhatsApp Business API

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
- **WhatsApp requires Meta Business verification.** Approval takes 1–7 days
  with 360dialog (faster than Twilio's typical 1–3 weeks). This is the single
  longest-lead external dependency across all phases and must START in Phase 0.

## Decision

- **Email:** Resend (`resend.com`)
- **WhatsApp:** 360dialog WhatsApp Business API (Meta BSP) from MVP onward
  (Phase 0 development through all production phases)

Twilio is not used in this project. 360dialog is used from day one — there is
no planned provider migration.

**Notification service abstraction (mandatory from Phase 0):**

```
server/src/services/notification/
  index.ts          # send(channel, recipient, template, payload) → void
  channels/
    email.ts        # Resend client
    whatsapp.ts     # WhatsApp provider client (360dialog; swappable via IWhatsAppProvider)
  templates/        # Per-notification template definitions
```

The `send()` function takes `channel` as a parameter. Callers (job workers,
service layer) never import Resend or 360dialog directly. Swapping the WhatsApp
provider means updating `whatsapp.ts` only — no callsite changes.

The concrete implementation is `Dialog360WhatsAppProvider`, which implements
the `IWhatsAppProvider` interface. Future providers (if 360dialog ever
disappoints) implement the same interface — no callsite or service-layer
changes required.

**BullMQ integration:** All notification sends are enqueued as BullMQ jobs
(see ADR-004). No notification is sent inline in a request handler. This
ensures retries, backoff, and dead-letter handling from day one.

## Rationale

**Resend (email):**
- Clean REST API, excellent deliverability, React Email template support
- Free tier covers ~3,000 emails/month (sufficient through early-adopter tier)
- $80–$120/mo at PMF (75K emails/month) — acceptable through SaaS scale
- No operational complexity (no SMTP to manage)

**360dialog WhatsApp from MVP:**
- 360dialog is consistently 40–50% cheaper than Twilio for the same Meta
  WhatsApp Business API volume. At PMF (84K conversations/month): approximately
  $1,680–$2,100/mo vs. Twilio's ~$3,360/mo.
- 360dialog onboarding is typically 1–7 days (account creation + Meta Business
  verification) vs. Twilio's 1–3 weeks. Starting on 360dialog directly avoids
  a mid-build provider migration.
- Same underlying Meta API as all other BSPs. The WhatsApp Business API surface
  is identical regardless of which BSP routes the traffic.
- Choosing 360dialog from MVP captures cost savings at every scale tier —
  savings are not "potential" but realized from the first production message.

**WhatsApp provider abstraction (the critical design decision):**
The abstraction is not optional. `notification.service.ts` depends on the
`IWhatsAppProvider` interface, not on `Dialog360WhatsAppProvider` directly.
If 360dialog performance or pricing ever deteriorates, the migration to any
other BSP is a 2–3 day backend change confined to `providers/whatsapp.ts`.
No callsite changes, no job handler changes, no API contract changes.

## Consequences

**Positive:**
- 360dialog pricing savings are realized from MVP onward — not deferred to
  Phase 3. At PMF: approximately $1,200–$1,700/month less than Twilio.
- No mid-build provider migration. One less operational transition to plan,
  test, and execute.
- Notification abstraction means any future provider swap costs 2–3 days,
  not weeks. The abstraction is durable regardless of BSP choice.
- BullMQ retry/backoff gives reliable delivery without custom retry logic in
  the notification service.
- Resend delivers structured webhook events (delivery, bounce, open) — Phase 3
  read-receipt tracking is enabled without additional integration work.
- 360dialog's faster onboarding (1–7 days typical) means WhatsApp Business
  approval may not be the longest-lead Phase 0 dependency — Clerk setup may
  be the gating item, not WhatsApp.

**Negative / tradeoffs:**
- 360dialog has less documentation and a smaller support organization than
  Twilio. Node.js SDK options are more limited (REST API calls vs. a mature
  official SDK). The implementation in `providers/whatsapp.ts` will use the
  360dialog REST API directly or a thin community wrapper.
- Meta Business verification is still required for WhatsApp production access,
  regardless of BSP. Lead time: 1–7 days typical with 360dialog. Must START
  in Phase 0.
- WhatsApp conversation-window pricing (Meta charges per 24-hour window, not
  per message) means burst notification patterns can be expensive on any BSP.
  Rate limiting and message batching (grouping messages within a conversation
  window) must be designed in Phase 3.
- Resend is a newer provider — less track record than SendGrid or SES. Fallback
  plan: SES (same 1–2 day migration cost) if deliverability issues emerge.

**Reversibility:** High (by design). The `IWhatsAppProvider` abstraction makes
provider swaps low-cost. The channel abstraction means adding SMS or push as
a future channel is additive, not structural.

## Alternatives Considered

- **Twilio WhatsApp** — Viable, excellent documentation, mature Node.js SDK,
  immediate sandbox access (no Meta approval required for dev/test). Rejected
  because: ~40–50% more expensive than 360dialog at every production tier;
  choosing Twilio for MVP would require a planned provider migration (Twilio →
  360dialog) before Phase 3, adding mid-build operational risk and 2–3 days
  eng-time that can be avoided by starting on 360dialog directly. The sandbox
  advantage (no approval needed for dev) does not outweigh the PMF cost delta
  when Meta Business verification with 360dialog takes only 1–7 days.
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
  and alternatives matrix (updated to reflect 360dialog from MVP)
- `pmo/decisions/DECISION-002-cost-optimization-priorities.md` — Decision B
  (amended 2026-05-03: use 360dialog from MVP; Twilio removed from stack)
- `pmo/phase-briefs/PHASE-0-kickoff.md` — 360dialog account + WhatsApp Business
  API setup as the longest-lead external dependency (start in Phase 0)
- ADR-004 — BullMQ + Redis (notification jobs are BullMQ workers)

---

## Revision history

- **2026-05-03 (initial filing):** Chose Twilio WhatsApp Business API for
  Phase 0–2 development and Phase 1–2 production, with a pre-committed swap to
  360dialog before Phase 3 production go-live (DECISION-002-B).
- **2026-05-03 (same-day revision):** User directed to use 360dialog from MVP,
  eliminating Twilio from the stack entirely. No code had been built against
  the initial filing. The Twilio-first rationale (sandbox with no Meta approval
  needed, unblocking Phase 0 dev) was outweighed by the user's preference to
  avoid any planned mid-build migration. The architectural abstraction
  (`IWhatsAppProvider`) is unchanged — only the default implementation changes
  from `TwilioWhatsAppProvider` to `Dialog360WhatsAppProvider`.
