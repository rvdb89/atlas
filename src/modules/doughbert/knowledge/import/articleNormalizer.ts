import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import type {
  KnowledgeBiteDefinition,
  KnowledgeBiteMetadata,
} from "@/types/knowledgeBite";

/** Converts legacy per-file definitions into the canonical article input shape. */
export function definitionToArticleInput(
  definition: KnowledgeBiteDefinition,
): KnowledgeArticleInput {
  return {
    slug: definition.slug,
    categoryId: definition.categoryId,
    title: definition.title,
    libraryOrder: definition.libraryOrder,
    kind: "catalog",
    subcategory: definition.subcategory,
    status: definition.status,
    metadata: definition.metadata,
    content: definition.content,
    relationTags: definition.metadata?.tags,
  };
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ensures metadata.category matches categoryId and fills safe defaults. */
export function normalizeArticleInput(
  input: KnowledgeArticleInput,
): KnowledgeArticleInput {
  const metadata: Partial<KnowledgeBiteMetadata> = {
    ...input.metadata,
    title: input.metadata?.title ?? input.title,
    category: input.categoryId,
    subcategory: input.subcategory ?? input.metadata?.subcategory,
    tags: input.metadata?.tags ?? [],
    relatedKnowledge: input.metadata?.relatedKnowledge ?? [],
    relatedRecipes: input.metadata?.relatedRecipes ?? [],
    relatedTips: input.metadata?.relatedTips ?? [],
  };

  return {
    ...input,
    slug: normalizeSlug(input.slug),
    metadata,
    relationTags: [
      ...(input.relationTags ?? []),
      ...(metadata.tags ?? []),
      input.title,
      input.slug,
    ],
  };
}

export function normalizeArticleBatch(
  articles: KnowledgeArticleInput[],
): BulkImportValidation {
  const warnings: string[] = [];
  const seen = new Set<string>();
  const normalized: KnowledgeArticleInput[] = [];

  for (const article of articles) {
    const next = normalizeArticleInput(article);

    if (seen.has(next.slug)) {
      warnings.push(`Dubbele slug genegeerd: ${next.slug}`);
      continue;
    }

    seen.add(next.slug);
    normalized.push(next);
  }

  return { articles: normalized, warnings };
}

export type BulkImportValidation = {
  articles: KnowledgeArticleInput[];
  warnings: string[];
};
