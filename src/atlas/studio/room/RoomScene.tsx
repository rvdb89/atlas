import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import ArchwayRecess from "./objects/ArchwayRecess";
import DepartmentWall from "./objects/DepartmentWall";
import Heart from "./objects/Heart";
import SmallHollow from "./objects/SmallHollow";
import ThresholdStone from "./objects/ThresholdStone";
import { ROOM_MOTION } from "./motion";
import { ROOM_COLORS, ROOM_RADIUS } from "./theme";
import type { RoomObjectId } from "./types";

/**
 * The Room — first-person composition, Version 1 (`ATLAS_SPRINT_LOG.md`,
 * Sprint 14). Same object list as Sprint 7–14: Heart, Department Wall,
 * Roadmap Floor, Threshold Stone, Small Hollow, two Archway Recess,
 * Ambient Company Health. No redesign — this is the ratified composition,
 * translated into a real, navigable screen for the first time.
 *
 * Sprint 15 adds exactly one Soft State Transition here: the first
 * entrance. The void (background) is present instantly; only the Room
 * itself settles into place, using the one shared `ROOM_MOTION.TRANSITION`
 * timing every other transition in The Room also uses.
 */
export default function RoomScene({
  onSelect,
}: {
  onSelect: (object: RoomObjectId) => void;
}) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        scale: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.void}>
      <Animated.View style={[styles.stage, entranceStyle]}>
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
      </Animated.View>
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
