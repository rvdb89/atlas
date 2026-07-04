import { Pressable, StyleSheet, Text } from "react-native";

import { STUDIO_COLORS } from "../core/theme";

type StudioChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function StudioChip({ label, active, onPress }: StudioChipProps) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  chipActive: {
    backgroundColor: STUDIO_COLORS.accent,
    borderColor: STUDIO_COLORS.accent,
  },

  text: {
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
  },

  textActive: {
    color: STUDIO_COLORS.warmWhite,
  },
});
