---
title: PHASE 1 — Core (Tryouts + Teams) — Kickoff Brief
phase: 1
status: awaiting-external-setup
filed: 2026-05-04
owner: tpm
contributors: [architect, pm]
tags: [phase:1, kickoff]
---

# PHASE 1 — Core (Tryouts + Teams) — Kickoff Brief

## Phase summary

Phase 1 delivers the first user-visible product: a Head Coach can create a club, configure a season, run a tryout, evaluate players, build teams, and notify parents of selection results. Parents can register players, receive notifications, and accept roster spots. Multi-tenant authorization (coach sees own club only) ships in this phase.

Modules: [Tryouts & Onboarding](../../docs/wiki/module-tryouts.md) + [Team Formation & Roster Management](../../docs/wiki/module-teams.md).
Full phase scope: [pmo/phases.md](../phases.md) → Phase 1.

---

## EXTERNAL DEPENDENCIES — ONLY YOU CAN DO THESE

These cannot be done by agents. Start as soon as possible — long-lead items gate Phase 1.

### Critical path — start within 24 hours

#### 1. OCI Object Storage credentials

- **What:** Provide credentials so Architect can validate the Node.js SDK approach (official `oci-sdk` vs S3-compatible AWS SDK pointed at OCI's S3-compat endpoint) during Phase 1 prep. Create dedicated buckets per environment.
- **Why:** File storage is needed in Phase 1 (player profile photos, jersey photos). The Architect must choose and document the SDK before Backend Dev begins the file-upload service. DECISION-002-C chose OCI Object Storage but Architect has not yet validated the technical surface — this validation is a Phase 1 prep task.
- **Lead time:** OCI account creation is same-day if you already have an Oracle Cloud account. Bucket creation is minutes. Key generation is minutes.
- **Your time investment:** ~30-60 minutes if first time in OCI Console; ~15 minutes if already set up.
- **How (step-by-step):**
  1. Go to https://cloud.oracle.com and sign in (or create a Free Tier account — Oracle Cloud Free Tier includes 20 GB Object Storage permanently free).
  2. Note your **Tenancy OCID**: click the profile icon (top right) → Tenancy → copy the OCID from the "Tenancy Information" panel.
  3. Find or create a **Compartment**: Identity & Security → Compartments. Use the root compartment or create `aauclubmanager`. Note the Compartment OCID.
  4. Create **buckets**: Storage → Object Storage → Buckets → Create Bucket. Create two:
     - `aauclubmanager-dev`
     - `aauclubmanager-prod`
     - Settings: Standard storage tier; Emit Object Events: off; Encryption: Oracle-managed.
  5. Note the **Namespace**: visible on the Bucket list page next to "Object Storage Namespace: `[your-namespace]`".
  6. Note your **Region** identifier: visible in the URL (e.g., `us-ashburn-1`, `us-phoenix-1`). Find it at https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm if uncertain.
  7. Generate an **API signing key**:
     - Profile icon → My Profile → API Keys → Add API Key → Generate API key pair.
     - Download the private key (`.pem` file). OCI shows the fingerprint after download — note it.
     - Note your **User OCID** (shown on the same profile page).
  8. If prompted, copy the config file snippet shown — it has all values in one place.
- **Where:** https://cloud.oracle.com → Object Storage; https://cloud.oracle.com → Identity → API Keys
- **Done when:** You can navigate to a bucket in OCI Console and the API signing key is generated.
- **Deliver to agents:** Set in `.env.local`:
  ```
  OCI_TENANCY_OCID=ocid1.tenancy.oc1..aaaaaaaa...
  OCI_USER_OCID=ocid1.user.oc1..aaaaaaaa...
  OCI_FINGERPRINT=aa:bb:cc:dd:...
  OCI_PRIVATE_KEY_PATH=/path/to/oci_private_key.pem
  OCI_REGION=us-ashburn-1
  OCI_BUCKET_NAME=aauclubmanager-dev
  OCI_NAMESPACE=your-namespace
  ```
  Then notify in chat so Architect can proceed with SDK validation.

> **Note:** Oracle Cloud Free Tier gives 20 GB Object Storage, 10 TB egress/month, and 50,000 API requests/month — permanently free. More than sufficient for Phase 1-2 development.

#### 2. Brand identity answers

- **What:** Provide final or approved-placeholder answers on: primary brand color, logo, app name, app header display convention.
- **Why:** UX cannot finalize Phase 1 mocks (Gate 1) without brand direction. Without confirmation, UX will use placeholders (Club Blue `#3b82f6`, "AAUClubManager" wordmark) — if you want different choices, Gate 1 approval will be delayed.
- **Lead time:** Zero — this is a decision you make, no third-party wait.
- **Your time investment:** 10-30 minutes.
- **Questions to answer:**
  1. **Primary color** — hex code or a direction ("navy", "orange", "green"). Placeholder: Club Blue `#3b82f6`. To confirm placeholder, just say "confirm blue."
  2. **Logo** — do you have an SVG logo? If yes, share the file. If no logo yet, confirm "wordmark only" or "use initials."
  3. **App name** — is "AAUClubManager" the final brand name, or do you prefer something shorter (e.g., "HoopCourt", "RosterWise", "ClubMgr")? Confirm or propose.
  4. **App header display** — after login, should the app header show:
     - (a) Generic: "AAU Club Manager" (same for all tenants), or
     - (b) Per-tenant: the specific club name (e.g., "Springfield Elite 2027") for the logged-in user's club?
     This affects the multi-tenant nav layout from Phase 1 onward. Option (b) is more personalized but requires a tenant-name-in-session pattern.
- **Deliver to agents:** Reply in chat with your answers. UX will update design-system.md and proceed with mocks.

---

### Mid-phase — start within 1-2 weeks

#### 3. Resend DNS verification (carryover from Phase 0)

- **What:** Complete SPF, DKIM, and optionally DMARC DNS records for `myhoopclub.com` in Resend dashboard.
- **Why:** Without domain verification, `RESEND_FROM_EMAIL` cannot be set and all email sends will either fail or go to spam. Phase 1 ships selection notifications via email + WhatsApp — email delivery is a Gate 2 requirement.
- **Lead time:** DNS propagation is typically <1 hour, occasionally up to 48h.
- **Your time investment:** ~15 minutes (Resend gives you the exact records to copy).
- **How:**
  1. Go to https://resend.com/domains
  2. Click "myhoopclub.com" (should already be listed from Phase 0 signup)
  3. Resend shows required DNS records: SPF (TXT), DKIM (CNAME), optionally DMARC (TXT)
  4. In Cloudflare dashboard (you're already using Cloudflare for `myhoopclub.com`): DNS → Add records — copy each one exactly
  5. Return to Resend → click "Verify DNS" — status should show green within an hour
- **Deliver to agents:** Once verified, set `RESEND_FROM_EMAIL=noreply@myhoopclub.com` in `.env.local` and notify in chat.

#### 4. Postgres hosting → DATABASE_URL

- **What:** Provision a managed PostgreSQL instance for staging/production. Local Docker is fine for dev.
- **Why:** Phase 1 deploys real user-visible features. The first cloud deploy needs a real DB.
- **Lead time:** Minutes (account + provision).
- **Your time investment:** ~20 minutes.
- **Recommended:**
  - **Neon** (https://neon.tech) — free tier, branching for staging/prod, zero cold-start penalty. Recommended.
  - **Supabase** (https://supabase.com) — free tier; includes extras (auth, storage) you don't need but no harm.
  - **Railway** (https://railway.app) — if you want Postgres + Redis + hosting in one place.
- **Deliver to agents:** `DATABASE_URL=postgres://user:pass@host:5432/dbname` (separate for dev/staging/prod if you use Neon branching).

#### 5. Redis hosting → REDIS_URL

- **What:** Provision a managed Redis instance for BullMQ. Local Docker Redis fine for dev.
- **Why:** Notification queues and scheduled reminders need Redis in staging/production from Phase 1 onward.
- **Lead time:** Minutes.
- **Your time investment:** ~10 minutes.
- **Recommended:** **Upstash** (https://upstash.com) — serverless Redis, pay-per-request, zero cost at low volume. Has a free tier.
- **Deliver to agents:** `REDIS_URL=redis://...` (or `rediss://...` for TLS, which Upstash uses).

#### 6. Hosting platform decision

- **What:** Decide where to deploy `web/` (Next.js) and `server/` (Express).
- **Why:** CI/CD pipelines, environment variable management, and deploy scripts differ per platform. Agents need to configure this before Phase 1 ships.
- **Lead time:** Account creation is minutes; first deploy may take ~1-2 hours.
- **Options:**
  - **Option A (recommended):** Vercel for `web/` (free hobby tier, excellent Next.js support) + Railway or Render for `server/` (~$5-10/month).
  - **Option B:** Railway for both — unified dashboard, easy internal networking between services.
  - **Option C:** Fly.io for `server/` + Vercel for `web/` — good for containerized deploys.
- **Deliver to agents:** "Hosting: Vercel + Railway" (or your choice). Agents will configure deploy scripts, GitHub Actions deploy steps, and env var injection accordingly.

#### 7. Clerk webhook secret

- **What:** Configure a Clerk webhook endpoint and provide the signing secret.
- **Why:** Phase 1 implements Clerk-to-DB user and club sync. When a user signs up in Clerk or an Organization is created, a webhook fires and the backend creates the corresponding `User` and `Club` records in Postgres. Without this, the DB is always out of sync with Clerk.
- **Lead time:** Minutes (configure in Clerk dashboard).
- **Your time investment:** ~10 minutes.
- **How:**
  1. Go to https://dashboard.clerk.com → your app → Webhooks
  2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk` (or your staging URL)
  3. Subscribe to events: `organization.created`, `organization.updated`, `organization.membership.created`, `user.created`, `user.updated`
  4. Copy the **Signing Secret** shown after creation (format: `whsec_...`)
- **Deliver to agents:** `CLERK_WEBHOOK_SECRET=whsec_...` in `.env.local`.

---

### Nice-to-have / can wait

#### 8. Test users for UAT

- **What:** Recruit 1-2 AAU coaches and 2-3 parents willing to test the tryout flow at Phase 1 exit.
- **Why:** Real-user testing before Phase 2 starts catches UX issues agents can't find in unit tests.
- **Lead time:** Recruiting takes as long as it takes — start during Phase 1 implementation so they're ready at exit.
- **Your time investment:** ~1-2 hours of outreach + scheduling.
- **Done when:** At least 1 coach + 1 parent confirmed and ready to run through the tryout flow end-to-end.

#### 9. Sample player data

- **What:** A list of 20-30 realistic player names, ages, positions for seeding the dev DB.
- **Why:** Realistic seed data makes demo screenshots and UAT more authentic. Agents can synthesize this if you don't provide it.
- **When needed:** Before first internal demo or UAT session.
- **Deliver:** A CSV or paste in chat. Agents will write a seed script.

#### 10. Production brand domain decision

- **What:** Choose and register the final production domain (e.g., `hoopcourt.com`, `rosterwise.app`, `aauclubmanager.com`).
- **Why:** `myhoopclub.com` is dev/UAT. The production brand domain should be confirmed before Phase 1 exits and public-facing emails go out.
- **Note:** This is a Phase 1 exit task per the PM's research. HoopCourt and RosterWise were the top candidates from prior market research. Decide when ready — no urgency today.

---

## What agents are doing in parallel

While you handle the above, the team is working in the Phase 1 gate sequence:

| Activity | Owner | Status |
|----------|-------|--------|
| PDD-PHASE-1.md — Tryouts + Teams flows | pm | Ready to start (no blockers) |
| UX mocks — tryout registration, evaluation UI, selection drag-and-drop, team roster | ux-designer | Waiting on brand identity answers (item #2 above) |
| Gate 1 approval (PDD + mocks) | user | Pending PM + UX deliverables |
| OCI SDK validation — `oci-sdk` vs S3-compat surface | architect | Blocked on OCI credentials (item #1 above) |
| OpenAPI spec — Phase 1 endpoints | architect | Blocked on Gate 1 approval |
| Gate 2 approval (OpenAPI) | user | Pending Architect spec |
| Detailed stories | pm | Blocked on Gate 2 |
| Engineering task breakdown | dev-manager | Blocked on Gate 2 |
| Backend implementation | backend-dev | Blocked on Gate 2 |
| Frontend implementation | frontend-dev | Blocked on Gate 2 |
| QA validation | qa | Last in sequence |

---

## Already in place from Phase 0

- Clerk auth scaffold (server + web) — ClerkProvider, proxy.ts, JWT middleware, authenticated shell
- OpenAPI codegen pipeline — `api:validate/generate/check`; generated SDK in `web/src/api/generated/`
- Notification service abstraction — `IWhatsAppProvider` (Dialog360) + `IEmailProvider` (Resend); workers; dev scripts
- BullMQ + Redis integration — workers, send-notification queue, hello-world job
- ADRs 001-005 — all accepted
- Base data model — Club, User, ClubMembership, Season (Architect extends this in Phase 1)
- CI — GitHub Actions: API + Server + Web jobs; all green
- Design system seed — Club Blue palette, Inter typography, shadcn/ui catalog, accessibility baseline
- Engineering conventions — 4 docs in `docs/wiki/engineering/`
- 360dialog sandbox API key — stashed in `.env.local`; sandbox sufficient through Phase 2 dev
- Resend API key — stashed in `.env.local`; DNS verification pending (item #3 above)
- GitHub repo — https://github.com/sskrepo/AAUClubManager; CI connected

---

## Phase 1 exit criteria

- [ ] Head Coach can run a tryout end-to-end: create → parent registration → coach evaluation → selection → parent notification
- [ ] Parent receives selection result via email AND WhatsApp
- [ ] Parent can accept or decline a roster spot
- [ ] Multi-tenant authorization works: coach sees only own club's data
- [ ] Team roster page is functional: shows players, coach assignment, season
- [ ] Player profile management: jersey number, parent contact, emergency contact
- [ ] All Phase 1 endpoints in `api/openapi.yaml` (Gate 2 spec)
- [ ] `npm run api:generate` regenerated and SDK committed after Phase 1 spec additions
- [ ] All Phase 1 stories done per PM's story list
- [ ] QA UAT scenarios passing
- [ ] CI green with Phase 1 code

---

## Forward-look for Phase 2+

Items to start preparing now because they have multi-week lead times:

- **Meta WhatsApp template approvals** (Phase 3 prereq) — Start in Phase 1. Each template takes 1-3 days per Meta review; submit in parallel to avoid compounding delays. Minimum templates needed: `tryout_selection_result`, `practice_schedule_change`, `practice_reminder`, `attendance_poll`, `payment_reminder`. PM/Architect to finalize the list; submit as soon as confirmed. See [PHASE-3.md](../pending-decisions/PHASE-3.md).
- **360dialog production tier** (Phase 3 prereq) — If you haven't started Meta Business verification + WhatsApp Business number setup for the production 360dialog tier, begin in Phase 1–2. Sandbox is sufficient for dev through Phase 2; production verification has 1-7 day lead time. See [PHASE-3.md](../pending-decisions/PHASE-3.md).
- **Observability stack decision** (Phase 1 exit) — Architect will file a new DECISION at Phase 1 exit comparing Sentry+Axiom/BetterStack vs Datadog vs self-hosted Loki/Grafana. No action from you now; just be ready to weigh in at Phase 1 exit.
- **Production brand domain** (Phase 1 exit task) — See item #10 in nice-to-have above.
- **COPPA / GDPR posture** (Phase 2 concern) — Phase 1 collects player DOB, parent contact, emergency contact, medical notes. These are minors' data. Before Phase 2 ships publicly, PM will flag whether COPPA (players under 13) compliance posture needs a formal decision. No action now.

---

## How to update this brief

- As you complete an external dependency, move the row to ✅ Done in [PHASE-1.md](../pending-decisions/PHASE-1.md)
- When all 🚨 + 🟡 items are done and agents finish Phase 1 work, TPM marks `status: completed` and files PHASE-2-kickoff.md
- If a new external dependency surfaces mid-phase, append it here with the appropriate bucket
