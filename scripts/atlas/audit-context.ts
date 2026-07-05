import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  bootstrapAtlasAuditor,
  createAuditContext,
  CURRENT_ARCHITECTURE_BRIEF,
  type AuditContext,
  type AuditFileSnapshot,
  type AuditHealthCheck,
  type AuditIndexEntry,
  type AuditLatestSummary,
  type AuditReport,
} from "@/atlas/auditor";
import { auditorEngine } from "@/atlas/auditor/AuditorEngine";

import { ROOT_DIR, runCommand } from "./shared";

const SECRET_SCAN_EXTENSIONS = [".ts", ".tsx", ".js", ".json", ".md", ".env", ".example"];

function readAtlasVersion(): { version: string; build: string } {
  const source = readFileSync(join(ROOT_DIR, "src/atlas/version.ts"), "utf8");
  return {
    version: source.match(/ATLAS_VERSION = "([^"]+)"/)?.[1] ?? "unknown",
    build: source.match(/ATLAS_BUILD = "([^"]+)"/)?.[1] ?? "unknown",
  };
}

function readPackageScripts(): Record<string, string> {
  const pkg = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf8")) as {
    scripts?: Record<string, string>;
  };
  return pkg.scripts ?? {};
}

function parsePorcelainPath(line: string): string {
  if (line.startsWith("??")) return line.slice(3).trim();
  if (line.length >= 3 && line[2] === " ") return line.slice(3).trim();
  const trimmed = line.trim();
  const parts = trimmed.split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : trimmed;
}

function collectGitStatus(): AuditContext["git"] {
  if (!existsSync(join(ROOT_DIR, ".git"))) {
    return {
      available: false,
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
    const changedFiles = status
      ? status
          .split("\n")
          .filter(Boolean)
          .map(parsePorcelainPath)
      : [];
    const stagedFiles = status
      ? status
          .split("\n")
          .filter((line) => /^[AMR?]/.test(line) || line.startsWith("??"))
          .map(parsePorcelainPath)
      : [];

    const envMatches = (files: string[]) =>
      files.some((file) => file === ".env" || file.endsWith("/.env") || file.endsWith(".env"));

    return {
      available: true,
      clean: changedFiles.length === 0,
      branch,
      changedFiles,
      stagedFiles,
      hasEnvStaged: envMatches(stagedFiles),
      hasEnvChanged: envMatches(changedFiles),
    };
  } catch {
    return {
      available: false,
      clean: true,
      changedFiles: [],
      stagedFiles: [],
      hasEnvStaged: false,
      hasEnvChanged: false,
    };
  }
}

function collectChangedFiles(git: AuditContext["git"]): string[] {
  if (git.changedFiles.length > 0) return [...new Set(git.changedFiles)];

  try {
    const diff = runCommand("git", ["diff", "--name-only", "HEAD"]);
    return diff ? diff.split("\n").filter(Boolean) : [];
  } catch {
    return [];
  }
}

function shouldScanFile(path: string): boolean {
  return SECRET_SCAN_EXTENSIONS.some((ext) => path.endsWith(ext));
}

function scanFiles(paths: string[]): AuditFileSnapshot[] {
  const scanned: AuditFileSnapshot[] = [];

  for (const relativePath of paths) {
    if (!shouldScanFile(relativePath)) continue;
    const fullPath = join(ROOT_DIR, relativePath);
    if (!existsSync(fullPath)) continue;

    try {
      scanned.push({
        path: relativePath,
        content: readFileSync(fullPath, "utf8"),
      });
    } catch {
      // ignore unreadable files
    }
  }

  return scanned;
}

function runTypeScriptCheck(): { ok: boolean; detail?: string } {
  try {
    execSync("npx tsc --noEmit", { cwd: ROOT_DIR, stdio: "pipe", encoding: "utf8" });
    execSync("npx tsc --noEmit -p scripts/tsconfig.json", { cwd: ROOT_DIR, stdio: "pipe", encoding: "utf8" });
    return { ok: true };
  } catch (error) {
    const stderr =
      (error as { stderr?: string; stdout?: string }).stderr ??
      (error as { stdout?: string }).stdout ??
      (error instanceof Error ? error.message : "TypeScript failed");
    return { ok: false, detail: stderr.split("\n").slice(0, 8).join(" ") };
  }
}

function runHealthCheck(): { ok: boolean; detail?: string; checks: AuditHealthCheck[] } {
  try {
    execSync("npm run atlas:health", { cwd: ROOT_DIR, stdio: "pipe", encoding: "utf8" });
    return {
      ok: true,
      checks: [{ label: "Atlas health", ok: true, detail: "passed" }],
    };
  } catch (error) {
    const stdout = (error as { stdout?: string }).stdout ?? "Atlas health failed";
    return {
      ok: false,
      detail: stdout.split("\n").slice(-6).join(" "),
      checks: [{ label: "Atlas health", ok: false, detail: "failed" }],
    };
  }
}

export function collectAuditContext(options?: { strict?: boolean }): AuditContext {
  bootstrapAtlasAuditor();

  const { version, build } = readAtlasVersion();
  const git = collectGitStatus();
  const changedFiles = collectChangedFiles(git);
  const atlasChanged = changedFiles.filter((path) => path.startsWith("src/atlas/"));
  const scanTargets = [...new Set([...changedFiles, ...atlasChanged])];
  const typescript = runTypeScriptCheck();
  const health = runHealthCheck();

  return createAuditContext({
    atlasVersion: version,
    atlasBuild: build,
    git,
    changedFiles,
    packageScripts: readPackageScripts(),
    build: {
      typescriptOk: typescript.ok,
      typescriptDetail: typescript.detail,
      healthOk: health.ok,
      healthDetail: health.detail,
    },
    healthChecks: health.checks,
    brief: CURRENT_ARCHITECTURE_BRIEF,
    scannedFiles: scanFiles(scanTargets),
    strict: options?.strict ?? false,
  });
}

function readIndexEntries(): AuditIndexEntry[] {
  const indexPath = join(ROOT_DIR, "reports/sprints/index.json");
  if (!existsSync(indexPath)) return [];
  try {
    return JSON.parse(readFileSync(indexPath, "utf8")) as AuditIndexEntry[];
  } catch {
    return [];
  }
}

function renderIndexMarkdown(entries: AuditIndexEntry[]): string {
  const header = [
    "# Atlas Sprint Audit Index",
    "",
    "| Date | Sprint | Score | Recommendation | Warnings | Blockers | Report |",
    "| --- | --- | ---: | --- | ---: | ---: | --- |",
  ];

  const rows = entries.map(
    (entry) =>
      `| ${entry.date} | ${entry.sprintName} | ${entry.score} | ${entry.recommendation} | ${entry.warnings} | ${entry.blockers} | [${entry.reportLink}](${entry.reportLink}) |`,
  );

  return [...header, ...rows, ""].join("\n");
}

function writeStudioAuditSummary(summary: AuditLatestSummary): void {
  const generatedDir = join(ROOT_DIR, "src/atlas/auditor/generated");
  mkdirSync(generatedDir, { recursive: true });
  const target = join(generatedDir, "latestAuditSummary.ts");
  const content = [
    "/** Auto-generated by npm run atlas:audit — do not edit manually. */",
    'import type { AuditLatestSummary } from "../audit.types";',
    "",
    `export const LATEST_AUDIT_SUMMARY: AuditLatestSummary = ${JSON.stringify(summary, null, 2)};`,
    "",
  ].join("\n");
  writeFileSync(target, content, "utf8");
}

export function writeAuditReportFile(reportPath: string, markdown: string, report: AuditReport): void {
  const dir = join(ROOT_DIR, "reports/sprints");
  mkdirSync(dir, { recursive: true });
  writeFileSync(reportPath, markdown, "utf8");

  const summary: AuditLatestSummary = auditorEngine.toLatestSummary(report);
  writeFileSync(join(dir, "latest-audit.json"), JSON.stringify(summary, null, 2), "utf8");
  writeStudioAuditSummary(summary);

  const relativeReportPath = report.reportPath;
  const entry: AuditIndexEntry = {
    date: report.generatedAt,
    sprintName: report.sprintTitle,
    score: report.qualityScores.overall,
    recommendation: report.recommendation,
    warnings: report.warningCount,
    blockers: report.blockerCount,
    reportLink: relativeReportPath,
    strict: report.strict,
  };

  const entries = [entry, ...readIndexEntries()].slice(0, 30);
  writeFileSync(join(dir, "index.json"), JSON.stringify(entries, null, 2), "utf8");
  writeFileSync(join(dir, "index.md"), renderIndexMarkdown(entries), "utf8");
}

export { ROOT_DIR };
