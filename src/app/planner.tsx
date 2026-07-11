import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import { BakeryColors, BakeryFonts } from "@/constants/theme";
import { applyRecipeToBakePlan, bakePlan } from "@/data/bakePlan";
import { getRecipe, getRecipeBySlug } from "@/data/recipes";

export default function PlannerScreen() {
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();

  const recipeSlug =
    typeof slugParam === "string" ? slugParam : bakePlan.recipeSlug;

  const recipe = useMemo(
    () => getRecipeBySlug(recipeSlug) ?? getRecipe("country-loaf"),
    [recipeSlug],
  );

  useEffect(() => {
    applyRecipeToBakePlan(recipe);
  }, [recipe]);

  const goToTemperature = () => {
    router.push({
      pathname: "/planner-temperature",
      params: { slug: recipe.slug },
    });
  };

  return (
    <ScreenLayout
      backTo={recipe.route}
      title="Wanneer wil je genieten van vers brood?"
      subtitle="Kies je gewenste moment. Doughbert rekent straks terug wanneer wij moeten beginnen."
      headerExtra={<Text style={styles.step}>Stap 1 van 4</Text>}
    >
      <View style={styles.card}>
        <Pressable style={styles.option} onPress={goToTemperature}>
          <Text style={styles.optionTitle}>Morgenochtend</Text>
          <Text style={styles.optionText}>
            Perfect voor een rustig ontbijt.
          </Text>
        </Pressable>

        <Pressable style={styles.option} onPress={goToTemperature}>
          <Text style={styles.optionTitle}>Morgenavond</Text>
          <Text style={styles.optionText}>
            Ideaal bij soep, borrel of diner.
          </Text>
        </Pressable>

        <Pressable style={styles.option} onPress={goToTemperature}>
          <Text style={styles.optionTitle}>Overmorgen</Text>
          <Text style={styles.optionText}>
            Meer tijd, meer smaakontwikkeling.
          </Text>
        </Pressable>

        <Pressable style={styles.option} onPress={goToTemperature}>
          <Text style={styles.optionTitle}>Zelf gekozen moment</Text>
          <Text style={styles.optionText}>
            Bijvoorbeeld: over twee dagen om 07:00 bakken.
          </Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  step: {
    color: BakeryColors.orangeAccent,
    fontWeight: "700",
    marginBottom: 12,
  },

  card: {
    backgroundColor: BakeryColors.warmWhite,
    borderRadius: 24,
    padding: 16,
  },

  option: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: BakeryColors.cream,
    marginBottom: 12,
  },

  optionTitle: {
    fontFamily: BakeryFonts.display,
    fontSize: 18,
    fontWeight: "700",
    color: BakeryColors.brown,
  },

  optionText: {
    fontSize: 15,
    color: BakeryColors.textSecondary,
    marginTop: 4,
  },
});
