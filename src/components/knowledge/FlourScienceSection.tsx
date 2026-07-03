import { Text, View } from "react-native";

import type { FlourScienceKnowledge } from "@/types/knowledge";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type FlourScienceSectionProps = {
  data: FlourScienceKnowledge;
};

export default function FlourScienceSection({ data }: FlourScienceSectionProps) {
  return (
    <KnowledgeSection title="Flour Science">
      <Text style={knowledgeStyles.introText}>{data.overview}</Text>

      {data.flours.map((flour) => (
        <View key={flour.id} style={knowledgeStyles.flourCard}>
          <View style={knowledgeStyles.flourHeader}>
            <Text style={knowledgeStyles.flourName}>{flour.name}</Text>
            <Text style={knowledgeStyles.flourPercentage}>{flour.percentage}%</Text>
          </View>

          <KnowledgeField label="Eiwitpercentage" value={flour.protein} />
          <KnowledgeField label="Glutensterkte" value={flour.glutenStrength} />
          <KnowledgeField label="Wateropname" value={flour.waterAbsorption} />
          <KnowledgeField label="Fermentatiesnelheid" value={flour.fermentationSpeed} />
          <KnowledgeField label="Smaakprofiel" value={flour.flavorProfile} />
          <KnowledgeField
            label="Waarom gebruiken we dit?"
            value={flour.whyWeUseIt}
            isLast
          />
        </View>
      ))}
    </KnowledgeSection>
  );
}
