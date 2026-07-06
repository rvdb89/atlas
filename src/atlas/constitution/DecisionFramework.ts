import type { DecisionInput, DecisionResult } from "./decision.types";
import { EVOLUTION_ENGINE_ID, EVOLUTION_HIERARCHY, getAtlasConstitution } from "./AtlasConstitution";
import { runEvolution, renderEvolutionHierarchy } from "./EvolutionEngine";

export function runDecisionFramework(input: DecisionInput): DecisionResult {
  const evolution = runEvolution(input);

  return {
    frameworkId: EVOLUTION_ENGINE_ID,
    intent: evolution.intent,
    northStarAligned: evolution.northStarAligned,
    northStarScore: evolution.northStarScore,
    applicablePrinciples: [],
    capabilities: evolution.currentState
      .filter((item) =>
        evolution.capabilityGaps.some(
          (gap) => gap.capabilityId === item.capabilityId && gap.intentRelevant,
        ),
      )
      .map((item) => ({
        id: item.capabilityId,
        name: item.name,
        description: item.evidence.join("; "),
      })),
    systems: [...new Set(evolution.evolutionRecommendations.map((item) => item.systemId))].map(
      (systemId) => ({
        id: systemId,
        name: systemId,
        purpose:
          evolution.currentState.find((item) => item.systemId === systemId)?.evidence[0] ?? systemId,
      }),
    ),
    recommendedMissions: evolution.evolutionRecommendations.map((item) => ({
      missionId: item.missionId,
      title: item.title,
      rationale: item.why,
      priority: Math.round(item.valueScore * 10),
      systemId: item.systemId,
    })),
    selectedMissionId: evolution.selectedMissionId,
    selectionRationale: evolution.selectionRationale,
    nextBestMissionId: evolution.nextBestMissionId,
    missionRegistered: evolution.missionRegistered,
    steps: evolution.steps.map((item) => ({
      id: item.id as DecisionResult["steps"][number]["id"],
      label: item.label,
      status: item.status,
      summary: item.summary,
      details: item.details,
    })),
    evaluatedAt: evolution.evaluatedAt,
    evolution,
  };
}

export function renderDecisionHierarchy(): string {
  return renderEvolutionHierarchy();
}

export function getDecisionFrameworkDefinition() {
  return getAtlasConstitution().decisionFramework;
}

export { runEvolution, renderEvolutionHierarchy, getEvolutionEngineDefinition } from "./EvolutionEngine";
export {
  EVOLUTION_ENGINE_ID,
  EVOLUTION_HIERARCHY,
  DECISION_FRAMEWORK_ID,
} from "./AtlasConstitution";
