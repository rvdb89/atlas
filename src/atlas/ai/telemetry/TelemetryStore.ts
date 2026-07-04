import type { AiTelemetryEvent, TelemetryStore } from "../interfaces/telemetry";

const events: AiTelemetryEvent[] = [];

export const aiTelemetryStore: TelemetryStore = {
  record(event) {
    const entry: AiTelemetryEvent = {
      id: event.id ?? `tel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      occurredAt: event.occurredAt ?? new Date().toISOString(),
      task: event.task,
      modelId: event.modelId,
      providerId: event.providerId,
      promptId: event.promptId,
      durationMs: event.durationMs,
      tokenUsage: event.tokenUsage,
      estimatedCostUsd: event.estimatedCostUsd,
      cacheHit: event.cacheHit,
      usedFallback: event.usedFallback,
      retryCount: event.retryCount,
      success: event.success,
      errorCode: event.errorCode,
      errorMessage: event.errorMessage,
      moduleId: event.moduleId,
    };
    events.unshift(entry);
    return entry;
  },

  list(filter) {
    let result = events;
    if (filter?.task) result = result.filter((event) => event.task === filter.task);
    if (filter?.modelId) result = result.filter((event) => event.modelId === filter.modelId);
    if (filter?.success !== undefined) result = result.filter((event) => event.success === filter.success);
    return result.slice(0, filter?.limit ?? result.length);
  },

  summarize() {
    const totalExecutions = events.length;
    const successes = events.filter((event) => event.success).length;
    const fallbacks = events.filter((event) => event.usedFallback).length;
    const cacheHits = events.filter((event) => event.cacheHit).length;
    const totalTokens = events.reduce((sum, event) => sum + (event.tokenUsage?.total ?? 0), 0);
    const estimatedCostUsd = events.reduce((sum, event) => sum + (event.estimatedCostUsd ?? 0), 0);

    return {
      totalExecutions,
      successRate: totalExecutions === 0 ? 0 : Math.round((successes / totalExecutions) * 100),
      fallbackRate: totalExecutions === 0 ? 0 : Math.round((fallbacks / totalExecutions) * 100),
      cacheHitRate: totalExecutions === 0 ? 0 : Math.round((cacheHits / totalExecutions) * 100),
      totalTokens,
      estimatedCostUsd: Math.round(estimatedCostUsd * 10000) / 10000,
    };
  },

  clear() {
    events.length = 0;
  },
};

export function recordAiTelemetry(event: Parameters<TelemetryStore["record"]>[0]): AiTelemetryEvent {
  return aiTelemetryStore.record(event);
}

export function summarizeAiTelemetry() {
  return aiTelemetryStore.summarize();
}
