import type {
  AgentResult,
  ArticleCatalogEntry,
  ContentType,
  DomainValidationReport,
  GenerationBrief,
  PublicationDraft,
  VisualAssetBrief,
} from "../types";
import type { ModelProfile } from "@/atlas/ai/models/types";
import type { TaskRouteConfig } from "@/atlas/ai/tasks/routes";

/** Stable agent ids in the Atlas publishing engine. */
export type CoreAgentId =
  | "copywriter"
  | "visual-designer"
  | "fact-checker"
  | "link-engine"
  | "translator"
  | "domain-validator";

export type TeamMember = {
  id: CoreAgentId;
  emoji: string;
  name: string;
  role: string;
  tagline: string;
  responsibilities: string[];
  serviceIds: string[];
};

export type EditorInChief = {
  emoji: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
};

export type CategoryPreset = {
  categoryId: string;
  label: string;
  contentType: ContentType;
  topics: string[];
};

export type CopywriterOutput = {
  title: string;
  subtitle: string;
  slug: string;
  contentPayload?: unknown;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
};

export type ModuleAgents = {
  copywriter: {
    id: string;
    generate(brief: GenerationBrief): Promise<AgentResult<CopywriterOutput>>;
  };
  visualDesigner: {
    id: string;
    generateAssets(input: {
      brief: GenerationBrief;
      title: string;
      slug: string;
      contentType: ContentType;
    }): Promise<AgentResult<VisualAssetBrief[]>>;
  };
  domainValidator: {
    id: string;
    validate(input: { draft: PublicationDraft }): Promise<AgentResult<DomainValidationReport>>;
  };
};

export type PublishGateResult = {
  allowed: boolean;
  message?: string;
};

export type ModuleStats = {
  averageValidationScore: number;
  validationPassedCount: number;
};

/**
 * Atlas vertical module — domain vocabulary, catalog, standards, and agent implementations.
 * AI team personas live in @/atlas/agents/team (platform-level).
 */
export type AtlasModule = {
  id: string;
  name: string;
  version: string;
  mission: string;
  agents: ModuleAgents;
  getArticleCatalog(): ArticleCatalogEntry[];
  importGeneratedContent(payload: unknown): unknown;
  mergeContentRelations(payload: unknown, relatedSlugs: string[]): unknown;
  defaultLinkCategoryId: string;
  resolveRelatedSlugs(
    source: ArticleCatalogEntry,
    catalog: ArticleCatalogEntry[],
  ): string[];
  categoryPresets: Record<string, CategoryPreset>;
  additionalModelProfiles?: Record<string, ModelProfile>;
  domainValidationRoute?: Pick<TaskRouteConfig, "primaryModelId" | "fallbackModelIds">;
  validationPassThreshold?: number;
  isPublishAllowed(draft: PublicationDraft): PublishGateResult;
  getModuleStats(drafts: PublicationDraft[]): ModuleStats;
};

/** @deprecated Use AtlasModule */
export type DomainPlugin = AtlasModule;

/** @deprecated Use ModuleAgents */
export type DomainAgents = ModuleAgents;

/** @deprecated Use ModuleStats */
export type DomainStats = ModuleStats;
