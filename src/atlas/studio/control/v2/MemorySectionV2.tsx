import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import { V2 } from "./v2Theme";

type MemorySectionV2Props = {
  snapshot: ControlSnapshot;
};

export default function MemorySectionV2({ snapshot }: MemorySectionV2Props) {
  const memoryDept = snapshot.operations.find((op) => op.department === "memory");
  const memoryDirector = snapshot.management.find((m) => m.title === "Memory Director");

  return (
    <GlassCard title="Memory" subtitle="Company knowledge and recall systems" badge="Live">
      <View style={styles.row}>
        <View style={styles.block}>
          <Text style={styles.label}>Department status</Text>
          <StatusPill label={memoryDept?.statusLabel ?? "Attention"} tone="warning" />
          <Text style={styles.focus}>{memoryDept?.currentFocus ?? "Memory upgrade proposal"}</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.label}>Memory Director</Text>
          <Text style={styles.director}>{memoryDirector?.currentResponsibility ?? "MEMORY-001 upgrade"}</Text>
          <Text style={styles.health}>{memoryDirector?.healthScore ?? 68}% health</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  block: {
    flex: 1,
    minWidth: 200,
    padding: 14,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  focus: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: V2.textMuted,
  },

  director: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: V2.text,
    lineHeight: 20,
  },

  health: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "800",
    color: V2.purple,
  },
});
