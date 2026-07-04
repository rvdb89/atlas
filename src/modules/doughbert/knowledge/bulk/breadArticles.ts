import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

import { defineBulkArticles } from "../import/bulkImport";

/**
 * Example bulk file for editorial bread articles.
 * Recipe-linked bread pages are auto-generated from recipes.ts — use this file
 * when you add standalone bread knowledge (history, styles, troubleshooting).
 *
 * Import in collectSources.ts:
 *   import { breadArticles } from "./bulk/breadArticles";
 *   ...flourArticles, ...breadArticles, ...
 */
export const breadArticles: KnowledgeArticleInput[] = defineBulkArticles("brood", [
  {
    slug: "zuurdesem-basis",
    title: "Zuurdesem basis",
    libraryOrder: 20,
    status: "draft",
    metadata: {
      subtitle: "De fundamenten van zuurdesem thuis",
      tags: ["Zuurdesem", "Starter", "Brood"],
      difficulty: "beginner",
      readingTimeMinutes: 8,
    },
  },
]);
