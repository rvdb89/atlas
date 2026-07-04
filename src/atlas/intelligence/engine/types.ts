import type { AnalyzerResult, IntelligenceCategory, IntelligenceContext } from "../types";

/** Contract for modular intelligence analyzers — no AI models, pure analysis. */
export type IntelligenceAnalyzer<TData = unknown> = {
  readonly id: string;
  readonly category: IntelligenceCategory;
  readonly label: string;
  analyze(context: IntelligenceContext): AnalyzerResult<TData> | Promise<AnalyzerResult<TData>>;
};

export type AnalyzerRegistry = {
  register(analyzer: IntelligenceAnalyzer): void;
  unregister(analyzerId: string): void;
  get(analyzerId: string): IntelligenceAnalyzer | undefined;
  list(category?: IntelligenceCategory): IntelligenceAnalyzer[];
};
