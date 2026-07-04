import type { RecipeId } from "@/types/recipe";
import type {
  KnowledgeBiteBody,
  KnowledgeBiteCategoryId,
  KnowledgeBiteMetadata,
  KnowledgeBiteStatus,
} from "@/types/knowledgeBite";

/** How the article is sourced — catalog editorials vs recipe-linked pages. */
export type KnowledgeArticleKind = "catalog" | "recipe";

/**
 * Canonical input shape for bulk import and future AI generation.
 * Every Knowledge Bite in Doughbert should be expressible as this object.
 */
export interface KnowledgeArticleInput {
  slug: string;
  categoryId: KnowledgeBiteCategoryId;
  title: string;
  libraryOrder: number;
  kind?: KnowledgeArticleKind;
  recipeId?: RecipeId;
  subcategory?: string;
  status?: KnowledgeBiteStatus;
  metadata?: Partial<KnowledgeBiteMetadata>;
  content?: Partial<KnowledgeBiteBody>;
  /** Extra tags used only for automatic relation discovery. */
  relationTags?: string[];
}

/** Result of validating and normalizing a batch of article inputs. */
export type BulkImportResult = {
  articles: KnowledgeArticleInput[];
  warnings: string[];
};
