import { Text, View } from "react-native";

import type { DoughbertScienceKnowledge } from "@/types/knowledge";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";
import { knowledgeStyles } from "./knowledgeStyles";

type ScienceSectionProps = {
  data: DoughbertScienceKnowledge;
};

export default function ScienceSection({ data }: ScienceSectionProps) {
  return (
    <KnowledgeSection title="Doughbert Science">
      <Text style={knowledgeStyles.introText}>{data.introduction}</Text>

      {data.topics.map((topic, index) => (
        <KnowledgeField
          key={topic.term}
          label={topic.term}
          value={topic.explanation}
          isLast={index === data.topics.length - 1}
        />
      ))}
    </KnowledgeSection>
  );
}
