import type { AtlasEntity, EntityQueryResult, EntityStoreFilter } from "../core/types";

export type EntityQuery = EntityStoreFilter & {
  search?: string;
  attributeFilters?: Record<string, unknown>;
  sortBy?: "title" | "updatedAt" | "createdAt" | "version";
  sortDirection?: "asc" | "desc";
  offset?: number;
  limit?: number;
};

export type QueryEngine = {
  query(input: EntityQuery): EntityQueryResult;
  count(input?: EntityStoreFilter): number;
  findOne(input: EntityStoreFilter): AtlasEntity | undefined;
};
