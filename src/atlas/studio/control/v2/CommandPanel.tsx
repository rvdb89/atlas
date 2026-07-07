import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import V2Button from "./V2Button";
import { healthTone, V2 } from "./v2Theme";

type CommandPanelProps = {
  snapshot: ControlSnapshot;
  onPrimary: () => void;
  onSecondary: () => void;
  onApproveTop?: () => void;
};

export default function CommandPanel({
  snapshot,
  onPrimary,
  onSecondary,
  onApproveTop,
}: CommandPanelProps) {
  const state = snapshot.companyState;
  const advice = snapshot.atlasAdvice;
  const cmd = snapshot.ceoCommand;
  const activeSprint = snapshot.sprints.find((sprint) => sprint.progress < 100);
  const nowInitiative = snapshot.roadmap.find((item) => item.lane === "now" && item.progress < 100);
  const platformKpi = snapshot.kpis.find((kpi) => kpi.id === "platform-health");
  const topPending = snapshot.ceoInbox.find((item) => item.status === "pending");

  return (
    <View style={styles.shell}>
      <GlassCard title="Command Panel" subtitle="CEO focus rail" badge="Live" noPadding>
        <View style={styles.body}>
          <View style={styles.block}>
            <Text style={styles.label}>Today&apos;s focus</Text>
            <Text style={styles.value}>{advice.headline}</Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.label}>Current initiative</Text>
            <Text style={styles.value}>
              {activeSprint?.name ?? nowInitiative?.title ?? "No active sprint"}
            </Text>
            {activeSprint ? (
              <Text style={styles.hint}>{activeSprint.progress}% complete</Text>
            ) : null}
          </View>

          <View style={styles.block}>
            <Text style={styles.label}>Next recommendation</Text>
            <Text style={styles.valueAccent}>{advice.recommendation}</Text>
            <Text style={styles.hint}>{advice.confidence}% Atlas confidence</Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.label}>Platform health</Text>
            <View style={styles.platformRow}>
              <Text style={styles.platformValue}>{platformKpi?.value ?? state.companyHealth}</Text>
              <StatusPill label={state.overallStatusLabel} tone={healthTone(state.companyHealth)} />
            </View>
            <Text style={styles.hint}>North Star alignment {state.northStarAlignment}%</Text>
          </View>

          <View style={styles.quick}>
            <Text style={styles.label}>Quick actions</Text>
            <V2Button label={cmd.primaryActionLabel} onPress={onPrimary} compact />
            <V2Button label={cmd.secondaryActionLabel} onPress={onSecondary} variant="secondary" compact />
            {topPending && onApproveTop ? (
              <V2Button
                label={`Approve · ${topPending.title.slice(0, 24)}…`}
                onPress={onApproveTop}
                variant="success"
                compact
              />
            ) : null}
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

  valueAccent: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "800",
    color: V2.accent,
    lineHeight: 20,
  },

  hint: {
    marginTop: 4,
    fontSize: 11,
    color: V2.textMuted,
  },

  platformRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  platformValue: {
    fontSize: 28,
    fontWeight: "900",
    color: V2.text,
  },

  quick: {
    gap: 8,
    marginBottom: 12,
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
