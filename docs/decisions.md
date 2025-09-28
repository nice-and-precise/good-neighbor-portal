# Clarification Decisions — Good Neighbor Portal MVP

These are the selected answers from /clarify that drive architecture and scope.

1. Identity model: B — Local magic‑link simulation (token generated and shown in UI; no email sending)
2. Neighborhood scoping: B — Multi‑tenant demo (neighborhood_id across entities, neighborhood switcher in UI)
3. PII & retention: B — Full mock PII allowed (clearly fake/labelled), resettable at any time
4. Demo billing outcomes: A — Deterministic by test input/config flag (e.g., last digit parity)
5. Request queue updates: A — Polling (~5s)
6. Second language: A — Spanish (es)
7. Offline limits: B — All features offline; any “email” simulated in UI (no network)
8. Route summary source: A — Derived from demo service schedule + requests; prefer Willmar, MN data
9. Reset behavior: A — Disallow reset while server is running
10. Staff tools scope: A — Minimal (view queue, update status, notes, CSV export)

Assumptions: “Willmar, MN” used in demo data (addresses/areas); no external services used; magic‑link displayed in UI as a copyable link/token.

Repository & Release Management:
- Repository visibility: Private by default; collaborators added explicitly as needed
- CHANGELOG: Maintain `CHANGELOG.md` with milestone summaries (M1, M2, ...)

Tooling & Cross-platform (update):
- Windows-first tooling with PowerShell scripts for setup, run, reset, export, and lint to maintain ergonomic development workflows.
