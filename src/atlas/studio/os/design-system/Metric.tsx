import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../../core/theme";

type MetricProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export default function Metric({ label, value, hint }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    minWidth: 120,
    flexGrow: 1,
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  value: {
    fontSize: 24,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  hint: {
    marginTop: 4,
    fontSize: 11,
    color: STUDIO_COLORS.secondary,
  },
});
