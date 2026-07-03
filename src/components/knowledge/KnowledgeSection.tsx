import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { knowledgeStyles } from "./knowledgeStyles";

type KnowledgeSectionProps = {
  title: string;
  children: ReactNode;
};

export default function KnowledgeSection({ title, children }: KnowledgeSectionProps) {
  return (
    <View style={knowledgeStyles.section}>
      <Text style={knowledgeStyles.sectionTitle}>{title}</Text>
      <View style={knowledgeStyles.panel}>{children}</View>
    </View>
  );
}
