import { Text, View } from "react-native";

import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type TipsSectionProps = {
  tips: string[];
};

export default function TipsSection({ tips }: TipsSectionProps) {
  return (
    <KnowledgeSection title={knowledgeLabels.sections.doughbertTips}>
      {tips.map((tip, index) => (
        <View
          key={`${tip}-${index}`}
          style={[
            knowledgeStyles.tipItem,
            index === tips.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <Text style={knowledgeStyles.tipBullet}>★</Text>
          <Text style={knowledgeStyles.tipText}>{tip}</Text>
        </View>
      ))}
    </KnowledgeSection>
  );
}
