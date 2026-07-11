import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot, LivePlanStepSummary } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import { V2, type V2Tone } from "./v2Theme";

type LivePlanSectionV2Props = {
  snapshot: ControlSnapshot;
};

const PLAN_STATUS_LABEL: Record<string, string> = {
  draft: "Concept",
  ready: "Klaar om te starten",
  executing: "Bezig",
  completed: "Afgerond",
  failed: "Mislukt",
  cancelled: "Geannuleerd",
};

const PLAN_STATUS_TONE: Record<string, V2Tone> = {
  draft: "neutral",
  ready: "accent",
  executing: "accent",
  completed: "success",
  failed: "danger",
  cancelled: "neutral",
};

const STEP_STATUS_LABEL: Record<LivePlanStepSummary["status"], string> = {
  pending: "Wacht",
  running: "Bezig",
  completed: "Klaar",
  failed: "Mislukt",
  skipped: "Overgeslagen",
};

const STEP_STATUS_TONE: Record<LivePlanStepSummary["status"], V2Tone> = {
  pending: "neutral",
  running: "accent",
  completed: "success",
  failed: "danger",
  skipped: "warning",
};

/** Context/Planner integration (2026-07-11) · "Wat Atlas nu doet" — the live ExecutionPlan
 * for whichever mission the runtime is currently focused on, step by step, instead of only
 * ever showing a final diff in the CEO Inbox once everything is already done. Renders nothing
 * when no plan is registered (e.g. between cycles, or the plan aged out of the runtime's
 * capped executionQueue) — this section is additive, never a hard requirement for the rest
 * of the dashboard to function. */
export default function LivePlanSectionV2({ snapshot }: LivePlanSectionV2Props) {
  const plan = snapshot.livePlan;
  if (!plan) return null;

  const completedCount = plan.steps.filter((step) => step.status === "completed" || step.status === "skipped").length;

  return (
    <GlassCard
      title="Nu bezig"
      subtitle={plan.missionId ? `${plan.missionId} — ${plan.goal}` : plan.goal}
      badge="Live"
    >
      <View style={styles.headerRow}>
        <StatusPill label={PLAN_STATUS_LABEL[plan.status] ?? plan.status} tone={PLAN_STATUS_TONE[plan.status] ?? "neutral"} />
        <Text style={styles.progressLabel}>
          {completedCount}/{plan.steps.length} stappen
        </Text>
      </View>

      <View style={styles.stepList}>
        {plan.steps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepIndexColumn}>
              <Text style={styles.stepIndex}>{index + 1}</Text>
            </View>
            <View style={styles.stepBody}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepLabel} numberOfLines={1}>
                  {step.label}
                </Text>
                <StatusPill
                  label={STEP_STATUS_LABEL[step.status]}
                  tone={STEP_STATUS_TONE[step.status]}
                />
              </View>
              <Text style={styles.stepDescription} numberOfLines={2}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: V2.textDim,
  },

  stepList: {
    marginTop: 14,
    gap: 8,
  },

  stepRow: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  stepIndexColumn: {
    width: 22,
    alignItems: "center",
  },

  stepIndex: {
    fontSize: 12,
    fontWeight: "800",
    color: V2.textDim,
  },

  stepBody: {
    flex: 1,
  },

  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  stepLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: V2.text,
  },

  stepDescription: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: V2.textMuted,
  },
});
