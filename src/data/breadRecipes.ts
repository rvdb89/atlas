import type { Recipe, RecipeStep } from "@/types/recipe";

const FLOUR_BASE = 500;

function saltAmount(percent: number) {
  return `${(FLOUR_BASE * (percent / 100)).toFixed(1).replace(".0", "")} g`;
}

function waterAmount(hydration: number) {
  return `${FLOUR_BASE * (hydration / 100)} g`;
}

function starterAmount(percent: number) {
  return `${FLOUR_BASE * (percent / 100)} g`;
}

function standardBreadSteps(
  bulkLabel: string,
  coldProofLabel: string,
): RecipeStep[] {
  return [
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
      body: "Meng bloem en water tot er geen droge stukken meer zijn. Laat rusten.",
      durationLabel: "30–45 min",
    },
    {
      id: "mix",
      order: 3,
      title: "Mengen",
      body: "Voeg starter en zout toe. Kneed tot het deeg soepel en samenhangend is.",
      durationLabel: "8–12 min",
    },
    {
      id: "bulk",
      order: 4,
      title: "Bulkfermentatie",
      body: "Laat rijzen op kamertemperatuur met regelmatige stretch-and-folds.",
      durationLabel: bulkLabel,
    },
    {
      id: "shape",
      order: 5,
      title: "Vormen",
      body: "Vorm het deeg en plaats het in een rijsmand of vorm.",
      durationLabel: "15 min",
    },
    {
      id: "cold-proof",
      order: 6,
      title: "Koel rijzen",
      body: "Laat het brood rijzen in de koelkast voor extra smaak.",
      durationLabel: coldProofLabel,
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak het brood heet af tot de korst diep gekarameliseerd is.",
      durationLabel: "35–45 min",
    },
  ];
}

export const countryLoaf: Recipe = {
  id: "country-loaf",
  slug: "country-loaf",
  name: "Country Loaf",
  category: "Brood",
  tagline: "Rustiek landbrood met open kruim en volle tarwesmaak.",
  route: "/country-loaf",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±24 uur",
    totalHoursMin: 20,
    totalHoursMax: 28,
    goodFor: "Dagelijks brood, toast, soep en sandwiches.",
  },

  hydration: 72,
  starterPercentage: 20,
  flour: { t65: 70, t80: 30 },
  fermentation: {
    factor: 1.0,
    coldProofMin: 12,
    coldProofMax: 24,
    baseBulkHours: 5,
  },

  introduction:
    "Een klassiek zuurdesem country loaf met een milde smaak, lichte zuurgraad en een open, luchtige kruim. Ideaal als eerste rustiek brood.",

  ingredients: [
    { id: "t65", name: "T65", amount: "350 g" },
    { id: "t80", name: "T80", amount: "150 g" },
    { id: "water", name: "Water", amount: waterAmount(72), note: "72% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(20),
      note: "20% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2), note: "2% van de bloem" },
  ],

  steps: standardBreadSteps("4–6 uur", "12–24 uur"),
  tips: [
    "Gebruik stretch-and-folds voor een openere kruim.",
    "Bak met stoom voor een knapperige korst.",
    "Laat volledig afkoelen voordat je snijdt.",
  ],

  plannerRoute: "/planner",
};

export const painDeCampagne: Recipe = {
  id: "pain-de-campagne",
  slug: "pain-de-campagne",
  name: "Pain de Campagne",
  category: "Brood",
  tagline: "⭐ Doughbert Signature — ons dagelijkse zuurdesembrood.",
  route: "/pain-de-campagne",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Doughbert Signature ⭐",
    durationLabel: "±24 uur",
    totalHoursMin: 20,
    totalHoursMax: 30,
    goodFor: "Dagelijks brood, ontbijt, lunch, toast en soep.",
  },

  hydration: 76,
  starterPercentage: 20,
  flour: { t65: 50, t80: 40, t130: 10 },
  fermentation: {
    factor: 1.0,
    coldProofMin: 12,
    coldProofMax: 24,
    baseBulkHours: 4.5,
  },

  introduction:
    "Het signature brood van Doughbert. Dunne knapperige korst, licht open kruim, volle tarwesmaak en een licht nootachtig karakter. Perfect als dagelijks zuurdesembrood.",

  ingredients: [
    { id: "t65", name: "T65", amount: "250 g" },
    { id: "t80", name: "T80", amount: "200 g" },
    { id: "t130", name: "T130", amount: "50 g" },
    { id: "water", name: "Water", amount: waterAmount(76), note: "76% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(20),
      note: "20% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2), note: "2% van de bloem" },
  ],

  steps: standardBreadSteps("4–5 uur", "12–24 uur"),
  tips: [
    "Doughberts favoriet voor elke dag — eenvoudig, vol en betrouwbaar.",
    "Bak op hoge temperatuur voor die dunne, knapperige korst.",
    "Combineert perfect met boter, kaas of een drizzle olijfolie.",
  ],

  plannerRoute: "/planner",
};

export const witBusbrood: Recipe = {
  id: "wit-busbrood",
  slug: "wit-busbrood",
  name: "Wit Busbrood",
  category: "Brood",
  tagline: "Zacht, licht en perfect voor dagelijks gebruik.",
  route: "/wit-busbrood",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±20 uur",
    totalHoursMin: 16,
    totalHoursMax: 24,
    goodFor: "Sandwiches, toast en lichte maaltijden.",
  },

  hydration: 68,
  starterPercentage: 18,
  flour: { t65: 100 },
  fermentation: {
    factor: 0.95,
    coldProofMin: 8,
    coldProofMax: 16,
    baseBulkHours: 4,
  },

  introduction:
    "Een mild wit zuurdesem busbrood met zachte kruim en subtiele zuurgraad. Toegankelijk en veelzijdig voor elke dag.",

  ingredients: [
    { id: "t65", name: "T65", amount: "500 g" },
    { id: "water", name: "Water", amount: waterAmount(68), note: "68% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(18),
      note: "18% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2), note: "2% van de bloem" },
  ],

  steps: standardBreadSteps("3–5 uur", "8–16 uur"),
  tips: [
    "Ideaal in een broodvorm voor een gelijkmatige snede.",
    "Houd de hydratatie iets lager voor een makkelijker te hanteren deeg.",
    "Perfect voor beginners die een zacht brood willen bakken.",
  ],

  plannerRoute: "/planner",
};

export const volkoren: Recipe = {
  id: "volkoren",
  slug: "volkoren",
  name: "Volkoren",
  category: "Brood",
  tagline: "Voller van smaak met meer body en vezels.",
  route: "/volkoren",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±24 uur",
    totalHoursMin: 20,
    totalHoursMax: 28,
    goodFor: "Gezond ontbijt, toast en belegde boterhammen.",
  },

  hydration: 74,
  starterPercentage: 20,
  flour: { t80: 30, t110: 70 },
  fermentation: {
    factor: 0.95,
    coldProofMin: 12,
    coldProofMax: 20,
    baseBulkHours: 5,
  },

  introduction:
    "Een klassiek volkoren zuurdesembrood met diepere smaak, stevigere bite en een voedzame kruim. Gebalanceerd voor thuisbakkers.",

  ingredients: [
    { id: "t80", name: "T80", amount: "150 g" },
    { id: "t110", name: "T110", amount: "350 g" },
    { id: "water", name: "Water", amount: waterAmount(74), note: "74% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(20),
      note: "20% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2.2), note: "2,2% van de bloem" },
  ],

  steps: standardBreadSteps("4–6 uur", "12–20 uur"),
  tips: [
    "Volkoren deeg vraagt iets meer geduld tijdens het rijzen.",
    "Gebruik voldoende stretch-and-folds voor structuur.",
    "Snijd pas als het brood volledig is afgekoeld.",
  ],

  plannerRoute: "/planner",
};

export const donkerVolkoren: Recipe = {
  id: "donker-volkoren",
  slug: "donker-volkoren",
  name: "Donker Volkoren",
  category: "Brood",
  tagline: "Diep, robuust en vol karakter.",
  route: "/donker-volkoren",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±28 uur",
    totalHoursMin: 22,
    totalHoursMax: 32,
    goodFor: "Sterke smaken, kaas, soep en hartige toppings.",
  },

  hydration: 78,
  starterPercentage: 22,
  flour: { t130: 50, t150: 50 },
  fermentation: {
    factor: 0.9,
    coldProofMin: 12,
    coldProofMax: 24,
    baseBulkHours: 5.5,
  },

  introduction:
    "Een donker volkoren zuurdesembrood met intense graansmaak, stevige kruim en een robuuste korst. Voor liefhebbers van karakter.",

  ingredients: [
    { id: "t130", name: "T130", amount: "250 g" },
    { id: "t150", name: "T150", amount: "250 g" },
    { id: "water", name: "Water", amount: waterAmount(78), note: "78% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(22),
      note: "22% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2.2), note: "2,2% van de bloem" },
  ],

  steps: standardBreadSteps("5–7 uur", "12–24 uur"),
  tips: [
    "Donkere bloem absorbeert meer water — kneed tot soepel deeg.",
    "Langere rijsing geeft een mildere zuurgraad.",
    "Heerlijk met boter, oude kaas of gezouten noten.",
  ],

  plannerRoute: "/planner",
};

export const bagels: Recipe = {
  id: "bagels",
  slug: "bagels",
  name: "Bagels",
  category: "Brood",
  tagline: "Chewy, glanzend en klassiek New York-style.",
  route: "/bagels",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±18 uur",
    totalHoursMin: 14,
    totalHoursMax: 22,
    goodFor: "Ontbijt, brunch, cream cheese en beleg.",
  },

  hydration: 58,
  starterPercentage: 15,
  flour: { t65: 100 },
  fermentation: {
    factor: 0.85,
    coldProofMin: 12,
    coldProofMax: 18,
    baseBulkHours: 3,
  },

  introduction:
    "Authentieke zuurdesem bagels met stevige bite, glanzende korst en klassieke chewy structuur. Na het rijzen koken voor die typische bagel-textuur.",

  ingredients: [
    { id: "t65", name: "T65", amount: "500 g" },
    { id: "water", name: "Water", amount: waterAmount(58), note: "58% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(15),
      note: "15% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2), note: "2% van de bloem" },
    { id: "malt", name: "Barley malt", amount: "10 g", note: "Voor kleur en smaak" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng tot een stevig, soepel deeg met goede elasticiteit.",
      durationLabel: "10–12 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat 2 tot 3 uur rijzen op kamertemperatuur.",
      durationLabel: "2–3 uur",
    },
    {
      id: "divide",
      order: 4,
      title: "Vormen",
      body: "Verdeel, vorm bollen en maak gaten in het midden.",
      durationLabel: "20 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat 12 tot 18 uur rijzen in de koelkast.",
      durationLabel: "12–18 uur",
    },
    {
      id: "boil",
      order: 6,
      title: "Koken",
      body: "Kook kort in water met barley malt voor glans en bite.",
      durationLabel: "1 min per kant",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak tot goudbruin en stevig.",
      durationLabel: "18–22 min",
    },
  ],

  tips: [
    "Koken is essentieel voor de klassieke bagel-textuur.",
    "Werk met een stevig deeg — bagels mogen niet te nat zijn.",
    "Serveer warm met roomkaas of gerookte zalm.",
  ],

  plannerRoute: "/planner",
};

export const baguette: Recipe = {
  id: "baguette",
  slug: "baguette",
  name: "Baguette",
  category: "Brood",
  tagline: "Luchtige kruim, dunne korst en Franse elegantie.",
  route: "/baguette",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±20 uur",
    totalHoursMin: 16,
    totalHoursMax: 24,
    goodFor: "Kaas, boter, soep en tafelbrood.",
  },

  hydration: 66,
  starterPercentage: 20,
  flour: { t65: 90, t80: 10 },
  fermentation: {
    factor: 0.9,
    coldProofMin: 8,
    coldProofMax: 16,
    baseBulkHours: 3.5,
  },

  introduction:
    "Een klassieke zuurdesem baguette met luchtige kruim, dunne knapperige korst en subtiele zuurgraad. Geoptimaliseerd voor thuisbakkers.",

  ingredients: [
    { id: "t65", name: "T65", amount: "450 g" },
    { id: "t80", name: "T80", amount: "50 g" },
    { id: "water", name: "Water", amount: waterAmount(66), note: "66% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(20),
      note: "20% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2), note: "2% van de bloem" },
  ],

  steps: standardBreadSteps("3–4 uur", "8–16 uur"),
  tips: [
    "Vorm voorzichtig om de luchtigheid te behouden.",
    "Bak op hoge temperatuur met stoom.",
    "Beste op de dag van bakken.",
  ],

  plannerRoute: "/planner",
};

export const focaccia: Recipe = {
  id: "focaccia",
  slug: "focaccia",
  name: "Focaccia",
  category: "Brood",
  tagline: "Luchtig, olijfolie-rijk en mediterrane smaak.",
  route: "/focaccia",

  meta: {
    difficulty: "beginner",
    difficultyLabel: "Beginner ⭐",
    durationLabel: "±18 uur",
    totalHoursMin: 14,
    totalHoursMax: 22,
    goodFor: "Borrel, soep, olijfolie en rozemarijn.",
  },

  hydration: 78,
  starterPercentage: 15,
  flour: { t65: 100 },
  fermentation: {
    factor: 0.95,
    coldProofMin: 12,
    coldProofMax: 24,
    baseBulkHours: 4,
  },

  introduction:
    "Een klassieke zuurdesem focaccia met hoge hydratatie, zachte kruim en rijke olijfolie-smaak. Perfect in een ingevette pan.",

  ingredients: [
    { id: "t65", name: "T65", amount: "500 g" },
    { id: "water", name: "Water", amount: waterAmount(78), note: "78% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(15),
      note: "15% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2.5), note: "2,5% van de bloem" },
    { id: "oil", name: "Olijfolie", amount: "40 g", note: "Extra virgin" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng bloem, water, starter, zout en olijfolie tot een nat, soepel deeg.",
      durationLabel: "10 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat 3 tot 5 uur rijzen met regelmatige folds.",
      durationLabel: "3–5 uur",
    },
    {
      id: "pan",
      order: 4,
      title: "In de pan",
      body: "Spreid het deeg uit in een royale laag olijfolie.",
      durationLabel: "20 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat 12 tot 24 uur rijzen in de koelkast.",
      durationLabel: "12–24 uur",
    },
    {
      id: "dimple",
      order: 6,
      title: "Dimple & topping",
      body: "Maak kuiltjes, besprenkel met olijfolie en voeg rozemarijn toe.",
      durationLabel: "10 min",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak tot goudbruin en luchtig.",
      durationLabel: "25–30 min",
    },
  ],

  tips: [
    "Gebruik royale olijfolie in de pan voor de beste textuur.",
    "Dimple het deeg vlak voor het bakken.",
    "Proef met rozemarijn, zeezout of cherrytomaatjes.",
  ],

  plannerRoute: "/planner",
};

export const brioche: Recipe = {
  id: "brioche",
  slug: "brioche",
  name: "Brioche",
  category: "Brood",
  tagline: "Rijk, boterig en verfijnd zoet brood.",
  route: "/brioche",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±16 uur",
    totalHoursMin: 12,
    totalHoursMax: 20,
    goodFor: "Ontbijt, brunch, French toast en zoete toppings.",
  },

  hydration: 58,
  starterPercentage: 20,
  flour: { t65: 100 },
  fermentation: {
    factor: 0.85,
    coldProofMin: 8,
    coldProofMax: 14,
    baseBulkHours: 3,
  },

  introduction:
    "Een zuurdesem brioche met rijke botersmaak, zachte kruim en verfijnde zoetheid. Enriched deeg dat vraagt om geduld en koele rijsing.",

  ingredients: [
    { id: "t65", name: "T65", amount: "500 g" },
    { id: "water", name: "Water", amount: waterAmount(58), note: "58% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(20),
      note: "20% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2), note: "2% van de bloem" },
    { id: "butter", name: "Boter", amount: "125 g", note: "Zacht" },
    { id: "eggs", name: "Eieren", amount: "100 g", note: "Losgeklopt" },
    { id: "milk", name: "Melk", amount: "50 g", note: "Kamertemperatuur" },
  ],

  steps: [
    {
      id: "feed-starter",
      order: 1,
      title: "Starter voeden",
      body: "Voed je starter 6 tot 10 uur voor het mixen.",
      durationLabel: "6–10 uur",
    },
    {
      id: "mix",
      order: 2,
      title: "Deeg maken",
      body: "Meng bloem, eieren, melk, starter en zout. Voeg boter geleidelijk toe.",
      durationLabel: "15–18 min",
    },
    {
      id: "bulk",
      order: 3,
      title: "Bulkfermentatie",
      body: "Laat 2 tot 4 uur rijzen op kamertemperatuur.",
      durationLabel: "2–4 uur",
    },
    {
      id: "shape",
      order: 4,
      title: "Vormen",
      body: "Vorm in bollen of een broodvorm.",
      durationLabel: "15 min",
    },
    {
      id: "cold-proof",
      order: 5,
      title: "Koel rijzen",
      body: "Laat 8 tot 14 uur rijzen in de koelkast.",
      durationLabel: "8–14 uur",
    },
    {
      id: "egg-wash",
      order: 6,
      title: "Eiwash",
      body: "Bestrijk met losgeklopt ei voor glans.",
      durationLabel: "5 min",
    },
    {
      id: "bake",
      order: 7,
      title: "Bakken",
      body: "Bak tot diep goudbruin en gaar.",
      durationLabel: "30–35 min",
    },
  ],

  tips: [
    "Voeg boter pas toe als het deeg enige structuur heeft.",
    "Koel rijzen maakt het rijke deeg makkelijker te hanteren.",
    "Heerlijk als French toast of met confituur.",
  ],

  plannerRoute: "/planner",
};

export const meergranen: Recipe = {
  id: "meergranen",
  slug: "meergranen",
  name: "Meergranen",
  category: "Brood",
  tagline: "Complexe graansmaken in één harmonieus brood.",
  route: "/meergranen",

  meta: {
    difficulty: "intermediate",
    difficultyLabel: "Gemiddeld ⭐⭐",
    durationLabel: "±26 uur",
    totalHoursMin: 20,
    totalHoursMax: 30,
    goodFor: "Ontbijt, toast, kaas en hartige beleg.",
  },

  hydration: 72,
  starterPercentage: 20,
  flour: { t65: 50, t80: 20, t110: 15, t130: 10, rye: 5 },
  fermentation: {
    factor: 0.95,
    coldProofMin: 12,
    coldProofMax: 24,
    baseBulkHours: 5,
  },

  introduction:
    "Een meergranen zuurdesembrood met diepe, gelaagde smaak en een voedzame kruim. Een harmonieuze mix van tarwe en een vleug rogge.",

  ingredients: [
    { id: "t65", name: "T65", amount: "250 g" },
    { id: "t80", name: "T80", amount: "100 g" },
    { id: "t110", name: "T110", amount: "75 g" },
    { id: "t130", name: "T130", amount: "50 g" },
    { id: "rye", name: "Rogge", amount: "25 g" },
    { id: "water", name: "Water", amount: waterAmount(72), note: "72% hydratatie" },
    {
      id: "starter",
      name: "Actieve zuurdesem starter",
      amount: starterAmount(20),
      note: "20% · 100% hydratatie",
    },
    { id: "salt", name: "Zout", amount: saltAmount(2.2), note: "2,2% van de bloem" },
  ],

  steps: standardBreadSteps("4–6 uur", "12–24 uur"),
  tips: [
    "Rogge geeft extra diepte — houd het percentage beperst voor balans.",
    "Langzaam rijzen ontwikkelt de complexe graansmaken.",
    "Perfect met oude kaas of notenpasta.",
  ],

  plannerRoute: "/planner",
};
