#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Setup (bash) under $ROOT_DIR"
mkdir -p config data exports

# Create SQLite DB from schema and seed
if command -v sqlite3 >/dev/null 2>&1; then
  rm -f data/app.db
  sqlite3 data/app.db < data/schema.sql
  sqlite3 data/app.db < data/seed.sql
else
  echo "sqlite3 not found; please install sqlite3" >&2
  exit 1
fi

# Minimal env file if missing
if [ ! -f config/app.env ]; then
  cat > config/app.env <<EOF
CSRF_SECRET=dev-secret
SESSION_NAME=GNPSESSID
STAFF_DEMO_KEY=demo-staff
TENANT_DEFAULT=willmar-mn
EOF
fi

echo "Setup complete."
