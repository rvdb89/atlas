/** Shared Atlas Intelligence types — domain-agnostic platform brain. */

export type IntelligenceCategory =
  | "metrics"
  | "insights"
  | "content-gaps"
  | "knowledge-graph"
  | "quality-scores"
  | "trends"
  | "recommendations"
  | "learning-paths"
  | "ai-suggestions"
  | "content-health";

export type SignalType =
  | "user.event"
  | "user.session"
  | "content.view"
  | "content.publish"
  | "content.update"
  | "ai.execution"
  | "quality.report"
  | "validation.report"
  | "search.query"
  | "navigation.path";

export type IntelligenceSignal = {
  id: string;
  type: SignalType;
  timestamp: string;
  moduleId?: string;
  userId?: string;
  contentId?: string;
  locale?: string;
  payload: Record<string, unknown>;
};

export type IntelligenceScope = {
  moduleId?: string;
  locale?: string;
  timeRange?: { from: string; to: string };
};

export type IntelligenceContext = {
  scope: IntelligenceScope;
  signals: IntelligenceSignal[];
  now: string;
};

export type AnalyzerResult<T = unknown> = {
  analyzerId: string;
  category: IntelligenceCategory;
  generatedAt: string;
  data: T;
  confidence: number;
  metadata?: Record<string, unknown>;
};

export type IntelligenceRunOptions = {
  scope?: IntelligenceScope;
  categories?: IntelligenceCategory[];
  signalLimit?: number;
};

export type IntelligenceRunResult = {
  runId: string;
  startedAt: string;
  completedAt: string;
  scope: IntelligenceScope;
  results: AnalyzerResult[];
};

export type IntelligenceEngineConfig = {
  defaultScope?: IntelligenceScope;
  signalRetentionLimit?: number;
};
