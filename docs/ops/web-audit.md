# Web Audit Workflow

This workflow runs a headless Chromium audit using Playwright against the local PHP server.

## What it captures
- Desktop full-page screenshot
- Mobile (iPhone 12) full-page screenshot
- DOM snapshot (HTML)
- Accessibility tree (JSON)
- Console messages (JSON)
- Network requests/responses (JSON)

## Where to find it
- GitHub Actions: "Web Audit (Headless Chrome)"
- Artifact name: `web-audit-artifacts`
- Files are written to `artifacts/web-audit` during the run

## How it works
1. Starts `php -S 127.0.0.1:8080 -t public`
2. Installs Playwright Chromium
3. Runs `node tools/web-audit.mjs` (reads `TARGET_URL` env)
4. Uploads artifacts

## Local run (optional)
You can run the script locally after starting the PHP server:

```powershell
# In repo root after starting the PHP dev server
node .\tools\web-audit.mjs
```

Outputs will be placed under `artifacts/web-audit/`.
