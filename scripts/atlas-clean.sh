#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

STUDIO_PORT=8083
DEV_API_PORT=8084

echo ""
echo "Atlas Clean"
echo "───────────"
echo "Studio poorten · ${STUDIO_PORT}, ${DEV_API_PORT}"
echo "App poort · 8081 (niet automatisch gestopt)"
echo ""

free_port() {
  local target_port="$1"
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti :"${target_port}" 2>/dev/null || true)
    if [ -n "${PIDS}" ]; then
      echo "Stopping process(es) on port ${target_port}…"
      echo "${PIDS}" | xargs kill -TERM 2>/dev/null || true
      sleep 1
      echo "${PIDS}" | xargs kill -KILL 2>/dev/null || true
      echo "✔ Port ${target_port} freed"
    else
      echo "✔ Port ${target_port} already free"
    fi
  else
    echo "⚠️ lsof not found — skipping port ${target_port} cleanup"
  fi
}

free_port "${STUDIO_PORT}"
free_port "${DEV_API_PORT}"

if command -v pgrep >/dev/null 2>&1; then
  ATLAS_PIDS=$(pgrep -fl "scripts/atlas-dev" 2>/dev/null || true)
  if [ -n "${ATLAS_PIDS}" ]; then
    echo "Stopping Atlas Studio launcher…"
    pkill -f "scripts/atlas-dev" 2>/dev/null || true
    echo "✔ Atlas Studio launcher stopped"
  fi
fi

echo ""
echo "Clearing Studio caches…"
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

if command -v watchman >/dev/null 2>&1; then
  watchman watch-del-all >/dev/null 2>&1 || true
fi

echo "✔ Cache cleared"
echo ""
echo "Run npm run atlas for Studio (${STUDIO_PORT}) and npm start for App (8081)."
echo ""
