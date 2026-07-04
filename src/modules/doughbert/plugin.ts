import type { AtlasModule } from "@/atlas/publishing/plugin/types";
import type { ModelProfile } from "@/atlas/ai/models/types";
import type { ArticleCatalogEntry, PublicationDraft } from "@/atlas/publishing/types";
import { collectKnowledgeArticleInputs } from "@/modules/doughbert/knowledge/collectSources";
import { bulkImportArticles } from "@/modules/doughbert/knowledge/import/bulkImport";
import {
  mergeRelatedKnowledge,
  resolveAutomaticRelatedKnowledge,
} from "@/modules/doughbert/knowledge/import/relationResolver";
import type { KnowledgeArticleInput } from "@/modules/doughbert/types/knowledgeArticleInput";

import { doughbertCopywriterAgent } from "./agents/copywriter/CopywriterAgent";
import { doughbertDomainValidatorAgent } from "./agents/domain-validator/DomainValidatorAgent";
import { doughbertVisualDesignerAgent } from "./agents/visual-designer/VisualDesignerAgent";
import { DOUGHBERT_CATEGORY_PRESETS } from "./studio/categoryPresets";

const DOUGHBERT_MODEL_PROFILES: Record<string, ModelProfile> = {
  "doughbert-ensemble": {
    id: "doughbert-ensemble",
    providerId: "stub",
    name: "Doughbert Ensemble",
    vendor: "Doughbert",
    strengths: ["Hydratatie", "Fermentatie", "Baker's %", "Receptvalidatie", "Multi-model consensus"],
    costTier: "medium",
    speedTier: "balanced",
    qualityTier: "best",
    latencyMs: 3500,
    contextWindow: 128_000,
    supportedLanguages: ["nl", "en"],
    supportedOutputs: ["validation", "score"],
    supportedMedia: ["text"],
    available: true,
  },
};

function toCatalogEntry(article: KnowledgeArticleInput): ArticleCatalogEntry {
  return {
    ...article,
    slug: article.slug,
    title: article.title,
    categoryId: article.categoryId,
    tags: article.metadata?.tags,
    relationTags: article.relationTags,
  };
}

export const doughbertModule: AtlasModule = {
  id: "doughbert",
  name: "Doughbert",
  version: "1.0.0",
  mission: "Premium thuisbakken — kennis, recepten en techniek.",

  agents: {
    copywriter: doughbertCopywriterAgent,
    visualDesigner: doughbertVisualDesignerAgent,
    domainValidator: doughbertDomainValidatorAgent,
  },

  getArticleCatalog() {
    return collectKnowledgeArticleInputs().map(toCatalogEntry);
  },

  importGeneratedContent(payload: unknown) {
    return bulkImportArticles([payload as KnowledgeArticleInput]).articles[0];
  },

  mergeContentRelations(payload: unknown, relatedSlugs: string[]) {
    const article = payload as KnowledgeArticleInput;
    return {
      ...article,
      metadata: {
        ...article.metadata!,
        relatedKnowledge: mergeRelatedKnowledge(article.metadata?.relatedKnowledge, relatedSlugs),
      },
    };
  },

  resolveRelatedSlugs(source, catalog) {
    return resolveAutomaticRelatedKnowledge(
      source as unknown as KnowledgeArticleInput,
      catalog as unknown as KnowledgeArticleInput[],
    );
  },

  defaultLinkCategoryId: "brood",
  categoryPresets: DOUGHBERT_CATEGORY_PRESETS,
  additionalModelProfiles: DOUGHBERT_MODEL_PROFILES,

  domainValidationRoute: {
    primaryModelId: "doughbert-ensemble",
    fallbackModelIds: ["gemini-pro", "claude-sonnet", "perplexity", "atlas-stub"],
  },

  validationPassThreshold: 75,

  isPublishAllowed(draft: PublicationDraft) {
    if (!draft.validationReport?.passed) {
      return {
        allowed: false,
        message:
          "Test Kitchen: validatiescore te laag of kritieke afwijkingen — Doughbert-standaarden niet gehaald.",
      };
    }
    return { allowed: true };
  },

  getModuleStats(drafts) {
    return {
      averageValidationScore:
        drafts.length === 0
          ? 0
          : Math.round(
              drafts.reduce((sum, d) => sum + (d.validationReport?.overallScore ?? 0), 0) /
                drafts.length,
            ),
      validationPassedCount: drafts.filter((d) => d.validationReport?.passed).length,
    };
  },
};

/** @deprecated Use doughbertModule */
export const doughbertPlugin = doughbertModule;
