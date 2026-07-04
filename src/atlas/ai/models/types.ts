import type { AtlasOutputKind, AtlasTaskType } from "../types";

export type CostTier = "low" | "medium" | "high";
export type SpeedTier = "fast" | "balanced" | "slow";
export type QualityTier = "good" | "excellent" | "best";

export type ModelProfile = {
  id: string;
  providerId: string;
  name: string;
  vendor: string;
  strengths: string[];
  costTier: CostTier;
  speedTier: SpeedTier;
  qualityTier: QualityTier;
  latencyMs: number;
  contextWindow: number;
  supportedLanguages: string[];
  supportedOutputs: AtlasOutputKind[];
  supportedMedia: ("text" | "image" | "audio" | "video")[];
  available: boolean;
  priority: number;
  fallbackModelId?: string;
  rankScore?: number;
  estimatedCostPer1kTokens?: number;
};

/** Stored model metadata before routing enrichment. */
export type ModelProfileSeed = Omit<ModelProfile, "priority" | "rankScore" | "estimatedCostPer1kTokens"> &
  Partial<Pick<ModelProfile, "priority" | "rankScore" | "estimatedCostPer1kTokens" | "fallbackModelId">>;

export type ProviderCapabilities = {
  tasks: AtlasTaskType[];
  outputs: AtlasOutputKind[];
  media: ModelProfile["supportedMedia"];
};

export type ModelRegistry = {
  register(profile: ModelProfile): void;
  get(modelId: string): ModelProfile | undefined;
  list(filter?: { providerId?: string; available?: boolean }): ModelProfile[];
  setAvailability(modelId: string, available: boolean): void;
};
