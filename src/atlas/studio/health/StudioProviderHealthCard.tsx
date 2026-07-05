import { StyleSheet, Text, View } from "react-native";

import type { LiveProviderHealthInfo } from "@/atlas/diagnostics/types";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";

type StudioProviderHealthCardProps = {
  provider: LiveProviderHealthInfo;
};

export default function StudioProviderHealthCard({ provider }: StudioProviderHealthCardProps) {
  const statusColor = provider.available ? STUDIO_COLORS.success : STUDIO_COLORS.danger;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{provider.label}</Text>
        <Text style={[styles.status, { color: statusColor }]}>
          {provider.available ? "Healthy" : "Offline"}
        </Text>
      </View>

      <Text style={styles.meta}>Health · {provider.available ? "available" : "unavailable"}</Text>
      <Text style={styles.meta}>Latency · {provider.latencyMs}ms</Text>
      <Text style={styles.meta}>Transport · {provider.transportMode}</Text>
      <Text style={styles.meta}>API key · {provider.hasApiKey ? "configured" : "mock mode"}</Text>

      <Text style={styles.section}>Available models ({provider.modelCount})</Text>
      <Text style={styles.models}>{provider.models.join(" · ") || "—"}</Text>

      <Text style={styles.section}>Capabilities</Text>
      <View style={styles.capabilityRow}>
        {provider.capabilities.textGeneration ? <Text style={styles.chip}>Text</Text> : null}
        {provider.capabilities.structuredOutput ? <Text style={styles.chip}>Structured</Text> : null}
        {provider.capabilities.imageGeneration ? <Text style={styles.chip}>Image</Text> : null}
        {provider.capabilities.streaming ? <Text style={styles.chip}>Streaming</Text> : null}
      </View>

      {provider.message ? <Text style={styles.message}>{provider.message}</Text> : null}
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

  section: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  models: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.brown,
  },

  capabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  message: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
    fontStyle: "italic",
  },
});
