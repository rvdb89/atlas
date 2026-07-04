import type { AtlasEntity, EntityDraft, EntityPatch, EntityStatus } from "../core/types";
import { getEntitySchema } from "../schemas/registry";
import {
  entityExistsBySlug,
  getEntityById,
  recordLifecycleEvent,
  storeEntity,
} from "../registry/entityStore";
import { assertValidEntity, validateEntity } from "../validators/validateEntity";
import { createEntityId, createRelationId } from "../utils/id";
import { ensureUniqueSlug, slugify } from "../utils/slug";
import { nextEntityVersion } from "../utils/version";
import { indexEntity } from "../search/SearchIndex";
import { rebuildGraphFromStore } from "../graph/builder";

export type CreateEntityOptions = {
  skipValidation?: boolean;
  autoSlug?: boolean;
  indexSearch?: boolean;
  syncGraph?: boolean;
};

export type UpdateEntityOptions = {
  skipValidation?: boolean;
  incrementVersion?: boolean;
  indexSearch?: boolean;
  syncGraph?: boolean;
};

function applyDefaults(draft: EntityDraft): AtlasEntity {
  const now = new Date().toISOString();
  const schema = getEntitySchema(draft.entityType);

  return {
    id: draft.id ?? createEntityId(),
    slug: draft.slug,
    title: draft.title,
    description: draft.description,
    entityType: draft.entityType,
    domain: draft.domain,
    category: draft.category,
    subCategory: draft.subCategory,
    attributes: draft.attributes ?? {},
    relations: (draft.relations ?? []).map((relation) => ({
      ...relation,
      id: relation.id ?? createRelationId(draft.id ?? "draft", relation.kind, relation.targetId),
    })),
    tags: draft.tags ?? [],
    difficulty: draft.difficulty,
    metadata: draft.metadata ?? {},
    media: draft.media ?? [],
    seo: draft.seo ?? {},
    visibility: draft.visibility ?? schema?.defaultVisibility ?? "private",
    status: draft.status ?? schema?.defaultStatus ?? "draft",
    createdAt: draft.createdAt ?? now,
    updatedAt: draft.updatedAt ?? now,
    version: draft.version ?? 1,
  };
}

/** Central entity creation — all verticals create entities through this factory. */
export function createEntity(draft: EntityDraft, options?: CreateEntityOptions): AtlasEntity {
  const slugBase = draft.slug?.trim() ? draft.slug : slugify(draft.title);
  const slug =
    options?.autoSlug === false
      ? slugBase
      : ensureUniqueSlug(slugBase, (candidate) => entityExistsBySlug(draft.domain, candidate));

  const entity = applyDefaults({ ...draft, slug });

  if (!options?.skipValidation) {
    assertValidEntity(entity);
  }

  storeEntity(entity);
  recordLifecycleEvent({
    entityId: entity.id,
    toStatus: entity.status,
    occurredAt: entity.createdAt,
    reason: "created",
  });

  if (options?.indexSearch !== false) {
    indexEntity(entity);
  }
  if (options?.syncGraph !== false) {
    rebuildGraphFromStore(entity.domain);
  }

  return entity;
}

export function updateEntity(id: string, patch: EntityPatch, options?: UpdateEntityOptions): AtlasEntity {
  const existing = getEntityById(id);
  if (!existing) {
    throw new Error(`Entity not found: ${id}`);
  }

  const nextVersion = nextEntityVersion(existing.version, options?.incrementVersion !== false);
  const updated: AtlasEntity = {
    ...existing,
    ...patch,
    id: existing.id,
    domain: existing.domain,
    entityType: existing.entityType,
    version: nextVersion,
    updatedAt: new Date().toISOString(),
    relations: patch.relations ?? existing.relations,
    attributes: patch.attributes ? { ...existing.attributes, ...patch.attributes } : existing.attributes,
    tags: patch.tags ?? existing.tags,
    metadata: patch.metadata ? { ...existing.metadata, ...patch.metadata } : existing.metadata,
    media: patch.media ?? existing.media,
    seo: patch.seo ? { ...existing.seo, ...patch.seo } : existing.seo,
  };

  if (!options?.skipValidation) {
    const result = validateEntity(updated, { excludeId: id, previousVersion: existing.version });
    if (!result.valid) {
      throw new Error(
        `Entity update validation failed: ${result.issues.filter((i) => i.severity === "error").map((i) => i.message).join("; ")}`,
      );
    }
  }

  if (patch.status && patch.status !== existing.status) {
    recordLifecycleEvent({
      entityId: id,
      fromStatus: existing.status,
      toStatus: patch.status,
      occurredAt: updated.updatedAt,
      reason: "status-change",
    });
  }

  storeEntity(updated);

  if (options?.indexSearch !== false) {
    indexEntity(updated);
  }
  if (options?.syncGraph !== false) {
    rebuildGraphFromStore(updated.domain);
  }

  return updated;
}

export function transitionEntityStatus(id: string, toStatus: EntityStatus): AtlasEntity {
  return updateEntity(id, { status: toStatus });
}

export function publishEntity(id: string): AtlasEntity {
  return updateEntity(id, { status: "published", visibility: "public" });
}

export function archiveEntity(id: string): AtlasEntity {
  return updateEntity(id, { status: "archived" });
}
