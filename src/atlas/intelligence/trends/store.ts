import type { TrendSignal } from "./types";

const trends: TrendSignal[] = [];

export function storeTrend(trend: TrendSignal): TrendSignal {
  trends.unshift(trend);
  return trend;
}

export function listTrends(filter?: { moduleId?: string; metricId?: string; limit?: number }): TrendSignal[] {
  let result = trends;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.metricId) result = result.filter((entry) => entry.metricId === filter.metricId);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearTrends(): void {
  trends.length = 0;
}
