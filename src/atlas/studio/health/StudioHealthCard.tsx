import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import type { AtlasSubsystemHealth, DiagnosticStatus } from "@/atlas/diagnostics/types";

const STATUS_LABEL: Record<DiagnosticStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  offline: "Offline",
  placeholder: "Placeholder",
};

const STATUS_COLOR: Record<DiagnosticStatus, string> = {
  healthy: STUDIO_COLORS.success,
  degraded: STUDIO_COLORS.warning,
  offline: STUDIO_COLORS.danger,
  placeholder: STUDIO_COLORS.secondary,
};

type StudioHealthCardProps = {
  subsystem: AtlasSubsystemHealth;
};

export default function StudioHealthCard({ subsystem }: StudioHealthCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{subsystem.title}</Text>
        <Text style={[styles.status, { color: STATUS_COLOR[subsystem.status] }]}>
          {STATUS_LABEL[subsystem.status]}
        </Text>
      </View>

      <Text style={styles.meta}>Version · {subsystem.version}</Text>
      <Text style={styles.meta}>Modules · {subsystem.moduleCount ?? 0}</Text>

      <Text style={styles.servicesLabel}>Registered services</Text>
      {subsystem.registeredServices.map((service) => (
        <Text key={`${subsystem.id}-${service}`} style={styles.serviceItem}>
          • {service}
        </Text>
      ))}

      {subsystem.detail ? <Text style={styles.detail}>{subsystem.detail}</Text> : null}
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
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  status: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  meta: {
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
    marginBottom: 4,
  },

  servicesLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  serviceItem: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.brown,
  },

  detail: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
    fontStyle: "italic",
  },
});
