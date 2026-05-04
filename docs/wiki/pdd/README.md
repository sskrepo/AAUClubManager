# Product Definition Documents (PDDs)

One PDD per phase. Owned by PM. Filed BEFORE detailed stories are written.

Filename: `PDD-PHASE-{N}.md`

Format and protocol: [dev-agent-team/shared/phase-deliverables-protocol.md](../../../dev-agent-team/shared/phase-deliverables-protocol.md)

## Approval gate (Gate 1)

Each PDD ships with UX UI mocks (in `../ux/mocks/phase-{N}/`) and is reviewed/approved by user as **Gate 1** before Architect's OpenAPI spec is finalized.

User approval syntax:
- `PDD-PHASE-N: approved` — approves PDD only
- `MOCKS-PHASE-N: approved` — approves all mocks for the phase
- `GATE-1-PHASE-N: approved` — approves both together
- `PDD-PHASE-N: needs changes — {description}` — request edits

## What's here

(empty — first PDD will be filed at start of Phase 1, after DECISION-001 closes)
