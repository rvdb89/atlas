#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ "${1:-}" == "--both" ]]; then
  exec npx tsx scripts/dev-launcher.ts --both
fi

exec npx tsx scripts/dev-launcher.ts
