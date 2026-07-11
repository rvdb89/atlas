import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

/** Catalog articles — techniques, starter, science and related categories. */
export const catalogArticles: KnowledgeArticleInput[] = [
  {
    slug: "zure-starter",
    categoryId: "starter",
    title: "Zure starter",
    libraryOrder: 8,
  },
  {
    slug: "scoren",
    categoryId: "technieken",
    title: "Scoren",
    libraryOrder: 15,
  },
  {
    slug: "ovenspring-creeren",
    categoryId: "technieken",
    title: "Ovenspring creëren",
    libraryOrder: 16,
  },
  {
    slug: "pizza-lanceren",
    categoryId: "technieken",
    title: "Pizza lanceren",
    libraryOrder: 19,
  },
  {
    slug: "kamertemperatuur",
    categoryId: "temperaturen",
    title: "Kamertemperatuur",
    libraryOrder: 5,
  },
];
