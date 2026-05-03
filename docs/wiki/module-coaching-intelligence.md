---
title: Module — Coaching & Player Skill Management (AI-assisted)
source: docs/raw/requirements-original.txt §10
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:coaching-intelligence, phase:6, ai-heavy]
status: current
---

# Module: Coaching & Player Skill Management

## Purpose

Two AI assistants that augment the coach: a **Practice Assistant** (listens during practice, captures coaching moments per player) and a **Film Study Assistant** (annotates game video, attaches voice notes per player). Both produce assignable artifacts (drill clips, video notes) tied to player development plans.

This is the most AI-heavy module. Defer until Phases 1-5 ship.

## Scope

### Sub-module 10A: Practice Assistant

**In scope:**
- "Start practice" command — begins recording session for a specified team
- Continuous audio capture (with player consent / understood club policy)
- Real-time speech-to-text
- Speaker identification of coach + addressee inference (which player is the coach talking to?)
- Capture coaching moments → text + timestamps + player tag
- End of practice: coach reviews extracted notes, confirms/edits
- For each note, suggest a drill or video clip the coach can assign to the player
- Coach approves → notification to player/parent
- Followup reminders for next practice ("ask Player X about their shooting form")
- Pattern detection over time (Player Y has been told about footwork 4 times — flag it)

**Out of scope:**
- Real-time transcription display during practice (post-process is fine)
- Video capture during practice (that's the Film Study sub-module's domain)
- Sharing practice audio externally (privacy)

### Sub-module 10B: Film Study Assistant

**In scope:**
- Upload game video to portal
- Annotation tools: timeline marks, drawings on frozen frame, voice notes
- Voice notes parsed → player tag + textual summary
- Clip extraction (snip out 10-30s moments)
- Save clips to:
  - Team space (everyone on team can see)
  - Individual player space (coach assigns to specific players)
- Player/parent gets notification with link
- Player marks "viewed"
- Pattern over time across film sessions (Player Z keeps over-helping on defense)

**Out of scope:**
- Auto-generated highlights (out for MVP)
- Live-broadcast / streaming
- Stats overlay (third-party analytics handles that — see Module 11)

## Personas

- **Head Coach** — full access, all teams
- **Assistant Coach** — own team
- **Player** — receives assignments, can view clips, marks viewed
- **Parent** — receives summaries on player's behalf

## Key flows

(High-level only — Architect + UX detail in Phase 6 design)

### Practice Assistant flow
1. Coach: "Start practice for U13 Elite"
2. App records, transcribes, tags
3. End of practice → coach review screen
4. Coach edits/confirms notes
5. App suggests drills per note (from drill library)
6. Coach approves → notifications + reminders set

### Film Study flow
1. Coach uploads game video
2. Annotates (drawing + voice)
3. App extracts clips with player tags
4. Clips saved to team + player spaces
5. Players watch, mark viewed
6. Coach gets pattern report after N sessions

## Data entities

- **PracticeSession** (Team, Practice, audio_url, status, started_at, ended_at)
- **CoachingNote** (PracticeSession or FilmSession, player_id, text, timestamp, drill_assigned, status)
- **DrillLibrary** (drill_name, video_url, focus_areas)
- **DrillAssignment** (Player, Drill, assigned_at, viewed_at, followup_at)
- **FilmSession** (Game, video_url, annotations)
- **VideoClip** (FilmSession, player_ids[], clip_url, summary)
- **PlayerDevelopmentTimeline** (Player, focus_area, recent_notes, recent_drills)

## Open architectural questions (file ADRs in Phase 6)

- Where is video stored? (S3 + signed URLs likely)
- Speech-to-text engine? (Deepgram, AssemblyAI, Whisper API)
- Speaker diarization?
- Player-tag inference: how to identify which player coach is addressing?
- Privacy / consent UX?
- Per-club model fine-tuning?

## Acceptance criteria for the module (MVP within Phase 6)

- Practice Assistant produces a coach-reviewed list of notes per player after a session
- At least 50% of notes get an auto-suggested drill the coach approves
- Film Study lets coach annotate video and extract clips → assigns to player → player marks viewed
- Pattern report shows up after 3+ sessions per player
