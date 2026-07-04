import type { AboutKnowledge } from "@/types/knowledge";
import { knowledgeLabels } from "@/i18n/knowledgeLabels";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type AboutSectionProps = {
  data: AboutKnowledge;
};

export default function AboutSection({ data }: AboutSectionProps) {
  const labels = knowledgeLabels.about;

  return (
    <KnowledgeSection title={knowledgeLabels.sections.about} defaultExpanded>
      <KnowledgeField label={labels.history} value={data.history} />
      <KnowledgeField label={labels.origin} value={data.origin} />
      <KnowledgeField label={labels.character} value={data.character} />
      <KnowledgeField label={labels.goodFor} value={data.goodFor} isLast />
    </KnowledgeSection>
  );
}
