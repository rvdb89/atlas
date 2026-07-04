import type { AtlasTaskType, CacheEntry } from "../types";
import { buildCacheKey } from "../utils/hash";

const cache = new Map<string, CacheEntry>();

export type CacheOptions = {
  ttlMs?: number;
};

export function getCachedOutput<T>(task: AtlasTaskType, payload: unknown, locale?: string): T | undefined {
  const key = buildCacheKey(task, payload, locale);
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt && Date.parse(entry.expiresAt) < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.output as T;
}

export function setCachedOutput<T>(
  task: AtlasTaskType,
  payload: unknown,
  output: T,
  locale?: string,
  options?: CacheOptions,
): void {
  const key = buildCacheKey(task, payload, locale);
  const now = Date.now();
  cache.set(key, {
    key,
    task,
    output,
    createdAt: new Date(now).toISOString(),
    expiresAt: options?.ttlMs ? new Date(now + options.ttlMs).toISOString() : undefined,
  });
}

export function clearAiCache(): void {
  cache.clear();
}

export function listCacheEntries(): CacheEntry[] {
  return [...cache.values()];
}
