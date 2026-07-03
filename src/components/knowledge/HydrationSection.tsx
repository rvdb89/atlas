import type { HydrationScienceKnowledge } from "@/types/knowledge";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type HydrationSectionProps = {
  data: HydrationScienceKnowledge;
};

export default function HydrationSection({ data }: HydrationSectionProps) {
  return (
    <KnowledgeSection title="Hydration Science">
      <KnowledgeField label="Waarom deze hydratatie?" value={data.whyThisHydration} />
      <KnowledgeField
        label="Effect van lagere hydratatie"
        value={data.lowerHydrationEffect}
      />
      <KnowledgeField
        label="Effect van hogere hydratatie"
        value={data.higherHydrationEffect}
      />
      <KnowledgeField label="Handling" value={data.handling} />
      <KnowledgeField label="Ovenrijs" value={data.ovenSpring} />
      <KnowledgeField label="Kruim" value={data.crumb} />
      <KnowledgeField label="Korst" value={data.crust} isLast />
    </KnowledgeSection>
  );
}
