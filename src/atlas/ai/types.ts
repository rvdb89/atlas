import type { CoreAgentId } from "@/atlas/publishing/plugin/types";

/** Canonical Atlas AI task identifiers — extensible without breaking callers. */
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
  | "quality.score";

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
  /** When true, output must parse as JSON. */
  json?: boolean;
  /** Minimum content length for text/markdown outputs. */
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
};

export type TaskRoutingDecision = {
  task: AtlasTaskType;
  agentId?: CoreAgentId;
  primaryProviderId: string;
  fallbackProviderIds: string[];
  providerChain: string[];
  promptId: string;
  settings: AiTaskSettings;
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
  providerId: string;
  promptId: string;
  promptVersion: string;
  attemptedProviderIds: string[];
  usedFallback: boolean;
  cacheHit: boolean;
  durationMs: number;
  validation: ValidationResult;
  output: T;
  warnings: string[];
  metadata?: Record<string, unknown>;
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
