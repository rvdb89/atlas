import { listEntities } from "../registry/entityStore";
import type { AtlasEntity, EntityQueryResult, EntityStoreFilter } from "../core/types";
import type { EntityQuery, QueryEngine } from "./types";

function matchesAttributeFilters(entity: AtlasEntity, filters?: Record<string, unknown>): boolean {
  if (!filters || Object.keys(filters).length === 0) return true;

  for (const [key, expected] of Object.entries(filters)) {
    const actual = entity.attributes[key];
    if (actual !== expected) return false;
  }

  return true;
}

function matchesSearch(entity: AtlasEntity, search?: string): boolean {
  if (!search?.trim()) return true;
  const needle = search.trim().toLowerCase();
  const haystack = [entity.title, entity.description, entity.slug, ...entity.tags].join(" ").toLowerCase();
  return haystack.includes(needle);
}

function sortEntities(entities: AtlasEntity[], query: EntityQuery): AtlasEntity[] {
  const sortBy = query.sortBy ?? "updatedAt";
  const direction = query.sortDirection ?? "desc";

  return [...entities].sort((left, right) => {
    const leftValue = left[sortBy];
    const rightValue = right[sortBy];

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return direction === "asc" ? leftValue - rightValue : rightValue - leftValue;
    }

    const leftText = String(leftValue);
    const rightText = String(rightValue);
    return direction === "asc" ? leftText.localeCompare(rightText) : rightText.localeCompare(leftText);
  });
}

export const entityQueryEngine: QueryEngine = {
  query(input: EntityQuery): EntityQueryResult {
    const { search, attributeFilters, sortBy, sortDirection, offset, limit, ...filter } = input;

    let items = listEntities(filter);
    items = items.filter((entity) => matchesSearch(entity, search));
    items = items.filter((entity) => matchesAttributeFilters(entity, attributeFilters));
    items = sortEntities(items, { ...input, sortBy, sortDirection });

    const total = items.length;
    const start = offset ?? 0;
    const end = limit ? start + limit : items.length;

    return {
      items: items.slice(start, end),
      total,
      offset: start,
      limit: limit ?? total,
    };
  },

  count(input?: EntityStoreFilter): number {
    return listEntities(input).length;
  },

  findOne(input: EntityStoreFilter): AtlasEntity | undefined {
    return listEntities(input)[0];
  },
};

export function queryEntities(input: EntityQuery): EntityQueryResult {
  return entityQueryEngine.query(input);
}

export function countEntities(input?: EntityStoreFilter): number {
  return entityQueryEngine.count(input);
}

export function findEntity(input: EntityStoreFilter): AtlasEntity | undefined {
  return entityQueryEngine.findOne(input);
}
