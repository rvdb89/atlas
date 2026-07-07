import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import V2Panel from "./V2Panel";
import { V2 } from "./v2Theme";

type CompanyOverviewV2Props = {
  snapshot: ControlSnapshot;
};

export default function CompanyOverviewV2({ snapshot }: CompanyOverviewV2Props) {
  const state = snapshot.companyState;
  const roadmapKpi = snapshot.kpis.find((kpi) => kpi.id === "roadmap-progress");
  const activeSprint = snapshot.sprints.find((sprint) => sprint.progress < 100);

  const metrics = [
    { label: "Businesses", value: String(state.counts.businesses) },
    { label: "Agents active", value: String(snapshot.management.filter((m) => m.status === "active").length) },
    { label: "Open bugs", value: String(state.counts.bugs) },
    { label: "Blockers", value: String(state.counts.blockers) },
    { label: "Roadmap", value: roadmapKpi?.value ?? "—" },
    { label: "Sprint", value: activeSprint ? `${activeSprint.progress}%` : "—" },
  ];

  return (
    <V2Panel title="Company Overview" subtitle="Active portfolio at a glance.">
      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.businessList}>
        {snapshot.businesses.slice(0, 3).map((business) => (
          <View key={business.id} style={styles.businessRow}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.businessMeta}>
              {business.statusLabel} · {business.currentSprint}
            </Text>
          </View>
        ))}
      </View>
    </V2Panel>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  metric: {
    width: "30%",
    minWidth: 90,
    flexGrow: 1,
    padding: 12,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.panelBorder,
    alignItems: "center",
  },

  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    color: V2.accent,
  },

  metricLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "700",
    color: V2.textSoft,
    textTransform: "uppercase",
    textAlign: "center",
  },

  businessList: {
    marginTop: 14,
  },

  businessRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: V2.panelBorder,
  },

  businessName: {
    fontSize: 14,
    fontWeight: "800",
    color: V2.text,
  },

  businessMeta: {
    marginTop: 2,
    fontSize: 12,
    color: V2.textMuted,
  },
});
