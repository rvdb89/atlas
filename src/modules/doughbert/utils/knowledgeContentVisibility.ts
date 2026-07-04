import type {
  KnowledgeBiteAdviceRow,
  KnowledgeBiteSection,
  KnowledgeBiteTable,
} from "@/types/knowledgeBite";

export function hasText(value?: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isKnowledgeBiteTable(table?: KnowledgeBiteTable): table is KnowledgeBiteTable {
  if (!table || table.headers.length === 0 || table.rows.length === 0) {
    return false;
  }

  return table.rows.some((row) => row.some((cell) => hasText(cell)));
}

export function sectionHasContent(section: KnowledgeBiteSection): boolean {
  if (hasText(section.body)) {
    return true;
  }

  if (section.quote && hasText(section.quote.text)) {
    return true;
  }

  if (isKnowledgeBiteTable(section.table) || isKnowledgeBiteTable(section.comparisonTable)) {
    return true;
  }

  if (section.keyPoints.some((point) => hasText(point))) {
    return true;
  }

  if (hasText(section.doughbertTip)) {
    return true;
  }

  if (
    section.mistakes?.some(
      (item) =>
        hasText(item.mistake) || hasText(item.cause) || hasText(item.solution),
    )
  ) {
    return true;
  }

  if (section.faq?.some((item) => hasText(item.question) && hasText(item.answer))) {
    return true;
  }

  if (section.didYouKnow?.some((item) => hasText(item.title) && hasText(item.fact))) {
    return true;
  }

  return false;
}

export function getVisibleSections(sections: KnowledgeBiteSection[]): KnowledgeBiteSection[] {
  return sections.filter(sectionHasContent);
}

export function hasDoughbertAdvice(rows?: KnowledgeBiteAdviceRow[]): boolean {
  return !!rows?.some((row) => hasText(row.goal) && hasText(row.choice));
}
