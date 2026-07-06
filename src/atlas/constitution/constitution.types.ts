import type { BranchDirectorIdentityDefinition } from "./BranchDirectorIdentity";
import type { DecisionFrameworkDefinition } from "./decision.types";
import type { EvolutionEngineDefinition } from "./evolution.types";
import type { OrganizationalModelDefinition } from "../organization/organization.types";

export type ConstitutionCapability = {
  id: string;
  name: string;
  description: string;
};

export type ConstitutionSystem = {
  id: string;
  name: string;
  purpose: string;
  evolution: string;
};

export type ConstitutionRoadmapItem = {
  missionId: string;
  title: string;
  rationale: string;
  priority: number;
  systemId: string;
};

export type AtlasConstitution = {
  id: string;
  title: string;
  version: string;
  generatedAt: string;
  whyAtlasExists: string;
  northStar: string;
  principles: string[];
  longTermVision: string[];
  capabilities: ConstitutionCapability[];
  systems: ConstitutionSystem[];
  systemEvolutionRules: string[];
  missionDerivationRules: string[];
  priorityRules: string[];
  northStarEvaluationRules: string[];
  hierarchy: string[];
  roadmap: ConstitutionRoadmapItem[];
  decisionFramework: DecisionFrameworkDefinition;
  evolutionEngine: EvolutionEngineDefinition;
  organizationalModel: OrganizationalModelDefinition;
  branchDirectorIdentity: BranchDirectorIdentityDefinition;
};

export type IntentResolution = {
  intent: string;
  matchedCapabilities: string[];
  matchedSystems: string[];
  suggestedMissions: ConstitutionRoadmapItem[];
  recommendedMissionId: string | null;
  rationale: string;
};

export type NorthStarEvaluation = {
  missionId: string;
  advancesNorthStar: boolean;
  score: number;
  reasons: string[];
};
