import { router, type Href } from "expo-router";
import { StyleSheet, View } from "react-native";

import { KnowledgeCategoryCard } from "@/components/knowledge/KnowledgeCards";
import ScreenLayout from "@/components/ScreenLayout";
import { getTipsByCategory, tipCategoryList } from "@/data/tips";

export default function TipsScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Tips & Tricks"
      subtitle="Praktische tips, snelle oplossingen en slimme baktrucs — direct toepasbaar in je keuken."
    >
      <View style={styles.list}>
        {tipCategoryList.map((category) => {
          const tipCount = getTipsByCategory(category.id).length;

          if (tipCount === 0) {
            return null;
          }

          return (
            <KnowledgeCategoryCard
              key={category.id}
              category={category}
              articleCount={tipCount}
              countSingular="tip"
              countPlural="tips"
              onPress={() =>
                router.push(`/tips/category/${category.id}` as Href)
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
