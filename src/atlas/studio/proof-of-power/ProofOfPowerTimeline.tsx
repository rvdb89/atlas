import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import type { WorkflowStep } from "@/atlas/workflows/proof-of-power/types";

type ProofOfPowerTimelineProps = {
  steps: WorkflowStep[];
};

const STATUS_LABEL: Record<WorkflowStep["status"], string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

const STATUS_COLOR: Record<WorkflowStep["status"], string> = {
  pending: STUDIO_COLORS.secondary,
  running: STUDIO_COLORS.warning,
  completed: STUDIO_COLORS.success,
  failed: STUDIO_COLORS.danger,
};

export default function ProofOfPowerTimeline({ steps }: ProofOfPowerTimelineProps) {
  return (
    <View style={styles.list}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.row}>
          <View style={styles.rail}>
            <View style={[styles.dot, { backgroundColor: STATUS_COLOR[step.status] }]} />
            {index < steps.length - 1 ? <View style={styles.line} /> : null}
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.label}>{step.label}</Text>
              <Text style={[styles.status, { color: STATUS_COLOR[step.status] }]}>
                {STATUS_LABEL[step.status]}
              </Text>
            </View>
            <Text style={styles.description}>{step.description}</Text>
            {step.taskName ? (
              <Text style={styles.meta}>
                {step.system === "orchestrator" ? `Task · ${step.taskName}` : step.system}
              </Text>
            ) : (
              <Text style={styles.meta}>{step.system}</Text>
            )}
            {step.error ? <Text style={styles.error}>{step.error}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    gap: 14,
  },

  rail: {
    width: 18,
    alignItems: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: 4,
  },

  line: {
    flex: 1,
    width: 2,
    backgroundColor: STUDIO_COLORS.border,
    marginVertical: 4,
    minHeight: 28,
  },

  content: {
    flex: 1,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 14,
    marginBottom: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  status: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  description: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },

  meta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
  },

  error: {
    marginTop: 8,
    fontSize: 13,
    color: STUDIO_COLORS.danger,
  },
});
