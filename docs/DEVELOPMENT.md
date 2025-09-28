# Developer Guide

This guide helps you set up a local environment, understand the code layout, and contribute effectively.

## Local Development Setup

Prerequisites
- PHP 8.1+
- Git
- Windows PowerShell (scripts are provided; macOS/Linux equivalents can be added later)

Setup and run

```powershell
# Clone and setup
git clone https://github.com/jdamhofBBW/good-neighbor-portal
cd good-neighbor-portal
.\.specify\scripts\powershell\setup.ps1

# Start development server (defaults to 8080)
.\.specify\scripts\powershell\run.ps1 -Port 8080
```

macOS/Linux equivalents
```bash
git clone https://github.com/jdamhofBBW/good-neighbor-portal
cd good-neighbor-portal
. ./.specify/scripts/bash/setup.sh
. ./.specify/scripts/bash/run.sh 8080
```

Access the app at http://127.0.0.1:8080

Optional utilities
- Reset demo data: `.\.specify\scripts\powershell\reset-demo.ps1`
- Deterministic pay test: `tests\pay-deterministic.ps1`
- Smoke test (auth → create request → status update → CSV export): `tests\smoke.ps1`

VS Code one-click
- Run task: "How to run (Setup + Server)" to perform setup then start the server at 8080.

## Code Organization

- `src/Lib/Config.php`: Reads environment from `config/app.env` or example; exposes `get(key, default)`.
- `src/Lib/Db.php`: PDO wrapper with SQLite path normalization, driver checks, auto `PRAGMA foreign_keys = ON;`, and helpers to run schema/seed.
- `src/Lib/Http.php`: Session start, request method guard, JSON body parsing, CSRF validation.
- `src/Lib/Util.php`: JSON responses, CSRF token generation, sanitized error logging to `logs/app-error.log`.
- `src/Lib/Validator.php`: Email, non-empty, and enum validations.
- `public/index.html`: Accessible, responsive UI scaffold.
- `public/app.js`: SPA logic, hash routing, i18n integration, staff demo controls, optimistic updates, and polling.
- `public/api/*.php`: Thin endpoints using the Lib classes; tenant- and session-aware.
- `data/schema.sql` and `data/seed.sql`: Database definition and demo data.

## Development Workflow

1. Edit PHP/JS/CSS in-place.
2. Refresh the browser to see changes. `public/app.php` serves `app.js` with no-store headers to reduce caching issues.
3. Validate flows with smoke tests and the browser.
4. Keep Spec Kit docs (`docs/spec.md`, `docs/plan.md`, `docs/tasks.md`) updated when behavior changes.

Quick checks
- Session/CSRF: GET `/api/csrf.php`, then POST with `X-CSRF`.
- DB health: GET `/api/tenants.php` (auto-bootstraps schema/seed on SQLite).
- Environment: GET `/api/diag.php` (extensions and drivers info).

## Testing

- Smoke tests: `tests/smoke.ps1` exercises the main user flow.
- Deterministic billing test: `tests/unit/pay_demo_test.php` (even/odd acceptance) can run under a local server using `BASE_URL`.
- Unit tests: `tests/unit/validator_test.php` for `Validator::email`.

## Style and Quality

- PHP 8.1+ syntax. Run PHPStan locally if you have Composer installed:

```powershell
composer install
./vendor/bin/phpstan analyse --configuration=phpstan.neon
```

- Keep endpoints small and reuse helpers from `src/Lib/`.
- Prefer prepared statements for DB access; all current endpoints do.

## Adding Endpoints

- Create a `public/api/your_endpoint.php` file that:
  - requires the Lib files,
  - starts session, validates method and CSRF for POST,
  - checks `$_SESSION['user_id']` and `$_SESSION['tenant_id']` as needed,
  - accesses the DB via `new Db($config)` and prepared statements,
  - returns JSON via `Util::json([...])`.

## i18n

- Add new strings to both `public/i18n/en.json` and `public/i18n/es.json`.
- Use `data-i18n` attributes in HTML; `applyI18n()` in `app.js` swaps strings and sets `aria-pressed` on the toggle.

## Troubleshooting

See `docs/troubleshooting.md`. Highlights:
- If cookies are blocked (embedded preview), the app auto-falls back to a dev header session. Prefer opening in your system browser.
- Windows: the run script enables `pdo_sqlite`/`sqlite3` dynamically; you typically don’t need to edit `php.ini`.
