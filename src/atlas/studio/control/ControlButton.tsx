import { Pressable, StyleSheet, Text } from "react-native";

import { CONTROL_COLORS } from "./theme";

type ControlButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export default function ControlButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: ControlButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.label,
          variant === "secondary" && styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  primary: {
    backgroundColor: CONTROL_COLORS.accent,
  },

  secondary: {
    backgroundColor: CONTROL_COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.border,
  },

  danger: {
    backgroundColor: `${CONTROL_COLORS.danger}33`,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.danger,
  },

  disabled: {
    opacity: 0.5,
  },

  label: {
    color: CONTROL_COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  secondaryLabel: {
    color: CONTROL_COLORS.textMuted,
  },
});
