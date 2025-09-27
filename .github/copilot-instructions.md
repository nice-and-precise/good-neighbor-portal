# Good Neighbor Portal - Development Workflow

## Commit Strategy Decision Tree

### Direct to Main ⚡ (Your Primary Mode)
Use for rapid iteration and small changes:
- Single endpoint additions (< 50 lines)
- Bug fixes and validation improvements  
- Documentation updates (README, docs/*, comments)
- Configuration tweaks (phpstan.neon, .vscode, CI)
- Spec Kit iterations (docs/spec.md, plan.md, tasks.md)
- PowerShell/Bash script enhancements
- I18n string additions

**Command pattern:**
```bash
git add . && git commit -m "feat(billing): add CSV validation" && git push
```

### Feature Branch + PR (Substantial Changes)
Use for multi-component features:
- Database schema changes
- Multi-endpoint features (like audit system)
- UI components with API changes
- Security modifications
- Features spanning > 3 files significantly

**Your proven pattern:**
```bash
git checkout -b feature/audit-system
# develop...
gh pr create --title "feat(audit): comprehensive audit system" --body "Adds runtime probes and GitHub integration"
```

### Emergency Override
For broken CI or critical security:
```bash
git push --force-with-lease origin main
```

## Quality Gates (All Workflows)
1. Local validation: `./tools/audit-runner.ps1` 
2. Conventional commit with scope
3. PHPStan passes: `./vendor/bin/phpstan analyse`
4. Update docs if behavior changes

## Scopes
Use: `auth`, `billing`, `dashboard`, `api`, `ui`, `db`, `docs`, `ci`, `config`, `audit`, `i18n`, `staff`, `tenant`, `export`, `test`
# Good Neighbor Portal - Copilot Development Instructions

Auto-generated instructions for efficient coding agent workflow in the Good Neighbor Portal repository.

## Repository Summary

The Good Neighbor Portal is a **PHP 8.1+ web application** built as a demo-ready MVP for West Central Sanitation. It provides a customer self-service portal and internal operations dashboard with multi-language support. The project uses **SQLite by default** (MySQL optional), **vanilla HTML/CSS/JS frontend**, and **PowerShell-first scripting** for setup and deployment.

**Repository Type**: Single web application  
**Primary Language**: PHP 8.1+ with type hints  
**Frontend**: Vanilla HTML/CSS/JS with hash routing  
**Database**: SQLite (default) / MySQL (optional via DSN)  
**Target Platform**: PHP built-in server for local development  
**Project Size**: ~50 source files, lightweight MVC architecture  

## Documentation Architecture

This repository follows **Spec-Kit workflow** with comprehensive documentation:

**Core Documentation** (`docs/`):
- `constitution.md`: Development principles and coding standards
- `spec.md`: Feature specifications and user scenarios  
- `plan.md`: Complete 7-milestone implementation roadmap
- `tasks.md`: Detailed implementation tasks by milestone
- `decisions.md`: Architectural decisions (auth, tenancy, PII, etc.)
- `analyze.md`: Cross-artifact analysis and alignment validation
- `clarify.md`: Clarification questions and answers

**Spec-Kit Templates** (`.specify/templates/`):
- `spec-template.md`, `plan-template.md`, `tasks-template.md`
- `agent-file-template.md` for multi-agent context

**Copilot Slash Commands** (`.github/prompts/`):
- `/constitution`, `/specify`, `/clarify`, `/plan`, `/tasks`, `/analyze`, `/implement`  

## Build & Validation Commands

### Prerequisites
- **PHP 8.1+** with extensions: `pdo`, `pdo_sqlite`, `sqlite3`
- **PowerShell 7+** (for Windows development workflow)
- **Git** for version control

### Setup & Bootstrap
```powershell
# First-time setup: create config, migrate DB, seed demo data
pwsh -File .specify/scripts/powershell/setup.ps1

# Alternative if PowerShell extension loading fails:
SEED_DEMO=true SCHEMA_PATH=./data/schema.sql SEED_PATH=./data/seed.sql php tmp/migrate.php
```

**CRITICAL WORKAROUND**: The PowerShell setup script **WILL FAIL** with PHP extension loading errors in CI/Linux environments due to incorrect extension directory paths. **ALWAYS use the manual alternative**:

```bash
# Manual setup that always works:
mkdir -p tmp
# Run the migration script to set up the database
php tmp/migrate.php
cp config/app.example.env config/app.env
```

### Development Server
```powershell
# Start local server on http://127.0.0.1:8080
pwsh -File .specify/scripts/powershell/run.ps1 -Port 8080

# RECOMMENDED: Simple PHP server without extension overrides
php -S 127.0.0.1:8080 -t public
```

### Database Reset  
```bash
# Manual reset (ALWAYS WORKS):
rm -f data/app.db
php tmp/migrate.php  # if migrate.php exists from setup
# OR recreate migrate.php with setup code above

# PowerShell reset (may fail with extension errors):
pwsh -File .specify/scripts/powershell/reset-demo.ps1 -Force
```

### Testing & Validation
```powershell
# Test authentication flow (requires running server)
pwsh -File .specify/scripts/powershell/test-auth.ps1 -Email "jane@example.com" -Base "http://127.0.0.1:8080"

# Quick API test
curl http://127.0.0.1:8080/api/ping.php
curl http://127.0.0.1:8080/api/diag.php  # PHP extension diagnostics

# Export placeholder CSV (M1 implementation)
pwsh -File .specify/scripts/powershell/export.ps1 -Out ./exports/route-summary.csv
```

**Build time expectations**:
- Manual setup: 5-10 seconds (database + config)
- Server start: 2-5 seconds
- API test: <1 second response
- Test-auth script: 5-10 seconds when server running
- Database reset: 3-5 seconds

**Critical Setup Sequence** (validated working):
1. Manual database setup (above code block)
2. Copy config: `cp config/app.example.env config/app.env` 
3. Start server: `php -S 127.0.0.1:8080 -t public`
4. Test: `curl http://127.0.0.1:8080/api/ping.php`

## Project Architecture & Layout

### Core Architecture
- **Backend**: PHP 8.1+ MVC pattern in `/src`
- **Frontend**: Static files in `/public`, vanilla JS SPA with hash routing
- **Database**: Multi-tenant SQLite schema with PDO
- **Sessions**: PHP session-based with magic-link authentication  
- **i18n**: JSON resources (English + Spanish)
- **Build System**: **NO BUILD STEP REQUIRED** - pure PHP + vanilla JS

### Complete Directory Structure
```
./
├── .github/
│   ├── copilot-instructions.md   # This file
│   └── prompts/                  # Copilot slash commands (7 files)
├── .specify/                     # Spec-Kit workflow system
│   ├── memory/constitution.md    # Spec-Kit constitution copy
│   ├── scripts/powershell/       # 10 PowerShell automation scripts
│   └── templates/                # 4 spec-kit templates
├── config/
│   ├── app.env                   # Local environment config (gitignored)
│   └── app.example.env           # Environment template
├── data/
│   ├── schema.sql                # Multi-tenant SQLite schema
│   ├── seed.sql                  # Demo data (Willmar, MN tenant)
│   └── app.db                    # SQLite database (gitignored)
├── docs/                         # Spec-driven documentation (7 files)
├── public/                       # Web root (no build artifacts)
│   ├── api/                      # 8 PHP API endpoints
│   ├── index.php                 # Entry point/fallback  
│   ├── index.html                # Main SPA template
│   └── app.js                    # Frontend JavaScript (~80 lines)
├── src/
│   └── Lib/                      # Core PHP libraries (5 classes)
├── logs/                         # Application logs (gitignored)
├── tmp/                          # Temporary files (gitignored)
└── exports/                      # CSV exports (gitignored)
```

### Key Source Files Content

**public/index.php** (25 lines): Serves index.html or basic fallback page
**public/app.js** (~80 lines): Vanilla JS SPA with fetch API, CSRF handling, magic-link auth
**src/Lib/Config.php**: Environment configuration with .env file parsing
**src/Lib/Db.php**: PDO wrapper with SQLite path resolution
**src/Lib/Validator.php**: Input validation utilities  
**src/Lib/Http.php**: HTTP response utilities
**src/Lib/Util.php**: General utilities including JSON response helper

**data/schema.sql** (100+ lines): Multi-tenant schema:
- `tenants`, `users`, `magic_links`, `neighborhoods`, `addresses`
- `residents`, `schedules`, `billing`, `requests`, `routes`, `route_stats`

### API Endpoints Structure
**All endpoints** in `/public/api/`:
- `ping.php`: Health check, returns `{"ok":true,"env":"dev"}`
- `diag.php`: PHP extension diagnostics (PDO, SQLite status)
- `csrf.php`: CSRF token generation
- `auth_request.php`: Magic-link authentication request
- `auth_verify.php`: Magic-link token verification  
- `session.php`: Current session information
- `tenants.php`: Multi-tenant neighborhood switching
- `logout.php`: Session termination

## Validation & CI Pipeline

### Pre-commit Validation
**NO FORMAL CI PIPELINE EXISTS**. **NO LINTING TOOLS CONFIGURED**. Manual validation only:

1. **Database integrity**: Verify `data/app.db` exists and contains seeded data
2. **Server startup**: Confirm `php -S 127.0.0.1:8080 -t public` starts without errors  
3. **API accessibility**: Test `curl http://127.0.0.1:8080/api/ping.php` returns `{"ok":true,"env":"dev"}`
4. **Authentication flow**: Run `test-auth.ps1` script against running server
5. **Manual testing**: Load http://127.0.0.1:8080 in browser, test magic-link flow

### Development Principles (from docs/constitution.md)
- **Principle 1**: Pragmatic clarity over cleverness
- **Principle 2**: Fast feedback loops (testable within 2 minutes)
- **Principle 3**: Smallest viable increments  
- **Principle 4**: Windows-first tooling (PowerShell + Bash variants)
- **Principle 5**: Security by default (validated inputs, prepared statements)
- **Principle 6**: Zero-cloud development (offline after setup)

### Common Validation Issues & Solutions
- **PowerShell PHP extension errors**: Use manual PHP commands instead of setup.ps1
- **Port conflicts**: Server checks port 8080; use a different port or identify the process using `lsof -i :8080` (or `netstat -anp | grep 8080`), then kill the specific PID with `kill <pid>`.
- **Database locks**: Stop server before running reset scripts
- **Missing database**: Run manual setup sequence above
- **CSRF failures**: Ensure session_start() called before API requests

### Error Handling Standards  
- All user inputs validated using `Validator.php`
- Database queries use prepared statements via `Db.php`  
- Errors logged with sanitized details (no PII)
- CSRF protection required on state-changing operations

## Dependencies & Requirements

### Runtime Dependencies
- **PHP 8.1+** with extensions: pdo, pdo_sqlite, sqlite3
- **Built-in PHP server** (development only)
- **SQLite 3** for database storage

### Development Dependencies
- **PowerShell 7+** for automation scripts
- **Git** for version control
- **cURL** for API testing

### Optional Dependencies
- **MySQL 8+** (alternative to SQLite via DSN config)
- **VS Code + Copilot** (recommended editor setup)

## Implementation Milestones & Current State

The project follows a **7-milestone implementation plan** (from docs/plan.md):

- **M1**: Scaffold + DB + scripts ✅ **CURRENT STATE**
- **M2**: Magic-link auth + neighborhood switcher  
- **M3**: Resident dashboard + billing demo
- **M4**: Service requests + confirmations
- **M5**: Staff queue + polling + notes
- **M6**: Route summary + CSV export
- **M7**: i18n + toggle + smoke tests

### M1 Implementation Status ✅
✅ Multi-tenant SQLite schema (tenants, users, neighborhoods, etc.)  
✅ Core library classes: Config, Db, Util, Validator, Http  
✅ Basic API endpoints: ping, csrf, diag, auth_request, auth_verify, session, tenants, logout  
✅ PowerShell automation scripts (with known extension loading issues)  
✅ Manual setup procedures validated and documented  
✅ Demo data for Willmar, MN tenant with 3 neighborhoods, sample users

### Key Architecture Decisions (from docs/decisions.md)
1. **Identity model**: Magic-link simulation (token displayed in UI, no email)
2. **Tenancy**: Multi-tenant with neighborhood_id filters and UI switcher
3. **PII policy**: Full mock PII allowed, clearly fake, resettable anytime  
4. **Billing demo**: Deterministic outcomes by test input/config flags
5. **Queue updates**: Short-interval polling (~5 seconds)
6. **Languages**: English + Spanish (es)
7. **Offline operation**: All features work offline, email simulated in UI
8. **Reset behavior**: Disallow reset while server running (port check guard)

## Repository File Inventory

### Root Level Files (11 files)
- `README.md`: Basic setup instructions with PowerShell commands
- `.gitignore`: Excludes config/app.env, data/app.db, logs/, tmp/, exports/

### Documentation Files (21 total .md files)
**Core Spec-Kit docs** (docs/): constitution.md, spec.md, plan.md, tasks.md, decisions.md, analyze.md, clarify.md  
**Copilot prompts** (.github/prompts/): 7 slash command files  
**Templates** (.specify/templates/): 4 spec-kit templates  
**This file**: .github/copilot-instructions.md  

## Key Files Reference

### PowerShell Scripts (.specify/scripts/powershell/) - 10 files
- `setup.ps1`: Create DB, run schema/seed, write app.env ⚠️ **FAILS on Linux**
- `run.ps1`: Start PHP server with extension overrides ⚠️ **FAILS on Linux** 
- `reset-demo.ps1`: Guard server running, recreate DB, re-seed
- `test-auth.ps1`: Headless auth flow test (requires running server)
- `export.ps1`: Placeholder CSV export (M1 stub implementation)
- `check-prerequisites.ps1`: Spec-Kit prerequisite validation
- `common.ps1`: Shared PowerShell functions
- `update-agent-context.ps1`: Update agent context files
- `create-new-feature.ps1`: Spec-Kit feature creation
- `setup-plan.ps1`: Plan setup utilities

### PHP Source Files - 13 files
**Libraries** (src/Lib/): Config.php, Db.php, Http.php, Util.php, Validator.php  
**API endpoints** (public/api/): 8 PHP files as listed above  
**Entry points** (public/): index.php (fallback), index.html (SPA), app.js (frontend)

## Key Files for Code Changes

### Most Important Files for Agents
1. **src/Lib/**: Core business logic, database operations, utilities
2. **public/api/**: API endpoints - add new routes here
3. **data/schema.sql**: Database structure - modify for new entities  
4. **data/seed.sql**: Demo data - update for new test scenarios
5. **docs/plan.md**: Implementation roadmap - reference for requirements
6. **config/app.example.env**: Environment template - add new settings here

### Configuration Hierarchy
1. **config/app.env**: Local environment (auto-created, gitignored)
2. **config/app.example.env**: Template and fallback
3. **data/schema.sql**: Database structure definition
4. **docs/constitution.md**: Development principles and coding standards
5. **.gitignore**: Exclude generated files (db, logs, config, exports)

## Troubleshooting Guide

### PowerShell Script Failures ⚠️ **CRITICAL ISSUE**
**Symptom**: Setup/run scripts fail with massive PHP extension loading errors  
**Root Cause**: Scripts try to override extension_dir with incorrect paths  
**Solution**: **ALWAYS use manual PHP commands** documented above

### Database Issues
**Missing database**: Run manual setup sequence  
**Database locked**: Stop PHP server first: `pkill -f "php -S"`  
**Permission errors**: Ensure write access to `data/` directory

### Server Issues  
**Port conflicts**: Use different port: `php -S 127.0.0.1:8081 -t public`  
**Server won't start**: Check PHP extensions: `php -m | grep sqlite`  
**API errors**: Verify database exists and config/app.env is present

---

**CRITICAL**: Trust these instructions and use the documented manual commands. The PowerShell scripts have fundamental issues in non-Windows environments. Manual PHP setup always works and takes less time than debugging script failures.