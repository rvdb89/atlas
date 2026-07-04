import { registerAnalyzer } from "./engine/registry";
import { configureIntelligenceEngine } from "./engine/IntelligenceEngine";
import { registerMetricDefinition } from "./metrics/store";
import { metricsAnalyzer } from "./metrics/collector";
import { insightsAnalyzer } from "./insights/generator";
import { contentGapsAnalyzer } from "./content-gaps/analyzer";
import { knowledgeGraphAnalyzer } from "./knowledge-graph/builder";
import { qualityScoresAnalyzer } from "./quality-scores/aggregator";
import { trendDetectionAnalyzer } from "./trends/detector";
import { recommendationEngineAnalyzer } from "./recommendations/engine";
import { learningPathsAnalyzer } from "./learning-paths/planner";
import { aiSuggestionsAnalyzer } from "./ai-suggestions/synthesizer";
import { contentHealthAnalyzer } from "./content-health/assessor";

let bootstrapped = false;

const CORE_ANALYZERS = [
  metricsAnalyzer,
  insightsAnalyzer,
  contentGapsAnalyzer,
  knowledgeGraphAnalyzer,
  qualityScoresAnalyzer,
  trendDetectionAnalyzer,
  recommendationEngineAnalyzer,
  learningPathsAnalyzer,
  aiSuggestionsAnalyzer,
  contentHealthAnalyzer,
];

const CORE_METRICS = [
  { id: "signals.total", label: "Total signals", kind: "counter" as const, category: "platform" as const },
  { id: "content.views", label: "Content views", kind: "counter" as const, category: "content" as const },
  { id: "ai.executions", label: "AI executions", kind: "counter" as const, category: "ai" as const },
  { id: "quality.reports", label: "Quality reports", kind: "counter" as const, category: "quality" as const },
];

export function bootstrapAtlasIntelligence(options?: { defaultModuleId?: string }): void {
  if (bootstrapped) return;

  configureIntelligenceEngine({
    defaultScope: { moduleId: options?.defaultModuleId ?? "doughbert" },
    signalRetentionLimit: 10_000,
  });

  for (const metric of CORE_METRICS) {
    registerMetricDefinition({
      ...metric,
      description: `Atlas Intelligence core metric: ${metric.label}`,
    });
  }

  for (const analyzer of CORE_ANALYZERS) {
    registerAnalyzer(analyzer);
  }

  bootstrapped = true;
}

export function isAtlasIntelligenceBootstrapped(): boolean {
  return bootstrapped;
}
