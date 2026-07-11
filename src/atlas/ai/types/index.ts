import type { CoreAgentId } from "@/atlas/publishing/plugin/types";

/** Internal canonical task ids — stable, dot-notation identifiers. */
export type AtlasTaskType =
  | "knowledge.write"
  | "knowledge.review"
  | "recipe.write"
  | "recipe.review"
  | "recipe.validate"
  | "visual.generate"
  | "visual.diagram"
  | "visual.infographic"
  | "research.search"
  | "research.summarize"
  | "fact.check"
  | "translate"
  | "seo.optimize"
  | "link.build"
  | "quality.score"
  | "writing.improve"
  | "prompt.generate"
  | "quiz.create"
  | "mission.decide"
  | "mission.implement"
  | "tips.write";

/** Public task names — callers request tasks, never models. */
export type AiTaskName =
  | "GenerateKnowledgeArticle"
  | "GenerateRecipe"
  | "GenerateVisual"
  | "TranslateArticle"
  | "FactCheck"
  | "ReviewContent"
  | "Summarize"
  | "GenerateSEO"
  | "ResearchTopic"
  | "CreateQuiz"
  | "ImproveWriting"
  | "GenerateDiagram"
  | "GeneratePrompt"
  | "GenerateInfographic"
  | "ValidateRecipe"
  | "BuildLinks"
  | "ScoreQuality";

export const TASK_NAME_TO_TYPE: Record<AiTaskName, AtlasTaskType> = {
  GenerateKnowledgeArticle: "knowledge.write",
  GenerateRecipe: "recipe.write",
  GenerateVisual: "visual.generate",
  TranslateArticle: "translate",
  FactCheck: "fact.check",
  ReviewContent: "knowledge.review",
  Summarize: "research.summarize",
  GenerateSEO: "seo.optimize",
  ResearchTopic: "research.search",
  CreateQuiz: "quiz.create",
  ImproveWriting: "writing.improve",
  GenerateDiagram: "visual.diagram",
  GeneratePrompt: "prompt.generate",
  GenerateInfographic: "visual.infographic",
  ValidateRecipe: "recipe.validate",
  BuildLinks: "link.build",
  ScoreQuality: "quality.score",
};

export const TASK_TYPE_TO_NAME: Partial<Record<AtlasTaskType, AiTaskName>> = Object.fromEntries(
  Object.entries(TASK_NAME_TO_TYPE).map(([name, type]) => [type, name]),
) as Partial<Record<AtlasTaskType, AiTaskName>>;

export function resolveTaskName(taskName: AiTaskName): AtlasTaskType {
  return TASK_NAME_TO_TYPE[taskName];
}

export function resolveTaskTypeName(task: AtlasTaskType): AiTaskName | undefined {
  return TASK_TYPE_TO_NAME[task];
}

export type AtlasOutputKind =
  | "text"
  | "json"
  | "markdown"
  | "image"
  | "research"
  | "translation"
  | "validation"
  | "score";

export type AiTaskSettings = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  locale?: string;
  retries?: number;
  timeoutMs?: number;
  providerId?: string;
};

export type JsonSchemaField = {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  description?: string;
};

export type OutputSchema = {
  kind: AtlasOutputKind;
  fields?: JsonSchemaField[];
  json?: boolean;
  minLength?: number;
};

export type PromptDefinition = {
  id: string;
  version: string;
  category: string;
  description: string;
  inputSchema: JsonSchemaField[];
  outputSchema: OutputSchema;
  system: string;
  userTemplate: string;
};

export type ResolvedPrompt = PromptDefinition & {
  systemRendered: string;
  userRendered: string;
};

export type ExecuteTaskInput<TPayload = unknown> = {
  task: AtlasTaskType;
  payload: TPayload;
  agentId?: CoreAgentId;
  moduleId?: string;
  locale?: string;
  settings?: AiTaskSettings;
  skipCache?: boolean;
  skipValidation?: boolean;
  skipTelemetry?: boolean;
  skipPolicy?: boolean;
};

export type ExecuteNamedTaskInput<TPayload = unknown> = Omit<ExecuteTaskInput<TPayload>, "task"> & {
  taskName: AiTaskName;
};

export type TaskRoutingDecision = {
  task: AtlasTaskType;
  taskName?: AiTaskName;
  agentId?: CoreAgentId;
  primaryModelId: string;
  primaryProviderId?: string;
  fallbackModelIds: string[];
  providerChain: string[];
  promptId: string;
  settings: AiTaskSettings;
  loadBalanced?: boolean;
};

export type ValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
  field?: string;
};

export type ValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

export type AiTaskExecutionResult<T = unknown> = {
  task: AtlasTaskType;
  taskName?: AiTaskName;
  providerId: string;
  promptId: string;
  promptVersion: string;
  attemptedProviderIds: string[];
  usedFallback: boolean;
  cacheHit: boolean;
  retryCount: number;
  durationMs: number;
  validation: ValidationResult;
  output: T;
  warnings: string[];
  metadata?: Record<string, unknown>;
  telemetryId?: string;
};

export type MemoryEntry = {
  key: string;
  scope: "global" | "module" | "agent";
  moduleId?: string;
  agentId?: CoreAgentId;
  value: unknown;
  updatedAt: string;
};

export type CacheEntry<T = unknown> = {
  key: string;
  task: AtlasTaskType;
  output: T;
  createdAt: string;
  expiresAt?: string;
};
