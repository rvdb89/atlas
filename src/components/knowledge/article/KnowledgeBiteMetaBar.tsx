import { Text, View } from "react-native";

import { getKnowledgeCategory } from "@/data/knowledgeCategories";
import type { KnowledgeBite, KnowledgeBiteDifficulty } from "@/types/knowledgeBite";
import { hasText } from "@/utils/knowledgeContentVisibility";

import { knowledgeStyles } from "../knowledgeStyles";

const DIFFICULTY_LABELS: Record<KnowledgeBiteDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Gevorderd",
  advanced: "Expert",
};

export default function KnowledgeBiteMetaBar({ bite }: { bite: KnowledgeBite }) {
  const category = getKnowledgeCategory(bite.metadata.category);

  return (
    <View style={knowledgeStyles.metaBadgeRow}>
      <View style={knowledgeStyles.metaBadge}>
        <Text style={knowledgeStyles.metaBadgeText}>
          {category.emoji} {category.title}
        </Text>
      </View>

      {hasText(bite.metadata.subcategory) ? (
        <View style={knowledgeStyles.metaBadge}>
          <Text style={knowledgeStyles.metaBadgeText}>{bite.metadata.subcategory}</Text>
        </View>
      ) : null}

      <View style={knowledgeStyles.metaBadge}>
        <Text style={knowledgeStyles.metaBadgeText}>
          {DIFFICULTY_LABELS[bite.metadata.difficulty]}
        </Text>
      </View>

      {bite.metadata.readingTimeMinutes > 0 ? (
        <View style={knowledgeStyles.metaBadge}>
          <Text style={knowledgeStyles.metaBadgeText}>
            {bite.metadata.readingTimeMinutes} min lezen
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function KnowledgeBiteSummaryCard({ summary }: { summary: string }) {
  if (!hasText(summary)) {
    return null;
  }

  return (
    <View style={knowledgeStyles.summaryCard}>
      <Text style={knowledgeStyles.summaryLabel}>Samenvatting</Text>
      <Text style={knowledgeStyles.summaryText}>{summary}</Text>
    </View>
  );
}
