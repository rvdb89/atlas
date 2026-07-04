import type { ContentType, GenerationBrief } from "@/atlas/publishing/types";
import type { CategoryPreset } from "@/atlas/publishing/plugin/types";
import type { KnowledgeBiteCategoryId } from "@/types/knowledgeBite";

export const DOUGHBERT_CATEGORY_PRESETS: Record<KnowledgeBiteCategoryId, CategoryPreset> = {
  brood: {
    categoryId: "brood",
    label: "Broden",
    contentType: "article",
    topics: ["Pain de Campagne", "Country Loaf", "Ciabatta", "Stokbrood", "Volkoren zuurdesem"],
  },
  pizza: {
    categoryId: "pizza",
    label: "Pizza",
    contentType: "article",
    topics: [
      "Napolitaanse pizza",
      "New York style",
      "Detroit style",
      "Roman pizza al taglio",
      "Sicilian pan pizza",
    ],
  },
  "meel-bloem": {
    categoryId: "meel-bloem",
    label: "Meel & Bloem",
    contentType: "ingredient",
    topics: ["Manitoba", "Bread flour", "Rijstmeel", "Amandelmeel"],
  },
  starter: {
    categoryId: "starter",
    label: "Starter",
    contentType: "guide",
    topics: ["Starter opbouwen", "Desem vs starter", "Vloeibare starter"],
  },
  hydratatie: {
    categoryId: "hydratatie",
    label: "Hydratatie",
    contentType: "technique",
    topics: ["Hydratatie meten", "Nat deeg", "Droog deeg"],
  },
  fermentatie: {
    categoryId: "fermentatie",
    label: "Fermentatie",
    contentType: "technique",
    topics: ["Bulkfermentatie", "Cold proof", "Overproof herkennen"],
  },
  technieken: {
    categoryId: "technieken",
    label: "Technieken",
    contentType: "technique",
    topics: ["Autolyse", "Stretch & Fold", "Coil fold", "Lamineren"],
  },
  temperaturen: {
    categoryId: "temperaturen",
    label: "Temperaturen",
    contentType: "science",
    topics: ["Deegtemperatuur", "DDT berekenen", "Koelkast fermentatie"],
  },
  bakwetenschap: {
    categoryId: "bakwetenschap",
    label: "Bakwetenschap",
    contentType: "science",
    topics: ["Gluten", "Maillardreactie", "Enzymen in deeg"],
  },
};

/** Maps legacy Doughbert content types to core engine types. */
export function toCoreContentType(contentType: string): ContentType {
  if (contentType === "knowledge") return "article";
  if (contentType === "starter") return "guide";
  return contentType as ContentType;
}

export function toDoughbertBriefInput(input: {
  topic: string;
  contentType: string;
  categoryId?: KnowledgeBiteCategoryId;
  keywords?: string[];
}): Omit<GenerationBrief, "id"> {
  return {
    topic: input.topic,
    contentType: toCoreContentType(input.contentType),
    categoryId: input.categoryId,
    keywords: input.keywords,
  };
}
