import { getTeamMember } from "@/atlas/agents/team";
import { getCachedOutput, setCachedOutput } from "../cache/memoryCache";
import { remember } from "../memory/store";
import { resolvePrompt } from "../prompts/library";
import { getProvider } from "../providers/registry";
import { ProviderUnavailableError } from "../providers/types";
import { getModelProfile } from "../models/profiles";
import { routeTask } from "./routeTask";
import type { AiTaskExecutionResult, ExecuteTaskInput } from "../types";
import { validateAiOutput, validateTokenLimits } from "../validation/validateOutput";
import { getTaskRouteConfig } from "../tasks/routes";

export async function executeTask<TOutput = unknown>(
  input: ExecuteTaskInput,
): Promise<AiTaskExecutionResult<TOutput>> {
  const decision = routeTask(input.task);
  const prompt = resolvePrompt(decision.promptId, input.payload);
  const settings = { ...decision.settings, ...input.settings, locale: input.locale };
  const started = Date.now();
  const attemptedProviderIds: string[] = [];
  let lastError: Error | undefined;

  if (!input.skipCache) {
    const cached = getCachedOutput<TOutput>(input.task, input.payload, input.locale);
    if (cached !== undefined) {
      return {
        task: input.task,
        providerId: decision.primaryProviderId,
        promptId: decision.promptId,
        promptVersion: prompt.version,
        attemptedProviderIds: [decision.primaryProviderId],
        usedFallback: false,
        cacheHit: true,
        durationMs: Date.now() - started,
        validation: { valid: true, issues: [] },
        output: cached,
        warnings: ["Cache hit"],
      };
    }
  }

  for (const modelId of decision.providerChain) {
    attemptedProviderIds.push(modelId);
    const profile = getModelProfile(modelId);
    if (!profile) continue;

    const provider = getProvider(profile.providerId);
    if (!provider) {
      lastError = new ProviderUnavailableError(profile.providerId, modelId, "Provider adapter not registered");
      continue;
    }

    try {
      const response = await provider.execute<TOutput>({
        task: input.task,
        modelId,
        prompt,
        payload: input.payload,
        settings,
        outputSchema: prompt.outputSchema,
      });

      let validation = input.skipValidation
        ? { valid: true, issues: [] }
        : validateAiOutput(response.output, prompt.outputSchema);

      const tokenIssues = validateTokenLimits(response.tokenUsage, settings.maxTokens);
      if (tokenIssues.length > 0) {
        validation = {
          valid: validation.valid && !tokenIssues.some((i) => i.severity === "error"),
          issues: [...validation.issues, ...tokenIssues],
        };
      }

      if (!validation.valid) {
        throw new Error(
          `Output validation failed: ${validation.issues.map((issue) => issue.message).join("; ")}`,
        );
      }

      if (!input.skipCache) {
        setCachedOutput(input.task, input.payload, response.output, input.locale);
      }

      if (input.moduleId) {
        remember(`last:${input.task}`, response.output, "module", {
          moduleId: input.moduleId,
          agentId: input.agentId,
        });
      }

      return {
        task: input.task,
        providerId: modelId,
        promptId: decision.promptId,
        promptVersion: prompt.version,
        attemptedProviderIds,
        usedFallback: modelId !== decision.primaryProviderId,
        cacheHit: false,
        durationMs: Date.now() - started,
        validation,
        output: response.output,
        warnings: [],
        metadata: response.metadata,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (!(error instanceof ProviderUnavailableError)) {
        throw error;
      }
    }
  }

  throw new Error(
    `Atlas AI Orchestrator: ${lastError?.message ?? "All providers unavailable"} (${attemptedProviderIds.join(" → ")})`,
  );
}

export function formatTaskExecutionLog<T>(execution: AiTaskExecutionResult<T>): string {
  const route = getTaskRouteConfig(execution.task);
  const member = getTeamMember(route.agentId);
  const profile = getModelProfile(execution.providerId);
  const modelLabel = profile ? `${profile.vendor} · ${profile.name}` : execution.providerId;
  const fallbackNote = execution.usedFallback ? " (fallback)" : "";
  const cacheNote = execution.cacheHit ? " · cache" : "";

  return `${member.emoji} ${member.name} · ${execution.task} via ${modelLabel}${fallbackNote}${cacheNote} · ${execution.durationMs}ms`;
}
