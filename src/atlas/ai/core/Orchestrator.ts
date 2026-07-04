import { getTeamMember } from "@/atlas/agents/team";
import { getCachedOutput, setCachedOutput } from "../cache/memoryCache";
import { buildExecutionContext } from "../context/builder";
import { remember } from "../memory/store";
import { evaluateAiPolicy } from "../policies/PolicyEngine";
import { resolvePrompt } from "../prompts/library";
import { getProvider } from "../providers/registry";
import { ProviderUnavailableError } from "../interfaces/provider";
import { getModelProfile } from "../models/profiles";
import { routeTask } from "../router/routeTask";
import { recordAiTelemetry } from "../telemetry/TelemetryStore";
import { getTaskRouteConfig } from "../tasks/routes";
import type {
  AiTaskExecutionResult,
  ExecuteNamedTaskInput,
  ExecuteTaskInput,
} from "../types";
import { resolveTaskName, resolveTaskTypeName } from "../types";
import { validateAiOutput, validateTokenLimits } from "../validation/validateOutput";
import { estimateCostUsd } from "../utils/hash";

async function invokeProvider<TOutput>(
  modelId: string,
  input: ExecuteTaskInput,
  prompt: ReturnType<typeof resolvePrompt>,
  settings: ExecuteTaskInput["settings"] & { locale?: string },
  contextId: string,
): Promise<{ output: TOutput; tokenUsage?: { input: number; output: number; total: number }; estimatedCostUsd?: number; metadata?: Record<string, unknown> }> {
  const profile = getModelProfile(modelId);
  if (!profile) {
    throw new ProviderUnavailableError("unknown", modelId, "Model profile not found");
  }

  const policy = evaluateAiPolicy({
    task: input.task,
    modelId,
    providerId: profile.providerId,
    estimatedCostUsd: profile.estimatedCostPer1kTokens,
  });

  if (!policy.allowed) {
    throw new ProviderUnavailableError(profile.providerId, modelId, policy.warnings.join("; ") || "Blocked by policy");
  }

  const provider = getProvider(profile.providerId);
  if (!provider) {
    throw new ProviderUnavailableError(profile.providerId, modelId, "Provider adapter not registered");
  }

  const response = await provider.execute<TOutput>({
    task: input.task,
    modelId,
    prompt,
    payload: input.payload,
    settings: settings ?? {},
    outputSchema: prompt.outputSchema,
    contextId,
  });

  const tokenTotal = response.tokenUsage?.total ?? 0;
  const estimatedCostUsd =
    response.estimatedCostUsd ??
    (profile.estimatedCostPer1kTokens ? estimateCostUsd(tokenTotal, profile.estimatedCostPer1kTokens) : undefined);

  return {
    output: response.output,
    tokenUsage: response.tokenUsage,
    estimatedCostUsd,
    metadata: response.metadata,
  };
}

/** Central Atlas AI Orchestrator — callers request tasks, never models. */
export async function executeTask<TOutput = unknown>(
  input: ExecuteTaskInput,
): Promise<AiTaskExecutionResult<TOutput>> {
  const decision = routeTask(input.task);
  const prompt = resolvePrompt(decision.promptId, input.payload);
  const settings = { ...decision.settings, ...input.settings, locale: input.locale };
  const context = buildExecutionContext({
    task: input.task,
    moduleId: input.moduleId,
    locale: input.locale,
    settings,
  });
  const started = Date.now();
  const attemptedModelIds: string[] = [];
  let lastError: Error | undefined;
  let retryCount = 0;

  if (!input.skipCache) {
    const cached = getCachedOutput<TOutput>(input.task, input.payload, input.locale);
    if (cached !== undefined) {
      const telemetry = input.skipTelemetry
        ? undefined
        : recordAiTelemetry({
            task: input.task,
            modelId: decision.primaryModelId,
            providerId: getModelProfile(decision.primaryModelId)?.providerId ?? "unknown",
            promptId: decision.promptId,
            durationMs: Date.now() - started,
            cacheHit: true,
            usedFallback: false,
            retryCount: 0,
            success: true,
            moduleId: input.moduleId,
          });

      return {
        task: input.task,
        taskName: resolveTaskTypeName(input.task),
        providerId: decision.primaryModelId,
        promptId: decision.promptId,
        promptVersion: prompt.version,
        attemptedProviderIds: attemptedModelIds,
        usedFallback: false,
        cacheHit: true,
        retryCount: 0,
        durationMs: Date.now() - started,
        validation: { valid: true, issues: [] },
        output: cached,
        warnings: ["Cache hit"],
        telemetryId: telemetry?.id,
      };
    }
  }

  for (const modelId of decision.providerChain) {
    attemptedModelIds.push(modelId);
    retryCount += 1;

    try {
      const response = await invokeProvider<TOutput>(modelId, input, prompt, settings, context.contextId);

      let validation = input.skipValidation
        ? { valid: true, issues: [] }
        : validateAiOutput(response.output, prompt.outputSchema);

      const tokenIssues = validateTokenLimits(response.tokenUsage, settings.maxTokens);
      if (tokenIssues.length > 0) {
        validation = {
          valid: validation.valid && !tokenIssues.some((issue) => issue.severity === "error"),
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

      const durationMs = Date.now() - started;
      const profile = getModelProfile(modelId);
      const telemetry = input.skipTelemetry
        ? undefined
        : recordAiTelemetry({
            task: input.task,
            modelId,
            providerId: profile?.providerId ?? "unknown",
            promptId: decision.promptId,
            durationMs,
            tokenUsage: response.tokenUsage,
            estimatedCostUsd: response.estimatedCostUsd,
            cacheHit: false,
            usedFallback: modelId !== decision.primaryModelId,
            retryCount: retryCount - 1,
            success: true,
            moduleId: input.moduleId,
          });

      return {
        task: input.task,
        taskName: resolveTaskTypeName(input.task),
        providerId: modelId,
        promptId: decision.promptId,
        promptVersion: prompt.version,
        attemptedProviderIds: attemptedModelIds,
        usedFallback: modelId !== decision.primaryModelId,
        cacheHit: false,
        retryCount: retryCount - 1,
        durationMs,
        validation,
        output: response.output,
        warnings: [],
        metadata: response.metadata,
        telemetryId: telemetry?.id,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!input.skipTelemetry) {
        const profile = getModelProfile(modelId);
        recordAiTelemetry({
          task: input.task,
          modelId,
          providerId: profile?.providerId ?? "unknown",
          promptId: decision.promptId,
          durationMs: Date.now() - started,
          cacheHit: false,
          usedFallback: modelId !== decision.primaryModelId,
          retryCount: retryCount - 1,
          success: false,
          errorMessage: lastError.message,
          moduleId: input.moduleId,
        });
      }

      if (!(error instanceof ProviderUnavailableError)) {
        throw error;
      }
    }
  }

  throw new Error(
    `Atlas AI Orchestrator: ${lastError?.message ?? "All providers unavailable"} (${attemptedModelIds.join(" → ")})`,
  );
}

export async function executeNamedTask<TOutput = unknown>(
  input: ExecuteNamedTaskInput<TOutput>,
): Promise<AiTaskExecutionResult<TOutput>> {
  const { taskName, ...rest } = input;
  return executeTask<TOutput>({
    ...rest,
    task: resolveTaskName(taskName),
  });
}

export function formatTaskExecutionLog<T>(execution: AiTaskExecutionResult<T>): string {
  const route = getTaskRouteConfig(execution.task);
  const member = getTeamMember(route.agentId);
  const profile = getModelProfile(execution.providerId);
  const modelLabel = profile ? `${profile.vendor} · ${profile.name}` : execution.providerId;
  const fallbackNote = execution.usedFallback ? " (fallback)" : "";
  const cacheNote = execution.cacheHit ? " · cache" : "";
  const taskLabel = execution.taskName ?? execution.task;

  return `${member.emoji} ${member.name} · ${taskLabel} via ${modelLabel}${fallbackNote}${cacheNote} · ${execution.durationMs}ms`;
}
