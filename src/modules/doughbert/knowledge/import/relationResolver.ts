import { knowledgeCategories } from "@/data/knowledgeCategories";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import type { KnowledgeBite, KnowledgeBiteId } from "@/types/knowledgeBite";

const MAX_AUTO_RELATIONS = 8;

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function collectArticleTokens(article: KnowledgeArticleInput): Set<string> {
  const tokens = new Set<string>();

  tokens.add(normalizeToken(article.slug));
  tokens.add(normalizeToken(article.title));

  for (const tag of article.relationTags ?? []) {
    if (tag.trim().length > 0) {
      tokens.add(normalizeToken(tag));
    }
  }

  for (const tag of article.metadata?.tags ?? []) {
    if (tag.trim().length > 0) {
      tokens.add(normalizeToken(tag));
    }
  }

  return tokens;
}

function buildRelationIndex(articles: KnowledgeArticleInput[]) {
  const tokenToSlugs = new Map<string, Set<string>>();

  for (const article of articles) {
    for (const token of collectArticleTokens(article)) {
      if (token.length < 2) {
        continue;
      }

      const slugs = tokenToSlugs.get(token) ?? new Set<string>();
      slugs.add(article.slug);
      tokenToSlugs.set(token, slugs);
    }
  }

  return tokenToSlugs;
}

function scoreRelation(
  source: KnowledgeArticleInput,
  candidate: KnowledgeArticleInput,
  sharedTokens: number,
): number {
  let score = sharedTokens * 10;

  if (candidate.categoryId === source.categoryId) {
    score += 2;
  }

  if (candidate.status === "published") {
    score += 3;
  }

  return score;
}

/** Finds related article slugs from shared tags/tokens — no hardcoded links. */
export function resolveAutomaticRelatedKnowledge(
  source: KnowledgeArticleInput,
  articles: KnowledgeArticleInput[],
): KnowledgeBiteId[] {
  const tokenToSlugs = buildRelationIndex(articles);
  const sourceTokens = collectArticleTokens(source);
  const scores = new Map<string, number>();

  for (const token of sourceTokens) {
    const matches = tokenToSlugs.get(token);
    if (!matches) {
      continue;
    }

    for (const slug of matches) {
      if (slug === source.slug) {
        continue;
      }

      scores.set(slug, (scores.get(slug) ?? 0) + 1);
    }
  }

  return articles
    .filter((candidate) => candidate.slug !== source.slug)
    .map((candidate) => ({
      slug: candidate.slug,
      score: scoreRelation(source, candidate, scores.get(candidate.slug) ?? 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, MAX_AUTO_RELATIONS)
    .map((entry) => entry.slug);
}

/** Merges explicit metadata links with automatic tag-based discovery. */
export function mergeRelatedKnowledge(
  explicit: KnowledgeBiteId[] | undefined,
  automatic: KnowledgeBiteId[],
): KnowledgeBiteId[] {
  const merged: KnowledgeBiteId[] = [];

  for (const id of [...(explicit ?? []), ...automatic]) {
    if (merged.includes(id)) {
      continue;
    }
    merged.push(id);
  }

  return merged.slice(0, MAX_AUTO_RELATIONS + (explicit?.length ?? 0));
}

export function applyResolvedRelationsToBite(
  bite: KnowledgeBite,
  relatedKnowledge: KnowledgeBiteId[],
): KnowledgeBite {
  return {
    ...bite,
    metadata: {
      ...bite.metadata,
      relatedKnowledge,
    },
  };
}

export function getCategoryLabel(categoryId: KnowledgeBite["categoryId"]): string {
  return knowledgeCategories[categoryId]?.title ?? categoryId;
}
