import type { AiRequest, AiResponse, AiUsage } from "../interfaces";

export type TransportOperation = "generateText" | "generateStructured" | "health" | "listModels";

export type TransportRequest = {
  providerId: string;
  operation: TransportOperation;
  request?: AiRequest;
  modelIds?: string[];
};

export type TransportResponse<T = unknown> = {
  output?: T;
  raw?: string;
  modelId?: string;
  usage?: AiUsage;
  finishReason?: AiResponse["finishReason"];
  metadata?: Record<string, unknown>;
  available?: boolean;
  latencyMs?: number;
  message?: string;
  models?: Array<{ id: string; label: string; contextWindow: number; supportedOutputs: AiResponse extends never ? never : Array<"text" | "json" | "markdown" | "image">; default?: boolean }>;
};

/**
 * Swappable transport layer.
 * Replace mockTransport.ts with liveTransport.ts — providers stay unchanged.
 */
export interface AiTransport {
  readonly mode: "mock" | "live";
  send<T = unknown>(request: TransportRequest): Promise<TransportResponse<T>>;
}
