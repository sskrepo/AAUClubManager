---
title: Personas
source: docs/raw/requirements-original.txt
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [meta, personas]
status: current
---

# Personas

The active personas for the in-scope modules. Future personas (Tournament Director, Marketplace consumers) are documented in [backlog-future.md](backlog-future.md).

## Head Coach

**Who:** Runs the club. Decides team structure, coaches per team, tournament calendar, fees, practice plans.

**Goals:**
- Get the club through a season with minimal admin overhead
- Communicate clearly with parents (one-to-many)
- Develop players (track skill, provide feedback, study film)
- Keep payments collected
- Win tournaments

**Pain:**
- WhatsApp groups for every team, hard to track who saw what
- Manual roster spreadsheets
- Forgetting to follow up on payments
- Hours after every game watching film alone

**Authority:** Full admin within the club. Can do everything.

## Assistant Coach

**Who:** Runs one or two teams within the club. Reports to Head Coach.

**Goals:**
- Manage their team's practice attendance
- Communicate with their team's parents
- Track their team's payments (visibility, not collection)
- Develop their players

**Pain:** Same as Head Coach but for a smaller scope.

**Authority:** Admin scoped to their team(s). Can't change club-level settings, fees, or other teams.

## Parent

**Who:** A parent or guardian managing one or more child-players in the club. Primary communication recipient (not the player).

**Goals:**
- Know practice and tournament schedules well in advance
- Communicate absences/conflicts easily
- Pay fees on time
- Help player improve (see assigned drill videos, feedback)
- For travel tournaments: book hotel near the venue at a good rate

**Pain:**
- Schedule changes communicated late
- Multiple kids in different teams = duplicate communication
- Hotel research for travel tournaments

**Authority:** Read-only on club info. Read-write on their player's profile, attendance responses, payment status.

## Player

**Who:** The athlete. Often a teen, may have their own account or share parent's view.

**Goals:**
- Know what's coming (practice, games)
- Get clear feedback from coach
- Track own improvement
- Watch assigned drill/film clips

**Pain:**
- Feedback delivered verbally and forgotten
- No personal development timeline
- Multiple apps required (video review elsewhere, schedule elsewhere)

**Authority:** Read on their own profile, schedule, assigned content. Can mark "viewed" on assignments. Cannot edit core data.

## Authority Matrix

| Action | Head Coach | Asst Coach | Parent | Player |
|--------|:---------:|:----------:|:------:|:------:|
| Create/edit teams | ✅ | ❌ | ❌ | ❌ |
| Assign players to teams | ✅ | ❌ | ❌ | ❌ |
| Set fees | ✅ | ❌ | ❌ | ❌ |
| Mark payment received | ✅ | view-only | view (own) | ❌ |
| Schedule practices | ✅ | own team | ❌ | ❌ |
| Book gyms | ✅ | ❌ | ❌ | ❌ |
| Take attendance | ✅ | own team | mark own | ❌ |
| Notify parents | ✅ | own team | ❌ | ❌ |
| Add tournaments | ✅ | ❌ | ❌ | ❌ |
| Confirm attendance for tournament | ✅ | own team | own player | ❌ |
| Upload film | ✅ | own team | ❌ | ❌ |
| Annotate film | ✅ | own team | ❌ | ❌ |
| Assign drills | ✅ | own team | ❌ | ❌ |
| View own assignments | ✅ | ✅ | ✅ | ✅ |
