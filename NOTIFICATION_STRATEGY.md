# Notification & Trust Strategy

## Objectives
- Keep buyers informed without overwhelming agents/solicitors.
- Highlight responsiveness and reliability to build trust.
- Provide actionable nudges when transactions stall.

---

## Notification Types

| Event Type                 | Channels                         | Recipients                        | Notes |
|----------------------------|----------------------------------|-----------------------------------|-------|
| Timeline update (manual)   | In-app toast, email digest       | Buyer, Seller, Tagged participants| Batch email into digest when <24h |
| Timeline update (ingested) | Push (mobile app later), email   | Buyer, Tagged participants        | Highlight source (`Email from firm`) |
| Stage change               | Immediate email + optional SMS   | All core participants             | Include checklist of next steps |
| Document uploaded          | Email to requesting party        | Buyer/Solicitor depending on doc  | Provide download link (token protected) |
| SLA breach (no update)     | In-app banner + email reminder   | Responsible participant + buyer   | Send after configurable threshold (e.g., 48h) |
| Share link access          | Security email                   | Buyer                             | Alert when public link viewed |
| Parser failure             | Email/SMS to agent               | Agent, optionally solicitor       | Request manual upload |

### Frequency Controls
- Default digest cadence: **daily at 7pm** (if >1 update and no critical alerts).
- Critical events (stage change, overdue tasks) bypass digest with immediate send.
- Users can adjust preferences per channel (email immediate/daily/off).

---

## Delivery Stack
- **Email:** Firebase Function using SendGrid; templates stored in Firestore (`notificationTemplates`).
- **SMS:** Twilio (only for critical SLA breaches and stage changes with consent).
- **In-app:** `ToastProvider` for real-time flashes; add notification center panel in dashboard header.
- **Push (future):** Expo/Firebase Cloud Messaging once mobile shell exists.

---

## Trust Indicators

### 1. Response Timers
- Track delta between `events.createdAt` per participant.
- Display in right sidebar (Transaction Hub):
  - “Solicitor response time (avg): 18h”
  - “Last update from Agent: 3d ago” with warning color after SLA threshold.

### 2. Reliability Badges
- Metrics stored in `participants` document:
  - `updatesLast30d`
  - `slaBreachesLast30d`
  - `documentsOnTimeRatio`
- Badge logic: 
  - `Reliable` (green) if <10% breaches and >5 updates.
  - `Needs attention` (amber) if 10–30% breaches.
  - `At risk` (red) if >30% breaches.
- Show badge on participant card + public share link.

### 3. Stage Health
- Derived from events/checklist completion.
- Visual indicator on stage list: green (on track), amber (awaiting response), red (overdue).
- Calculation: if `lastEvent.createdAt` older than SLA for stage, flag.

### 4. Buyer Confidence Meter
- Score from 0–100 displayed in header, based on:
  - % of tasks completed
  - Average response time
  - Number of outstanding documents
- Provide tooltip explaining factors to keep transparency.

---

## Implementation Phases
1. **Phase 1 (MVP)**
   - Immediate emails for stage changes + timeline updates.
   - Daily digest for low-priority updates.
   - Basic response timer (time since last agent/solicitor update).

2. **Phase 2**
   - Add SLA settings per transaction.
   - Introduce reliability badges.
   - SMS notifications for critical events.

3. **Phase 3**
   - Notification center UI with read/unread state.
   - Push notifications for mobile app.
   - Buyer confidence meter with historical trend.

---

## Dependencies
- Accurate timestamps in `events` collection.
- Participant contact info and notification preferences stored in Firestore (e.g., `participants/{id}.preferences`).
- Background scheduler (Cloud Scheduler) to trigger daily digests and SLA checks.

---

## Risks & Mitigations
- **Over-notification:** Provide granular preferences + digests.
- **Data accuracy:** Use ingestion confidence; require manual confirmation when low.
- **Privacy:** Respect GDPR—allow participants to opt out, log consent.
