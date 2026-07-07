import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CONTROL_COLORS, CONTROL_RADIUS } from "./theme";
import ControlStateBadge from "./ControlStateBadge";
import type { ControlStatus, KpiStatus, KpiTrend } from "./types";

const STATUS_LABEL: Record<ControlStatus, string> = {
  healthy: "Healthy",
  attention: "Attention",
  critical: "Critical",
  idle: "Idle",
  active: "Active",
  pending: "Pending",
  planning: "Planning",
};

const STATUS_COLOR: Record<ControlStatus, string> = {
  healthy: CONTROL_COLORS.success,
  attention: CONTROL_COLORS.warning,
  critical: CONTROL_COLORS.danger,
  idle: CONTROL_COLORS.textMuted,
  active: CONTROL_COLORS.accent,
  pending: CONTROL_COLORS.gold,
  planning: CONTROL_COLORS.textSoft,
};

const KPI_STATUS_COLOR: Record<KpiStatus, string> = {
  healthy: CONTROL_COLORS.success,
  attention: CONTROL_COLORS.warning,
  critical: CONTROL_COLORS.danger,
};

type ControlCardProps = {
  title: string;
  subtitle?: string;
  status?: ControlStatus;
  statusLabel?: string;
  liveFromState?: boolean;
  stateDetail?: string;
  children?: ReactNode;
};

export default function ControlCard({
  title,
  subtitle,
  status,
  statusLabel,
  liveFromState,
  stateDetail,
  children,
}: ControlCardProps) {
  const badgeLabel = statusLabel ?? (status ? STATUS_LABEL[status] : undefined);
  const badgeColor = status ? STATUS_COLOR[status] : CONTROL_COLORS.textMuted;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {badgeLabel ? (
          <View style={[styles.badge, { backgroundColor: `${badgeColor}22` }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
          </View>
        ) : null}
      </View>
      {liveFromState ? <ControlStateBadge detail={stateDetail} compact /> : null}
      {children}
    </View>
  );
}

export function ControlRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: ControlStatus;
}) {
  const color = status ? STATUS_COLOR[status] : CONTROL_COLORS.textMuted;

  return (
    <View style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {status ? (
        <View style={[styles.dot, { backgroundColor: color }]} />
      ) : null}
    </View>
  );
}

export function ControlKpi({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: string;
  trend: KpiTrend;
  status: KpiStatus;
}) {
  const trendSymbol = { up: "↑", down: "↓", flat: "→" }[trend];
  const statusColor = KPI_STATUS_COLOR[status];

  return (
    <View style={styles.metric}>
      <View style={styles.kpiHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={[styles.kpiTrend, { color: statusColor }]}>{trendSymbol}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={[styles.kpiStatusDot, { backgroundColor: statusColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CONTROL_COLORS.surface,
    borderRadius: CONTROL_RADIUS.card,
    padding: 18,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.border,
    marginBottom: 14,
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
    fontSize: 17,
    fontWeight: "800",
    color: CONTROL_COLORS.text,
    letterSpacing: 0.2,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: CONTROL_COLORS.textMuted,
  },

  badge: {
    borderRadius: CONTROL_RADIUS.chip,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  rowCopy: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: CONTROL_COLORS.text,
  },

  rowValue: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: CONTROL_COLORS.textMuted,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  metric: {
    flex: 1,
    minWidth: 120,
    backgroundColor: CONTROL_COLORS.surfaceElevated,
    borderRadius: CONTROL_RADIUS.metric,
    padding: 14,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.borderSoft,
  },

  metricLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  metricValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
  },

  metricHint: {
    marginTop: 4,
    fontSize: 12,
    color: CONTROL_COLORS.textMuted,
  },

  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  kpiTrend: {
    fontSize: 14,
    fontWeight: "900",
  },

  kpiStatusDot: {
    marginTop: 8,
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
