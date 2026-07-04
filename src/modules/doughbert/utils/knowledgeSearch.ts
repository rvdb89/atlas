import { knowledgeCategories } from "@/data/knowledgeCategories";
import type { KnowledgeBite } from "@/types/knowledgeBite";

function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

function biteSearchText(bite: KnowledgeBite): string {
  const category = knowledgeCategories[bite.categoryId];

  return [
    bite.title,
    bite.tagline,
    bite.introduction,
    bite.metadata.subcategory,
    category?.title,
    category?.description,
    ...bite.metadata.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Client-side Knowledge Explorer search — title, category, tags and summary. */
export function searchKnowledgeBites(
  query: string,
  bites: KnowledgeBite[],
): KnowledgeBite[] {
  const normalized = normalizeSearchQuery(query);

  if (normalized.length === 0) {
    return bites;
  }

  const terms = normalized.split(/\s+/).filter(Boolean);

  return bites
    .filter((bite) => {
      const haystack = biteSearchText(bite);
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().startsWith(normalized) ? 0 : 1;
      const bTitle = b.title.toLowerCase().startsWith(normalized) ? 0 : 1;
      return aTitle - bTitle || a.libraryOrder - b.libraryOrder;
    });
}

export function getCategoryListTitle(categoryId: KnowledgeBite["categoryId"]): string {
  switch (categoryId) {
    case "brood":
      return "Alle broden";
    case "pizza":
      return "Alle pizzastijlen";
    case "meel-bloem":
      return "Alle meelsoorten";
    case "starter":
      return "Alles over starter";
    case "hydratatie":
      return "Alles over hydratatie";
    case "fermentatie":
      return "Alles over fermentatie";
    case "technieken":
      return "Alle technieken";
    case "temperaturen":
      return "Alles over temperaturen";
    case "bakwetenschap":
      return "Alle onderwerpen";
    default:
      return "Alle artikelen";
  }
}

export function formatDifficultyLabel(
  difficulty: KnowledgeBite["metadata"]["difficulty"],
): string {
  switch (difficulty) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Gevorderd";
    case "advanced":
      return "Expert";
    default:
      return "Beginner";
  }
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min lezen`;
}

export function formatDifficultyStars(
  difficulty: KnowledgeBite["metadata"]["difficulty"],
): string {
  switch (difficulty) {
    case "beginner":
      return "⭐☆☆☆☆";
    case "intermediate":
      return "⭐⭐⭐☆☆";
    case "advanced":
      return "⭐⭐⭐⭐⭐";
    default:
      return "⭐☆☆☆☆";
  }
}
