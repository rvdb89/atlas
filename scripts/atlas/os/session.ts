import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ATLAS_SESSION_DIR, ATLAS_SESSION_FILE, ATLAS_ROUTE_LABELS } from "./constants";
import { COMMAND_CENTER_PATH, ROOT_DIR, runCommand } from "../shared";

export type AtlasSession = {
  branch?: string;
  lastCommit?: string;
  lastCommitShort?: string;
  lastRoute?: string;
  lastRouteLabel?: string;
  lastBootAt?: string;
  previousBootAt?: string;
  coldBootMs?: number;
  warmBootMs?: number;
  workspace?: string;
};

export function ensureZeroConfigEnv(): boolean {
  const envPath = join(ROOT_DIR, ".env");
  const examplePath = join(ROOT_DIR, ".env.example");
  if (existsSync(envPath) || !existsSync(examplePath)) return existsSync(envPath);
  copyFileSync(examplePath, envPath);
  return true;
}

export function ensureSessionDir(): void {
  const dir = join(ROOT_DIR, ATLAS_SESSION_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function readSession(): AtlasSession {
  ensureSessionDir();
  const path = join(ROOT_DIR, ATLAS_SESSION_FILE);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8")) as AtlasSession;
  } catch {
    return {};
  }
}

export function writeSession(session: AtlasSession): void {
  ensureSessionDir();
  writeFileSync(join(ROOT_DIR, ATLAS_SESSION_FILE), `${JSON.stringify(session, null, 2)}\n`, "utf8");
}

export function resolveWorkspaceName(): string {
  const session = readSession();
  if (session.workspace) return session.workspace;

  try {
    const name = runCommand("git", ["config", "user.name"]);
    if (name) return name;
  } catch {
    // ignore
  }

  return "Atlas Developer";
}

export function readGitSessionInfo(): Pick<AtlasSession, "branch" | "lastCommit" | "lastCommitShort"> {
  try {
    const branch = runCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const lastCommit = runCommand("git", ["rev-parse", "HEAD"]);
    const lastCommitShort = runCommand("git", ["rev-parse", "--short", "HEAD"]);
    return { branch, lastCommit, lastCommitShort };
  } catch {
    return {};
  }
}

export function resolveLaunchRoute(session: AtlasSession): { path: string; label: string } {
  const path = session.lastRoute ?? COMMAND_CENTER_PATH;
  const label = session.lastRouteLabel ?? ATLAS_ROUTE_LABELS[path] ?? path;
  return { path, label };
}

export function recordBootTiming(startedAt: number, previousSession: AtlasSession): AtlasSession {
  const bootMs = Date.now() - startedAt;
  const isWarm = Boolean(previousSession.lastBootAt);
  const git = readGitSessionInfo();

  return {
    ...previousSession,
    ...git,
    workspace: resolveWorkspaceName(),
    previousBootAt: previousSession.lastBootAt,
    lastBootAt: new Date().toISOString(),
    coldBootMs: isWarm ? previousSession.coldBootMs : bootMs,
    warmBootMs: isWarm ? bootMs : previousSession.warmBootMs,
  };
}

export function updateSessionRoute(path: string, label?: string): AtlasSession {
  const session = readSession();
  const next: AtlasSession = {
    ...session,
    lastRoute: path,
    lastRouteLabel: label ?? ATLAS_ROUTE_LABELS[path] ?? path,
  };
  writeSession(next);
  return next;
}
