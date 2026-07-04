import Accordion from "@/components/Accordion";
import { Text, View } from "react-native";

import type { KnowledgeBiteFaqItem, KnowledgeBiteMistake } from "@/types/knowledgeBite";

import { knowledgeStyles } from "../knowledgeStyles";

export function KnowledgeBiteFaqList({ items }: { items: KnowledgeBiteFaqItem[] }) {
  return (
    <View style={{ marginTop: 14, gap: 10 }}>
      {items.map((item) => (
        <View key={item.question} style={knowledgeStyles.faqItem}>
          <Accordion title={item.question}>
            <Text style={knowledgeStyles.bodyText}>{item.answer}</Text>
          </Accordion>
        </View>
      ))}
    </View>
  );
}

export function KnowledgeBiteMistakesList({ items }: { items: KnowledgeBiteMistake[] }) {
  return (
    <View style={{ marginTop: 14, gap: 12 }}>
      {items.map((item) => (
        <View key={item.mistake} style={knowledgeStyles.listItem}>
          <Text style={knowledgeStyles.listItemTitle}>{item.mistake}</Text>
          <Text style={knowledgeStyles.listItemLabel}>Oorzaak</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.cause}</Text>
          <Text style={knowledgeStyles.listItemLabel}>Oplossing</Text>
          <Text style={knowledgeStyles.listItemValue}>{item.solution}</Text>
        </View>
      ))}
    </View>
  );
}
