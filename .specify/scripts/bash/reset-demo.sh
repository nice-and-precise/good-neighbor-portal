#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Reset demo (bash)"
rm -f data/app.db
"$ROOT_DIR/.specify/scripts/bash/setup.sh"
echo "Reset complete."
