# Changelog

All notable changes to this project will be documented in this file.

## [M2] - 2025-09-26

## [M1] - 2025-09-25

## [M3] - 2025-09-26
## [M3.1] - 2025-09-27
- Added `/api/recent_activity.php` combining recent service requests and billing entries
- Frontend: Recent Activity card; loads after login and after submitting a request
- Seeded a second tenant (`kandiyohi-mn`) with neighborhoods and addresses for switcher demo
- E2E test script now accepts `-Tenant` and validates activity feed for each tenant

## [M3.2] - 2025-09-27
- UI Enhancements (progressive, opt-in):
	- New UI Mode toggle with localStorage persistence and i18n labels (en/es)
	- Enhancement styles strictly guarded by `body.enhanced` to keep standard mode unchanged
- Audit tooling:
	- Enhanced web audit supports `UI_MODE` and records `uiMode` in summaries
	- Added cross-platform `web-audit:enhanced` npm script via wrapper
- Tests/Tooling:
	- Fixed PowerShell deterministic test to parse non-2xx JSON bodies (402)
- Documentation:
	- Updated `README.md` with UI Mode usage and audit instructions
	- Added guides: `docs/ui-guide.md`, `docs/accessibility.md`, `docs/responsive.md`
	- Spec-driven docs refreshed: `docs/spec.md`, `docs/plan.md`, `docs/tasks.md`, `docs/constitution.md`

Links: [UI Guide](docs/ui-guide.md) • [Accessibility](docs/accessibility.md) • [Responsive](docs/responsive.md) • [Web audit artifacts](artifacts/web-audit/)

