import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { V2 } from "./v2Theme";

type V2PanelProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
  accent?: boolean;
};

export default function V2Panel({ title, subtitle, badge, children, accent }: V2PanelProps) {
  return (
    <View style={[styles.panel, accent ? styles.panelAccent : null]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: V2.panel,
    borderRadius: V2.radius,
    borderWidth: 1,
    borderColor: V2.panelBorder,
    padding: 18,
    marginBottom: 14,
  },

  panelAccent: {
    borderColor: `${V2.accent}44`,
    shadowColor: V2.accent,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },

  headerCopy: { flex: 1 },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: V2.text,
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: V2.textMuted,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: `${V2.accent}18`,
    borderWidth: 1,
    borderColor: `${V2.accent}33`,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.accent,
    textTransform: "uppercase",
  },
});
