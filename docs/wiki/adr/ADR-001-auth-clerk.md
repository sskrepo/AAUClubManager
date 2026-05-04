---
title: ADR-001 — Authentication Provider: Clerk
status: accepted
created: 2026-05-03
decided: 2026-05-03
owner: architect
deciders: user, architect
supersedes: ~
tags: [arch, auth, security]
---

# ADR-001 — Authentication Provider: Clerk

## Context

AAUClubManager is a multi-tenant SaaS: each Club is an isolated tenant; users
(head coaches, assistant coaches, parents, players) belong to one or more clubs
with per-club roles. The app needs:

- Social login (Google, Apple) for low-friction parent onboarding
- Multi-tenant organization model (Club = org, role = claim in JWT)
- Secure session management with short-lived JWTs
- No budget or timeline for building and maintaining a custom auth stack

Phase 0 has zero implementation time budgeted for auth infrastructure — it must
be productive from day one. The decision was made at project start, before any
code was written, so the switching cost is still low.

Related: `docs/wiki/cost-analysis.md` Decision 1 — full alternative matrix and
cost curve. DECISION-002-A confirmed the choice for MVP through PMF tier.

## Decision

Use **Clerk** for authentication and user management from Phase 0 through the
PMF scale tier (~10,000 MAU).

- Club = Clerk Organization
- User roles (head_coach, assistant_coach, parent, player) = custom claims
  on the Clerk JWT, set via Clerk's JWT template
- All protected endpoints validate the Clerk JWT via middleware
  (`express-openapi-validator` + Clerk's `verifyToken`)
- Role authorization is enforced in the service layer, not in the spec

## Rationale

- **Multi-tenant org model is native.** Clerk's Organizations map directly to
  the Club model. Membership, invitation flows, and role claims work without any
  custom schema.
- **Zero implementation time.** Phase 0 is already tight. Clerk's hosted sign-in
  and sign-up UI means the auth surface is production-grade before a single auth
  line is written.
- **Free tier covers MVP and early-adopter tiers.** 10,000 MAU free covers
  roughly 30 clubs before any billing starts.
- **Abstracted at the middleware layer.** All Clerk-specific calls are isolated
  to `server/src/middleware/auth.ts`. Nothing in the service or repository layers
  imports Clerk directly. This keeps a future migration bounded.

## Consequences

**Positive:**
- Auth is production-grade (MFA, social login, session revocation) with zero
  custom code
- Clerk Organizations handle the multi-tenant invite-and-role flow for free
- JWT validation is stateless — the API server stays horizontally scalable

**Negative / tradeoffs:**
- Cost curve is steep at scale: ~$500–$700/mo at PMF (31K MAU), ~$5,000–$7,000/mo
  at SaaS scale (310K MAU). See `docs/wiki/cost-analysis.md` for the full curve.
- Organizations add-on adds ~$1/org/month above the free org threshold — at 100+
  clubs this compounds. Verify current Clerk pricing before PMF.
- Migrating away from Clerk after Phase 1 ships costs ~3–4 weeks eng-time (every
  auth guard touches Clerk's SDK). DECISION-002-A accepted this tradeoff.

**Reversibility:** Moderate. The auth middleware abstraction boundary makes it
*possible* to swap providers without touching service/repo layers, but all
Clerk-specific session/org concepts must be re-implemented. Not easily reversible
after Phase 1 is live with real users.

**Trigger to revisit:** When MAU reaches 8,000 (before the paid tier bites),
evaluate whether projected growth exceeds the free tier within 6 months. If yes,
re-examine Auth.js migration cost vs. Clerk's bill.

## Alternatives Considered

- **Auth.js v5 (NextAuth)** — $0 at any scale, but requires 2–3 weeks to build
  the org/membership model and OAuth flows from scratch. Rejected pre-Phase 1
  due to time constraint; remains the right fallback at SaaS scale.
- **Lucia** — Similar to Auth.js; more control, same ops burden. Rejected for
  same reason.
- **WorkOS** — Excellent for enterprise/B2B (native SAML/SSO), similar pricing
  to Clerk at scale. Overkill for individual-club MVP; re-evaluate if school-
  district sales become a target.
- **Stytch** — Better pricing at scale than Clerk, comparable DX. Not evaluated
  deeply; worth comparing to Auth.js if the migration is ever reconsidered.
- **Supabase Auth** — Locks DB hosting to Supabase; weaker organization model.
  Rejected due to vendor coupling.

## References

- `docs/wiki/cost-analysis.md` — Decision 1: full cost curve and alternatives matrix
- `pmo/decisions/DECISION-002-cost-optimization-priorities.md` — Decision A (keep Clerk)
- `docs/wiki/architecture-options.md` — Auth as Phase 0 critical-path item
- `api/openapi.yaml` — `clerkJWT` security scheme used on all protected endpoints
- ADR-005 — API conventions (auth gating per endpoint)
