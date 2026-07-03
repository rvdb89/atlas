import type { FermentationScienceKnowledge } from "@/types/knowledge";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type FermentationSectionProps = {
  data: FermentationScienceKnowledge;
};

export default function FermentationSection({ data }: FermentationSectionProps) {
  return (
    <KnowledgeSection title="Fermentation Science">
      <KnowledgeField label="Bulkfermentatie" value={data.bulkFermentation} />
      <KnowledgeField label="Koude fermentatie" value={data.coldFermentation} />
      <KnowledgeField label="Wat gebeurt er biologisch?" value={data.biology} />
      <KnowledgeField label="Waarom deze tijden?" value={data.whyTheseTimes} isLast />
    </KnowledgeSection>
  );
}
