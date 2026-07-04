import type { RecipeId } from "@/types/recipe";
import type {
  KnowledgeBiteBody,
  KnowledgeBiteCategoryId,
  KnowledgeBiteDefinition,
  KnowledgeBiteMetadata,
} from "@/types/knowledgeBite";

/** Catalog bite — title is set in the bite file. */
export function defineKnowledgeBite(
  definition: KnowledgeBiteDefinition,
): KnowledgeBiteDefinition {
  return definition;
}

/** Recipe-linked bite — title comes from the recipe registry. */
export type RecipeKnowledgeBiteRef = {
  kind: "recipe";
  slug: RecipeId;
  categoryId: "brood" | "pizza";
  libraryOrder: number;
  subcategory?: string;
  status?: KnowledgeBiteDefinition["status"];
  metadata?: Partial<KnowledgeBiteMetadata>;
  content?: Partial<KnowledgeBiteBody>;
};

export function defineRecipeKnowledgeBite(
  definition: Omit<RecipeKnowledgeBiteRef, "kind">,
): RecipeKnowledgeBiteRef {
  return { kind: "recipe", ...definition };
}

export type KnowledgeBiteSource =
  | KnowledgeBiteDefinition
  | RecipeKnowledgeBiteRef;

export function isRecipeKnowledgeBiteSource(
  source: KnowledgeBiteSource,
): source is RecipeKnowledgeBiteRef {
  return "kind" in source && source.kind === "recipe";
}

export type CatalogFolderId =
  | "bread"
  | "pizza"
  | "flour"
  | "starter"
  | "techniques"
  | "science";

export const CATEGORY_FOLDER_MAP: Record<KnowledgeBiteCategoryId, CatalogFolderId> =
  {
    brood: "bread",
    pizza: "pizza",
    "meel-bloem": "flour",
    starter: "starter",
    hydratatie: "techniques",
    fermentatie: "techniques",
    technieken: "techniques",
    temperaturen: "techniques",
    bakwetenschap: "science",
  };
