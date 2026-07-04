import type { StarterScienceKnowledge } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type StarterSectionProps = {
  data: StarterScienceKnowledge;
};

export default function StarterSection({ data }: StarterSectionProps) {
  const labels = knowledgeLabels.starter;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.starterScience}>
      <KnowledgeField label={labels.whyThisPercentage} value={data.whyThisPercentage} />
      <KnowledgeField label={labels.lessStarterEffect} value={data.lessStarterEffect} />
      <KnowledgeField label={labels.moreStarterEffect} value={data.moreStarterEffect} />
      <KnowledgeField label={labels.planningImpact} value={data.planningImpact} />
      <KnowledgeField label={labels.flavorImpact} value={data.flavorImpact} isLast />
    </KnowledgeSection>
  );
}
