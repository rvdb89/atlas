import type { IntentResolution, NorthStarEvaluation } from "./constitution.types";
import {
  ATLAS_CONSTITUTION,
  getAtlasConstitution,
  getConstitutionNorthStarGoals,
} from "./AtlasConstitution";
import { runDecisionFramework } from "./DecisionFramework";

export function resolveIntent(intent: string): IntentResolution {
  const decision = runDecisionFramework({ intent });

  return {
    intent: decision.intent,
    matchedCapabilities: decision.capabilities.map((item) => item.id),
    matchedSystems: decision.systems.map((item) => item.id),
    suggestedMissions: decision.recommendedMissions,
    recommendedMissionId: decision.selectedMissionId,
    rationale: decision.selectionRationale,
  };
}

export function evaluateNorthStarAlignment(input: {
  missionId: string;
  title: string;
  focus: string[];
}): NorthStarEvaluation {
  const constitution = getAtlasConstitution();
  const reasons: string[] = [];
  let score = 0;

  const roadmapItem = constitution.roadmap.find((item) => item.missionId === input.missionId);
  if (roadmapItem) {
    score += 3;
    reasons.push(`Mission ${input.missionId} is on the Constitution roadmap (${roadmapItem.rationale}).`);
  }

  const autonomyKeywords = /decision|memory|context|planner|orchestr|autonom|constitution|audit|reason|planning/i;
  if (input.focus.some((item) => autonomyKeywords.test(item)) || autonomyKeywords.test(input.title)) {
    score += 3;
    reasons.push("Mission focus advances autonomy capabilities.");
  }

  if (/constitution|orchestr|package|audit|registry|decision framework|planning/i.test(input.title + input.focus.join(" "))) {
    score += 2;
    reasons.push("Mission strengthens Atlas platform execution infrastructure.");
  }

  if (input.missionId.startsWith("ATLAS-") || input.missionId.startsWith("BRAIN-") || input.missionId.startsWith("ENG-")) {
    score += 1;
    reasons.push("Mission ID follows Atlas platform naming conventions.");
  }

  for (const rule of constitution.northStarEvaluationRules.slice(0, 2)) {
    reasons.push(`Evaluated against: ${rule}`);
  }

  const northStarGoals = getConstitutionNorthStarGoals();
  reasons.push(`North Star: ${northStarGoals[0]}`);

  return {
    missionId: input.missionId,
    advancesNorthStar: score >= 4,
    score: Math.min(10, score),
    reasons,
  };
}

export function getRoadmapForSystem(systemId: string) {
  return getAtlasConstitution().roadmap.filter((item) => item.systemId === systemId);
}

export function getNextRoadmapMission(
  afterMissionId?: string,
): (typeof ATLAS_CONSTITUTION.roadmap)[number] | null {
  const constitution = getAtlasConstitution();
  const sorted = [...constitution.roadmap].sort((left, right) => left.priority - right.priority);

  if (!afterMissionId) return sorted[0] ?? null;

  const current = sorted.find((item) => item.missionId === afterMissionId);
  if (!current) return sorted[0] ?? null;

  return sorted.find((item) => item.priority > current.priority) ?? null;
}
