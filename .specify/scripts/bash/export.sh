#!/usr/bin/env bash
set -euo pipefail
OUT="${1:-./exports/route-summary.csv}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Export route summary (bash placeholder) -> $OUT"
mkdir -p "$(dirname "$OUT")"
{
  echo "id,street,neighborhood,status"
  echo "1,101 1st St W,Downtown,new"
} > "$OUT"
echo "Export written to $OUT"
