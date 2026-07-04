import type { AtlasEntity, EntitySearchResponse, EntitySearchResult } from "../core/types";
import { getEntityById, listEntities } from "../registry/entityStore";
import type { SearchDocument, SearchEngine, SearchIndexOptions } from "./types";

const documents = new Map<string, SearchDocument>();
const invertedIndex = new Map<string, Set<string>>();

const DEFAULT_FIELDS: SearchIndexOptions["fields"] = ["title", "description", "tags", "slug", "category"];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2);
}

function buildDocument(entity: AtlasEntity, fields: NonNullable<SearchIndexOptions["fields"]> = DEFAULT_FIELDS!): SearchDocument {
  const fieldValues: Record<string, string> = {};
  const tokens = new Map<string, number>();

  if (fields.includes("title")) fieldValues.title = entity.title;
  if (fields.includes("description")) fieldValues.description = entity.description;
  if (fields.includes("slug")) fieldValues.slug = entity.slug;
  if (fields.includes("category")) fieldValues.category = entity.category;
  if (fields.includes("tags")) fieldValues.tags = entity.tags.join(" ");
  if (fields.includes("attributes")) {
    fieldValues.attributes = Object.entries(entity.attributes)
      .map(([key, value]) => `${key} ${String(value)}`)
      .join(" ");
  }

  for (const value of Object.values(fieldValues)) {
    for (const token of tokenize(value)) {
      tokens.set(token, (tokens.get(token) ?? 0) + 1);
    }
  }

  return {
    entityId: entity.id,
    domain: entity.domain,
    entityType: entity.entityType,
    tokens,
    fields: fieldValues,
  };
}

function indexDocument(document: SearchDocument): void {
  removeFromIndex(document.entityId);
  documents.set(document.entityId, document);

  for (const token of document.tokens.keys()) {
    if (!invertedIndex.has(token)) {
      invertedIndex.set(token, new Set());
    }
    invertedIndex.get(token)!.add(document.entityId);
  }
}

function removeFromIndex(entityId: string): void {
  const existing = documents.get(entityId);
  if (!existing) return;

  for (const token of existing.tokens.keys()) {
    invertedIndex.get(token)?.delete(entityId);
  }
  documents.delete(entityId);
}

function scoreDocument(document: SearchDocument, queryTokens: string[]): EntitySearchResult | undefined {
  let score = 0;
  const matchedFields = new Set<string>();

  for (const token of queryTokens) {
    const weight = document.tokens.get(token);
    if (!weight) continue;
    score += weight;

    for (const [field, value] of Object.entries(document.fields)) {
      if (tokenize(value).includes(token)) {
        matchedFields.add(field);
      }
    }
  }

  if (score === 0) return undefined;
  const entity = getEntityById(document.entityId);
  if (!entity) return undefined;

  return {
    entity,
    score,
    matchedFields: [...matchedFields],
  };
}

export function indexEntity(entity: AtlasEntity): void {
  indexDocument(buildDocument(entity));
}

export function removeEntityFromIndex(entityId: string): void {
  removeFromIndex(entityId);
}

export function rebuildSearchIndex(domain?: string): void {
  documents.clear();
  invertedIndex.clear();

  for (const entity of listEntities(domain ? { domain } : undefined)) {
    indexEntity(entity);
  }
}

export const entitySearchEngine: SearchEngine = {
  index(entityId) {
    const entity = getEntityById(entityId);
    if (entity) indexEntity(entity);
  },

  remove(entityId) {
    removeEntityFromIndex(entityId);
  },

  search(query, options) {
    const started = Date.now();
    const queryTokens = tokenize(query);
    const candidateIds = new Set<string>();

    for (const token of queryTokens) {
      const matches = invertedIndex.get(token);
      if (matches) {
        for (const id of matches) candidateIds.add(id);
      }
    }

    let results: EntitySearchResult[] = [];

    for (const entityId of candidateIds) {
      const document = documents.get(entityId);
      if (!document) continue;
      if (options?.domain && document.domain !== options.domain) continue;
      if (options?.entityType && document.entityType !== options.entityType) continue;

      const scored = scoreDocument(document, queryTokens);
      if (scored && scored.score >= (options?.minScore ?? 1)) {
        results.push(scored);
      }
    }

    results.sort((left, right) => right.score - left.score);
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return {
      query,
      results,
      total: results.length,
      tookMs: Date.now() - started,
    };
  },

  rebuild(domain) {
    rebuildSearchIndex(domain);
  },
};

export function searchEntities(
  query: string,
  options?: SearchIndexOptions & { domain?: string; entityType?: string; limit?: number },
): EntitySearchResponse {
  return entitySearchEngine.search(query, options);
}
