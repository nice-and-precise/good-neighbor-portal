#!/usr/bin/env bash
set -euo pipefail
echo "==> PHP syntax check (php -l)"
if ! command -v php >/dev/null 2>&1; then
  echo "php is required on PATH" >&2
  exit 1
fi
find . -type f -name "*.php" -not -path "./vendor/*" -print0 | xargs -0 -n1 php -l
