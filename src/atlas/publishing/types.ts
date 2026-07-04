/** Generic editorial content types — domains extend via plugin, never hardcode domain vocabulary. */
export type ContentType =
  | "article"
  | "recipe"
  | "technique"
  | "ingredient"
  | "science"
  | "guide"
  | "tip";

export type PipelineStage =
  | "queued"
  | "research"
  | "copywriting"
  | "visual_design"
  | "fact_checking"
  | "linking"
  | "domain_validation"
  | "quality_scoring"
  | "ready_for_review"
  | "published"
  | "failed";

export type ReviewStatus = "draft" | "in_review" | "approved" | "rejected" | "published";

export type SupportedLocale = "nl" | "en" | "de" | "fr" | "es" | "it";

export const DEFAULT_LOCALE: SupportedLocale = "nl";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["nl", "en", "de", "fr", "es", "it"];

export type GenerationBrief = {
  id: string;
  topic: string;
  contentType: ContentType;
  categoryId?: string;
  locale?: SupportedLocale;
  keywords?: string[];
  slugHint?: string;
};

export type BulkGenerationRequest = {
  id: string;
  label: string;
  contentType: ContentType;
  categoryId: string;
  topics: string[];
  locale?: SupportedLocale;
};

export type QualitySeverity = "critical" | "warning" | "suggestion";

export type QualityIssue = {
  id: string;
  severity: QualitySeverity;
  category:
    | "accuracy"
    | "consistency"
    | "units"
    | "style"
    | "links"
    | "seo"
    | "completeness"
    | "grammar";
  message: string;
  field?: string;
};

export type QualityReport = {
  score: number;
  passed: boolean;
  issues: QualityIssue[];
  checkedAt: string;
};

export type ValidationSubscores = {
  accuracy: number;
  technicalAccuracy: number;
  accessibility: number;
  consistency: number;
  clarity: number;
};

export type ValidationDeviation = {
  id: string;
  severity: QualitySeverity;
  category: string;
  message: string;
  field?: string;
};

export type ValidationSuggestion = {
  id: string;
  message: string;
  priority: "high" | "medium" | "low";
};

/** Domain validator output — Test Kitchen, lab review, QA bench, etc. */
export type DomainValidationReport = {
  overallScore: number;
  subscores: ValidationSubscores;
  passed: boolean;
  deviations: ValidationDeviation[];
  suggestions: ValidationSuggestion[];
  checkedAt: string;
  standardsVersion: string;
};

export type VisualAssetRole =
  | "hero"
  | "gallery"
  | "ingredient"
  | "detail"
  | "comparison"
  | "diagram"
  | "infographic"
  | "step";

export type VisualAssetStatus = "pending" | "generating" | "generated" | "approved" | "rejected";

export type VisualAssetBrief = {
  id: string;
  role: VisualAssetRole;
  label: string;
  prompt: string;
  alt: string;
  aspectRatio: "16:9" | "4:3" | "1:1" | "3:4";
  status: VisualAssetStatus;
  uri?: string;
};

export type LinkGraphNode = {
  slug: string;
  title: string;
  score: number;
  reason: string;
};

export type LinkGraph = {
  nodes: LinkGraphNode[];
  generatedAt: string;
};

export type TranslationBundle = Partial<
  Record<SupportedLocale, { status: "pending" | "ready"; title?: string; summary?: string }>
>;

/** Generic catalog entry for internal linking — shape is domain-defined. */
export type ArticleCatalogEntry = {
  slug: string;
  title: string;
  categoryId?: string;
  tags?: string[];
  relationTags?: string[];
  [key: string]: unknown;
};

/** Canonical draft produced by the publishing pipeline. */
export type PublicationDraft = {
  id: string;
  brief: GenerationBrief;
  reviewStatus: ReviewStatus;
  pipelineStage: PipelineStage;
  contentType: ContentType;
  locale: SupportedLocale;
  title: string;
  subtitle: string;
  slug: string;
  /** Domain-specific structured content (Knowledge Bite, recipe article, etc.). */
  contentPayload?: unknown;
  visuals: VisualAssetBrief[];
  qualityReport?: QualityReport;
  validationReport?: DomainValidationReport;
  linkGraph?: LinkGraph;
  translations: TranslationBundle;
  seo: {
    title: string;
    description: string;
    tags: string[];
  };
  editorNotes: string;
  createdAt: string;
  updatedAt: string;
  pipelineLog: string[];
};

export type AgentResult<T> = {
  agent: string;
  durationMs: number;
  output: T;
  warnings: string[];
};
