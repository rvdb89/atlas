# Doughbert / Project Atlas

Expo app with **Project Atlas** — a domain-independent AI operating layer for Studio, entities, intelligence, and publishing.

## Zero config quick start

```bash
git clone <repo>
cd doughbert-app
npm install
npm run atlas
```

Atlas OS handles environment checks, auto recovery, Expo web on port **8083**, browser launch, health monitoring, and session restore. No QR code. No manual port cleanup.

Optional (live Claude):

```bash
cp .env.example .env
# add ANTHROPIC_API_KEY
```

## Atlas OS commands

| Command | Description |
|---------|-------------|
| `npm run atlas` | Boot Atlas OS — live startup UI, auto recovery, watch mode |
| `npm run atlas command` | Interactive command palette |
| `npm run atlas inspect` | Modules, providers, routes, registries, deps |
| `npm run atlas:health` | Platform health report |
| `npm run atlas:doctor` | Diagnostics with fix suggestions |
| `npm run atlas:clean` | Manual clean (Atlas auto-recovers by default) |
| `npm run atlas:commit-check` | Pre-commit report |

Legacy: `npm start`, `npm run dev`, `npm run health`, `npm run clean`

## Primary routes

| Route | Purpose |
|-------|---------|
| `/studio/command-center` | Atlas cockpit (default launch) |
| `/studio/health` | Health dashboard |
| `/studio/proof-of-power` | Workflow demo |

```
http://localhost:8083/studio/command-center
```

## In-app developer tools

- **Ctrl+Shift+D** — Atlas Developer Overlay (FPS, route, provider, memory)
- **Ctrl+Shift+R** — Restart Atlas runtime without closing terminal
- Toast notifications for route, registry, Claude, and health events

## Git workflow

```bash
git status
git add .
npm run atlas:commit-check
git commit -m "your message"
git push
```

## Architecture notes

Atlas OS CLI lives in `scripts/atlas/os/` with extension points for future Docker, multi-project, cloud sync, remote agents, CI dashboard, and telemetry.

## Tech stack

- Expo Router v57 · React Native · TypeScript
- Project Atlas (`src/atlas/`)
