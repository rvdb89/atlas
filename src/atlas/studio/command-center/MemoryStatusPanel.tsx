import { StyleSheet, Text, View } from "react-native";

import type { CommandCenterMemoryView } from "./types";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { Metric, StatusBadge } from "../os/design-system";

type MemoryStatusPanelProps = {
  memory: CommandCenterMemoryView;
};

export default function MemoryStatusPanel({ memory }: MemoryStatusPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Atlas Memory</Text>

      <View style={styles.metrics}>
        <Metric label="Total" value={memory.total} />
        <Metric label="Workflows" value={memory.workflows} />
        <Metric label="Projects" value={memory.projects} />
        <Metric label="Preferences" value={memory.preferences} />
      </View>

      <View style={styles.row}>
        <StatusBadge label={`Memory ${memory.health}`} tone={memory.health === "healthy" ? "healthy" : "info"} />
      </View>

      <Text style={styles.section}>Recent memories</Text>
      {memory.recent.length === 0 ? (
        <Text style={styles.empty}>No memories stored yet.</Text>
      ) : (
        memory.recent.map((entry) => (
          <View key={entry.id} style={styles.item}>
            <Text style={styles.itemTitle}>{entry.title}</Text>
            <Text style={styles.itemMeta}>
              {entry.type} · importance {entry.importance}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginBottom: 12,
  },

  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  row: {
    marginBottom: 12,
  },

  section: {
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  empty: {
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  itemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  itemMeta: {
    marginTop: 2,
    fontSize: 11,
    color: STUDIO_COLORS.secondary,
  },
});
