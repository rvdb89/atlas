import type { ContentType } from "@/atlas/publishing/types";

export const COPYWRITER_TEMPLATE_IDS: Record<ContentType, string> = {
  article: "article-v1",
  recipe: "recipe-v1",
  technique: "technique-v1",
  ingredient: "ingredient-v1",
  science: "science-v1",
  guide: "guide-v1",
  tip: "tip-v1",
};

export const DOUGHBERT_EDITORIAL_STYLE = `
Warm, premium, toegankelijk. Korte alinea's. Concrete bakadviezen.
Geen placeholder-tekst. Nederlandse terminologie consistent met Doughbert.
`.trim();
