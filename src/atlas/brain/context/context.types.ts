import type { ExecutionPlan } from "@/atlas/brain/planner/planner.types";

export type ContextSourceId =
  | "goal"
  | "planner"
  | "memory"
  | "module"
  | "workspace"
  | "workflow"
  | "user"
  | "entity"
  | "providers"
  | "environment";

export type ContextMemoryRef = {
  id: string;
  title: string;
  type: string;
  score: number;
};

export type ContextEntityRef = {
  id: string;
  label: string;
  domain?: string;
  entityType?: string;
  score: number;
};

export type ContextKnowledgeRef = {
  id: string;
  label: string;
  source: string;
  score: number;
};

export type ContextWorkflowRef = {
  id: string;
  label: string;
  score: number;
};

export type ContextModuleRef = {
  id: string;
  label: string;
};

export type ContextUserRef = {
  id: string;
  label: string;
};

export type ContextProviderRef = {
  id: string;
  label: string;
  score: number;
};

export type ContextEnvironment = {
  workspace: string;
  environment: string;
  language: string;
};

export type ContextBuildInput = {
  goal: string;
  executionPlan?: ExecutionPlan | null;
  topic?: string;
  workflowId?: string;
  moduleId?: string;
  moduleLabel?: string;
  userId?: string;
  userLabel?: string;
  workspace?: string;
  language?: string;
  environment?: string;
  entityIds?: string[];
};

export type ContextBundle = {
  goal: string;
  module: ContextModuleRef;
  user: ContextUserRef;
  workspace: string;
  environment: ContextEnvironment;
  workflow: ContextWorkflowRef | null;
  plannerOutput: ExecutionPlan | null;
  memories: ContextMemoryRef[];
  entities: ContextEntityRef[];
  knowledge: ContextKnowledgeRef[];
  workflows: ContextWorkflowRef[];
  providers: ContextProviderRef[];
  sources: ContextSourceId[];
  builtAt: string;
};

export type ContextSnapshot = {
  goal: string;
  relevantMemories: ContextMemoryRef[];
  relevantEntities: ContextEntityRef[];
  relevantKnowledge: ContextKnowledgeRef[];
  relevantWorkflows: ContextWorkflowRef[];
  currentLanguage: string;
  currentModule: ContextModuleRef;
  currentUser: ContextUserRef;
  workspace: string;
  environment: string;
  plannerOutput: ExecutionPlan | null;
  loadedProviders: ContextProviderRef[];
  health: "healthy" | "partial" | "empty";
  timestamp: string;
};

export type ContextFilter = {
  minScore?: number;
  sourceIds?: ContextSourceId[];
  maxMemories?: number;
  maxEntities?: number;
  maxKnowledge?: number;
  maxWorkflows?: number;
  maxProviders?: number;
};

export type ContextScoreInput = {
  goal: string;
  topic?: string;
  tags?: string[];
  text?: string;
  importance?: number;
};

export type ContextProvider = {
  id: string;
  label: string;
  description: string;
  sourceIds: ContextSourceId[];
  contribute: (input: ContextBuildInput, partial: Partial<ContextBundle>) => Partial<ContextBundle>;
};

export type ContextOperationResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

export type ContextHealthSnapshot = {
  health: ContextSnapshot["health"];
  goal: string;
  memoryCount: number;
  entityCount: number;
  providerCount: number;
  moduleLabel: string;
  plannerStatus: string;
};
