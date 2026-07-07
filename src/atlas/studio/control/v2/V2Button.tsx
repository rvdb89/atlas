import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

import { V2 } from "./v2Theme";

type V2ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger";
  style?: ViewStyle;
  compact?: boolean;
};

export default function V2Button({
  label,
  onPress,
  variant = "primary",
  style,
  compact,
}: V2ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "success" && styles.success,
        variant === "danger" && styles.danger,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" && styles.labelPrimary,
          variant === "secondary" && styles.labelSecondary,
          variant === "ghost" && styles.labelGhost,
          variant === "success" && styles.labelSuccess,
          variant === "danger" && styles.labelDanger,
          compact && styles.labelCompact,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: V2.radiusSm,
    paddingHorizontal: 18,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  compact: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  primary: {
    backgroundColor: V2.accent,
    borderWidth: 1,
    borderColor: V2.borderGlow,
  },
  secondary: {
    backgroundColor: V2.bgGlass,
    borderWidth: 1,
    borderColor: V2.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: V2.border,
  },
  success: {
    backgroundColor: V2.successSoft,
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
  danger: {
    backgroundColor: V2.dangerSoft,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.3)",
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelCompact: {
    fontSize: 11,
  },
  labelPrimary: {
    color: "#021018",
  },
  labelSecondary: {
    color: V2.text,
  },
  labelGhost: {
    color: V2.textMuted,
  },
  labelSuccess: {
    color: V2.success,
  },
  labelDanger: {
    color: V2.danger,
  },
});
