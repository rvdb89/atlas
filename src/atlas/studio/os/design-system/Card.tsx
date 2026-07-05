import type { ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS, STUDIO_SPACING } from "../../core/theme";

type CardProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  style?: ViewStyle;
  footer?: ReactNode;
};

export default function Card({ title, subtitle, children, style, footer }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: STUDIO_SPACING.card,
    marginBottom: STUDIO_SPACING.section,
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
    marginBottom: 12,
  },
});
