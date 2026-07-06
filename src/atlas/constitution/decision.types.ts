import type { DecisionEngineResult } from "../brain/decision/decision.types";
import type { EvolutionResult } from "./evolution.types";

export type DecisionStepId =
  | "intent"
  | "current-state"
  | "north-star"
  | "capability-gaps"
  | "recommended-evolution"
  | "principles"
  | "capabilities"
  | "systems"
  | "roadmap"
  | "mission-registry"
  | "engineering-package";

export type DecisionStepStatus = "pass" | "warn" | "fail";

export type DecisionStep = {
  id: DecisionStepId;
  label: string;
  status: DecisionStepStatus;
  summary: string;
  details: string[];
};

export type DecisionFrameworkDefinition = {
  id: string;
  title: string;
  version: string;
  hierarchy: string[];
  rules: string[];
};

export type DecisionResult = {
  frameworkId: string;
  intent: string;
  northStarAligned: boolean;
  northStarScore: number;
  applicablePrinciples: string[];
  capabilities: Array<{ id: string; name: string; description: string }>;
  systems: Array<{ id: string; name: string; purpose: string }>;
  recommendedMissions: Array<{
    missionId: string;
    title: string;
    rationale: string;
    priority: number;
    systemId: string;
  }>;
  selectedMissionId: string | null;
  selectionRationale: string;
  nextBestMissionId: string | null;
  missionRegistered: boolean;
  steps: DecisionStep[];
  evaluatedAt: string;
  evolution?: EvolutionResult;
  decisionEngine?: DecisionEngineResult;
};

export type DecisionInput = {
  intent?: string;
  missionId?: string;
  missionRegistered?: (missionId: string) => boolean;
};
