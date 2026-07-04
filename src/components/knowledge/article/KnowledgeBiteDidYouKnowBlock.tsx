import { Text, View } from "react-native";

import type { KnowledgeBiteDidYouKnow } from "@/types/knowledgeBite";

import { knowledgeStyles } from "../knowledgeStyles";

export default function KnowledgeBiteDidYouKnowBlock({
  item,
}: {
  item: KnowledgeBiteDidYouKnow;
}) {
  return (
    <View style={knowledgeStyles.didYouKnowCard}>
      <Text style={knowledgeStyles.didYouKnowTitle}>{item.title}</Text>
      <Text style={knowledgeStyles.didYouKnowFact}>{item.fact}</Text>
    </View>
  );
}
