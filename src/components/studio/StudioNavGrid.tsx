import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_NAV_ITEMS } from "./studioTheme";

export default function StudioNavGrid() {
  return (
    <View style={styles.grid}>
      {STUDIO_NAV_ITEMS.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => router.push(item.route as Href)}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    width: "48%",
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
    minHeight: 120,
  },

  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },
});
