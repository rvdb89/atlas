#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT=8083
DEV_API_PORT=8084

echo ""
echo "Atlas Clean"
echo "───────────"

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

free_port "${PORT}"
free_port "${DEV_API_PORT}"

if command -v pgrep >/dev/null 2>&1; then
  EXPO_PIDS=$(pgrep -fl "expo start" 2>/dev/null || true)
  if [ -n "${EXPO_PIDS}" ]; then
    echo "Stopping Expo dev processes…"
    pkill -f "expo start" 2>/dev/null || true
    echo "✔ Expo processes stopped"
  fi

  METRO_PIDS=$(pgrep -fl "metro" 2>/dev/null || true)
  if [ -n "${METRO_PIDS}" ]; then
    echo "Stopping Metro bundler processes…"
    pkill -f "metro" 2>/dev/null || true
    echo "✔ Metro processes stopped"
  fi
fi

echo ""
echo "Clearing caches…"
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

if command -v watchman >/dev/null 2>&1; then
  watchman watch-del-all >/dev/null 2>&1 || true
fi

echo "✔ Cache cleared"
echo ""
echo "Run npm run atlas to start fresh on ports ${PORT} and ${DEV_API_PORT}."
echo ""
