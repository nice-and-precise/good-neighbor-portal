# Troubleshooting

## Common Issues

### PHP server won’t start
- Ensure PHP 8.1+ is installed and on PATH (Windows: `winget install PHP` works well)
- Port in use? Use `-Port 0` to auto-pick an open port.

### SQLite driver errors
- The dev server script enables `pdo_sqlite`/`sqlite3` at runtime. Use the provided run script.
- Confirm via http://127.0.0.1:8080/api/diag.php

### CSRF or session errors in tests
- Always call `/api/csrf.php` first and reuse the cookie for subsequent requests.
- The PowerShell tests handle this; use them as a reference.

### Pay deterministic test fails
- Confirm even vs odd amounts: even succeeds, odd fails by design.
- Ensure authentication flow completed in the test (auth_request → auth_verify).

### VS Code warnings in launch.json
- PHP Debug extension must be installed; until then, schema errors are expected and harmless.

### CI failing on syntax lint
- Check the file reported by `php -l`. Run locally: `Get-ChildItem -Recurse *.php | ForEach-Object { php -l $_.FullName }`

## Getting Help
- Check `logs/` for server error logs (sanitized).
- Run `.specify/scripts/powershell/diag.ps1` if available, or open `/api/diag.php` in the browser.
