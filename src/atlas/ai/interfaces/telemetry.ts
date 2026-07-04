import type { AtlasTaskType } from "../types";

export type AiTelemetryEvent = {
  id: string;
  task: AtlasTaskType;
  modelId: string;
  providerId: string;
  promptId: string;
  durationMs: number;
  tokenUsage?: { input: number; output: number; total: number };
  estimatedCostUsd?: number;
  cacheHit: boolean;
  usedFallback: boolean;
  retryCount: number;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  moduleId?: string;
  occurredAt: string;
};

export type TelemetryStore = {
  record(event: Omit<AiTelemetryEvent, "id" | "occurredAt"> & Partial<Pick<AiTelemetryEvent, "id" | "occurredAt">>): AiTelemetryEvent;
  list(filter?: { task?: AtlasTaskType; modelId?: string; success?: boolean; limit?: number }): AiTelemetryEvent[];
  summarize(): {
    totalExecutions: number;
    successRate: number;
    fallbackRate: number;
    cacheHitRate: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  clear(): void;
};
