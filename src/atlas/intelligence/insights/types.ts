export type InsightSeverity = "info" | "notice" | "important" | "critical";

export type Insight = {
  id: string;
  title: string;
  summary: string;
  severity: InsightSeverity;
  category: string;
  evidence: string[];
  generatedAt: string;
  moduleId?: string;
};

export type InsightsReport = {
  generatedAt: string;
  insights: Insight[];
  highlights: string[];
};
