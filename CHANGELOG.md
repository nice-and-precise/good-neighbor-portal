# Changelog

All notable changes to this project will be documented in this file.

## [M2] - 2025-09-26
- Implemented demo auth flow (magic-link style) endpoints and minimal frontend UI
- Added CSRF endpoint and session/logout endpoints
- Fixed runtime by enabling SQLite extensions in dev server script
- Resolved SQLite DSN to project root for reliable file access
- Added diagnostics endpoint `/api/diag.php`
- Added PowerShell `test-auth.ps1` for end-to-end auth verification

## [M1] - 2025-09-25
- Initial scaffold with PHP built-in server and SQLite schema/seed
- Config loading, DB helper, validation and utilities
- Basic index page and ping endpoint
- PowerShell scripts: setup, run, reset-demo, export placeholder
