import { router, type Href } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PageNav from "@/components/PageNav";
import { recipeList } from "@/data/recipes";
import type { Recipe } from "@/types/recipe";

const COLORS = {
  cream: "#F7F1E8",
  warmWhite: "#FFFDF8",
  card: "#F8F0E6",
  brown: "#2B2118",
  secondary: "#7A6652",
  orangeAccent: "#B86B38",
};

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 12,
            paddingBottom: Math.max(insets.bottom, 20) + 32,
          },
        ]}
      >
        <PageNav backTo="/" />

        <Text style={styles.title}>Recepten</Text>
        <Text style={styles.subtitle}>
          Ontdek en bewaar recepten.
        </Text>

        <View style={styles.list}>
          {recipeList.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => router.push(recipe.route as Href)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function RecipeCard({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardCategory}>{recipe.category}</Text>
        <Text style={styles.cardArrow}>›</Text>
      </View>

      <Text style={styles.cardTitle}>{recipe.name}</Text>
      <Text style={styles.cardTagline}>{recipe.tagline}</Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Moeilijkheid</Text>
          <Text style={styles.metaValue}>{recipe.meta.difficultyLabel}</Text>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Totale tijd</Text>
          <Text style={styles.metaValue}>{recipe.meta.durationLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.brown,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.secondary,
  },

  list: {
    gap: 14,
  },

  card: {
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

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  cardCategory: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  cardArrow: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.orangeAccent,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.brown,
  },

  cardTagline: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.secondary,
  },

  cardMeta: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
  },

  metaItem: {
    flex: 1,
  },

  metaLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  metaValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.brown,
  },

  metaDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(184, 107, 56, 0.15)",
    marginHorizontal: 14,
  },
});
