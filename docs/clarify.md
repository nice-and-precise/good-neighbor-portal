# Clarification Questions (Good Neighbor Portal MVP)

This set of questions focuses on decisions that most affect architecture, scope, and implementation risk. Each item includes options, a recommended default (if no answer is provided), and the impact of the decision.

> Source: docs/spec.md and docs/constitution.md (Windows-first, zero‑cloud development, PHP 8.1+, MySQL 8 with SQLite fallback, vanilla HTML/CSS/JS)

---

1) Identity Model for the Demo
- Question: Should users authenticate via fixed demo accounts or a local “magic link” simulation?
- Options:
  - A) Fixed demo accounts (e.g., resident@example, staff@example with known passwords)
  - B) Local magic-link simulation (generate a token and display it in console/UI; no email sending)
- Default (recommended): A) Fixed demo accounts (simpler offline, fewer moving parts)
- Impact: Drives auth flow, seed data, and demo scripts; magic-link simulation adds token management work.

2) Neighborhood Scoping
- Question: Is the MVP single-neighborhood or multi-tenant (multiple neighborhoods) in one instance?
- Options:
  - A) Single neighborhood demo (one dataset)
  - B) Multi-tenant demo (neighborhood_id in all entities; switcher in UI)
- Default (recommended): A) Single neighborhood (reduced schema and UI complexity)
- Impact: Affects schema, routing, access rules, test data volume, and future migration effort.

3) PII and Retention Policy (Demo Data)
- Question: What PII is permitted in demo data, and how long should it persist?
- Options:
  - A) Minimal PII (first name, last initial, city; no exact address, no real emails)
  - B) Full mock PII (full addresses, emails) but clearly marked as fake
- Default (recommended): A) Minimal PII + explicit “Demo Data” labels
- Retention: All demo data can be reset at any time; no long-term retention.
- Impact: Influences seed data, UI masking, and compliance posture.

4) Demo Billing Scenarios and Rules
- Question: How are success/failure outcomes determined in the billing demo?
- Options:
  - A) Deterministic by test card or toggle (e.g., last digit parity)
  - B) Configurable via UI switch in an "Admin Demo Controls" panel
- Default (recommended): A) Deterministic by test input + environment/config flag
- Impact: Affects test flows, documentation, and edge case coverage (receipts, errors).

5) Request Queue Updates: Real-time vs Polling
- Question: How are staff request queues updated?
- Options:
  - A) Short-interval polling (e.g., every 5s)
  - B) Server-Sent Events or WebSockets (local only)
- Default (recommended): A) Polling (simplest, offline-friendly, PHP-compatible without extra deps)
- Impact: Impacts perceived responsiveness and implementation complexity.

6) Language Coverage Scope
- Question: Which second language should MVP support fully in UI labels?
- Options:
  - A) Spanish (es)
  - B) Other (specify)
- Default (recommended): A) Spanish (aligns with acceptance scenario)
- Impact: Determines i18n resource files, coverage, and QA requirements.

7) Offline Operation Limits
- Question: What operations must work offline after initial setup?
- Options:
  - A) Entire MVP flows (login, schedules, requests, queue updates via local DB)
  - B) All except email-like features (which are simulated via console/UI)
- Default (recommended): B) All features offline with email simulated (no network calls)
- Impact: Constrains integrations; mandates local mocks/stubs and clear sandbox messaging.

8) Route Summary Data Source and CSV Format
- Question: What is the data source and required CSV columns for route summary export?
- Options:
  - A) Derived from demo service schedule + requests (local DB)
  - B) Separate seeded summary table
- Default (recommended): A) Derived from existing demo data
- CSV Columns (proposed): service_day, route_name, pickup_count, area_code, generated_at
- Impact: Affects reporting queries, test coverage, and export validation.

9) Demo Data Reset Behavior While Running
- Question: May the reset script run while the server is active?
- Options:
  - A) Disallow reset while server running; script checks and exits with message
  - B) Allow reset; app detects reset and reloads demo data safely
- Default (recommended): A) Disallow during runtime (simpler, avoids corruption)
- Impact: Influences script logic and operator guidance; reduces risk of partial resets.

10) MVP Boundaries for Staff Tools
- Question: What is the exact scope of staff tooling in MVP?
- Options:
  - A) View queue, update status (New, In review, Scheduled, Done), leave short notes; CSV export only
  - B) Plus bulk status updates and user management
- Default (recommended): A) Minimal toolset (view/update/notes + CSV)
- Impact: Limits UI and schema complexity; improves deliverability and demo focus.

---

How to proceed
- Answer these 10 questions (accept defaults or specify alternatives).
- If no answers are provided, we will proceed with the recommended defaults and note assumptions in docs/plan.md.
- After decisions, run /plan to lock the technical approach and produce actionable tasks.
