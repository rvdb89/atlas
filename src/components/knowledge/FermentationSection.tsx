import type { FermentationScienceKnowledge } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type FermentationSectionProps = {
  data: FermentationScienceKnowledge;
};

export default function FermentationSection({ data }: FermentationSectionProps) {
  const labels = knowledgeLabels.fermentation;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.fermentationScience}>
      <KnowledgeField label={labels.bulkFermentation} value={data.bulkFermentation} />
      <KnowledgeField label={labels.coldFermentation} value={data.coldFermentation} />
      <KnowledgeField label={labels.biology} value={data.biology} />
      <KnowledgeField label={labels.whyTheseTimes} value={data.whyTheseTimes} isLast />
    </KnowledgeSection>
  );
}
