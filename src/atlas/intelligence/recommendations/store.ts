import type { Recommendation } from "./types";

const recommendations: Recommendation[] = [];

export function storeRecommendation(recommendation: Recommendation): Recommendation {
  recommendations.unshift(recommendation);
  return recommendation;
}

export function listRecommendations(filter?: {
  moduleId?: string;
  kind?: Recommendation["kind"];
  priority?: Recommendation["priority"];
  limit?: number;
}): Recommendation[] {
  let result = recommendations;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.kind) result = result.filter((entry) => entry.kind === filter.kind);
  if (filter?.priority) result = result.filter((entry) => entry.priority === filter.priority);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearRecommendations(): void {
  recommendations.length = 0;
}
