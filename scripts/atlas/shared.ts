import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const ATLAS_PORT = 8083;
export const ATLAS_STUDIO_DEFAULT_PATH = "/studio/ceo-workflow";
export const ATLAS_STUDIO_FALLBACK_PATH = "/studio";
/** @deprecated Use ATLAS_STUDIO_DEFAULT_PATH — kept for Command Center links */
export const COMMAND_CENTER_PATH = "/studio/command-center";
export const COMMAND_CENTER_URL = `http://localhost:${ATLAS_PORT}${COMMAND_CENTER_PATH}`;

export const ATLAS_STUDIO_ROUTE_LABELS: Record<string, string> = {
  [ATLAS_STUDIO_DEFAULT_PATH]: "CEO Workflow",
  [ATLAS_STUDIO_FALLBACK_PATH]: "Studio",
  [COMMAND_CENTER_PATH]: "Command Center",
};

export function resolveAtlasStudioLaunchRoute(session?: {
  lastRoute?: string;
  lastRouteLabel?: string;
}): { path: string; label: string } {
  if (session?.lastRoute?.startsWith("/studio")) {
    return {
      path: session.lastRoute,
      label: session.lastRouteLabel ?? ATLAS_STUDIO_ROUTE_LABELS[session.lastRoute] ?? session.lastRoute,
    };
  }

  const ceoRouteFile = join(ROOT_DIR, "src/app/studio/ceo-workflow.tsx");
  if (existsSync(ceoRouteFile)) {
    return {
      path: ATLAS_STUDIO_DEFAULT_PATH,
      label: ATLAS_STUDIO_ROUTE_LABELS[ATLAS_STUDIO_DEFAULT_PATH],
    };
  }

  const studioIndexFile = join(ROOT_DIR, "src/app/studio/index.tsx");
  if (existsSync(studioIndexFile)) {
    return {
      path: ATLAS_STUDIO_FALLBACK_PATH,
      label: ATLAS_STUDIO_ROUTE_LABELS[ATLAS_STUDIO_FALLBACK_PATH],
    };
  }

  return {
    path: ATLAS_STUDIO_FALLBACK_PATH,
    label: ATLAS_STUDIO_ROUTE_LABELS[ATLAS_STUDIO_FALLBACK_PATH],
  };
}

export const ROOT_DIR = process.cwd();

export type StatusLevel = "ok" | "warning" | "error";

export function printBanner(): void {
  console.log("");
  console.log("╔══════════════════════════════════════╗");
  console.log("║         ATLAS DEVELOPER LAUNCHER     ║");
  console.log("╚══════════════════════════════════════╝");
  console.log("");
}

export function readAtlasVersion(): { version: string; build: string } {
  const source = readFileSync(join(ROOT_DIR, "src/atlas/version.ts"), "utf8");
  const version = source.match(/ATLAS_VERSION = "([^"]+)"/)?.[1] ?? "unknown";
  const build = source.match(/ATLAS_BUILD = "([^"]+)"/)?.[1] ?? "unknown";
  return { version, build };
}

export function printStatus(level: StatusLevel, label: string, detail?: string): void {
  const icon = level === "ok" ? "✅" : level === "warning" ? "⚠️" : "❌";
  console.log(`${icon} ${label}${detail ? ` — ${detail}` : ""}`);
}

export function normalizeExecOutput(output: string | Buffer | null | undefined): string {
  if (output == null) {
    return "";
  }
  if (typeof output === "string") {
    return output.trim();
  }
  return output.toString("utf8").trim();
}

export function runCommand(command: string, args: string[], options?: { cwd?: string; stdio?: "inherit" | "pipe" }): string {
  const stdio = options?.stdio ?? "pipe";

  if (stdio === "inherit") {
    runCommandInherit(command, args, options);
    return "";
  }

  return normalizeExecOutput(
    execSync([command, ...args].join(" "), {
      cwd: options?.cwd ?? ROOT_DIR,
      stdio: "pipe",
      encoding: "utf8",
    }),
  );
}

export function runCommandInherit(command: string, args: string[], options?: { cwd?: string }): void {
  execSync([command, ...args].join(" "), {
    cwd: options?.cwd ?? ROOT_DIR,
    stdio: "inherit",
  });
}

export function commandExists(command: string): boolean {
  try {
    execSync(`command -v ${command}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export function checkNodeAndNpm(): { ok: boolean; node: string; npm: string } {
  try {
    const node = runCommand("node", ["-v"]);
    const npm = runCommand("npm", ["-v"]);
    return { ok: true, node, npm };
  } catch {
    return { ok: false, node: "missing", npm: "missing" };
  }
}

export function checkDependenciesInstalled(): boolean {
  return existsSync(join(ROOT_DIR, "node_modules"));
}

export function checkEnvFile(): { exists: boolean; path: string } {
  const envPath = join(ROOT_DIR, ".env");
  return { exists: existsSync(envPath), path: envPath };
}

export function checkAnthropicKeyStatus(): "configured" | "missing" {
  const { exists } = checkEnvFile();
  if (!exists) return "missing";

  const content = readFileSync(join(ROOT_DIR, ".env"), "utf8");
  const match = content.match(/^ANTHROPIC_API_KEY=(.+)$/m);
  const value = match?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
  if (!value || value === "your_api_key_here") return "missing";
  return "configured";
}

export function getPortPids(port: number): number[] {
  if (process.platform === "win32") return [];
  try {
    const output = runCommand("lsof", ["-ti", `:${port}`]);
    return output
      .split("\n")
      .map((line) => Number(line.trim()))
      .filter((pid) => Number.isFinite(pid) && pid > 0);
  } catch {
    return [];
  }
}

export function getProcessCommands(pids: number[]): string[] {
  if (process.platform === "win32") return pids.map(() => "unknown");
  return pids.map((pid) => {
    try {
      return runCommand("ps", ["-p", String(pid), "-o", "command="]);
    } catch {
      return "unknown";
    }
  });
}

export function describePortUsage(port: number): string {
  if (process.platform === "win32") return "Port check unavailable on Windows";
  try {
    return runCommand("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]);
  } catch {
    return "No process found";
  }
}

export function isPortInUse(port: number): boolean {
  return getPortPids(port).length > 0;
}

export function killPortProcesses(port: number): number {
  const pids = getPortPids(port);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // ignore
      }
    }
  }
  return pids.length;
}

export function detectDevProcesses(): string[] {
  if (process.platform === "win32") return [];
  const patterns = ["expo start", "metro", "@expo/cli"];
  const found: string[] = [];

  for (const pattern of patterns) {
    try {
      const output = runCommand("pgrep", ["-fl", pattern]);
      if (output) found.push(...output.split("\n").filter(Boolean));
    } catch {
      // no matches
    }
  }

  return [...new Set(found)];
}

export const STUDIO_ROUTES = [
  "src/app/studio/command-center.tsx",
  "src/app/studio/ceo-workflow.tsx",
  "src/app/studio/health.tsx",
  "src/app/studio/proof-of-power.tsx",
  "src/app/studio/index.tsx",
  "src/app/studio/_layout.tsx",
];

export function checkRouteFiles(): Array<{ route: string; ok: boolean }> {
  return STUDIO_ROUTES.map((route) => ({
    route,
    ok: existsSync(join(ROOT_DIR, route)),
  }));
}

export type BrowserLaunchResult = { ok: true } | { ok: false; reason: string };

export function openBrowser(url: string): BrowserLaunchResult {
  try {
    if (process.platform === "darwin") {
      runCommandInherit("open", [url]);
      return { ok: true };
    }
    if (process.platform === "win32") {
      runCommandInherit("cmd", ["/c", "start", "", url]);
      return { ok: true };
    }
    runCommandInherit("xdg-open", [url]);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function waitForUrl(url: string, timeoutMs = 120_000): Promise<boolean> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok || response.status < 500) return true;
    } catch {
      // server not ready
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

export async function probeAtlasDevApi(port: number): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`http://127.0.0.1:${port}/atlas/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return false;
    const payload = (await response.json()) as { service?: string };
    return payload.service === "atlas-dev-api";
  } catch {
    return false;
  }
}
