export type CommandCenterStatus = "healthy" | "warning" | "offline" | "planned" | "mock";

export type CommandCenterSummary = {
  atlasHealth: string;
  activeProviders: number;
  runningWorkflows: number;
  qualityScore: number;
  drafts: number;
  alerts: number;
};

export type CommandCenterProviderRow = {
  id: string;
  label: string;
  configuration: string;
  status: CommandCenterStatus;
  latencyMs?: number;
};

export type CommandCenterWorkflowRow = {
  id: string;
  label: string;
  status: CommandCenterStatus;
  detail?: string;
};

export type CommandCenterRecentTask = {
  id: string;
  task: string;
  taskName?: string;
  providerId?: string;
  modelId?: string;
  success?: boolean;
  occurredAt: string;
};

export type CommandCenterAlert = {
  id: string;
  level: "info" | "warning" | "critical";
  message: string;
};

export type CommandCenterModuleRow = {
  id: string;
  name: string;
  active: boolean;
  version?: string;
  status: CommandCenterStatus;
};

export type CommandCenterQualityView = {
  averageScore: number;
  openIssues: number;
  contentGaps: number;
  gapTopics: string[];
};

export type CommandCenterPublishingView = {
  draft: number;
  review: number;
  published: number;
  archived: number;
};

export type CommandCenterSnapshot = {
  collectedAt: string;
  summary: CommandCenterSummary;
  providers: CommandCenterProviderRow[];
  workflows: CommandCenterWorkflowRow[];
  recentTasks: CommandCenterRecentTask[];
  alerts: CommandCenterAlert[];
  modules: CommandCenterModuleRow[];
  quality: CommandCenterQualityView;
  publishing: CommandCenterPublishingView;
};
