import type { FlourKey, Recipe, RecipeCategory, RecipeId, RecipeRegistry } from "@/types/recipe";

export const FLOUR_LABELS: Record<FlourKey, string> = {
  t65: "Tarwebloem (T65)",
  wholeWheat: "Volkoren tarwemeel",
  rye: "Rogge",
};

const landbrood: Recipe = {
  id: "landbrood",
  slug: "landbrood",
  name: "Landbrood",
  category: "Brood",
  tagline: "Licht, luchtig en perfect om mee te starten.",
  route: "/landbrood",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±24 uur",
    totalHoursMin: 20,
    totalHoursMax: 28,
    goodFor: "Eerste zuurdesembrood, ontbijt, lunch en toast.",
  },

  hydration: 72,
  starterPercentage: 20,
  flour: {
    t65: 90,
    wholeWheat: 10,
    rye: 0,
  },
  fermentation: {
    factor: 1.0,
    coldProofMin: 12,
    coldProofMax: 24,
    baseBulkHours: 5,
  },

  introduction:
    "Een mild zuurdesembrood met een open kruim en een rustige smaak. Ideaal als eerste brood om het bakproces te leren kennen.",

  ingredients: [
    { id: "t65", name: "Tarwebloem (T65)", amount: "450 g" },
    { id: "whole-wheat", name: "Volkoren tarwemeel", amount: "50 g" },
    { id: "water", name: "Water", amount: "360 g", note: "Kamertemperatuur" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: "100 g",
      note: "100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: "10 g" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 8 tot 12 uur voor het mixen zodat hij bubbelend en actief is.",
      durationLabel: "8–12 uur",
    },
    {
      id: "autolyse",
      order: 2,
      title: "Autolyse",
      body: "Meng bloem en water tot er geen droge stukken meer zijn. Laat 30 minuten rusten.",
      durationLabel: "30 min",
    },
    {
      id: "mix",
      order: 3,
      title: "Mengen",
      body: "Voeg starter en zout toe. Kneed tot het deeg soepel en samenhangend is.",
      durationLabel: "8–10 min",
    },
    {
      id: "bulk",
      order: 4,
      title: "Bulkfermentatie",
      body: "Laat rijzen op kamertemperatuur met regelmatige stretch-and-folds tot het deeg 30–50% is gegroeid.",
      durationLabel: "4–6 uur",
    },
    {
      id: "shape",
      order: 5,
      title: "Vormen",
      body: "Vorm het deeg tot een strakke bol of bâtard en plaats het in een rijsmand.",
      durationLabel: "15 min",
    },
    {
      id: "cold-proof",
      order: 6,
      title: "Koel rijzen",
      body: "Laat het brood 12 tot 24 uur in de koelkast rijzen voor extra smaak.",
      durationLabel: "12–24 uur",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak het brood heet af tot de korst diep amberkleurig is en de kruim gaar.",
      durationLabel: "40–45 min",
    },
  ],

  tips: [
    "Gebruik een rijsmand voor een mooie vorm en structuur.",
    "Bak op hoge temperatuur met stoom voor een knapperige korst.",
    "Laat het brood volledig afkoelen voordat je snijdt.",
  ],

  plannerRoute: "/planner",
};

export const recipes: RecipeRegistry = {
  landbrood,
};

export const recipeList: Recipe[] = Object.values(recipes);

export function getRecipe(id: RecipeId): Recipe {
  return recipes[id];
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipeList.find((recipe) => recipe.slug === slug);
}

export function getRecipeByRoute(route: string): Recipe | undefined {
  return recipeList.find((recipe) => recipe.route === route);
}

export function getRecipesByCategory(category: RecipeCategory): Recipe[] {
  return recipeList.filter((recipe) => recipe.category === category);
}
