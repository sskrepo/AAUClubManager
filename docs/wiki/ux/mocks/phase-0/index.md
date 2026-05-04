---
title: "UI Mocks — Phase 0 (Foundation)"
created: 2026-05-03
approved: 2026-05-03
owner: ux-designer
phase: 0
gate: 1-approved
tags: [ux, mocks, phase-0]
status: approved
---

# UI Mocks — Phase 0 (Foundation)

> Gate 1 approved by user on 2026-05-03.

## Status

**Gate 1 approved (2026-05-03).** This stub was reviewed and approved alongside `docs/wiki/pdd/PDD-PHASE-0.md`.

---

## Why no flow mocks for Phase 0

Phase 0 delivers foundation infrastructure only. The explicit deliverables are:

- ADRs 001-004 (Auth, DB, Notifications, Background jobs)
- `server/` scaffold (Express + TypeScript + Knex + auth middleware + queue worker)
- `web/` scaffold (Next.js 15 + Tailwind + shadcn/ui + Clerk provider + OpenAPI SDK wiring)
- Notification service abstraction (Resend + 360dialog)
- Initial `api/openapi.yaml` with `/health` endpoint
- CI pipeline (GitHub Actions)
- Engineering conventions docs

None of these ship a user-facing screen. There is no login page, no dashboard, no data entry form — only scaffold code and infrastructure wiring. Clerk provides its own hosted auth UI (no custom screens needed for Phase 0). Accordingly, the UX mock requirement is waived for Phase 0 by design.

See `pmo/phases.md` → Phase 0 section, which explicitly states: "No PDD/UI mocks/Gate workflow for Phase 0 — there are no user flows. Phase 0 is foundation only. Gate workflow kicks in starting Phase 1."

This stub exists to satisfy the Gate 1 artifact checklist: both PDD and mocks must be present for every phase, even when mocks are a documented no-op.

---

## What UX IS delivering in Phase 0

UX's Phase 0 deliverable is the **design system seed** — the decisions that must be locked before any Phase 1 frontend pixel is written:

**File:** `docs/wiki/ux/design-system.md` (created alongside this stub)

Locked in Phase 0 baseline:

| Decision | Choice |
|----------|--------|
| Component library | shadcn/ui (Radix UI + Tailwind) |
| Icon set | Lucide React |
| Heading font | Inter |
| Body font | Inter |
| Monospace font | JetBrains Mono |
| Spacing base | 4px (Tailwind default) |
| Color — primary | Club Blue (`#3b82f6` / `primary-500`) |
| Color — secondary | Court Orange (`#f97316` / `secondary-500`) |
| Accessibility target | WCAG 2.1 AA |
| Motion policy | Respect `prefers-reduced-motion` |

These choices propagate into the `web/` scaffold during Phase 0 implementation (Tailwind config, shadcn install, font loading in `app/layout.tsx`).

---

## What is coming in Phase 1

Phase 1 (Tryouts + Teams) is where the first real screens ship. UX will produce full wireframe mocks for:

| Flow | Screens |
|------|---------|
| Tryout registration (parent) | Landing / signup page, registration form, confirmation screen |
| Tryout management (coach) | Create tryout form, tryout list, tryout detail view |
| Player evaluation (coach, mobile-first) | Evaluation card per player, multi-criteria scoring, submit state |
| Selection drag-and-drop (coach) | Board with unassigned / team columns, drag to assign, publish action |
| Roster view (parent) | Roster detail, player card, acceptance CTA |
| Team management (coach) | Team list, team detail, roster table |
| Notification send (coach) | Send modal, channel selector (email + WhatsApp), preview, confirm |

Each mock will cover: all states (empty, loading, error, success), interactions, responsive breakpoints (mobile / tablet / desktop), accessibility notes, and components used.

Phase 1 mocks will be filed at `docs/wiki/ux/mocks/phase-1/` alongside `docs/wiki/pdd/PDD-PHASE-1.md` as Gate 1 for that phase.

---

## Open questions for user

These do not block Phase 0 or Gate 1, but TPM should surface them before Phase 1 mocks are finalized:

1. **Brand color** — is "Club Blue" (`#3b82f6`) acceptable, or is there a specific club identity color? Can swap without changing architecture.
2. **Logo** — is there a logo asset (SVG preferred)? Until provided, initials-based avatar + text wordmark will be used.
3. **App name display** — should the app header show "AAU Club Manager" (generic) or the specific club's name per tenant on login?
