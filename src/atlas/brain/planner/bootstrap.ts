import { registerPlanner } from "./PlannerRegistry";
import {
  contentMissionPlanner,
  executionPlanner,
  knowledgePlanner,
  publishingPlanner,
  recipePlanner,
  tipsPlanner,
} from "./planners/defaultPlanners";

let bootstrapped = false;

export function bootstrapAtlasPlanner(): void {
  if (bootstrapped) return;

  registerPlanner(knowledgePlanner);
  registerPlanner(recipePlanner);
  registerPlanner(publishingPlanner);
  registerPlanner(tipsPlanner);
  registerPlanner(executionPlanner);
  registerPlanner(contentMissionPlanner);

  bootstrapped = true;
}

export function isAtlasPlannerBootstrapped(): boolean {
  return bootstrapped;
}
