import type { AtlasTaskType, AiTaskSettings, OutputSchema, ResolvedPrompt } from "../types";
import type { ModelProfile } from "../models/types";

export type AiProviderRequest = {
  task: AtlasTaskType;
  modelId: string;
  prompt: ResolvedPrompt;
  payload: unknown;
  settings: AiTaskSettings;
  outputSchema: OutputSchema;
};

export type AiProviderResponse<T = unknown> = {
  output: T;
  raw?: string;
  tokenUsage?: { input: number; output: number; total: number };
  metadata?: Record<string, unknown>;
};

export class ProviderUnavailableError extends Error {
  constructor(
    readonly providerId: string,
    readonly modelId: string,
    message = "Provider unavailable",
  ) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}

/** Uniform adapter contract — every vendor implements this interface. */
export type AiProviderAdapter = {
  readonly id: string;
  readonly models: ModelProfile[];
  supports(task: AtlasTaskType, modelId: string): boolean;
  execute<T>(request: AiProviderRequest): Promise<AiProviderResponse<T>>;
  healthCheck(): Promise<{ available: boolean; message?: string }>;
};
