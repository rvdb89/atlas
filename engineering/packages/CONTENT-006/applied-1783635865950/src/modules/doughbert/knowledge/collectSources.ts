import { catalogArticles } from "./bulk/catalogArticles";
import { bakwetenschapArticles } from "./science";
import { starterArticles } from "./starter";
import { fermentatieArticles } from "./fermentatie";
import { temperaturenArticles } from "./temperaturen";
import { hydratatieArticles } from "./hydratatie";
import { buildRecipeArticles } from "./bulk/recipeArticles";
import { flourArticles } from "./flour";
import { bulkImportArticles } from "./import/bulkImport";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

/**
 * Single source of truth for all Knowledge article inputs.
 * Add new category bulk files here — never touch a central slug list again.
 */
export function collectKnowledgeArticleInputs(): KnowledgeArticleInput[] {
  const raw = [...flourArticles, ...buildRecipeArticles(), ...catalogArticles, ...hydratatieArticles, ...temperaturenArticles, ...fermentatieArticles, ...starterArticles, ...bakwetenschapArticles];
  return bulkImportArticles(raw).articles;
}

export { catalogArticles, flourArticles, buildRecipeArticles };
