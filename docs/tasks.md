# Tasks — Good Neighbor Portal (Aligned to Plan)

Reference: docs/plan.md, docs/spec.md, docs/decisions.md

## M1: Scaffold, DB, Scripts
- Create directories per plan
- Add config/app.example.env, .gitignore for data/app.db and config/app.env
- Implement data/schema.sql and data/seed.sql (Willmar, MN demo data)
- Implement src/Lib/{Db.php,Config.php,Validator.php,Util.php}
- Add scripts/setup.ps1, scripts/run.ps1, scripts/reset-demo.ps1, scripts/export.ps1
- Reset guard: in reset-demo.ps1, detect if PHP server is running on :8080 (port/process check). If active, abort with clear message.
- Optional (parity): add bash equivalents for setup/run/reset/export in scripts/bash/ (can be deferred if Windows-only MVP)

## M2: Auth + Tenant Switcher (SPA)
- SPA login in `public/index.html` + `public/app.js`
- JSON endpoints: `public/api/` for csrf, tenants, auth_request, auth_verify, session, logout
- Tenant switcher in SPA; persist selection in session

## M3: Resident Dashboard + Billing Demo
- SPA dashboard UI: next pickup, billing history (implemented)
- Endpoint `GET /api/dashboard.php` (implemented)
- Deterministic pay endpoint; sandbox messaging (planned)
- FAQs/announcements static section/page (FR-005) (planned)

## M4: Service Requests + Confirmations
- Endpoints: request_create, request_get (implemented)
- SPA form for new request; show confirmation ID in UI (implemented)

## M5: Staff Queue + Notes + Polling
- Staff transitions and notes endpoints (implemented)
- SPA request detail view shows staff controls and notes with polling (implemented)
- Staff queue list endpoint/UI (pending)
- Security: CSRF token on writes (implemented); add sanitized error logging to file (pending)

## M6: Route Summary + CSV Export
- Endpoint: `/api/route_summary.csv` (pending)
- CSV columns: service_day, neighborhood_name, route_name, pickup_count, area_code, generated_at

## M7: i18n + Toggle + Smoke Tests
- i18n/en.json, i18n/es.json; toggle API and SPA wiring (pending)
- tests/smoke.ps1: full flow (pending)
- tests/unit/validator_test.php (pending)
- A11y & Mobile: sweep + checklist; verify responsive (ongoing). CI web audit added (screenshots, DOM, a11y, console, network)

## Acceptance Checklists
- Validate FR-001..FR-014 via manual smoke + scripts
- Performance: start < 10s; queue polling responsive
- Offline: disconnect network; ensure demo remains functional

## Git Hygiene
- Feature branches per milestone (e.g., feature/m1-scaffold)
- Atomic commits with clear scopes following Conventional Commits
