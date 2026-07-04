import type { AiPolicyConfig, AiPolicyDecision, PolicyEngine } from "../interfaces/policy";

let config: AiPolicyConfig = {
  allowFallback: true,
  offlineMode: false,
};

export const aiPolicyEngine: PolicyEngine = {
  configure(next) {
    config = { ...config, ...next };
  },

  getConfig() {
    return { ...config };
  },

  evaluate(input) {
    const warnings: string[] = [];
    const blockedModelIds: string[] = [];
    const blockedProviderIds = [...(config.blockedProviderIds ?? [])];

    if (config.blockedModelIds?.includes(input.modelId)) {
      blockedModelIds.push(input.modelId);
    }
    if (config.blockedProviderIds?.includes(input.providerId)) {
      warnings.push(`Provider blocked by policy: ${input.providerId}`);
    }

    if (config.offlineMode && input.providerId !== "mock" && input.providerId !== "stub") {
      blockedProviderIds.push(input.providerId);
      warnings.push("Offline mode active — only mock/stub providers allowed.");
    }

    if (
      config.maxCostPerTaskUsd !== undefined &&
      input.estimatedCostUsd !== undefined &&
      input.estimatedCostUsd > config.maxCostPerTaskUsd
    ) {
      blockedModelIds.push(input.modelId);
      warnings.push(`Estimated cost exceeds policy limit (${config.maxCostPerTaskUsd} USD).`);
    }

    if (
      config.maxTokens !== undefined &&
      input.tokenUsage !== undefined &&
      input.tokenUsage > config.maxTokens
    ) {
      blockedModelIds.push(input.modelId);
      warnings.push(`Token usage exceeds policy limit (${config.maxTokens}).`);
    }

    const blocked = blockedModelIds.includes(input.modelId) || blockedProviderIds.includes(input.providerId);

    return {
      allowed: !blocked,
      blockedModelIds,
      blockedProviderIds,
      forcedModelId: config.preferredModelId,
      maxTokens: config.maxTokens,
      offlineMode: config.offlineMode ?? false,
      warnings,
    } satisfies AiPolicyDecision;
  },
};

export function configureAiPolicies(next: AiPolicyConfig): void {
  aiPolicyEngine.configure(next);
}

export function evaluateAiPolicy(input: Parameters<PolicyEngine["evaluate"]>[0]): AiPolicyDecision {
  return aiPolicyEngine.evaluate(input);
}
