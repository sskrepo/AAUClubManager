---
title: Phase 3 — Pending User Items (Preview)
phase: 3
owner: tpm
updated: 2026-05-03 by orchestrator
status: preview
tags: [pending, user, phase:3]
---

# Phase 3 — Pending User Items (Preview)

**Phase status:** 🔮 Preview. Activates after Phase 2 exits.
**Phase scope:** Practice Communications (broadcast, polls, attendance, read receipts).

This phase is the largest external-dependency surface in the project. Pre-knowns below.

---

## 🔮 Pre-knowns — start working these in Phase 0–2

| # | Item | Why it matters | When to start |
|---|------|----------------|----------------|
| 1 | **360dialog production tier** — Meta Business verification + custom templates | Phase 0 used the sandbox tier (sufficient for dev/test). Production sends require full Meta Business verification (1–7 days) + at least one approved template (1–3 days each, parallelizable). | Phase 1–2 (so it's ready by Phase 3 launch) |
| 2 | **Meta WhatsApp message template approvals** (multiple) | All production WhatsApp sends require pre-approved templates. Submit in parallel — sequential submission compounds delay. | Phase 1 |
| 3 | **Observability stack decision** (carryover from DECISION-002-D) | Phase 3 introduces high notification volume; observability must be in place before this phase ships. | Phase 1 exit (per DECISION-002-D) |

### Suggested template list to pre-submit (subject to confirmation by Architect / PM)
- `tryout_selection_result` — selection notification (Phase 1)
- `practice_schedule_change` — schedule update (Phase 2)
- `practice_reminder` — pre-practice reminder (Phase 3)
- `attendance_poll` — attendance polling (Phase 3)
- `coach_broadcast` — generic coach announcement (Phase 3)
- `payment_reminder` — payment dunning (Phase 5)

PM/Architect will finalize this list during Phase 1–2 design. Submit early to avoid Phase 3 launch slip.

---

## What activates this phase

1. Phase 2 exits
2. TPM files PHASE-3-kickoff.md (currently TBD)
3. Standard Gate 1 + Gate 2 sequence

---

**See also:**
- [phases.md](../phases.md) — full Phase 3 scope
- [PHASE-0-kickoff.md](../phase-briefs/PHASE-0-kickoff.md) — original 360dialog setup notes
- [ADR-003](../../docs/wiki/adr/ADR-003-notifications-resend-360dialog.md) — notification provider decision
