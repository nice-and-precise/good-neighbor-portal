# Technical Architecture Guide

## System Overview

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   Frontend      │    │  PHP Backend │    │  SQLite DB  │
│  (Vanilla JS)   │◄──►│   (API)      │◄──►│   (Local)   │
│  Hash Routing   │    │  Session Mgmt│    │ Multi-tenant│
└─────────────────┘    └──────────────┘    └─────────────┘
```

- Frontend: A lightweight SPA in `public/index.html` with `public/app.js` (no frameworks). Routing uses location.hash for detail views like `#request/<id>` and `#billing/<id>`.
- Backend: PHP 8.1+ JSON endpoints in `public/api/` using small helper classes from `src/Lib/` for config, DB, HTTP, and utilities.
- Database: SQLite file `data/app.db`. The schema and seed are in `data/schema.sql` and `data/seed.sql`. Auto-bootstrap for SQLite runs on first `/api/tenants.php` call.

## Directory Structure

- `/public/` - Web-accessible files (index.html, app.js, favicon). `index.php` serves `index.html` with no-cache headers. `app.php` serves `app.js` with cache-busting headers for dev.
- `/public/api/` - JSON API endpoints: auth, dashboard, activity, requests, billing, staff queue, CSV export, i18n, diagnostics.
- `/src/Lib/` - Core PHP classes:
  - `Config.php`: Reads `config/app.env` (falls back to `config/app.example.env`).
  - `Db.php`: PDO wrapper with SQLite path resolution, driver checks, and `ensureBootstrapped()` for schema/seed.
  - `Http.php`: Session start (with dev-only X-Dev-Session fallback), method guard, JSON body parser, CSRF guard.
  - `Util.php`: JSON responses, CSRF token HMAC, error logging.
  - `Validator.php`: Basic input validation helpers.
- `/data/` - Database schema, seed data, and SQLite file (`app.db`).
- `/docs/` - Spec Kit methodology files and technical docs.
- `/.specify/scripts/` - PowerShell automation for setup, run, tests, reset.

## Database Design

- Multi-tenancy: All core entities contain `tenant_id` foreign keys. Tenants are stored in `tenants(slug,name)`.
- Authentication: `magic_links` stores demo tokens with `expires_at` and `used_at`. Tokens are returned in API for offline demo.
- Core Entities:
  - `users` (resident/staff/admin),
  - `neighborhoods`, `addresses`,
  - `service_requests` (status lifecycle: new → ack → in_progress → done/cancelled),
  - `staff_notes`,
  - `billing_charges`.
- Demo Data: Two tenants are seeded: `willmar-mn` and `kandiyohi-mn` with neighborhoods, addresses, users, and a sample billing charge.

## API Architecture

- Style: REST-like endpoints returning JSON from `public/api/*.php`.
- Sessions: Standard PHP sessions. For dev, when cookies are blocked (e.g., embedded previews), an `X-Dev-Session` header can carry a synthetic session id.
- CSRF: All POST endpoints require `X-CSRF` header from `/api/csrf.php`. Token is an HMAC of the session id with `CSRF_SECRET`.
- Staff Demo Auth: Staff operations require the header `X-Staff-Key` equal to `STAFF_DEMO_KEY` in `config/app.env` (default `demo-staff`). In production, replace with role-based auth.

## Frontend Application Flow

- Login: User selects a tenant and submits email. `/api/auth_request.php` creates/returns a magic-link token; `/api/auth_verify.php` binds the session.
- Dashboard: After login, UI loads `/api/dashboard.php` (next pickup date, last request, billing) and `/api/recent_activity.php` (merged feed).
- Requests: Create via `/api/request_create.php`; detail view loads `/api/request_get.php` and `/api/request_notes.php` with polling.
- Staff Queue: Demo-only list via `/api/staff_queue.php` with status filter and optional auto-refresh. Status updates and notes use POST endpoints with CSRF and `X-Staff-Key`.
- Billing: Deterministic demo payments via `/api/pay_demo.php`; details via `/api/billing_get.php`.
- i18n: Toggle persists language in session via `/api/i18n_switch.php`. Strings are in `public/i18n/en.json` and `public/i18n/es.json`.

## Security Considerations (Demo)

- Magic-link tokens are returned in API for demo only; in production, deliver via email and enforce single-use + throttling.
- Staff header key is a demo-only shared secret. Replace with authenticated roles and permissions.
- CSRF protection is required for POSTs. Ensure session cookie works; if in an embedded browser, prefer opening in the system browser.
- SQLite is sufficient for demo and offline; move to MySQL/PostgreSQL for multi-user production.

## Operations and Tooling

- Dev Server: `./.specify/scripts/powershell/run.ps1` starts PHP with `pdo_sqlite/sqlite3` enabled.
- Setup: `./.specify/scripts/powershell/setup.ps1` creates config, migrates, and seeds DB.
- Tests: `tests/smoke.ps1` and `tests/pay-deterministic.ps1`; unit tests under `tests/unit/`.
- Diagnostics: `/api/diag.php` and `/api/cookie_diag.php`.
