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
  | "publish";

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
