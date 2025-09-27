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

# Start local server on http://127.0.0.1:8080
.\.specify\scripts\powershell\run.ps1 -Port 8080

# If you need to reset the demo database (guarded if server is running)
.\.specify\scripts\powershell\reset-demo.ps1

# Export placeholder CSV (will be replaced in later milestone)
.\.specify\scripts\powershell\export.ps1 -Out .\exports\route-summary.csv

# Optional: E2E test of the demo auth flow (magic-link style)
.\.specify\scripts\powershell\test-auth.ps1 -Email resident@example.com
```

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

### Recent Activity (M3.1)

- `GET /api/recent_activity.php` → latest service requests and billing entries (combined)

### Multi-tenant demo

- Seed includes a second tenant `kandiyohi-mn` with neighborhoods and addresses
- You can run the E2E script against either tenant:

```powershell
.\.specify\scripts\powershell\test-auth.ps1 -Email resident@example.com -Tenant willmar-mn
.\.specify\scripts\powershell\test-auth.ps1 -Email someone@example.com -Tenant kandiyohi-mn
```

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