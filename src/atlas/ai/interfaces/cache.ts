import type { AtlasTaskType, CacheEntry } from "../types";

export type AiCacheStore = {
  get<T>(task: AtlasTaskType, payload: unknown, locale?: string): T | undefined;
  set<T>(task: AtlasTaskType, payload: unknown, output: T, locale?: string, ttlMs?: number): void;
  delete(key: string): boolean;
  list(): CacheEntry[];
  clear(): void;
};

export type CachePolicy = {
  enabled: boolean;
  defaultTtlMs?: number;
  maxEntries?: number;
};
