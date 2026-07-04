import { getRecipeBySlug } from "@/data/recipes";
import type { Recipe } from "@/types/recipe";

import type { PublicationDraft } from "@/atlas/publishing/types";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

export type ExtractedBakingMetrics = {
  hydration?: number;
  saltPercent?: number;
  starterPercent?: number;
  yeastPercent?: number;
  bulkHours?: number;
  coldProofHours?: number;
  doughTempC?: number;
  waterTempC?: number;
  ovenTempC?: number;
  bakeMinutes?: number;
  flourKeys: string[];
  techniques: string[];
  hasAutolyse: boolean;
  hasStretchAndFold: boolean;
  hasCoilFold: boolean;
  hasColdProof: boolean;
  hasBulkFermentation: boolean;
  hasTemperatureAdvice: boolean;
  stepCount: number;
  ingredientCount: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  linkedRecipe?: Recipe;
};

const HYDRATION_PATTERN = /(\d{2,3})\s*%/g;
const HOURS_PATTERN = /(\d+(?:[.,]\d+)?)\s*(?:uur|u\b|hours?)/gi;
const TEMP_PATTERN = /(\d{2,3})\s*°?\s*c\b/gi;

function getKnowledgePayload(draft: PublicationDraft): KnowledgeArticleInput | undefined {
  return draft.contentPayload as KnowledgeArticleInput | undefined;
}

function collectText(draft: PublicationDraft): string {
  const knowledge = getKnowledgePayload(draft);
  const parts = [
    draft.title,
    draft.subtitle,
    knowledge?.content?.summary ?? "",
    ...(knowledge?.content?.sections ?? []).flatMap((section) => [
      section.title,
      section.body,
      ...(section.keyPoints ?? []),
    ]),
  ];

  return parts.join("\n").toLowerCase();
}

function detectFlours(text: string): string[] {
  const keys: string[] = [];
  const patterns: [string, RegExp][] = [
    ["t65", /\bt65\b|\bt-?65\b/],
    ["t80", /\bt80\b|\bt-?80\b/],
    ["t110", /\bt110\b/],
    ["t130", /\bt130\b/],
    ["t150", /\bt150\b/],
    ["tipo-00", /\btipo\s*00\b|\btipo-00\b/],
    ["volkoren", /volkoren/],
    ["rogge", /rogge|roggemeel/],
    ["semola", /semola/],
    ["patentbloem", /patentbloem/],
    ["tarwebloem", /tarwebloem/],
  ];

  for (const [key, pattern] of patterns) {
    if (pattern.test(text)) {
      keys.push(key);
    }
  }

  return keys;
}

function detectTechniques(text: string) {
  return {
    hasAutolyse: /autolyse/.test(text),
    hasStretchAndFold: /stretch\s*(?:&|and)\s*fold|stretch-and-fold/.test(text),
    hasCoilFold: /coil\s*fold|coil-fold/.test(text),
    hasColdProof: /cold\s*proof|koel\s*rijzen|koelkast/.test(text),
    hasBulkFermentation: /bulk\s*ferment|bulkfermentatie|bulk fermentatie/.test(text),
    hasTemperatureAdvice: /deegtemperatuur|ddt|watertemperatuur|°c|graden/.test(text),
  };
}

function firstPercentageNear(text: string, keyword: string): number | undefined {
  const index = text.indexOf(keyword);
  if (index === -1) {
    return undefined;
  }

  const slice = text.slice(Math.max(0, index - 30), index + 80);
  const match = slice.match(/(\d{2,3})\s*%/);
  return match ? Number.parseInt(match[1], 10) : undefined;
}

function extractFromRecipe(recipe: Recipe): ExtractedBakingMetrics {
  const text = [
    recipe.introduction,
    ...recipe.steps.map((step) => `${step.title} ${step.body}`),
    ...recipe.tips,
  ]
    .join("\n")
    .toLowerCase();

  const techniques = detectTechniques(text);

  return {
    hydration: recipe.hydration,
    saltPercent: 2,
    starterPercent: recipe.starterPercentage,
    bulkHours: recipe.fermentation.baseBulkHours,
    coldProofHours: recipe.fermentation.coldProofMax,
    flourKeys: Object.keys(recipe.flour),
    techniques: [],
    ...techniques,
    stepCount: recipe.steps.length,
    ingredientCount: recipe.ingredients.length,
    difficulty: recipe.meta.difficulty,
    linkedRecipe: recipe,
  };
}

/** Pulls baking metrics from linked recipes or editorial draft text. */
export function extractBakingMetrics(draft: PublicationDraft): ExtractedBakingMetrics {
  const linkedRecipe = getRecipeBySlug(draft.slug);
  if (linkedRecipe) {
    return extractFromRecipe(linkedRecipe);
  }

  const text = collectText(draft);
  const techniques = detectTechniques(text);
  const hydrationMatch = text.match(/hydratatie[^\d]*(\d{2,3})\s*%/);
  const hydrationFromRange = text.match(/(\d{2,3})\s*%\s*en\s*(\d{2,3})\s*%/);

  let hydration: number | undefined;
  if (hydrationMatch) {
    hydration = Number.parseInt(hydrationMatch[1], 10);
  } else if (hydrationFromRange) {
    hydration = Math.round(
      (Number.parseInt(hydrationFromRange[1], 10) +
        Number.parseInt(hydrationFromRange[2], 10)) /
        2,
    );
  } else {
    const allPercents = [...text.matchAll(HYDRATION_PATTERN)].map((m) =>
      Number.parseInt(m[1], 10),
    );
    hydration = allPercents.find((value) => value >= 55 && value <= 100);
  }

  const hoursMatches = [...text.matchAll(HOURS_PATTERN)].map((m) =>
    Number.parseFloat(m[1].replace(",", ".")),
  );

  return {
    hydration,
    saltPercent: firstPercentageNear(text, "zout"),
    starterPercent: firstPercentageNear(text, "starter"),
    bulkHours: hoursMatches.find((h) => h >= 1 && h <= 12),
    coldProofHours: hoursMatches.find((h) => h >= 4 && h <= 48),
    doughTempC: [...text.matchAll(TEMP_PATTERN)].map((m) => Number.parseInt(m[1], 10)).find((t) => t >= 20 && t <= 35),
    flourKeys: detectFlours(text),
    techniques: [],
    ...techniques,
    stepCount: getKnowledgePayload(draft)?.content?.sections?.length ?? 0,
    ingredientCount: 0,
    difficulty: getKnowledgePayload(draft)?.metadata?.difficulty ?? "beginner",
  };
}
