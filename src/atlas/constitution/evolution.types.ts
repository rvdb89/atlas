export type CapabilityMaturity = "nascent" | "developing" | "mature";

export type CapabilityStateSnapshot = {
  capabilityId: string;
  name: string;
  maturity: number;
  status: CapabilityMaturity;
  systemId: string;
  evidence: string[];
  evolutionMissionId: string;
};

export type CapabilityGap = {
  capabilityId: string;
  name: string;
  currentMaturity: number;
  targetMaturity: number;
  gap: number;
  systemId: string;
  intentRelevant: boolean;
  northStarCritical: boolean;
};

export type EvolutionRecommendation = {
  missionId: string;
  title: string;
  capabilityId: string;
  systemId: string;
  valueScore: number;
  gapClosed: number;
  why: string;
  roadmapRationale: string | null;
};

export type EvolutionAnswers = {
  whereAreWeToday: string;
  whereDoWeWantToBe: string;
  missingCapabilities: string[];
  highestValueCapability: string | null;
  systemToEvolve: string | null;
  missionsToCreate: string[];
  whyNextBestStep: string;
};

export type EvolutionEngineDefinition = {
  id: string;
  title: string;
  version: string;
  hierarchy: string[];
  rules: string[];
};

export type EvolutionInput = {
  intent?: string;
  missionId?: string;
  missionRegistered?: (missionId: string) => boolean;
};

export type EvolutionResult = {
  engineId: string;
  intent: string;
  northStarAligned: boolean;
  northStarScore: number;
  currentState: CapabilityStateSnapshot[];
  capabilityGaps: CapabilityGap[];
  evolutionRecommendations: EvolutionRecommendation[];
  answers: EvolutionAnswers;
  selectedMissionId: string | null;
  selectionRationale: string;
  nextBestMissionId: string | null;
  missionRegistered: boolean;
  steps: Array<{
    id: string;
    label: string;
    status: "pass" | "warn" | "fail";
    summary: string;
    details: string[];
  }>;
  evaluatedAt: string;
};
