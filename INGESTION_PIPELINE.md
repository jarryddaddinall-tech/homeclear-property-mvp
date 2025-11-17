# External Update Ingestion (Email & WhatsApp)

## Goals
- Let solicitors and agents continue using their existing email/WhatsApp workflows.
- Capture their updates automatically and push them into the transaction timeline for buyers.
- Maintain audit trail of original messages and surface confidence + parsing status.

---

## High-Level Flow
```
Solicitor email / WhatsApp message
        │
        ▼
Forwarding / Twilio Webhook
        │
 Firebase Function (parser)
        │
Structured payload (JSON)
        │
Transaction Resolver (match transaction + participant)
        │
Timeline Event Creator
        │
Firestore: transactions/{id}/events
```

### Channels
1. **Email**
   - Use mailbox `updates@homeclear.co.uk` with auto-forward to Cloud Function (SendGrid Inbound Parse or AWS SES).
   - Function `emailParser` extracts subject, body, attachments, sender email.

2. **WhatsApp**
   - Twilio Sandbox/webhook -> Cloud Function `whatsappParser`.
   - Extract sender phone, message text, media URLs.

---

## Lambda / Function Responsibilities

### 1. Normalize Payload
- Convert email/WhatsApp metadata into common schema:
  ```json
  {
    "channel": "email",
    "sender": {
      "address": "solicitor@firm.co.uk",
      "name": "Michael Chen"
    },
    "text": "Searches ordered on 14/10",
    "attachments": [ ... ],
    "timestamps": {
      "received": "2025-11-07T10:15:00Z"
    },
    "raw": {
      "storagePath": "raw/email/{uuid}.eml"
    }
  }
  ```
- Store raw payload in Cloud Storage for auditing.

### 2. Match Transaction & Participant
- Lookup participant by email/phone in `transactions/{id}/participants`.
- If multiple matches, apply heuristics:
  - Prioritize active transactions (stage < Completion).
  - Use subject keywords (address, buyer name) to disambiguate.
- If no match, queue for manual review (write to `ingestion_queue` collection with status `needs_triage`).

### 3. Parse Content
- Apply rule-based parsing (existing `functions/emailParser.js`) to identify intents:
  - Stage changes (regex on “exchange”, “completion” etc.).
  - Document references ("attached ID").
  - Deadlines (“by Friday”).
- Return structured actions: `{ stageIndex, checklistItemId, attachments }`.
- Attach `confidence` score; lower than threshold => mark event as `draft` and notify buyer to confirm.

### 4. Create Timeline Event
- Call shared helper (`createTimelineEvent`) with:
  - `source='email' | 'whatsapp'`
  - `visibility='public'` by default unless message flagged as internal.
  - `content.text` = cleaned body.
  - `metadata.rawSourcePath`, `metadata.parserConfidence`.
- If parser detected stage change, update `transactions/{id}.stageIndex` atomically.

### 5. Notifications
- After event creation, enqueue notification job (see `NOTIFICATION_STRATEGY.md`).
- If message fails parsing, notify agent/solicitor to switch to manual portal update.

---

## Error Handling & Monitoring
- All failures logged to `functions` logs + stored in `ingestion_errors` collection.
- Dashboard for errors: filter by channel, last 24h volume.
- Auto-retry for transient errors (network, storage upload).
- Manual triage UI could live under `/admin/ingestion` for future.

---

## Security & Compliance
- Verify inbound email sender domain against participant list.
- Generate per-transaction secret alias (e.g., `txn123@updates.homeclear.co.uk`) to reduce spoofing.
- WhatsApp: whitelist participant phone numbers.
- Attachments virus-scanned via Cloud Storage `clamav` function before exposure.

---

## Incremental Delivery
1. **Phase 1** — Email forwarding only, single transaction match by alias, manual confirmation of parsed updates.
2. **Phase 2** — Add WhatsApp channel + auto stage updates with confidence threshold.
3. **Phase 3** — Build triage dashboard & training feedback loop for parser improvements.
