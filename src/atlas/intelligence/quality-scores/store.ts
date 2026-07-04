import type { QualityScoreEntry, QualityScoreProvider } from "./types";

const providers = new Map<string, QualityScoreProvider>();
const scores: QualityScoreEntry[] = [];

export function registerQualityScoreProvider(provider: QualityScoreProvider): void {
  providers.set(provider.moduleId, provider);
}

export function getQualityScoreProvider(moduleId: string): QualityScoreProvider | undefined {
  return providers.get(moduleId);
}

export function storeQualityScore(entry: QualityScoreEntry): QualityScoreEntry {
  scores.unshift(entry);
  return entry;
}

export function listQualityScores(filter?: { moduleId?: string; contentId?: string; limit?: number }): QualityScoreEntry[] {
  let result = scores;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.contentId) result = result.filter((entry) => entry.contentId === filter.contentId);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearQualityScores(): void {
  scores.length = 0;
}
