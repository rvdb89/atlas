import { Text, View } from "react-native";

import type { DidYouKnowItem } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type DidYouKnowSectionProps = {
  items: DidYouKnowItem[];
};

export default function DidYouKnowSection({ items }: DidYouKnowSectionProps) {
  return (
    <KnowledgeSection title={knowledgeLabels.sections.didYouKnow}>
      {items.map((item, index) => (
        <View key={`${item.title}-${index}`} style={knowledgeStyles.didYouKnowCard}>
          <Text style={knowledgeStyles.didYouKnowTitle}>{item.title}</Text>
          <Text style={knowledgeStyles.didYouKnowFact}>{item.fact}</Text>
        </View>
      ))}
    </KnowledgeSection>
  );
}
