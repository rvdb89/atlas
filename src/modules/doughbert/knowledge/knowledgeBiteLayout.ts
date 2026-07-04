import type { KnowledgeBiteSectionId } from "@/types/knowledgeBite";

/** Fixed article layout — header and summary are metadata/body, rest are sections. */
export const KNOWLEDGE_BITE_ARTICLE_LAYOUT = [
  { part: "header", label: "Header" },
  { part: "summary", label: "Samenvatting" },
  { part: "section", sectionId: "what-is-it", label: "Wat is het?" },
  { part: "section", sectionId: "properties", label: "Eigenschappen" },
  { part: "section", sectionId: "comparison", label: "Vergelijking" },
  { part: "section", sectionId: "science", label: "De wetenschap" },
  { part: "section", sectionId: "when-to-use", label: "Wanneer gebruik je het?" },
  {
    part: "section",
    sectionId: "when-not-to-use",
    label: "Wanneer gebruik je het niet?",
  },
  { part: "section", sectionId: "common-mistakes", label: "Veelgemaakte fouten" },
  { part: "section", sectionId: "doughbert-tip", label: "Doughbert Tip" },
  { part: "section", sectionId: "faq", label: "Veelgestelde vragen" },
  { part: "section", sectionId: "did-you-know", label: "Wist je dat?" },
  { part: "related-knowledge", label: "Gerelateerde Knowledge Bites" },
] as const;

export const STANDARD_SECTION_TITLES: Record<KnowledgeBiteSectionId, string> = {
  "what-is-it": "Wat is het?",
  properties: "Eigenschappen",
  comparison: "Vergelijking",
  science: "De wetenschap",
  "when-to-use": "Wanneer gebruik je het?",
  "when-not-to-use": "Wanneer gebruik je het niet?",
  "common-mistakes": "Veelgemaakte fouten",
  "doughbert-tip": "Doughbert Tip",
  faq: "Veelgestelde vragen",
  "did-you-know": "Wist je dat?",
};

export function getStandardSectionTitle(id: KnowledgeBiteSectionId): string {
  return STANDARD_SECTION_TITLES[id];
}
