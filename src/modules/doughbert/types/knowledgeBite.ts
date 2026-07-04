import type { RecipeId } from "@/types/recipe";

export type KnowledgeBiteCategoryId =
  | "brood"
  | "pizza"
  | "meel-bloem"
  | "starter"
  | "hydratatie"
  | "fermentatie"
  | "technieken"
  | "temperaturen"
  | "bakwetenschap";

/** Slug/id for any knowledge bite — recipe ids remain valid recipe slugs. */
export type KnowledgeBiteId = string;

/** Tip id from src/data/tips.ts */
export type TipId = string;

export type KnowledgeBiteDifficulty = "beginner" | "intermediate" | "advanced";

export type KnowledgeBiteStatus = "draft" | "review" | "verified" | "published";

/**
 * Standard section ids for the Doughbert Knowledge article layout.
 * Not every article uses every section — omit unused sections in data.
 */
export type KnowledgeBiteSectionId =
  | "what-is-it"
  | "properties"
  | "comparison"
  | "science"
  | "when-to-use"
  | "when-not-to-use"
  | "common-mistakes"
  | "doughbert-tip"
  | "faq"
  | "did-you-know";

export interface KnowledgeBiteCategory {
  id: KnowledgeBiteCategoryId;
  emoji: string;
  title: string;
  /** Short description shown on the library overview. */
  description: string;
  order: number;
}

/** Tabular data for properties or comparison sections. */
export interface KnowledgeBiteTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface KnowledgeBiteQuote {
  text: string;
  attribution?: string;
}

export interface KnowledgeBiteFaqItem {
  question: string;
  answer: string;
}

export interface KnowledgeBiteMistake {
  mistake: string;
  cause: string;
  solution: string;
}

export interface KnowledgeBiteDidYouKnow {
  title: string;
  fact: string;
}

/** One row in the compact 🌾 Doughbert Advies table. */
export interface KnowledgeBiteAdviceRow {
  goal: string;
  choice: string;
}

/** One editorial section within a Knowledge Bite article. */
export interface KnowledgeBiteSection {
  id?: KnowledgeBiteSectionId;
  title: string;
  body: string;
  keyPoints: string[];
  doughbertTip?: string;
  relatedKnowledge: KnowledgeBiteId[];
  table?: KnowledgeBiteTable;
  comparisonTable?: KnowledgeBiteTable;
  quote?: KnowledgeBiteQuote;
  faq?: KnowledgeBiteFaqItem[];
  mistakes?: KnowledgeBiteMistake[];
  didYouKnow?: KnowledgeBiteDidYouKnow[];
}

/** Article body — summary plus modular sections. */
export interface KnowledgeBiteBody {
  summary: string;
  sections: KnowledgeBiteSection[];
  /** Optional compact advice table — shown as 🌾 Doughbert Advies. */
  doughbertAdvice?: KnowledgeBiteAdviceRow[];
  /** Optional custom column headers for the advice table. */
  doughbertAdviceHeaders?: [string, string];
  /** Optional note shown below the advice table. */
  doughbertAdviceNote?: string;
}

/** Premium article metadata — header, relations and editorial workflow. */
export interface KnowledgeBiteMetadata {
  title: string;
  subtitle: string;
  category: KnowledgeBiteCategoryId;
  subcategory?: string;
  difficulty: KnowledgeBiteDifficulty;
  readingTimeMinutes: number;
  tags: string[];
  lastUpdated?: string;
  relatedRecipes: RecipeId[];
  relatedKnowledge: KnowledgeBiteId[];
  relatedTips: TipId[];
  status: KnowledgeBiteStatus;
}

/** Full Knowledge Bite article — metadata + content. */
export interface KnowledgeBiteArticle {
  metadata: KnowledgeBiteMetadata;
  content: KnowledgeBiteBody;
}

/**
 * Minimal registry entry to add a new Knowledge Bite to the library.
 * Metadata and body default to editorial placeholders until filled in.
 */
export interface KnowledgeBiteDefinition {
  slug: string;
  categoryId: KnowledgeBiteCategoryId;
  title: string;
  libraryOrder: number;
  subcategory?: string;
  status?: KnowledgeBiteStatus;
  /** Partial metadata overrides — merged onto placeholder defaults. */
  metadata?: Partial<KnowledgeBiteMetadata>;
  /** Partial body overrides — merged onto placeholder defaults. */
  content?: Partial<KnowledgeBiteBody>;
}

export interface KnowledgeBite {
  id: KnowledgeBiteId;
  slug: string;
  categoryId: KnowledgeBiteCategoryId;
  title: string;
  tagline: string;
  route: string;
  introduction: string;
  libraryOrder: number;
  recipeId?: RecipeId;
  metadata: KnowledgeBiteMetadata;
  content: KnowledgeBiteBody;
}

export type KnowledgeBiteRegistry = Record<KnowledgeBiteId, KnowledgeBite>;

export type KnowledgeBiteCategoryRegistry = Record<
  KnowledgeBiteCategoryId,
  KnowledgeBiteCategory
>;
