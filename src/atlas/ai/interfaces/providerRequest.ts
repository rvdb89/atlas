import type { ResolvedPrompt } from "../types";
import type { AiTaskSettings, AtlasTaskType, OutputSchema } from "../types";

export type AiProviderRequest = {
  task: AtlasTaskType;
  modelId: string;
  prompt: ResolvedPrompt;
  payload: unknown;
  settings: AiTaskSettings;
  outputSchema: OutputSchema;
  contextId?: string;
};

export type AiProviderResponse<T = unknown> = {
  output: T;
  raw?: string;
  tokenUsage?: { input: number; output: number; total: number };
  estimatedCostUsd?: number;
  metadata?: Record<string, unknown>;
};
