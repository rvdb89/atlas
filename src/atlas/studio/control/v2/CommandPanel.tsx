import { StyleSheet, Text, View } from "react-native";

import type { ActiveSprint, ControlSnapshot, LivePlanSummary } from "../types";
import GlassCard from "./GlassCard";
import { V2 } from "./v2Theme";

type CommandPanelProps = {
  snapshot: ControlSnapshot;
};

type PlanWorkSummary = {
  line: string;
  progress: string | null;
};

/** CEO decision 2026-07-12 — the "no active plan" state used to be one flat sentence regardless
 * of why nothing was running, which read as contradictory next to "Current initiative" showing
 * real progress (e.g. "TIPS-001 75%" next to "Atlas has no active plan right now" — technically
 * both true, but feels like Atlas is and isn't working at once). Grounds the empty state in the
 * same real `ActiveSprint.lifecycle` "Current initiative" already shows, so the two blocks
 * explain each other instead of appearing to disagree. Only these four cases are handled —
 * anything else (no active sprint at all, or a lifecycle this switch doesn't recognize) falls
 * through to the same honest, uninformative-but-true default. No new status is derived or
 * guessed here — every branch maps 1:1 to a real, already-computed SprintLifecycle value. */
function describeEmptyPlanStatus(lifecycle: ActiveSprint["lifecycle"] | undefined): string {
  switch (lifecycle) {
    case "running":
      return "No execution step is active between runtime cycles.";
    case "waiting_approval":
      // CEO decision 2026-07-12: "approval" is allowed here — this describes an operational
      // fact sourced from ActiveSprint.lifecycle, not from ceoInbox, and it doesn't ask the CEO
      // for anything. Needs You (Cockpit Opening) remains the only zone that escalates.
      return "No work is running; this initiative is waiting for approval.";
    case "blocked":
      return "Execution is paused because this initiative is blocked.";
    default:
      return "Atlas has no active execution plan right now.";
  }
}

/** CEO decision 2026-07-12 — Command Panel's new, single role: "the operational rail that shows
 * what Atlas is actually doing right now, and what comes next." Deliberately reads only
 * `snapshot.livePlan` (plus, as of this round, the same `ActiveSprint.lifecycle` "Current
 * initiative" already shows — still not `atlasAdvice`, `companyState` health, or `ceoInbox`).
 * Those belong exclusively to the Cockpit Opening's Briefing / Company Health / Needs You;
 * repeating them here would be exactly the duplication CEO_COCKPIT.md's "the Cockpit tells, Deep
 * Dive explains" principle warns against — two panels independently narrating the same signal
 * risk drifting out of sync with each other (see the overallStatusLabel inconsistency this same
 * screen had before Cockpit Opening v1). One composed line, not a mini replica of
 * LivePlanSectionV2's full step list further down the page — that section remains the place for
 * the full, detailed plan. */
function describeCurrentPlanWork(plan: LivePlanSummary | null, activeSprint: ActiveSprint | undefined): PlanWorkSummary {
  if (!plan) {
    return { line: describeEmptyPlanStatus(activeSprint?.lifecycle), progress: null };
  }

  const completedCount = plan.steps.filter(
    (step) => step.status === "completed" || step.status === "skipped",
  ).length;
  const progress = plan.steps.length > 0 ? `${completedCount}/${plan.steps.length} steps` : null;

  if (plan.status === "completed") {
    return { line: `Atlas finished ${plan.goal}.`, progress };
  }
  if (plan.status === "failed") {
    return { line: `Atlas hit an issue while working on ${plan.goal}.`, progress };
  }
  if (plan.status === "cancelled") {
    return { line: "Atlas has no active execution plan right now.", progress: null };
  }

  const currentStep =
    plan.steps.find((step) => step.status === "running") ??
    plan.steps.find((step) => step.status === "pending");

  if (currentStep) {
    return { line: `Working on ${plan.goal} — ${currentStep.label}.`, progress };
  }
  return { line: `Working on ${plan.goal}.`, progress };
}

/** CEO decision 2026-07-12 — "Current initiative" now shows the real lifecycle alongside the
 * name and progress (e.g. "TIPS-001 · Waiting approval · 75%"), using the existing
 * `ActiveSprint.statusLabel` — no new field, no inferred status. Only applies when a real
 * `activeSprint` exists; the roadmap-only fallback (`nowInitiative`) has no equivalent lifecycle
 * data today (`RoadmapInitiative` has no status field), so it stays title-only rather than
 * inventing one. */
function describeCurrentInitiative(
  activeSprint: ActiveSprint | undefined,
  nowInitiativeTitle: string | undefined,
): string {
  if (activeSprint) {
    return `${activeSprint.name} · ${activeSprint.statusLabel} · ${activeSprint.progress}%`;
  }
  return nowInitiativeTitle ?? "No active sprint";
}

export default function CommandPanel({ snapshot }: CommandPanelProps) {
  const activeSprint = snapshot.sprints.find((sprint) => sprint.progress < 100);
  const nowInitiative = snapshot.roadmap.find((item) => item.lane === "now" && item.progress < 100);
  const currentInitiativeLine = describeCurrentInitiative(activeSprint, nowInitiative?.title);
  const planWork = describeCurrentPlanWork(snapshot.livePlan, activeSprint);

  return (
    <View style={styles.shell}>
      <GlassCard title="Command Panel" subtitle="Operational rail" badge="Live" noPadding>
        <View style={styles.body}>
          <View style={styles.block}>
            <Text style={styles.label}>Current initiative</Text>
            <Text style={styles.value} numberOfLines={1}>
              {currentInitiativeLine}
            </Text>
          </View>

          <View style={[styles.block, styles.blockLast]}>
            <Text style={styles.label}>What Atlas is doing now</Text>
            <Text style={styles.value} numberOfLines={2}>
              {planWork.line}
            </Text>
            {planWork.progress ? <Text style={styles.hint}>{planWork.progress}</Text> : null}
          </View>

          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live from Company State</Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
  },

  body: {
    padding: 18,
  },

  block: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: V2.border,
  },

  blockLast: {
    marginBottom: 12,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.textDim,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  value: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: V2.text,
    lineHeight: 20,
  },

  hint: {
    marginTop: 4,
    fontSize: 11,
    color: V2.textMuted,
  },

  live: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: V2.success,
  },

  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.success,
  },
});
