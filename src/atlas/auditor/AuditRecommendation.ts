import type {
  AuditBlocker,
  AuditRecommendation,
  AuditQualityScores,
  AuditContext,
  AuditRuleResult,
  AuditWarning,
} from "./audit.types";
import type { ReleaseDecision } from "./ReleaseDecision";

const SEVERITY_WEIGHT: Record<AuditWarning["severity"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function sortWarningsByPriority(warnings: AuditWarning[]): AuditWarning[] {
  return [...warnings].sort((left, right) => {
    const severityDelta = SEVERITY_WEIGHT[right.severity] - SEVERITY_WEIGHT[left.severity];
    if (severityDelta !== 0) return severityDelta;
    if (right.blocksRelease !== left.blocksRelease) return right.blocksRelease ? 1 : -1;
    return left.id.localeCompare(right.id);
  });
}

export type RecommendationExplanation = {
  recommendation: AuditRecommendation;
  summary: string;
  reasons: string[];
  pushSafe: boolean;
  pushSummary: string;
};

export function explainRecommendation(input: {
  releaseDecision: ReleaseDecision;
  blockers: AuditBlocker[];
  warnings: AuditWarning[];
  overallScore: number;
  strict: boolean;
  typescriptOk: boolean;
  healthOk: boolean;
}): RecommendationExplanation {
  const { releaseDecision } = input;

  if (releaseDecision.status === "BLOCKED") {
    return {
      recommendation: releaseDecision.status,
      summary: "Release is blocked — resolve blockers before push or merge.",
      reasons: releaseDecision.reasons,
      pushSafe: false,
      pushSummary: "Do not push — fix blockers first, then re-run npm run atlas:audit.",
    };
  }

  if (releaseDecision.status === "APPROVED_WITH_NOTES") {
    return {
      recommendation: releaseDecision.status,
      summary: "Mission is approved for release — warnings are tracked as follow-up work.",
      reasons: [
        ...releaseDecision.reasons,
        `Overall score ${input.overallScore}/100 (informational only — warnings do not block release).`,
      ],
      pushSafe: true,
      pushSummary: "Safe to push — address warnings in a follow-up mission.",
    };
  }

  return {
    recommendation: releaseDecision.status,
    summary: "Mission is approved for release with no open warnings.",
    reasons: [
      ...releaseDecision.reasons,
      `Overall score ${input.overallScore}/100.`,
      input.strict ? "Strict audit mode enabled (informational)." : "Standard audit mode.",
    ],
    pushSafe: true,
    pushSummary: "Safe to push after your usual review.",
  };
}

export function renderRecommendationMarkdown(explanation: RecommendationExplanation): string {
  return [
    `**${explanation.recommendation}**`,
    "",
    explanation.summary,
    "",
    "### Why this recommendation",
    ...explanation.reasons.map((reason) => `- ${reason}`),
    "",
    "### Push safety",
    `- ${explanation.pushSummary}`,
    `- Safe to push · **${explanation.pushSafe ? "yes" : "no"}**`,
  ].join("\n");
}

export function describeScoreDimension(
  label: string,
  score: number,
  detail: string,
): string {
  return `- ${label} · **${score}/10** — ${detail}`;
}

export function renderQualityScoreBreakdown(
  scores: AuditQualityScores,
  context: AuditContext,
  ruleResults: AuditRuleResult[],
): string {
  const failedArchitecture = ruleResults.filter(
    (entry) => !entry.passed && ["architecture", "compliance"].includes(entry.category),
  ).length;
  const failedSecurity = ruleResults.filter((entry) => !entry.passed && entry.category === "security").length;
  const failedNorthStar = ruleResults.filter((entry) => !entry.passed && entry.category === "north-star").length;
  const failedQuality = ruleResults.filter((entry) => !entry.passed && entry.category === "quality").length;
  const failedTooling = ruleResults.filter((entry) => !entry.passed && entry.category === "tooling").length;

  return [
    describeScoreDimension(
      "Architecture",
      scores.architecture,
      failedArchitecture > 0
        ? `${failedArchitecture} architecture/compliance rule(s) failed`
        : "Architecture rules passed in current scope",
    ),
    describeScoreDimension(
      "North Star",
      scores.northStar,
      failedNorthStar > 0
        ? `${failedNorthStar} North Star rule(s) need alignment`
        : "Sprint aligns with Atlas North Star goals",
    ),
    describeScoreDimension(
      "Security",
      scores.security,
      failedSecurity > 0
        ? `${failedSecurity} security rule(s) failed`
        : "No security rule failures detected",
    ),
    describeScoreDimension(
      "Maintainability",
      scores.maintainability,
      failedQuality > 0 || !context.git.clean
        ? `${failedQuality} quality issue(s)${context.git.clean ? "" : " · dirty working tree"}`
        : "Maintainability signals look stable",
    ),
    describeScoreDimension(
      "Testability",
      scores.testability,
      context.packageScripts["atlas:audit"] && context.packageScripts["atlas:health"]
        ? "Core audit and health scripts available"
        : "Some validation scripts are missing",
    ),
    describeScoreDimension(
      "Developer Experience",
      scores.developerExperience,
      context.build.typescriptOk && context.build.healthOk
        ? "TypeScript and health checks passed"
        : "Tooling friction detected in local checks",
    ),
    describeScoreDimension(
      "Technical Debt Risk",
      scores.technicalDebtRisk,
      scores.technicalDebtRisk >= 7
        ? "Elevated debt risk — multiple unresolved findings"
        : scores.technicalDebtRisk >= 4
          ? "Moderate debt risk — review warnings before release"
          : "Debt risk is manageable",
    ),
    "",
    "### Overall",
    `- **${scores.overall}/100** — weighted average of the seven dimensions above`,
    `- Failed tooling rules · ${failedTooling}`,
    `- Audit mode · ${context.strict ? "strict" : "standard"}`,
    `- Release policy · only blockers stop a push; warnings inform follow-up work`,
  ].join("\n");
}

export function formatWarningCliLine(warning: AuditWarning): string[] {
  return [
    `${warning.id} · ${warning.title}`,
    `  severity: ${warning.severity} · category: ${warning.category} · blocks release: ${warning.blocksRelease ? "yes" : "no"}`,
    `  file: ${warning.file}`,
    `  reason: ${warning.reason}`,
    `  impact: ${warning.impact}`,
    `  fix: ${warning.suggestedFix}`,
  ];
}

export function formatBlockerCliLine(blocker: AuditBlocker): string[] {
  return [
    `${blocker.id} · ${blocker.title}`,
    `  category: ${blocker.category}`,
    `  file: ${blocker.file}`,
    `  reason: ${blocker.reason}`,
    `  impact: ${blocker.impact}`,
    `  required fix: ${blocker.requiredFix}`,
  ];
}
