import type { AuditReport } from "./audit.types";
import {
  explainRecommendation,
  formatBlockerCliLine,
  formatWarningCliLine,
  sortWarningsByPriority,
} from "./AuditRecommendation";
import { renderReleaseDecisionCli } from "./ReleaseDecision";

export function printAuditCliSummary(report: AuditReport, log: (line?: string) => void = console.log): void {
  const explanation = explainRecommendation({
    releaseDecision: report.releaseDecision,
    blockers: report.blockers,
    warnings: report.warnings,
    overallScore: report.qualityScores.overall,
    strict: report.strict,
    typescriptOk: report.ruleResults.every((entry) => entry.ruleId !== "typescript-runnable" || entry.passed),
    healthOk: report.ruleResults.every((entry) => entry.ruleId !== "health-runnable" || entry.passed),
  });

  log("");
  log("Score breakdown:");
  log(`  Architecture · ${report.qualityScores.architecture}/10`);
  log(`  North Star · ${report.qualityScores.northStar}/10`);
  log(`  Security · ${report.qualityScores.security}/10`);
  log(`  Maintainability · ${report.qualityScores.maintainability}/10`);
  log(`  Testability · ${report.qualityScores.testability}/10`);
  log(`  Developer Experience · ${report.qualityScores.developerExperience}/10`);
  log(`  Technical Debt Risk · ${report.qualityScores.technicalDebtRisk}/10`);
  log(`  Overall · ${report.qualityScores.overall}/100`);
  log("");

  log(`Warnings: ${report.warningCount}`);
  log(`Blockers: ${report.blockerCount}`);
  log("");

  if (report.blockers.length > 0) {
    log("Blockers:");
    for (const blocker of report.blockers) {
      for (const line of formatBlockerCliLine(blocker)) {
        log(line);
      }
      log("");
    }
  }

  const warnings = sortWarningsByPriority(report.warnings);
  if (warnings.length > 0) {
    log("Top warnings:");
    for (const warning of warnings.slice(0, 5)) {
      for (const line of formatWarningCliLine(warning)) {
        log(line);
      }
      log("");
    }

    if (warnings.length > 5) {
      log(`… and ${warnings.length - 5} more warning(s) in the report.`);
      log("");
    }
  }

  log("Recommendation:");
  log(`  ${report.recommendation}`);
  log(`  ${explanation.summary}`);
  log("");

  renderReleaseDecisionCli(report.releaseDecision, log);
}
