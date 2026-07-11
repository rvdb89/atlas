import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import { join } from "node:path";

import { APP_PORT, APP_URL } from "@/atlas/config/ports";

import { ROOT_DIR } from "./shared";

/**
 * App Launcher · local dev servers Atlas Control can open with one click.
 *
 * Found live: clicking "Doughbert app" in the sidebar just did `window.open(APP_URL)`
 * unconditionally, assuming the Expo dev server for that app was already running as a
 * separate process the CEO had to remember to start manually. If it wasn't, the browser tab
 * landed on a bare ERR_CONNECTION_REFUSED page — no explanation, no way to fix it from
 * Control. As more apps join the portfolio that failure would repeat per app.
 *
 * This registry plus the /apps/status and /apps/launch routes on the same local apply-bridge
 * server (atlas-runtime.ts already runs one for /apply and /pin) let Control check liveness
 * first and spawn the dev server itself on demand. Adding a future app is one entry here —
 * no other wiring required, as long as it exposes a single HTTP port that responds once ready.
 */
export type RegisteredApp = {
  id: string;
  name: string;
  url: string;
  command: string;
  args: string[];
};

export const REGISTERED_APPS: RegisteredApp[] = [
  {
    id: "doughbert",
    name: "Doughbert app",
    url: APP_URL,
    command: "npx",
    args: ["expo", "start", "--port", String(APP_PORT), "--clear"],
  },
];

export function findRegisteredApp(appId: string): RegisteredApp | undefined {
  return REGISTERED_APPS.find((app) => app.id === appId);
}

/** Single-shot, short-timeout liveness probe — never throws, never hangs waiting on a dead
 * port. `< 500` (not `response.ok`) on purpose: a dev server that's up but currently serving
 * a compile error page still counts as "reachable", which is the only thing this needs to know. */
export async function probeAppUrl(url: string, timeoutMs = 1500): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { method: "GET", signal: controller.signal });
    clearTimeout(timeout);
    return response.status < 500;
  } catch {
    return false;
  }
}

export async function getAppsStatus(): Promise<Record<string, boolean>> {
  const entries = await Promise.all(
    REGISTERED_APPS.map(async (app) => [app.id, await probeAppUrl(app.url)] as const),
  );
  return Object.fromEntries(entries);
}

// Tracks dev-server child processes spawned by this runtime instance, keyed by app id — so a
// second launch call while one is already starting/running is a safe no-op instead of a
// second competing process fighting over the same port.
const running = new Map<string, ChildProcess>();

export type LaunchAppResult = { ok: true; alreadyRunning: boolean } | { ok: false; message: string };

/** Spawns the registered app's dev server if it isn't already tracked as running under this
 * runtime process. Output goes to a log file, not the runtime's own console — this is a
 * background helper process, not part of the always-on decision-loop log. Never blocks for
 * readiness; callers poll getAppsStatus()/probeAppUrl() separately. */
export function launchApp(appId: string): LaunchAppResult {
  const app = findRegisteredApp(appId);
  if (!app) {
    return { ok: false, message: `Onbekende app "${appId}".` };
  }

  const existing = running.get(appId);
  if (existing && existing.exitCode === null) {
    return { ok: true, alreadyRunning: true };
  }

  const logDir = join(ROOT_DIR, "reports", "runtime", "app-logs");
  mkdirSync(logDir, { recursive: true });
  const logFd = openSync(join(logDir, `${appId}.log`), "a");

  const child = spawn(app.command, app.args, {
    cwd: ROOT_DIR,
    stdio: ["ignore", logFd, logFd],
    env: { ...process.env, BROWSER: "none", EXPO_NO_TELEMETRY: "1" },
  });

  running.set(appId, child);
  child.on("exit", () => {
    // Drop the (now-dead) entry so a future launch call is treated as fresh, not
    // "already running" against a process that no longer exists.
    running.delete(appId);
  });

  return { ok: true, alreadyRunning: false };
}
