import { getAnthropicApiKey } from "@/atlas/config/env";
import type { AiRequest } from "../interfaces";
import { resolveClaudeApiModel } from "../claudeConfig";
import { ClaudeApiError } from "../errors/ClaudeApiError";
import { recordClaudeTask, updateClaudeRuntimeState } from "../claudeRuntimeState";
import { logProviderExecution } from "../providerRuntimeLogger";
import type { AiTransport, TransportRequest, TransportResponse } from "./types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

type AnthropicMessageResponse = {
  content?: Array<{ type: string; text?: string }>;
  model?: string;
  usage?: { input_tokens?: number; output_tokens?: number };
  stop_reason?: string;
};

/** Strips a markdown code fence wrapping the whole response — anchored at the start and
 * end of the string, not a mid-string search. A non-anchored search would misfire when
 * the JSON payload itself contains file content with its own ``` sequences (e.g. a
 * generated markdown file, or a code sample in a comment), chopping the real JSON apart
 * at the wrong backticks. */
function stripOuterCodeFence(trimmed: string): string {
  if (!trimmed.startsWith("```")) return trimmed;

  const firstNewline = trimmed.indexOf("\n");
  if (firstNewline === -1) return trimmed;

  const withoutOpening = trimmed.slice(firstNewline + 1);
  const closingIndex = withoutOpening.lastIndexOf("```");
  if (closingIndex === -1) return withoutOpening;

  return withoutOpening.slice(0, closingIndex).trim();
}

function parseJsonBlock(raw: string): unknown {
  const trimmed = raw.trim();
  const candidate = stripOuterCodeFence(trimmed);
  return JSON.parse(candidate);
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ClaudeApiError("TIMEOUT", `Claude request timed out after ${timeoutMs}ms`);
    }
    throw new ClaudeApiError("PROVIDER_UNAVAILABLE", "Claude provider unavailable");
  } finally {
    clearTimeout(timer);
  }
}

async function callAnthropicMessages(request: AiRequest, structured: boolean): Promise<TransportResponse> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new ClaudeApiError("MISSING_API_KEY", "ANTHROPIC_API_KEY is not configured");
  }

  const started = Date.now();
  const model = resolveClaudeApiModel(request.modelId);
  const timeoutMs = request.timeoutMs ?? 30_000;
  const userPrompt = structured
    ? `${request.userPrompt}\n\nRespond with valid JSON only.`
    : request.userPrompt;

  const response = await fetchWithTimeout(
    ANTHROPIC_API_URL,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      // Note: `temperature` is deprecated on current-gen models (adaptive thinking replaces it) — omitted deliberately.
      body: JSON.stringify({
        model,
        max_tokens: request.maxTokens ?? 1024,
        system: request.systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    },
    timeoutMs,
  );

  const durationMs = Date.now() - started;

  if (!response.ok) {
    let detail = "";
    try {
      const bodyText = await response.text();
      try {
        const errorBody = JSON.parse(bodyText) as { error?: { type?: string; message?: string } };
        detail = errorBody.error?.message ?? bodyText.slice(0, 300);
      } catch {
        detail = bodyText.slice(0, 300);
      }
    } catch {
      detail = "";
    }

    const message = detail
      ? `Claude API returned HTTP ${response.status}: ${detail}`
      : `Claude API returned HTTP ${response.status}`;

    updateClaudeRuntimeState({
      configured: true,
      mode: "live",
      health: "error",
      latencyMs: durationMs,
      lastError: message,
    });
    throw new ClaudeApiError("HTTP_ERROR", message, response.status);
  }

  let payload: AnthropicMessageResponse;
  try {
    payload = (await response.json()) as AnthropicMessageResponse;
  } catch {
    throw new ClaudeApiError("INVALID_RESPONSE", "Claude API returned invalid JSON");
  }

  const raw = payload.content?.map((block) => block.text ?? "").join("\n").trim() ?? "";
  if (!raw) {
    const blockTypes = payload.content?.map((block) => block.type).join(", ") || "none";
    const outputTokens = payload.usage?.output_tokens ?? 0;
    throw new ClaudeApiError(
      "INVALID_RESPONSE",
      `Claude API returned empty content (stop_reason: ${payload.stop_reason ?? "unknown"}, block types: ${blockTypes}, output_tokens: ${outputTokens}). ` +
        (payload.stop_reason === "max_tokens"
          ? "The model likely ran out of its token budget before writing any text — increase maxTokens for this task."
          : "See stop_reason above for why the model produced no usable text."),
    );
  }

  const usage = {
    inputTokens: payload.usage?.input_tokens ?? 0,
    outputTokens: payload.usage?.output_tokens ?? 0,
    totalTokens: (payload.usage?.input_tokens ?? 0) + (payload.usage?.output_tokens ?? 0),
    estimatedCostUsd: undefined,
  };

  recordClaudeTask(request.task, model, "live");
  updateClaudeRuntimeState({
    configured: true,
    mode: "live",
    health: "healthy",
    latencyMs: durationMs,
    lastError: undefined,
  });

  logProviderExecution({
    provider: "claude",
    task: request.task,
    model,
    durationMs,
    fallbackUsed: false,
  });

  if (structured) {
    let output: unknown;
    try {
      output = parseJsonBlock(raw);
    } catch (parseError) {
      const maxTokens = request.maxTokens ?? 1024;
      const outputTokens = usage.outputTokens;
      const likelyTruncated = outputTokens > 0 && outputTokens >= maxTokens - 5;
      const tail = raw.slice(-200);
      const detail = parseError instanceof Error ? parseError.message : String(parseError);

      throw new ClaudeApiError(
        "INVALID_RESPONSE",
        `Claude structured response was not valid JSON (${detail}). ` +
          `output_tokens: ${outputTokens}/${maxTokens}${likelyTruncated ? " — response very likely got cut off mid-JSON by max_tokens, increase maxTokens for this task" : ""}. ` +
          `Last 200 chars of raw response: ${JSON.stringify(tail)}`,
      );
    }

    return {
      output,
      raw,
      modelId: payload.model ?? model,
      usage,
      finishReason: "stop",
      latencyMs: durationMs,
      metadata: { transport: "live", providerId: "claude", task: request.task },
    };
  }

  return {
    output: raw,
    raw,
    modelId: payload.model ?? model,
    usage,
    finishReason: "stop",
    latencyMs: durationMs,
    metadata: { transport: "live", providerId: "claude", task: request.task },
  };
}

/** Live Anthropic Messages API transport. */
export function createAnthropicTransport(): AiTransport {
  return {
    mode: "live",
    async send<T>(transportRequest: TransportRequest): Promise<TransportResponse<T>> {
      if (transportRequest.operation === "health") {
        const apiKey = getAnthropicApiKey();
        if (!apiKey) {
          updateClaudeRuntimeState({
            configured: false,
            mode: "mock",
            health: "not configured",
          });
          return {
            available: true,
            latencyMs: 0,
            message: "Claude not configured",
            metadata: { hasApiKey: false, transport: "mock" },
          };
        }

        updateClaudeRuntimeState({
          configured: true,
          mode: "live",
          health: "healthy",
        });

        return {
          available: true,
          latencyMs: 0,
          message: "Claude API key configured",
          metadata: { hasApiKey: true, transport: "live" },
        };
      }

      if (transportRequest.operation === "listModels") {
        return {
          models: [
            {
              id: "claude-sonnet-5",
              label: "Claude Sonnet 5",
              contextWindow: 1_000_000,
              supportedOutputs: ["text", "markdown", "json"],
              default: true,
            },
            {
              id: "claude-haiku-4-5",
              label: "Claude Haiku 4.5",
              contextWindow: 200_000,
              supportedOutputs: ["text", "markdown", "json"],
            },
          ],
        };
      }

      const request = transportRequest.request;
      if (!request) {
        throw new ClaudeApiError("INVALID_RESPONSE", "Missing AiRequest for Claude transport");
      }

      const structured = transportRequest.operation === "generateStructured";
      return callAnthropicMessages(request, structured) as Promise<TransportResponse<T>>;
    },
  };
}
