import { StyleSheet, Text, View } from "react-native";

import type { Tip } from "@/types/tip";

const COLORS = {
  warmWhite: "#FFFDF8",
  brown: "#2B2118",
  secondary: "#7A6652",
  orangeAccent: "#B86B38",
};

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>💡 Tip</Text>
      <Text style={styles.text}>{tip.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orangeAccent,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  text: {
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.brown,
  },
});
