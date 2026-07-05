import type { AtlasTaskType } from "../types";
import type { OutputSchema } from "../types";
import type { AiProviderAdapter } from "../interfaces/provider";
import { ProviderUnavailableError } from "../interfaces/provider";
import type { AiProviderRequest, AiProviderResponse } from "../interfaces/providerRequest";
import { getTaskHandler } from "../tasks/handlerRegistry";
import { recordClaudeTask } from "./claudeRuntimeState";
import { logProviderExecution } from "./providerRuntimeLogger";
import type { AiProvider } from "./interfaces";

function shouldUseStructuredOutput(schema: OutputSchema): boolean {
  return schema.kind === "json" || schema.json === true || schema.kind === "validation" || schema.kind === "score";
}

function mapProviderResponse<T>(
  providerId: string,
  response: { output: T; raw?: string; usage: { inputTokens: number; outputTokens: number; totalTokens: number; estimatedCostUsd?: number }; finishReason: string; metadata?: Record<string, unknown> },
): AiProviderResponse<T> {
  return {
    output: response.output,
    raw: response.raw,
    tokenUsage: {
      input: response.usage.inputTokens,
      output: response.usage.outputTokens,
      total: response.usage.totalTokens,
    },
    estimatedCostUsd: response.usage.estimatedCostUsd,
    metadata: {
      ...response.metadata,
      providerId,
      finishReason: response.finishReason,
      transportMode: response.metadata?.transport ?? "mock",
    },
  };
}

function mapToAiRequest(request: AiProviderRequest) {
  return {
    task: request.task,
    modelId: request.modelId,
    systemPrompt: request.prompt.systemRendered,
    userPrompt: request.prompt.userRendered,
    payload: request.payload,
    temperature: request.settings.temperature,
    maxTokens: request.settings.maxTokens,
    timeoutMs: request.settings.timeoutMs,
    locale: request.settings.locale,
    schema: request.outputSchema.fields
      ? Object.fromEntries(request.outputSchema.fields.map((field) => [field.name, field.type]))
      : undefined,
  };
}

/** Bridges live AiProvider implementations to the legacy orchestrator adapter contract. */
export function wrapAiProvider(provider: AiProvider): AiProviderAdapter {
  return {
    id: provider.id,

    supports(task: AtlasTaskType, modelId: string) {
      return (
        provider.capabilities.supportedTasks.includes(task) &&
        provider.capabilities.models.some((model) => model.id === modelId)
      );
    },

    async healthCheck() {
      const health = await provider.health();
      return {
        available: health.available,
        message: health.message,
      };
    },

    async execute<T>(request: AiProviderRequest): Promise<AiProviderResponse<T>> {
      const aiRequest = mapToAiRequest(request);
      const started = Date.now();

      try {
        if (shouldUseStructuredOutput(request.outputSchema)) {
          const response = await provider.generateStructured<T>(aiRequest);
          if (provider.id === "claude") {
            recordClaudeTask(request.task, request.modelId, response.metadata?.transport === "live" ? "live" : "mock");
          }
          logProviderExecution({
            provider: provider.id,
            task: request.task,
            model: request.modelId,
            durationMs: Date.now() - started,
            fallbackUsed: Boolean(response.metadata?.fallbackUsed),
          });
          return mapProviderResponse(provider.id, response);
        }

        const response = await provider.generateText(aiRequest);
        const fallbackHandler = getTaskHandler(request.task);

        if (
          fallbackHandler &&
          (request.modelId.startsWith("atlas-") || provider.id === "mock") &&
          response.output.startsWith("[mock:")
        ) {
          return fallbackHandler(request) as Promise<AiProviderResponse<T>>;
        }

        if (provider.id === "claude") {
          recordClaudeTask(request.task, request.modelId, response.metadata?.transport === "live" ? "live" : "mock");
        }

        logProviderExecution({
          provider: provider.id,
          task: request.task,
          model: request.modelId,
          durationMs: Date.now() - started,
          fallbackUsed: Boolean(response.metadata?.fallbackUsed),
        });

        return mapProviderResponse(provider.id, response) as AiProviderResponse<T>;
      } catch (error) {
        if (provider.id === "mock") {
          const fallbackHandler = getTaskHandler(request.task);
          if (fallbackHandler) {
            logProviderExecution({
              provider: "mock",
              task: request.task,
              model: request.modelId,
              durationMs: Date.now() - started,
              fallbackUsed: true,
            });
            return fallbackHandler(request) as Promise<AiProviderResponse<T>>;
          }
        }

        const message = error instanceof Error ? error.message : "Provider execution failed";
        throw new ProviderUnavailableError(provider.id, request.modelId, message);
      }
    },
  };
}
