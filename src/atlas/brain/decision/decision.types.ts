import type { CapabilityGap, EvolutionInput, EvolutionResult } from "@/atlas/constitution/evolution.types";
import type { CapabilityIntelligenceSnapshot } from "@/atlas/brain/capability/capability.types";
import type { DepartmentAssignment } from "@/atlas/organization/organization.types";

export const DECISION_ENGINE_ID = "BRAIN-004";

export type DecisionEngineInput = EvolutionInput;

export type DecisionEngineStep = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  summary: string;
  details: string[];
};

export type DecisionEngineResult = {
  engineId: typeof DECISION_ENGINE_ID;
  intent: string;
  inputs: {
    constitutionId: string;
    organizationModelId: string;
    roadmapMissionCount: number;
    capabilityCount: number;
  };
  northStarAligned: boolean;
  northStarScore: number;
  capabilityGaps: CapabilityGap[];
  priorityScore: number;
  recommendedInitiativeId: string | null;
  recommendedInitiativeTitle: string | null;
  departmentAssignments: DepartmentAssignment[];
  reasoning: string[];
  why: string;
  branchDirectorAdvice: string;
  capabilityIntelligence: CapabilityIntelligenceSnapshot;
  executionPackageRequired: boolean;
  executionPackageTrigger: boolean;
  executionPackageMissionId: string | null;
  nextBestInitiativeId: string | null;
  missionRegistered: boolean;
  steps: DecisionEngineStep[];
  evolution: EvolutionResult;
  evaluatedAt: string;
};

export type DecisionPolicy = {
  id: string;
  label: string;
  rule: string;
  evaluate: (result: DecisionEngineResult) => { status: "pass" | "warn"; note: string } | null;
};

export type DecisionEngineDefinition = {
  id: typeof DECISION_ENGINE_ID;
  title: string;
  version: string;
  hierarchy: string[];
  rules: string[];
};
