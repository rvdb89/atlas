import { Text, View } from "react-native";

import type { CommonMistake } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type CommonMistakesSectionProps = {
  items: CommonMistake[];
};

export default function CommonMistakesSection({ items }: CommonMistakesSectionProps) {
  const labels = knowledgeLabels.commonMistakes;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.commonMistakes}>
      {items.map((item, index) => (
        <View key={`${item.mistake}-${index}`} style={knowledgeStyles.listItem}>
          <Text style={knowledgeStyles.listItemTitle}>{item.mistake}</Text>
          <Text style={knowledgeStyles.listItemLabel}>{labels.cause}</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.cause}</Text>
          <Text style={knowledgeStyles.listItemLabel}>{labels.solution}</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.solution}</Text>
        </View>
      ))}
    </KnowledgeSection>
  );
}
