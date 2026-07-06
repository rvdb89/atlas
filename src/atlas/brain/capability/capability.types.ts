import type { CapabilityMaturity } from "@/atlas/constitution/evolution.types";

export const CAPABILITY_REGISTRY_ID = "BRAIN-005";

export type CapabilityInitiativeLink = {
  missionId: string;
  title: string;
  rationale: string | null;
};

export type CapabilityRegistryEntry = {
  id: string;
  name: string;
  description: string;
  maturityScore: number;
  status: CapabilityMaturity;
  relatedSystems: string[];
  relatedInitiatives: CapabilityInitiativeLink[];
  strategicValue: number;
  currentGaps: string[];
  recommendedNextStep: string;
  gapPercent: number;
  northStarCritical: boolean;
  missing: boolean;
};

export type CapabilityRecommendation = {
  capabilityId: string;
  capabilityName: string;
  missionId: string;
  missionTitle: string;
  strategicValue: number;
  gapPercent: number;
  branchDirectorAdvice: string;
};

export type CapabilityIntelligenceSnapshot = {
  registryId: typeof CAPABILITY_REGISTRY_ID;
  capabilities: CapabilityRegistryEntry[];
  weakCapabilities: CapabilityRegistryEntry[];
  strongCapabilities: CapabilityRegistryEntry[];
  topRecommendation: CapabilityRecommendation | null;
  answers: {
    whereAreWeWeak: string;
    whatShouldWeBuildNext: string;
    whyIsThisBestNextStep: string;
  };
};
