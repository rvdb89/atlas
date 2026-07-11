import { recipeList } from "@/data/recipes";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import type { KnowledgeBiteBody, KnowledgeBiteCategoryId } from "@/types/knowledgeBite";
import type { FlourKey, Recipe, RecipeId } from "@/types/recipe";

const FLOUR_KNOWLEDGE_SLUGS: Partial<Record<FlourKey, string>> = {
  t65: "t65",
  t80: "t80",
  t110: "t110",
  t130: "t130",
  t150: "t150",
  tipo00: "tipo-00",
  semola: "semola-rimacinata",
  wholeWheat: "volkorenmeel",
  rye: "rogge",
};

const RECIPE_LIBRARY_ORDER: Partial<Record<RecipeId, number>> = {
  "pain-de-campagne": 1,
  "country-loaf": 2,
  "wit-busbrood": 3,
  volkoren: 4,
  "donker-volkoren": 5,
  meergranen: 6,
  baguette: 7,
  bagels: 8,
  brioche: 9,
  focaccia: 10,
  "napolitaanse-pizza": 1,
  "new-york-style-pizza": 2,
  "detroit-style-pizza": 3,
  "roman-pizza-teglia": 4,
  "sicilian-pan-pizza": 5,
};

function recipeCategoryId(recipe: Recipe): KnowledgeBiteCategoryId {
  return recipe.category === "Pizza" ? "pizza" : "brood";
}

function recipeRelationTags(recipe: Recipe): string[] {
  const flourTags = (Object.entries(recipe.flour) as [FlourKey, number][])
    .filter(([, percentage]) => percentage > 0)
    .flatMap(([key]) => {
      const slug = FLOUR_KNOWLEDGE_SLUGS[key];
      return slug ? [slug, key] : [key];
    });

  return [
    recipe.name,
    recipe.category,
    recipe.tagline,
    "hydratatie",
    "fermentatie",
    "starter",
    ...flourTags,
  ];
}

/**
 * Derives Knowledge Bite content overrides from material the recipe itself already has.
 * No new facts are written here — only recipe.introduction is reused.
 *
 * recipe.tips is deliberately NOT mapped into doughbertAdvice: that field expects
 * structured { goal, choice } rows (KnowledgeBiteAdviceRow), while recipe.tips is a plain
 * list of freeform sentences — forcing them into that shape would mean inventing a "goal"
 * for each tip that doesn't exist in the source data. Wiring tips in as a real section
 * (via createStandardSection) is exactly the kind of follow-up this mission's CHANGES.md
 * already flags as the next real step, once the section schema is read too.
 */
function recipeContentOverrides(recipe: Recipe): Partial<KnowledgeBiteBody> {
  const overrides: Partial<KnowledgeBiteBody> = {};

  if (recipe.introduction) {
    overrides.summary = recipe.introduction;
  }

  return overrides;
}

/** Auto-generates recipe-linked Knowledge articles from the recipe registry. */
export function buildRecipeArticles(): KnowledgeArticleInput[] {
  const articles: KnowledgeArticleInput[] = [];

  for (const recipe of recipeList) {
    if (!recipe.knowledgeBiteId) {
      continue;
    }

    articles.push({
      slug: recipe.slug,
      categoryId: recipeCategoryId(recipe),
      title: recipe.name,
      libraryOrder: RECIPE_LIBRARY_ORDER[recipe.id] ?? articles.length + 1,
      kind: "recipe",
      recipeId: recipe.id,
      // Status stays "draft" until the article also has real sections, not just a
      // summary/advice — see mission CONTENT-001 follow-up for the remaining gap.
      status: "draft",
      metadata: {
        subtitle: recipe.tagline,
        tags: [recipe.category, recipe.name],
        relatedRecipes: [],
        relatedKnowledge: [],
        relatedTips: [],
      },
      relationTags: recipeRelationTags(recipe),
      content: recipeContentOverrides(recipe),
    });
  }

  return articles;
}
