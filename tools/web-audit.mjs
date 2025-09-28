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
  const argMode = (process.argv[2] || '').toLowerCase();
  const uiMode = (process.env.UI_MODE || argMode || '').toLowerCase();

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
    if (uiMode === 'enhanced' || uiMode === 'standard') {
      await page.evaluate((m) => {
        try { localStorage.setItem('uiMode', m); } catch {}
        document.body.classList.toggle('enhanced', m === 'enhanced');
      }, uiMode);
      await page.waitForTimeout(100);
    }
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
        writeJSON(path.join(outDir, `i18n-check-${ts}.json`), { uiMode: uiMode || 'default', es: i18nOkEs, en: i18nOkEn, headingEs, headingEn });
      } else {
        writeJSON(path.join(outDir, `i18n-check-${ts}.json`), { uiMode: uiMode || 'default', skipped: true, reason: 'i18n controls not visible (likely require login)' });
      }
    } catch (e) {
      writeJSON(path.join(outDir, `i18n-check-${ts}.json`), { uiMode: uiMode || 'default', error: String(e) });
    }

    // Responsive sweep: common breakpoints
    try {
      const breakpoints = [
        { name: 'xs-375', width: 375, height: 667 },
        { name: 'sm-640', width: 640, height: 800 },
        { name: 'md-768', width: 768, height: 900 },
        { name: 'lg-1024', width: 1024, height: 900 },
        { name: 'xl-1280', width: 1280, height: 900 }
      ];
      for (const bp of breakpoints) {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(outDir, `responsive-${bp.name}-${ts}.png`), fullPage: true });
      }
      // Restore default
      await page.setViewportSize({ width: 1366, height: 768 });
    } catch {}

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

    // Contrast check for common selectors
    try {
      function toRGB(c) {
        // Supports rgb(a) and hex
        if (!c) return [255, 255, 255, 1];
        if (c.startsWith('rgb')) {
          const parts = c.replace(/rgba?\(|\)/g, '').split(',').map(s => s.trim());
          return [parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), parts[3] !== undefined ? parseFloat(parts[3]) : 1];
        }
        if (c.startsWith('#')) {
          let hex = c.slice(1);
          if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
          const num = parseInt(hex, 16);
          return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 1];
        }
        return [255, 255, 255, 1];
      }
      function relLuminance([r, g, b]) {
        const srgb = [r, g, b].map(v => v / 255);
        const rgb = srgb.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      }
      function contrastRatio(fg, bg) {
        const L1 = relLuminance(fg);
        const L2 = relLuminance(bg);
        const lighter = Math.max(L1, L2);
        const darker = Math.min(L1, L2);
        return (lighter + 0.05) / (darker + 0.05);
      }
      async function getEffectiveBG(page, selector) {
        return await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          let node = el;
          while (node) {
            const cs = getComputedStyle(node);
            if (cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') {
              return cs.backgroundColor;
            }
            node = node.parentElement;
          }
          return 'rgb(255, 255, 255)';
        }, selector);
      }
      async function getColor(page, selector) {
        return await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = getComputedStyle(el);
          return cs.color;
        }, selector);
      }
      const selectors = ['.muted', '.badge', 'button'];
      const results = {};
      for (const sel of selectors) {
        const visible = await page.isVisible(sel).catch(() => false);
        if (!visible) { results[sel] = { present: false }; continue; }
        const fgCSS = await getColor(page, sel);
        const bgCSS = await getEffectiveBG(page, sel);
        if (!fgCSS || !bgCSS) { results[sel] = { present: true, error: 'no colors' }; continue; }
        const fg = toRGB(fgCSS);
        const bg = toRGB(bgCSS);
        const ratio = contrastRatio([fg[0], fg[1], fg[2]], [bg[0], bg[1], bg[2]]);
        const passAA = ratio >= 4.5; // normal text threshold
        results[sel] = { present: true, fg: fgCSS, bg: bgCSS, ratio: Number(ratio.toFixed(2)), passAA };
      }
      writeJSON(path.join(outDir, `contrast-${ts}.json`), { uiMode: uiMode || 'default', ...results });
    } catch (e) {
      writeJSON(path.join(outDir, `contrast-${ts}.json`), { uiMode: uiMode || 'default', error: String(e) });
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
  writeJSON(path.join(outDir, `summary-${ts}.json`), { ...summary, uiMode: uiMode || 'default' });

    await context.close();
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Web audit failed:', err);
  process.exit(1);
});
