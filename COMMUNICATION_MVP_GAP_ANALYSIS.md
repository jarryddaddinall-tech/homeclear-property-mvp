# Communication MVP Gap Analysis

## Vision Reminder
- **Vision:** One digital platform connecting every part of the UK property journey by fixing communication and coordination gaps.
- **Beachhead MVP:** Communication layer for property sales where buyers, sellers, agents, and solicitors share updates in one place.

---

## Pillar-by-Pillar Assessment

### 1. Transparency — “Everyone knows what’s happening”
- **Shipped:**
  - `TransactionsDashboard` showcases stage-based cards (static sample data).
  - `LiveDealView` offers a public read-only timeline with printable summary.
  - Basic role-based UX via `RoleSelection` and sidebar navigation.
- **Gaps:**
  - No link between real transaction records and the live view.
  - Progress data is hard-coded; no actual stage ownership or timestamps.
  - Buyers cannot see who last took an action or when it happened.
- **Opportunities:**
  - Back a transaction hub with Firestore collection (`transactions/{id}`) storing stage, timestamps, assignee, and audit log.
  - Promote `LiveDealView` to a token-based, read-only share of the same data used internally.

### 2. Communication — “Everyone can talk and update in one place”
- **Shipped:**
  - Toast notifications + skeleton loaders provide UX polish.
  - Role-based dashboards display different cards but lack messaging.
- **Gaps:**
  - No place to post structured updates or messages per transaction.
  - No participant list or ability to tag parties (buyer, agent, solicitor).
  - Timeline entries are not writable—no “add update” CTA.
- **Opportunities:**
  - Create a `timelineEvents` subcollection (`transactions/{id}/events`) with manual posts.
  - UI: add “Timeline” tab with composer (rich text, attachment placeholder, role tags).
  - Allow observers to subscribe via email/SMS for push updates.

### 3. Automation & Data — “Routine updates, verification, and compliance are automatic”
- **Shipped:**
  - Firebase Cloud Functions skeleton + email/WhatsApp parsing scripts exist but aren’t integrated.
  - `EMAIL_PARSING_SETUP.md` documents ingestion concepts.
- **Gaps:**
  - Parsed content does not flow into the product UI.
  - No mapping between parsed emails and transactions/participants.
  - No compliance checklist surfaced to users.
- **Opportunities:**
  - Route parser outputs into `timelineEvents` with `source=email` or `source=whatsapp` metadata.
  - Introduce verification flags (e.g., AML received, funds verified) surfaced in timeline cards.
  - Record raw source and confidence score for auditing.

### 4. Trust & Reputation — “Parties are rated on reliability”
- **Shipped:**
  - None beyond placeholder avatars in `TeamCard`.
- **Gaps:**
  - No reliability metrics, SLAs, or response time tracking.
  - No verification badges for solicitors/agents.
- **Opportunities:**
  - Track per-participant metrics (`avgResponseTime`, `updatesLast7d`).
  - Display “Verified firm” badges once KYC/engagement docs are uploaded.
  - Add a simple “last update” timer to highlight delays.

### 5. Discovery & Research — “Better data for decisions before buying or renting”
- **Shipped:**
  - Investor/Property owner dashboards, property cards, mock charts.
- **Gaps:**
  - Off-beachhead features risk diluting focus; no integration to transaction communication.
- **Opportunities:**
  - Defer advanced research features until communication MVP gains traction.
  - Keep relevant property context (address, price, key stats) inside the transaction hub only.

---

## Key Misalignments
1. **Communication MVP lacks real data** — dashboards rely on static examples; no shared timeline.
2. **External parties still siloed** — parser tooling exists but doesn’t surface updates for buyers.
3. **Trust signals absent** — no metrics or transparency into who is responsive.
4. **Scope drift** — multiple dashboards (investor/property owner) distract from communication wedge.

---

## Recommended Focus (Next 4 Weeks)
1. **Wire up a transaction hub** backed by Firestore with real records.
2. **Launch a collaborative timeline** where roles can post updates (manual first).
3. **Connect ingestion pipeline** so parsed solicitor/agent emails create timeline events automatically.
4. **Layer lightweight trust indicators** (time since last update, role badges).

These steps align the existing build with the original mission, proving value for buyers first while respecting agents/solicitors’ existing tools.
