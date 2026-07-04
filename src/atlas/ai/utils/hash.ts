import type { AtlasTaskType } from "../types";

export function buildCacheKey(task: AtlasTaskType, payload: unknown, locale?: string): string {
  return `${task}:${locale ?? "default"}:${JSON.stringify(payload)}`;
}

export function createTelemetryId(): string {
  return `tel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createJobId(): string {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function estimateCostUsd(tokenTotal: number, costPer1kTokens = 0.002): number {
  return Math.round((tokenTotal / 1000) * costPer1kTokens * 10000) / 10000;
}
