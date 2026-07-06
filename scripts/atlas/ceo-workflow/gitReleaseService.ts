import { existsSync } from "node:fs";
import { join } from "node:path";

import { ROOT_DIR, runCommand } from "../shared";

const BLOCKED_STAGE_PATTERNS = [/^\.env$/i, /\/\.env$/i, /\.env\.local$/i];

export type GitReleaseStatus = {
  available: boolean;
  branch: string;
  clean: boolean;
  changedFiles: string[];
  stagedFiles: string[];
  hasEnvStaged: boolean;
  hasEnvChanged: boolean;
};

function parsePorcelainPath(line: string): string {
  if (line.startsWith("??")) return line.slice(3).trim();
  if (line.length >= 3 && line[2] === " ") return line.slice(3).trim();
  const trimmed = line.trim();
  const parts = trimmed.split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : trimmed;
}

function isBlockedPath(path: string): boolean {
  return BLOCKED_STAGE_PATTERNS.some((pattern) => pattern.test(path));
}

export function getGitReleaseStatus(): GitReleaseStatus {
  if (!existsSync(join(ROOT_DIR, ".git"))) {
    return {
      available: false,
      branch: "unknown",
      clean: true,
      changedFiles: [],
      stagedFiles: [],
      hasEnvStaged: false,
      hasEnvChanged: false,
    };
  }

  try {
    const branch = runCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const status = runCommand("git", ["status", "--porcelain"]);
    const lines = status ? status.split("\n").filter(Boolean) : [];
    const changedFiles = lines.map(parsePorcelainPath);
    const stagedFiles = lines
      .filter((line) => /^[AMDR]/.test(line) || line.startsWith("??"))
      .map(parsePorcelainPath);

    const envMatches = (files: string[]) => files.some(isBlockedPath);

    return {
      available: true,
      branch,
      clean: changedFiles.length === 0,
      changedFiles,
      stagedFiles,
      hasEnvStaged: envMatches(stagedFiles),
      hasEnvChanged: envMatches(changedFiles),
    };
  } catch {
    return {
      available: false,
      branch: "unknown",
      clean: true,
      changedFiles: [],
      stagedFiles: [],
      hasEnvStaged: false,
      hasEnvChanged: false,
    };
  }
}

export function stageSafeChanges(): { ok: boolean; staged: string[]; error?: string } {
  const status = getGitReleaseStatus();
  if (!status.available) {
    return { ok: false, staged: [], error: "Git repository not available." };
  }
  if (status.hasEnvStaged || status.hasEnvChanged) {
    return { ok: false, staged: [], error: ".env must not be staged or committed." };
  }

  const stageable = status.changedFiles.filter((file) => !isBlockedPath(file));
  if (stageable.length === 0) {
    return { ok: true, staged: [] };
  }

  try {
    runCommand("git", ["add", "--", ...stageable]);
    return { ok: true, staged: stageable };
  } catch (error) {
    return {
      ok: false,
      staged: [],
      error: error instanceof Error ? error.message : "Failed to stage changes.",
    };
  }
}

export function commitRelease(message: string): { ok: boolean; sha: string | null; error?: string } {
  try {
    runCommand("git", ["commit", "-m", message]);
    const sha = runCommand("git", ["rev-parse", "--short", "HEAD"]);
    return { ok: true, sha: sha || null };
  } catch (error) {
    return {
      ok: false,
      sha: null,
      error: error instanceof Error ? error.message : "Commit failed.",
    };
  }
}

export function pushRelease(): { ok: boolean; output: string; error?: string } {
  try {
    const branch = runCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const output = runCommand("git", ["push", "-u", "origin", branch]);
    return { ok: true, output: output || `Pushed ${branch} to origin.` };
  } catch (error) {
    const detail =
      (error as { stderr?: string; stdout?: string }).stderr ??
      (error as { stdout?: string }).stdout ??
      (error instanceof Error ? error.message : "Push failed.");
    return { ok: false, output: "", error: detail.trim() };
  }
}

export function verifyRemoteSync(): { ok: boolean; detail: string } {
  try {
    runCommand("git", ["fetch", "origin", "--quiet"]);
    const branch = runCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const localSha = runCommand("git", ["rev-parse", "HEAD"]);
    const remoteSha = runCommand("git", ["rev-parse", `origin/${branch}`]);
    const synced = localSha === remoteSha;
    return {
      ok: synced,
      detail: synced
        ? `Remote origin/${branch} matches local HEAD (${localSha.slice(0, 7)}).`
        : `Remote origin/${branch} differs from local HEAD.`,
    };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Remote verification failed.",
    };
  }
}

export function hasUnpushedCommits(): boolean {
  try {
    const branch = runCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    runCommand("git", ["fetch", "origin", branch, "--quiet"]);
    const ahead = runCommand("git", ["rev-list", "--count", `origin/${branch}..HEAD`]);
    return Number(ahead) > 0;
  } catch {
    return false;
  }
}

export function buildSuggestedCommitMessage(input: {
  missionId: string | null;
  missionTitle: string | null;
  version: string;
  build: string;
}): string {
  const scope = input.missionId ? `(${input.missionId.toLowerCase()})` : "(atlas)";
  const subject = input.missionTitle
    ? `feat${scope}: ${input.missionTitle}`
    : `release${scope}: Atlas ${input.version} (${input.build})`;
  return `${subject}\n\nBranch Director Release Decision approved by CEO via Atlas Studio.`;
}
