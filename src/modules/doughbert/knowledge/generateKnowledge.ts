import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import type { BulkImportResult } from "@/types/knowledgeArticleInput";

import { bulkImportArticles } from "./import/bulkImport";

export type GenerateKnowledgeOptions = {
  /** When true, empty sections are kept instead of being stripped later. */
  preserveDraftSections?: boolean;
};

/**
 * Entry point for future AI content generation.
 * Today this validates and normalizes article objects — no LLM call yet.
 */
export function generateKnowledge(
  article: KnowledgeArticleInput,
  _options?: GenerateKnowledgeOptions,
): KnowledgeArticleInput {
  return bulkImportArticles([article]).articles[0];
}

/** Generate and validate many articles at once — ideal for category batch jobs. */
export function generateKnowledgeBatch(
  articles: KnowledgeArticleInput[],
  _options?: GenerateKnowledgeOptions,
): BulkImportResult {
  return bulkImportArticles(articles);
}
