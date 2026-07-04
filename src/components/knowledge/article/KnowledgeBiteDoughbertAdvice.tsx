import { Text, View } from "react-native";

import type { KnowledgeBiteAdviceRow } from "@/types/knowledgeBite";
import { hasText } from "@/utils/knowledgeContentVisibility";

import { knowledgeStyles } from "../knowledgeStyles";
import KnowledgeBiteTable from "./KnowledgeBiteTable";

export const DOUGHBERT_ADVICE_SECTION_TITLE = "🌾 Doughbert Advies";

export const DOUGHBERT_ADVICE_HEADERS = ["Doel", "Beste keuze"] as const;

type KnowledgeBiteDoughbertAdviceProps = {
  rows: KnowledgeBiteAdviceRow[];
  headers?: readonly [string, string];
  note?: string;
};

export default function KnowledgeBiteDoughbertAdvice({
  rows,
  headers = DOUGHBERT_ADVICE_HEADERS,
  note,
}: KnowledgeBiteDoughbertAdviceProps) {
  const visibleRows = rows.filter((row) => hasText(row.goal) && hasText(row.choice));

  if (visibleRows.length === 0) {
    return null;
  }

  return (
    <View>
      <KnowledgeBiteTable
        table={{
          headers: [...headers],
          rows: visibleRows.map((row) => [row.goal, row.choice]),
        }}
      />

      {hasText(note) ? (
        <Text style={[knowledgeStyles.bodyText, { marginTop: 14 }]}>{note}</Text>
      ) : null}
    </View>
  );
}
