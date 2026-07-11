import type { AtlasMemoryEntry, MemorySearchResult } from "./memory.types";

/**
 * BRAIN-002 · Semantic recall — a lightweight, provider-independent complement to the
 * exact-substring MemorySearch.ts. Instead of requiring literal text overlap, this scores
 * entries by term-frequency cosine similarity so conceptually related memories (different
 * wording, same topic) still surface. No external embedding API — stays provider-neutral
 * per Brain constraints.
 */

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "was",
  "it", "this", "that", "with", "as", "by", "be", "at", "its",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function termFrequencyVector(tokens: string[]): Map<string, number> {
  const vector = new Map<string, number>();
  for (const token of tokens) {
    vector.set(token, (vector.get(token) ?? 0) + 1);
  }
  return vector;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  for (const [term, count] of a) {
    const other = b.get(term);
    if (other) dot += count * other;
  }
  if (dot === 0) return 0;

  const magnitude = (vector: Map<string, number>) =>
    Math.sqrt([...vector.values()].reduce((sum, value) => sum + value * value, 0));

  const denominator = magnitude(a) * magnitude(b);
  return denominator === 0 ? 0 : dot / denominator;
}

function entryText(entry: AtlasMemoryEntry): string {
  return [entry.title, entry.summary, entry.content, entry.tags.join(" ")].join(" ");
}

export function semanticSearchMemoryEntries(
  entries: AtlasMemoryEntry[],
  queryText: string,
  limit = 10,
): MemorySearchResult[] {
  const queryVector = termFrequencyVector(tokenize(queryText));
  if (queryVector.size === 0) return [];

  const results: MemorySearchResult[] = [];

  for (const entry of entries) {
    if (entry.status !== "active") continue;
    const entryVector = termFrequencyVector(tokenize(entryText(entry)));
    const similarity = cosineSimilarity(queryVector, entryVector);
    if (similarity <= 0) continue;

    results.push({
      entry,
      score: Math.round(similarity * 100 * 100) / 100,
      matchedOn: ["semantic"],
    });
  }

  return results
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
