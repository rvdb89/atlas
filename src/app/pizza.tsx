import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import { getRecipesByCategory } from "@/data/recipes";

const pizzaRecipes = getRecipesByCategory("Pizza");

export default function PizzaScreen() {
  return (
    <ScreenLayout
      backTo="/"
      title="Pizza"
      subtitle="Kies de stijl die bij jouw bakavond past."
    >
      {pizzaRecipes.map((recipe) => (
        <Pressable
          key={recipe.id}
          style={styles.card}
          onPress={() => router.push(recipe.route as Href)}
        >
          <Text style={styles.cardTitle}>{recipe.name}</Text>
          <Text style={styles.cardText}>{recipe.tagline}</Text>
          <Text style={styles.meta}>{recipe.meta.difficultyLabel}</Text>
        </Pressable>
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2118",
    marginBottom: 6,
  },
  cardText: {
    color: "#7A6652",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 10,
  },
  meta: { color: "#B86B38", fontWeight: "600" },
});
