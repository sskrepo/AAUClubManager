---
title: Phase 1 — Pending User Items
phase: 1
owner: tpm
updated: 2026-05-04 by tpm
status: active
tags: [pending, user, phase:1]
---

# Phase 1 — Pending User Items

**Phase status:** 🟡 Active. Phase 0 closed 2026-05-04. Gate 1 (PDD + mocks) awaiting PM + UX deliverables.
**Open count:** 🚨 2 blocking · 🟡 5 mid-phase · 📝 3 open product questions · ✅ 0 done

Full setup instructions: [PHASE-1-kickoff.md](../phase-briefs/PHASE-1-kickoff.md)

---

## 🚨 Blocking — deliver to unblock active work

These block Gate 1 (UX mocks) and/or Phase 1 implementation. Start within 24 hours.

| # | Item | Why it matters | How to deliver | Instructions |
|---|------|----------------|---------------|-------------|
| 1 | **OCI Object Storage credentials** | Architect needs these to validate the Node.js SDK approach (`oci-sdk` vs S3-compat AWS SDK) during Phase 1 prep. File storage ships in Phase 1 (jersey/player photos). Without validation, the Architect cannot finalize the integration ADR. | Set env vars in `.env.local` and notify in chat | Deliver: `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY` (or path to PEM), `OCI_REGION`, `OCI_BUCKET_NAME`, `OCI_NAMESPACE`. See [PHASE-1-kickoff.md](../phase-briefs/PHASE-1-kickoff.md) for step-by-step OCI account setup. |
| 2 | **Brand identity answers** (color, logo, app name, app header) | UX needs these to finalize Phase 1 mocks at Gate 1. Without answers, mocks will use Club Blue `#3b82f6` placeholder and "AAUClubManager" wordmark — Gate 1 approval may be delayed if you want changes. | Reply in chat with choices | (a) Primary color — hex code or direction, e.g., "navy", "orange". Placeholder: `#3b82f6`. (b) Logo — SVG file if you have one; else confirm "wordmark only." (c) App name — final brand name or confirm "AAUClubManager." (d) App header — show generic "AAU Club Manager" or per-tenant club name after login? This affects multi-tenant layout from Phase 1 onward. |

---

## 🟡 Mid-phase — needed before Phase 1 exits, not urgent today

| # | Item | Why it matters | Notes |
|---|------|----------------|-------|
| 3 | **Resend DNS verification** — `myhoopclub.com` | Carryover from Phase 0. SPF/DKIM/DMARC records for `myhoopclub.com` in Resend dashboard. Needed before `RESEND_FROM_EMAIL` can be set and email delivery works in staging. DNS propagation ~1 hour after adding records. | Resend dashboard → Domains → myhoopclub.com. Once verified, set `RESEND_FROM_EMAIL=noreply@myhoopclub.com` and notify the team. |
| 4 | **Postgres hosting** → `DATABASE_URL` | Phase 1 deploy requires a real DB. Local Docker Postgres is fine during dev. Needed before first cloud deploy. | Recommend Neon (free tier + branching) or Railway. Deliver `DATABASE_URL=postgres://...` for dev/staging/prod separately. |
| 5 | **Redis hosting** → `REDIS_URL` | BullMQ queues (notifications, reminders) need Redis. Local Docker Redis fine for dev. Needed before cloud deploy. | Recommend Upstash (pay-per-request, zero cost at low volume). Deliver `REDIS_URL=redis://...`. |
| 6 | **Hosting platform decision** | Phase 1 deploys real user-visible features. CI/CD config depends on platform choice. | Option A: Vercel (web) + Railway or Render (server). Option B: unified platform. Choose and notify — agents configure deploy scripts accordingly. |
| 7 | **Clerk webhook secret** | Data model (`docs/wiki/data-model.md`) relies on Clerk webhooks to sync User and Club records when a Clerk Organization is created or updated. Phase 1 implements this sync. | In Clerk dashboard → Webhooks → Add endpoint: `https://yourdomain.com/api/webhooks/clerk`. Subscribe to: `organization.created`, `organization.updated`, `user.created`, `user.updated`. Copy the signing secret. Deliver `CLERK_WEBHOOK_SECRET=whsec_...` in `.env.local`. |

---

## 📝 Open product questions — non-blocking, answer when ready

These don't block immediate work but should be answered before Gate 1 UX review.

| # | Question | Default if no answer |
|---|----------|---------------------|
| 1 | **Primary brand color** — hex code or direction | Club Blue `#3b82f6` (UX placeholder) |
| 2 | **Logo + final app name** — SVG logo? Is "AAUClubManager" the final brand name? | "AAUClubManager" wordmark; no logo asset |
| 3 | **App header display** — generic "AAU Club Manager" or per-tenant club name after login? | TBD; will affect Phase 1 layout spec — UX will flag at Gate 1 if still open |

(These are also listed in 🚨 item #2 above because they gate UX mocks. Separated here for those who answer questions asynchronously vs. blocking items urgently.)

---

## 🔮 Future-phase pre-knowns — don't act yet, just heads-up

| Phase | Item | When to start |
|-------|------|--------------|
| Phase 3 | **360dialog production tier** — Meta Business verification + custom template approvals | Start in Phase 1–2. Templates take 1–3 days each, run in parallel. See [PHASE-3.md](PHASE-3.md). |
| Phase 3 | **WhatsApp template list finalization** (PM/Architect to confirm list) | Phase 1–2 design; submit templates as soon as list is confirmed |
| Phase 1 exit | **Observability stack decision** — Architect files DECISION-NNN comparing Sentry+Axiom vs Datadog vs self-hosted Loki/Grafana | At Phase 1 exit per DECISION-002-D |

---

## ✅ Done

| When | Item | Notes |
|------|------|-------|
| 2026-05-03 | **DECISION-001** — MVP scope: Option B (Full Season Operations) | Phases 1-5 locked |
| 2026-05-03 | **DECISION-002** — all sub-decisions | Keep Clerk · 360dialog from MVP · OCI storage · Defer observability |
| 2026-05-03 | **GATE-1-PHASE-0** — PDD + mocks stub + design system seed | Approved |
| 2026-05-03 | **GATE-2-PHASE-0** — OpenAPI baseline + ADR-005 + api-changes | Approved |
| 2026-05-03 | **GitHub repo** | https://github.com/sskrepo/AAUClubManager — both branches pushed |
| 2026-05-03 | **Clerk account + API keys** | Test keys stashed in `.env.local`. Unblocked auth scaffold. |
| 2026-05-03 | **Dev/UAT domain + email forwarding** | `myhoopclub.com` registered; Cloudflare Email Routing active. Prod brand domain still TBD (Phase 1 exit task). |
| 2026-05-03 | **Resend API key** | API key stashed in `.env.local`. DNS verification sub-step still pending (moved to 🟡 above). |
| 2026-05-04 | **360dialog sandbox API key** | Sandbox key stashed in `.env.local`. Production tier is Phase 3 prereq. |

---

## How to mark items done

When you deliver one of these:

**Option A — tell the active agent in chat:**
> "OCI credentials delivered: TENANCY_OCID=ocid1..., ..."

The agent will move the row from 🚨/🟡/📝 → ✅ Done with today's date, update [dashboard.md](../dashboard.md), and proceed with unblocked work.

**Option B — edit this file directly:**
- Cut the row from its current section
- Paste into ✅ Done with today's date
- Mention in next chat so TPM reconciles trackers

---

**See also:**
- [PHASE-1-kickoff.md](../phase-briefs/PHASE-1-kickoff.md) — full setup instructions with step-by-step how-tos
- [Phase 0 retrospective](../../docs/wiki/phase-0-retrospective.md)
- [dashboard.md](../dashboard.md) — live program view
- [phases.md](../phases.md) — Phase 1 scope and exit criteria
