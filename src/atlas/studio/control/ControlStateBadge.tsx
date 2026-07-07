import { StyleSheet, Text, View } from "react-native";

import { CONTROL_COLORS } from "./theme";

type ControlStateBadgeProps = {
  detail?: string;
  compact?: boolean;
};

/** Visible proof that a section reads from the Company State Engine. */
export default function ControlStateBadge({ detail, compact = false }: ControlStateBadgeProps) {
  return (
    <View style={[styles.badge, compact ? styles.badgeCompact : null]}>
      <View style={styles.dot} />
      <Text style={styles.label}>Live from Company State</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: `${CONTROL_COLORS.success}14`,
    borderWidth: 1,
    borderColor: `${CONTROL_COLORS.success}44`,
    marginBottom: 12,
  },

  badgeCompact: {
    marginBottom: 8,
    paddingVertical: 5,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: CONTROL_COLORS.success,
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.success,
    letterSpacing: 0.3,
  },

  detail: {
    fontSize: 10,
    fontWeight: "600",
    color: CONTROL_COLORS.textSoft,
  },
});
