import type { DecisionInput, DecisionResult } from "./decision.types";
import { EVOLUTION_ENGINE_ID, EVOLUTION_HIERARCHY, getAtlasConstitution } from "./AtlasConstitution";
import { runDecision, renderDecisionEngineHierarchy } from "../brain/decision";
import { renderEvolutionHierarchy } from "./EvolutionEngine";

export function runDecisionFramework(input: DecisionInput): DecisionResult {
  const decision = runDecision(input);
  const evolution = decision.evolution;

  return {
    frameworkId: EVOLUTION_ENGINE_ID,
    intent: decision.intent,
    northStarAligned: decision.northStarAligned,
    northStarScore: decision.northStarScore,
    applicablePrinciples: [],
    capabilities: evolution.currentState
      .filter((item) =>
        decision.capabilityGaps.some(
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
    selectedMissionId: decision.recommendedInitiativeId,
    selectionRationale: decision.why,
    nextBestMissionId: decision.nextBestInitiativeId,
    missionRegistered: decision.missionRegistered,
    steps: evolution.steps.map((item) => ({
      id: item.id as DecisionResult["steps"][number]["id"],
      label: item.label,
      status: item.status,
      summary: item.summary,
      details: item.details,
    })),
    evaluatedAt: decision.evaluatedAt,
    evolution,
    decisionEngine: decision,
  };
}

export function renderDecisionHierarchy(): string {
  return renderDecisionEngineHierarchy();
}

export function getDecisionFrameworkDefinition() {
  return getAtlasConstitution().decisionFramework;
}

export { runEvolution, renderEvolutionHierarchy, getEvolutionEngineDefinition } from "./EvolutionEngine";
export { runDecision, renderDecisionEngineHierarchy, getDecisionEngineDefinition } from "../brain/decision";
export {
  EVOLUTION_ENGINE_ID,
  EVOLUTION_HIERARCHY,
  DECISION_FRAMEWORK_ID,
} from "./AtlasConstitution";
