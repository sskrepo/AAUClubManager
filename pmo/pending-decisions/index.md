---
title: Pending Decisions — All Phases at a Glance
owner: tpm
updated: 2026-05-04 by tpm
tags: [meta, user-tasks, pending, index]
---

# Pending Decisions — All Phases

Quick counts. Click into a phase file for details.

| Phase | Status | 🚨 Blocking | 🟡 Mid-phase | 📝 Open Qs | ✅ Done | Link |
|-------|--------|-------------|--------------|-----------|---------|------|
| **0 — Foundation** | 🟡 Active | 0 | 4 | 3 | 9 | [PHASE-0.md](PHASE-0.md) |
| **1 — Core** | 🔮 Preview | 0 | 0 | 0 | 0 | [PHASE-1.md](PHASE-1.md) |
| **2 — Operations** | 🔮 Placeholder | — | — | — | — | [PHASE-2.md](PHASE-2.md) |
| **3 — Communications** | 🔮 Preview | 0 | 0 | 0 | 0 | [PHASE-3.md](PHASE-3.md) |
| **4 — Tournaments** | 🔮 Placeholder | — | — | — | — | [PHASE-4.md](PHASE-4.md) |
| **5 — Payments** | 🔮 Placeholder | — | — | — | — | [PHASE-5.md](PHASE-5.md) |

## Phase 0 exit imminent — one agent fix remaining

As of 2026-05-04, no 🚨 blocking items remain. Wave 2 (Backend + Frontend scaffolding) fully shipped. data-model.md filed by Architect (TASK-019 done).

Mid-phase items open (4): Postgres host · Redis host · hosting platform · Resend FROM domain DNS verification — local Docker is sufficient for dev; these only gate production deploy.

Open product questions (3, non-blocking): brand color · logo+name · app header naming.

**Agent-owned blocker to Phase 0 exit:** CI web job failing (PostCSS native binding — Tailwind v4 + npm ci bug). Frontend Dev must fix before Phase 0 closes. See dashboard Risks section.

See [PHASE-0.md](PHASE-0.md) for details.
