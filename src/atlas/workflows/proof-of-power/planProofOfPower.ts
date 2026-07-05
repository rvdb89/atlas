import {
  buildPlanningRequest,
  createPlanningContext,
  plannerEngine,
} from "@/atlas/brain/planner";
import type { PlanningResult } from "@/atlas/brain/planner/planner.types";

import type { ProofOfPowerInput } from "./types";

export function createProofOfPowerGoal(input: ProofOfPowerInput): string {
  return `Maak een ${input.contentType.toLowerCase()} over ${input.topic.trim()}.`;
}

export function planProofOfPowerExecution(input: ProofOfPowerInput): PlanningResult {
  const context = createPlanningContext({
    moduleId: input.moduleId,
    moduleLabel: input.moduleLabel,
    language: input.language,
    contentType: input.contentType,
    topic: input.topic,
  });

  return plannerEngine.plan(
    buildPlanningRequest(createProofOfPowerGoal(input), context, "normal"),
  );
}
