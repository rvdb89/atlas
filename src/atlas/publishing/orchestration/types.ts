import type { CoreAgentId } from "../plugin/types";

export type AiTaskType =
  | "research"
  | "copywriting"
  | "visual_design"
  | "fact_checking"
  | "scientific_validation"
  | "seo"
  | "internal_linking"
  | "translation"
  | "domain_validation";

export type ModelOutputKind =
  | "text"
  | "image"
  | "research"
  | "translation"
  | "validation"
  | "multi";

export type CostTier = "low" | "medium" | "high";
export type SpeedTier = "fast" | "balanced" | "slow";
export type QualityTier = "good" | "excellent" | "best";

export type ModelProfile = {
  id: string;
  name: string;
  vendor: string;
  strengths: string[];
  costTier: CostTier;
  speedTier: SpeedTier;
  qualityTier: QualityTier;
  latencyMs: number;
  supportedLanguages: string[];
  supportedOutputs: ModelOutputKind[];
  available: boolean;
};

export type TaskRouteConfig = {
  taskType: AiTaskType;
  agentId: CoreAgentId;
  label: string;
  primaryModelId: string;
  fallbackModelIds: string[];
};

export type RoutingDecision = {
  taskType: AiTaskType;
  agentId: CoreAgentId;
  primary: ModelProfile;
  fallbacks: ModelProfile[];
  chain: ModelProfile[];
};

export type TaskExecutionResult<T> = {
  taskType: AiTaskType;
  providerId: string;
  model: ModelProfile;
  attemptedProviderIds: string[];
  usedFallback: boolean;
  durationMs: number;
  result: T;
};

export type ProviderHealth = {
  modelId: string;
  available: boolean;
  lastCheckedAt: string;
  message?: string;
};

export type OrchestratorError = {
  taskType: AiTaskType;
  attemptedProviderIds: string[];
  message: string;
};
