import { registerPlanner } from "./PlannerRegistry";
import { knowledgePlanner, publishingPlanner, recipePlanner } from "./planners/defaultPlanners";

let bootstrapped = false;

export function bootstrapAtlasPlanner(): void {
  if (bootstrapped) return;

  registerPlanner(knowledgePlanner);
  registerPlanner(recipePlanner);
  registerPlanner(publishingPlanner);

  bootstrapped = true;
}

export function isAtlasPlannerBootstrapped(): boolean {
  return bootstrapped;
}
