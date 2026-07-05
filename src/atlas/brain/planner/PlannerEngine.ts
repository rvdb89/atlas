import { getNextExecutionPlanStep, patchExecutionPlan, patchExecutionPlanStep } from "./ExecutionPlan";
import { createPlanningFailure, createPlanningSuccess } from "./PlanningResult";
import { resolvePlanner } from "./PlannerRegistry";
import type { ExecutionPlan, ExecutionPlanStepStatus, PlannerSnapshot, PlanningRequest, PlanningResult } from "./planner.types";

type PlannerStoreState = {
  currentPlan: ExecutionPlan | null;
  executionQueue: ExecutionPlan[];
  plannerStatus: PlannerSnapshot["plannerStatus"];
};

const state: PlannerStoreState = {
  currentPlan: null,
  executionQueue: [],
  plannerStatus: "idle",
};

function emitChange(): void {
  for (const listener of listeners) {
    listener(getPlannerSnapshot());
  }
}

const listeners = new Set<(snapshot: PlannerSnapshot) => void>();

export function subscribePlannerStore(listener: (snapshot: PlannerSnapshot) => void): () => void {
  listeners.add(listener);
  listener(getPlannerSnapshot());
  return () => listeners.delete(listener);
}

export function setCurrentPlan(plan: ExecutionPlan): void {
  state.currentPlan = plan;
  state.plannerStatus = plan.status === "executing" ? "executing" : "planning";
  state.executionQueue = [plan, ...state.executionQueue.filter((entry) => entry.id !== plan.id)].slice(0, 8);
  emitChange();
}

export function enqueuePlan(plan: ExecutionPlan): void {
  state.executionQueue = [plan, ...state.executionQueue.filter((entry) => entry.id !== plan.id)].slice(0, 8);
  emitChange();
}

export function markPlanExecuting(planId: string): ExecutionPlan | null {
  if (!state.currentPlan || state.currentPlan.id !== planId) return null;
  state.currentPlan = patchExecutionPlan(state.currentPlan, {
    status: "executing",
    startedAt: new Date().toISOString(),
  });
  state.plannerStatus = "executing";
  emitChange();
  return state.currentPlan;
}

export function markPlanCompleted(planId: string): ExecutionPlan | null {
  if (!state.currentPlan || state.currentPlan.id !== planId) return null;
  state.currentPlan = patchExecutionPlan(state.currentPlan, {
    status: "completed",
    completedAt: new Date().toISOString(),
  });
  state.plannerStatus = "completed";
  emitChange();
  return state.currentPlan;
}

export function markPlanFailed(planId: string): ExecutionPlan | null {
  if (!state.currentPlan || state.currentPlan.id !== planId) return null;
  state.currentPlan = patchExecutionPlan(state.currentPlan, {
    status: "failed",
    completedAt: new Date().toISOString(),
  });
  state.plannerStatus = "failed";
  emitChange();
  return state.currentPlan;
}

export function updatePlanStepByWorkflowId(
  workflowStepId: string,
  status: ExecutionPlanStepStatus,
): ExecutionPlan | null {
  if (!state.currentPlan) return null;

  const step = state.currentPlan.steps.find((entry) => entry.workflowStepId === workflowStepId);
  if (!step) return state.currentPlan;

  const patch: Partial<typeof step> = { status };
  if (status === "running") patch.startedAt = new Date().toISOString();
  if (status === "completed" || status === "failed") patch.completedAt = new Date().toISOString();

  state.currentPlan = patchExecutionPlanStep(state.currentPlan, step.id, patch);
  emitChange();
  return state.currentPlan;
}

export function getCurrentPlan(): ExecutionPlan | null {
  return state.currentPlan;
}

export function getExecutionQueue(): ExecutionPlan[] {
  return [...state.executionQueue];
}

export function getPlannerSnapshot(): PlannerSnapshot {
  const currentPlan = state.currentPlan;
  return {
    currentPlan,
    executionQueue: getExecutionQueue(),
    plannerStatus: state.plannerStatus,
    nextStep: currentPlan ? getNextExecutionPlanStep(currentPlan) : null,
  };
}

export function resetPlannerStore(): void {
  state.currentPlan = null;
  state.executionQueue = [];
  state.plannerStatus = "idle";
  emitChange();
}

export class PlannerEngine {
  plan(request: PlanningRequest): PlanningResult {
    const planner = resolvePlanner(request.goal, request.context);
    if (!planner) {
      return createPlanningFailure("No planner matched this goal");
    }

    const plan = planner.createPlan(request.goal, request.context);
    setCurrentPlan(plan);
    return createPlanningSuccess(plan, planner.id);
  }
}

export const plannerEngine = new PlannerEngine();
