import type { HydrationScienceKnowledge } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type HydrationSectionProps = {
  data: HydrationScienceKnowledge;
};

export default function HydrationSection({ data }: HydrationSectionProps) {
  const labels = knowledgeLabels.hydration;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.hydrationScience}>
      <KnowledgeField label={labels.whyThisHydration} value={data.whyThisHydration} />
      <KnowledgeField
        label={labels.lowerHydrationEffect}
        value={data.lowerHydrationEffect}
      />
      <KnowledgeField
        label={labels.higherHydrationEffect}
        value={data.higherHydrationEffect}
      />
      <KnowledgeField label={labels.handling} value={data.handling} />
      <KnowledgeField label={labels.ovenSpring} value={data.ovenSpring} />
      <KnowledgeField label={labels.crumb} value={data.crumb} />
      <KnowledgeField label={labels.crust} value={data.crust} isLast />
    </KnowledgeSection>
  );
}
