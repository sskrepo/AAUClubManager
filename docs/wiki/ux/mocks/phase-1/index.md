---
title: "UI Mocks — Phase 1 (Core: Tryouts + Teams)"
phase: 1
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1]
---

# UI Mocks — Phase 1 (Core: Tryouts + Teams)

> Gate 1 pending PM PDD + user approval.
> Reply `MOCKS-PHASE-1: approved` or `GATE-1-PHASE-1: approved` to lock these specs.

---

## Brand Identity Placeholder Status

**OPEN PRODUCT QUESTION — blocks Gate 1 finalization**

Four brand decisions remain unresolved (per `pmo/pending-decisions/PHASE-1.md` item #2 and `pmo/phase-briefs/PHASE-1-kickoff.md` item #2). Every mock in this phase uses the placeholders below and flags affected elements.

| Decision | Placeholder used | To confirm |
|----------|-----------------|------------|
| Primary color | `#3b82f6` (Club Blue / `primary-500`) | Say "confirm blue" or provide hex |
| Logo | Text wordmark: "AAUClubManager" | Provide SVG or confirm text-only |
| App name | "AAUClubManager" | Confirm or propose (HoopCourt, RosterWise, etc.) |
| App header display | Per-tenant club name after login | Confirm Option (b) or choose Option (a) generic |

If these are confirmed before Gate 1 approval, no re-review cycle is needed. If changed after approval, UX will update mocks and re-surface.

---

## Mobile-First Highlight

**Mock #07 (Coach Evaluation) is mobile-primary.** Coaches score players courtside on a phone — portrait mode, one-handed use, large tap targets, minimal typing. This mock drives:
- Minimum touch target 44×44px on all scoring controls
- Bottom-sheet / fixed-bottom action bar pattern (thumb reach zone)
- No horizontal scroll on mobile
- Score sliders/steppers operable one-handed

All other mocks are desktop-primary but responsive to 768px (tablet) and 375px (mobile) breakpoints.

---

## Accessibility Baseline

All Phase 1 mocks target WCAG 2.1 AA. The following are repeated in each mock; enforced globally:

- **Contrast:** placeholder `primary-500` (`#3b82f6`) on white is 4.6:1 (AA). Final brand color must be re-checked at implementation.
- **Focus ring:** `ring-2 ring-primary-500 ring-offset-2` on all interactive elements.
- **No color-only status:** every status Badge has text (not color alone).
- **Reduced motion:** all slide, fade, and drag animations gated on `motion-safe:` or `@media (prefers-reduced-motion: reduce)`.
- **ARIA live regions:** dynamic content (toasts, inline validation, step progress) uses `aria-live="polite"`.
- **Form errors:** linked via `aria-describedby` to the field that failed.
- **Tab order:** header → sidebar/nav → main content → primary action → data table rows.

---

## Design Tokens Reference

CSS variables in `web/src/app/globals.css` (Tailwind v4 `@theme`):

```
--color-primary-50   → #eff6ff
--color-primary-100  → #dbeafe
--color-primary-500  → #3b82f6  (PLACEHOLDER — awaiting brand confirmation)
--color-primary-600  → #2563eb
--color-primary-700  → #1d4ed8
--color-secondary-500 → #f97316  (Court Orange — accent)
--color-success-500  → #22c55e
--color-error-500    → #ef4444
--color-warning-500  → #eab308
--color-neutral-0    → #ffffff
--color-neutral-50   → #f8fafc
--color-neutral-200  → #e2e8f0
--color-neutral-600  → #475569
--color-neutral-800  → #1e293b
--color-neutral-950  → #0f172a
```

---

## Phase 1 Components Catalog

All Phase 1 mocks draw exclusively from the shadcn/ui components listed in `docs/wiki/ux/design-system.md`. For quick reference, the components used across these screens:

| Component | shadcn slug | Used in |
|-----------|-------------|---------|
| Button | `button` | All screens |
| Form | `form` | #02, #03, #04, #06, #09 |
| Input | `input` | #02, #03, #04, #06, #09 |
| Select | `select` | #04, #06, #08, #09 |
| Textarea | `textarea` | #04, #07 |
| Checkbox | `checkbox` | #08 |
| Calendar | `calendar` | #04 |
| Table | `table` | #08, #09 |
| Card | `card` | #05, #07, #08, #09, #12 |
| Dialog | `dialog` | #03, #08, #09 |
| Alert | `alert` | All screens (error state) |
| Badge | `badge` | #05, #08, #09, #12 |
| Avatar | `avatar` | #07, #08, #09 |
| Toast (Sonner) | `sonner` | All screens (success/error) |
| Skeleton | `skeleton` | All screens (loading state) |
| Separator | `separator` | #02, #06 |
| Tabs | `tabs` | #09 |
| Dropdown Menu | `dropdown-menu` | #08, #09 |

Icons: Lucide React. Key icons per screen noted inline.

---

## All Mocks — Phase 1

| # | File | Flow | Primary persona | Device |
|---|------|------|----------------|--------|
| 01 | [01-club-creation.md](01-club-creation.md) | Director creates club (post-Clerk Org) | Director / Head Coach | Desktop |
| 02 | [02-season-setup.md](02-season-setup.md) | Director creates a season | Director / Head Coach | Desktop |
| 03 | [03-coach-invitation.md](03-coach-invitation.md) | Director invites Coach; Coach accepts | Director + Coach | Desktop |
| 04 | [04-tryout-creation.md](04-tryout-creation.md) | Coach creates tryout | Head Coach | Desktop |
| 05 | [05-public-tryout-page.md](05-public-tryout-page.md) | Public/unauthenticated tryout landing | Parent (unauthenticated) | Mobile + Desktop |
| 06 | [06-parent-registration.md](06-parent-registration.md) | Parent signup + player registration | Parent | Mobile + Desktop |
| 07 | [07-coach-evaluation-mobile.md](07-coach-evaluation-mobile.md) | Coach scores players courtside | Head Coach / Asst Coach | **Mobile-first** |
| 08 | [08-selection-workflow.md](08-selection-workflow.md) | Coach reviews scores, assigns to teams | Head Coach | Desktop |
| 09 | [09-team-roster.md](09-team-roster.md) | Coach views/manages team roster | Head Coach / Asst Coach | Desktop |
| 10 | [10-selection-notification-email.md](10-selection-notification-email.md) | Email notification template | System / Coach-triggered | N/A (email template) |
| 11 | [11-selection-notification-whatsapp.md](11-selection-notification-whatsapp.md) | WhatsApp message template | System / Coach-triggered | N/A (message template) |
| 12 | [12-parent-roster-acceptance.md](12-parent-roster-acceptance.md) | Parent accepts or declines roster spot | Parent | Mobile + Desktop |

---

## Open Product Questions Surfaced During Mocking

The following questions arose during mock production and are **not yet in `pmo/pending-decisions/PHASE-1.md`**. TPM should review and add if they need user input before Gate 2:

1. **Evaluation visibility between coaches:** Mock #07 and #08 assume evaluations are private per-coach until the Head Coach runs the selection view. Should Assistant Coaches be able to see each other's scores? (Noted as open question in `docs/wiki/module-tryouts.md`.)

2. **Waitlist placement UX:** Mock #08 (selection workflow) includes a "Waitlist" column alongside teams and "Not Selected." Is the waitlist a single shared waitlist, or per-team? This affects the column layout.

3. **Player photo at tryout registration:** Mock #06 (parent registration) includes an optional photo upload per player. Is a photo required, optional, or absent at tryout stage? (Photo is needed for coach evaluation #07 to identify players on court.)

4. **Acceptance deadline:** Mock #12 (parent roster acceptance) shows a deadline countdown. Does the Head Coach set a deadline when sending notifications, or is there a global default (e.g., 72 hours)?

5. **Multi-player parent registration:** If a parent has two players registering for the same tryout, does registration repeat per player or can both be added in one flow? Mock #06 shows an "Add another player" pattern — confirm this is the correct UX.

---

## Contradictions / Gaps Found in Source Material

- **`module-teams.md` F2** describes drag-from-"unassigned pool" to team as a separate Teams flow, but the tryout selection (mock #08) already performs this assignment. These are the same UI action. Mocks treat selection-from-tryout as the primary team assignment path; manual post-hoc roster editing (add/remove) is a secondary action on the roster screen (#09).
- **Data model (Phase 0) lists `TryoutRegistration.user_id` as the parent user.** But a parent may not have a Clerk account at registration time (they create one during the flow). Mock #06 models Clerk signup as step 1 of the registration multi-step form. Architect should confirm the FK constraint allows nullable or deferred user creation.
- **No `PlayerEvaluation` entity in the Phase 0 data model** (expected — it is Phase 1). Mock #07 specifies the fields needed (player_id, coach_id, tryout_id, dimension scores, text note, timestamp). Architect should include this entity in the Phase 1 data model at Gate 2.

---

## Gate 1 Readiness Statement

Mocks are draft-complete for all 12 flows. Brand placeholders are flagged in every file. Pending user confirmation of brand identity (PHASE-1.md item #2) and PDD Gate 1 approval from PM.
