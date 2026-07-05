import type { AuditBlocker, AuditRecommendation, AuditWarning } from "./audit.types";

export type ReleaseDecision = {
  status: AuditRecommendation;
  pushAllowed: boolean;
  reason: string;
  reasons: string[];
  nextActions: string[];
  nextActionSummary: string;
};

export type ReleaseGateInput = {
  blockers: AuditBlocker[];
  warnings: AuditWarning[];
  typescriptOk: boolean;
  healthOk: boolean;
};

function buildBlockedReasons(input: ReleaseGateInput): string[] {
  const reasons: string[] = [];

  if (input.blockers.length > 0) {
    reasons.push(`${input.blockers.length} blocker(s) must be resolved before release.`);
  }
  if (!input.typescriptOk) {
    reasons.push("TypeScript compilation failed — code cannot ship safely.");
  }
  if (!input.healthOk) {
    reasons.push("Atlas health check failed — platform readiness is not confirmed.");
  }

  const securityBlockers = input.blockers.filter((entry) => entry.category === "security");
  if (securityBlockers.length > 0) {
    reasons.push(`${securityBlockers.length} security blocker(s) detected — credentials or environment risk present.`);
  }

  return reasons;
}

function buildApprovedReasons(input: ReleaseGateInput): string[] {
  return [
    "No blockers detected.",
    "TypeScript check passed.",
    "Atlas health check passed.",
    "Security gates passed (no security blockers).",
    input.warnings.length > 0
      ? `${input.warnings.length} warning(s) logged for follow-up — they do not block release.`
      : "No warnings detected.",
  ];
}

export function deriveReleaseDecision(input: ReleaseGateInput): ReleaseDecision {
  const blockedReasons = buildBlockedReasons(input);

  if (blockedReasons.length > 0) {
    return {
      status: "BLOCKED",
      pushAllowed: false,
      reason: blockedReasons[0] ?? "Release is blocked until blockers are resolved.",
      reasons: blockedReasons,
      nextActions: ["✖ Do not push", "Resolve blockers first."],
      nextActionSummary: "✖ Do not push · Resolve blockers first.",
    };
  }

  const approvedReasons = buildApprovedReasons(input);

  if (input.warnings.length > 0) {
    return {
      status: "APPROVED_WITH_NOTES",
      pushAllowed: true,
      reason: `Mission is safe to release — ${input.warnings.length} warning(s) will be tracked as follow-up work.`,
      reasons: approvedReasons,
      nextActions: ["✓ Commit", "✓ Push", "✓ Create follow-up mission"],
      nextActionSummary: "✓ Commit · ✓ Push · ✓ Create follow-up mission",
    };
  }

  return {
    status: "APPROVED",
    pushAllowed: true,
    reason: "All release gates passed — mission is safe to release.",
    reasons: approvedReasons,
    nextActions: ["✓ Commit", "✓ Push", "✓ Start next mission"],
    nextActionSummary: "✓ Commit · ✓ Push · ✓ Start next mission",
  };
}

/** @deprecated Use deriveReleaseDecision — kept as alias for existing imports. */
export function deriveAuditRecommendation(input: ReleaseGateInput): AuditRecommendation {
  return deriveReleaseDecision(input).status;
}

export function renderReleaseDecisionCli(decision: ReleaseDecision, log: (line?: string) => void): void {
  log("Release Decision");
  log("");
  log(`Status:`);
  log(`  ${decision.status}`);
  log("");
  log(`Push:`);
  log(`  ${decision.pushAllowed ? "YES" : "NO"}`);
  log("");
  log(`Reason:`);
  log(`  ${decision.reason}`);
  log("");
  log("Why:");
  for (const reason of decision.reasons) {
    log(`  - ${reason}`);
  }
  log("");
  log("Next Action:");
  for (const action of decision.nextActions) {
    log(`  ${action}`);
  }
  log("");
}

export function renderReleaseDecisionMarkdown(decision: ReleaseDecision): string {
  return [
    `**Status:** ${decision.status}`,
    "",
    `**Push:** ${decision.pushAllowed ? "YES" : "NO"}`,
    "",
    "**Reason:**",
    decision.reason,
    "",
    "### Release gates",
    ...decision.reasons.map((reason) => `- ${reason}`),
    "",
    "### Next Action",
    ...decision.nextActions.map((action) => `- ${action}`),
  ].join("\n");
}
