import { getNextExecutionPlanStep, patchExecutionPlan, patchExecutionPlanStep } from "./ExecutionPlan";
import { createPlanningFailure, createPlanningSuccess } from "./PlanningResult";
import { resolvePlanner } from "./PlannerRegistry";
import type {
  ExecutionPlan,
  ExecutionPlanStep,
  ExecutionPlanStepStatus,
  PlannerSnapshot,
  PlanningRequest,
  PlanningResult,
} from "./planner.types";

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

// Context/Planner integration (2026-07-11) · Everything below lets a plan be found and
// updated by missionId, regardless of whether it's still `currentPlan` — see the missionId
// field's doc comment on ExecutionPlan for why this matters (the approve→apply gap can
// outlive several other missions becoming "current" in between).

function findPlanSlot(missionId: string): { plan: ExecutionPlan; isCurrent: boolean } | null {
  if (state.currentPlan?.missionId === missionId) {
    return { plan: state.currentPlan, isCurrent: true };
  }
  const queued = state.executionQueue.find((entry) => entry.missionId === missionId);
  return queued ? { plan: queued, isCurrent: false } : null;
}

export function findPlanByMissionId(missionId: string): ExecutionPlan | null {
  return findPlanSlot(missionId)?.plan ?? null;
}

function writePlanBack(missionId: string, next: ExecutionPlan): void {
  if (state.currentPlan?.missionId === missionId) {
    state.currentPlan = next;
  }
  state.executionQueue = state.executionQueue.map((entry) => (entry.missionId === missionId ? next : entry));
  emitChange();
}

/** Registers a freshly-built plan for a mission as the current plan (and into the queue for
 * later lookup). Bypasses matchScore-based resolvePlanner entirely — production callers
 * (ensureExecutionProposal) already know deterministically which kind of mission this is
 * (content/tips/generic), so fuzzy goal-text matching would only add a class of bug (wrong
 * planner picked) that a direct call can't have. */
export function registerPlan(plan: ExecutionPlan): void {
  setCurrentPlan(plan);
}

/** Best-effort, never-throws step update by (missionId, stepId) — the shape every real
 * engine (content/tips/execution/apply) calls into as it makes real progress. Returns null
 * (not an error) if the plan is gone (e.g. a very old mission whose plan aged out of the
 * capped executionQueue) — callers must never let a missing plan block real work. */
export function updatePlanStepById(
  missionId: string,
  stepId: string,
  patch: Partial<ExecutionPlanStep>,
): ExecutionPlan | null {
  const slot = findPlanSlot(missionId);
  if (!slot) return null;

  const withTimestamps: Partial<ExecutionPlanStep> = { ...patch };
  if (patch.status === "running" && !patch.startedAt) withTimestamps.startedAt = new Date().toISOString();
  if ((patch.status === "completed" || patch.status === "failed") && !patch.completedAt) {
    withTimestamps.completedAt = new Date().toISOString();
  }

  const next = patchExecutionPlanStep(slot.plan, stepId, withTimestamps);
  writePlanBack(missionId, next);
  return next;
}

/** Convenience for engines (content/tips/execution/apply) that know which *kind* of step
 * they're doing right now but don't want to hardcode/recompute the generated step id
 * (`step-<order>-<kind>`). Finds the first step of that kind in the mission's plan and
 * patches it. Best-effort, same null-if-plan-gone contract as updatePlanStepById. */
export function updatePlanStepByKind(
  missionId: string,
  kind: ExecutionPlanStep["kind"],
  patch: Partial<ExecutionPlanStep>,
): ExecutionPlan | null {
  const slot = findPlanSlot(missionId);
  if (!slot) return null;

  const step = slot.plan.steps.find((entry) => entry.kind === kind);
  if (!step) return slot.plan;

  return updatePlanStepById(missionId, step.id, patch);
}

export function updatePlanStatusById(missionId: string, patch: Partial<ExecutionPlan>): ExecutionPlan | null {
  const slot = findPlanSlot(missionId);
  if (!slot) return null;

  const next = patchExecutionPlan(slot.plan, patch);
  writePlanBack(missionId, next);
  return next;
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
