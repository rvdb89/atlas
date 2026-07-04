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
};

export type ProviderCapabilities = {
  tasks: AtlasTaskType[];
  outputs: AtlasOutputKind[];
  media: ModelProfile["supportedMedia"];
};
