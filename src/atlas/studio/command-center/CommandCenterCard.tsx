import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import type { CommandCenterStatus } from "./types";

const STATUS_LABEL: Record<CommandCenterStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  offline: "Offline",
  planned: "Planned",
  mock: "Mock",
};

const STATUS_COLOR: Record<CommandCenterStatus, string> = {
  healthy: STUDIO_COLORS.success,
  warning: STUDIO_COLORS.warning,
  offline: STUDIO_COLORS.danger,
  planned: STUDIO_COLORS.secondary,
  mock: STUDIO_COLORS.accentSoft,
};

type CommandCenterCardProps = {
  title: string;
  subtitle?: string;
  status?: CommandCenterStatus;
  children?: ReactNode;
};

export default function CommandCenterCard({ title, subtitle, status, children }: CommandCenterCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {status ? (
          <View style={[styles.badge, { backgroundColor: `${STATUS_COLOR[status]}18` }]}>
            <Text style={[styles.badgeText, { color: STATUS_COLOR[status] }]}>{STATUS_LABEL[status]}</Text>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function CommandCenterStatusBadge({ status }: { status: CommandCenterStatus }) {
  return (
    <View style={[styles.inlineBadge, { backgroundColor: `${STATUS_COLOR[status]}18` }]}>
      <Text style={[styles.inlineBadgeText, { color: STATUS_COLOR[status] }]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

export function CommandCenterRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: CommandCenterStatus;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {status ? <CommandCenterStatusBadge status={status} /> : null}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },

  headerCopy: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  inlineBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  inlineBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  rowCopy: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  rowValue: {
    marginTop: 2,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },
});
