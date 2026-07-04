import { Text, View } from "react-native";

import type { FlourScienceKnowledge } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type FlourScienceSectionProps = {
  data: FlourScienceKnowledge;
};

export default function FlourScienceSection({ data }: FlourScienceSectionProps) {
  const labels = knowledgeLabels.flour;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.flourScience}>
      <Text style={knowledgeStyles.introText}>{data.overview}</Text>

      {data.flours.map((flour) => (
        <View key={flour.id} style={knowledgeStyles.flourCard}>
          <View style={knowledgeStyles.flourHeader}>
            <Text style={knowledgeStyles.flourName}>{flour.name}</Text>
            <Text style={knowledgeStyles.flourPercentage}>{flour.percentage}%</Text>
          </View>

          <KnowledgeField label={labels.protein} value={flour.protein} />
          <KnowledgeField label={labels.glutenStrength} value={flour.glutenStrength} />
          <KnowledgeField label={labels.waterAbsorption} value={flour.waterAbsorption} />
          <KnowledgeField
            label={labels.fermentationSpeed}
            value={flour.fermentationSpeed}
          />
          <KnowledgeField label={labels.flavorProfile} value={flour.flavorProfile} />
          <KnowledgeField label={labels.whyWeUseIt} value={flour.whyWeUseIt} isLast />
        </View>
      ))}
    </KnowledgeSection>
  );
}
