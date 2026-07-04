import type { KnowledgeBiteId } from "@/types/knowledgeBite";

export type FlourGuideEntry = {
  /** Knowledge Bite slug — links to /knowledge/{slug} */
  slug: KnowledgeBiteId;
  name: string;
  flavor: string;
  waterAbsorption: string;
  difficulty: string;
  bestUse: string;
};

export type FlourGuideGroup = {
  title: string;
  entries: FlourGuideEntry[];
};

export const MEELWIJZER_TITLE = "🌾 Meelwijzer";

export const MEELWIJZER_HEADERS = [
  "Meelsoort",
  "Smaak",
  "Wateropname",
  "Moeilijkheid",
  "Beste toepassing",
] as const;

const FRENCH_FLOUR_ENTRIES: FlourGuideEntry[] = [
  {
    slug: "t65",
    name: "T65",
    flavor: "⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐",
    difficulty: "⭐⭐",
    bestUse: "Allround zuurdesem",
  },
  {
    slug: "t80",
    name: "T80",
    flavor: "⭐⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐⭐",
    difficulty: "⭐⭐⭐",
    bestUse: "Rustieke broden",
  },
  {
    slug: "t110",
    name: "T110",
    flavor: "⭐⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐⭐⭐",
    difficulty: "⭐⭐⭐",
    bestUse: "Bruine broden",
  },
  {
    slug: "t130",
    name: "T130",
    flavor: "⭐⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐⭐⭐",
    difficulty: "⭐⭐⭐⭐",
    bestUse: "Smaakmaker",
  },
  {
    slug: "t150",
    name: "T150",
    flavor: "⭐⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐⭐⭐",
    difficulty: "⭐⭐⭐⭐⭐",
    bestUse: "Volkorenbroden",
  },
];

const DUTCH_FLOUR_ENTRIES: FlourGuideEntry[] = [
  {
    slug: "patentbloem",
    name: "Patentbloem",
    flavor: "⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐",
    difficulty: "⭐⭐",
    bestUse: "Wit brood & gebak",
  },
  {
    slug: "tarwebloem",
    name: "Tarwebloem",
    flavor: "⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐",
    difficulty: "⭐⭐",
    bestUse: "Brood & pizza",
  },
  {
    slug: "volkorenmeel",
    name: "Volkorenmeel",
    flavor: "⭐⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐⭐⭐",
    difficulty: "⭐⭐⭐⭐",
    bestUse: "Gezonde broden",
  },
  {
    slug: "rogge",
    name: "Roggemeel",
    flavor: "⭐⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐⭐",
    difficulty: "⭐⭐⭐⭐",
    bestUse: "Roggebrood & zuurdesem",
  },
  {
    slug: "spelt",
    name: "Speltmeel",
    flavor: "⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐",
    difficulty: "⭐⭐⭐",
    bestUse: "Lichte speltbroden",
  },
];

const ITALIAN_FLOUR_ENTRIES: FlourGuideEntry[] = [
  {
    slug: "tipo-00",
    name: "Tipo 00",
    flavor: "⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐",
    difficulty: "⭐⭐",
    bestUse: "Napolitaanse pizza",
  },
  {
    slug: "semola-rimacinata",
    name: "Semola Rimacinata",
    flavor: "⭐⭐⭐⭐",
    waterAbsorption: "⭐⭐⭐",
    difficulty: "⭐⭐",
    bestUse: "Pizza & pasta",
  },
];

/** Grouped comparison data for the Meel & Bloem category overview. */
export const MEELWIJZER_GROUPS: FlourGuideGroup[] = [
  { title: "Franse bloem", entries: FRENCH_FLOUR_ENTRIES },
  { title: "Nederlandse meelsoorten", entries: DUTCH_FLOUR_ENTRIES },
  { title: "Italiaanse meelsoorten", entries: ITALIAN_FLOUR_ENTRIES },
];

/** Flat list — all Meelwijzer rows in display order. */
export const MEELWIJZER_ENTRIES: FlourGuideEntry[] = MEELWIJZER_GROUPS.flatMap(
  (group) => group.entries,
);

export function getFlourGuideBiteRoute(slug: string): string {
  return `/knowledge/${slug}`;
}
