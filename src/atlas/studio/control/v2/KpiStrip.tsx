import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import { V2 } from "./v2Theme";

type KpiStripProps = {
  snapshot: ControlSnapshot;
};

type KpiItem = {
  label: string;
  value: string;
  accent?: boolean;
};

export default function KpiStrip({ snapshot }: KpiStripProps) {
  const state = snapshot.companyState;
  const runningInitiatives = snapshot.roadmap.filter(
    (item) => item.lane === "now" && item.progress < 100,
  ).length;
  const avgRoadmap =
    snapshot.businesses.length > 0
      ? Math.round(
          snapshot.businesses.reduce((sum, b) => sum + b.roadmapProgress, 0) /
            snapshot.businesses.length,
        )
      : 0;

  const items: KpiItem[] = [
    { label: "Active businesses", value: String(state.counts.businesses) },
    { label: "Active agents", value: String(state.counts.agents) },
    { label: "Running initiatives", value: String(runningInitiatives) },
    { label: "Pending approvals", value: String(state.counts.pendingApprovals), accent: true },
    { label: "Open bugs", value: String(state.counts.bugs) },
    { label: "Blockers", value: String(state.counts.blockers) },
    { label: "Roadmap progress", value: `${avgRoadmap}%` },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.shell}
    >
      {items.map((item) => (
        <View key={item.label} style={[styles.chip, item.accent && styles.chipAccent]}>
          <Text style={styles.chipValue}>{item.value}</Text>
          <Text style={styles.chipLabel}>{item.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: 18,
    flexGrow: 0,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 2,
  },

  chip: {
    minWidth: 118,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgGlass,
    borderWidth: 1,
    borderColor: V2.border,
  },

  chipAccent: {
    borderColor: V2.borderGlow,
    backgroundColor: V2.accentSoft,
  },

  chipValue: {
    fontSize: 20,
    fontWeight: "900",
    color: V2.text,
  },

  chipLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "600",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
