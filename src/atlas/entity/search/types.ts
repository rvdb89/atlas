import type { EntitySearchResponse, EntitySearchResult } from "../core/types";

export type SearchIndexOptions = {
  fields?: Array<"title" | "description" | "tags" | "slug" | "category" | "attributes">;
  minScore?: number;
};

export type SearchEngine = {
  index(entityId: string): void;
  remove(entityId: string): void;
  search(query: string, options?: SearchIndexOptions & { domain?: string; entityType?: string; limit?: number }): EntitySearchResponse;
  rebuild(domain?: string): void;
};

export type SearchDocument = {
  entityId: string;
  domain: string;
  entityType: string;
  tokens: Map<string, number>;
  fields: Record<string, string>;
};
