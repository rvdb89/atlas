export const ATLAS_OS_TAGLINE = "Artificial Intelligence Operating System";
export const ATLAS_DEV_API_PORT = 8084;
export const ATLAS_SESSION_DIR = ".atlas";
export const ATLAS_SESSION_FILE = ".atlas/session.json";
export const ATLAS_RESTART_SIGNAL = ".atlas/restart.signal";

export const ATLAS_ROUTE_LABELS: Record<string, string> = {
  "/studio/command-center": "Studio / Command Center",
  "/studio/ceo-workflow": "Studio / CEO Workflow",
  "/studio/health": "Studio / Health Dashboard",
  "/studio/proof-of-power": "Studio / Proof Of Power",
  "/studio": "Studio / Home",
};

export const WATCH_PATHS = [
  "src/atlas/entity",
  "src/atlas/workflows",
  "src/atlas/studio",
  "src/atlas/ai/providers",
  "src/atlas/intelligence",
  "src/atlas/publishing",
  "src/app/studio",
];
