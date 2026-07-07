import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot } from "../types";
import { ACTIVITY_TYPE_LABELS } from "../types";
import GlassCard from "./GlassCard";
import { V2 } from "./v2Theme";

type ActivityFeedV2Props = {
  snapshot: ControlSnapshot;
};

export default function ActivityFeedV2({ snapshot }: ActivityFeedV2Props) {
  return (
    <GlassCard title="Activity Feed" subtitle="Recent Atlas activity" badge="Live">
      {snapshot.activity.slice(0, 8).map((event, index) => (
        <View key={event.id} style={[styles.row, index === 0 && styles.rowFirst]}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
            {index < Math.min(snapshot.activity.length, 8) - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={styles.content}>
            <Text style={styles.type}>{ACTIVITY_TYPE_LABELS[event.type]}</Text>
            <Text style={styles.message}>{event.message}</Text>
            <Text style={styles.time}>{event.occurredAt}</Text>
          </View>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
  },

  rowFirst: {
    paddingTop: 0,
  },

  timeline: {
    width: 12,
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: V2.accent,
    marginTop: 4,
  },

  line: {
    flex: 1,
    width: 1,
    backgroundColor: V2.border,
    marginTop: 4,
  },

  content: {
    flex: 1,
  },

  type: {
    fontSize: 10,
    fontWeight: "800",
    color: V2.purple,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  message: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: V2.text,
    lineHeight: 19,
  },

  time: {
    marginTop: 3,
    fontSize: 11,
    color: V2.textDim,
  },
});
