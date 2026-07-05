import type { StudioOsSearchProvider, StudioOsSearchResult } from "../types";
import { createRegistry } from "./createRegistry";

export const searchProviderRegistry = createRegistry<StudioOsSearchProvider>();

export function runGlobalSearch(query: string): StudioOsSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const merged: StudioOsSearchResult[] = [];
  for (const provider of searchProviderRegistry.list()) {
    merged.push(...provider.search(normalized));
  }

  return merged.sort((left, right) => left.title.localeCompare(right.title));
}
