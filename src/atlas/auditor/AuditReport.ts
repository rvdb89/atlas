import {
  buildGitSummary,
  buildNextActions,
  collectFindings,
  renderBlockerMarkdown,
  renderWarningMarkdown,
} from "./AuditFindings";
import { explainRecommendation, renderRecommendationMarkdown } from "./AuditRecommendation";
import { evaluateDefinitionOfDone } from "./AuditRule";
import { calculateQualityScores, renderQualityScoresMarkdown } from "./AuditScoring";
import { runAuditRules, summarizeAuditResults } from "./AuditRunner";
import { deriveReleaseDecision, renderReleaseDecisionMarkdown } from "./ReleaseDecision";
import type {
  AuditContext,
  AuditReport,
  AuditRuleResult,
  AuditWarning,
  DefinitionOfDoneCheck,
} from "./audit.types";

function formatTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

function renderList(items: string[]): string {
  if (items.length === 0) return "_None_";
  return items.map((item) => `- ${item}`).join("\n");
}

function renderDefinitionOfDone(items: DefinitionOfDoneCheck[]): string {
  return items
    .map((entry) => `- [${entry.passed ? "x" : " "}] ${entry.label}${entry.detail ? ` — ${entry.detail}` : ""}`)
    .join("\n");
}

function renderRuleSummary(results: AuditRuleResult[], categories: AuditRuleResult["category"][]): string {
  return results
    .filter((entry) => categories.includes(entry.category))
    .map((entry) => `- **${entry.label}** · ${entry.passed ? "PASS" : "FAIL"} · ${entry.message}`)
    .join("\n");
}

function buildTechnicalDebt(context: AuditContext, warnings: AuditWarning[]): string[] {
  const debt: string[] = [];

  if (!context.git.clean) {
    debt.push("Working tree has uncommitted changes — audit scope may drift before merge.");
  }
  if (!context.build.healthOk) {
    debt.push("Atlas health checks failing — platform readiness uncertain.");
  }
  if (warnings.some((entry) => entry.title.includes("mock"))) {
    debt.push("Studio Command Center still relies on mock audit/provider summaries.");
  }

  debt.push("Auditor remains rule-based — AI review is not yet enabled.");
  return debt;
}

export function buildAuditReport(context: AuditContext, reportPath: string): AuditReport {
  const ruleResults = runAuditRules(context);
  const summary = summarizeAuditResults(ruleResults);
  const { warnings, blockers } = collectFindings(ruleResults);
  const definitionOfDone = evaluateDefinitionOfDone(context, ruleResults);
  const qualityScores = calculateQualityScores(context, ruleResults);

  const releaseDecision = deriveReleaseDecision({
    blockers,
    warnings,
    typescriptOk: context.build.typescriptOk,
    healthOk: context.build.healthOk,
  });

  const recommendation = releaseDecision.status;

  const recommendationExplanation = explainRecommendation({
    releaseDecision,
    blockers,
    warnings,
    overallScore: qualityScores.overall,
    strict: context.strict,
    typescriptOk: context.build.typescriptOk,
    healthOk: context.build.healthOk,
  });

  const generatedAt = new Date().toISOString();
  const gitSummary = buildGitSummary(context);
  const technicalDebt = buildTechnicalDebt(context, warnings);
  const nextActions = buildNextActions({ releaseDecision, warnings, blockers, definitionOfDone });

  const sections = [
    {
      id: "sprint-summary",
      title: "1. Sprint Summary",
      body: [
        `- Sprint · ${context.brief.sprintTitle} (${context.brief.sprintId})`,
        `- Phase · ${context.brief.phase}`,
        `- Atlas · ${context.atlasVersion} (${context.atlasBuild})`,
        `- Mode · ${context.strict ? "strict" : "standard"}`,
        `- Generated · ${generatedAt}`,
      ].join("\n"),
    },
    {
      id: "git-summary",
      title: "2. Git Summary",
      body: gitSummary,
    },
    {
      id: "files-changed",
      title: "3. Files Changed",
      body: renderList(context.changedFiles.length > 0 ? context.changedFiles : ["No changed files detected"]),
    },
    {
      id: "definition-of-done",
      title: "4. Definition of Done Check",
      body: renderDefinitionOfDone(definitionOfDone),
    },
    {
      id: "architecture-compliance",
      title: "5. Architecture Compliance",
      body: [
        renderList(context.brief.architectureRules),
        "",
        "### Rule Results",
        renderRuleSummary(ruleResults, ["architecture", "compliance"]),
      ].join("\n"),
    },
    {
      id: "north-star",
      title: "6. North Star Alignment",
      body: [
        renderList(context.brief.northStarGoals),
        "",
        "### Rule Results",
        renderRuleSummary(ruleResults, ["north-star"]),
      ].join("\n"),
    },
    {
      id: "security-check",
      title: "7. Security Check",
      body: renderRuleSummary(ruleResults, ["security"]),
    },
    {
      id: "typescript-build",
      title: "8. TypeScript / Build Status",
      body: [
        `- TypeScript · ${context.build.typescriptOk ? "PASS" : "FAIL"}`,
        context.build.typescriptDetail ? `- Detail · ${context.build.typescriptDetail}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      id: "health-status",
      title: "9. Health Status",
      body: [
        `- Atlas health · ${context.build.healthOk ? "PASS" : "FAIL"}`,
        context.build.healthDetail ? `- Detail · ${context.build.healthDetail}` : "",
        "",
        "### Checks",
        renderList(
          context.healthChecks.map(
            (check) => `${check.label} · ${check.ok ? "ok" : "fail"}${check.detail ? ` (${check.detail})` : ""}`,
          ),
        ),
      ]
        .filter((entry) => entry !== "")
        .join("\n"),
    },
    {
      id: "technical-debt",
      title: "10. Technical Debt",
      body: renderList(technicalDebt),
    },
    {
      id: "warnings",
      title: "11. Warnings",
      body: warnings.length > 0 ? warnings.map(renderWarningMarkdown).join("\n\n") : "_None_",
    },
    {
      id: "blockers",
      title: "12. Blockers",
      body: blockers.length > 0 ? blockers.map(renderBlockerMarkdown).join("\n\n") : "_None_",
    },
    {
      id: "quality-score",
      title: "13. Quality Score",
      body: renderQualityScoresMarkdown(qualityScores, context, ruleResults),
    },
    {
      id: "recommendation",
      title: "14. Recommendation",
      body: renderRecommendationMarkdown(recommendationExplanation),
    },
    {
      id: "release-decision",
      title: "15. Release Decision",
      body: renderReleaseDecisionMarkdown(releaseDecision),
    },
    {
      id: "next-actions",
      title: "16. Next Actions",
      body: renderList(nextActions),
    },
  ];

  return {
    id: `audit-${formatTimestamp(new Date())}`,
    generatedAt,
    sprintId: context.brief.sprintId,
    sprintTitle: context.brief.sprintTitle,
    atlasVersion: context.atlasVersion,
    atlasBuild: context.atlasBuild,
    strict: context.strict,
    recommendation,
    releaseDecision,
    warnings,
    blockers,
    warningCount: warnings.length,
    blockerCount: blockers.length,
    passedChecks: summary.passedChecks,
    totalChecks: summary.totalChecks,
    changedFiles: context.changedFiles,
    ruleResults,
    definitionOfDone,
    qualityScores,
    sections,
    technicalDebt,
    nextActions,
    gitSummary,
    reportPath,
  };
}

export function renderAuditReportMarkdown(report: AuditReport): string {
  const header = `# Atlas Sprint Audit 2.0\n\n`;
  const body = report.sections.map((section) => `## ${section.title}\n\n${section.body}`).join("\n\n");
  const footer = `\n\n---\n\n_Atlas Auditor · ${report.atlasVersion} (${report.atlasBuild}) · ${report.generatedAt}_\n`;
  return `${header}${body}${footer}`;
}

export function createAuditReportPath(rootDir: string, date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
  return `${rootDir}/reports/sprints/sprint-audit-${stamp}.md`;
}

export function createAuditReportFilename(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
  return `sprint-audit-${stamp}.md`;
}
