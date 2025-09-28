#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-8080}"
HOST="${HOST:-127.0.0.1}"

echo "==> Starting PHP dev server at http://$HOST:$PORT (bash)"
if ! command -v php >/dev/null 2>&1; then
  echo "php is required on PATH" >&2
  exit 1
fi

exec php -S "$HOST:$PORT" -t public
