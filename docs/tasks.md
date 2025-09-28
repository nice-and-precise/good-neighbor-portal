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
- Deterministic pay endpoint; sandbox messaging (implemented)
- FAQs/announcements static section/page (FR-005) (implemented)

## M4: Service Requests + Confirmations
- Endpoints: request_create, request_get (implemented)
- SPA form for new request; show confirmation ID in UI (implemented)

## M5: Staff Queue + Notes + Polling
- Staff transitions and notes endpoints (implemented)
- SPA request detail view shows staff controls and notes with polling (implemented)
- Staff queue list endpoint/UI (implemented)
- Security: CSRF token on writes (implemented); add sanitized error logging to file (implemented)

## M6: Route Summary + CSV Export
- Endpoint: `/api/route_summary.csv.php` (implemented)
- CSV columns: service_day, neighborhood_name, route_name, pickup_count, area_code, generated_at

## M7: i18n + Toggle + Smoke Tests
- i18n/en.json, i18n/es.json; toggle API and SPA wiring (implemented)
- tests/smoke.ps1: full flow (implemented)
- tests/unit/validator_test.php (implemented)
- A11y & Mobile: sweep + checklist; verify responsive (ongoing). CI web audit added (screenshots, DOM, a11y, console, network)

## Next Steps (M8 polish)
- i18n coverage: replace inline strings in `index.html` with data-i18n attributes and map keys in `en.json`/`es.json`; update `app.js` to apply.
- Queue UX: add auto-refresh toggle (5s) and loading/empty states; keep status filter.
- Billing demo: reflect successful pay in dashboard without reload; append a new billing line item client-side.
- CI: enforce smoke + unit tests (added), keep artifacts from web audit; consider matrix for PHP 8.1/8.2.
- Error handling: display friendly toast on API errors; keep logs sanitized.

## M8: UI Enhancements (Progressive, Responsive, A11y)

Branching & Workflow
- Create feature branch: `feature/ui-enhancements` (done)
- Conventional commits with scope: `docs:`, `feat(ui):`, `fix(a11y):`, `chore(audit):`
- Keep changes isolated to docs and front-end assets; no PHP endpoint changes

Tasks
1) Progressive Toggle (vanilla JS)
	- Add UI toggle control in header (checkbox or button) with i18n label
	- Persist mode to `localStorage.uiMode` (`standard|enhanced`)
	- Apply `document.body.classList.toggle('enhanced', mode==='enhanced')`
	- Ensure initial mode is read at app bootstrap before rendering content

2) CSS-only Enhancement Layer
	- Create enhancement styles that only apply under `.enhanced` body class
	- Mobile-first CSS; define breakpoints xs, sm, md, lg, xl
	- Do not remove or rename existing ids used by tests/scripts

3) Accessibility Improvements
	- Add landmarks: header, nav, main, footer
	- Associate labels/inputs; add aria-describedby for helper text
	- Add aria-live regions for status/toasts; ensure role=status
	- Verify and fix contrast to AA; document exceptions (if any)

4) i18n for Enhancement UI
	- Add keys for toggle, banner, and contextual help to `public/i18n/en.json`
	- Wire translations via existing `t()` helper

5) Demo Banner & Contextual Help
	- Add dismissible demo banner (no external deps)
	- Add inline help texts for login form and staff controls

6) Testing & Validation
	- Run `tools/web-audit.mjs` to produce a11y/contrast artifacts for both modes
	- Run `tests/smoke.ps1` in both modes (pre-set localStorage or script hook)
	- Ensure `phpstan` passes (no new PHP changes necessary)

Deliverables
- Updated docs: `docs/spec.md`, `docs/plan.md`, `docs/tasks.md`
- New docs: `docs/ui-guide.md`, `docs/accessibility.md`, `docs/responsive.md`
- Front-end: toggle JS, enhancement CSS, aria fixes, i18n strings

Acceptance Checklist
- [ ] Toggle persists and switches modes without breaking routes or auth
- [ ] No horizontal scroll on xs–xl; tap targets ≥ 44px
- [ ] WCAG 2.1 AA checks pass; issues tracked in artifacts
- [ ] Demo scripts and smoke tests succeed in both modes

References
- Spec UI-001..UI-005 (`docs/spec.md`)
- Plan M8 (`docs/plan.md`)
- Spec-Kit workflow: see `.github/prompts/` and `docs/development-workflow.md`

## Acceptance Checklists
- Validate FR-001..FR-014 via manual smoke + scripts
- Performance: start < 10s; queue polling responsive
- Offline: disconnect network; ensure demo remains functional

## Git Hygiene
- Feature branches per milestone (e.g., feature/m1-scaffold)
- Atomic commits with clear scopes following Conventional Commits

## A11y & Mobile Checklist
- Landmarks: Ensure main content is wrapped in a main region; add aria-labels for groups like Billing Actions, Staff Queue, and Service Request
- Forms: Each input has an associated label; labels click-focus the input; add aria-describedby for helper text where useful
- Buttons: All interactive elements are buttons or links; provide discernible text via data-i18n or aria-label
- Focus: Visible focus outline on buttons/inputs; logical tab order; manage focus after login/token verify to dashboard anchor
- Toasts: Announce via aria-live=polite; ensure role=status on the toast container (present)
- Contrast: Verify text/background contrast for .muted, .badge, and buttons meets WCAG AA
- Mobile: Viewport set; ensure cards are responsive with flex-wrap; tap target sizes >= 44px; no horizontal scroll
- i18n: All user-facing strings have data-i18n keys and translations in en.json/es.json
- Errors: API errors announced to screen readers and visible in UI

### Progress (2025-09-27)
- Done: Main landmark + skip link; language toggle grouped and `aria-pressed` maintained; status regions use `role="status"` + `aria-live=polite`.
- Done: Buttons have explicit `type="button"`; inputs have improved padding and focus outline; mobile tap targets and horizontal scroll guard applied.
- Done: Helper text for token with `aria-describedby`; programmatic focus moves to dashboard anchor after login.
- In progress: Contrast review for all variants; expand data-i18n coverage; ensure error announcements in all error paths.
