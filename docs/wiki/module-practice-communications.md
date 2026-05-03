---
title: Module — Practice Communications
source: docs/raw/requirements-original.txt §8
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:practice-communications, phase:3]
status: current
---

# Module: Practice Communications

## Purpose

Two-way communication between coaches and parents about practice. Replace the WhatsApp-group chaos with structured, trackable messages and attendance.

## Scope

### In scope
- **Parent → Coach:** "My kid can't make it Tuesday" (mark absence with reason)
- **Coach → Parents:** schedule change ("today's practice is at gym X instead", "cancelled")
- **Coach → Parents:** poll for availability (e.g., extra weekend practice — who can come?)
- **Attendance tracking** at practice (coach marks present/absent on phone)
- **Visibility:** coach sees who's coming, who's not, who's frequently absent

### Out of scope
- General chat (use WhatsApp for that — this is structured comms)
- Direct parent-to-parent (out of scope; communication flows through coach)

## Personas

- **Head Coach** — full visibility, can message any team
- **Assistant Coach** — manages own team comms
- **Parent** — receives comms, sends absence notices, responds to polls
- **Player** — read-only (notifications surface to parent typically)

## Key flows

### F1: Parent reports absence
1. Parent opens player schedule
2. Taps practice → "Mark absent"
3. Optionally adds reason
4. Coach receives notification + sees in attendance preview

### F2: Coach announces schedule change
1. Coach opens practice instance
2. Edits gym/time or cancels
3. Selects "Notify parents"
4. Crafts message (template offered) → email + WhatsApp sent
5. Read receipts where possible (delivered/seen)

### F3: Coach polls availability
1. Coach: "Extra practice Saturday, who's in?"
2. Sets options (Yes / No / Maybe)
3. Sends to team's parents
4. Sees response dashboard real-time

### F4: Attendance at practice
1. Coach opens practice on phone at the gym
2. Sees roster with already-marked absences
3. Taps each player as they arrive (or marks at end)
4. Saves → attendance log per player builds over season

## Data entities

- **PracticeAttendance** (Practice, Player, status: present/absent/late/excused, reason, marked_by)
- **CommunicationMessage** (sender, recipients, channel, body, sent_at, read_at)
- **Poll** (coach, team, question, options, deadline)
- **PollResponse** (Poll, parent, choice)

## Acceptance criteria

- Parents can mark absence; coach sees it before practice
- Coach can announce schedule changes; parents receive via email + WhatsApp
- Polls work end-to-end; coach sees aggregate response
- Attendance log builds per player over the season; coach can view absentee patterns
