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

/**
 * Sprint 1.2 — Anna & Yara. The six existing pipeline capabilities that the Publishing Pipeline
 * can report lifecycle events for. Deliberately a plain, local union (not imported from
 * plugin/types.ts's CoreAgentId) to avoid a circular import between this file and plugin/
 * types.ts, and because this list is intentionally narrower — it excludes "branch-director",
 * which the pipeline never calls as a capability. Mirrors the same precedent already set by
 * TeamIdentityResolver.ts's EXISTING_ID_TO_TEAM_IDENTITY table (Sprint 1.1), which also stays
 * decoupled from CoreAgentId on purpose.
 */
export type PublishingCapabilityId =
  | "copywriter"
  | "visual-designer"
  | "fact-checker"
  | "link-engine"
  | "translator"
  | "domain-validator";

/** Shared fields on every capability lifecycle event the Publishing Pipeline reports. */
export type CapabilityLifecycleEvent = {
  capabilityId: PublishingCapabilityId;
  /** Caller-supplied reference to the work item this event is about — e.g. a mission+article
   * key. Optional: callers that don't need attribution (e.g. the studio/demo path, which does
   * not pass an attributionReporter in this sprint) never need to construct one. */
  workItemRef?: string;
  occurredAt: string;
};

export type CapabilityConfirmedEvent = CapabilityLifecycleEvent & {
  description: string;
};

export type CapabilityFailedEvent = CapabilityLifecycleEvent & {
  reason: string;
};

/**
 * Sprint 1.2 — Anna & Yara. The Publishing Pipeline's only knowledge of "attribution": a small,
 * generic callback contract with no knowledge of Executive Memory or TeamAttribution. Every
 * method is optional; a caller that doesn't pass a reporter (or a reporter that omits a method)
 * gets a silent no-op. The pipeline calls these three methods and nothing else — what happens
 * next (if anything) is entirely the implementer's decision. See
 * src/atlas/team/PublishingAttributionReporter.ts for the concrete implementation that bridges
 * this contract to TeamAttribution + Executive Memory.
 */
export interface TeamAttributionReporter {
  /** Called right before a capability's underlying AI call is dispatched. Note: TeamAttribution
   * (Sprint 1.1) only ever persists "confirmed"/"failed" — there is deliberately no "started"
   * status in Executive Memory, so implementers are not expected to persist this event. */
  onCapabilityStarted?(event: CapabilityLifecycleEvent): void | Promise<void>;
  /** Called after a capability's underlying AI call returns normally (no thrown error). */
  onCapabilityConfirmed?(event: CapabilityConfirmedEvent): void | Promise<void>;
  /** Called when a capability's underlying AI call throws. Never suppresses or replaces the
   * original error — the pipeline always rethrows it unchanged after reporting. */
  onCapabilityFailed?(event: CapabilityFailedEvent): void | Promise<void>;
}
