import type { StartupIssue } from "./types";

const startupIssues: StartupIssue[] = [];

export function recordStartupIssue(issue: StartupIssue): void {
  startupIssues.push({ ...issue, detectedAt: issue.detectedAt ?? new Date().toISOString() });
}

export function getStartupIssues(): StartupIssue[] {
  return [...startupIssues];
}

export function clearStartupIssues(): void {
  startupIssues.length = 0;
}

export function hasStartupErrors(): boolean {
  return startupIssues.some((issue) => issue.severity === "error");
}
