import { Text, View } from "react-native";

import type { KnowledgeBiteQuote } from "@/types/knowledgeBite";

import { knowledgeStyles } from "../knowledgeStyles";

export default function KnowledgeBiteQuoteBlock({ quote }: { quote: KnowledgeBiteQuote }) {
  return (
    <View style={knowledgeStyles.quoteCard}>
      <Text style={knowledgeStyles.quoteText}>“{quote.text}”</Text>
      {quote.attribution ? (
        <Text style={knowledgeStyles.quoteAttribution}>— {quote.attribution}</Text>
      ) : null}
    </View>
  );
}
