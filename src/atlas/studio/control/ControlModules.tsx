import { StyleSheet, Text, View } from "react-native";

import ControlCard, { ControlMetric, ControlRow } from "./ControlCard";
import { CONTROL_COLORS } from "./theme";
import type { ControlSnapshot } from "./types";

type ControlModulesProps = {
  snapshot: ControlSnapshot;
};

export function ExecutiveOverviewSection({ snapshot }: ControlModulesProps) {
  const { overview } = snapshot;

  return (
    <ControlCard
      title="Executive Overview"
      subtitle="What is running, what needs you, and where Atlas is headed next."
      status={overview.platformStatus}
      statusLabel={overview.platformStatusLabel}
    >
      <View style={styles.metricGrid}>
        <ControlMetric label="Company health" value={`${overview.companyHealthScore}`} hint={overview.companyHealthLabel} />
        <ControlMetric label="Active agents" value={String(overview.activeAgents)} />
        <ControlMetric label="Businesses / apps" value={String(overview.activeBusinesses)} />
        <ControlMetric label="Pending approvals" value={String(overview.pendingApprovals)} />
        <ControlMetric label="Open blockers" value={String(overview.openBlockers)} />
        <ControlMetric label="Active initiatives" value={String(overview.activeInitiatives)} />
      </View>

      <View style={styles.actionBox}>
        <Text style={styles.actionLabel}>Recommended next action</Text>
        <Text style={styles.actionText}>{overview.recommendedNextAction}</Text>
      </View>
    </ControlCard>
  );
}

export function AgentsSection({ snapshot }: ControlModulesProps) {
  return (
    <ControlCard title="Agents" subtitle="Active AI workers and their current focus.">
      {snapshot.agents.map((agent) => (
        <ControlRow
          key={agent.id}
          label={agent.name}
          value={`${agent.role} · ${agent.currentFocus}`}
          status={agent.status}
        />
      ))}
    </ControlCard>
  );
}

export function PlatformHealthSection({ snapshot }: ControlModulesProps) {
  const health = snapshot.platformHealth;

  return (
    <ControlCard
      title="Platform Health"
      subtitle={health.detail}
      status={health.overall}
      statusLabel={health.overallLabel}
    >
      <ControlRow label="Atlas Core" value="Operating normally" status={health.atlasCore} />
      <ControlRow label="Studio" value="Available for daily command" status={health.studio} />
      <ControlRow label="Intelligence" value="Follow-up notes only" status={health.intelligence} />
      <ControlRow label="Workflows" value="CEO and mission flows active" status={health.workflows} />
    </ControlCard>
  );
}

export function BusinessesSection({ snapshot }: ControlModulesProps) {
  return (
    <ControlCard title="Businesses / Apps" subtitle="Portfolio view — platform first, apps as operating units.">
      {snapshot.businesses.map((business) => (
        <ControlRow
          key={business.id}
          label={business.name}
          value={`${business.type} · ${business.summary}`}
          status={business.status}
        />
      ))}
    </ControlCard>
  );
}

export function BugsBlockersSection({ snapshot }: ControlModulesProps) {
  return (
    <ControlCard
      title="Bugs & Blockers"
      subtitle="Issues that need attention before the next strategic move."
      status={snapshot.blockers.length > 0 ? "attention" : "healthy"}
      statusLabel={snapshot.blockers.length > 0 ? `${snapshot.blockers.length} open` : "Clear"}
    >
      {snapshot.blockers.length === 0 ? (
        <Text style={styles.empty}>No open blockers.</Text>
      ) : (
        snapshot.blockers.map((blocker) => (
          <View key={blocker.id} style={styles.blockerRow}>
            <Text style={styles.blockerTitle}>{blocker.title}</Text>
            <Text style={styles.blockerMeta}>
              {blocker.area} · {blocker.owner} · {blocker.severity.toUpperCase()}
            </Text>
          </View>
        ))
      )}
    </ControlCard>
  );
}

export function ApprovalsSection({ snapshot }: ControlModulesProps) {
  return (
    <ControlCard
      title="Sprint / Initiative Approvals"
      subtitle="Decisions waiting for CEO approval."
      status={snapshot.approvals.length > 0 ? "pending" : "healthy"}
      statusLabel={snapshot.approvals.length > 0 ? `${snapshot.approvals.length} pending` : "None pending"}
    >
      {snapshot.approvals.length === 0 ? (
        <Text style={styles.empty}>No approvals waiting.</Text>
      ) : (
        snapshot.approvals.map((approval) => (
          <ControlRow
            key={approval.id}
            label={approval.title}
            value={`${approval.type} · requested by ${approval.requestedBy} · ${approval.urgency} urgency`}
            status="pending"
          />
        ))
      )}

      <Text style={styles.sectionHint}>Current initiatives</Text>
      {snapshot.initiatives.map((initiative) => (
        <View key={initiative.id} style={styles.initiativeRow}>
          <View style={styles.initiativeCopy}>
            <Text style={styles.initiativeTitle}>{initiative.id} · {initiative.title}</Text>
            <Text style={styles.initiativeMeta}>{initiative.phase} · {initiative.progress}%</Text>
          </View>
          <View style={[styles.progressTrack]}>
            <View style={[styles.progressFill, { width: `${initiative.progress}%` }]} />
          </View>
        </View>
      ))}
    </ControlCard>
  );
}

export function BranchDirectorAdviceSection({ snapshot }: ControlModulesProps) {
  const advice = snapshot.branchDirectorAdvice;

  return (
    <ControlCard
      title="Branch Director Advice"
      subtitle={advice.summary}
      status="active"
      statusLabel={`${advice.confidence}% confidence`}
    >
      <Text style={styles.adviceHeadline}>{advice.headline}</Text>
      <Text style={styles.adviceInitiative}>{advice.recommendedInitiative}</Text>
      {advice.rationale.map((line) => (
        <Text key={line} style={styles.adviceLine}>
          · {line}
        </Text>
      ))}
    </ControlCard>
  );
}

const styles = StyleSheet.create({
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  actionBox: {
    backgroundColor: CONTROL_COLORS.surfaceElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: CONTROL_COLORS.borderSoft,
  },

  actionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.gold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  actionText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: CONTROL_COLORS.text,
    fontWeight: "600",
  },

  empty: {
    fontSize: 14,
    color: CONTROL_COLORS.textMuted,
  },

  blockerRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: CONTROL_COLORS.borderSoft,
  },

  blockerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: CONTROL_COLORS.text,
  },

  blockerMeta: {
    marginTop: 4,
    fontSize: 12,
    color: CONTROL_COLORS.textMuted,
  },

  sectionHint: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "800",
    color: CONTROL_COLORS.textSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  initiativeRow: {
    marginBottom: 12,
  },

  initiativeCopy: {
    marginBottom: 8,
  },

  initiativeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: CONTROL_COLORS.text,
  },

  initiativeMeta: {
    marginTop: 2,
    fontSize: 12,
    color: CONTROL_COLORS.textMuted,
  },

  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: CONTROL_COLORS.borderSoft,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: CONTROL_COLORS.accent,
  },

  adviceHeadline: {
    fontSize: 20,
    fontWeight: "900",
    color: CONTROL_COLORS.text,
    marginBottom: 8,
  },

  adviceInitiative: {
    fontSize: 15,
    fontWeight: "800",
    color: CONTROL_COLORS.accentSoft,
    marginBottom: 10,
  },

  adviceLine: {
    fontSize: 14,
    lineHeight: 21,
    color: CONTROL_COLORS.textMuted,
    marginBottom: 4,
  },
});
