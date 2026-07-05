import { Pressable, StyleSheet, Text } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../../core/theme";

type CommandButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
};

export default function CommandButton({ label, onPress, variant = "ghost" }: CommandButtonProps) {
  return (
    <Pressable
      style={[styles.button, variant === "primary" ? styles.primary : styles.ghost]}
      onPress={onPress}
    >
      <Text style={[styles.label, variant === "primary" ? styles.primaryLabel : styles.ghostLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: STUDIO_RADIUS.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },

  primary: {
    backgroundColor: STUDIO_COLORS.accent,
    borderColor: STUDIO_COLORS.accent,
  },

  ghost: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderColor: STUDIO_COLORS.border,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
  },

  primaryLabel: {
    color: STUDIO_COLORS.warmWhite,
  },

  ghostLabel: {
    color: STUDIO_COLORS.brown,
  },
});
