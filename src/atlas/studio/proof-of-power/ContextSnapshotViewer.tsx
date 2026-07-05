import { StyleSheet, Text, View } from "react-native";

import type { ContextSnapshot } from "@/atlas/brain/context";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { StatusBadge } from "../os/design-system";

type ContextSnapshotViewerProps = {
  snapshot: ContextSnapshot;
};

export default function ContextSnapshotViewer({ snapshot }: ContextSnapshotViewerProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.goal}>{snapshot.goal}</Text>
        <StatusBadge label={snapshot.health} tone={snapshot.health === "healthy" ? "healthy" : "info"} />
      </View>

      <Text style={styles.meta}>
        {snapshot.currentModule.label} · {snapshot.currentLanguage} · {snapshot.loadedProviders.length} providers
      </Text>

      <View style={styles.grid}>
        <MetricBlock label="Memories" value={snapshot.relevantMemories.length} />
        <MetricBlock label="Entities" value={snapshot.relevantEntities.length} />
        <MetricBlock label="Knowledge" value={snapshot.relevantKnowledge.length} />
        <MetricBlock label="Workflows" value={snapshot.relevantWorkflows.length} />
      </View>

      {snapshot.plannerOutput ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Planner output</Text>
          <Text style={styles.sectionCopy}>
            {snapshot.plannerOutput.plannerId} · {snapshot.plannerOutput.steps.length} steps · {snapshot.plannerOutput.status}
          </Text>
        </View>
      ) : null}

      {snapshot.relevantMemories.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Relevant memories</Text>
          {snapshot.relevantMemories.slice(0, 3).map((memory) => (
            <Text key={memory.id} style={styles.sectionCopy}>
              • {memory.title} ({memory.type})
            </Text>
          ))}
        </View>
      ) : null}

      {snapshot.loadedProviders.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Loaded providers</Text>
          <Text style={styles.sectionCopy}>
            {snapshot.loadedProviders.slice(0, 6).map((provider) => provider.label).join(" · ")}
          </Text>
        </View>
      ) : null}

      <Text style={styles.timestamp}>Context snapshot · {new Date(snapshot.timestamp).toLocaleString()}</Text>
    </View>
  );
}

function MetricBlock({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metricBlock}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 16,
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },

  goal: {
    flex: 1,
    fontSize: 17,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    lineHeight: 24,
  },

  meta: {
    fontSize: 12,
    color: STUDIO_COLORS.secondary,
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  metricBlock: {
    minWidth: "22%",
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  metricLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
  },

  section: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: STUDIO_COLORS.border,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  sectionCopy: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },

  timestamp: {
    marginTop: 12,
    fontSize: 11,
    color: STUDIO_COLORS.secondary,
  },
});
