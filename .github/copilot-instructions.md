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

**IMPORTANT**: The PowerShell setup script may fail with PHP extension loading errors in CI environments. Use the alternative command above as a workaround. The script creates `config/app.env` from `config/app.example.env` and initializes the SQLite database at `data/app.db`.

### Development Server
```powershell
# Start local server on http://127.0.0.1:8080
pwsh -File .specify/scripts/powershell/run.ps1 -Port 8080

# Alternative without extension directory override:
php -S 127.0.0.1:8080 -t public
```

### Database Reset
```powershell
# Reset demo database (guarded if server is running)
pwsh -File .specify/scripts/powershell/reset-demo.ps1 -Force

# Manual reset:
rm -f data/app.db && SEED_DEMO=true SCHEMA_PATH=./data/schema.sql SEED_PATH=./data/seed.sql php tmp/migrate.php
```

### Testing & Validation
```powershell
# Test authentication flow (requires running server)
pwsh -File .specify/scripts/powershell/test-auth.ps1 -Email "jane@example.com" -Base "http://127.0.0.1:8080"

# Export placeholder CSV (M1 implementation)
pwsh -File .specify/scripts/powershell/export.ps1 -Out ./exports/route-summary.csv
```

**Build time expectations**:
- Setup: 10-30 seconds (including DB migration)
- Server start: 2-5 seconds
- Test execution: 5-10 seconds when server is running
- Database reset: 5-15 seconds

## Project Architecture & Layout

### Core Architecture
- **Backend**: PHP 8.1+ MVC pattern in `/src`
- **Frontend**: Static files in `/public`, vanilla JS SPA
- **Database**: Multi-tenant SQLite schema with PDO
- **Sessions**: PHP session-based with magic-link authentication
- **i18n**: JSON resources (English + Spanish)

### Directory Structure
```
/home/runner/work/good-neighbor-portal/good-neighbor-portal/
├── .github/
│   └── prompts/               # Copilot slash commands
├── .specify/
│   ├── scripts/powershell/    # Build, run, reset scripts
│   └── templates/             # Project templates
├── config/
│   ├── app.env                # Local environment config (gitignored)
│   └── app.example.env        # Environment template
├── data/
│   ├── schema.sql             # Database schema (multi-tenant)
│   ├── seed.sql               # Demo data (Willmar, MN)
│   └── app.db                 # SQLite database (gitignored)
├── docs/                      # Spec-driven documentation
│   ├── constitution.md        # Development principles
│   ├── plan.md                # Implementation plan
│   ├── spec.md                # Feature specifications
│   └── tasks.md               # Implementation tasks
├── public/                    # Web root
│   ├── api/                   # PHP API endpoints
│   ├── index.php              # Entry point
│   ├── index.html             # Main SPA template
│   └── app.js                 # Frontend JavaScript
├── src/                       # PHP application code
│   └── Lib/                   # Core libraries
│       ├── Config.php         # Environment configuration
│       ├── Db.php             # Database abstraction
│       ├── Http.php           # HTTP utilities
│       ├── Util.php           # General utilities
│       └── Validator.php      # Input validation
├── logs/                      # Application logs (gitignored)
├── tmp/                       # Temporary files (gitignored)
└── exports/                   # CSV exports (gitignored)
```

### Key Configuration Files
- **config/app.env**: Database DSN, app settings, secrets
- **data/schema.sql**: Multi-tenant database schema
- **docs/plan.md**: Complete implementation roadmap
- **docs/constitution.md**: Development principles and standards

### API Structure
**Core endpoints** in `/public/api/`:
- `ping.php`: Health check and environment info
- `csrf.php`: CSRF token generation
- `auth_request.php`: Magic-link authentication request
- `auth_verify.php`: Magic-link token verification
- `session.php`: Current session information
- `tenants.php`: Multi-tenant neighborhood switching

## Validation & CI Pipeline

### Pre-commit Validation
**No formal CI pipeline exists**. Manual validation steps:

1. **Database integrity**: Ensure `data/app.db` exists and is seeded
2. **Server startup**: Verify `php -S 127.0.0.1:8080 -t public` starts without errors
3. **API accessibility**: Test `curl http://127.0.0.1:8080/api/ping.php` returns JSON
4. **Authentication flow**: Run `test-auth.ps1` against local server

### Common Validation Issues
- **PHP extension errors**: PowerShell scripts may fail with extension loading warnings. Use plain PHP commands as fallback.
- **Port conflicts**: Reset script checks for running servers on port 8080
- **Database locks**: Stop server before running reset-demo.ps1
- **Missing config**: Setup script copies `app.example.env` to `app.env` automatically

### Error Handling Standards
- All user inputs must be validated using `Validator.php`
- Database queries use prepared statements via `Db.php`
- Errors logged with sanitized details (no PII)
- CSRF protection required on all state-changing operations

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

## Implementation Milestones

The project follows a **7-milestone implementation plan**:

- **M1**: Scaffold + DB + scripts (current state)
- **M2**: Magic-link auth + neighborhood switcher
- **M3**: Resident dashboard + billing demo
- **M4**: Service requests + confirmations
- **M5**: Staff queue + polling + notes
- **M6**: Route summary + CSV export
- **M7**: i18n + toggle + smoke tests

### Current State (M1)
✅ Database schema and seeding  
✅ Core library classes (Config, Db, Util, Validator)  
✅ Basic API endpoints (ping, csrf, auth)  
✅ PowerShell automation scripts  
✅ Development server setup  

## Key Files Reference

### Most Important Files for Changes
1. **src/Lib/**: Core PHP libraries - modify for business logic
2. **public/api/**: API endpoints - add new routes here
3. **data/schema.sql**: Database structure - modify for data model changes
4. **config/app.example.env**: Environment template - update for new settings
5. **docs/plan.md**: Implementation roadmap - reference for feature requirements

### Configuration Files
- **config/app.env**: Local environment (auto-created, not committed)
- **.gitignore**: Excludes logs/, tmp/, exports/, data/app.db
- **data/seed.sql**: Demo data for Willmar, MN tenant

### Documentation Files
- **README.md**: Basic setup and usage instructions
- **docs/constitution.md**: Development principles and standards
- **docs/spec.md**: Feature specifications and user scenarios
- **docs/tasks.md**: Detailed implementation tasks by milestone

## Troubleshooting Common Issues

### PowerShell Script Failures
**Symptom**: Extension loading errors during setup  
**Solution**: Use direct PHP commands:
```bash
SEED_DEMO=true SCHEMA_PATH=./data/schema.sql SEED_PATH=./data/seed.sql php tmp/migrate.php
php -S 127.0.0.1:8080 -t public
```

### Database Connection Issues
**Symptom**: PDO connection errors  
**Solution**: Verify SQLite extensions are loaded with `php -m | grep sqlite`

### Server Port Conflicts
**Symptom**: "Address already in use" errors  
**Solution**: Use different port or kill existing server:
```bash
pkill -f "php -S"
php -S 127.0.0.1:8081 -t public  # Alternative port
```

### Missing Database
**Symptom**: SQLite file not found errors  
**Solution**: Run setup script or manual migration:
```bash
pwsh -File .specify/scripts/powershell/setup.ps1
```

---

**Trust these instructions**: Only search for additional information if these instructions are incomplete or you encounter errors not covered above. The PowerShell scripts provide the authoritative automation workflow, with plain PHP commands as reliable fallbacks.