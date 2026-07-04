import type { IntelligenceCategory } from "../types";
import type { AnalyzerRegistry, IntelligenceAnalyzer } from "./types";

const analyzers = new Map<string, IntelligenceAnalyzer>();

export const analyzerRegistry: AnalyzerRegistry = {
  register(analyzer) {
    analyzers.set(analyzer.id, analyzer);
  },

  unregister(analyzerId) {
    analyzers.delete(analyzerId);
  },

  get(analyzerId) {
    return analyzers.get(analyzerId);
  },

  list(category?: IntelligenceCategory) {
    const all = [...analyzers.values()];
    return category ? all.filter((entry) => entry.category === category) : all;
  },
};

export function registerAnalyzer(analyzer: IntelligenceAnalyzer): void {
  analyzerRegistry.register(analyzer);
}

export function listAnalyzers(category?: IntelligenceCategory): IntelligenceAnalyzer[] {
  return analyzerRegistry.list(category);
}
