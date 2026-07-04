import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { buildKnowledgeBiteHref } from "@/utils/knowledgeNavigation";

const COLORS = {
  warmWhite: "#FFFDF8",
  card: "#F8F0E6",
  brown: "#2B2118",
  secondary: "#7A6652",
  orangeAccent: "#B86B38",
};

type RecipeKnowledgeBiteCTAProps = {
  route: string;
  returnTo: string;
};

export default function RecipeKnowledgeBiteCTA({
  route,
  returnTo,
}: RecipeKnowledgeBiteCTAProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Meer leren over dit recept?</Text>
      <Text style={styles.text}>
        Ontdek de volledige achtergrond, wetenschap, technieken en uitleg in de
        Knowledge Bite.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push(buildKnowledgeBiteHref(route, returnTo) as Href)}
      >
        <Text style={styles.buttonText}>➡ Bekijk Knowledge Bite</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    backgroundColor: COLORS.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brown,
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.secondary,
    marginBottom: 16,
  },

  button: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.12)",
  },

  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.orangeAccent,
  },
});
