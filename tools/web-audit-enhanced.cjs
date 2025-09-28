#!/usr/bin/env node
// Cross-platform wrapper to run the web audit in enhanced UI mode
// Avoids shell-specific env var syntax by setting process.env directly

process.env.UI_MODE = 'enhanced';

// Defer to the existing audit script
import('node:path').then(({ default: path }) => {
  const script = path.resolve(process.cwd(), 'tools', 'web-audit.mjs');
  import(script).catch((err) => {
    console.error('Failed to run web audit in enhanced mode:', err);
    process.exit(1);
  });
});
