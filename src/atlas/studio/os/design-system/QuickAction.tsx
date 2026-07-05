import { Pressable, StyleSheet, Text } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../../core/theme";

type QuickActionProps = {
  emoji: string;
  label: string;
  onPress: () => void;
};

export default function QuickAction({ emoji, label, onPress }: QuickActionProps) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: STUDIO_RADIUS.input,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  emoji: {
    fontSize: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },
});
