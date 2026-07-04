import { Text, View } from "react-native";

import type { TroubleshootingItem } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type TroubleshootingSectionProps = {
  items: TroubleshootingItem[];
};

export default function TroubleshootingSection({
  items,
}: TroubleshootingSectionProps) {
  const labels = knowledgeLabels.troubleshooting;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.troubleshooting}>
      {items.map((item, index) => (
        <View key={`${item.problem}-${index}`} style={knowledgeStyles.listItem}>
          <Text style={knowledgeStyles.listItemTitle}>{item.problem}</Text>
          <Text style={knowledgeStyles.listItemLabel}>{labels.possibleCause}</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.possibleCause}</Text>
          <Text style={knowledgeStyles.listItemLabel}>{labels.solution}</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.solution}</Text>
        </View>
      ))}
    </KnowledgeSection>
  );
}
