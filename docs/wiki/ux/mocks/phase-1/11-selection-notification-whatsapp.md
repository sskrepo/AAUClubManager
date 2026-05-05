---
title: "Phase 1 — Selection Notification WhatsApp Template"
phase: 1
flow: selection-notification-whatsapp
status: draft
gate: 1-pending
brand: placeholder
owner: ux-designer
created: 2026-05-04
tags: [ux, mocks, phase:1, notification, whatsapp, selection, 360dialog]
---

# Phase 1 — Selection Notification WhatsApp Template

## Persona + Entry Context

**Who (recipient):** Parent who provided a phone number (E.164 format) during registration.

**Channel:** WhatsApp Business API via 360dialog sandbox (dev) / production (post-Meta approval).

**Critical constraint:** WhatsApp Business API requires pre-approved message templates from Meta for outbound notifications to users who have not recently messaged the business. These templates must be:
- Submitted to Meta via 360dialog dashboard
- Reviewed and approved by Meta (1-3 days per template)
- Use the approved parameter placeholder format: `{{1}}`, `{{2}}`, etc.

**The templates below are designed for submission to Meta. The `{{N}}` syntax must be preserved exactly.**

**Status:** Sandbox can send test messages without Meta approval. Production requires Meta approval before sending to real users.

---

## WhatsApp Template — Selected Variant

### Template Name (for Meta submission)
```
tryout_selection_selected
```

### Category
`UTILITY` (not MARKETING — keeps open rates higher and avoids promotional restrictions)

### Language
`en_US`

### Template Body

```
{{1}} has been selected for the *{{2}}* team in *{{3}}*! 🎉

Coach: {{4}}
Season: {{5}}

Log in to accept or decline your roster spot (offer expires in 72 hours):
{{6}}

Questions? Reply to this message or email {{7}}.
```

### Parameter Mapping

| Placeholder | Value | Example |
|-------------|-------|---------|
| `{{1}}` | Player first name | `Maya` |
| `{{2}}` | Team name | `12U Elite` |
| `{{3}}` | Club name | `Springfield Elite Basketball` |
| `{{4}}` | Head Coach name | `Jordan Martinez` |
| `{{5}}` | Season name | `Spring 2026` |
| `{{6}}` | Acceptance URL (shortened) | `https://app.myhoopclub.com/accept?token=abc123` |
| `{{7}}` | Coach email | `jordan@springfieldelite.com` |

### Rendered Example (what parent sees)

```
Maya has been selected for the *12U Elite* team in
*Springfield Elite Basketball*! 🎉

Coach: Jordan Martinez
Season: Spring 2026

Log in to accept or decline your roster spot (offer expires
in 72 hours):
https://app.myhoopclub.com/accept?token=abc123

Questions? Reply to this message or email
jordan@springfieldelite.com.
```

**Note on emoji:** Meta allows a limited set of emojis in approved templates. `🎉` is commonly approved. Remove if Meta rejects during review — the message still reads clearly without it.

---

## WhatsApp Template — Not Selected Variant

### Template Name
```
tryout_selection_not_selected
```

### Category
`UTILITY`

### Template Body

```
Hi {{1}}, thank you for having {{2}} try out for *{{3}}* ({{4}}).

After careful consideration, we are not offering a roster spot at this time.

We appreciate {{2}}'s effort and hope to see them at future tryouts.

Questions? Contact your coach: {{5}}
```

### Parameter Mapping

| Placeholder | Value | Example |
|-------------|-------|---------|
| `{{1}}` | Parent first name | `Maria` |
| `{{2}}` | Player first name | `Maya` |
| `{{3}}` | Club name | `Springfield Elite Basketball` |
| `{{4}}` | Season name | `Spring 2026` |
| `{{5}}` | Coach email | `jordan@springfieldelite.com` |

### Rendered Example

```
Hi Maria, thank you for having Maya try out for
*Springfield Elite Basketball* (Spring 2026).

After careful consideration, we are not offering a roster
spot at this time.

We appreciate Maya's effort and hope to see them at
future tryouts.

Questions? Contact your coach: jordan@springfieldelite.com
```

---

## WhatsApp Template — Waitlist Variant

### Template Name
```
tryout_selection_waitlist
```

### Template Body

```
Hi {{1}}, {{2}} has been placed on the waitlist for *{{3}}* ({{4}}).

If a roster spot opens up, you'll be the first to hear.

Questions? Contact your coach: {{5}}
```

---

## WhatsApp Template — Registration Confirmation (sent at registration step 4)

This template is used immediately after parent registration is submitted (mock #06 step 4), not after selection. Included here because it uses the same 360dialog channel and should be submitted for Meta approval at the same time.

### Template Name
```
tryout_registration_confirmed
```

### Template Body

```
{{1}} is registered for the *{{2}}* tryout!

📅 {{3}}
📍 {{4}}

You'll receive a notification with their selection result after tryouts are complete.

— {{5}}
```

### Parameter Mapping

| Placeholder | Value | Example |
|-------------|-------|---------|
| `{{1}}` | Player first name | `Maya` |
| `{{2}}` | Tryout name | `12U Spring Tryout 2026` |
| `{{3}}` | Tryout date + time | `Saturday, May 10 · 9:00 AM – 12:00 PM` |
| `{{4}}` | Location name | `Springfield YMCA, Main Gym` |
| `{{5}}` | Club name | `Springfield Elite Basketball` |

---

## 360dialog Implementation Notes

### Sending a template message via 360dialog

```http
POST https://waba-sandbox.360dialog.io/v1/messages
Authorization: Bearer {DIALOG360_API_KEY}
Content-Type: application/json

{
  "to": "+13125550100",
  "type": "template",
  "template": {
    "namespace": "{your-360dialog-namespace}",
    "name": "tryout_selection_selected",
    "language": { "code": "en_US", "policy": "deterministic" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Maya" },
          { "type": "text", "text": "12U Elite" },
          { "type": "text", "text": "Springfield Elite Basketball" },
          { "type": "text", "text": "Jordan Martinez" },
          { "type": "text", "text": "Spring 2026" },
          { "type": "text", "text": "https://app.myhoopclub.com/accept?token=abc123" },
          { "type": "text", "text": "jordan@springfieldelite.com" }
        ]
      }
    ]
  }
}
```

### Phone number format
- Must be E.164 (e.g., `+13125550100`)
- Stored in `users.phone` as E.164 (per data model)
- If `users.phone` is NULL: skip WhatsApp job; log "no phone — email only"

### Sandbox vs production
- Sandbox: `https://waba-sandbox.360dialog.io/v1` — can send to test numbers without Meta-approved templates
- Production: `https://waba.360dialog.io/v1` — requires Meta-approved templates for all outbound messages
- The `DIALOG360_BASE_URL` env var switches between sandbox and production (already implemented in Phase 0 notification service)

### Templates to submit for Meta approval (Phase 1 batch)
Submit all four simultaneously to avoid sequential 1-3 day review delays:
1. `tryout_registration_confirmed`
2. `tryout_selection_selected`
3. `tryout_selection_not_selected`
4. `tryout_selection_waitlist`

Additional templates for Phase 3 (submit now to get ahead — per `pmo/pending-decisions/PHASE-3.md`):
5. `practice_schedule_change`
6. `practice_reminder`
7. `attendance_poll`
8. `payment_reminder`

---

## Character Count Constraints

WhatsApp template bodies have a 1024-character limit. All templates above are well within this limit.

The URL in `{{6}}` (selected template) is the longest variable. If the acceptance URL is very long, a URL shortener should be used. The backend should generate a short token-based URL (e.g., `/a/{short_token}`) rather than including full query params.

---

## Message Delivery Constraints

| Scenario | Handling |
|----------|---------|
| Parent has no phone number | Skip WhatsApp job; send email only; log as "email-only" |
| WhatsApp number not active | 360dialog returns 400/404; log delivery failure; do not retry automatically (could be spammy) |
| Template not yet approved | 360dialog returns 470; log; alert director in dashboard (Phase 3 notification log) |
| Rate limit exceeded | 360dialog returns 429; BullMQ job backs off with exponential retry (max 3 attempts, 5-min intervals) |

---

## Cross-References

- PDD-PHASE-1 flow: Selection Notification (F9) / module-tryouts.md F4
- Related mocks: [08-selection-workflow.md](08-selection-workflow.md) (trigger), [10-selection-notification-email.md](10-selection-notification-email.md) (parallel email), [12-parent-roster-acceptance.md](12-parent-roster-acceptance.md) (link destination)
- Module wiki: [module-tryouts.md](../../../module-tryouts.md)
- Phase-level pending: `pmo/pending-decisions/PHASE-1.md` (WhatsApp template submission), `pmo/pending-decisions/PHASE-3.md` (production 360dialog tier)

---

## Brand Placeholders Flagged

- **Club name in templates (`{{3}}`):** rendered from `clubs.name` — not a visual placeholder; dynamic per tenant
- **"App name" in footer:** WhatsApp templates do not have an app footer (unlike email). Not applicable.
- **Emoji `🎉` in selected template:** subject to Meta approval review; remove if rejected. Not a brand decision.
- **Acceptance URL domain (`myhoopclub.com`):** dev/UAT domain. Production domain (Phase 1 exit decision) will replace this. Backend must use an environment variable for the base URL, not a hardcoded domain.
