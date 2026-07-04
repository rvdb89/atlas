import type { AtlasEntity } from "@/atlas/entity/core/types";
import type { AiTaskName } from "@/atlas/ai/types";
import type { IntelligenceRunResult } from "@/atlas/intelligence/types";
import type { PublicationDraft } from "@/atlas/publishing/types";

export type StudioModuleInfo = {
  id: string;
  name: string;
  mission?: string;
};

export type StudioDashboardStats = {
  entities: number;
  drafts: number;
  published: number;
  aiTasks: number;
  qualityIssues: number;
  contentGaps: number;
  assets: number;
  activeModules: number;
};

export type StudioEntityListItem = Pick<
  AtlasEntity,
  "id" | "slug" | "title" | "entityType" | "domain" | "category" | "status" | "updatedAt"
> & {
  qualityScore?: number;
};

export type StudioAssetItem = {
  id: string;
  role: string;
  label: string;
  kind: "hero" | "diagram" | "gallery" | "visual" | "other";
  status: string;
  sourceTitle: string;
  prompt?: string;
};

export type StudioAiTaskForm = {
  taskName: AiTaskName;
  moduleId: string;
  targetEntityId?: string;
  context: string;
};

export type StudioAiMockResult = {
  id: string;
  taskName: AiTaskName;
  agentLabel: string;
  modelLabel: string;
  outputPreview: string;
  generatedAt: string;
};

export type StudioSettings = {
  activeModuleId: string;
  providerStrategy: "balanced" | "quality" | "speed" | "cost";
  language: string;
  qualityThreshold: number;
  offlineMode: boolean;
};

export type StudioIntelligenceView = {
  run?: IntelligenceRunResult;
  contentGaps: Array<{ topic: string; priority: string }>;
  trends: Array<{ metricId: string; direction: string; changePercent: number }>;
  recommendations: Array<{ title: string; priority: string }>;
  qualityWarnings: string[];
};

export type StudioPublishingStage = "draft" | "review" | "published" | "archived";

export type StudioPublishingItem = {
  id: string;
  title: string;
  stage: StudioPublishingStage;
  updatedAt: string;
  draft?: PublicationDraft;
};
