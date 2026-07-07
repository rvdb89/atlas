import { StyleSheet, Text, View } from "react-native";

import type { ControlSnapshot, InitiativeLane } from "../types";
import { INITIATIVE_LANE_LABELS } from "../types";
import GlassCard from "./GlassCard";
import { V2 } from "./v2Theme";

const LANES: InitiativeLane[] = ["now", "next", "later", "blocked"];

const LANE_ACCENT: Record<InitiativeLane, string> = {
  now: V2.accent,
  next: V2.purple,
  later: V2.textDim,
  blocked: V2.danger,
};

type RoadmapV2Props = {
  snapshot: ControlSnapshot;
};

export default function RoadmapV2({ snapshot }: RoadmapV2Props) {
  return (
    <GlassCard title="Roadmap / Initiatives" subtitle="Now · Next · Later · Blocked" badge="Live">
      <View style={styles.lanes}>
        {LANES.map((lane) => {
          const items = snapshot.roadmap.filter((item) => item.lane === lane);
          return (
            <View key={lane} style={styles.lane}>
              <View style={[styles.laneHeader, { borderLeftColor: LANE_ACCENT[lane] }]}>
                <Text style={styles.laneTitle}>{INITIATIVE_LANE_LABELS[lane]}</Text>
                <Text style={styles.laneCount}>{items.length}</Text>
              </View>
              {items.length === 0 ? (
                <Text style={styles.empty}>—</Text>
              ) : (
                items.map((item) => (
                  <View key={item.id} style={styles.item}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemOwner}>{item.owner}</Text>
                      <Text style={styles.itemProgress}>{item.progress}%</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  lanes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  lane: {
    flex: 1,
    minWidth: 150,
    padding: 12,
    borderRadius: V2.radiusSm,
    backgroundColor: V2.bgElevated,
    borderWidth: 1,
    borderColor: V2.border,
  },

  laneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
  },

  laneTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: V2.text,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  laneCount: {
    fontSize: 11,
    fontWeight: "700",
    color: V2.textDim,
  },

  empty: {
    fontSize: 13,
    color: V2.textDim,
    paddingLeft: 10,
  },

  item: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: V2.bgGlass,
    borderWidth: 1,
    borderColor: V2.border,
  },

  itemTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: V2.text,
    lineHeight: 17,
  },

  itemMeta: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemOwner: {
    fontSize: 10,
    color: V2.textDim,
  },

  itemProgress: {
    fontSize: 10,
    fontWeight: "700",
    color: V2.accent,
  },
});
