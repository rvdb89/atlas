import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { listContentGaps } from "../content-gaps/store";
import { listInsights } from "../insights/store";
import { listQualityScores } from "../quality-scores/store";
import { storeRecommendation } from "./store";
import type { RecommendationReport } from "./types";

export const recommendationEngineAnalyzer: IntelligenceAnalyzer<RecommendationReport> = {
  id: "recommendations.engine",
  category: "recommendations",
  label: "Recommendation Engine",

  analyze(context): AnalyzerResult<RecommendationReport> {
    const moduleId = context.scope.moduleId;
    const generated: RecommendationReport["recommendations"] = [];

    for (const gap of listContentGaps({ moduleId, limit: 5 })) {
      generated.push(
        storeRecommendation({
          id: `rec-gap-${gap.id}`,
          kind: "content",
          title: `Dek content gap: ${gap.topic}`,
          description: gap.suggestedAction,
          priority: gap.priority === "critical" || gap.priority === "high" ? "high" : "medium",
          targetId: gap.topic,
          actionLabel: "Plan content",
          generatedAt: context.now,
          moduleId,
        }),
      );
    }

    for (const insight of listInsights({ moduleId, severity: "important", limit: 3 })) {
      generated.push(
        storeRecommendation({
          id: `rec-insight-${insight.id}`,
          kind: "platform",
          title: insight.title,
          description: insight.summary,
          priority: "high",
          actionLabel: "Review insight",
          generatedAt: context.now,
          moduleId,
        }),
      );
    }

    const lowScores = listQualityScores({ moduleId, limit: 20 }).filter((entry) => entry.overall < 70);
    for (const entry of lowScores.slice(0, 3)) {
      generated.push(
        storeRecommendation({
          id: `rec-quality-${entry.contentId}`,
          kind: "quality",
          title: `Verbeter kwaliteit: ${entry.contentId}`,
          description: `Content scoort ${entry.overall}/100 — review en verbetering aanbevolen.`,
          priority: "high",
          targetId: entry.contentId,
          actionLabel: "Open review",
          generatedAt: context.now,
          moduleId,
        }),
      );
    }

    const topPriority = generated.filter((entry) => entry.priority === "high").slice(0, 5);

    return {
      analyzerId: "recommendations.engine",
      category: "recommendations",
      generatedAt: context.now,
      confidence: generated.length > 0 ? 0.8 : 0.4,
      data: {
        generatedAt: context.now,
        recommendations: generated,
        topPriority,
      },
    };
  },
};
