---
title: ADR-004 — Background Jobs: BullMQ + Redis
status: accepted
created: 2026-05-03
decided: 2026-05-03
owner: architect
deciders: user, architect
supersedes: ~
tags: [arch, jobs, infrastructure]
---

# ADR-004 — Background Jobs: BullMQ + Redis

## Context

Several core workflows cannot run synchronously in a request handler:

- **Notification dispatch** (Phase 1+): Selection result emails/WhatsApp,
  practice schedule change alerts, payment due reminders. Network calls to
  Resend/Twilio must not block the HTTP response.
- **Scheduled reminders** (Phase 5): Payment dunning jobs run on a cron
  schedule — evaluate overdue installments, enqueue per-parent reminder jobs.
  These fire independently of any HTTP request.
- **Practice-time polling results** (Phase 3): Aggregate poll responses,
  pre-populate attendance records. Triggered by a scheduled job T-1h before
  practice.
- **Future: AI audio pipeline** (Phase 6, deferred): transcribe audio →
  extract notes → assign drills. An inherently async, multi-step pipeline.

Requirements for the job system:
- Delayed jobs (send practice reminder 2h before start time)
- Repeatable/cron jobs (payment dunning daily at 08:00)
- Priority queues (payment receipt > general reminder)
- Retry with exponential backoff (Resend/Twilio transient failures)
- Dead-letter queue (inspect failed jobs without losing them)
- TypeScript-native API

The queue infrastructure must be installed in Phase 0 even though no jobs run
until Phase 1. Adding it later requires re-wiring the notification service and
all callsites. The architecture-options.md analysis flags this as a Phase 0
sequencing constraint.

## Decision

Use **BullMQ** on **managed Redis** for all background job processing.

- BullMQ is the job queue library (Node.js / TypeScript)
- Redis is the backing store for job state
- **Hosted Redis:** Upstash (serverless Redis) for MVP and early-adopter tiers
- Workers run as separate processes from the API server (`server/src/workers/`)
- At MVP, worker and API server may share a host; at PMF they are separate
  services

**Worker directory structure:**
```
server/src/workers/
  index.ts              # starts all workers
  notification.worker.ts
  reminder.worker.ts    # Phase 5 (scheduled dunning)
  # future: transcription.worker.ts (Phase 6)
```

**Queue names follow the pattern:** `notification`, `reminder`, `export`

**Retry policy (default):** 3 attempts, exponential backoff starting at 5s.
Dead-letter queue per topic (BullMQ `failedQueue`). Alerts on dead-letter
accumulation are part of the Phase 1 observability setup.

## Rationale

- **BullMQ is TypeScript-native and best-in-class.** Delayed jobs, repeatable
  jobs, job priorities, concurrency control, and dead-letter handling all ship
  out of the box. No workarounds needed for any Phase 0–5 use case.
- **Redis is the right backing store for this workload.** Job state is
  ephemeral and high-write; Redis's in-memory speed is appropriate. Persistence
  is via Redis RDB/AOF — sufficient for job durability.
- **Upstash fits the load profile.** Notification bursts (all parents getting
  practice reminders before a practice) are exactly the spike-then-quiet pattern
  Upstash's serverless billing handles cheaply. At PMF, ~300K notifications/month
  through BullMQ generates ~2–3M Redis commands — ~$4–$6 on Upstash. Negligible.
- **Separation from the request handler is non-negotiable.** Inline async calls
  to Resend/Twilio in a request handler mean: no retry on provider failure,
  request timeout risk, no backpressure. BullMQ solves all three.

## Consequences

**Positive:**
- Retry, backoff, and dead-letter handling come from the library — no custom
  reliability logic
- Delayed and cron jobs cover all Phase 0–5 scheduling requirements (payment
  reminders, practice-time polls) without additional infrastructure
- Workers scale independently from the API server — can tune concurrency for
  notification bursts without affecting API latency
- TypeScript worker definitions mean job payloads are typed end-to-end

**Negative / tradeoffs:**
- Redis is an additional infrastructure component to provision and monitor.
  At MVP this is trivial (Upstash free tier); at SaaS scale it becomes a
  managed service with its own cost and ops concerns.
- BullMQ requires Redis persistence to be configured correctly — if Redis
  restarts without AOF/RDB, queued jobs are lost. Upstash handles this; self-
  hosted Redis requires explicit configuration.
- Repeatable (cron) jobs in BullMQ must be idempotent. Payment dunning jobs
  must check "was a reminder already sent today?" before sending — not just
  trust the cron schedule. This is an application-level responsibility.

**Reversibility:** Moderate. Migrating from BullMQ to an alternative queue
requires updating worker definitions and the job enqueue callsites. The
notification service abstraction (ADR-003) isolates the notification dispatch;
the job layer itself is the migration surface.

**Future-phase consideration (pg-boss):** If Redis operational costs or
complexity become material at SaaS scale, `pg-boss` (Postgres-backed queue) is
a viable swap. It supports delays, repeatable jobs, and retry. The migration
cost is ~1–2 weeks eng-time. The trigger is Redis spend exceeding ~$200/mo or
operational complexity of managing a Redis cluster. `docs/wiki/cost-analysis.md`
Decision 4 covers this tradeoff. Not recommended before SaaS scale.

## Alternatives Considered

- **pg-boss (Postgres-backed queue)** — Eliminates Redis as a separate service;
  runs entirely in the existing Postgres instance. Viable at any scale, lower
  ops burden. Rejected for Phase 0 because BullMQ's real-time job visibility
  and Redis's speed are preferred for the notification burst use case, and the
  Upstash Redis cost is negligible through PMF. Flagged as the recommended swap
  at SaaS scale if Redis cost/complexity warrants it.
- **AWS SQS** — Good managed queue; no Redis required. Rejected because SQS
  lacks native delayed jobs and repeatable job support (workarounds required).
  AWS lock-in is also a concern.
- **Cloudflare Queues** — Very cheap; no delayed jobs or repeatable jobs.
  Insufficient for the Phase 5 payment dunning and Phase 3 practice-time
  scheduling use cases.
- **In-process async (setImmediate / setTimeout)** — No retry, no persistence,
  no dead-letter. Rejected categorically — any crash loses queued work.

## References

- `docs/wiki/cost-analysis.md` — Decision 4: Redis provider cost curve and
  pg-boss comparison; Decision 7: BullMQ worker compute cost at each tier
- `docs/wiki/architecture-options.md` — BullMQ infrastructure as Phase 0
  sequencing constraint; Phase 3 notification volume risk
- ADR-003 — Notifications (all notification sends are BullMQ jobs)
- `pmo/phase-briefs/PHASE-0-kickoff.md` — Redis (Upstash) provisioning as
  Phase 0 external dependency
