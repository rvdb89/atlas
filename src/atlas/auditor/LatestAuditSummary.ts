import type { AuditLatestSummary, AuditStudioView } from "./audit.types";
import { LATEST_AUDIT_SUMMARY } from "./generated/latestAuditSummary";

export function summaryToStudioView(summary: AuditLatestSummary): AuditStudioView {
  return {
    lastAuditAt: summary.generatedAt,
    recommendation: summary.recommendation,
    overallScore: summary.overallScore,
    warnings: summary.warnings,
    blockers: summary.blockers,
    reportPath: summary.reportPath,
    sprintTitle: summary.sprintTitle,
    nextAction: summary.nextAction,
  };
}

export function getLatestAuditSummary(): AuditLatestSummary {
  return LATEST_AUDIT_SUMMARY;
}

export function getLatestAuditStudioView(): AuditStudioView {
  return summaryToStudioView(LATEST_AUDIT_SUMMARY);
}
