import type { AiTaskName } from "@/atlas/ai/types";
import type { ContextSnapshot } from "@/atlas/brain/context";
import type { AtlasEntity } from "@/atlas/entity/core/types";
import type { ExecutionPlan } from "@/atlas/brain/planner/planner.types";
import type { PublicationDraft } from "@/atlas/publishing/types";

export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed";

export type WorkflowStepId =
  | "create-entity"
  | "intelligence-scan"
  | "research"
  | "copywriter-draft"
  | "visual-plan"
  | "fact-check"
  | "link-engine"
  | "quality-score"
  | "review-draft"
  | "ready-to-publish";

export type ProofOfPowerContentType =
  | "Knowledge Bite"
  | "Recipe"
  | "Technique"
  | "Ingredient Guide";

export type ProofOfPowerInput = {
  topic: string;
  moduleId: string;
  moduleLabel: string;
  contentType: ProofOfPowerContentType;
  language: string;
};

export type WorkflowStepDefinition = {
  id: WorkflowStepId;
  label: string;
  description: string;
  system: "entity" | "intelligence" | "orchestrator";
  taskName?: AiTaskName;
  agentId?: string;
};

export type WorkflowStep = WorkflowStepDefinition & {
  status: WorkflowStepStatus;
  startedAt?: string;
  completedAt?: string;
  message?: string;
  error?: string;
};

export type ProofOfPowerVisualPlanItem = {
  id: string;
  role: string;
  label: string;
  prompt: string;
};

export type ProofOfPowerMockContent = {
  title: string;
  summary: string;
  body: string;
  relations: string[];
  visualPlan: ProofOfPowerVisualPlanItem[];
  qualityScore: number;
  factCheckPassed: boolean;
  publishingStatus: "ready_for_review";
  factCheckNotes: string;
};

export type ProofOfPowerResult = {
  runId: string;
  input: ProofOfPowerInput;
  executionPlan: ExecutionPlan;
  contextSnapshot: ContextSnapshot;
  steps: WorkflowStep[];
  entity: AtlasEntity;
  draft: PublicationDraft;
  mockContent: ProofOfPowerMockContent;
  intelligenceInsightCount: number;
  startedAt: string;
  completedAt: string;
};

export type WorkflowProgressCallback = (steps: WorkflowStep[]) => void;
