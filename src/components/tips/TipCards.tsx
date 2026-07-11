import { StyleSheet, Text, View } from "react-native";

import { BakeryColors } from "@/constants/theme";
import type { Tip } from "@/types/tip";

const COLORS = {
  warmWhite: BakeryColors.warmWhite,
  brown: BakeryColors.brown,
  secondary: BakeryColors.textSecondary,
  orangeAccent: BakeryColors.orangeAccent,
};

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Tip</Text>
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
    borderColor: "rgba(184, 107, 56, 0.12)",
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
