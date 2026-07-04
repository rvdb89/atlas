import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { listQualityScores } from "../quality-scores/store";
import { getContentHealthProvider, storeContentHealthEntry } from "./store";
import type { ContentHealthEntry, ContentHealthReport, ContentHealthStatus } from "./types";

function statusFromScore(score: number): ContentHealthStatus {
  if (score >= 85) return "healthy";
  if (score >= 70) return "attention";
  if (score >= 55) return "at-risk";
  return "critical";
}

export const contentHealthAnalyzer: IntelligenceAnalyzer<ContentHealthReport> = {
  id: "content-health.assessor",
  category: "content-health",
  label: "Content Health Assessor",

  analyze(context): AnalyzerResult<ContentHealthReport> {
    const moduleId = context.scope.moduleId;
    const provider = moduleId ? getContentHealthProvider(moduleId) : undefined;
    const fromProvider = provider?.assessContent() ?? [];

    for (const entry of fromProvider) {
      storeContentHealthEntry(entry);
    }

    if (fromProvider.length === 0) {
      for (const score of listQualityScores({ moduleId, limit: 50 })) {
        const entry: ContentHealthEntry = {
          contentId: score.contentId,
          status: statusFromScore(score.overall),
          score: score.overall,
          issues:
            score.overall < 75
              ? [{ code: "low-quality", message: "Quality score below editorial threshold.", severity: "warning" }]
              : [],
          lastAssessedAt: context.now,
          moduleId,
        };
        storeContentHealthEntry(entry);
        fromProvider.push(entry);
      }
    }

    const summary = {
      healthy: 0,
      attention: 0,
      atRisk: 0,
      critical: 0,
      averageScore: 0,
    };

    for (const entry of fromProvider) {
      if (entry.status === "healthy") summary.healthy += 1;
      if (entry.status === "attention") summary.attention += 1;
      if (entry.status === "at-risk") summary.atRisk += 1;
      if (entry.status === "critical") summary.critical += 1;
    }

    summary.averageScore =
      fromProvider.length === 0
        ? 0
        : Math.round(fromProvider.reduce((sum, entry) => sum + entry.score, 0) / fromProvider.length);

    return {
      analyzerId: "content-health.assessor",
      category: "content-health",
      generatedAt: context.now,
      confidence: fromProvider.length > 0 ? 0.82 : 0.3,
      data: {
        generatedAt: context.now,
        entries: fromProvider,
        summary,
      },
    };
  },
};
