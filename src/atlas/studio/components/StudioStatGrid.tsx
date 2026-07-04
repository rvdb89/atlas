import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";

type StatItem = {
  label: string;
  value: string;
  hint?: string;
};

export default function StudioStatGrid({ items }: { items: StatItem[] }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
          {item.hint ? <Text style={styles.hint}>{item.hint}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },

  card: {
    width: "48%",
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    minHeight: 92,
  },

  value: {
    fontSize: 28,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    letterSpacing: -0.5,
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  hint: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: STUDIO_COLORS.secondary,
  },
});
