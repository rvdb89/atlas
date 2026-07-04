import type { AtlasEntity, EntityLifecycleEvent, EntityStoreFilter } from "../core/types";

const entities = new Map<string, AtlasEntity>();
const slugIndex = new Map<string, string>();
const lifecycleLog: EntityLifecycleEvent[] = [];

function slugKey(domain: string, slug: string): string {
  return `${domain}:${slug}`;
}

export function storeEntity(entity: AtlasEntity): AtlasEntity {
  entities.set(entity.id, entity);
  slugIndex.set(slugKey(entity.domain, entity.slug), entity.id);
  return entity;
}

export function getEntityById(id: string): AtlasEntity | undefined {
  return entities.get(id);
}

export function getEntityBySlug(domain: string, slug: string): AtlasEntity | undefined {
  const id = slugIndex.get(slugKey(domain, slug));
  return id ? entities.get(id) : undefined;
}

export function listEntities(filter?: EntityStoreFilter): AtlasEntity[] {
  let result = [...entities.values()];

  if (filter?.domain) result = result.filter((entity) => entity.domain === filter.domain);
  if (filter?.entityType) result = result.filter((entity) => entity.entityType === filter.entityType);
  if (filter?.category) result = result.filter((entity) => entity.category === filter.category);
  if (filter?.subCategory) result = result.filter((entity) => entity.subCategory === filter.subCategory);
  if (filter?.slug) result = result.filter((entity) => entity.slug === filter.slug);
  if (filter?.visibility) result = result.filter((entity) => entity.visibility === filter.visibility);
  if (filter?.tags?.length) {
    result = result.filter((entity) => filter.tags!.every((tag) => entity.tags.includes(tag)));
  }
  if (filter?.status) {
    const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
    result = result.filter((entity) => statuses.includes(entity.status));
  }

  return result;
}

export function deleteEntity(id: string): boolean {
  const entity = entities.get(id);
  if (!entity) return false;
  entities.delete(id);
  slugIndex.delete(slugKey(entity.domain, entity.slug));
  return true;
}

export function entityExistsBySlug(domain: string, slug: string, excludeId?: string): boolean {
  const existing = getEntityBySlug(domain, slug);
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}

export function recordLifecycleEvent(event: EntityLifecycleEvent): void {
  lifecycleLog.unshift(event);
}

export function listLifecycleEvents(entityId?: string): EntityLifecycleEvent[] {
  return entityId ? lifecycleLog.filter((event) => event.entityId === entityId) : [...lifecycleLog];
}

export function getEntityCount(filter?: EntityStoreFilter): number {
  return listEntities(filter).length;
}

export function clearEntityStore(): void {
  entities.clear();
  slugIndex.clear();
  lifecycleLog.length = 0;
}
