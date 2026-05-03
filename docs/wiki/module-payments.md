---
title: Module — Payment Tracking
source: docs/raw/requirements-original.txt §3
compiled_at: 2026-05-03T00:00:00Z
created: 2026-05-03
owner: pm
tags: [module:payments, phase:5]
status: current
---

# Module: Payment Tracking

## Purpose

Track which parents have paid their fees per team, automate followup reminders, and give Head Coach a financial dashboard. This is **tracking + reminders**, not a payment processor (initially).

## Scope

### In scope
- Define fee per team (or per player) — flat or installment plan
- Mark payment received (manual entry by Head Coach)
- Automated followup reminders to parents who haven't paid
- Per-team, per-player payment status views
- Parent-facing "what I owe / what I paid" page
- Payment history per player (multi-season)

### Phase 5 expansion (deferred — file decision when ready)
- Online payment via Stripe or similar
- Refunds
- Discounts (multi-child, scholarship)

### Out of scope (forever, unless requirements change)
- Tax/accounting reports for the club (export to CSV instead, integrate with QuickBooks if needed later)
- Banking, wire transfers

## Personas

- **Head Coach** — sets fees, marks payments received, sees full picture
- **Assistant Coach** — view-only on own team payment status
- **Parent** — sees what they owe, what they paid, payment history

## Key flows

### F1: Set up team fees
1. After teams created (Module 2)
2. Head Coach opens "Fees" page
3. Per team: total fee, payment plan (lump sum, 2 installments, monthly)
4. Activate → parents see fee on their dashboard

### F2: Parent views status
1. Parent dashboard shows "Owed: $X / Paid: $Y / Remaining: $Z"
2. Per-installment breakdown with due dates
3. (Phase 5) "Pay now" button

### F3: Head Coach marks payment received
1. Open "Payments" page
2. Filter by team / unpaid
3. Click parent → mark received (date, amount, method)
4. Triggers receipt email to parent

### F4: Automated followups
1. Configurable schedule (e.g., 7 days before due, on due, 3 days after)
2. Email + WhatsApp reminder
3. Coach can override per-parent (snooze, custom message)

## Data entities

- **FeeSchedule** (per Team or per Player override)
- **Installment** (date, amount due)
- **Payment** (date received, amount, method, parent who paid)
- **ReminderRule** (per FeeSchedule)
- **ReminderLog** (who got reminded when)

## Acceptance criteria for the module (MVP)

- Head Coach can define fees per team
- Parents see what they owe
- Head Coach marks payment received
- Automated reminders sent on schedule via email + WhatsApp
- Per-team financial dashboard shows: total owed, total received, outstanding by parent
