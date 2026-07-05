import { memoryEngine } from "@/atlas/brain/memory";
import type { StudioOsSearchResult } from "../types";

export function searchAtlasMemory(query: string): StudioOsSearchResult[] {
  const result = memoryEngine.searchMemory({ text: query, limit: 8 });
  if (!result.ok || !result.data) return [];

  return result.data.map((match) => ({
    id: `memory-${match.entry.id}`,
    title: match.entry.title,
    subtitle: `${match.entry.type} · score ${match.score}`,
    group: "Memory",
    action: () => undefined,
  }));
}
