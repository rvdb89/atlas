import { listEntities, getEntityById } from "@/atlas/entity/registry/entityStore";
import { queryEntities } from "@/atlas/entity/queries/QueryEngine";
import { getEntityGraph } from "@/atlas/entity/graph/builder";
import { listPublicTaskNames } from "@/atlas/ai/registry/taskRegistry";
import { summarizeAiTelemetry } from "@/atlas/ai/telemetry/TelemetryStore";
import { ATLAS_AI_TEAM } from "@/atlas/agents/team";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";
import { publicationStore } from "../store/publicationStore";
import { studioSettingsStore } from "../settings/store";
import { loadStudioIntelligence, seedStudioEntities } from "../core/mockData";
import type {
  StudioAssetItem,
  StudioDashboardStats,
  StudioEntityListItem,
  StudioIntelligenceView,
  StudioModuleInfo,
  StudioPublishingItem,
  StudioPublishingStage,
} from "../types";

function mapReviewToStage(reviewStatus: string): StudioPublishingStage {
  if (reviewStatus === "published") return "published";
  if (reviewStatus === "approved") return "review";
  if (reviewStatus === "rejected") return "archived";
  if (reviewStatus === "in_review") return "review";
  return "draft";
}

export const studioDataService = {
  getActiveModule(): StudioModuleInfo | undefined {
    const module = tryGetActiveModule();
    if (!module) return undefined;
    return { id: module.id, name: module.name, mission: module.mission };
  },

  getDashboardStats(): StudioDashboardStats {
    seedStudioEntities();
    const module = tryGetActiveModule();
    const domain = module?.id;
    const entities = listEntities(domain ? { domain } : undefined);
    const drafts = publicationStore.getState().drafts;
    const assets = drafts.flatMap((draft) => draft.visuals);

    const qualityIssues = drafts.reduce(
      (sum, draft) => sum + (draft.qualityReport?.issues?.length ?? 0),
      0,
    );

    return {
      entities: entities.length,
      drafts: drafts.filter((d) => d.reviewStatus === "draft" || d.reviewStatus === "in_review").length,
      published: drafts.filter((d) => d.reviewStatus === "published").length + entities.filter((e) => e.status === "published").length,
      aiTasks: summarizeAiTelemetry().totalExecutions + listPublicTaskNames().length,
      qualityIssues,
      contentGaps: 0,
      assets: assets.length,
      activeModules: module ? 1 : 0,
    };
  },

  listEntities(filter?: {
    search?: string;
    entityType?: string;
    status?: string;
    domain?: string;
    sortBy?: "title" | "updatedAt";
  }): StudioEntityListItem[] {
    seedStudioEntities();
    const result = queryEntities({
      domain: filter?.domain,
      entityType: filter?.entityType,
      status: filter?.status as never,
      search: filter?.search,
      sortBy: filter?.sortBy ?? "updatedAt",
      sortDirection: "desc",
      limit: 200,
    });

    return result.items.map((entity) => ({
      id: entity.id,
      slug: entity.slug,
      title: entity.title,
      entityType: entity.entityType,
      domain: entity.domain,
      category: entity.category,
      status: entity.status,
      updatedAt: entity.updatedAt,
      qualityScore: typeof entity.metadata.qualityScore === "number" ? entity.metadata.qualityScore : undefined,
    }));
  },

  getEntity(id: string) {
    return getEntityById(id);
  },

  listAssets(): StudioAssetItem[] {
    const drafts = publicationStore.getState().drafts;
    return drafts.flatMap((draft) =>
      draft.visuals.map((asset) => ({
        id: asset.id,
        role: asset.role,
        label: asset.label,
        kind:
          asset.role === "hero"
            ? "hero"
            : asset.role === "diagram" || asset.role === "infographic"
              ? "diagram"
              : asset.role === "gallery"
                ? "gallery"
                : "visual",
        status: asset.status,
        sourceTitle: draft.title,
        prompt: asset.prompt,
      })),
    );
  },

  listPublishingItems(): StudioPublishingItem[] {
    return publicationStore.getState().drafts.map((draft) => ({
      id: draft.id,
      title: draft.title,
      stage: mapReviewToStage(draft.reviewStatus),
      updatedAt: draft.updatedAt,
      draft,
    }));
  },

  async getIntelligenceView(): Promise<StudioIntelligenceView> {
    const run = await loadStudioIntelligence();
    const gapResult = run.results.find((entry) => entry.category === "content-gaps");
    const trendResult = run.results.find((entry) => entry.category === "trends");
    const recommendationResult = run.results.find((entry) => entry.category === "recommendations");
    const qualityResult = run.results.find((entry) => entry.category === "quality-scores");

    const gaps = (gapResult?.data as { gaps?: Array<{ topic: string; priority: string }> })?.gaps ?? [];
    const trends =
      (trendResult?.data as { trends?: Array<{ metricId: string; direction: string; changePercent: number }> })
        ?.trends ?? [];
    const recommendations =
      (recommendationResult?.data as { recommendations?: Array<{ title: string; priority: string }> })
        ?.recommendations ?? [];

    const qualityWarnings: string[] = [];
    const qualityData = qualityResult?.data as { entries?: Array<{ contentId: string; overall: number }> };
    for (const entry of qualityData?.entries ?? []) {
      if (entry.overall < studioSettingsStore.get().qualityThreshold) {
        qualityWarnings.push(`${entry.contentId} scored ${entry.overall}/100`);
      }
    }

    return {
      run,
      contentGaps: gaps.map((gap) => ({ topic: gap.topic, priority: gap.priority })),
      trends,
      recommendations: recommendations.map((item) => ({ title: item.title, priority: item.priority })),
      qualityWarnings,
    };
  },

  getKnowledgeGraphPlaceholder() {
    seedStudioEntities();
    return getEntityGraph();
  },

  listAiAgents() {
    return ATLAS_AI_TEAM;
  },

  listTaskNames() {
    return listPublicTaskNames();
  },
};
