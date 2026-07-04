import type { ContentHealthEntry, ContentHealthProvider } from "./types";

const providers = new Map<string, ContentHealthProvider>();
const entries: ContentHealthEntry[] = [];

export function registerContentHealthProvider(provider: ContentHealthProvider): void {
  providers.set(provider.moduleId, provider);
}

export function getContentHealthProvider(moduleId: string): ContentHealthProvider | undefined {
  return providers.get(moduleId);
}

export function storeContentHealthEntry(entry: ContentHealthEntry): ContentHealthEntry {
  entries.unshift(entry);
  return entry;
}

export function listContentHealthEntries(filter?: {
  moduleId?: string;
  status?: ContentHealthEntry["status"];
  limit?: number;
}): ContentHealthEntry[] {
  let result = entries;
  if (filter?.moduleId) result = result.filter((entry) => entry.moduleId === filter.moduleId);
  if (filter?.status) result = result.filter((entry) => entry.status === filter.status);
  return result.slice(0, filter?.limit ?? result.length);
}

export function clearContentHealthEntries(): void {
  entries.length = 0;
}
