# Deployment Guide

This project is a self-contained demo designed for local/offline use. To deploy in a production-like environment, review and adapt the following guidance.

## Production Considerations

- Database
  - Use MySQL or PostgreSQL for concurrent multi-user environments.
  - Replace the SQLite DSN in `config/app.env` (`DB_DSN=mysql:host=...;dbname=...`) and provide `DB_USER`/`DB_PASS`.
  - Update `Db.php` connection logic as needed and provide migrations.

- Authentication
  - Implement real magic-link delivery via email (SES, SendGrid, etc.).
  - Enforce one-time token use, expiration, rate limiting, and IP/device logging.
  - Replace demo `X-Staff-Key` with role-based access control and staff login.

- Security
  - Serve over HTTPS; configure HSTS, CSP, and security headers.
  - Rotate `CSRF_SECRET` per environment and store secrets securely.
  - Validate inputs server-side (already implemented for core flows) and consider stricter schemas.

- Sessions and CSRF
  - Ensure cookies are set with `Secure; SameSite=Lax` (or `Strict`) under HTTPS.
  - Disable the dev-only header session fallback by setting `DEV_SESSION_HEADER=0` in `config/app.env`.

- Logging and Monitoring
  - Configure robust error logging (Syslog/ELK) and structured logs.
  - Add application metrics and traces as needed.

- Internationalization
  - Keep translations in `public/i18n/`; expand languages by adding more `<lang>.json` files.

- Static Assets
  - Consider a CDN for assets; version with cache-busting.

## Deploy Steps (Example: PHP-FPM + Nginx)

1. Build artifacts
   - Ensure `data/schema.sql` and migrations are present.
   - Package the repo (excluding `data/app.db`).

2. Provision environment
   - PHP 8.1+, PDO, pdo_sqlite/sqlite3 (or DB-native drivers), Nginx/Apache.

3. Configure environment
   - Copy `config/app.example.env` to `config/app.env` and set values.
   - Set `APP_ENV=prod`, `DEV_SESSION_HEADER=0`.

4. Initialize database
   - Run migrations for your chosen RDBMS.

5. Web server
   - Point document root to `public/`.
   - Route `/api/*.php` to PHP-FPM.

6. Smoke test
   - Hit `/api/ping.php` and `/api/tenants.php`.
   - Exercise login flow using a test account.

## Troubleshooting

See `docs/troubleshooting.md` for common local issues, and add environment-specific notes as you scale beyond the demo.
