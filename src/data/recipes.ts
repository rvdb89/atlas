import type { FlourKey, Recipe, RecipeCategory, RecipeId, RecipeRegistry } from "@/types/recipe";

import {
  bagels,
  baguette,
  brioche,
  countryLoaf,
  donkerVolkoren,
  focaccia,
  meergranen,
  painDeCampagne,
  volkoren,
  witBusbrood,
} from "./breadRecipes";

export const FLOUR_LABELS: Record<FlourKey, string> = {
  tipo00: "Tipo 00",
  breadFlour: "Bread Flour (High Protein)",
  t65: "T65",
  t80: "T80",
  t110: "T110",
  t130: "T130",
  t150: "T150",
  wholeWheat: "Volkoren tarwemeel",
  rye: "Rogge",
  semola: "Semola",
};

const napolitaansePizza: Recipe = {
  id: "napolitaanse-pizza",
  slug: "napolitaanse-pizza",
  name: "Napolitaanse Pizza",
  category: "Pizza",
  tagline: "Luchtige rand, zachte bodem en klassieke Italiaanse smaak.",
  route: "/napolitaanse-pizza",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±48 uur",
    totalHoursMin: 30,
    totalHoursMax: 54,
    goodFor: "Romige bodems, knapperige randen en pizza-avonden thuis.",
  },

  hydration: 65,
  starterPercentage: 10,
  flour: {
    tipo00: 100,
  },
  fermentation: {
    factor: 0.85,
    coldProofMin: 24,
    coldProofMax: 72,
    baseBulkHours: 3,
  },

  introduction:
    "Een klassieke Napolitaanse zuurdesem pizzabodem met 100% Tipo 00, 65% hydratatie, 10% starter en 2,7% zout. Perfect om rustig te rijzen en heet af te bakken.",

  ingredients: [
    { id: "tipo-00", name: "Tipo 00", amount: "500 g", note: "100% bloem" },
    { id: "water", name: "Water", amount: "325 g", note: "65% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: "50 g",
      note: "10% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: "13,5 g", note: "2,7% van de bloem" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen zodat hij actief en bubbelend is.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng Tipo 00, water, starter en zout tot een soepel deeg volgens de Napolitaanse verhoudingen.",
      durationLabel: "8–10 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat het deeg 2 tot 4 uur rijzen op kamertemperatuur tot het zichtbaar is gezwollen.",
      durationLabel: "2–4 uur",
    },
    {
      id: "divide",
      order: 4,
      title: "Verdelen en bolvormen",
      body: "Verdeel het deeg in porties van ongeveer 250 g en vorm strakke bollen.",
      durationLabel: "15 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat de bollen 24 tot 72 uur rijzen in de koelkast voor diepe smaak.",
      durationLabel: "24–72 uur",
    },
    {
      id: "shape",
      order: 6,
      title: "Uitslaan",
      body: "Haal de deegbollen uit de koelkast, laat 1 tot 2 uur temperen en sla voorzichtig uit.",
      durationLabel: "1–2 uur",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak op hoge temperatuur tot de rand goudbruin is en de bodem gaar.",
      durationLabel: "8–12 min",
    },
  ],

  tips: [
    "Gebruik een hete oven of pizza-steen voor de beste korst.",
    "Werk met licht bebloemde handen zodat het deeg zijn structuur behoudt.",
    "Beleg de pizza pas kort voordat je hem in de oven schuift.",
  ],

  plannerRoute: "/planner",
};

const newYorkStylePizza: Recipe = {
  id: "new-york-style-pizza",
  slug: "new-york-style-pizza",
  name: "New York Style Pizza",
  category: "Pizza",
  tagline: "Grote plakken, stevige bodem en klassieke New York bite.",
  route: "/new-york-style-pizza",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±48 uur",
    totalHoursMin: 30,
    totalHoursMax: 54,
    goodFor: "Grote plakken, rijke toppings en klassieke pizzeria-smaak.",
  },

  hydration: 68,
  starterPercentage: 10,
  flour: {
    breadFlour: 100,
  },
  fermentation: {
    factor: 0.88,
    coldProofMin: 24,
    coldProofMax: 72,
    baseBulkHours: 3,
  },

  introduction:
    "Een New York style zuurdesem deeg met 100% bread flour, 68% hydratatie, 10% starter, 2,5% zout en 2% olijfolie.",

  ingredients: [
    {
      id: "bread-flour",
      name: "Bread Flour (High Protein)",
      amount: "500 g",
      note: "100% bloem",
    },
    { id: "water", name: "Water", amount: "340 g", note: "68% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: "50 g",
      note: "10% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: "12,5 g", note: "2,5% van de bloem" },
    { id: "oil", name: "Olijfolie", amount: "10 g", note: "2% van de bloem" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen zodat hij actief en bubbelend is.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng bread flour, water, starter, zout en olijfolie tot een soepel, elastisch deeg.",
      durationLabel: "10–12 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat het deeg 2 tot 4 uur rijzen op kamertemperatuur.",
      durationLabel: "2–4 uur",
    },
    {
      id: "divide",
      order: 4,
      title: "Verdelen en bolvormen",
      body: "Verdeel het deeg in porties van ongeveer 280 g en vorm strakke bollen.",
      durationLabel: "15 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat de bollen 24 tot 72 uur rijzen in de koelkast.",
      durationLabel: "24–72 uur",
    },
    {
      id: "shape",
      order: 6,
      title: "Uitslaan",
      body: "Laat temperen en rol uit tot een grote, dunne New York bodem.",
      durationLabel: "1–2 uur",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak op hoge temperatuur tot de bodem goudbruin en knapperig is.",
      durationLabel: "10–14 min",
    },
  ],

  tips: [
    "Rol de bodem dun voor die typische New York plak.",
    "Gebruik een pizza-steen of steel voor extra knapperigheid.",
    "Beleg royaal, maar houd de bodem dun genoeg om door te bakken.",
  ],

  plannerRoute: "/planner",
};

const detroitStylePizza: Recipe = {
  id: "detroit-style-pizza",
  slug: "detroit-style-pizza",
  name: "Detroit Style Pizza",
  category: "Pizza",
  tagline: "Rechteckige pan, krokante kaasrand en luchtige kruim.",
  route: "/detroit-style-pizza",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±48 uur",
    totalHoursMin: 32,
    totalHoursMax: 56,
    goodFor: "Pan pizza, krokante randen en rijke toppings.",
  },

  hydration: 75,
  starterPercentage: 10,
  flour: {
    breadFlour: 100,
  },
  fermentation: {
    factor: 0.9,
    coldProofMin: 24,
    coldProofMax: 48,
    baseBulkHours: 4,
  },

  introduction:
    "Een Detroit style zuurdesem deeg met 100% bread flour, 75% hydratatie, 10% starter, 2,5% zout en 3% olijfolie.",

  ingredients: [
    {
      id: "bread-flour",
      name: "Bread Flour (High Protein)",
      amount: "500 g",
      note: "100% bloem",
    },
    { id: "water", name: "Water", amount: "375 g", note: "75% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: "50 g",
      note: "10% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: "12,5 g", note: "2,5% van de bloem" },
    { id: "oil", name: "Olijfolie", amount: "15 g", note: "3% van de bloem" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen zodat hij actief en bubbelend is.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng bread flour, water, starter, zout en olijfolie tot een soepel pan-deeg.",
      durationLabel: "10–12 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat het deeg 3 tot 5 uur rijzen op kamertemperatuur.",
      durationLabel: "3–5 uur",
    },
    {
      id: "pan",
      order: 4,
      title: "In de pan",
      body: "Smeer een rechthoekige pan in met olie en spreid het deeg voorzichtig uit.",
      durationLabel: "20 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat het deeg 24 tot 48 uur rijzen in de koelkast.",
      durationLabel: "24–48 uur",
    },
    {
      id: "shape",
      order: 6,
      title: "Temperen",
      body: "Laat het deeg 1 tot 2 uur op kamertemperatuur komen voor het bakken.",
      durationLabel: "1–2 uur",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak in de pan tot de randen krokant en diep goudbruin zijn.",
      durationLabel: "15–20 min",
    },
  ],

  tips: [
    "Gebruik een goed ingevette pan voor de typische krokante kaasrand.",
    "Bak op hoge temperatuur voor maximale krokantheid.",
    "Beleg met kaas tot aan de rand voor het Detroit-effect.",
  ],

  plannerRoute: "/planner",
};

const romanPizzaTeglia: Recipe = {
  id: "roman-pizza-teglia",
  slug: "roman-pizza-teglia",
  name: "Roman Pizza in Teglia",
  category: "Pizza",
  tagline: "Luchtige teglia, open kruim en hoge hydratatie.",
  route: "/roman-pizza-teglia",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±36 uur",
    totalHoursMin: 24,
    totalHoursMax: 42,
    goodFor: "Teglia pizza, luchtige structuur en al taglio snijden.",
  },

  hydration: 80,
  starterPercentage: 10,
  flour: {
    breadFlour: 100,
  },
  fermentation: {
    factor: 0.95,
    coldProofMin: 12,
    coldProofMax: 36,
    baseBulkHours: 5,
  },

  introduction:
    "Een Roman pizza in teglia met 100% bread flour, 80% hydratatie, 10% starter, 2,8% zout en 2% olijfolie.",

  ingredients: [
    {
      id: "bread-flour",
      name: "Bread Flour (High Protein)",
      amount: "500 g",
      note: "100% bloem",
    },
    { id: "water", name: "Water", amount: "400 g", note: "80% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: "50 g",
      note: "10% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: "14 g", note: "2,8% van de bloem" },
    { id: "oil", name: "Olijfolie", amount: "10 g", note: "2% van de bloem" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen zodat hij actief en bubbelend is.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng bread flour, water, starter, zout en olijfolie tot een zeer soepel deeg.",
      durationLabel: "12–15 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat het deeg 4 tot 6 uur rijzen met regelmatige folds.",
      durationLabel: "4–6 uur",
    },
    {
      id: "pan",
      order: 4,
      title: "In de teglia",
      body: "Spreid het deeg voorzichtig uit in een ingevette teglia.",
      durationLabel: "20 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat het deeg 12 tot 36 uur rijzen in de koelkast.",
      durationLabel: "12–36 uur",
    },
    {
      id: "shape",
      order: 6,
      title: "Temperen",
      body: "Laat het deeg 1 tot 2 uur op kamertemperatuur komen.",
      durationLabel: "1–2 uur",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak in de teglia tot de bodem goudbruin en luchtig gaar is.",
      durationLabel: "12–16 min",
    },
  ],

  tips: [
    "Werk voorzichtig met hoog-hydratatie deeg om de luchtigheid te behouden.",
    "Gebruik olijfolie in de pan voor een knapperige onderkant.",
    "Snijd al taglio na een korte rust.",
  ],

  plannerRoute: "/planner",
};

const sicilianPanPizza: Recipe = {
  id: "sicilian-pan-pizza",
  slug: "sicilian-pan-pizza",
  name: "Sicilian Pan Pizza",
  category: "Pizza",
  tagline: "Dikke panpizza, gouden korst en rijke Siciliaanse smaak.",
  route: "/sicilian-pan-pizza",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±48 uur",
    totalHoursMin: 30,
    totalHoursMax: 54,
    goodFor: "Dikke panpizza, familie-avonden en royaal beleg.",
  },

  hydration: 72,
  starterPercentage: 10,
  flour: {
    breadFlour: 100,
  },
  fermentation: {
    factor: 0.92,
    coldProofMin: 24,
    coldProofMax: 48,
    baseBulkHours: 4,
  },

  introduction:
    "Een Sicilian pan pizza met 100% bread flour, 72% hydratatie, 10% starter, 2,5% zout en 3% olijfolie.",

  ingredients: [
    {
      id: "bread-flour",
      name: "Bread Flour (High Protein)",
      amount: "500 g",
      note: "100% bloem",
    },
    { id: "water", name: "Water", amount: "360 g", note: "72% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: "50 g",
      note: "10% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: "12,5 g", note: "2,5% van de bloem" },
    { id: "oil", name: "Olijfolie", amount: "15 g", note: "3% van de bloem" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen zodat hij actief en bubbelend is.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng bread flour, water, starter, zout en olijfolie tot een stevig pan-deeg.",
      durationLabel: "10–12 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat het deeg 3 tot 5 uur rijzen op kamertemperatuur.",
      durationLabel: "3–5 uur",
    },
    {
      id: "pan",
      order: 4,
      title: "In de pan",
      body: "Druk het deeg uit in een ingevette rechthoekige pan.",
      durationLabel: "20 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat het deeg 24 tot 48 uur rijzen in de koelkast.",
      durationLabel: "24–48 uur",
    },
    {
      id: "shape",
      order: 6,
      title: "Temperen",
      body: "Laat het deeg 1 tot 2 uur op kamertemperatuur komen.",
      durationLabel: "1–2 uur",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak tot de bodem diep goudbruin is en de kruim gaar.",
      durationLabel: "18–22 min",
    },
  ],

  tips: [
    "Gebruik een royale laag olie in de pan voor de klassieke Siciliaanse korst.",
    "Druk het deeg rustig uit zonder te veel gas te verliezen.",
    "Beleg royaal, maar bak tot de bodem volledig gaar is.",
  ],

  plannerRoute: "/planner",
};

export const recipes: RecipeRegistry = {
  "country-loaf": countryLoaf,
  "pain-de-campagne": painDeCampagne,
  "wit-busbrood": witBusbrood,
  volkoren,
  "donker-volkoren": donkerVolkoren,
  bagels,
  baguette,
  focaccia,
  brioche,
  meergranen,
  "napolitaanse-pizza": napolitaansePizza,
  "new-york-style-pizza": newYorkStylePizza,
  "detroit-style-pizza": detroitStylePizza,
  "roman-pizza-teglia": romanPizzaTeglia,
  "sicilian-pan-pizza": sicilianPanPizza,
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
