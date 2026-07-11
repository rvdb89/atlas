export type ExecutionPlanStatus =
  | "draft"
  | "ready"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

export type ExecutionPlanStepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export type ExecutionPlanStepKind =
  | "entity"
  | "intelligence"
  | "research"
  | "copywriter"
  | "visual"
  | "fact-check"
  | "link-engine"
  | "quality"
  | "review"
  | "publish"
  // Context/Planner integration (2026-07-11) · The original 10 kinds above were all shaped
  // for the content-publishing pipeline (see planners/defaultPlanners.ts) — there was no step
  // kind that could represent what the *majority* of Atlas' real autonomous work actually is:
  // a self-review/engineering mission drafted by the Execution Engine and applied to the
  // working tree. These four close that gap:
  | "context-gather" // Execution Engine's discoverLikelyExistingPaths + real file reads
  | "implement" // the actual mission.implement Claude call that drafts a code change
  | "approval-gate" // explicit, visible pause for the human CEO Inbox Approve click — a plan
  // is never allowed to silently skip past this into "apply"
  | "apply" // Apply Engine writing proposed-changes/ into the real working tree
  | "validate"; // post-apply typecheck + test suite (EXEC-002/EXEC-003)

export type ExecutionPlanPriority = "low" | "normal" | "high" | "critical";

export type ExecutionPlanStep = {
  id: string;
  order: number;
  kind: ExecutionPlanStepKind;
  label: string;
  description: string;
  status: ExecutionPlanStepStatus;
  estimatedDurationMs: number;
  requiredProviders: string[];
  requiredAgents: string[];
  requiredKnowledge: string[];
  workflowStepId?: string;
  startedAt?: string;
  completedAt?: string;
};

export type ExecutionPlan = {
  id: string;
  goal: string;
  plannerId: string;
  /** Context/Planner integration (2026-07-11) · Missing before: a plan had no durable
   * handle back to the mission it belongs to, only a free-text goal. That's fine while a
   * plan is "current", but the approve→apply gap can span multiple runtime cycles (the CEO
   * might not click Approve for hours) — by then a newer mission's plan has long since
   * replaced it as `currentPlan`. missionId lets applyEngine.ts find *this exact* plan again
   * later, out of the execution queue, instead of only ever being able to update whatever
   * plan happens to be current right now. */
  missionId?: string;
  steps: ExecutionPlanStep[];
  priority: ExecutionPlanPriority;
  estimatedDurationMs: number;
  requiredProviders: string[];
  requiredAgents: string[];
  requiredKnowledge: string[];
  status: ExecutionPlanStatus;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
};

export type PlanningContext = {
  currentModule: {
    id: string;
    label: string;
  };
  currentUser: {
    id: string;
    label: string;
  };
  currentWorkspace: string;
  availableProviders: string[];
  availableAgents: string[];
  knowledgeAvailable: string[];
  language: string;
  environment: string;
  contentType?: string;
  topic?: string;
};

export type PlanningRequest = {
  goal: string;
  context: PlanningContext;
  priority?: ExecutionPlanPriority;
};

export type PlanningResult = {
  ok: boolean;
  plan?: ExecutionPlan;
  plannerId?: string;
  message?: string;
};

export type AtlasPlanner = {
  id: string;
  label: string;
  description: string;
  /** Higher score wins when multiple planners match. */
  matchScore: (goal: string, context: PlanningContext) => number;
  createPlan: (goal: string, context: PlanningContext) => ExecutionPlan;
};

export type PlannerSnapshot = {
  currentPlan: ExecutionPlan | null;
  executionQueue: ExecutionPlan[];
  plannerStatus: "idle" | "planning" | "executing" | "completed" | "failed";
  nextStep: ExecutionPlanStep | null;
};
