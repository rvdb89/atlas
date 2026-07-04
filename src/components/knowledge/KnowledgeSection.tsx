import type { ReactNode } from "react";
import { View } from "react-native";

import Accordion from "@/components/Accordion";

import { knowledgeStyles } from "./knowledgeStyles";

type KnowledgeSectionProps = {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
};

export default function KnowledgeSection({
  title,
  children,
  defaultExpanded = false,
}: KnowledgeSectionProps) {
  return (
    <View style={knowledgeStyles.section}>
      <Accordion title={title} defaultExpanded={defaultExpanded}>
        <View style={knowledgeStyles.panelInner}>{children}</View>
      </Accordion>
    </View>
  );
}
