import type {
  AuditBlocker,
  AuditContext,
  AuditRuleResult,
  AuditWarning,
  DefinitionOfDoneCheck,
} from "./audit.types";
import type { ReleaseDecision } from "./ReleaseDecision";

export function assignFindingIds(
  warnings: Omit<AuditWarning, "id">[],
  blockers: Omit<AuditBlocker, "id">[],
): { warnings: AuditWarning[]; blockers: AuditBlocker[] } {
  return {
    warnings: warnings.map((warning, index) => ({
      ...warning,
      id: `A-${String(index + 1).padStart(3, "0")}`,
    })),
    blockers: blockers.map((blocker, index) => ({
      ...blocker,
      id: `B-${String(index + 1).padStart(3, "0")}`,
    })),
  };
}

export function collectFindings(ruleResults: AuditRuleResult[]): {
  warnings: AuditWarning[];
  blockers: AuditBlocker[];
} {
  const rawWarnings: Omit<AuditWarning, "id">[] = [];
  const rawBlockers: Omit<AuditBlocker, "id">[] = [];

  for (const result of ruleResults) {
    if (result.passed) continue;
    rawWarnings.push(...result.warnings);
    rawBlockers.push(...result.blockers);
  }

  return assignFindingIds(rawWarnings, rawBlockers);
}

export function renderWarningMarkdown(warning: AuditWarning): string {
  return [
    `### WARNING ${warning.id}`,
    "",
    "**Title:**",
    warning.title,
    "",
    "**Severity:**",
    warning.severity,
    "",
    "**Category:**",
    warning.category,
    "",
    "**File:**",
    warning.file,
    "",
    "**Reason:**",
    warning.reason,
    "",
    "**Impact:**",
    warning.impact,
    "",
    "**Suggested fix:**",
    warning.suggestedFix,
    "",
    "**Blocks release:**",
    warning.blocksRelease ? "true" : "false",
  ].join("\n");
}

export function renderBlockerMarkdown(blocker: AuditBlocker): string {
  return [
    `### BLOCKER ${blocker.id}`,
    "",
    "**Title:**",
    blocker.title,
    "",
    "**Severity:**",
    blocker.severity,
    "",
    "**Category:**",
    blocker.category,
    "",
    "**File:**",
    blocker.file,
    "",
    "**Reason:**",
    blocker.reason,
    "",
    "**Impact:**",
    blocker.impact,
    "",
    "**Required fix:**",
    blocker.requiredFix,
    "",
    "**Blocks release:**",
    "true",
  ].join("\n");
}

export function buildNextActions(input: {
  releaseDecision: ReleaseDecision;
  warnings: AuditWarning[];
  blockers: AuditBlocker[];
  definitionOfDone: DefinitionOfDoneCheck[];
}): string[] {
  const actions: string[] = [];

  if (input.releaseDecision.status === "BLOCKED") {
    for (const blocker of input.blockers) {
      actions.push(`Fix blocker ${blocker.id}: ${blocker.requiredFix}`);
    }
    actions.push(...input.releaseDecision.nextActions);
    return actions;
  }

  actions.push(...input.releaseDecision.nextActions);

  for (const warning of input.warnings) {
    actions.push(`Follow-up · ${warning.id}: ${warning.suggestedFix}`);
  }

  for (const item of input.definitionOfDone.filter((entry) => !entry.passed)) {
    actions.push(`Complete DoD item: ${item.label}`);
  }

  return actions;
}

export function buildGitSummary(context: AuditContext): string {
  if (!context.git.available) return "Git repository not available.";
  return [
    `- Branch · ${context.git.branch ?? "unknown"}`,
    `- Working tree · ${context.git.clean ? "clean" : "dirty"}`,
    `- Changed files · ${context.changedFiles.length}`,
    `- Staged files · ${context.git.stagedFiles.length}`,
    `- .env staged · ${context.git.hasEnvStaged ? "yes" : "no"}`,
  ].join("\n");
}
