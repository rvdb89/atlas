import { isAnthropicConfigured } from "@/atlas/config/env";
import { updateClaudeRuntimeState } from "../claudeRuntimeState";
import { logProviderExecution } from "../providerRuntimeLogger";
import { isClaudeApiError } from "../errors/ClaudeApiError";
import type { AiTransport } from "./types";
import { createAnthropicTransport } from "./anthropicTransport";
import { createMockTransport } from "./mockTransport";

// BRAIN-010 · Real incident during CONTENT-007 (technieken, 22 articles sent back-to-back):
// 17 of 22 real Claude calls failed and were silently replaced by mock placeholder content
// (see the catch block below) — the leading suspect is Anthropic rate-limiting after many
// rapid sequential calls. Retrying the retryable failure modes (rate limit, transient
// overload, timeout) a couple of times with a short backoff, before ever falling back to a
// mock, gives a real request a real chance to succeed instead of a nearly-instant surrender.
const RETRYABLE_STATUS_CODES = new Set([429, 503, 529]);
const RETRY_DELAYS_MS = [2000, 6000];

// EXEC-003 · exported (was module-private) so this classification logic — the exact thing
// that decides whether a CONTENT-007-style silent failure gets a real retry or an instant
// mock fallback — has a real regression test instead of only being exercised by chance
// during a live run.
export function isRetryableClaudeError(error: unknown): boolean {
  if (!isClaudeApiError(error)) return false;
  if (error.code === "TIMEOUT") return true;
  return error.code === "HTTP_ERROR" && error.statusCode !== undefined && RETRYABLE_STATUS_CODES.has(error.statusCode);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      let lastError: unknown;

      for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
        try {
          return await live.send<T>(request);
        } catch (error) {
          lastError = error;
          const hasRetriesLeft = attempt < RETRY_DELAYS_MS.length;
          if (hasRetriesLeft && isRetryableClaudeError(error)) {
            await sleep(RETRY_DELAYS_MS[attempt]);
            continue;
          }
          break;
        }
      }

      const message = isClaudeApiError(lastError) ? lastError.message : "Claude provider failed";
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
    },
  };
}
