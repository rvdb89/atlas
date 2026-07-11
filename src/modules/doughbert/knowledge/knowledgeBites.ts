import {
  createDefaultKnowledgeBiteArticle,
  mergeKnowledgeBiteArticle,
} from "@/data/knowledgeBiteContent";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import type {
  KnowledgeBite,
  KnowledgeBiteArticle,
  KnowledgeBiteCategoryId,
  KnowledgeBiteDefinition,
  KnowledgeBiteId,
  KnowledgeBiteRegistry,
} from "@/types/knowledgeBite";
import type { RecipeId } from "@/types/recipe";

import { collectKnowledgeArticleInputs } from "./collectSources";
import {
  applyResolvedRelationsToBite,
  mergeRelatedKnowledge,
  resolveAutomaticRelatedKnowledge,
} from "./import/relationResolver";
import { normalizeArticleInput } from "./import/articleNormalizer";

function biteRoute(slug: string) {
  return `/knowledge/${slug}`;
}

function buildArticleFromInput(input: KnowledgeArticleInput): KnowledgeBiteArticle {
  const normalized = normalizeArticleInput(input);
  const placeholder = createDefaultKnowledgeBiteArticle({
    title: normalized.title,
    categoryId: normalized.categoryId,
    subcategory: normalized.subcategory,
    status: normalized.status,
    metadataOverrides: normalized.metadata,
    contentOverrides: normalized.content,
  });

  return mergeKnowledgeBiteArticle(
    placeholder,
    normalized.metadata,
    normalized.content,
  );
}

function articleInputToKnowledgeBite(input: KnowledgeArticleInput): KnowledgeBite {
  const article = buildArticleFromInput(input);

  return {
    id: input.slug,
    slug: input.slug,
    categoryId: input.categoryId,
    title: article.metadata.title,
    tagline: article.metadata.subtitle,
    route: biteRoute(input.slug),
    introduction: article.content.summary,
    libraryOrder: input.libraryOrder,
    recipeId: input.recipeId,
    metadata: article.metadata,
    content: article.content,
  };
}

function buildKnowledgeBiteRegistry(): KnowledgeBiteRegistry {
  const articleInputs = collectKnowledgeArticleInputs();
  const registry: KnowledgeBiteRegistry = {};

  for (const input of articleInputs) {
    registry[input.slug] = articleInputToKnowledgeBite(input);
  }

  for (const input of articleInputs) {
    const bite = registry[input.slug];
    if (!bite) {
      continue;
    }

    const automatic = resolveAutomaticRelatedKnowledge(input, articleInputs).filter(
      (slug) => registry[slug],
    );

    registry[input.slug] = applyResolvedRelationsToBite(
      bite,
      mergeRelatedKnowledge(bite.metadata.relatedKnowledge, automatic),
    );
  }

  return registry;
}

export const knowledgeBites: KnowledgeBiteRegistry = buildKnowledgeBiteRegistry();

/** True once a bite has anything a reader could actually read — either a real intro
 * summary or at least one real editorial section. Many catalog articles today exist only
 * as a title (auto-defaulted to an empty summary and zero sections, see
 * knowledgeBiteContent.ts) — those are genuinely blank pages, not content, and should
 * never be offered to a reader as if they were finished articles. */
export function hasRealKnowledgeContent(bite: KnowledgeBite): boolean {
  return bite.introduction.trim().length > 0 || bite.content.sections.length > 0;
}

const allKnowledgeBites: KnowledgeBite[] = Object.values(knowledgeBites);

/** Browsing/search list — only bites with real content a reader can open. Lookups by
 * id/slug (below) intentionally use the full, unfiltered registry instead, so a direct or
 * related-knowledge link never 404s just because a bite happens to still be a stub. */
export const knowledgeBiteList: KnowledgeBite[] = allKnowledgeBites.filter(hasRealKnowledgeContent);

export function getKnowledgeBite(id: KnowledgeBiteId): KnowledgeBite | undefined {
  return knowledgeBites[id];
}

export function getKnowledgeBiteBySlug(slug: string): KnowledgeBite | undefined {
  return allKnowledgeBites.find((bite) => bite.slug === slug);
}

export function getKnowledgeBitesByCategory(
  categoryId: KnowledgeBiteCategoryId,
): KnowledgeBite[] {
  return knowledgeBiteList
    .filter((bite) => bite.categoryId === categoryId)
    .sort((a, b) => a.libraryOrder - b.libraryOrder);
}

export function getKnowledgeBiteForRecipe(
  recipeId: RecipeId,
): KnowledgeBite | undefined {
  return knowledgeBites[recipeId];
}

export function getKnowledgeBiteRoute(id: KnowledgeBiteId): string | undefined {
  return getKnowledgeBite(id)?.route;
}

export function getRecipeKnowledgeBites(): KnowledgeBite[] {
  return knowledgeBiteList.filter((bite) => bite.recipeId !== undefined);
}

/** @deprecated Use collectKnowledgeArticleInputs() for new content. */
export type KnowledgeBiteSource = KnowledgeBiteDefinition;

export { collectKnowledgeArticleInputs } from "./collectSources";
