# Troubleshooting

## Common Issues

### PHP server won’t start
- Ensure PHP 8.1+ is installed and on PATH (Windows: `winget install PHP` works well)
- Port in use? Use `-Port 0` to auto-pick an open port.

### SQLite driver errors
- The dev server script enables `pdo_sqlite`/`sqlite3` at runtime if you use the PowerShell run scripts. If you’re starting PHP manually, these extensions must be enabled in your `php.ini`.
- Confirm via http://127.0.0.1:8080/api/diag.php (look for `has.pdo_sqlite = true` and `has.sqlite3 = true`).

#### Enable SQLite on Windows (php.ini)
1. Locate your PHP installation (e.g., `C:\php`). Find `php.ini` (or copy `php.ini-development` to `php.ini`).
2. Open `php.ini` and ensure these lines are present (uncomment by removing `;`):
	- `extension_dir = "C:\\php\\ext"`
	- `extension=pdo_sqlite`
	- `extension=sqlite3`
3. Restart your PHP built-in server and reload `/api/diag.php` to verify.
4. If you still see `could not find driver`, ensure there isn’t another PHP on PATH without these extensions enabled.

#### One-click Windows setup (recommended)
- From VS Code, open Terminal and run:
	- `tools/setup-php-sqlite.ps1` to auto-enable `pdo_sqlite` and `sqlite3` in the active PHP’s `php.ini`.
	- Or run `tools/first-run.ps1` to enable extensions, start the server, and execute the smoke test end-to-end.
- In VS Code, you can also use Tasks:
	- Run task: "PHP: Enable SQLite (auto)" → updates php.ini and validates.
	- Run task: "Dev: First run (auto setup + smoke)" → performs full first-run flow.

### CSRF or session errors in tests
- Always call `/api/csrf.php` first and reuse the cookie for subsequent requests.
- The PowerShell tests handle this; use them as a reference.

### Simple Browser (embedded preview) shows bad_csrf or won’t log in
- Some embedded previews block or isolate cookies, which prevents the PHP session cookie from sticking and breaks CSRF. Open the app in your system browser (Edge/Chrome/Safari/Firefox) and it will work.
- A dev-only header fallback is enabled to keep embedded previews usable:
	- Server accepts `X-Dev-Session` as a session id when `APP_ENV=dev` (default) or `DEV_SESSION_HEADER=1` in `config/app.env`.
	- Client auto-generates a short-lived id when cookies look blocked and sends `X-Dev-Session` on all requests.
	- Do not enable this in production.
	- Diagnostics: visit `/api/cookie_diag.php` to see the session id and cookies the server received.

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
