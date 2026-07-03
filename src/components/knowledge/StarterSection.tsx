import type { StarterScienceKnowledge } from "@/types/knowledge";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type StarterSectionProps = {
  data: StarterScienceKnowledge;
};

export default function StarterSection({ data }: StarterSectionProps) {
  return (
    <KnowledgeSection title="Starter Science">
      <KnowledgeField
        label="Waarom dit starterpercentage?"
        value={data.whyThisPercentage}
      />
      <KnowledgeField label="Effect van minder starter" value={data.lessStarterEffect} />
      <KnowledgeField label="Effect van meer starter" value={data.moreStarterEffect} />
      <KnowledgeField label="Invloed op planning" value={data.planningImpact} />
      <KnowledgeField label="Invloed op smaak" value={data.flavorImpact} isLast />
    </KnowledgeSection>
  );
}
