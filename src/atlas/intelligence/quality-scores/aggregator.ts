import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { getQualityScoreProvider, listQualityScores, storeQualityScore } from "./store";
import type { QualityScoresReport } from "./types";

function bucket(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  return "poor";
}

export const qualityScoresAnalyzer: IntelligenceAnalyzer<QualityScoresReport> = {
  id: "quality-scores.aggregator",
  category: "quality-scores",
  label: "Quality Score Aggregator",

  analyze(context): AnalyzerResult<QualityScoresReport> {
    const moduleId = context.scope.moduleId;
    const provider = moduleId ? getQualityScoreProvider(moduleId) : undefined;
    const fromProvider = provider?.getScores() ?? [];

    for (const entry of fromProvider) {
      storeQualityScore(entry);
    }

    for (const signal of context.signals) {
      if (signal.type !== "quality.report" && signal.type !== "validation.report") continue;
      const score = typeof signal.payload.score === "number" ? signal.payload.score : undefined;
      const overall =
        score ??
        (typeof signal.payload.overallScore === "number" ? signal.payload.overallScore : undefined);
      if (overall === undefined || !signal.contentId) continue;

      storeQualityScore({
        contentId: signal.contentId,
        overall,
        dimensions: {
          editorial: typeof signal.payload.editorial === "number" ? signal.payload.editorial : overall,
          domain: typeof signal.payload.domain === "number" ? signal.payload.domain : overall,
        },
        source: signal.type === "validation.report" ? "validation" : "ai",
        recordedAt: signal.timestamp,
        moduleId: signal.moduleId,
      });
    }

    const entries = listQualityScores({ moduleId, limit: 200 });
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };

    for (const entry of entries) {
      distribution[bucket(entry.overall)] += 1;
    }

    const platformAverage =
      entries.length === 0
        ? 0
        : Math.round(entries.reduce((sum, entry) => sum + entry.overall, 0) / entries.length);

    return {
      analyzerId: "quality-scores.aggregator",
      category: "quality-scores",
      generatedAt: context.now,
      confidence: entries.length > 0 ? 0.85 : 0.35,
      data: {
        generatedAt: context.now,
        entries,
        platformAverage,
        distribution,
      },
    };
  },
};
