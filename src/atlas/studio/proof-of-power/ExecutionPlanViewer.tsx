import { StyleSheet, Text, View } from "react-native";

import type { ExecutionPlan, ExecutionPlanStep } from "@/atlas/brain/planner/planner.types";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { StatusBadge } from "../os/design-system";

type ExecutionPlanViewerProps = {
  plan: ExecutionPlan;
};

const STEP_TONE: Record<ExecutionPlanStep["status"], "healthy" | "warning" | "offline" | "mock" | "info"> = {
  pending: "info",
  running: "warning",
  completed: "healthy",
  failed: "offline",
  skipped: "mock",
};

export default function ExecutionPlanViewer({ plan }: ExecutionPlanViewerProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.goal}>{plan.goal}</Text>
        <StatusBadge label={plan.status} tone={plan.status === "completed" ? "healthy" : "info"} />
      </View>

      <Text style={styles.meta}>
        {plan.plannerId} · {plan.steps.length} steps · ~{Math.round(plan.estimatedDurationMs / 1000)}s
      </Text>

      <View style={styles.flow}>
        <View style={styles.goalNode}>
          <Text style={styles.goalLabel}>Goal</Text>
          <Text style={styles.goalText}>{plan.goal}</Text>
        </View>

        {plan.steps.map((step, index) => (
          <View key={step.id} style={styles.stepBlock}>
            <View style={styles.connector}>
              <View style={styles.arrowLine} />
              <Text style={styles.arrow}>↓</Text>
            </View>
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <StatusBadge label={step.status} tone={STEP_TONE[step.status]} />
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
              <Text style={styles.stepMeta}>
                {step.requiredAgents.length > 0 ? `Agents · ${step.requiredAgents.join(", ")}` : "Atlas rule-based"}
                {index === plan.steps.length - 1 ? "" : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>
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
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    lineHeight: 26,
  },

  meta: {
    fontSize: 12,
    color: STUDIO_COLORS.secondary,
    marginBottom: 16,
  },

  flow: {
    gap: 0,
  },

  goalNode: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  goalLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  goalText: {
    fontSize: 15,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  stepBlock: {
    marginTop: 4,
  },

  connector: {
    alignItems: "center",
    paddingVertical: 4,
  },

  arrowLine: {
    width: 2,
    height: 10,
    backgroundColor: STUDIO_COLORS.border,
  },

  arrow: {
    fontSize: 16,
    color: STUDIO_COLORS.accentSoft,
    fontWeight: "700",
  },

  stepCard: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  stepLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  stepDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },

  stepMeta: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
  },
});
