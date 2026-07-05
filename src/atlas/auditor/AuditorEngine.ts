import { buildAuditReport, renderAuditReportMarkdown } from "./AuditReport";
import { getLatestAuditStudioView } from "./LatestAuditSummary";
import { runAuditRules, summarizeAuditResults } from "./AuditRunner";
import type {
  AuditContext,
  AuditLatestSummary,
  AuditOperationResult,
  AuditReport,
  AuditRunOptions,
  AuditRunResult,
  AuditStudioView,
} from "./audit.types";

let lastReport: AuditReport | null = null;

function success<T>(data: T): AuditOperationResult<T> {
  return { ok: true, data };
}

function failure<T>(message: string): AuditOperationResult<T> {
  return { ok: false, message };
}

export class AuditorEngine {
  runRules(context: AuditContext): AuditOperationResult<AuditReport["ruleResults"]> {
    try {
      return success(runAuditRules(context));
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to run audit rules");
    }
  }

  runAudit(context: AuditContext, options: AuditRunOptions | string): AuditRunResult {
    const normalized: AuditRunOptions =
      typeof options === "string" ? { reportPath: options, strict: context.strict } : options;

    const report = buildAuditReport({ ...context, strict: normalized.strict ?? context.strict }, normalized.reportPath);
    lastReport = report;
    return {
      ok: report.recommendation !== "BLOCKED",
      report,
    };
  }

  renderReport(report: AuditReport): string {
    return renderAuditReportMarkdown(report);
  }

  summarize(context: AuditContext): AuditOperationResult<ReturnType<typeof summarizeAuditResults>> {
    try {
      return success(summarizeAuditResults(runAuditRules(context)));
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to summarize audit");
    }
  }

  getLastReport(): AuditReport | null {
    return lastReport;
  }

  setLastReport(report: AuditReport): void {
    lastReport = report;
  }

  toLatestSummary(report: AuditReport): AuditLatestSummary {
    return {
      generatedAt: report.generatedAt,
      sprintTitle: report.sprintTitle,
      sprintId: report.sprintId,
      overallScore: report.qualityScores.overall,
      recommendation: report.recommendation,
      warnings: report.warningCount,
      blockers: report.blockerCount,
      reportPath: report.reportPath,
      nextAction: report.releaseDecision.nextActionSummary,
    };
  }

  getStudioView(report?: AuditReport | null): AuditStudioView {
    const active = report ?? lastReport;
    if (!active) {
      return getLatestAuditStudioView();
    }

    const summary = this.toLatestSummary(active);
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
}

export const auditorEngine = new AuditorEngine();

export function getMockAuditorView(): AuditStudioView {
  return {
    lastAuditAt: new Date().toISOString(),
    recommendation: "APPROVED_WITH_NOTES",
    overallScore: 82,
    warnings: 3,
    blockers: 0,
    reportPath: "reports/sprints/sprint-audit-latest.md",
    sprintTitle: "Atlas Auditor Hardening",
    nextAction: "✓ Commit · ✓ Push · ✓ Create follow-up mission",
  };
}
