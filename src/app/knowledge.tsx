import { router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";

import KnowledgeExplorer from "@/components/knowledge/KnowledgeExplorer";
import { KnowledgeCategoryCard } from "@/components/knowledge/KnowledgeCards";
import ScreenLayout from "@/components/ScreenLayout";
import { getKnowledgeBitesByCategory } from "@/data/knowledgeBites";
import { knowledgeCategoryList } from "@/data/knowledgeCategories";
import { buildKnowledgeBiteHref } from "@/utils/knowledgeNavigation";

export default function KnowledgeScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Knowledge"
      subtitle="De bakbibliotheek van Doughbert — leer over brood, pizza, meel, fermentatie en bakwetenschap."
    >
      <KnowledgeExplorer
        returnTo="/knowledge"
        onOpenBite={(bite) =>
          router.push(buildKnowledgeBiteHref(bite.route, "/knowledge") as Href)
        }
      />

      <View style={styles.list}>
        {knowledgeCategoryList.map((category) => {
          const articleCount = getKnowledgeBitesByCategory(category.id).length;

          if (articleCount === 0) {
            return null;
          }

          return (
            <KnowledgeCategoryCard
              key={category.id}
              category={category}
              articleCount={articleCount}
              onPress={() =>
                router.push(`/knowledge/category/${category.id}` as Href)
              }
            />
          );
        })}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
});
