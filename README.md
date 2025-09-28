# Good Neighbor Portal (Spec Kit)

This project was initialized with GitHub Spec Kit using the Copilot agent and PowerShell scripts.

## Start Here

# Good Neighbor Portal

A customer self-service and internal operations portal for waste management companies. Enables residents to view service schedules, submit requests, and manage billing while providing staff with request management and route summary tools.

Built for West Central Sanitation - A complete offline-capable demo showcasing multi-tenant support, mobile responsiveness, and bilingual interface.

## Quick Start

Prerequisites
- PHP 8.1+ and Git (Windows, macOS, or Linux)
- VS Code recommended with GitHub Copilot (optional)

One-time setup
- Run the one-command setup to create config, migrate the database, and seed demo data:

```powershell
.\.specify\scripts\powershell\setup.ps1
```

macOS/Linux
```bash
. ./.specify/scripts/bash/setup.sh
```

Start the web app
- Launch the PHP dev server on port 8080:

```powershell
.\.specify\scripts\powershell\run.ps1 -Port 8080
```

macOS/Linux
```bash
. ./.specify/scripts/bash/run.sh 8080
```

Access the app
- Open http://127.0.0.1:8080 in your browser
- Demo accounts: Use any email address for the magic-link demo login (the token is shown inline)

Try it
- Run the smoke test (requires the server running on 8080):
	- PowerShell: [tests/smoke.ps1](tests/smoke.ps1)
- Run the deterministic pay test (even/odd):
	- PowerShell: [tests/pay-deterministic.ps1](tests/pay-deterministic.ps1)

## Key Features
- Multi-tenant neighborhood management (tenant-scoped data)
- Magic-link authentication (offline demo mode returns the token)
- Resident service request submission and staff triage queue
- Demo billing with deterministic payment outcomes (even cents succeed)
- English/Spanish language toggle with session persistence
- Mobile-responsive, accessible UI (skip link, focus styles)
- Complete offline operation (SQLite, no external services)

## What’s Inside
- Frontend: Vanilla JS single page (hash routing) in `public/index.html` and `public/app.js`
- Backend: Lightweight PHP JSON API in `public/api/` with helpers in `src/Lib/`
- Database: SQLite file at `data/app.db` with `data/schema.sql` and `data/seed.sql`
- i18n: English/Spanish translations in `public/i18n/`
- Spec Kit: Spec-driven docs and scripts in `docs/` and `/.specify/`

## Documentation
- Architecture: `docs/ARCHITECTURE.md`
- Developer Guide: `docs/DEVELOPMENT.md`
- User Guide: `docs/USER-GUIDE.md`
- API Reference: `docs/API.md` (see also `docs/endpoints.md`)
- Deployment: `docs/DEPLOYMENT.md`
- Troubleshooting: `docs/troubleshooting.md`

Spec Kit methodology (kept up to date):
- `docs/constitution.md`, `docs/spec.md`, `docs/plan.md`, `docs/tasks.md`

## Contributing and CI
- See `CONTRIBUTING.md` and `SECURITY.md`
- Open PRs against `main`; keep Spec Kit docs updated when behavior changes
- Suggested local checks: `tests/smoke.ps1`, `tests/pay-deterministic.ps1`, and PHPStan per `phpstan.neon`
