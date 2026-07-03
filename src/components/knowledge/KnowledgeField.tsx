import { Text, View } from "react-native";

import { knowledgeStyles } from "./knowledgeStyles";

type KnowledgeFieldProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

export default function KnowledgeField({
  label,
  value,
  isLast = false,
}: KnowledgeFieldProps) {
  return (
    <View style={[knowledgeStyles.field, isLast && knowledgeStyles.fieldLast]}>
      <Text style={knowledgeStyles.fieldLabel}>{label}</Text>
      <Text style={knowledgeStyles.fieldValue}>{value}</Text>
    </View>
  );
}
