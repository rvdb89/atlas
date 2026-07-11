import { router } from "expo-router";
import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import RecipeKnowledgeBiteCTA from "@/components/RecipeKnowledgeBiteCTA";
import { BakeryColors, BakeryFonts } from "@/constants/theme";
import {
  getKnowledgeBite,
  getKnowledgeBiteForRecipe,
} from "@/data/knowledgeBites";
import { FLOUR_LABELS } from "@/data/recipes";
import type {
  FlourKey,
  Recipe,
  RecipeCategory,
  RecipeIngredient,
} from "@/types/recipe";

const COLORS = {
  cream: BakeryColors.cream,
  warmWhite: BakeryColors.warmWhite,
  card: BakeryColors.card,
  brown: BakeryColors.brown,
  secondary: BakeryColors.textSecondary,
  orange: BakeryColors.orange,
  orangeAccent: BakeryColors.orangeAccent,
  peach: BakeryColors.peach,
};

type RecipeDetailProps = {
  recipe: Recipe;
};

function getBackRoute(category: RecipeCategory): "/bread" | "/pizza" | "/" {
  switch (category) {
    case "Brood":
      return "/bread";
    case "Pizza":
      return "/pizza";
    default:
      return "/";
  }
}

function getFlourEntries(recipe: Recipe) {
  return (Object.entries(recipe.flour) as [FlourKey, number][]).filter(
    ([, percentage]) => percentage > 0,
  );
}

function resolveKnowledgeBiteRoute(recipe: Recipe): string | undefined {
  if (recipe.knowledgeBiteId) {
    return getKnowledgeBite(recipe.knowledgeBiteId)?.route;
  }

  return getKnowledgeBiteForRecipe(recipe.id)?.route;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const flourEntries = getFlourEntries(recipe);
  const knowledgeBiteRoute = resolveKnowledgeBiteRoute(recipe);

  return (
    <ScreenLayout
      backTo={getBackRoute(recipe.category)}
      title={recipe.name}
      subtitle={recipe.tagline}
    >
      {recipe.image ? (
        <Image source={recipe.image} style={styles.heroPhoto} resizeMode="cover" />
      ) : null}

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{recipe.category}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{recipe.meta.difficultyLabel}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Totale tijd" value={recipe.meta.durationLabel} />
        <StatCard label="Hydratatie" value={`${recipe.hydration}%`} />
        <StatCard label="Starter" value={`${recipe.starterPercentage}%`} />
        <StatCard label="Moeilijkheid" value={recipe.meta.difficultyLabel} />
      </View>

      <Section title="Introductie">
        <View style={styles.introCard}>
          <Text style={styles.introText}>{recipe.introduction}</Text>
        </View>
      </Section>

      <Section title="Bloemsamenstelling">
        <View style={styles.panel}>
          {flourEntries.map(([key, percentage]) => (
            <FlourRow
              key={key}
              label={FLOUR_LABELS[key]}
              percentage={percentage}
            />
          ))}
        </View>
      </Section>

      <Section title="Fermentatie">
        <View style={styles.panel}>
          <DetailRow
            label="Bulkfermentatie"
            value={`±${recipe.fermentation.baseBulkHours} uur`}
          />
          <DetailRow
            label="Koel rijzen"
            value={`${recipe.fermentation.coldProofMin}–${recipe.fermentation.coldProofMax} uur`}
          />
          <DetailRow
            label="Totale tijd"
            value={`${recipe.meta.totalHoursMin}–${recipe.meta.totalHoursMax} uur`}
          />
        </View>
      </Section>

      <Section title="Ingrediënten">
        <View style={styles.panel}>
          {recipe.ingredients.map((ingredient) => (
            <IngredientRow key={ingredient.id} ingredient={ingredient} />
          ))}
        </View>
      </Section>

      {knowledgeBiteRoute ? (
        <RecipeKnowledgeBiteCTA route={knowledgeBiteRoute} returnTo={recipe.route} />
      ) : null}

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() =>
          router.push({
            pathname: "/planner",
            params: { slug: recipe.slug },
          })
        }
      >
        <Text style={styles.ctaText}>Start Bake Planner</Text>
      </Pressable>
    </ScreenLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function FlourRow({
  label,
  percentage,
}: {
  label: string;
  percentage: number;
}) {
  return (
    <View style={styles.flourRow}>
      <View style={styles.flourCopy}>
        <Text style={styles.flourLabel}>{label}</Text>
        <Text style={styles.flourValue}>{percentage}%</Text>
      </View>
      <View style={styles.flourTrack}>
        <View style={[styles.flourFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function IngredientRow({ ingredient }: { ingredient: RecipeIngredient }) {
  return (
    <View style={styles.ingredientRow}>
      <View style={styles.ingredientCopy}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        {ingredient.note ? (
          <Text style={styles.ingredientNote}>{ingredient.note}</Text>
        ) : null}
      </View>
      <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroPhoto: {
    width: "100%",
    height: 220,
    borderRadius: 24,
    marginBottom: 16,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  badge: {
    backgroundColor: COLORS.peach,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8A4A1E",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },

  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.warmWhite,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  statValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.brown,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontFamily: BakeryFonts.display,
    fontSize: 21,
    fontWeight: "700",
    color: COLORS.brown,
    marginBottom: 14,
  },

  introCard: {
    backgroundColor: COLORS.peach,
    borderRadius: 24,
    padding: 22,
  },

  introText: {
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.brown,
  },

  panel: {
    backgroundColor: COLORS.warmWhite,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.12)",
  },

  flourRow: {
    marginBottom: 16,
  },

  flourCopy: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  flourLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brown,
    paddingRight: 12,
  },

  flourValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.orangeAccent,
  },

  flourTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.card,
    overflow: "hidden",
  },

  flourFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.orangeAccent,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(184, 107, 56, 0.08)",
  },

  detailLabel: {
    fontSize: 16,
    color: COLORS.secondary,
    flex: 1,
    paddingRight: 12,
  },

  detailValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.brown,
    textAlign: "right",
  },

  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(184, 107, 56, 0.08)",
  },

  ingredientName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brown,
  },

  ingredientNote: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondary,
  },

  ingredientCopy: {
    flex: 1,
    paddingRight: 16,
  },

  ingredientAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.orangeAccent,
  },

  cta: {
    marginTop: 32,
    marginBottom: 8,
    backgroundColor: COLORS.orangeAccent,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  ctaPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});
