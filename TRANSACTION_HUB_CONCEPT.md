# Transaction Hub Concept

## Purpose
Create a single workspace where buyers, sellers, agents, and solicitors see the same transaction, timeline, contacts, and next steps. Replace the current static cards with a structured, collaborative hub.

---

## Screen Structure (3-column layout)

```
┌────────────────────────────────────────────────────────────┐
│ Header: Address · Price · Last update · Share link button   │
├───────────────┬──────────────────────────┬──────────────────┤
│ Left Sidebar  │ Main Panel               │ Right Sidebar    │
│               │                          │                  │
│ - Stage list  │ [Timeline Tab]           │ People & Actions │
│ - Progress %  │  - Update composer       │  - Assignees     │
│ - Key dates   │  - Event feed            │  - Contact info  │
│               │                          │  - SLA timers    │
│               │ [Documents Tab]          │  - Quick actions │
│               │  - Uploads list          │                  │
│               │  - Requested docs        │------------------│
│               │                          │ Suggested next   │
│               │ [Tasks Tab]              │ steps            │
│               │  - Checklist             │ - Pending items  │
│               │  - Auto-tasks from email │ - Last update    │
└───────────────┴──────────────────────────┴──────────────────┘
```

### Left Sidebar (Status Overview)
- **Stage tracker:** 11 UK conveyancing stages with current stage highlighted.
- **Key dates:** Offer accepted, searches ordered, target exchange/completion.
- **Progress ring:** % complete based on stage order + checklist completion.
- **Share link CTA:** Copy public read-only link (`LiveDealView` 2.0).

### Main Panel (Tabbed)
1. **Timeline** *(default)*
   - Rich composer (text, attachments, role tags, source).
   - Event cards with badges: `Manual`, `Email parser`, `WhatsApp parser`.
   - Inline filters (All / Buyer / Agent / Solicitor / System).
   - Slack-style `@` mentions (notify participants).

2. **Documents**
   - Grid/list grouped by type (ID, Mortgage, Contracts).
   - Status pills: `Requested`, `Uploaded`, `Approved`.
   - Quick upload + assign to participant.

3. **Tasks / Checklist**
   - Shared to-do list with due dates and owner.
   - Auto-create tasks from parsed email instructions.
   - Buttons for “Mark complete” and “Request update”.

### Right Sidebar (People & Actions)
- **Participants**
  - Avatars, roles, firm, contact details.
  - Status indicator (Online now, Last seen, Pending invite).
  - Verification badge when solicitor/agent verified.
- **Response SLAs**
  - “Solicitor last update: 2d ago — SLA 24h (⚠️ overdue)”.
  - Action buttons: `Nudge`, `Call`, `Email summary`.
- **Suggested Next Steps**
  - Contextual tasks based on stage (e.g., “Buyer to sign mortgage offer”).
  - Pull from automation rules + manual overrides.

---

## Additional Views
- **Transaction List View**
  - Replaces current multi-card dashboard.
  - Columns: Stage, Buyer, Agent, Last update, Alerts.
  - Filters by user role.

- **Mobile Adaptive Layout**
  - Collapsible left/right sidebars into accordions at top/bottom.
  - Timeline stays primary; quick actions accessible via floating button.

---

## Implementation Notes
- **Navigation:** Replace `TransactionsDashboard` usage of static sample data with router-based navigation to `/transactions/:id`.
- **State management:**
  - `transactions` collection => basic metadata.
  - `transactions/{id}/events` => timeline entries.
  - `transactions/{id}/participants` => roles and permissions.
- **Permissions:**
  - Buyer/Seller can post manual updates.
  - Solicitor/Agent updates appear via ingestion or manual entry.
  - Viewer tokens read-only.
- **Incremental delivery:**
  1. Ship timeline-only version with manual posts.
  2. Add documents and checklist later.
  3. Layer SLA indicators once event timestamps collected.

---

## Why This Matters
- Brings MVP into alignment with “communication layer” beachhead.
- Gives buyers a single source of truth without forcing solicitors/agents to switch tools.
- Sets foundation for automated ingestion and trust metrics in later steps.
