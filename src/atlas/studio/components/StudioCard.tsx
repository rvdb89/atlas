import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";

type StudioCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  compact?: boolean;
};

export default function StudioCard({ title, subtitle, children, compact }: StudioCardProps) {
  return (
    <View style={[styles.card, compact && styles.compact]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    marginBottom: 12,
  },

  compact: {
    padding: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
    marginBottom: 10,
  },
});
