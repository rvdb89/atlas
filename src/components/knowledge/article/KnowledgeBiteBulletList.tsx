import { Text, View } from "react-native";

import { knowledgeStyles } from "../knowledgeStyles";

export default function KnowledgeBiteBulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={knowledgeStyles.bulletList}>
      {items.map((item) => (
        <View key={item} style={knowledgeStyles.bulletRow}>
          <Text style={knowledgeStyles.bulletDot}>•</Text>
          <Text style={[knowledgeStyles.bodyText, { flex: 1 }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
