import { StyleSheet, View } from "react-native";

import ArchwayRecess from "./objects/ArchwayRecess";
import DepartmentWall from "./objects/DepartmentWall";
import Heart from "./objects/Heart";
import SmallHollow from "./objects/SmallHollow";
import ThresholdStone from "./objects/ThresholdStone";
import { ROOM_COLORS, ROOM_RADIUS } from "./theme";
import type { RoomObjectId } from "./types";

/**
 * The Room — first-person composition, Version 1 (`ATLAS_SPRINT_LOG.md`,
 * Sprint 14). Same object list as Sprint 7–14: Heart, Department Wall,
 * Roadmap Floor, Threshold Stone, Small Hollow, two Archway Recess,
 * Ambient Company Health. No redesign — this is the ratified composition,
 * translated into a real, navigable screen for the first time.
 */
export default function RoomScene({
  onSelect,
}: {
  onSelect: (object: RoomObjectId) => void;
}) {
  return (
    <View style={styles.void}>
      <View style={styles.stage}>
        {/* Ambient Company Health — a property of the room's light, never
            an object with its own edge. */}
        <View pointerEvents="none" style={styles.ambientCore} />
        <View pointerEvents="none" style={styles.ambientWarm} />

        <View style={styles.wallLevel}>
          <ArchwayRecess active={false} onPress={() => onSelect("doorway-left")} />
          <DepartmentWall />
          <ArchwayRecess active onPress={() => onSelect("doorway-right")} />
        </View>

        <View style={styles.heartLevel} pointerEvents="box-none">
          <Heart onPress={() => onSelect("heart")} />
        </View>

        <View style={styles.floorLevel}>
          <View style={styles.floor}>
            <ThresholdStone onPress={() => onSelect("inbox")} />
            <SmallHollow onPress={() => onSelect("tools")} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  void: {
    flex: 1,
    backgroundColor: ROOM_COLORS.void,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  stage: {
    width: "100%",
    maxWidth: 860,
    aspectRatio: 16 / 10,
    borderRadius: ROOM_RADIUS.stage,
    overflow: "hidden",
    backgroundColor: ROOM_COLORS.wallBase,
  },

  ambientCore: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ROOM_COLORS.ambientCore,
  },

  ambientWarm: {
    position: "absolute",
    top: "10%",
    left: "20%",
    right: "20%",
    height: "55%",
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.ambientWarm,
  },

  wallLevel: {
    height: "46%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  heartLevel: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  floorLevel: {
    height: "54%",
    backgroundColor: ROOM_COLORS.floorBase,
    justifyContent: "flex-end",
    paddingBottom: 28,
  },

  floor: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
});
