import { Text, View } from "react-native";

import type { CommonMistake } from "@/types/knowledge";

import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type CommonMistakesSectionProps = {
  items: CommonMistake[];
};

export default function CommonMistakesSection({ items }: CommonMistakesSectionProps) {
  return (
    <KnowledgeSection title="Common Mistakes">
      {items.map((item, index) => (
        <View key={`${item.mistake}-${index}`} style={knowledgeStyles.listItem}>
          <Text style={knowledgeStyles.listItemTitle}>{item.mistake}</Text>
          <Text style={knowledgeStyles.listItemLabel}>Oorzaak</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.cause}</Text>
          <Text style={knowledgeStyles.listItemLabel}>Oplossing</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.solution}</Text>
        </View>
      ))}
    </KnowledgeSection>
  );
}
