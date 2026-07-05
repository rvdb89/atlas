import type { AtlasTaskType } from "../../types";
import type { AiRequest, AiResponse } from "../interfaces";
import type { AiTransport, TransportRequest, TransportResponse } from "./types";

function estimateUsage(prompt: string, output: string): AiResponse["usage"] {
  const inputTokens = Math.max(12, Math.ceil(prompt.length / 4));
  const outputTokens = Math.max(8, Math.ceil(String(output).length / 4));
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: Number(((inputTokens + outputTokens) * 0.000002).toFixed(6)),
  };
}

function buildTextMock(request: AiRequest): string {
  const topic =
    typeof request.payload === "object" && request.payload && "topic" in request.payload
      ? String((request.payload as { topic?: string }).topic)
      : request.userPrompt.slice(0, 120);

  return [
    `[mock:${request.task}]`,
    `Model: ${request.modelId}`,
    "",
    `Generated editorial draft for: ${topic || "Atlas task"}.`,
    "This response uses the same AiResponse envelope as a future live API call.",
    "",
    request.systemPrompt ? `System context acknowledged (${request.systemPrompt.length} chars).` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildStructuredMock<T>(request: AiRequest): T {
  const topic =
    typeof request.payload === "object" && request.payload && "topic" in request.payload
      ? String((request.payload as { topic?: string }).topic)
      : "Atlas topic";

  const base = {
    title: topic,
    summary: `Structured mock output for ${request.task}.`,
    passed: true,
    score: 92,
    tags: ["atlas", "mock", request.task],
    generatedAt: new Date().toISOString(),
  };

  return base as T;
}

const DEFAULT_MODELS: Record<string, TransportResponse["models"]> = {
  claude: [
    { id: "claude-sonnet", label: "Claude Sonnet", contextWindow: 200_000, supportedOutputs: ["text", "markdown", "json"], default: true },
    { id: "claude-haiku", label: "Claude Haiku", contextWindow: 200_000, supportedOutputs: ["text", "markdown", "json"] },
  ],
  openai: [
    { id: "gpt-4o", label: "GPT-4o", contextWindow: 128_000, supportedOutputs: ["text", "json", "markdown", "image"], default: true },
    { id: "openai-dalle", label: "DALL·E", contextWindow: 0, supportedOutputs: ["image"], default: false },
  ],
  gemini: [
    { id: "gemini-pro", label: "Gemini Pro", contextWindow: 1_000_000, supportedOutputs: ["text", "json", "markdown"], default: true },
  ],
  ollama: [
    { id: "llama3", label: "Llama 3", contextWindow: 8192, supportedOutputs: ["text", "markdown"], default: true },
  ],
  mock: [
    { id: "atlas-mock", label: "Atlas Mock", contextWindow: 32_000, supportedOutputs: ["text", "json", "markdown"], default: true },
    { id: "atlas-stub", label: "Atlas Stub", contextWindow: 16_000, supportedOutputs: ["text", "json"], default: false },
  ],
};

/** Mock transport — no API keys, same response envelope as live APIs. */
export function createMockTransport(providerId: string): AiTransport {
  return {
    mode: "mock",
    async send<T>(transportRequest: TransportRequest): Promise<TransportResponse<T>> {
      const started = Date.now();

      if (transportRequest.operation === "health") {
        return {
          available: true,
          latencyMs: Date.now() - started,
          message: "Mock transport active — no API key required",
          metadata: { providerId, hasApiKey: false },
        };
      }

      if (transportRequest.operation === "listModels") {
        return {
          models: DEFAULT_MODELS[providerId] ?? DEFAULT_MODELS.mock,
          latencyMs: Date.now() - started,
        };
      }

      const request = transportRequest.request;
      if (!request) {
        throw new Error("Transport request missing AiRequest payload");
      }

      const isStructured = transportRequest.operation === "generateStructured";
      const raw = isStructured ? JSON.stringify(buildStructuredMock(request), null, 2) : buildTextMock(request);
      const output = isStructured ? buildStructuredMock<T>(request) : (raw as T);
      const usage = estimateUsage(`${request.systemPrompt}\n${request.userPrompt}`, raw);

      return {
        output,
        raw,
        modelId: request.modelId,
        usage,
        finishReason: "stop",
        latencyMs: Date.now() - started,
        metadata: {
          transport: "mock",
          providerId,
          task: request.task as AtlasTaskType,
        },
      };
    },
  };
}

/** Placeholder for future HTTP/SDK transport — swap file only. */
export function createLiveTransport(_providerId: string): AiTransport {
  return createMockTransport(_providerId);
}
