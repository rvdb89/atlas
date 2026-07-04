import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { storeInsight } from "./store";
import type { InsightsReport } from "./types";

export const insightsAnalyzer: IntelligenceAnalyzer<InsightsReport> = {
  id: "insights.generator",
  category: "insights",
  label: "Insight Generator",

  analyze(context): AnalyzerResult<InsightsReport> {
    const insights = [];
    const highlights: string[] = [];

    const aiCount = context.signals.filter((signal) => signal.type === "ai.execution").length;
    const qualityCount = context.signals.filter((signal) => signal.type === "quality.report").length;

    if (context.signals.length === 0) {
      const insight = storeInsight({
        id: `insight-${Date.now()}-empty`,
        title: "Geen signalen beschikbaar",
        summary: "Atlas Intelligence heeft nog onvoldoende platformsignalen om diepere inzichten te genereren.",
        severity: "info",
        category: "platform",
        evidence: ["signal.count = 0"],
        generatedAt: context.now,
        moduleId: context.scope.moduleId,
      });
      insights.push(insight);
    }

    if (aiCount > 0 && qualityCount === 0) {
      const insight = storeInsight({
        id: `insight-${Date.now()}-quality-gap`,
        title: "AI-output zonder kwaliteitsfeedback",
        summary: "Er zijn AI-executies geregistreerd maar nog geen kwaliteitsrapporten — validatiepipeline kan worden versterkt.",
        severity: "notice",
        category: "quality",
        evidence: [`ai.execution = ${aiCount}`, `quality.report = ${qualityCount}`],
        generatedAt: context.now,
        moduleId: context.scope.moduleId,
      });
      insights.push(insight);
      highlights.push("Koppel AI-output aan kwaliteitsrapporten voor rijkere inzichten.");
    }

    if (aiCount > 10) {
      highlights.push(`${aiCount} AI-executies in huidige scope — overweeg batch-optimalisatie.`);
    }

    return {
      analyzerId: "insights.generator",
      category: "insights",
      generatedAt: context.now,
      confidence: context.signals.length > 5 ? 0.75 : 0.4,
      data: {
        generatedAt: context.now,
        insights,
        highlights,
      },
    };
  },
};
