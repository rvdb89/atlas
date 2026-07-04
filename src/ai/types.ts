/** @deprecated Import from @/atlas/publishing/types */
export type {
  AgentResult,
  ArticleCatalogEntry,
  BulkGenerationRequest,
  ContentType,
  DomainValidationReport,
  GenerationBrief,
  LinkGraph,
  PipelineStage,
  PublicationDraft,
  QualityIssue,
  QualityReport,
  ReviewStatus,
  SupportedLocale,
  TranslationBundle,
  ValidationDeviation,
  ValidationSubscores,
  ValidationSuggestion,
  VisualAssetBrief,
} from "@/atlas/publishing/types";

export { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/atlas/publishing/types";

export type BakingReport = import("@/atlas/publishing/types").DomainValidationReport;
export type BakingSubscores = import("@/atlas/publishing/types").ValidationSubscores;
export type BakingDeviation = import("@/atlas/publishing/types").ValidationDeviation;
export type BakcoachSuggestion = import("@/atlas/publishing/types").ValidationSuggestion;

export type LegacyPublicationDraft = PublicationDraft & {
  knowledge?: unknown;
  bakingReport?: DomainValidationReport;
};

import type { DomainValidationReport, PublicationDraft } from "@/atlas/publishing/types";

export function getValidationReport(
  draft: PublicationDraft | LegacyPublicationDraft,
): DomainValidationReport | undefined {
  return draft.validationReport ?? (draft as LegacyPublicationDraft).bakingReport;
}

export function getContentPayload(draft: PublicationDraft | LegacyPublicationDraft): unknown {
  return draft.contentPayload ?? (draft as LegacyPublicationDraft).knowledge;
}
