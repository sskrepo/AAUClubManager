---
title: Phase 1 — Pending User Items (Preview)
phase: 1
owner: tpm
updated: 2026-05-03 by orchestrator
status: preview
tags: [pending, user, phase:1]
---

# Phase 1 — Pending User Items (Preview)

**Phase status:** 🔮 Preview. Activates after Phase 0 exits. Items below are pre-knowns surfaced ahead so you have lead time.
**Open count:** TBD (full list populated when TPM files PHASE-1-kickoff.md at phase entry)

This file is a **preview**. The definitive set of Phase 1 pending items will be filed when Phase 0 closes and TPM expands [PHASE-1-kickoff.md](../phase-briefs/PHASE-1-kickoff.md).

---

## 🔮 Pre-knowns — surface ahead of phase activation

| # | Item | Why it matters | Source decision |
|---|------|----------------|-----------------|
| 1 | **OCI Object Storage credentials** | File storage for jersey photos, evaluation videos, payment receipts (Phase 1+ uploads). Architect validates Node.js SDK approach during Phase 1 prep. | DECISION-002-C (2026-05-03) |
| 2 | **Brand color + logo + app name** (carryover from Phase 0 open Qs) | Phase 1 UX mocks need finalized brand identity — wireframes for tryout registration, evaluation, selection, roster screens. | Phase 0 open product questions #1-2 |
| 3 | **App header display** (carryover) — generic vs per-tenant club name? | Phase 1 layout spec depends on this. | Phase 0 open product question #3 |

### OCI specifics — what to deliver
- Tenancy OCID (e.g., `ocid1.tenancy.oc1..aaaaaaaa...`)
- Compartment OCID
- Bucket name (recommend dedicated bucket per environment: `aauclubmanager-dev`, `aauclubmanager-prod`)
- API signing key (private key file or PEM contents) + key fingerprint
- User OCID
- Region (e.g., `us-ashburn-1`, `us-phoenix-1`)

These map to env vars: `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY` or path, `OCI_REGION`, `OCI_BUCKET_NAME`, `OCI_NAMESPACE`.

---

## What activates this phase

1. Phase 0 exits (all exit criteria checked off)
2. TPM files [PHASE-1-kickoff.md](../phase-briefs/PHASE-1-kickoff.md) (currently a skeleton)
3. PM writes PDD-PHASE-1.md (Tryouts + Teams flows)
4. UX produces mocks
5. Gate 1 approval needed from you
6. Architect updates OpenAPI spec
7. Gate 2 approval needed from you
8. Implementation begins

This file will be expanded with concrete pending items at step 2.

---

**See also:**
- [PHASE-1-kickoff.md](../phase-briefs/PHASE-1-kickoff.md) — current skeleton with pre-known prerequisites
- [DECISION-002-cost-optimization-priorities.md](../decisions/DECISION-002-cost-optimization-priorities.md) — sub-decision C on file storage
- [Phase 0 pending](PHASE-0.md) — current phase
