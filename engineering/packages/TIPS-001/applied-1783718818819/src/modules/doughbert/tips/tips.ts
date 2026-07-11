import type {
  Tip,
  TipCategory,
  TipCategoryId,
  TipCategoryRegistry,
  TipDefinition,
  TipRegistry,
} from "@/types/tip";

function tip(
  id: string,
  categoryId: TipCategoryId,
  text: string,
  order: number,
): TipDefinition {
  return { id, categoryId, text, order };
}

export const tipCategories: TipCategoryRegistry = {
  brood: {
    id: "brood",
    emoji: "🍞",
    title: "Brood",
    description: "Praktische tips voor zuurdesembrood thuis.",
    order: 1,
  },
  pizza: {
    id: "pizza",
    emoji: "🍕",
    title: "Pizza",
    description: "Slimme trucs voor pizzadeeg en bakken.",
    order: 2,
  },
  starter: {
    id: "starter",
    emoji: "🫙",
    title: "Starter",
    description: "Houd je starter actief en betrouwbaar.",
    order: 3,
  },
  temperatuur: {
    id: "temperatuur",
    emoji: "🌡",
    title: "Temperatuur",
    description: "Temperatuur beheersen voor consistent deeg.",
    order: 4,
  },
  "oven-bakken": {
    id: "oven-bakken",
    emoji: "🔥",
    title: "Oven & bakken",
    description: "Voorverwarmen, hitte en bakresultaat.",
    order: 5,
  },
  "plakken-voorkomen": {
    id: "plakken-voorkomen",
    emoji: "✋",
    title: "Plakken voorkomen",
    description: "Deeg, banneton en werkbank plakvrij houden.",
    order: 6,
  },
  "snelle-reddingen": {
    id: "snelle-reddingen",
    emoji: "🚑",
    title: "Snelle reddingen",
    description: "Directe oplossingen als het misgaat.",
    order: 7,
  },
};

export const tipCategoryList: TipCategory[] = Object.values(tipCategories).sort(
  (a, b) => a.order - b.order,
);

const TIP_DEFINITIONS: TipDefinition[] = [
  tip(
    "brood-koud-water",
    "brood",
    "Gebruik koud water als het warm is in huis — zo houd je de deegtemperatuur onder controle.",
    1,
  ),
  tip(
    "brood-plakkerig-rusten",
    "brood",
    "Laat plakkerig deeg 20 minuten rusten voordat je verder werkt; het wordt vaak vanzelf handelbaarder.",
    2,
  ),
  tip(
    "brood-warm-weer",
    "brood",
    "Bij warm weer fermenteert deeg sneller; verkort je bulk of zet hem in de koelkast.",
    3,
  ),
  tip(
    "brood-koude-keuken",
    "brood",
    "Bij koude keukens duurt fermentatie langer — plan extra tijd of zoek een warmere plek.",
    4,
  ),
  tip(
    "brood-ovenspring-check",
    "brood",
    "Geen ovenspring? Check fermentatie, spanning in het deeg en of je oven heet genoeg is.",
    5,
  ),

  tip(
    "pizza-semola-schep",
    "pizza",
    "Gebruik semola op je pizzaschep — zo glijdt de pizza makkelijker de oven in.",
    1,
  ),
  tip(
    "pizza-kamertemperatuur",
    "pizza",
    "Laat pizzadeeg op kamertemperatuur komen voordat je uitrekt; koud deeg scheurt sneller.",
    2,
  ),
  tip(
    "pizza-staal-voorverwarmen",
    "pizza",
    "Verwarm je pizza steel minimaal 45 minuten op de hoogste stand voor je bakt.",
    3,
  ),
  tip(
    "pizza-niet-te-dun",
    "pizza",
    "Rek pizza niet te dun aan de rand — een iets dikkere rand geeft betere oven spring.",
    4,
  ),

  tip(
    "starter-koelkast-activeren",
    "starter",
    "Als je starter uit de koelkast komt, voed hem eerst 1 tot 2 keer voordat je bakt.",
    1,
  ),
  tip(
    "starter-op-piek",
    "starter",
    "Gebruik je starter op piek — bubbelend, licht gezond en net verdubbeld of verdrievoudigd.",
    2,
  ),
  tip(
    "starter-te-zuur",
    "starter",
    "Te zure starter? Voed vaker met kleinere hoeveelheden tot hij weer mild ruikt.",
    3,
  ),
  tip(
    "starter-slapp",
    "starter",
    "Slappe starter? Verhoog de voedingsfrequentie en gebruik iets stijver meel.",
    4,
  ),

  tip(
    "temperatuur-koud-water",
    "temperatuur",
    "Gebruik koud water als het warm is in huis om je doel-deegtemperatuur te halen.",
    1,
  ),
  tip(
    "temperatuur-deeg-meten",
    "temperatuur",
    "Meet je deegtemperatuur — consistent deeg begint met consistente temperatuur.",
    2,
  ),
  tip(
    "temperatuur-warm-weer",
    "temperatuur",
    "Bij warm weer fermenteert deeg sneller; verkort je bulk of koel af.",
    3,
  ),
  tip(
    "temperatuur-koude-keuken",
    "temperatuur",
    "Bij koude keukens duurt fermentatie langer — reken op extra rijs- of bulkfermentatie.",
    4,
  ),

  tip(
    "oven-dutch-oven-voorverwarmen",
    "oven-bakken",
    "Verwarm een Dutch oven minimaal 45 minuten voor op de bakstand van je oven.",
    1,
  ),
  tip(
    "oven-pizza-staal",
    "oven-bakken",
    "Verwarm een pizza steel of steen lang genoeg — minstens 45 minuten op maximale stand.",
    2,
  ),
  tip(
    "oven-volledig-voorverwarmen",
    "oven-bakken",
    "Wacht tot je oven volledig is opgewarmd; korst en ovenspring hebben stabiele hitte nodig.",
    3,
  ),
  tip(
    "oven-stoom-brood",
    "oven-bakken",
    "Gebruik stoom of een gesloten deksel in de eerste bakfase voor een mooiere korst.",
    4,
  ),

  tip(
    "plakken-rijstmeel-banneton",
    "plakken-voorkomen",
    "Gebruik rijstmeel in je banneton — het plakt minder dan tarwebloem.",
    1,
  ),
  tip(
    "plakken-deeg-rusten",
    "plakken-voorkomen",
    "Deeg plakt? Laat het eerst 20 minuten rusten in plaats van extra bloem toe te voegen.",
    2,
  ),
  tip(
    "plakken-natte-handen",
    "plakken-voorkomen",
    "Natte handen werken beter dan extra bloem bij hoge hydratatie.",
    3,
  ),
  tip(
    "plakken-semola-pizza",
    "plakken-voorkomen",
    "Bestrooi je pizzaschep en werkbank licht met semola om plakken te voorkomen.",
    4,
  ),

  tip(
    "redding-deeg-plakt",
    "snelle-reddingen",
    "Deeg plakt? Laat het eerst rusten, gebruik natte handen en vermijd extra bloem.",
    1,
  ),
  tip(
    "redding-geen-ovenspring",
    "snelle-reddingen",
    "Geen ovenspring? Check fermentatie, spanning en oventemperatuur — meestal zit het daar.",
    2,
  ),
  tip(
    "redding-brood-rijst-niet",
    "snelle-reddingen",
    "Brood rijst niet? Controleer of je starter actief was en of het deeg warm genoeg staat.",
    3,
  ),
  tip(
    "redding-pizza-scheurt",
    "snelle-reddingen",
    "Pizza scheurt bij uitrekken? Laat het deeg langer op temperatuur komen en rek voorzichtig.",
    4,
  ),
  tip(
    "redding-bleke-korst",
    "snelle-reddingen",
    "Bleke korst? Bak langer of hoger af en zorg dat de oven echt heet is.",
    5,
  ),
  tip(
    "redding-verbrande-bodem",
    "snelle-reddingen",
    "Verbrande bodem? Zet een bakplaat onder je Dutch oven of bak iets korter op de onderste stand.",
    6,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "brood-weeg-je-ingredienten-af",
    "brood",
    "Weeg je ingrediënten af in plaats van te werken met kopjes of maatbekers; dat geeft veel consistentere resultaten.",
    6,
  ),
  tip(
    "brood-stoom-in-het-begin",
    "brood",
    "Stoom in het begin van het bakproces houdt de korst langer soepel, waardoor het brood beter kan uitzetten.",
    7,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "pizza-verdeel-de-tomatensaus-met",
    "pizza",
    "Verdeel de tomatensaus met de bolle kant van een lepel vanuit het midden naar buiten voor een gelijkmatige laag.",
    5,
  ),
  tip(
    "pizza-doe-niet-te-veel",
    "pizza",
    "Doe niet te veel toppings op je pizza, anders wordt het deeg drassig en bakt de bodem niet goed door.",
    6,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "starter-bewaar-je-starter-in",
    "starter",
    "Bewaar je starter in een doorzichtig potje zodat je de bubbels en volumegroei goed kunt zien.",
    5,
  ),
  tip(
    "starter-gebruik-lauw-water-rond",
    "starter",
    "Gebruik lauw water rond de twintig tot vijfentwintig graden om je starter gelijkmatig actief te houden.",
    6,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "temperatuur-zet-je-mixerkom-even",
    "temperatuur",
    "Zet je mixerkom even in de koelkast voordat je een warm keukendeeg gaat kneden.",
    5,
  ),
  tip(
    "temperatuur-laat-boter-en-eieren",
    "temperatuur",
    "Laat boter en eieren op kamertemperatuur komen voor een egaler resultaat bij taartbeslag.",
    6,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "oven-bakken-zet-een-bakje-water",
    "oven-bakken",
    "Zet een bakje water onderin de oven als je geen Dutch oven hebt, voor extra stoom rond het brood.",
    5,
  ),
  tip(
    "oven-bakken-zet-je-oven-altijd",
    "oven-bakken",
    "Zet je oven altijd op boven- en onderwarmte in plaats van hetelucht voor een gelijkmatigere korstvorming.",
    6,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "plakken-voorkomen-zet-plakkerig-deeg-vijftien",
    "plakken-voorkomen",
    "Zet plakkerig deeg vijftien minuten in de koelkast voordat je het vormt, koud deeg werkt veel makkelijker.",
    5,
  ),
  tip(
    "plakken-voorkomen-bevochtig-je-deegschraper-met",
    "plakken-voorkomen",
    "Bevochtig je deegschraper met water in plaats van bloem, zo glijdt kleverig deeg er moeiteloos vanaf.",
    6,
  ),

  // TIPS-001 · nieuw gegenereerd, 2026-07-10
  tip(
    "snelle-reddingen-deeg-scheurt-tijdens-het",
    "snelle-reddingen",
    "Deeg scheurt tijdens het vouwen? Geef het een korte rustpauze zodat het gluten kan ontspannen.",
    7,
  ),
  tip(
    "snelle-reddingen-brood-te-dicht-van",
    "snelle-reddingen",
    "Brood te dicht van structuur? Verleng de bulkfermentatie in plaats van meer gist toe te voegen.",
    8,
  ),
];

function buildTipRegistry(definitions: TipDefinition[]): TipRegistry {
  return definitions.reduce<TipRegistry>((registry, definition) => {
    registry[definition.id] = { ...definition };
    return registry;
  }, {});
}

export const tips: TipRegistry = buildTipRegistry(TIP_DEFINITIONS);

export const tipList: Tip[] = Object.values(tips).sort((a, b) => a.order - b.order);

export function getTipCategory(id: TipCategoryId): TipCategory {
  return tipCategories[id];
}

export function getTipsByCategory(categoryId: TipCategoryId): Tip[] {
  return tipList
    .filter((item) => item.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
}
