import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ROOT_DIR, getPortPids, getProcessCommands } from "./shared";
import { APPLY_BRIDGE_PORT, EXECUTIVE_MEMORY_PORT } from "./runtimePorts";

/**
 * Runtime Lifecycle Management (tooling, buiten sprintteling — zie CTO-impactanalyse).
 *
 * Shared helpers for `atlas:runtime:start/status/stop/restart`. Deliberately separate from
 * atlas-runtime.ts itself: this file owns *lifecycle bookkeeping* (is a runtime already
 * running, where's its PID file), never Executive Memory or Company State logic. The only
 * change to atlas-runtime.ts is one additive line in its existing shutdown() that removes
 * this PID file — and only when it names that exact process.
 */

export const ATLAS_DIR = join(ROOT_DIR, ".atlas");
export const PID_FILE = join(ATLAS_DIR, "runtime.pid");
export const LOG_FILE = join(ATLAS_DIR, "runtime.log");

/** Must run before anything opens LOG_FILE or PID_FILE for writing — on a genuine first-ever
 * start, .atlas/ does not exist yet. writePid() already does this too, but the log file is
 * opened earlier in atlas-runtime-start.ts's flow, so that call site needs its own guard. */
export function ensureAtlasDir(): void {
  mkdirSync(ATLAS_DIR, { recursive: true });
}

export function readPid(): number | null {
  if (!existsSync(PID_FILE)) return null;
  try {
    const raw = readFileSync(PID_FILE, "utf8").trim();
    const pid = Number(raw);
    return Number.isFinite(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

export function writePid(pid: number): void {
  mkdirSync(ATLAS_DIR, { recursive: true });
  writeFileSync(PID_FILE, String(pid), "utf8");
}

export function removePidFile(): void {
  try {
    unlinkSync(PID_FILE);
  } catch {
    // already gone — fine
  }
}

/** Only removes the PID file if it still names the given pid — never touches a PID file that
 * (for whatever reason) now points at a different process. Used by atlas-runtime.ts's own
 * shutdown handler, passing its own `process.pid`. */
export function removePidFileIfMatches(pid: number): void {
  const recorded = readPid();
  if (recorded === pid) {
    removePidFile();
  }
}

/** Signal 0 never kills — it only tests whether a process with this pid exists and is
 * signalable by us. ESRCH means "no such process" (dead / stale). EPERM still counts as
 * "alive" (exists, just owned by someone else — vanishingly unlikely for a locally-started
 * dev process, but correct to treat as alive rather than silently ignore). */
export function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

export async function checkExecutiveMemoryHealth(timeoutMs = 1500): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(`http://127.0.0.1:${EXECUTIVE_MEMORY_PORT}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return false;
    const payload = (await response.json()) as { ok?: boolean; service?: string };
    return payload.ok === true && payload.service === "executive-memory";
  } catch {
    return false;
  }
}

export async function waitForExecutiveMemoryHealth(timeoutMs = 10_000): Promise<boolean> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await checkExecutiveMemoryHealth()) return true;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return false;
}

export type PortOwnership = { port: number; pids: number[]; commands: string[] };

/** Uses the project's existing lsof-based helpers (scripts/atlas/shared.ts) — no new
 * dependency. Returns an empty pid list when nothing is listening, or when lsof itself isn't
 * available (already how getPortPids() degrades). */
export function describePortOwnership(port: number): PortOwnership {
  const pids = getPortPids(port);
  return { port, pids, commands: pids.length > 0 ? getProcessCommands(pids) : [] };
}

export type RuntimeLifecycleState =
  | { kind: "healthy"; pid: number }
  | { kind: "running-unhealthy"; pid: number }
  | { kind: "stale-pid"; pid: number }
  | { kind: "not-running" }
  | { kind: "ports-occupied-by-unknown-process"; occupied: PortOwnership[] };

/** Single source of truth for "what state is Atlas Runtime in right now" — used by both
 * `atlas:runtime:status` (read-only report) and `atlas:runtime:start` (idempotency check).
 * Never mutates anything (never removes a stale PID file itself) — callers decide what to do
 * with the answer. */
export async function inspectRuntimeState(): Promise<RuntimeLifecycleState> {
  const pid = readPid();

  if (pid !== null) {
    if (isProcessAlive(pid)) {
      const healthy = await checkExecutiveMemoryHealth();
      return healthy ? { kind: "healthy", pid } : { kind: "running-unhealthy", pid };
    }
    return { kind: "stale-pid", pid };
  }

  const occupied = [describePortOwnership(APPLY_BRIDGE_PORT), describePortOwnership(EXECUTIVE_MEMORY_PORT)].filter(
    (entry) => entry.pids.length > 0,
  );
  if (occupied.length > 0) {
    return { kind: "ports-occupied-by-unknown-process", occupied };
  }

  return { kind: "not-running" };
}

export function printRuntimeUrls(pid?: number): void {
  if (pid !== undefined) console.log(`  PID: ${pid}`);
  console.log(`  apply-bridge:      http://127.0.0.1:${APPLY_BRIDGE_PORT}/apply (localhost only)`);
  console.log(`  executive-memory:  http://0.0.0.0:${EXECUTIVE_MEMORY_PORT} (LAN-reachable, web + mobile)`);
  console.log(`  log:               ${LOG_FILE}`);
}
