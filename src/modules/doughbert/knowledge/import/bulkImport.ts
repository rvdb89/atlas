import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import type { BulkImportResult } from "@/types/knowledgeArticleInput";

import { normalizeArticleBatch } from "./articleNormalizer";

/**
 * Validates and normalizes a batch of Knowledge articles.
 * Use this for bulk files such as `breadArticles.ts` or AI output.
 */
export function bulkImportArticles(
  articles: KnowledgeArticleInput[],
): BulkImportResult {
  const { articles: normalized, warnings } = normalizeArticleBatch(articles);

  return {
    articles: normalized,
    warnings,
  };
}

/** Convenience helper for category-scoped bulk files. */
export function defineBulkArticles(
  categoryId: KnowledgeArticleInput["categoryId"],
  articles: Omit<KnowledgeArticleInput, "categoryId">[],
): KnowledgeArticleInput[] {
  return articles.map((article, index) => ({
    ...article,
    categoryId,
    libraryOrder: article.libraryOrder ?? index + 1,
    kind: article.kind ?? "catalog",
  }));
}
