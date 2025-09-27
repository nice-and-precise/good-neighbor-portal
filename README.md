# Good Neighbor Portal (Spec Kit)

This project was initialized with GitHub Spec Kit using the Copilot agent and PowerShell scripts.

## Start Here

Use these slash commands in your AI assistant:

- /constitution
- /specify
- /clarify
- /plan
- /tasks
- /analyze
- /implement

## Project Structure

- `.github/prompts/` - Slash commands for Copilot
- `.specify/scripts/powershell/` - Helper scripts for Spec Kit workflows
- `.specify/templates/` - Templates for spec, plan, tasks
- `docs/` - Specifications and plans that drive development (constitution, spec, plan, tasks)

## Prerequisites

- Python 3.11+
- uv
- Git
- VS Code + Copilot
- PHP 8.1+ (Windows-friendly; winget package works well)

Notes:
- The dev server script enables SQLite extensions automatically at runtime; no php.ini edits needed.
- SQLite database lives at `data/app.db` and is created/seeded by setup.

## Quick Commands

```powershell
specify check
# Initialize spec-Driven workflow
# In the editor chat, run the slash commands in order above.
```

## Develop and Run (M2)

```powershell
# First-time setup: create config, migrate DB, seed demo data
.\.specify\scripts\powershell\setup.ps1

# macOS/Linux: ./ .specify/scripts/bash/setup.sh

# Start local server on http://127.0.0.1:8080
.\.specify\scripts\powershell\run.ps1 -Port 8080

# macOS/Linux: ./ .specify/scripts/bash/run.sh

# If you need to reset the demo database (guarded if server is running)
.\.specify\scripts\powershell\reset-demo.ps1

# macOS/Linux: ./ .specify/scripts/bash/reset-demo.sh

# Export placeholder CSV (will be replaced in later milestone)
.\.specify\scripts\powershell\export.ps1 -Out .\exports\route-summary.csv

# macOS/Linux: ./ .specify/scripts/bash/export.sh ./exports/route-summary.csv

# Optional: E2E test of the demo auth flow (magic-link style)
.\.specify\scripts\powershell\test-auth.ps1 -Email resident@example.com
```

## VS Code Quickstart

- Recommended extensions are auto-suggested on open (Copilot, PowerShell, Intelephense, PHP Debug, Playwright)
- Useful tasks (Terminal → Run Task...):
	- Spec: Setup project
	- App: Run server (8080)
	- Tests: Smoke
	- Tests: Pay deterministic

Workspace tips:
- Default terminal profile is PowerShell on Windows.
- YAML validation is enabled for GitHub Actions.
- Intelephense is configured for PHP 8.1 syntax.

## PR Workflow

- Use feature branches for each change, open PRs to `main`.
- PRs should update `docs/spec.md`, `docs/plan.md`, and/or `docs/tasks.md` when behavior changes.
- CI must pass (E2E, negative, smoke, unit tests; PHP 8.1/8.2 matrix).
- See `CONTRIBUTING.md` for quality gates and milestone strategy.

### Demo Auth Flow (M2)

- Open http://127.0.0.1:8080
- Select a tenant (default: Willmar, Minnesota)
- Enter your email and click “Request magic link (demo shows token)”
- Copy the returned token (auto-filled) and click “Verify token”
- You should see “Logged in.” and `/api/session.php` will show your session

### Diagnostics

- Quick environment check: http://127.0.0.1:8080/api/diag.php
	- Confirms `pdo_sqlite`/`sqlite3` extensions are loaded and shows `pdo_drivers`

### Endpoints (M2)

- `GET /api/csrf.php` → CSRF token
- `GET /api/tenants.php` → tenant list + active
- `POST /api/auth_request.php` → issues demo token (would be emailed in prod)
- `POST /api/auth_verify.php` → verifies token and binds session
- `GET /api/session.php` → current session
- `GET /api/logout.php` → clears session

### Resident Dashboard (M3 start)

- `GET /api/dashboard.php` → profile, next_pickup_date, billing for the logged-in user
- New users created via `auth_request` get seeded demo billing charges automatically

### Recent Activity (M3.1)

- `GET /api/recent_activity.php` → latest service requests and billing entries (combined)
- UI adds a “Recent Activity” card and a “Service Request” form card shown after login

### Multi-tenant demo

- Seed includes a second tenant `kandiyohi-mn` with neighborhoods and addresses
- You can run the E2E script against either tenant:

```powershell
.\.specify\scripts\powershell\test-auth.ps1 -Email resident@example.com -Tenant willmar-mn
.\.specify\scripts\powershell\test-auth.ps1 -Email someone@example.com -Tenant kandiyohi-mn
```

### Request/Billing Details (M3.2)

- `GET /api/request_get.php?id=...` and `GET /api/billing_get.php?id=...` power a simple detail view with hash routing.
- Front-end routes: `#request/<id>` and `#billing/<id>`.

### Staff Lifecycle and Notes (M3.3)

- Demo staff endpoints (use `X-Staff-Key` header; default `demo-staff`):
	- `POST /api/request_status_update.php` to transition status: ack, in_progress, done, cancelled
	- `POST /api/request_note_create.php` to add a note
	- `GET /api/request_notes.php?request_id=...` to list notes
- Front-end: request detail view includes staff controls, notes UI, and polling.
- Windows setup improved to auto-detect PHP extension_dir for pdo_sqlite/sqlite3 (no php.ini edits required).

## Documentation (Spec Kit)

This repo follows Spec-Driven Development with GitHub Spec Kit. See:
- `docs/constitution.md` – principles and standards
- `docs/spec.md` – what we’re building (requirements, user stories)
- `docs/plan.md` – technical implementation plan
- `docs/tasks.md` – actionable tasks derived from the plan

Milestones tracked in `CHANGELOG.md`:
- M1: Scaffold, schema/seed, scripts, ping
- M2: Auth endpoints/UI, runtime fixes, diagnostics, E2E auth test
- M3: Dashboard API/UI, billing seeding
- M3.1: Recent Activity API/UI, multi-tenant demo, improved tests
 - M3.2: Request/Billing details endpoints and UI
 - M3.3: Staff lifecycle + notes + polling; Windows SQLite setup fix; endpoints/docs/hygiene

## CI and Releases

- Continuous Integration: GitHub Actions workflow runs end-to-end tests for both tenants on every push and PR to `main`.
	- Workflow: `.github/workflows/ci.yml`
	- Includes a PHP syntax lint gate (`php -l` over all PHP files) to catch syntax errors early.
	- Runs PHPStan static analysis (level 0 baseline) as a separate job.
	- Required checks (recommended): Protect `main` and require the “PHP E2E” job to pass. Use the "Apply Branch Protection" workflow to pin checks.
- Releases: Push a marker file under `.github/release-requests/<tag>` to trigger the Release workflow.
	- Workflow: `.github/workflows/release.yml`
	- Notes are pulled from `CHANGELOG.md` (section for the tag label) or `docs/releases/<tag>.md` fallback.

### Endpoints Reference

See `docs/endpoints.md` for a consolidated list of API endpoints and headers.

## Contributing

- Use Spec-Driven Development (see `docs/` for spec, plan, and tasks)
- Feature branches with atomic commits; open PRs to `main`
- Keep `CHANGELOG.md` updated per milestone
- PRs should include a brief summary and link to relevant docs sections

Additional docs:
- `docs/development-workflow.md` – step-by-step development and review flow
- `docs/troubleshooting.md` – common issues and fixes

### Static analysis locally

Install dependencies and run PHPStan:

```powershell
composer install
./vendor/bin/phpstan analyse --configuration=phpstan.neon
```

## Development Workflow

### Quick Commits (Primary)
```bash
git add . && git commit -m "feat(scope): description" && git push
```

### Feature Branches (Major Changes)
```bash
git checkout -b feature/name
# develop...
gh pr create --title "feat(scope): description"
```

### VS Code Tasks
- Terminal → Run Task... → "App: Run server (8080)"
- Terminal → Run Task... → "Tests: Smoke"
- F1 → "Git: Commit Staged" for quick commits

### Quality Checks
- `./tools/audit-runner.ps1` - comprehensive audit
- `./vendor/bin/phpstan analyse` - static analysis
- `./.specify/scripts/powershell/test-auth.ps1` - E2E auth test