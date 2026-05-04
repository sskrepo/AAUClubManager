---
title: PHASE 1 — Tryouts and Teams — Kickoff Brief (SKELETON)
phase: 1
status: skeleton
filed: 2026-05-03
owner: tpm
contributors: []
tags: [phase:1, kickoff]
note: >
  This is a skeleton filed at DECISION-002 close to capture pre-known Phase 1
  prerequisites. It will be fully expanded by TPM at Phase 0 exit (Architect +
  PM will supply their dependency lists at that time per the kickoff brief protocol).
---

# PHASE 1 — Tryouts and Teams — Kickoff Brief (SKELETON)

> This brief will be fully populated by TPM when Phase 0 exits. At that point,
> Architect supplies external technical dependencies and PM supplies product/legal
> items. What follows captures prerequisites already known before Phase 0 closes.

---

## Pre-known prerequisites

These items are already known from prior decisions and open questions. The user
should work on them in parallel with Phase 0 progress so Phase 1 can start
without waiting.

### OCI Object Storage credentials (from DECISION-002-C)

File storage is needed from Phase 1 onward (jersey photos in Phase 1, gym photos
in Phase 2). The user chose OCI Object Storage. This was NOT in the Architect's
original analysis (which covered Cloudflare R2 vs AWS S3).

**Action required from user before Phase 1 implementation begins:**

- OCI tenancy OCID
- Compartment OCID (or name)
- Bucket name (pre-create in OCI Console)
- API key credentials (user OCID + fingerprint + private key) or instance principal
  config — whichever approach is preferred

**Action required from Architect during Phase 1 prep (before implementation):**

- Validate Node.js SDK approach: official `oci-sdk` (Oracle SDK) vs S3-compatible
  AWS SDK pointed at OCI's S3-compatibility endpoint
- Document S3-compatibility surface gotchas (presigned URLs, multipart upload,
  ACLs, CORS configuration)
- Recommend the approach and update `docs/wiki/integrations/` accordingly

Tracked in: [pmo/dashboard.md — Future-phase commitments](../dashboard.md#future-phase-commitments)
Source decision: [DECISION-002-C](../decisions/DECISION-002-cost-optimization-priorities.md)

---

### Brand identity (from open product questions)

UX mocks for Phase 1 (tryout registration, evaluation, selection, roster screens)
require brand identity inputs. These are parked as non-blocking for Phase 0 but
must be resolved before Phase 1 mocks are finalized.

- **Primary color** — hex code or direction. Placeholder: Club Blue `#3b82f6`.
- **Logo / app name** — SVG logo if available; confirm or replace "AAUClubManager"
  with the final brand name.
- **App header display convention** — show "AAU Club Manager" (generic) or the
  specific club name per tenant after login? Affects multi-tenant UI pattern from
  Phase 1 onward.

Tracked in: [pmo/dashboard.md — Open product questions](../dashboard.md)

---

### Hosting platform decision (from open product questions)

Phase 1 will deploy real user-visible features. Hosting platform must be chosen
before Phase 1 CI/CD is configured.

- Vercel (Next.js frontend) + Railway or Render (Express backend) — standard split
- Or unified platform if preferred

Tracked in: [pmo/phase-briefs/PHASE-0-kickoff.md](PHASE-0-kickoff.md) item 7 and
[pmo/dashboard.md — Open product questions](../dashboard.md).

---

## What this brief will add at Phase 0 exit

When TPM fully populates this brief at Phase 0 close, it will include:

- Complete external dependency list from Architect (beyond OCI — any new
  integrations Phase 1 adds)
- Product/legal items from PM (e.g., any data privacy considerations for storing
  player evaluation data, parent consent flows)
- Urgency buckets (critical path / mid-phase / nice-to-have) based on Phase 1
  implementation sequence
- Forward-look for Phase 2 items with multi-week lead times

---

## How to update this brief

- Add items here as they are discovered during Phase 0
- At Phase 0 exit, TPM expands to full brief format with Architect + PM input
- Mark `status: awaiting-external-setup` when fully populated and Phase 1 begins
