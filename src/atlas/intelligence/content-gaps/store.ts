import type { ContentCatalogProvider, ContentGap } from "./types";

const providers = new Map<string, ContentCatalogProvider>();
const gaps: ContentGap[] = [];

export function registerContentCatalogProvider(provider: ContentCatalogProvider): void {
  providers.set(provider.moduleId, provider);
}

export function getContentCatalogProvider(moduleId: string): ContentCatalogProvider | undefined {
  return providers.get(moduleId);
}

export function storeContentGap(gap: ContentGap): ContentGap {
  gaps.unshift(gap);
  return gap;
}

export function listContentGaps(filter?: { moduleId?: string; priority?: ContentGap["priority"]; limit?: number }): ContentGap[] {
  let result = gaps;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.priority) result = result.filter((entry) => entry.priority === filter.priority);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearContentGaps(): void {
  gaps.length = 0;
}

export function listContentCatalogProviders(): ContentCatalogProvider[] {
  return [...providers.values()];
}
