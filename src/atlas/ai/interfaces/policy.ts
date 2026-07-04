export type AiPolicyDecision = {
  allowed: boolean;
  blockedModelIds: string[];
  blockedProviderIds: string[];
  forcedModelId?: string;
  maxTokens?: number;
  offlineMode: boolean;
  warnings: string[];
};

export type AiPolicyConfig = {
  maxCostPerTaskUsd?: number;
  maxTokens?: number;
  preferredModelId?: string;
  blockedProviderIds?: string[];
  blockedModelIds?: string[];
  offlineMode?: boolean;
  allowFallback?: boolean;
};

export type PolicyEngine = {
  configure(config: AiPolicyConfig): void;
  getConfig(): AiPolicyConfig;
  evaluate(input: {
    task: string;
    modelId: string;
    providerId: string;
    estimatedCostUsd?: number;
    tokenUsage?: number;
  }): AiPolicyDecision;
};
