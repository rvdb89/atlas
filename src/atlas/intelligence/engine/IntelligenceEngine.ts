import { listSignals } from "../signals/bus";
import type {
  IntelligenceCategory,
  IntelligenceContext,
  IntelligenceEngineConfig,
  IntelligenceRunOptions,
  IntelligenceRunResult,
  IntelligenceScope,
} from "../types";
import { analyzerRegistry } from "./registry";

let config: IntelligenceEngineConfig = {
  signalRetentionLimit: 10_000,
};

export function configureIntelligenceEngine(next: IntelligenceEngineConfig): void {
  config = { ...config, ...next };
}

export function getIntelligenceEngineConfig(): IntelligenceEngineConfig {
  return { ...config };
}

function buildContext(scope: IntelligenceScope, signalLimit?: number): IntelligenceContext {
  return {
    scope,
    signals: listSignals({
      moduleId: scope.moduleId,
      limit: signalLimit ?? 500,
    }),
    now: new Date().toISOString(),
  };
}

/**
 * Run the Atlas Intelligence Engine — orchestrates modular analyzers.
 * This is NOT an AI model; it aggregates signals into platform intelligence.
 */
export async function runIntelligenceAnalysis(
  options?: IntelligenceRunOptions,
): Promise<IntelligenceRunResult> {
  const startedAt = new Date().toISOString();
  const runId = `intel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const scope: IntelligenceScope = {
    ...config.defaultScope,
    ...options?.scope,
  };

  const context = buildContext(scope, options?.signalLimit);
  const selected = options?.categories
    ? analyzerRegistry.list().filter((analyzer) => options.categories!.includes(analyzer.category))
    : analyzerRegistry.list();

  const order: IntelligenceCategory[] = [
    "metrics",
    "content-gaps",
    "knowledge-graph",
    "quality-scores",
    "trends",
    "insights",
    "content-health",
    "learning-paths",
    "recommendations",
    "ai-suggestions",
  ];

  const sorted = [...selected].sort(
    (left, right) => order.indexOf(left.category) - order.indexOf(right.category),
  );

  const results = [];
  for (const analyzer of sorted) {
    results.push(await Promise.resolve(analyzer.analyze(context)));
  }

  return {
    runId,
    startedAt,
    completedAt: new Date().toISOString(),
    scope,
    results,
  };
}

/** Run a single analyzer category. */
export async function runCategoryAnalysis(category: IntelligenceCategory, scope?: IntelligenceScope) {
  return runIntelligenceAnalysis({ scope, categories: [category] });
}
