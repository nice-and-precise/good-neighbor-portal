# Tasks — Good Neighbor Portal (Aligned to Plan)

Reference: docs/plan.md, docs/spec.md, docs/decisions.md

## M1: Scaffold, DB, Scripts
- Create directories per plan
- Add config/app.example.env, .gitignore for data/app.db and config/app.env
- Implement data/schema.sql and data/seed.sql (Willmar, MN demo data)
- Implement src/Lib/{Db.php,Config.php,Validator.php,Util.php}
- Add scripts/setup.ps1, scripts/run.ps1, scripts/reset-demo.ps1, scripts/export.ps1

## M2: Auth + Neighborhood Switcher
- Models: UserModel.php, MagicLinkModel.php, NeighborhoodModel.php
- Controllers: AuthController.php (magic-link), AdminController.php (optional demo controls)
- Views: auth_login.php (request link, show token URL)
- Public routes in index.php for magic-link request/login, logout
- Neighborhood switcher in layout header; persist selection in session

## M3: Resident Dashboard + Billing Demo
- Models: ScheduleModel.php, BillingModel.php
- Controllers: ResidentController.php
- Views: resident_dashboard.php (next pickup, calendar), resident_billing.php (history, demo pay)
- Deterministic pay endpoint; sandbox messaging

## M4: Service Requests + Confirmations
- Model: RequestModel.php
- Views: resident_request_new.php
- Controller endpoints to create request; confirmation ID display

## M5: Staff Queue + Notes + Polling
- Controllers: StaffController.php
- Views: staff_queue.php, staff_dashboard.php (recent activity)
- Polling JS (~5s) for queue refresh
- Status update + notes endpoint

## M6: Route Summary + CSV Export
- Model: RouteModel.php
- Controller: ExportController.php; CSV builder (Lib/Csv.php)
- Columns: service_day, neighborhood_name, route_name, pickup_count, area_code, generated_at

## M7: i18n + Toggle + Smoke Tests
- i18n/en.json, i18n/es.json; Lib/I18n.php; toggle endpoint and JS
- tests/smoke.ps1: full flow
- tests/unit/validator_test.php

## Acceptance Checklists
- Validate FR-001..FR-014 via manual smoke + scripts
- Performance: start < 10s; queue polling responsive
- Offline: disconnect network; ensure demo remains functional

## Git Hygiene
- Feature branches per milestone (e.g., feature/m1-scaffold)
- Atomic commits with clear scopes following Conventional Commits
