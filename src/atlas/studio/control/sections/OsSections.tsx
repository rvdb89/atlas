import { StyleSheet, Text, View } from "react-native";

import ControlButton from "../ControlButton";
import ControlCard, { ControlKpi } from "../ControlCard";
import ControlStateBadge from "../ControlStateBadge";
import { CONTROL_COLORS } from "../theme";
import type {
  ControlSnapshot,
  InitiativeLane,
  ManagementStatus,
} from "../types";
import {
  ACTIVITY_TYPE_LABELS,
  DEPARTMENT_LABELS,
  INITIATIVE_LANE_LABELS,
} from "../types";

type SnapshotProps = { snapshot: ControlSnapshot };

type CommandProps = SnapshotProps & {
  onPrimary: () => void;
  onSecondary: () => void;
};

const MANAGEMENT_STATUS: Record<ManagementStatus, { label: string; color: string }> = {
  active: { label: "Active", color: CONTROL_COLORS.success },
  idle: { label: "Idle", color: CONTROL_COLORS.textMuted },
  blocked: { label: "Blocked", color: CONTROL_COLORS.danger },
  waiting: { label: "Waiting", color: CONTROL_COLORS.warning },
};

const LANES: InitiativeLane[] = ["now", "next", "later", "blocked"];

function formatStateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** 1. CEO Command — Company Health */
export function CeoCommandSection({ snapshot, onPrimary, onSecondary }: CommandProps) {
  const cmd = snapshot.ceoCommand;
  const state = snapshot.companyState;

  return (
    <View style={styles.commandShell}>
      <ControlStateBadge
        detail={`${state.source} · updated ${formatStateTime(state.generatedAt)}`}
      />

      <Text style={styles.greeting}>{cmd.greeting}</Text>
      <Text style={styles.companyTitle}>{snapshot.companyName}</Text>

      <View style={styles.healthRow}>
        <View style={styles.healthCopy}>
          <Text style={styles.healthLabel}>Company Health</Text>
          <Text style={styles.stateSource}>state.companyHealth</Text>
        </View>
        <Text style={styles.healthScore}>{state.companyHealth}%</Text>
      </View>

      <Text style={styles.stateMeta}>
        {state.overallStatusLabel} · North Star {state.northStarAlignment}% · Engine{" "}
        {formatStateTime(state.generatedAt)}
      </Text>

      <View style={styles.commandBlock}>
        <Text style={styles.blockLabel}>Today's Advice</Text>
        <Text style={styles.adviceText}>{cmd.todayAdvice}</Text>
      </View>

      <View style={styles.commandBlock}>
        <Text style={styles.blockLabel}>Recommendation</Text>
        <Text style={styles.recommendationText}>{cmd.recommendation}</Text>
      </View>

      <View style={styles.commandBlock}>
        <Text style={styles.blockLabel}>Reason</Text>
        <Text style={styles.reasonText}>{cmd.reason}</Text>
      </View>

      {cmd.confirmationMessage ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>{cmd.confirmationMessage}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <ControlButton label={cmd.primaryActionLabel} onPress={onPrimary} />
        <ControlButton label={cmd.secondaryActionLabel} variant="secondary" onPress={onSecondary} />
      </View>
    </View>
  );
}

/** 2. CEO Inbox — see sections/CeoInboxSection.tsx */

/** 3. Company Overview — Businesses */
export function CompanyOverviewSection({ snapshot }: SnapshotProps) {
  const state = snapshot.companyState;

  return (
    <ControlCard
      title="Businesses"
      subtitle="The digital company — every business under Robbert AI."
      liveFromState
      stateDetail={`state.businesses · ${state.counts.businesses} businesses`}
    >
      {snapshot.businesses.map((business) => (
        <View key={business.id} style={styles.businessCard}>
          <View style={styles.businessHeader}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.businessStatus}>{business.statusLabel}</Text>
          </View>
          <Text style={styles.businessLine}>Current Sprint · {business.currentSprint}</Text>
          <Text style={styles.businessLine}>Open Bugs · {business.openBugs}</Text>
          <Text style={styles.businessLine}>Roadmap Progress · {business.roadmapProgress}%</Text>
          <Text style={styles.businessLine}>Marketing · {business.marketingStatus}</Text>
          <Text style={styles.businessProducts}>
            Products ·{" "}
            {business.productIds
              .map((id) => snapshot.products.find((product) => product.id === id)?.name ?? id)
              .join(", ")}
          </Text>
        </View>
      ))}
    </ControlCard>
  );
}

/** 4. Management Team */
export function ManagementTeamSection({ snapshot }: SnapshotProps) {
  const state = snapshot.companyState;

  return (
    <ControlCard
      title="Management Team"
      subtitle="Your AI executives — status, responsibility, initiative, health, workload."
      liveFromState
      stateDetail={`state.agents · ${state.counts.agents} executives`}
    >
      {snapshot.management.map((member) => {
        const status = MANAGEMENT_STATUS[member.status];
        return (
          <View key={member.id} style={styles.managementRow}>
            <View style={styles.managementCopy}>
              <Text style={styles.managementTitle}>{member.title}</Text>
              {/* Sprint 2.2a · member.department is null for the Branch Director — Atlas' own
                  reasoning identity, not a department member. */}
              <Text style={styles.managementDept}>
                {member.department ? DEPARTMENT_LABELS[member.department] : "Atlas Core"}
              </Text>
              <Text style={styles.managementResp}>{member.currentResponsibility}</Text>
              <Text style={styles.managementInit}>Initiative · {member.currentInitiative}</Text>
            </View>
            <View style={styles.managementSide}>
              <Text style={[styles.managementStatus, { color: status.color }]}>{status.label}</Text>
              <Text style={styles.managementHealth}>{member.healthScore}%</Text>
              <Text style={styles.managementWorkload}>{member.workload}</Text>
            </View>
          </View>
        );
      })}
    </ControlCard>
  );
}

/** 5. Company KPIs */
export function CompanyKpisSection({ snapshot }: SnapshotProps) {
  const state = snapshot.companyState;

  return (
    <ControlCard
      title="Company KPIs"
      subtitle="Metrics Robbert cares about — value, trend, status."
      liveFromState
      stateDetail={`state.kpis · ${state.counts.kpis} calculated metrics`}
    >
      <View style={styles.kpiGrid}>
        {snapshot.kpis.map((kpi) => (
          <ControlKpi
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            status={kpi.status}
          />
        ))}
      </View>
    </ControlCard>
  );
}

/** 6. Roadmap */
export function RoadmapSection({ snapshot }: SnapshotProps) {
  const activeSprint = snapshot.sprints.find((sprint) => sprint.progress < 100);
  const state = snapshot.companyState;

  return (
    <ControlCard
      title="Roadmap"
      subtitle={
        activeSprint
          ? `Running sprint · ${activeSprint.name} (${activeSprint.progress}%)`
          : "Initiative lanes across the company."
      }
      status="active"
      statusLabel={activeSprint?.statusLabel ?? "Planning"}
      liveFromState
      stateDetail={`state.roadmap · ${state.counts.roadmap} initiatives`}
    >
      <View style={styles.laneGrid}>
        {LANES.map((lane) => {
          const items = snapshot.roadmap.filter((item) => item.lane === lane);
          return (
            <View key={lane} style={styles.laneColumn}>
              <Text style={styles.laneTitle}>{INITIATIVE_LANE_LABELS[lane]}</Text>
              {items.length === 0 ? (
                <Text style={styles.laneEmpty}>—</Text>
              ) : (
                items.map((item) => (
                  <View key={item.id} style={styles.laneCard}>
                    <Text style={styles.laneId}>
                      P{item.priority} · {item.id}
                    </Text>
                    <Text style={styles.laneItemTitle}>{item.title}</Text>
                    <Text style={styles.laneMeta}>Owner · {item.owner}</Text>
                    <Text style={styles.laneMeta}>Value · {item.businessValue}</Text>
                    <Text style={styles.laneMeta}>North Star · {item.northStarContribution}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                    </View>
                  </View>
                ))
              )}
            </View>
          );
        })}
      </View>
    </ControlCard>
  );
}

/** 7. Company Operations */
export function CompanyOperationsSection({ snapshot }: SnapshotProps) {
  return (
    <ControlCard title="Company Operations" subtitle="What every department is doing right now.">
      {snapshot.operations.map((op) => (
        <View key={op.department} style={styles.operationRow}>
          <View style={styles.operationCopy}>
            <Text style={styles.operationDept}>{op.label}</Text>
            <Text style={styles.operationFocus}>{op.currentFocus}</Text>
          </View>
          <Text style={styles.operationStatus}>{op.statusLabel}</Text>
        </View>
      ))}
    </ControlCard>
  );
}

/** 8. Bugs & Blockers */
export function BugsBlockersSection({ snapshot }: SnapshotProps) {
  const state = snapshot.companyState;
  const bySeverity = state.bugsBySeverity;
  const openCount = state.counts.bugs;

  return (
    <ControlCard
      title="Bugs & Blockers"
      subtitle="Important problems only — impact, owner, recommendation, expected fix."
      status={bySeverity.critical > 0 ? "critical" : openCount > 0 ? "attention" : "healthy"}
      statusLabel={openCount > 0 ? `${openCount} open` : "Clear"}
      liveFromState
      stateDetail={`state.bugs · ${openCount} open · ${state.counts.blockers} blockers`}
    >
      <View style={styles.severityRow}>
        {(["critical", "high", "medium", "low"] as const).map((level) => (
          <View key={level} style={styles.severityChip}>
            <Text style={styles.severityLabel}>{level}</Text>
            <Text style={styles.severityValue}>{bySeverity[level]}</Text>
          </View>
        ))}
      </View>

      {openCount === 0 ? (
        <Text style={styles.empty}>No open issues.</Text>
      ) : (
        snapshot.issues
          .filter((issue) => issue.status !== "resolved")
          .map((issue) => (
          <View key={issue.id} style={styles.issueRow}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.issueMeta}>
              {issue.severity.toUpperCase()} · {issue.owner}
            </Text>
            <Text style={styles.issueLine}>Impact · {issue.impact}</Text>
            <Text style={styles.issueLine}>Recommendation · {issue.recommendation}</Text>
            <Text style={styles.issueLine}>Expected fix · {issue.expectedFix}</Text>
          </View>
        ))
      )}
    </ControlCard>
  );
}

/** 9. Activity */
export function ActivitySection({ snapshot }: SnapshotProps) {
  const state = snapshot.companyState;

  return (
    <ControlCard
      title="Activity"
      subtitle="Company timeline — sprints, approvals, releases, memory, deployments."
      liveFromState
      stateDetail={`state.activity · ${state.counts.activity} events`}
    >
      {snapshot.activity.map((event) => (
        <View key={event.id} style={styles.activityRow}>
          <Text style={styles.activityType}>{ACTIVITY_TYPE_LABELS[event.type]}</Text>
          <Text style={styles.activityMessage}>{event.message}</Text>
          <Text style={styles.activityTime}>{event.occurredAt}</Text>
        </View>
      ))}
    </ControlCard>
  );
}

/** 10. Atlas Advice */
export function AtlasAdviceSection({ snapshot }: SnapshotProps) {
  const advice = snapshot.atlasAdvice;

  return (
    <View style={styles.adviceShell}>
      <Text style={styles.adviceEyebrow}>Atlas Advice</Text>
      <Text style={styles.adviceHeadline}>
        If I were CEO, this is what I would do next.
      </Text>
      <Text style={styles.adviceRecommendation}>{advice.recommendation}</Text>
      <Text style={styles.adviceRationale}>{advice.rationale}</Text>
      <Text style={styles.adviceConfidence}>
        Atlas confidence · {advice.confidence}%
        {advice.relatedInitiative ? ` · ${advice.relatedInitiative}` : ""}
      </Text>
      {advice.decision === "approved" ? (
        <Text style={styles.adviceApproved}>Recommendation approved — Atlas is executing.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  commandShell: {
    backgroundColor: CONTROL_COLORS.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.border,
    marginBottom: 14,
  },

  greeting: {
    fontSize: 15,
    fontWeight: "700",
    color: CONTROL_COLORS.gold,
  },

  companyTitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: CONTROL_COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  healthRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },

  healthCopy: {
    flex: 1,
  },

  healthLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: CONTROL_COLORS.textMuted,
  },

  stateSource: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "700",
    color: CONTROL_COLORS.success,
    fontFamily: "monospace",
  },

  stateMeta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: CONTROL_COLORS.textSoft,
  },

  healthScore: {
    fontSize: 36,
    fontWeight: "900",
    color: CONTROL_COLORS.accentSoft,
  },

  commandBlock: {
    marginTop: 14,
  },

  blockLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  adviceText: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
    color: CONTROL_COLORS.text,
  },

  recommendationText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
  },

  reasonText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: CONTROL_COLORS.textMuted,
  },

  confirmBox: {
    marginTop: 14,
    backgroundColor: `${CONTROL_COLORS.success}18`,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: `${CONTROL_COLORS.success}44`,
  },

  confirmText: {
    fontSize: 14,
    fontWeight: "800",
    color: CONTROL_COLORS.success,
  },

  actions: {
    marginTop: 16,
    gap: 10,
  },

  inboxCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  inboxTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: CONTROL_COLORS.text,
  },

  inboxMeta: {
    marginTop: 4,
    fontSize: 11,
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  inboxReason: {
    marginTop: 8,
    fontSize: 13,
    color: CONTROL_COLORS.textMuted,
  },

  inboxRecommendation: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: CONTROL_COLORS.text,
    fontWeight: "600",
  },

  inboxActions: {
    marginTop: 12,
    gap: 8,
  },

  inboxResolved: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
    color: CONTROL_COLORS.success,
  },

  inboxChange: {
    marginTop: 6,
    fontSize: 13,
    color: CONTROL_COLORS.warning,
  },

  optionList: {
    marginTop: 8,
    gap: 6,
  },

  businessCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  businessName: {
    fontSize: 16,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
  },

  businessStatus: {
    fontSize: 12,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
  },

  businessLine: {
    marginTop: 6,
    fontSize: 13,
    color: CONTROL_COLORS.textMuted,
  },

  businessProducts: {
    marginTop: 6,
    fontSize: 12,
    color: CONTROL_COLORS.textSoft,
  },

  managementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  managementCopy: { flex: 1 },

  managementTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
  },

  managementDept: {
    marginTop: 2,
    fontSize: 11,
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  managementResp: {
    marginTop: 6,
    fontSize: 13,
    color: CONTROL_COLORS.textMuted,
  },

  managementInit: {
    marginTop: 4,
    fontSize: 12,
    color: CONTROL_COLORS.textSoft,
  },

  managementSide: { alignItems: "flex-end" },

  managementStatus: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  managementHealth: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
  },

  managementWorkload: {
    marginTop: 2,
    fontSize: 11,
    color: CONTROL_COLORS.textSoft,
    textTransform: "capitalize",
  },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  laneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  laneColumn: {
    flex: 1,
    minWidth: 140,
    backgroundColor: CONTROL_COLORS.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.borderSoft,
  },

  laneTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  laneEmpty: {
    fontSize: 13,
    color: CONTROL_COLORS.textSoft,
  },

  laneCard: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  laneId: {
    fontSize: 10,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
  },

  laneItemTitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: CONTROL_COLORS.text,
  },

  laneMeta: {
    marginTop: 3,
    fontSize: 11,
    color: CONTROL_COLORS.textMuted,
  },

  progressTrack: {
    marginTop: 6,
    height: 4,
    borderRadius: 999,
    backgroundColor: CONTROL_COLORS.borderSoft,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: CONTROL_COLORS.accent,
  },

  operationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  operationCopy: { flex: 1 },

  operationDept: {
    fontSize: 14,
    fontWeight: "800",
    color: CONTROL_COLORS.text,
  },

  operationFocus: {
    marginTop: 4,
    fontSize: 13,
    color: CONTROL_COLORS.textMuted,
  },

  operationStatus: {
    fontSize: 12,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
  },

  severityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  severityChip: {
    flex: 1,
    backgroundColor: CONTROL_COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.borderSoft,
    alignItems: "center",
  },

  severityLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  severityValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
  },

  issueRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: CONTROL_COLORS.borderSoft,
  },

  issueTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: CONTROL_COLORS.text,
  },

  issueMeta: {
    marginTop: 4,
    fontSize: 11,
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
  },

  issueLine: {
    marginTop: 4,
    fontSize: 13,
    color: CONTROL_COLORS.textMuted,
  },

  activityRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  activityType: {
    fontSize: 10,
    fontWeight: "800",
    color: CONTROL_COLORS.gold,
    textTransform: "uppercase",
  },

  activityMessage: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: CONTROL_COLORS.text,
  },

  activityTime: {
    marginTop: 2,
    fontSize: 12,
    color: CONTROL_COLORS.textSoft,
  },

  adviceShell: {
    backgroundColor: CONTROL_COLORS.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.border,
    marginBottom: 14,
    marginTop: 4,
  },

  adviceEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.gold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  adviceHeadline: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 26,
    color: CONTROL_COLORS.text,
  },

  adviceRecommendation: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "900",
    color: CONTROL_COLORS.accentSoft,
  },

  adviceRationale: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: CONTROL_COLORS.textMuted,
  },

  adviceConfidence: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: CONTROL_COLORS.textSoft,
  },

  adviceApproved: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "800",
    color: CONTROL_COLORS.success,
  },

  empty: {
    fontSize: 14,
    color: CONTROL_COLORS.textMuted,
  },
});
