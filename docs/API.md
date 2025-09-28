# API Reference

All endpoints return JSON unless otherwise noted. For POST requests, include the `X-CSRF` header with the token from `GET /api/csrf.php`. Standard PHP sessions are used.

## Authentication Flow (Magic Link Demo)

```
POST /api/auth_request.php { email, tenant }
→ Returns: { ok, token, expires_at, tenant }

POST /api/auth_verify.php { token, tenant }
→ Creates session; returns: { ok, user_id, tenant_id }
```

Notes
- In production, the token would be emailed and not returned in the response.
- Session fields: `$_SESSION['user_id']`, `$_SESSION['tenant_id']` set by `auth_verify`.

## Core Endpoints

- `GET /api/csrf.php`
  - Returns `{ ok, csrf }` used for the `X-CSRF` header.

- `GET /api/tenants.php`
  - Returns `{ ok, tenants: [{id,slug,name}], active }`.
  - Auto-bootstraps the SQLite database (schema/seed) on first run.

- `GET /api/dashboard.php`
  - Requires session.
  - Returns `{ ok, profile, next_pickup_date, billing, last_request }`.

- `GET /api/recent_activity.php`
  - Requires session.
  - Returns a merged feed: `{ ok, items: [{ kind: 'request'|'billing', ... }] }`.

- `POST /api/request_create.php` { category, description }
  - Requires session and `X-CSRF`.
  - Allowed categories: `bulk_pickup`, `container_swap`, `issue_report`.
  - Returns `{ ok, id, status }`.

- `GET /api/request_get.php?id=ID`
  - Requires session.
  - Returns `{ ok, request }` (scoped to tenant and resident).

- `GET /api/billing_get.php?id=ID`
  - Requires session.
  - Returns `{ ok, charge }` (scoped to tenant and resident).

- `GET /api/session.php`
  - Returns `{ ok, auth: { user_id, tenant_id } }`.

- `GET /api/logout.php`
  - Returns `{ ok: true }` and clears the session.

## Staff Demo Endpoints

These endpoints simulate staff workflows. They require a valid resident session and the header `X-Staff-Key` matching `STAFF_DEMO_KEY` in `config/app.env` (default `demo-staff`).

- `GET /api/staff_queue.php?status=new|ack|assigned|in_progress|done|cancelled`
  - Returns `{ ok, items, status }`.

- `POST /api/request_status_update.php` { id, action }
  - Actions: `ack`, `in_progress`, `done`, `cancelled`.
  - Returns `{ ok, id, status, updated_at }`.

- `POST /api/request_note_create.php` { request_id, note }
  - Returns `{ ok, id }`.

- `GET /api/request_notes.php?request_id=ID`
  - Returns `{ ok, notes: [{ id, staff_name, note, created_at }] }`.

## Billing (Demo)

- `POST /api/pay_demo.php` { amount_cents, method }
  - Requires session and `X-CSRF`.
  - Deterministic sandbox: even cents succeed; odd cents fail.
  - On success, a billing charge entry is recorded with description "Demo payment receipt".
  - Returns `{ ok, method, amount_cents, sandbox, message }` (HTTP 200/402).

## CSV Export

- `GET /api/route_summary.csv.php`
  - Requires session.
  - Returns a CSV file with aggregated pickups by service day and neighborhood.

## Error Handling

- 401 Not Authenticated: `{ ok: false, error: 'not_authed' }`
- 403 Forbidden (CSRF or staff key): `{ ok: false, error: 'bad_csrf' | 'forbidden' }`
- 404 Not Found: `{ ok: false, error: 'not_found' }`
- 422 Validation errors: `{ ok: false, error: 'invalid_*' }`
- 500 Server errors: `{ ok: false, error: 'server_error' }`

All responses include `{ ok: boolean, error?: string }` and may add fields as documented above.
