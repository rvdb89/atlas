import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { TipCard } from "@/components/tips/TipCards";
import ScreenLayout from "@/components/ScreenLayout";
import { BakeryColors } from "@/constants/theme";
import { getTipCategory, getTipsByCategory, tipCategories } from "@/data/tips";
import type { TipCategoryId } from "@/types/tip";

function isTipCategoryId(value: string): value is TipCategoryId {
  return value in tipCategories;
}

export default function TipsCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const rawCategoryId = typeof categoryId === "string" ? categoryId : "";

  if (!isTipCategoryId(rawCategoryId)) {
    return (
      <ScreenLayout backTo="/tips" title="Tips" subtitle="Niet gevonden.">
        <View style={styles.panel}>
          <Text style={styles.body}>Deze categorie bestaat niet.</Text>
        </View>
      </ScreenLayout>
    );
  }

  const category = getTipCategory(rawCategoryId);
  const tips = getTipsByCategory(rawCategoryId);

  return (
    <ScreenLayout
      backTo="/tips"
      title={category.title}
      subtitle={category.description}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerEmoji}>{category.emoji}</Text>
        <Text style={styles.headerMeta}>
          {tips.length} {tips.length === 1 ? "tip" : "tips"}
        </Text>
      </View>

      <View style={styles.list}>
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  headerEmoji: {
    fontSize: 32,
    lineHeight: 36,
  },

  headerMeta: {
    fontSize: 13,
    fontWeight: "700",
    color: BakeryColors.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  list: {
    gap: 14,
  },

  panel: {
    backgroundColor: BakeryColors.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.12)",
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    color: BakeryColors.textSecondary,
  },
});
