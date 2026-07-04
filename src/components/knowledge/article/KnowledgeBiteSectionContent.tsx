import { Text, View } from "react-native";

import type { KnowledgeBiteSection } from "@/types/knowledgeBite";
import { hasText, isKnowledgeBiteTable } from "@/utils/knowledgeContentVisibility";

import KnowledgeBiteBulletList from "./KnowledgeBiteBulletList";
import KnowledgeBiteDidYouKnowBlock from "./KnowledgeBiteDidYouKnowBlock";
import { KnowledgeBiteFaqList, KnowledgeBiteMistakesList } from "./KnowledgeBiteLists";
import KnowledgeBiteQuoteBlock from "./KnowledgeBiteQuoteBlock";
import KnowledgeBiteTable from "./KnowledgeBiteTable";
import KnowledgeBiteTipBlock from "./KnowledgeBiteTipBlock";
import { knowledgeStyles } from "../knowledgeStyles";

export default function KnowledgeBiteSectionContent({
  section,
}: {
  section: KnowledgeBiteSection;
}) {
  const table = isKnowledgeBiteTable(section.table)
    ? section.table
    : isKnowledgeBiteTable(section.comparisonTable)
      ? section.comparisonTable
      : undefined;

  const faqItems = section.faq?.filter(
    (item) => hasText(item.question) && hasText(item.answer),
  );
  const mistakes = section.mistakes?.filter(
    (item) =>
      hasText(item.mistake) || hasText(item.cause) || hasText(item.solution),
  );
  const didYouKnowItems = section.didYouKnow?.filter(
    (item) => hasText(item.title) && hasText(item.fact),
  );

  return (
    <View>
      {hasText(section.body) ? (
        <Text style={knowledgeStyles.bodyText}>{section.body}</Text>
      ) : null}

      {section.quote && hasText(section.quote.text) ? (
        <KnowledgeBiteQuoteBlock quote={section.quote} />
      ) : null}

      {table ? <KnowledgeBiteTable table={table} /> : null}

      <KnowledgeBiteBulletList items={section.keyPoints.filter((point) => hasText(point))} />

      {mistakes && mistakes.length > 0 ? (
        <KnowledgeBiteMistakesList items={mistakes} />
      ) : null}

      {faqItems && faqItems.length > 0 ? <KnowledgeBiteFaqList items={faqItems} /> : null}

      {didYouKnowItems?.map((item) => (
        <KnowledgeBiteDidYouKnowBlock key={item.title} item={item} />
      ))}

      {hasText(section.doughbertTip) ? (
        <KnowledgeBiteTipBlock tip={section.doughbertTip!} />
      ) : null}
    </View>
  );
}
