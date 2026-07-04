import { Text, View } from "react-native";

import { knowledgeStyles } from "../knowledgeStyles";

export default function KnowledgeBiteTipBlock({ tip }: { tip: string }) {
  return (
    <View style={knowledgeStyles.tipCard}>
      <Text style={knowledgeStyles.tipLabel}>💡 Doughbert Tip</Text>
      <Text style={knowledgeStyles.bodyText}>{tip}</Text>
    </View>
  );
}
