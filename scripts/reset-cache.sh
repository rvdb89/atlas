#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Resetting Expo / Metro caches…"

rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

if command -v watchman >/dev/null 2>&1; then
  watchman watch-del-all >/dev/null 2>&1 || true
fi

echo "✔ Cache cleared"
echo "Run npm run dev to start fresh."
