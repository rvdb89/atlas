/** App Launcher (client side) · talks to the local apply-bridge server's /apps/status and
 * /apps/launch routes (see scripts/atlas/appsRegistry.ts + scripts/atlas-runtime.ts) so
 * "open app" links in Atlas Control can check liveness and spawn a dev server on demand,
 * instead of blindly window.open()-ing a port that might not have anything listening on it.
 * Every call here is best-effort with a short timeout — the bridge only exists while
 * `npm run atlas:runtime` is running locally, and none of this may ever block navigation. */

const APPS_BRIDGE_BASE = "http://127.0.0.1:8791";

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export type AppsStatusResult = { bridgeReachable: boolean; status: Record<string, boolean> };

/** Bugfix 2026-07-10 (found the same evening) · This used to also have a client-side
 * `fetch(url, { mode: "no-cors" })` "fast path" straight to the app's own port, on the theory
 * that a refused connection always rejects. Found live: it didn't — the very next click after
 * fixing the popup-blocker issue navigated straight to a dead localhost:8081 tab
 * (ERR_CONNECTION_REFUSED) even though scripts/atlas/appsRegistry.ts's launch log showed the
 * bridge was never even called, meaning the client-side probe alone reported "reachable"
 * incorrectly. Browser-side reachability probes to a local port are exactly this kind of
 * unreliable (opaque no-cors responses, IPv6/IPv4 loopback races, etc.) — removed entirely.
 * Every liveness check now goes through this one function, which hits the local bridge
 * (scripts/atlas-runtime.ts), which does the actual check with a plain Node `fetch()` — no
 * CORS ambiguity there, since Node doesn't apply browser CORS semantics at all. */
export async function fetchAppsStatus(): Promise<AppsStatusResult> {
  try {
    const response = await fetchWithTimeout(`${APPS_BRIDGE_BASE}/apps/status`, { method: "GET" }, 4000);
    const payload = (await response.json()) as { ok: boolean; status?: Record<string, boolean> };
    return { bridgeReachable: !!payload.ok, status: payload.status ?? {} };
  } catch {
    return { bridgeReachable: false, status: {} };
  }
}

export async function requestAppLaunch(appId: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `${APPS_BRIDGE_BASE}/apps/launch`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ appId }),
      },
      4000,
    );
    const payload = (await response.json()) as { ok: boolean };
    return payload.ok;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bugfix 2026-07-10 · The first version of this awaited a reachability check *before* ever
 * calling window.open(). That breaks in every real browser: window.open() is only treated as
 * a trusted, user-initiated action (and left un-blocked by the popup blocker) when it runs
 * synchronously inside the click handler's call stack. As soon as an `await` happens first,
 * the "user activation" signal expires and the popup blocker silently kills the call — no
 * error, no new tab, nothing. Found live: clicking "Doughbert app" did nothing at all, and
 * scripts/atlas/appsRegistry.ts's launch log confirmed the bridge was never even called,
 * meaning the click handler's async work never got far enough to matter.
 *
 * Fix: open a real (non-blank-forever) tab synchronously, first thing in the click handler —
 * see openAppTab() below — then do all the async reachability/launch/poll work against that
 * already-open window and navigate it once the destination is actually ready. */
export function openAppTab(): Window | null {
  const win = window.open("", "_blank");
  if (win) {
    // A little placeholder so the tab isn't a blank void for the (possibly ~45s) time it can
    // take a cold Expo dev server to boot — mirrors the status text shown in the sidebar.
    win.document.write(
      "<title>Doughbert app</title><body style=\"background:#030508;color:#8b9cb3;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0\"><p>Doughbert app wordt gestart…</p></body>",
    );
  }
  return win;
}

export type AppOpenOutcome = "opened" | "starting-timeout" | "bridge-unreachable" | "popup-blocked";

/** Full flow behind an "open app" click, run against an already-open window (see
 * openAppTab() — must be opened synchronously in the click handler, before this is called).
 * Every liveness check (initial and every poll) goes through the local bridge's /apps/status
 * — see fetchAppsStatus()'s comment for why the client never checks a local port directly.
 * Already running → navigate immediately. Not running → ask the bridge to launch it, then
 * poll until it comes up (or give up after `timeoutMs` and close the placeholder tab so the
 * CEO gets a clear message in the sidebar instead of a dead tab sitting open). */
export async function openOrLaunchApp(
  appId: string,
  url: string,
  win: Window | null,
  onStatusChange: (status: "checking" | "starting") => void,
  timeoutMs = 45_000,
): Promise<AppOpenOutcome> {
  if (!win) return "popup-blocked";

  onStatusChange("checking");
  const initial = await fetchAppsStatus();
  if (!initial.bridgeReachable) {
    win.close();
    return "bridge-unreachable";
  }
  if (initial.status[appId]) {
    win.location.href = url;
    return "opened";
  }

  onStatusChange("starting");
  const launched = await requestAppLaunch(appId);
  if (!launched) {
    win.close();
    return "bridge-unreachable";
  }

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(1500);
    const polled = await fetchAppsStatus();
    if (polled.status[appId]) {
      win.location.href = url;
      return "opened";
    }
  }

  win.close();
  return "starting-timeout";
}
