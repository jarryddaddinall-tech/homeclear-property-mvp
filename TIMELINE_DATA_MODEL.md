# Timeline Data Model & Permissions

## Firestore Structure
```
transactions (collection)
  - {transactionId}
      buyerId: string
      sellerId: string | null
      property: { address, postcode, price }
      stageIndex: number
      stageLabel: string
      lastUpdateAt: timestamp
      shareTokens: [
        { token: string, expiresAt: timestamp | null, scope: 'read' }
      ]
      participants (subcollection)
        - {participantId}
            userId: string | null
            email: string
            role: 'buyer' | 'seller' | 'agent' | 'solicitor' | 'mortgage-broker' | 'observer'
            permissions: {
              canPost: boolean
              canUpload: boolean
              canManageDocs: boolean
              canInvite: boolean
            }
            verified: boolean
            lastSeenAt: timestamp
      events (subcollection)
        - {eventId}
            createdAt: timestamp
            createdBy: {
              participantId: string | null
              displayName: string
              role: string
              source: 'manual' | 'email' | 'whatsapp' | 'system'
            }
            type: 'update' | 'stage-change' | 'document' | 'task'
            content: {
              text: string
              attachments: [{ storagePath, fileName, mimeType }]
              stageIndex: number | null
              checklistItemId: string | null
            }
            visibility: 'internal' | 'public'
            mentions: [participantId]
            linkedMessageId: string | null   // original email/whatsapp ID
            metadata: {
              parserConfidence: number | null
              rawSourcePath: string | null
            }
```

### Key Ideas
- **events** is the single feed powering the timeline, notifications, and audit history.
- **visibility** supports internal-only notes vs public share view.
- **shareTokens** allow creating revocable read links for purchasers.
- Parser outputs reference raw storage for auditing and future re-processing.

---

## Role Permissions
| Role          | Default Permissions                                             |
|---------------|------------------------------------------------------------------|
| Buyer         | post updates, upload docs, view all events, invite observers     |
| Seller        | same as buyer (if invited)                                       |
| Agent         | post updates, upload docs, mark stage changes, invite solicitor  |
| Solicitor     | post updates, upload docs, mark compliance checks                |
| Mortgage broker | post updates, upload mortgage docs                              |
| Observer      | read-only (e.g., family member)                                  |

- Permissions are customizable per participant. Example: agent can be downgraded to read-only.
- Stage changes require roles flagged with `canManageStages`.
- Only org admins can delete events; regular users can edit their own posts for 10 minutes.

### Share Tokens
- Generated per transaction when buyer clicks “Create share link”.
- Token stored in Firestore with scope `read` and optional expiry.
- Public `LiveDealView` consumes events filtered where `visibility === 'public'`.
- Revoking share link deletes token and invalidates existing URLs.

---

## UI Plan

### Timeline Tab
- **Composer**
  - Text area with placeholder: “Share an update…”.
  - Buttons: Attach file, Tag stage (dropdown), Tag people (`@`).
  - Visibility toggle: `Share with everyone` vs `Internal note` (for agents/solicitors only).
  - Submit triggers `addEvent(transactionId, payload)` Cloud Function for server-side validation.

- **Event Cards**
  - Header: Avatar + name + role pill + timestamp relative (e.g., “3h ago”).
  - Body: Markdown/paragraph text, attachments preview, stage badge if set.
  - Footer: Source chip (`Manual`, `Email`, `WhatsApp`), `Viewed by X/ Y` indicator.
  - Actions: `Edit` (if own post), `Copy link`, `Resolve` (for tasks).

- **Filtering & Search**
  - Role filters (All, Buyer, Agent, Solicitor, System).
  - Free-text search box (client-side for MVP, server-index later).
  - Stage filter to show events related to a specific stage.

### Shareable Public View (`LiveDealView` Upgrade)
- Use same events feed but filtered to `visibility === 'public'`.
- Show context banner: “Last updated 3 hours ago by Sarah (Solicitor).”.
- Provide “Request an update” CTA (emails agent with token context).

---

## Security & Validation
- All event writes go through Cloud Function `createTimelineEvent` to:
  - Ensure participant belongs to transaction.
  - Enforce permission rules (`canPost`, `canManageStages`).
  - Strip HTML, sanitize attachments, enforce size limits.
  - Auto-tag event with `source` and `createdBy` metadata.
- Firestore security rules mirror server logic but function ensures consistent validation.
- Attachments stored under `transactions/{id}/attachments/{eventId}/{filename}` with security rule restricting access to participants.

---

## Next Steps
1. **Data layer** — create Firestore collections & Cloud Function for event creation.
2. **UI layer** — replace `TransactionsDashboard` sample card with timeline view powered by real data.
3. **Share link** — integrate token generation + update `LiveDealView` to fetch by token.
4. **Migration** — build script that seeds first transaction from existing sample data for demos.
