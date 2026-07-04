import { Text, View } from "react-native";

import type { KnowledgeBiteTable } from "@/types/knowledgeBite";
import { isKnowledgeBiteTable } from "@/utils/knowledgeContentVisibility";

import { knowledgeStyles } from "../knowledgeStyles";

type KnowledgeBiteTableProps = {
  table: KnowledgeBiteTable;
};

export default function KnowledgeBiteTable({ table }: KnowledgeBiteTableProps) {
  if (!isKnowledgeBiteTable(table)) {
    return null;
  }

  return (
    <View style={knowledgeStyles.tableWrapper}>
      {table.caption ? (
        <Text style={knowledgeStyles.tableCaption}>{table.caption}</Text>
      ) : null}

      <View style={knowledgeStyles.tableRow}>
        {table.headers.map((header) => (
          <View key={header} style={knowledgeStyles.tableHeaderCell}>
            <Text style={knowledgeStyles.tableHeaderText}>{header}</Text>
          </View>
        ))}
      </View>

      {table.rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={knowledgeStyles.tableRow}>
          {row.map((cell, cellIndex) => (
            <View key={`cell-${rowIndex}-${cellIndex}`} style={knowledgeStyles.tableCell}>
              <Text style={knowledgeStyles.tableCellText}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
