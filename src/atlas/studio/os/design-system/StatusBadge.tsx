import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../../core/theme";

type StatusTone = "healthy" | "warning" | "offline" | "mock" | "info";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

const TONE_COLORS: Record<StatusTone, string> = {
  healthy: STUDIO_COLORS.success,
  warning: STUDIO_COLORS.warning,
  offline: STUDIO_COLORS.danger,
  mock: STUDIO_COLORS.accentSoft,
  info: STUDIO_COLORS.secondary,
};

export default function StatusBadge({ label, tone = "info" }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${TONE_COLORS[tone]}18` }]}>
      <View style={[styles.dot, { backgroundColor: TONE_COLORS[tone] }]} />
      <Text style={[styles.label, { color: TONE_COLORS[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
