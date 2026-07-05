export type DiagnosticStatus = "healthy" | "degraded" | "offline" | "placeholder";

export type StartupIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  context?: Record<string, unknown>;
  detectedAt?: string;
};

export type RegisteredModuleInfo = {
  id: string;
  name: string;
  version: string;
};

export type RegisteredEntityTypeInfo = {
  typeId: string;
  label: string;
  moduleId?: string;
};

export type RegisteredTaskInfo = {
  task: string;
  taskName?: string;
  label: string;
  agentId: string;
};

export type RegisteredWorkflowInfo = {
  id: string;
  label: string;
  version: string;
  stepCount: number;
};

export type RegisteredProviderInfo = {
  id: string;
  label: string;
  vendor?: string;
};

export type LiveProviderHealthInfo = {
  id: string;
  label: string;
  available: boolean;
  latencyMs: number;
  message?: string;
  transportMode: "mock" | "live";
  hasApiKey: boolean;
  modelCount: number;
  models: string[];
  capabilities: {
    textGeneration: boolean;
    structuredOutput: boolean;
    imageGeneration: boolean;
    streaming: boolean;
  };
};

export type PublishingHandlerInfo = {
  id: string;
  kind: "task-handler" | "publishing-agent";
  label: string;
};

export type AtlasDiagnosticsSnapshot = {
  collectedAt: string;
  atlasVersion: string;
  atlasBuild: string;
  modules: RegisteredModuleInfo[];
  entityTypes: RegisteredEntityTypeInfo[];
  aiTasks: RegisteredTaskInfo[];
  workflows: RegisteredWorkflowInfo[];
  providers: RegisteredProviderInfo[];
  publishingHandlers: PublishingHandlerInfo[];
  entityCount: number;
  memoryEntryCount: number;
  cacheEntryCount: number;
  startupIssues: StartupIssue[];
  liveProviders: LiveProviderHealthInfo[];
};

export type AtlasHealthCheckResult = {
  label: string;
  ok: boolean;
  detail?: string;
};

export type AtlasSubsystemHealth = {
  id: string;
  title: string;
  status: DiagnosticStatus;
  version: string;
  registeredServices: string[];
  moduleCount?: number;
  detail?: string;
};

export type AtlasHealthSnapshot = {
  collectedAt: string;
  atlasVersion: string;
  atlasBuild: string;
  environment: string;
  subsystems: AtlasSubsystemHealth[];
  startupIssues: StartupIssue[];
  checks: AtlasHealthCheckResult[];
  liveProviders: LiveProviderHealthInfo[];
};
