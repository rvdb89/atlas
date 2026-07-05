import type { AtlasMemoryEntry, MemorySearchQuery, MemorySearchResult } from "./memory.types";

function includesText(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function parseDate(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function searchMemoryEntries(
  entries: AtlasMemoryEntry[],
  query: MemorySearchQuery,
): MemorySearchResult[] {
  const normalizedText = query.text?.trim().toLowerCase() ?? "";
  const createdAfter = parseDate(query.createdAfter);
  const createdBefore = parseDate(query.createdBefore);
  const limit = query.limit ?? 25;

  const results: MemorySearchResult[] = [];

  for (const entry of entries) {
    if (query.status && entry.status !== query.status) continue;
    if (query.type && entry.type !== query.type) continue;
    if (query.minImportance !== undefined && entry.importance < query.minImportance) continue;
    if (query.maxImportance !== undefined && entry.importance > query.maxImportance) continue;

    const createdAt = parseDate(entry.createdAt);
    if (createdAfter !== null && createdAt !== null && createdAt < createdAfter) continue;
    if (createdBefore !== null && createdAt !== null && createdAt > createdBefore) continue;

    if (query.tags && query.tags.length > 0) {
      const hasTag = query.tags.some((tag) => entry.tags.includes(tag));
      if (!hasTag) continue;
    }

    let score = entry.importance;
    const matchedOn: string[] = [];

    if (normalizedText) {
      let textMatch = false;
      if (includesText(entry.title, normalizedText)) {
        score += 6;
        matchedOn.push("title");
        textMatch = true;
      }
      if (includesText(entry.summary, normalizedText)) {
        score += 4;
        matchedOn.push("summary");
        textMatch = true;
      }
      if (includesText(entry.content, normalizedText)) {
        score += 2;
        matchedOn.push("content");
        textMatch = true;
      }
      if (entry.tags.some((tag) => includesText(tag, normalizedText))) {
        score += 5;
        matchedOn.push("tags");
        textMatch = true;
      }
      if (includesText(entry.type, normalizedText)) {
        score += 3;
        matchedOn.push("type");
        textMatch = true;
      }
      if (!textMatch) continue;
    } else {
      matchedOn.push("filter");
    }

    if (createdAt !== null) {
      const ageHours = (Date.now() - createdAt) / (1000 * 60 * 60);
      if (ageHours <= 24) {
        score += 2;
        matchedOn.push("recent");
      }
    }

    results.push({ entry, score, matchedOn });
  }

  return results
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return right.entry.updatedAt.localeCompare(left.entry.updatedAt);
    })
    .slice(0, limit);
}
