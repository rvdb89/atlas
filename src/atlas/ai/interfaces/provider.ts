import type { AtlasTaskType } from "../types";
import type { AiProviderRequest, AiProviderResponse } from "./providerRequest";

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

/** Uniform provider contract — vendor logic lives only in provider adapters. */
export type AiProviderAdapter = {
  readonly id: string;
  supports(task: AtlasTaskType, modelId: string): boolean;
  execute<T>(request: AiProviderRequest): Promise<AiProviderResponse<T>>;
  healthCheck(): Promise<{ available: boolean; message?: string }>;
};

export type ProviderRegistry = {
  register(adapter: AiProviderAdapter): void;
  unregister(providerId: string): void;
  get(providerId: string): AiProviderAdapter | undefined;
  list(): AiProviderAdapter[];
};

export type { AiProviderRequest, AiProviderResponse };
