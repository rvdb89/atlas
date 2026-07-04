import type { RecipeKnowledge } from "@/types/knowledge";
import type { KnowledgeBiteId } from "@/types/knowledgeBite";

export type RecipeId =
  | "country-loaf"
  | "pain-de-campagne"
  | "wit-busbrood"
  | "volkoren"
  | "donker-volkoren"
  | "bagels"
  | "baguette"
  | "focaccia"
  | "brioche"
  | "meergranen"
  | "napolitaanse-pizza"
  | "new-york-style-pizza"
  | "detroit-style-pizza"
  | "roman-pizza-teglia"
  | "sicilian-pan-pizza";

export type RecipeCategory = "Brood" | "Pizza";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type FlourKey =
  | "tipo00"
  | "breadFlour"
  | "t65"
  | "t80"
  | "t110"
  | "t130"
  | "t150"
  | "wholeWheat"
  | "rye"
  | "semola";

export type FlourMix = Partial<Record<FlourKey, number>>;

export interface FermentationProfile {
  /** Multiplier applied to bulk fermentation time in the planner engine. */
  factor: number;
  coldProofMin: number;
  coldProofMax: number;
  /** Default bulk fermentation hours before temperature adjustment. */
  baseBulkHours: number;
}

export interface RecipeMeta {
  difficulty: DifficultyLevel;
  /** Human-readable label shown on cards and detail pages. */
  difficultyLabel: string;
  /** Short duration copy, e.g. "±24 uur". */
  durationLabel: string;
  totalHoursMin: number;
  totalHoursMax: number;
  goodFor: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  note?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  title: string;
  body: string;
  durationLabel?: string;
}

/**
 * Shared recipe model used by all bread recipe detail pages.
 * Every recipe exposes the same sections so one layout can render any recipe.
 */
export interface Recipe {
  id: RecipeId;
  slug: string;
  name: string;
  category: RecipeCategory;
  tagline: string;
  route: string;

  meta: RecipeMeta;

  /** Baker's percentage hydration. */
  hydration: number;
  /** Baker's percentage of active starter in the final dough. */
  starterPercentage: number;
  flour: FlourMix;
  fermentation: FermentationProfile;

  /** Intro copy shown below the title on the recipe page. */
  introduction: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tips: string[];

  /** Modular knowledge sections — optional, rendered when present. */
  knowledge?: RecipeKnowledge;

  /** Links this recipe to a Knowledge Bite detail page. */
  knowledgeBiteId?: KnowledgeBiteId;

  /** Route used by the "Start Bake Planner" action. */
  plannerRoute: string;
}

export type RecipeRegistry = Record<RecipeId, Recipe>;
