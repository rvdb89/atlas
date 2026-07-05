import type { AtlasTaskType } from "../types";

/** Uniform AI usage metrics — matches future live API billing shape. */
export type AiUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
};

/** Provider model descriptor — Atlas never hardcodes vendor SDK types. */
export type AiModel = {
  id: string;
  label: string;
  contextWindow: number;
  supportedOutputs: Array<"text" | "json" | "markdown" | "image">;
  default?: boolean;
};

/** Provider capability contract — used for routing and health dashboards. */
export type ProviderCapabilities = {
  textGeneration: boolean;
  structuredOutput: boolean;
  imageGeneration: boolean;
  streaming: boolean;
  supportedTasks: AtlasTaskType[];
  models: AiModel[];
};

/** Provider-agnostic request — transport layer maps this to vendor payloads later. */
export type AiRequest = {
  task: AtlasTaskType;
  modelId: string;
  systemPrompt: string;
  userPrompt: string;
  payload?: unknown;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  locale?: string;
  schema?: Record<string, unknown>;
};

/** Provider-agnostic response — same shape for mock and live transports. */
export type AiResponse<T = unknown> = {
  output: T;
  raw?: string;
  modelId: string;
  providerId: string;
  usage: AiUsage;
  finishReason: "stop" | "length" | "error";
  metadata?: Record<string, unknown>;
};

export type ProviderHealthResult = {
  available: boolean;
  latencyMs: number;
  message?: string;
  transportMode: "mock" | "live";
  hasApiKey: boolean;
};

/**
 * Live provider contract — Atlas core depends on this interface only.
 * Vendor names never appear outside provider implementations.
 */
export interface AiProvider {
  readonly id: string;
  readonly label: string;
  readonly capabilities: ProviderCapabilities;
  generateText(request: AiRequest): Promise<AiResponse<string>>;
  generateStructured<T = unknown>(request: AiRequest): Promise<AiResponse<T>>;
  health(): Promise<ProviderHealthResult>;
  listModels(): Promise<AiModel[]>;
}

export type ProviderHealthSnapshot = {
  id: string;
  label: string;
  available: boolean;
  latencyMs: number;
  message?: string;
  transportMode: "mock" | "live";
  hasApiKey: boolean;
  modelCount: number;
  models: string[];
  capabilities: ProviderCapabilities;
  checkedAt: string;
};
