import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot, ManagementStatus } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import { V2 } from "./v2Theme";

const STATUS_TONE: Record<ManagementStatus, "success" | "neutral" | "danger" | "warning"> = {
  active: "success",
  idle: "neutral",
  blocked: "danger",
  waiting: "warning",
};

type ManagementTeamV2Props = {
  snapshot: ControlSnapshot;
};

export default function ManagementTeamV2({ snapshot }: ManagementTeamV2Props) {
  const executives = snapshot.management;

  return (
    <GlassCard title="Management Team" subtitle="AI executives running the company" badge="Live">
      <View style={styles.grid}>
        {executives.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.name} numberOfLines={1}>
                {member.name} · {member.title}
              </Text>
              <StatusPill label={member.status} tone={STATUS_TONE[member.status]} />
            </View>
            <Text style={styles.workLabel}>Current work</Text>
            <Text style={styles.work} numberOfLines={2}>
              {member.currentResponsibility}
            </Text>
            <View style={styles.healthRow}>
              <Text style={styles.healthLabel}>Health</Text>
              <Text
                style={[
                  styles.healthValue,
                  {
                    color:
                      member.healthScore >= 80
                        ? V2.success
                        : member.healthScore >= 60
                          ? V2.warning
                          : V2.accent,
                  },
                ]}
              >
                {member.healthScore}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  card: {
    width: "31%",
    minWidth: 168,
    flexGrow: 1,
    padding: 14,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 10,
  },

  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: V2.text,
  },

  workLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: V2.textDim,
    textTransform: "uppercase",
  },

  work: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: V2.textMuted,
    minHeight: 34,
  },

  healthRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: V2.border,
  },

  healthLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: V2.textDim,
    textTransform: "uppercase",
  },

  healthValue: {
    fontSize: 14,
    fontWeight: "900",
  },
});
