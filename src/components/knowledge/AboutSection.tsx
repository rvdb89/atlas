import type { AboutKnowledge } from "@/types/knowledge";

import KnowledgeField from "./KnowledgeField";
import KnowledgeSection from "./KnowledgeSection";

type AboutSectionProps = {
  data: AboutKnowledge;
};

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <KnowledgeSection title="About">
      <KnowledgeField label="Geschiedenis" value={data.history} />
      <KnowledgeField label="Oorsprong" value={data.origin} />
      <KnowledgeField label="Karakter" value={data.character} />
      <KnowledgeField label="Waarvoor geschikt" value={data.goodFor} isLast />
    </KnowledgeSection>
  );
}
