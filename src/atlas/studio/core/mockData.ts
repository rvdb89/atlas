import { createEntity } from "@/atlas/entity/factory/EntityFactory";
import { getEntityCount, listEntities } from "@/atlas/entity/registry/entityStore";
import { emitSignal } from "@/atlas/intelligence/signals/bus";
import { runIntelligenceAnalysis } from "@/atlas/intelligence/engine/IntelligenceEngine";
import type { IntelligenceRunResult } from "@/atlas/intelligence/types";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";
import { publicationStore } from "../store/publicationStore";

let intelligenceCache: IntelligenceRunResult | undefined;
let seeded = false;

function mapCatalogType(contentType?: string): string {
  if (contentType === "recipe") return "recipe";
  if (contentType === "tip") return "tip";
  if (contentType === "technique") return "technique";
  if (contentType === "ingredient") return "ingredient";
  return "knowledge";
}

export function seedStudioEntities(force = false): void {
  if (seeded && !force && getEntityCount() > 0) return;

  const module = tryGetActiveModule();
  if (!module) return;

  const catalog = module.getArticleCatalog();
  const existingSlugs = new Set(listEntities({ domain: module.id }).map((entity) => entity.slug));

  for (const entry of catalog.slice(0, 18)) {
    if (existingSlugs.has(entry.slug)) continue;

    try {
      createEntity(
        {
          title: entry.title,
          slug: entry.slug,
          description: `Entity seeded from active module catalog entry.`,
          entityType: mapCatalogType((entry as { contentType?: string }).contentType),
          domain: module.id,
          category: entry.categoryId ?? "general",
          tags: (entry.tags ?? entry.relationTags ?? [entry.categoryId]).filter(
            (tag): tag is string => Boolean(tag),
          ),
          status: "published",
          visibility: "public",
          attributes: { source: "studio-seed" },
          relations: [],
          metadata: { catalogSeed: true },
          media: [],
          seo: { title: entry.title, keywords: entry.tags?.filter(Boolean) as string[] | undefined },
        },
        { autoSlug: false },
      );
    } catch {
      // Ignore duplicate or validation errors during seed.
    }
  }

  seeded = true;
}

export function seedStudioSignals(): void {
  const module = tryGetActiveModule();
  const moduleId = module?.id;

  emitSignal({ type: "content.view", moduleId, payload: { screen: "studio" } });
  emitSignal({ type: "ai.execution", moduleId, payload: { task: "knowledge.write", mock: true } });
  emitSignal({ type: "quality.report", moduleId, payload: { score: 82 } });

  for (const entity of listEntities(moduleId ? { domain: moduleId } : undefined).slice(0, 5)) {
    emitSignal({
      type: "content.view",
      moduleId,
      contentId: entity.id,
      payload: { entityType: entity.entityType },
    });
  }
}

export async function loadStudioIntelligence(): Promise<IntelligenceRunResult> {
  if (intelligenceCache) return intelligenceCache;

  seedStudioSignals();
  const module = tryGetActiveModule();

  intelligenceCache = await runIntelligenceAnalysis({
    scope: { moduleId: module?.id },
  });

  return intelligenceCache;
}

export function resetStudioMockCaches(): void {
  intelligenceCache = undefined;
  seeded = false;
}

export function getPublicationDraftCount(): number {
  return publicationStore.getState().drafts.length;
}
