import type { ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { V2 } from "./v2Theme";

type GlassCardProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
};

export default function GlassCard({
  title,
  subtitle,
  badge,
  children,
  style,
  noPadding,
}: GlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={noPadding ? undefined : styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: V2.bgGlass,
    borderRadius: V2.radius,
    borderWidth: 1,
    borderColor: V2.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: V2.border,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: V2.text,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: V2.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: V2.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: V2.borderGlow,
  },
  badgeText: {
    color: V2.accent,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  body: {
    padding: 18,
  },
});
