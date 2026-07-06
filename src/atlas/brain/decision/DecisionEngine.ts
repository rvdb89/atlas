import { runEvolution } from "@/atlas/constitution/EvolutionEngine";
import {
  ATLAS_CONSTITUTION_ID,
  getAtlasConstitution,
} from "@/atlas/constitution/AtlasConstitution";

import { bootstrapAtlasDecision } from "./bootstrap";
import { analyzeCapabilityIntelligence } from "../capability/RoadmapIntelligence";
import { buildDecisionReasoning, buildDecisionSteps } from "./DecisionReasoning";
import { listDecisionPolicies } from "./DecisionRegistry";
import type {
  DecisionEngineDefinition,
  DecisionEngineInput,
  DecisionEngineResult,
} from "./decision.types";
import { DECISION_ENGINE_ID } from "./decision.types";

export const DECISION_ENGINE_HIERARCHY = [
  "Intent",
  "Constitution",
  "Current Capabilities",
  "Organization",
  "Roadmap",
  "Decision",
  "Recommended Initiative",
  "Execution Package",
] as const;

export function runDecision(input: DecisionEngineInput): DecisionEngineResult {
  bootstrapAtlasDecision();

  const constitution = getAtlasConstitution();
  const evolution = runEvolution(input);
  const organization = evolution.organization;
  const engineeringRequired = organization?.engineeringPackageRequired ?? Boolean(input.missionId);

  const topRec = evolution.evolutionRecommendations[0] ?? null;
  const priorityScore = topRec?.valueScore ?? evolution.northStarScore / 10;

  const intentCapabilityIds = [
    ...new Set(
      evolution.capabilityGaps.filter((gap) => gap.intentRelevant).map((gap) => gap.capabilityId),
    ),
  ];
  const capabilityIntelligence = analyzeCapabilityIntelligence({ intentCapabilityIds });

  const recommendedInitiativeId = engineeringRequired
    ? (evolution.selectedMissionId ?? topRec?.missionId ?? null)
    : null;
  const recommendedInitiativeTitle = engineeringRequired
    ? (topRec?.title ??
      constitution.roadmap.find((item) => item.missionId === recommendedInitiativeId)?.title ??
      null)
    : null;

  const executionPackageMissionId = engineeringRequired ? recommendedInitiativeId : null;
  const executionPackageTrigger = Boolean(
    engineeringRequired && executionPackageMissionId && evolution.missionRegistered,
  );

  const draft: DecisionEngineResult = {
    engineId: DECISION_ENGINE_ID,
    intent: evolution.intent,
    inputs: {
      constitutionId: ATLAS_CONSTITUTION_ID,
      organizationModelId: organization?.modelId ?? "ATLAS-002",
      roadmapMissionCount: constitution.roadmap.length,
      capabilityCount: evolution.currentState.length,
    },
    northStarAligned: evolution.northStarAligned,
    northStarScore: evolution.northStarScore,
    capabilityGaps: evolution.capabilityGaps,
    priorityScore,
    recommendedInitiativeId,
    recommendedInitiativeTitle,
    departmentAssignments: organization?.departmentAssignments ?? [],
    reasoning: [],
    why: "",
    branchDirectorAdvice: capabilityIntelligence.topRecommendation?.branchDirectorAdvice ??
      capabilityIntelligence.answers.whyIsThisBestNextStep,
    capabilityIntelligence,
    executionPackageRequired: engineeringRequired,
    executionPackageTrigger,
    executionPackageMissionId,
    nextBestInitiativeId: engineeringRequired ? evolution.nextBestMissionId : null,
    missionRegistered: evolution.missionRegistered,
    steps: [],
    evolution,
    evaluatedAt: evolution.evaluatedAt,
  };

  const narrative = buildDecisionReasoning({
    evolution,
    organization,
    priorityScore,
    recommendedInitiativeId,
    recommendedInitiativeTitle,
    executionPackageRequired: engineeringRequired,
    executionPackageTrigger,
  });

  draft.reasoning = [
    ...narrative.reasoning,
    `Capability Registry: ${capabilityIntelligence.answers.whereAreWeWeak}`,
    `Registry recommendation: ${capabilityIntelligence.answers.whatShouldWeBuildNext}`,
  ];
  draft.why = [draft.branchDirectorAdvice, narrative.why].filter(Boolean).join(" ");

  for (const policy of listDecisionPolicies()) {
    const evaluation = policy.evaluate(draft);
    if (evaluation) {
      draft.reasoning.push(`Policy ${policy.id}: ${evaluation.note}`);
    }
  }

  draft.steps = buildDecisionSteps(draft);

  return draft;
}

export function renderDecisionEngineHierarchy(): string {
  return DECISION_ENGINE_HIERARCHY.join("\n↓\n");
}

export function getDecisionEngineDefinition(): DecisionEngineDefinition {
  return {
    id: DECISION_ENGINE_ID,
    title: "Decision Engine",
    version: "1.0.0",
    hierarchy: [...DECISION_ENGINE_HIERARCHY],
    rules: [
      "Every initiative originates from the Decision Engine",
      "Humans provide intent only — Atlas derives initiatives and Execution Packages",
      "Constitution is the highest source of truth",
      "Current capabilities and Organization inform every decision",
      "Roadmap is context — value score selects the recommended initiative",
      "Atlas must explain WHY a decision was made",
      "Capability Registry (BRAIN-005) informs initiative recommendations",
    ],
  };
}
