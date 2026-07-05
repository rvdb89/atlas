import { StyleSheet, Text, View } from "react-native";

import type { CommandCenterPlannerView } from "./types";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { Metric, StatusBadge } from "../os/design-system";

type PlannerStatusPanelProps = {
  planner: CommandCenterPlannerView;
};

export default function PlannerStatusPanel({ planner }: PlannerStatusPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Atlas Planner</Text>

      <View style={styles.metrics}>
        <Metric label="Planner Status" value={planner.status} />
        <Metric label="Queue" value={planner.queueLength} />
      </View>

      <View style={styles.rows}>
        <Text style={styles.rowLabel}>Current Plan</Text>
        <Text style={styles.rowValue}>{planner.currentPlanGoal ?? "No active plan"}</Text>
      </View>

      <View style={styles.rows}>
        <Text style={styles.rowLabel}>Next Step</Text>
        <Text style={styles.rowValue}>{planner.nextStep ?? "Waiting for goal"}</Text>
      </View>

      <View style={styles.rows}>
        <Text style={styles.rowLabel}>Planner</Text>
        <StatusBadge label={planner.plannerId ?? "idle"} tone={planner.status === "executing" ? "warning" : "info"} />
      </View>

      <Text style={styles.hint}>Atlas plans before any workflow executes.</Text>
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

  rows: {
    marginBottom: 10,
  },

  rowLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  rowValue: {
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.brown,
    fontWeight: "600",
  },

  hint: {
    marginTop: 8,
    fontSize: 12,
    color: STUDIO_COLORS.secondary,
  },
});
