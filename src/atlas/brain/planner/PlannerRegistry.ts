import type { AtlasPlanner } from "./planner.types";

const planners = new Map<string, AtlasPlanner>();

export function registerPlanner(planner: AtlasPlanner): void {
  planners.set(planner.id, planner);
}

export function unregisterPlanner(plannerId: string): void {
  planners.delete(plannerId);
}

export function getPlanner(plannerId: string): AtlasPlanner | undefined {
  return planners.get(plannerId);
}

export function listPlanners(): AtlasPlanner[] {
  return [...planners.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function resolvePlanner(
  goal: string,
  context: Parameters<AtlasPlanner["matchScore"]>[1],
): AtlasPlanner | undefined {
  const ranked = listPlanners()
    .map((planner) => ({ planner, score: planner.matchScore(goal, context) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.planner;
}

export function isPlannerRegistryBootstrapped(): boolean {
  return planners.size > 0;
}
