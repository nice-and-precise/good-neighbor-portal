// tools/web-audit.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8');
}

function timestamp() {
  return new Date().toISOString().replace(/[:]/g, '-');
}

async function run() {
  const outDir = path.resolve(process.cwd(), 'artifacts', 'web-audit');
  await ensureDir(outDir);

  const url = process.env.TARGET_URL || 'http://127.0.0.1:8080/';

  // Import playwright lazily to allow workflow to install it
  const { chromium, devices } = await import('playwright');

  const consoleLogs = [];
  const network = { requests: [], responses: [] };

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await context.newPage();

    page.on('console', (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text(), ts: Date.now() });
    });
    page.on('request', (req) => {
      network.requests.push({ url: req.url(), method: req.method(), resourceType: req.resourceType(), ts: Date.now() });
    });
    page.on('response', async (res) => {
      const headers = res.headers();
      const entry = { url: res.url(), status: res.status(), ok: res.ok(), ts: Date.now(), headers };
      network.responses.push(entry);
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500); // small settle

    // Desktop screenshot and DOM
    const ts = timestamp();
  await page.screenshot({ path: path.join(outDir, `desktop-${ts}.png`), fullPage: true });
    const html = await page.content();
    fs.writeFileSync(path.join(outDir, `dom-${ts}.html`), html, 'utf-8');

    // A11y snapshot (best-effort)
    try {
      const ax = await page.accessibility.snapshot();
      writeJSON(path.join(outDir, `a11y-${ts}.json`), ax);
    } catch (e) {
      writeJSON(path.join(outDir, `a11y-${ts}.json`), { error: String(e) });
    }

    // Verify i18n toggle (best-effort without login)
    try {
      const esSel = 'button[data-lang="es"]';
      const enSel = 'button[data-lang="en"]';
      const esVisible = await page.isVisible(esSel).catch(() => false);
      const enVisible = await page.isVisible(enSel).catch(() => false);
      if (esVisible && enVisible) {
        // Click Español and wait for heading to update
        await page.click(esSel);
        await page.waitForSelector('[data-i18n="language"]');
        const headingEs = await page.textContent('[data-i18n="language"]');
        const i18nOkEs = !!(headingEs && headingEs.toLowerCase().includes('idioma'));
        await page.screenshot({ path: path.join(outDir, `desktop-es-${ts}.png`), fullPage: true });
        // Switch back to English
        await page.click(enSel);
        await page.waitForSelector('[data-i18n="language"]');
        const headingEn = await page.textContent('[data-i18n="language"]');
        const i18nOkEn = !!(headingEn && headingEn.toLowerCase().includes('language'));
        writeJSON(path.join(outDir, `i18n-check-${ts}.json`), { es: i18nOkEs, en: i18nOkEn, headingEs, headingEn });
      } else {
        writeJSON(path.join(outDir, `i18n-check-${ts}.json`), { skipped: true, reason: 'i18n controls not visible (likely require login)' });
      }
    } catch (e) {
      writeJSON(path.join(outDir, `i18n-check-${ts}.json`), { error: String(e) });
    }

    // Mobile emulation (iPhone 12)
    const iPhone = devices['iPhone 12'];
    if (iPhone) {
      const mctx = await browser.newContext({ ...iPhone });
      const mpage = await mctx.newPage();
      await mpage.goto(url, { waitUntil: 'networkidle' });
      await mpage.waitForTimeout(500);
      await mpage.screenshot({ path: path.join(outDir, `mobile-iphone12-${ts}.png`), fullPage: true });
      await mctx.close();
    }

    // Write logs
    writeJSON(path.join(outDir, `console-${ts}.json`), consoleLogs);
    writeJSON(path.join(outDir, `network-${ts}.json`), network);

    // Basic summary
    const summary = {
      url,
      when: new Date().toISOString(),
      files: fs.readdirSync(outDir).filter(f => f.includes(ts)),
      counts: { console: consoleLogs.length, requests: network.requests.length, responses: network.responses.length }
    };
    writeJSON(path.join(outDir, `summary-${ts}.json`), summary);

    await context.close();
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Web audit failed:', err);
  process.exit(1);
});
