import { router, type Href } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { BakeryColors, BakeryFonts } from "@/constants/theme";
import type { Recipe } from "@/types/recipe";

/**
 * Shared recipe row — editorial/rustig direction: a numbered circle, serif title, one
 * quiet meta line and a thin divider between rows. Replaces the plain text cards
 * previously duplicated in bread.tsx / pizza.tsx and the differently-styled card that
 * used to live only in recipes.tsx — one consistent row style everywhere now.
 *
 * When `recipe.image` is set, the real photo replaces the numbered circle. Until then it
 * falls back to the number — never a fabricated placeholder image.
 */
export default function RecipeCard({
  recipe,
  index,
  isLast,
}: {
  recipe: Recipe;
  index: number;
  isLast?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        isLast && styles.rowLast,
        pressed && styles.rowPressed,
      ]}
      onPress={() => router.push(recipe.route as Href)}
    >
      {recipe.image ? (
        <Image source={recipe.image} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{number}</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.meta}>
          {recipe.meta.difficultyLabel} · {recipe.meta.durationLabel}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(43, 33, 24, 0.12)",
  },

  rowLast: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(43, 33, 24, 0.12)",
  },

  rowPressed: {
    opacity: 0.65,
  },

  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BakeryColors.brown,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: BakeryColors.peach,
    fontSize: 13,
    fontWeight: "700",
  },

  thumb: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  body: {
    flex: 1,
  },

  title: {
    fontFamily: BakeryFonts.display,
    fontSize: 17,
    fontWeight: "700",
    color: BakeryColors.brown,
  },

  meta: {
    marginTop: 3,
    fontSize: 12,
    color: BakeryColors.textSecondary,
  },

  arrow: {
    fontSize: 18,
    fontWeight: "700",
    color: BakeryColors.orangeAccent,
  },
});
