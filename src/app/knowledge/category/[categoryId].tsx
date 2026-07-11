import { router, useLocalSearchParams, type Href } from "expo-router";

import { buildKnowledgeBiteHref } from "@/utils/knowledgeNavigation";
import { StyleSheet, Text, View } from "react-native";

import { KnowledgeBiteCard } from "@/components/knowledge/KnowledgeCards";
import Meelwijzer from "@/components/knowledge/Meelwijzer";
import ScreenLayout from "@/components/ScreenLayout";
import { BakeryColors } from "@/constants/theme";
import { getKnowledgeBitesByCategory } from "@/data/knowledgeBites";
import { getKnowledgeCategory,
  knowledgeCategories,
} from "@/data/knowledgeCategories";
import type { KnowledgeBiteCategoryId } from "@/types/knowledgeBite";
import { getCategoryListTitle } from "@/utils/knowledgeSearch";

function isKnowledgeCategoryId(value: string): value is KnowledgeBiteCategoryId {
  return value in knowledgeCategories;
}

export default function KnowledgeCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const rawCategoryId = typeof categoryId === "string" ? categoryId : "";

  if (!isKnowledgeCategoryId(rawCategoryId)) {
    return (
      <ScreenLayout backTo="/knowledge" title="Categorie" subtitle="Niet gevonden.">
        <View style={styles.panel}>
          <Text style={styles.body}>Deze categorie bestaat niet.</Text>
        </View>
      </ScreenLayout>
    );
  }

  const category = getKnowledgeCategory(rawCategoryId);
  const bites = getKnowledgeBitesByCategory(rawCategoryId);
  const categoryRoute = `/knowledge/category/${rawCategoryId}`;

  return (
    <ScreenLayout
      backTo="/knowledge"
      title={category.title}
      subtitle={category.description}
    >
      {rawCategoryId === "meel-bloem" ? <Meelwijzer returnTo={categoryRoute} /> : null}

      <View style={styles.headerRow}>
        <Text style={styles.headerEmoji}>{category.emoji}</Text>
        <Text style={styles.headerMeta}>
          {bites.length} {bites.length === 1 ? "artikel" : "artikelen"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>{getCategoryListTitle(rawCategoryId)}</Text>

      <View style={styles.list}>
        {bites.map((bite) => (
          <KnowledgeBiteCard
            key={bite.id}
            bite={bite}
            onPress={() =>
              router.push(buildKnowledgeBiteHref(bite.route, categoryRoute) as Href)
            }
          />
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

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: BakeryColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14,
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
