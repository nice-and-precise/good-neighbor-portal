# Implementation Plan — Good Neighbor Portal (MVP)

Inputs: docs/constitution.md, docs/spec.md, docs/decisions.md

## 1) Summary of Decisions
- Auth: Local magic‑link simulation (no email sending; token shown in UI)
- Tenancy: Multi‑tenant (neighborhood_id in entities, UI switcher)
- PII: Full mock PII OK (clearly fake); reset anytime
- Billing Demo: Deterministic outcomes by test input/config
- Queue Updates: Poll every ~5s
- i18n: English + Spanish
- Offline: All features offline; email simulated in UI
- Route Summary: Derived from demo data; use Willmar, MN routes/areas
- Reset: Disallow while server running
- Staff Tools: Minimal (view/update/notes/CSV)

## 2) Architecture Overview
- Backend: PHP 8.1+ (built‑in server)
- Data: SQLite default (PDO) with MySQL optional via DSN
- Frontend: Vanilla HTML/CSS/JS; hash router
- Sessions: PHP session; magic‑link token table with TTL
- i18n: JSON resources (en, es); runtime toggle with fetch
- Scripts: PowerShell‑first (setup/run/reset/export)

## 3) Data Model (SQLite)
- neighborhoods(id, name, area_code)
- users(id, neighborhood_id, role, email, display_name, locale)
- magic_links(id, user_id, token, expires_at, used_at)
- residents(id, user_id, service_address, service_day)
- schedules(id, resident_id, next_pickup_date, calendar_json)
- billing(id, resident_id, tx_id, amount_cents, status, created_at)
- requests(id, resident_id, type, description, status, staff_notes, created_at, updated_at)
- routes(id, neighborhood_id, service_day, route_name, area_code)
- route_stats(id, route_id, service_day, pickup_count, generated_at)

## 4) Routes (Current M2 implementation)
- GET / → Login page (public/index.php)
- GET /api/csrf.php → CSRF token
- GET /api/tenants.php → tenant list
- POST /api/auth_request.php → create token (demo returns it)
- POST /api/auth_verify.php → exchange token -> session
- GET /api/session.php → current session
- GET /api/logout.php → destroy session
- GET /i18n/:locale.json → localized strings
- POST /i18n/switch
- GET /resident/dashboard
- GET /resident/billing
- POST /resident/pay (deterministic)
- GET /resident/request/new
- POST /resident/request
- GET /staff/dashboard (activity feed)
- GET /staff/queue?status=new|in_review|scheduled|done
- POST /staff/request/:id/status
- GET /reports/route-summary.csv
- GET /neighborhoods → list for switcher; POST /neighborhoods/switch

## 5) Directory Structure
public/index.php, assets/, src/{Controllers,Models,Views,Lib}, config, i18n, data, scripts, tests, docs (see decisions)

## 6) Magic‑link Flow (Offline)
- Request link: user selects email from seeded users; server generates token (UUID), stores in magic_links with 5‑minute TTL; UI shows token URL (copy)
- Login: UI fetches GET /magic-link/login?token=...; server validates, sets session; prevents reuse
- No email provider used; UI conveys sandbox messaging

## 7) i18n
- en.json + es.json; key-based lookups, dynamic replacement; toggle persists in session

## 8) CSV Export
- Columns: service_day, neighborhood_name, route_name, pickup_count, area_code, generated_at
- Derived from requests + schedules; filtered by current neighborhood

## 9) Scripts (PowerShell)
- setup.ps1: create DB, run schema.sql, seed.sql (Willmar data), write app.env
- run.ps1: start PHP built-in server and enable sqlite extensions via -d flags
- reset-demo.ps1: guard server running; recreate DB; re-seed
- export.ps1: GET reports/route-summary.csv and save to exports/
- test-auth.ps1: end-to-end test for demo auth flow using a persisted WebSession

## 10) Tests
- tests/smoke.ps1: headless flow — request magic link, login, create request, staff sees it, update status, export CSV
- tests/unit/validator_test.php: input validation, deterministic billing outcomes

## 11) Milestones
- M1 Scaffold + DB + scripts
- M2 Magic‑link auth + neighborhood switcher
- M3 Resident dashboard + billing demo
- M4 Requests + confirmations
- M5 Staff queue + polling + notes
- M6 Route summary + CSV
- M7 i18n + toggle + smoke tests

## 12) Risks
- Magic‑link UX without email could confuse; mitigate with clear UI copy
- Multi‑tenant adds schema/UI complexity; constrained to switcher + filters
- Offline + polling acceptable for MVP; document demo‑only nature
