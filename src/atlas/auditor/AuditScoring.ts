import type { AuditContext, AuditQualityScores, AuditRuleResult } from "./audit.types";
import { renderQualityScoreBreakdown } from "./AuditRecommendation";

function clampScore(value: number): number {
  return Math.max(0, Math.min(10, Math.round(value * 10) / 10));
}

function categoryPassRate(results: AuditRuleResult[], categories: AuditRuleResult["category"][]): number {
  const filtered = results.filter((entry) => categories.includes(entry.category));
  if (filtered.length === 0) return 10;
  const passed = filtered.filter((entry) => entry.passed).length;
  return (passed / filtered.length) * 10;
}

function penalty(results: AuditRuleResult[], categories: AuditRuleResult["category"][], amount: number): number {
  const failed = results.filter((entry) => !entry.passed && categories.includes(entry.category)).length;
  return failed * amount;
}

export function calculateQualityScores(context: AuditContext, ruleResults: AuditRuleResult[]): AuditQualityScores {
  const architecture = clampScore(
    categoryPassRate(ruleResults, ["architecture", "compliance"]) - penalty(ruleResults, ["architecture"], 0.8),
  );

  const northStar = clampScore(
    categoryPassRate(ruleResults, ["north-star"]) - penalty(ruleResults, ["north-star"], 1),
  );

  const security = clampScore(
    categoryPassRate(ruleResults, ["security"]) - penalty(ruleResults, ["security"], 2),
  );

  const maintainability = clampScore(
    categoryPassRate(ruleResults, ["quality", "compliance"]) -
      penalty(ruleResults, ["quality"], 0.7) -
      (context.git.clean ? 0 : 0.5),
  );

  const testability = clampScore(
    (context.packageScripts["atlas:audit"] ? 8 : 4) +
      (context.packageScripts["atlas:health"] ? 1 : 0) +
      (context.packageScripts["atlas:commit-check"] ? 1 : 0) -
      penalty(ruleResults, ["tooling"], 1),
  );

  const developerExperience = clampScore(
    (context.git.available ? 2 : 0) +
      (context.build.typescriptOk ? 3 : 0) +
      (context.build.healthOk ? 2 : 0) +
      (context.packageScripts["atlas:audit"] ? 2 : 0) +
      (context.packageScripts["atlas:doctor"] ? 1 : 0),
  );

  const failedWarnings = ruleResults.filter((entry) => !entry.passed).length;
  const technicalDebtRisk = clampScore(
    Math.min(10, failedWarnings * 0.8 + (context.git.clean ? 0 : 1.5) + (context.build.healthOk ? 0 : 2)),
  );

  const overall = Math.round(
    ((architecture + northStar + security + maintainability + testability + developerExperience + (10 - technicalDebtRisk)) /
      7) *
      10,
  );

  return {
    architecture,
    northStar,
    security,
    maintainability,
    testability,
    developerExperience,
    technicalDebtRisk,
    overall,
  };
}

export function renderQualityScoresMarkdown(
  scores: AuditQualityScores,
  context?: AuditContext,
  ruleResults?: AuditRuleResult[],
): string {
  if (context && ruleResults) {
    return renderQualityScoreBreakdown(scores, context, ruleResults);
  }

  return [
    `- Architecture Score · ${scores.architecture}/10`,
    `- North Star Alignment · ${scores.northStar}/10`,
    `- Security Score · ${scores.security}/10`,
    `- Maintainability · ${scores.maintainability}/10`,
    `- Testability · ${scores.testability}/10`,
    `- Developer Experience · ${scores.developerExperience}/10`,
    `- Technical Debt Risk · ${scores.technicalDebtRisk}/10`,
    "",
    `**Overall Score · ${scores.overall}/100**`,
  ].join("\n");
}
