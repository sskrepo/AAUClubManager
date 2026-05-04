---
title: Phase 0 — Pending User Items
phase: 0
owner: tpm
updated: 2026-05-03 by orchestrator
status: active
tags: [pending, user, phase:0]
---

# Phase 0 — Pending User Items

**Phase status:** 🟡 In execution. Gate 1 + Gate 2 approved. DECISION-002 closed. Implementation underway.
**Open count:** 🚨 2 blocking · 🟡 3 mid-phase · 📝 3 open product questions · ✅ 7 done
**What's gated:** Notification delivery test, deploy. (Auth thread now unblocked — Clerk keys delivered.)

Canonical setup checklist with full how-to instructions: [PHASE-0-kickoff.md](../phase-briefs/PHASE-0-kickoff.md).

---

## 🚨 Blocking — deliver to unblock active work

| # | Item | Why it matters | Where to get it | Env vars / inputs |
|---|------|----------------|-----------------|-------------------|
| 1 | **360dialog account + API key** | WhatsApp delivery; long-pole external dep. Meta Business verification 1–7 days. **Start ASAP.** | [hub.360dialog.com](https://hub.360dialog.com) → register → Meta Business verify → API key | `DIALOG360_API_KEY`, `DIALOG360_WHATSAPP_FROM` (E.164 format), WhatsApp Business display name |
| 2 | **Resend account + verified sender domain** | Email delivery test. DNS verification a few hours. | [resend.com](https://resend.com) → add domain → set DNS records | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |

---

## 🟡 Mid-phase — needed before Phase 0 exits, not urgent today

| # | Item | Why it matters | Notes |
|---|------|----------------|-------|
| 4 | **Postgres hosting** | Production DB for `server/`. Local Docker Postgres fine until Phase 0 deploy. | Recommend: Neon, Supabase, RDS, Railway, Render, or self-hosted Hetzner. See [cost-analysis.md](../../docs/wiki/cost-analysis.md) Decision 3. |
| 5 | **Redis hosting** | BullMQ + cache. Local Docker Redis fine for dev. | Recommend: Upstash (serverless billing) for MVP. See [ADR-004](../../docs/wiki/adr/ADR-004-background-jobs-bullmq-redis.md). |
| 6 | **Hosting platform decision** | Where `server/` and `web/` deploy. | Recommend: Vercel (web) + Railway/Render (server) for MVP. Open product question #5 below. |
| ~~7~~ | ~~Domain name~~ | ~~Resolved 2026-05-03 (dev/UAT only)~~ | Moved to ✅ Done. **Prod brand domain still TBD** — Phase 1 exit task. |

---

## 📝 Open product questions — non-blocking, answer when ready

These don't block Phase 0 exit but should be resolved before Phase 1 UX mocks begin.

| # | Question | Default placeholder if no answer |
|---|----------|----------------------------------|
| 1 | **Primary brand color** | Club Blue `#3b82f6` (UX seeded) |
| 2 | **Logo + final app name** | "AAUClubManager" wordmark; no logo asset |
| 3 | **App header display** — generic "AAU Club Manager" or per-tenant club name after login? | TBD; will affect Phase 1 layout spec |

(Questions 4, 5, 6 from the original list are now in 🟡 above or ✅ Done below.)

---

## 🔮 Future-phase pre-knowns — don't act yet, just heads-up

These will surface in their respective phase files when those phases activate.

| Phase | Item | When |
|-------|------|------|
| Phase 1 | OCI Object Storage tenancy + credentials (per DECISION-002-C) | Before Phase 1 implementation starts |
| Phase 3 | Meta WhatsApp template approvals (1–3 days each, can run in parallel) | Before Phase 3 production go-live |
| Phase 1 exit | Observability stack decision | At Phase 1 exit |

---

## ✅ Done

| When | Item | Notes |
|------|------|-------|
| 2026-05-03 | **DECISION-001** — MVP scope | Option B (Full Season Operations) — Phases 1-5 |
| 2026-05-03 | **DECISION-002** all sub-decisions | Keep Clerk · 360dialog from MVP · OCI storage · Defer observability |
| 2026-05-03 | **GATE-1-PHASE-0** — PDD + mocks stub + design system seed | Approved |
| 2026-05-03 | **GATE-2-PHASE-0** — OpenAPI baseline + ADR-005 + api-changes | Approved |
| 2026-05-03 | **GitHub repo URL** | https://github.com/sskrepo/AAUClubManager — both branches pushed |
| 2026-05-03 | **Clerk account + API keys** | Test keys delivered; stashed in `.env.local` (gitignored). Unblocks TASK-006, 008, 009, 010 — entire auth thread. |
| 2026-05-03 | **Dev/UAT domain + email forwarding** | `myhoopclub.com` registered; Cloudflare Email Routing forwards `admin@myhoopclub.com` → personal Gmail. Confirmed working. **Prod brand domain still open** — Phase 1 exit task to revisit (HoopCourt and RosterWise still in running per PM research). |

---

## How to mark items done

When you deliver one of these:

**Option A — tell the active agent in chat:**
> "Clerk keys delivered: PUBLISHABLE_KEY=pk_test_..., SECRET_KEY=sk_test_..."

The agent will move the row from 🚨 → ✅ Done, update [dashboard.md](../dashboard.md), and proceed with the unblocked work.

**Option B — edit this file directly:**
- Cut the row from its current section
- Paste it into ✅ Done with today's date
- Mention in next chat so TPM reconciles trackers

---

**See also:**
- [PHASE-0-kickoff.md](../phase-briefs/PHASE-0-kickoff.md) — full setup instructions per item
- [PHASE-0-tasks.md](../phase-briefs/PHASE-0-tasks.md) — engineering task list (what each blocker unblocks)
- [dashboard.md](../dashboard.md) — live program view
