import type { Insight } from "./types";

const insights: Insight[] = [];

export function storeInsight(insight: Insight): Insight {
  insights.unshift(insight);
  return insight;
}

export function listInsights(filter?: { moduleId?: string; severity?: Insight["severity"]; limit?: number }): Insight[] {
  let result = insights;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.severity) result = result.filter((entry) => entry.severity === filter.severity);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearInsights(): void {
  insights.length = 0;
}
