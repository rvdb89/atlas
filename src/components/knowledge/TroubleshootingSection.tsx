import { Text, View } from "react-native";

import type { TroubleshootingItem } from "@/types/knowledge";

import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type TroubleshootingSectionProps = {
  items: TroubleshootingItem[];
};

export default function TroubleshootingSection({
  items,
}: TroubleshootingSectionProps) {
  return (
    <KnowledgeSection title="Troubleshooting">
      {items.map((item, index) => (
        <View key={`${item.problem}-${index}`} style={knowledgeStyles.listItem}>
          <Text style={knowledgeStyles.listItemTitle}>{item.problem}</Text>
          <Text style={knowledgeStyles.listItemLabel}>Mogelijke oorzaak</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.possibleCause}</Text>
          <Text style={knowledgeStyles.listItemLabel}>Oplossing</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.solution}</Text>
        </View>
      ))}
    </KnowledgeSection>
  );
}
