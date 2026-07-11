import type {
  ExecutionPlan,
  ExecutionPlanPriority,
  ExecutionPlanStatus,
  ExecutionPlanStep,
  ExecutionPlanStepStatus,
} from "./planner.types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function createExecutionPlanId(prefix = "plan"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createExecutionPlanStepId(order: number, kind: string): string {
  return `step-${order}-${kind}`;
}

export function finalizeExecutionPlan(
  draft: Omit<ExecutionPlan, "estimatedDurationMs" | "requiredProviders" | "requiredAgents" | "requiredKnowledge">,
): ExecutionPlan {
  const requiredProviders = unique(draft.steps.flatMap((step) => step.requiredProviders));
  const requiredAgents = unique(draft.steps.flatMap((step) => step.requiredAgents));
  const requiredKnowledge = unique(draft.steps.flatMap((step) => step.requiredKnowledge));
  const estimatedDurationMs = draft.steps.reduce((sum, step) => sum + step.estimatedDurationMs, 0);

  return {
    ...draft,
    requiredProviders,
    requiredAgents,
    requiredKnowledge,
    estimatedDurationMs,
  };
}

export function createExecutionPlanStep(
  input: Omit<ExecutionPlanStep, "id" | "status"> & { id?: string; status?: ExecutionPlanStepStatus },
): ExecutionPlanStep {
  return {
    id: input.id ?? createExecutionPlanStepId(input.order, input.kind),
    status: input.status ?? "pending",
    order: input.order,
    kind: input.kind,
    label: input.label,
    description: input.description,
    estimatedDurationMs: input.estimatedDurationMs,
    requiredProviders: input.requiredProviders,
    requiredAgents: input.requiredAgents,
    requiredKnowledge: input.requiredKnowledge,
    workflowStepId: input.workflowStepId,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
  };
}

export function createExecutionPlan(input: {
  goal: string;
  plannerId: string;
  steps: ExecutionPlanStep[];
  priority?: ExecutionPlanPriority;
  status?: ExecutionPlanStatus;
  missionId?: string;
}): ExecutionPlan {
  const now = new Date().toISOString();

  return finalizeExecutionPlan({
    id: createExecutionPlanId(),
    goal: input.goal,
    plannerId: input.plannerId,
    missionId: input.missionId,
    steps: input.steps,
    priority: input.priority ?? "normal",
    status: input.status ?? "ready",
    createdAt: now,
    updatedAt: now,
  });
}

export function patchExecutionPlanStep(
  plan: ExecutionPlan,
  stepId: string,
  patch: Partial<ExecutionPlanStep>,
): ExecutionPlan {
  return {
    ...plan,
    updatedAt: new Date().toISOString(),
    steps: plan.steps.map((step) => (step.id === stepId ? { ...step, ...patch } : step)),
  };
}

export function patchExecutionPlan(
  plan: ExecutionPlan,
  patch: Partial<ExecutionPlan>,
): ExecutionPlan {
  return {
    ...plan,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}

export function getNextExecutionPlanStep(plan: ExecutionPlan): ExecutionPlanStep | null {
  return plan.steps.find((step) => step.status === "pending" || step.status === "running") ?? null;
}

export function summarizeExecutionPlan(plan: ExecutionPlan): string {
  return plan.steps.map((step) => step.label).join(" → ");
}
