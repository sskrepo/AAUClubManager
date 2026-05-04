---
title: Git Conventions
owner: dev-manager
updated: 2026-05-03
tags: [engineering, conventions, git, github]
---

# Git Conventions

Applies to all branches, commits, and PRs in the AAUClubManager repository.

---

## Branch naming

```
{type}/{short-description}
```

Types:
- `feature/` — new functionality (corresponds to a story or task)
- `fix/` — bug fix
- `chore/` — maintenance, dependency updates, config changes
- `docs/` — wiki-only or doc-only changes (no code)
- `test/` — adding or fixing tests with no production code change
- `infra/` — CI, Docker, infrastructure config

Examples:
```
feature/phase0-server-scaffold
feature/phase0-auth-middleware
feature/phase0-notification-abstraction
fix/health-endpoint-redis-degraded
chore/update-knex-deps
docs/database-conventions
infra/github-actions-ci
```

Rules:
- All lowercase. Hyphens only — no underscores, no slashes beyond the type prefix.
- Keep it short: 3-5 words maximum after the type prefix.
- One concern per branch. Do not combine a feature and a bug fix in the same branch.
- Branch off `main`. Never branch off another feature branch.

---

## Commit message format

```
{type}({scope}): {short description}

{body — optional, wrap at 72 chars}

{footer — optional, e.g., "Closes #123", "Co-authored-by:"}
```

Types (conventional commits):
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance, no production behavior change
- `docs` — documentation only
- `test` — test additions/changes only
- `refactor` — code restructuring with no behavior change
- `ci` — CI/CD changes

Scope: the module or layer affected. Examples: `auth`, `health`, `notification`, `worker`, `codegen`, `ci`, `web`.

Examples:
```
feat(auth): add Clerk JWT validation middleware

Validates Bearer token on all /api/v1/ routes. Uses @clerk/clerk-sdk-node
verifyToken(). Populates req.user = { clerkUserId, email, firstName, lastName }.
Returns 401 RFC 7807 on invalid/missing token.

feat(notification): add channel-agnostic NotificationService

Wraps Resend (email) and Twilio (WhatsApp) behind a shared IWhatsAppProvider
interface. Swapping providers (Twilio → 360dialog, per DECISION-002) requires
only a new provider file with no changes to the service or job handlers.

fix(health): return degraded when Redis unreachable

Previously threw uncaught error; now returns { status: 'degraded',
subsystems: { redis: 'error' } } per the OpenAPI spec.

ci: add GitHub Actions workflow with api:check gate
```

Rules:
- First line: 72 characters maximum.
- Imperative mood: "add", "fix", "update", not "added", "fixed", "updated".
- Body explains WHY, not what (the diff shows what).
- No emoji.
- Reference the related task ID in the footer when applicable: `Task: TASK-006`.

---

## Pull request requirements

Every PR must include:

1. **Title**: follows the same format as commit messages (`{type}({scope}): {description}`). If the PR has one commit, the commit message is the PR title.

2. **Description** (use this template):

```markdown
## What
One-paragraph summary of what changed and why.

## Test plan
- [ ] Unit tests pass (`npm run test` in server/ or web/)
- [ ] Manual smoke test: {describe what you did and what you observed}
- [ ] Wiki updated if behavior diverges from prior docs

## Checklist
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run api:check` passes (if openapi.yaml was changed)
- [ ] No hardcoded secrets, URLs, or credentials
- [ ] `.env.example` updated if new env vars were added
```

3. **Size limit**: aim for PRs reviewable in under 20 minutes. If a PR exceeds ~400 lines of logic (excluding generated code and test fixtures), split it.

4. **Tests included**: tests must be in the same PR as the code. A PR that adds code without tests is not mergeable.

5. **Wiki parity**: if the PR changes server behavior or API shape, the relevant wiki page must also be updated in the same PR.

---

## Merge strategy

- **Squash and merge** for feature branches into `main`. Keeps `main` history linear and readable.
- **Merge commit** is acceptable only for large release-type merges (not applicable in Phase 0-5 at agent pace).
- Do not rebase shared branches.
- Delete the branch after merge.

---

## Branch protection (configure on GitHub)

Once the GitHub repo is created (user completes PHASE-0-kickoff.md item 8):
- `main` branch: require PR before merge; require CI to pass; require at least 1 approving review (user-as-reviewer).
- No force push to `main`.
- No direct commits to `main`.

---

## Versioning note

Git tags follow SemVer. Tags are applied by the TPM at phase exits, not by individual devs:
- Phase 0 exit: `v0.1.0`
- Phase 1 exit: `v0.2.0`
- Patch releases: `v0.1.1` (bug fixes between phases, if needed)
