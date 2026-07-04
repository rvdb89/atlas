import {
  createBulkRequest,
  runBulkGenerationPipeline,
  runPublishingPipeline,
} from "@/atlas/publishing/pipeline/PublishingPipeline";
import type {
  BulkGenerationRequest,
  GenerationBrief,
  PublicationDraft,
} from "@/atlas/publishing/types";
import { getActiveModule } from "@/atlas/publishing/plugin/registry";
import { toDoughbertBriefInput } from "@/modules/doughbert/studio/categoryPresets";
import { publicationStore } from "@/atlas/studio/store/publicationStore";
import type { KnowledgeBiteCategoryId } from "@/modules/doughbert/types/knowledgeBite";

export type GenerateSingleInput = {
  topic: string;
  contentType: string;
  categoryId?: KnowledgeBiteCategoryId;
  keywords?: string[];
};

export type GenerateCategoryInput = {
  label: string;
  contentType: string;
  categoryId: KnowledgeBiteCategoryId;
  topics: string[];
};

/** Atlas AI Studio service — orchestrates publishing pipeline + review queue. */
export const studioService = {
  async generateSingle(input: GenerateSingleInput): Promise<PublicationDraft> {
    publicationStore.setGenerating(true);

    try {
      const draft = await runPublishingPipeline(toDoughbertBriefInput(input));
      publicationStore.addDraft(draft);
      publicationStore.setGenerating(false);
      return draft;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generatie mislukt";
      publicationStore.setGenerating(false, message);
      throw error;
    }
  },

  async generateCategory(input: GenerateCategoryInput): Promise<PublicationDraft[]> {
    publicationStore.setGenerating(true);

    try {
      const request = createBulkRequest({
        label: input.label,
        contentType: toDoughbertBriefInput({
          topic: input.topics[0] ?? input.label,
          contentType: input.contentType,
          categoryId: input.categoryId,
        }).contentType,
        categoryId: input.categoryId,
        topics: input.topics,
      });
      const drafts = await runBulkGenerationPipeline(request, {
        onStageChange: (_id, stage) => {
          publicationStore.setGenerating(true);
          if (stage === "failed") {
            publicationStore.setGenerating(false, "Pipeline stage failed");
          }
        },
      });

      publicationStore.addDrafts(drafts);
      publicationStore.setGenerating(false);
      return drafts;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bulk generatie mislukt";
      publicationStore.setGenerating(false, message);
      throw error;
    }
  },

  approve(id: string, notes?: string) {
    publicationStore.setReviewStatus(id, "approved", notes);
  },

  reject(id: string, notes?: string) {
    publicationStore.setReviewStatus(id, "rejected", notes);
  },

  publish(id: string) {
    const draft = publicationStore.getDraft(id);
    if (!draft || draft.reviewStatus !== "approved") {
      throw new Error("Alleen goedgekeurde drafts kunnen gepubliceerd worden.");
    }

    const module = getActiveModule();
    const gate = module.isPublishAllowed(draft);
    if (!gate.allowed) {
      throw new Error(gate.message ?? "Module validation failed.");
    }

    if (!draft.qualityReport?.passed) {
      throw new Error(
        "🔬 Proof: redactionele quality score te laag — los eerst de issues op.",
      );
    }

    publicationStore.setReviewStatus(id, "published", draft.editorNotes);
  },

  getStats() {
    const drafts = publicationStore.getState().drafts;
    const module = getActiveModule();
    const stats = module.getModuleStats(drafts);

    return {
      total: drafts.length,
      inReview: drafts.filter((d) => d.reviewStatus === "in_review").length,
      approved: drafts.filter((d) => d.reviewStatus === "approved").length,
      published: drafts.filter((d) => d.reviewStatus === "published").length,
      rejected: drafts.filter((d) => d.reviewStatus === "rejected").length,
      averageQuality:
        drafts.length === 0
          ? 0
          : Math.round(
              drafts.reduce((sum, d) => sum + (d.qualityReport?.score ?? 0), 0) / drafts.length,
            ),
      averageValidationScore: stats.averageValidationScore,
      validationPassedCount: stats.validationPassedCount,
      averageBakingScore: stats.averageValidationScore,
      testKitchenPassed: stats.validationPassedCount,
    };
  },
};

export { DOUGHBERT_CATEGORY_PRESETS as CATEGORY_GENERATION_PRESETS } from "@/modules/doughbert/studio/categoryPresets";
