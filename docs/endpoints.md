# API Endpoints

This document enumerates the current API endpoints for the Good Neighbor Portal demo.

Authentication & Session
- GET /api/csrf.php → Returns a CSRF token derived from CSRF_SECRET.
- POST /api/auth_request.php { email, tenant } → Issues a demo magic-link token and seeds demo data.
- POST /api/auth_verify.php { token, tenant } → Verifies token and binds the session.
- GET /api/session.php → Returns current session info.
- GET /api/logout.php → Clears the active session.
- GET /api/tenants.php → Lists available tenants and the active tenant.

Resident Dashboard & Activity
- GET /api/dashboard.php → Returns profile basics, next_pickup_date, billing, and last_request.
- GET /api/recent_activity.php → Lists recent service requests and billing entries (combined feed).

Service Requests
- POST /api/request_create.php { category, description } → Creates a new service request for the resident.
- GET /api/request_get.php?id=ID → Returns detailed information about a request (scoped to resident & tenant).

Billing
- GET /api/billing_get.php?id=ID → Returns detailed information about a billing charge (scoped to resident & tenant).

Staff Demo Endpoints (DEMO ONLY)
These are demo-only surfaces. They require a valid session and the demo staff header `X-Staff-Key` matching `STAFF_DEMO_KEY` in config.
- POST /api/request_status_update.php { id, action } → Transitions a request status. Allowed actions: ack, in_progress, done, cancelled.
- POST /api/request_note_create.php { request_id, note } → Adds a staff note to a request.
- GET /api/request_notes.php?request_id=ID → Lists staff notes for a request (includes staff_name and created_at).
- GET /api/staff_queue.php?status=new|ack|in_progress|done|cancelled → Returns a list of requests for staff triage.

Security & Headers
- CSRF: All POST endpoints require `X-CSRF` header with the token from /api/csrf.php.
- Staff demo: Staff endpoints require `X-Staff-Key` header matching config value.
- Sessions: Standard PHP sessions; cookie name comes from `SESSION_NAME` in config.

Tenancy
- All endpoints operate in the context of the tenant selected at login. Data access is tenant-scoped.

Notes
- This is a demo-only surface. In production, magic-link tokens are delivered via email, and role-based access would enforce staff privileges instead of a shared header key.
