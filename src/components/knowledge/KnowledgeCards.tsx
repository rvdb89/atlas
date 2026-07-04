import { StyleSheet, Text, View, Pressable } from "react-native";

import { knowledgeCategories } from "@/data/knowledgeCategories";
import {
  formatDifficultyLabel,
  formatDifficultyStars,
  formatReadingTime,
} from "@/utils/knowledgeSearch";
import type { KnowledgeBite } from "@/types/knowledgeBite";

const COLORS = {
  warmWhite: "#FFFDF8",
  card: "#F8F0E6",
  brown: "#2B2118",
  secondary: "#7A6652",
  orangeAccent: "#B86B38",
};

export type LibraryCategoryCardData = {
  emoji: string;
  title: string;
  description: string;
};

type KnowledgeCategoryCardProps = {
  category: LibraryCategoryCardData;
  articleCount: number;
  countSingular?: string;
  countPlural?: string;
  onPress: () => void;
};

export function KnowledgeCategoryCard({
  category,
  articleCount,
  countSingular = "artikel",
  countPlural = "artikelen",
  onPress,
}: KnowledgeCategoryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.categoryCard,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.categoryCardTop}>
        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        <Text style={styles.categoryArrow}>›</Text>
      </View>

      <Text style={styles.categoryTitle}>{category.title}</Text>
      <Text style={styles.categoryDescription}>{category.description}</Text>
      <Text style={styles.categoryMeta}>
        {articleCount}{" "}
        {articleCount === 1 ? countSingular : countPlural}
      </Text>
    </Pressable>
  );
}

type KnowledgeBiteCardProps = {
  bite: KnowledgeBite;
  onPress: () => void;
};

export function KnowledgeBiteCard({ bite, onPress }: KnowledgeBiteCardProps) {
  const category = knowledgeCategories[bite.categoryId];
  const hasTagline = bite.tagline.trim().length > 0;
  const isDraft = bite.metadata.status !== "published";

  return (
    <Pressable
      style={({ pressed }) => [styles.biteCard, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.biteCardHeader}>
        <View style={styles.biteCardHeading}>
          <Text style={styles.biteEmoji}>{category.emoji}</Text>
          <Text style={styles.biteTitle}>{bite.title}</Text>
        </View>
        <Text style={styles.categoryArrow}>›</Text>
      </View>

      {hasTagline ? <Text style={styles.biteTagline}>{bite.tagline}</Text> : null}

      <View style={styles.biteMetaRow}>
        <Text style={styles.biteMetaText}>
          {formatDifficultyStars(bite.metadata.difficulty)} ·{" "}
          {formatDifficultyLabel(bite.metadata.difficulty)}
        </Text>
        <Text style={styles.biteMetaDot}>·</Text>
        <Text style={styles.biteMetaText}>
          {formatReadingTime(bite.metadata.readingTimeMinutes)}
        </Text>
      </View>

      {isDraft ? <Text style={styles.draftBadge}>Concept</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: COLORS.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  categoryCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  categoryEmoji: {
    fontSize: 32,
    lineHeight: 36,
  },

  categoryArrow: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.orangeAccent,
  },

  categoryTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.brown,
  },

  categoryDescription: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.secondary,
  },

  categoryMeta: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  biteCard: {
    backgroundColor: COLORS.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  biteCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 12,
  },

  biteCardHeading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  biteEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },

  biteTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.brown,
  },

  biteTagline: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.secondary,
  },

  biteMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },

  biteMetaText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orangeAccent,
  },

  biteMetaDot: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orangeAccent,
  },

  draftBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
