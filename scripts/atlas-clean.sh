#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT=8083

echo ""
echo "Atlas Clean"
echo "───────────"

if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti :${PORT} 2>/dev/null || true)
  if [ -n "${PIDS}" ]; then
    echo "Stopping process(es) on port ${PORT}…"
    echo "${PIDS}" | xargs kill -TERM 2>/dev/null || true
    sleep 1
    echo "${PIDS}" | xargs kill -KILL 2>/dev/null || true
    echo "✔ Port ${PORT} freed"
  else
    echo "✔ Port ${PORT} already free"
  fi
else
  echo "⚠️ lsof not found — skipping port cleanup"
fi

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
echo "Run npm run atlas to start fresh on port ${PORT}."
echo ""
