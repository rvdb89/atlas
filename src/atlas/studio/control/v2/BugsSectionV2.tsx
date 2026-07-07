import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import GlassCard from "./GlassCard";
import StatusPill from "./StatusPill";
import { V2 } from "./v2Theme";

type BugsSectionV2Props = {
  snapshot: ControlSnapshot;
};

export default function BugsSectionV2({ snapshot }: BugsSectionV2Props) {
  const open = snapshot.issues.filter((issue) => issue.status !== "resolved").slice(0, 5);

  return (
    <GlassCard
      title="Bugs & Blockers"
      subtitle="Open issues requiring attention"
      badge={`${snapshot.companyState.counts.bugs} open`}
    >
      {open.length === 0 ? (
        <Text style={styles.empty}>No open bugs — clear runway.</Text>
      ) : (
        open.map((issue) => (
          <View key={issue.id} style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.title} numberOfLines={1}>
                {issue.title}
              </Text>
              <StatusPill
                label={issue.severity}
                tone={
                  issue.severity === "critical" || issue.severity === "high"
                    ? "danger"
                    : issue.severity === "medium"
                      ? "warning"
                      : "neutral"
                }
              />
            </View>
            <Text style={styles.impact}>{issue.impact}</Text>
            <Text style={styles.rec}>{issue.recommendation}</Text>
          </View>
        ))
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: 14,
    color: V2.textMuted,
  },

  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: V2.border,
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: V2.text,
  },

  impact: {
    marginTop: 6,
    fontSize: 12,
    color: V2.textMuted,
  },

  rec: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: V2.accent,
  },
});
