---
title: PHASE 0 — Foundation — Kickoff Brief
phase: 0
status: awaiting-external-setup
filed: 2026-05-03
owner: tpm
contributors: [architect, pm]
tags: [phase:0, kickoff]
---

# PHASE 0 — Foundation — Kickoff Brief

## 📋 Phase summary

Stand up the project: tech stack, scaffolding, auth, design system, base data model, queue infrastructure, notification service abstraction, CI. Nothing user-visible ships in Phase 0 — it's the platform every later phase builds on.

Full phase scope: [`pmo/phases.md`](../phases.md) → Phase 0.
Engineering details: [`docs/wiki/architecture-options.md`](../../docs/wiki/architecture-options.md) → "Phase 0 — Foundation" section.

---

## 🔴 EXTERNAL DEPENDENCIES — ONLY YOU CAN DO THESE

These cannot be done by agents. **Start as soon as possible** — long-lead items gate later phases.

### 🚨 Critical path — start within 24 hours

#### 1. 360dialog account + WhatsApp Business API setup

- [ ] **What:** Create a 360dialog account, complete Meta Business verification, and obtain a WhatsApp Business API key
- **Why:** Phase 3 (Practice Communications) depends on WhatsApp delivery. Phase 1 selection notifications also use WhatsApp. **If you don't start this now, you'll be blocked.** 360dialog is used from MVP — Twilio is not in this stack.
- **Lead time:** **1–7 days** (360dialog account creation is same-day; Meta Business verification typically 1–5 business days, faster than Twilio's typical 1–3 weeks). This is one reason 360dialog was chosen over Twilio — faster onboarding.
- **Note on lead time:** The 1–7 day figure is based on 360dialog's documentation and general BSP experience. Actual Meta verification timing can vary. If your business is not yet verified with Meta, budget the full 7 days. Flag to the team if it takes longer — Clerk and Resend setup may now be the longest poles instead of WhatsApp.
- **Your time investment:** ~1–2 hours initial setup + occasional checks during approval
- **How (step-by-step):**
  1. Go to https://www.360dialog.com and create an account
  2. Choose the **WhatsApp Business API** plan (not the WATI-branded product)
  3. You'll need a **Meta Business Manager** account: https://business.facebook.com/. Create one if you don't have one, and verify your business with Meta (legal name, address, phone number)
  4. In the 360dialog dashboard: connect your Meta Business Manager account
  5. Add a WhatsApp Business phone number (can be a new number or one you migrate from another BSP — you cannot use a number already registered on personal WhatsApp without migrating it)
  6. Complete Meta's phone number verification (OTP to the registered number)
  7. Submit WhatsApp message templates for approval (e.g., "Hi {{1}}, your child {{2}} has been selected for {{3}}. Reply YES to confirm."). Templates must be approved by Meta before use. Submit during Phase 0 — they may take 1–3 days to review.
  8. Note your API key from the 360dialog dashboard
- **Where:** https://hub.360dialog.com (360dialog client hub after account creation)
- **Done when:** You can make a test API call to the 360dialog REST endpoint and receive a WhatsApp message on your own phone. At least one message template is approved.
- **Deliver to agents:** Set these in `.env`:
  - `DIALOG360_API_KEY=...` (your 360dialog API key)
  - `DIALOG360_WHATSAPP_FROM=+1...` (the registered WhatsApp sender phone number, E.164 format)

> **Correction (2026-05-04):** An earlier version of this brief said "no sandbox equivalent" — that was incorrect. 360dialog **does** offer a sandbox tier ([docs](https://docs.360dialog.com/docs/get-started/sandbox)).
>
> **Sandbox:** Send `START` (uppercase) via WhatsApp to `+551146733492` to receive a sandbox API key. Base URL: `https://waba-sandbox.360dialog.io/v1`. Auth header: `D360-API-KEY`. Free. Limits: 200-message cap, can only message your own WhatsApp number, 3 predefined templates only (no custom), no media support. **Sufficient for Phase 0 dev/test.** The `IWhatsAppProvider` abstraction is base-URL-driven so the same code targets sandbox in dev and production at Phase 3 production go-live — env vars (`DIALOG360_API_KEY`, `DIALOG360_BASE_URL`) flip per environment.
>
> Production tier (Meta Business verification + custom templates) is **not required for Phase 0**. It becomes a Phase 3 prerequisite. Start the production hub setup now since Meta verification has 1–7 day lead time, but Phase 0 implementation does not block on it.

> **Template approval timing:** Submit message templates as soon as your 360dialog account is active — don't wait until Phase 3. Template approval is separate from account verification and can take 1–3 days per template. Phase 3 will need at minimum: practice schedule change, absence confirmation, payment reminder.

#### 2. Clerk account + organization setup

- [ ] **What:** Create Clerk account, create a Clerk application for AAUClubManager, configure org-as-tenant model
- **Why:** Phase 0 auth scaffold can't be built without this; **all of Phase 1+ depends on it**
- **Lead time:** Same-day (no approval process)
- **Your time investment:** ~30-45 minutes
- **How (step-by-step):**
  1. Go to https://clerk.com and sign up
  2. Create a new application: name it "AAUClubManager" or similar
  3. Choose authentication methods: **Email + Google** (recommended; you can add more later)
  4. **Enable Organizations** in your Clerk dashboard → Settings → Organizations (toggle on)
  5. Configure roles: **head_coach**, **assistant_coach**, **parent**, **player** (Custom Roles in Clerk)
  6. Get your API keys from API Keys page
- **Where:** https://dashboard.clerk.com/
- **Done when:** You have publishable and secret keys for both dev and production environments
- **Deliver to agents:** Set in `.env`:
  - `CLERK_PUBLISHABLE_KEY=pk_test_...`
  - `CLERK_SECRET_KEY=sk_test_...`
  - (separate keys for prod when ready)

#### 3. Resend account + sender domain verification

- [ ] **What:** Create Resend account, verify a domain you own to send emails from
- **Why:** Phase 1 selection notifications need email; without domain verification, emails land in spam or are blocked
- **Lead time:** Account: minutes. Domain verification: hours (DNS propagation)
- **Your time investment:** ~30 minutes (depends on your DNS provider's UX)
- **How:**
  1. Go to https://resend.com and sign up
  2. Add a domain you own (e.g., `aauclubmanager.com` or a subdomain like `mail.yourclub.com`)
  3. Resend will give you DNS records to add: SPF, DKIM, optionally DMARC
  4. Add those TXT/CNAME records in your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.)
  5. Wait for verification (usually <1 hour, can be up to 48h)
  6. Get your API key
- **Where:** https://resend.com/domains
- **Done when:** Domain shows "Verified" in Resend dashboard; test send goes through
- **Deliver to agents:**
  - `RESEND_API_KEY=re_...`
  - `RESEND_FROM_EMAIL=noreply@yourdomain.com`

> ⚠️ **If you don't own a domain yet:** Buy one ($10-15/year — Cloudflare or Namecheap are cheap and easy). Domain ownership is required for production email deliverability. For dev/testing, Resend allows sending to your own email without verification.

#### 4. Domain name (if you don't have one)

- [ ] **What:** Buy a domain for AAUClubManager
- **Why:** Needed for Resend (above), for your hosted app, for branded emails
- **Lead time:** Minutes (purchase) + hours (DNS propagation)
- **Your time investment:** ~15 minutes
- **How:**
  1. Pick a registrar — Cloudflare ($9-10/yr), Namecheap, Porkbun
  2. Search for your preferred domain
  3. Purchase
  4. (Recommended) Use Cloudflare DNS — free, fast, easy
- **Done when:** You can configure DNS records on the domain
- **Deliver to agents:** Just need to know the domain name; agents will reference it in env

---

### 🟡 Mid-phase — start within 1-2 weeks

#### 5. PostgreSQL hosting (production)

- [ ] **What:** Provision a managed Postgres instance for production
- **Why:** Need a real DB before deploying; dev can use Docker locally
- **Lead time:** Minutes
- **Your time investment:** ~20 minutes
- **Recommended providers:**
  - **Neon** (https://neon.tech) — generous free tier, branching for staging — RECOMMENDED
  - **Supabase** (https://supabase.com) — free tier, includes auth/storage if Clerk doesn't fit
  - **Railway** (https://railway.app) — combines Postgres + Redis + hosting in one place
- **Done when:** You have a connection string
- **Deliver to agents:** `DATABASE_URL=postgres://...` (separate for dev / staging / prod)

#### 6. Redis hosting (production)

- [ ] **What:** Provision a managed Redis instance for BullMQ
- **Why:** Background jobs (notifications, scheduled reminders) need Redis from Phase 0
- **Lead time:** Minutes
- **Your time investment:** ~15 minutes
- **Recommended providers:**
  - **Upstash** (https://upstash.com) — pay-per-request, perfect for low-traffic — RECOMMENDED
  - **Railway** (if you used Railway for Postgres)
- **Done when:** You have a connection string
- **Deliver to agents:** `REDIS_URL=redis://...`

> 💡 For local dev, agents will use `docker run redis` — no external setup needed for development. Production setup is what's needed by Phase 1's deploy.

#### 7. Hosting platform

- [ ] **What:** Decide where to deploy the Next.js frontend + Express backend
- **Why:** Need to deploy something to test Phase 1 with real users
- **Lead time:** Minutes (account creation)
- **Your time investment:** ~30 minutes account + first deploy
- **Recommended:**
  - **Vercel** (https://vercel.com) for Next.js frontend (free for hobby)
  - **Railway** or **Render** for Express backend (~$5-10/month) — or also Vercel via serverless functions
- **Done when:** You have account + project created and connected to your GitHub repo
- **Deliver to agents:** Confirm choice so they configure deploy scripts accordingly

#### 8. GitHub repo

- [ ] **What:** Create a GitHub repository (private) for `AAUClubManager`
- **Why:** Source control + CI + deployment hooks
- **Lead time:** Minutes
- **Your time investment:** ~5 minutes
- **How:**
  1. Go to https://github.com/new
  2. Create private repo: `AAUClubManager`
  3. Don't initialize with README/license (we already have those)
  4. Locally: `cd /Users/sravansunkaranam/github/AAUClubManager && git init && git remote add origin git@github.com:YOU/AAUClubManager.git`
  5. (Push happens after first commit — agents will do that)
- **Done when:** Empty repo created, you can `git push` to it
- **Deliver to agents:** Repo URL

---

### 🟢 Nice-to-have / can wait

#### 9. Production email DKIM/DMARC for deliverability

- [ ] **What:** Add DMARC policy to your domain's DNS (after Resend SPF/DKIM are verified)
- **Why:** Improves email deliverability, prevents spoofing
- **Lead time:** Hours (DNS propagation)
- **When needed:** Before launch (not during dev)
- **How:** Add a TXT record `_dmarc.yourdomain.com` with `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com`

#### 10. Brand assets (logo, colors)

- [ ] **What:** Logo (SVG ideally), brand color, app name confirmation
- **Why:** UX designer will use these in the design system; placeholders work for dev
- **Lead time:** Whatever you decide
- **When needed:** Before public launch; placeholders fine for early phases

---

## 🟡 What agents are doing in parallel

While you handle the above, the team will:

| Work | Owner | Status |
|------|-------|--------|
| File ADRs for Clerk, Knex+Postgres, Resend+360dialog, BullMQ+Redis (formalize stack) | architect | 📝 ready to start |
| Scaffold `server/` (Express + TypeScript + Knex + middleware) | backend-dev | ⏸️ blocked on Clerk keys |
| Scaffold `web/` (Next.js + Tailwind + shadcn/ui + Clerk provider) | frontend-dev | ⏸️ blocked on Clerk keys |
| Seed `docs/wiki/ux/design-system.md` (color/spacing/components catalog) | ux-designer | 📝 ready to start |
| Wire OpenAPI spec generation pipeline | architect + backend-dev | 📝 ready to start |
| Set up Vitest + Playwright + CI (GitHub Actions) | dev-manager | ⏸️ blocked on GitHub repo |
| Notification service abstraction (channel = parameter) | backend-dev | ⏸️ blocked on Resend + 360dialog keys |
| Conventions: coding, testing, database, git workflow | dev-manager | 📝 ready to start |

**Agents start work that has no external blockers immediately.** As you deliver credentials/URLs, more work unblocks.

---

## ✅ Already in place from prior phases

(none — this is Phase 0, the foundation)

But carried over from project bootstrap:
- ✅ All wiki pages compiled (10 module pages, personas, project overview)
- ✅ Backlog captured ([backlog-future.md](../../docs/wiki/backlog-future.md))
- ✅ Conversation logging hooks active

---

## 📋 Phase 0 exit criteria

- [ ] All 🚨 critical-path external dependencies completed (360dialog account active + API key delivered, Clerk + Resend keys delivered)
- [ ] All 🟡 mid-phase external dependencies completed (Postgres, Redis, hosting, GitHub repo)
- [ ] ADR-001 through ADR-004 filed and accepted (Clerk, Knex+Postgres, Resend+360dialog, BullMQ+Redis)
- [ ] `server/` scaffold deployed and responding to a `GET /api/health`
- [ ] `web/` scaffold deployed with Clerk login working (sign in with email or Google → see authenticated home)
- [ ] OpenAPI codegen pipeline working (`npm run api:generate` produces SDK)
- [ ] Notification service can send a test email via Resend AND a test WhatsApp message via 360dialog
- [ ] BullMQ worker processes a hello-world job
- [ ] CI runs on every push (lint + test + build)
- [ ] Design system seeded
- [ ] All Phase 0 changes committed and pushed to GitHub

---

## 🔭 Heads-up for the NEXT phase (Phase 1)

Items you should also start preparing during Phase 0 because Phase 1 needs them quickly:

- **Test users** — recruit 1-2 friendly AAU coaches + 2-3 parents willing to test the registration flow at the end of Phase 1 (~3-4 weeks out at agent pace). Real-user feedback in Phase 1 is the difference between shipping a working product and a broken one.
- **Sample data** — pull together a list of 20-30 realistic player names, ages, positions for seeding the dev DB (or agents can synthesize; real data is better)
- **WhatsApp template approval** — as soon as your 360dialog account is active, submit message templates Phase 3 will need: selection notification, schedule change, payment reminder. Don't wait — templates can take 1–3 days each to be reviewed by Meta.

---

## Related future-phase commitments

DECISION-002 (decided 2026-05-03) produced three follow-up items that are NOT Phase 0 concerns but are tracked here for continuity. Full details in [pmo/dashboard.md — Future-phase commitments](../dashboard.md#future-phase-commitments):

- **WhatsApp provider** — 360dialog from MVP (decided 2026-05-03). No planned swap. 360dialog account setup is in the Phase 0 critical-path external dependencies above.
- **OCI Object Storage credentials + Architect SDK validation** — Phase 1 prerequisite. OCI was not in the original Architect analysis (which covered R2 vs S3); Architect will validate Node.js SDK choice and S3-compatibility surface during Phase 1 prep.
- **Observability stack decision** — deferred to Phase 1 exit. Architect will file a new decision at that point.

---

## How to update this brief

- As you complete an external dependency, change `[ ]` to `[x]` in this file
- When all 🚨 + 🟡 items are done and agents finish Phase 0 work, TPM marks `status: completed` and files PHASE-1-kickoff.md
- If a new external dependency is discovered mid-phase, append it here with the appropriate urgency bucket
