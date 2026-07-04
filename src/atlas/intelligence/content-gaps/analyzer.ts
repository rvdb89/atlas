import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { getContentCatalogProvider, storeContentGap } from "./store";
import type { ContentGapReport } from "./types";

export const contentGapsAnalyzer: IntelligenceAnalyzer<ContentGapReport> = {
  id: "content-gaps.analyzer",
  category: "content-gaps",
  label: "Content Gap Analyzer",

  analyze(context): AnalyzerResult<ContentGapReport> {
    const moduleId = context.scope.moduleId;
    const provider = moduleId ? getContentCatalogProvider(moduleId) : undefined;
    const detectedGaps = [];

    if (!provider) {
      return {
        analyzerId: "content-gaps.analyzer",
        category: "content-gaps",
        generatedAt: context.now,
        confidence: 0.2,
        data: {
          generatedAt: context.now,
          gaps: [],
          coverageScore: 0,
          missingTopics: [],
        },
        metadata: { message: "No content catalog provider registered for scope." },
      };
    }

    const snapshot = provider.getSnapshot();
    const expected = provider.getExpectedTopics?.() ?? [];
    const existing = new Set(snapshot.topics.map((topic) => topic.toLowerCase().trim()));

    const missingTopics = expected.filter((topic) => !existing.has(topic.toLowerCase().trim()));

    for (const topic of missingTopics) {
      detectedGaps.push(
        storeContentGap({
          id: `gap-${Date.now()}-${topic.slice(0, 12)}`,
          topic,
          reason: "Expected topic not present in content catalog.",
          priority: "medium",
          suggestedAction: `Plan editorial coverage for "${topic}".`,
          detectedAt: context.now,
          moduleId,
        }),
      );
    }

    const coverageScore =
      expected.length === 0 ? 100 : Math.round(((expected.length - missingTopics.length) / expected.length) * 100);

    return {
      analyzerId: "content-gaps.analyzer",
      category: "content-gaps",
      generatedAt: context.now,
      confidence: expected.length > 0 ? 0.85 : 0.5,
      data: {
        generatedAt: context.now,
        gaps: detectedGaps,
        coverageScore,
        missingTopics,
      },
      metadata: {
        catalogSize: snapshot.topics.length,
        expectedCount: expected.length,
      },
    };
  },
};
