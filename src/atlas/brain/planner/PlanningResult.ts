import type { PlanningRequest, PlanningResult } from "./planner.types";

export function createPlanningSuccess(
  plan: NonNullable<PlanningResult["plan"]>,
  plannerId: string,
): PlanningResult {
  return {
    ok: true,
    plan,
    plannerId,
  };
}

export function createPlanningFailure(message: string): PlanningResult {
  return {
    ok: false,
    message,
  };
}

export function assertPlanningResult(result: PlanningResult): asserts result is PlanningResult & {
  ok: true;
  plan: NonNullable<PlanningResult["plan"]>;
} {
  if (!result.ok || !result.plan) {
    throw new Error(result.message ?? "Planning failed");
  }
}

export function describePlanningResult(result: PlanningResult): string {
  if (!result.ok || !result.plan) {
    return result.message ?? "Planning failed";
  }

  return `${result.plannerId} · ${result.plan.steps.length} steps · ${result.plan.estimatedDurationMs}ms`;
}

export function buildPlanningRequest(
  goal: string,
  context: PlanningRequest["context"],
  priority?: PlanningRequest["priority"],
): PlanningRequest {
  return { goal, context, priority };
}
