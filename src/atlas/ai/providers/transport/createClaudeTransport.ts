import { isAnthropicConfigured } from "@/atlas/config/env";
import { updateClaudeRuntimeState } from "../claudeRuntimeState";
import { logProviderExecution } from "../providerRuntimeLogger";
import { isClaudeApiError } from "../errors/ClaudeApiError";
import type { AiTransport } from "./types";
import { createAnthropicTransport } from "./anthropicTransport";
import { createMockTransport } from "./mockTransport";

/** Select Claude transport — live when configured, mock otherwise with graceful fallback. */
export function createClaudeTransport(): AiTransport {
  const mock = createMockTransport("claude");

  if (!isAnthropicConfigured()) {
    updateClaudeRuntimeState({
      configured: false,
      mode: "mock",
      health: "not configured",
    });

    return {
      mode: "mock",
      send: async <T,>(request: Parameters<AiTransport["send"]>[0]) => {
        const response = await mock.send<T>(request);
        return {
          ...response,
          metadata: {
            ...response.metadata,
            hasApiKey: false,
            transport: "mock",
            fallbackUsed: true,
          },
        };
      },
    };
  }

  const live = createAnthropicTransport();

  return {
    mode: "live",
    send: async <T,>(request: Parameters<AiTransport["send"]>[0]) => {
      const started = Date.now();
      try {
        return await live.send<T>(request);
      } catch (error) {
        const message = isClaudeApiError(error) ? error.message : "Claude provider failed";
        updateClaudeRuntimeState({
          configured: true,
          mode: "mock",
          health: "error",
          lastError: message,
        });

        logProviderExecution({
          provider: "claude",
          task: String(request.request?.task ?? "unknown"),
          model: String(request.request?.modelId ?? "unknown"),
          durationMs: Date.now() - started,
          fallbackUsed: true,
        });

        const fallback = await mock.send<T>(request);
        return {
          ...fallback,
          metadata: {
            ...fallback.metadata,
            fallbackUsed: true,
            liveError: message,
            transport: "mock",
          },
        };
      }
    },
  };
}
