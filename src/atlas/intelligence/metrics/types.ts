export type MetricKind = "counter" | "gauge" | "histogram" | "rate";

export type MetricDefinition = {
  id: string;
  label: string;
  kind: MetricKind;
  unit?: string;
  description?: string;
  category: "user" | "content" | "ai" | "quality" | "platform";
};

export type MetricSnapshot = {
  metricId: string;
  value: number;
  recordedAt: string;
  moduleId?: string;
  dimensions?: Record<string, string>;
};

export type MetricsSummary = {
  generatedAt: string;
  metrics: MetricSnapshot[];
  totals: {
    signals: number;
    contentViews: number;
    aiExecutions: number;
    qualityReports: number;
  };
};
