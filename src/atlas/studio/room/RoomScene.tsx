import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import ArchwayRecess from "./objects/ArchwayRecess";
import DepartmentWall from "./objects/DepartmentWall";
import Heart from "./objects/Heart";
import SmallHollow from "./objects/SmallHollow";
import ThresholdStone from "./objects/ThresholdStone";
import { ROOM_MOTION } from "./motion";
import { ROOM_COLORS, ROOM_RADIUS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";
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
 *
 * Sprint 18 ("The Awakening") makes `approached` visible as one uniform
 * state change, not an overlay: a subtle whole-stage scale, a mild
 * recession of everything that isn't the Heart, and three bounded glow
 * circles around the Heart (`presenceLight`) — no color change on the
 * Heart itself, no new objects, no text. This is the v2 correction: the
 * first version's edge-to-edge vignette produced visible rectangular
 * bands (a flat-rectangle-with-no-falloff artifact); replaced here with
 * the same layered-circle technique already proven safe by the Heart's
 * own rendering.
 *
 * Sprint 19 ("Spatial Presence") and Sprint 20 ("The Room Receives
 * Light") each explored a different mechanism for this same moment.
 * Manual review found this v2 result more legible than either — neither
 * was ratified, and both have been reverted. This file is deliberately
 * back to the version that worked.
 */
export default function RoomScene({
  approached,
  onSelect,
}: {
  approached: boolean;
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

  const approachProgress = useRoomTransition(approached);

  // One combined scale factor — the first-entrance settle and the
  // approach-state scale are two different causes, but the Heart's own
  // frame only has one `transform`, so they're multiplied into a single
  // animated value rather than one silently overwriting the other.
  const stageStyle = {
    opacity: entrance,
    transform: [
      {
        scale: Animated.multiply(
          entrance.interpolate({
            inputRange: [0, 1],
            outputRange: [0.98, 1],
          }),
          approachProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, ROOM_MOTION.APPROACH.scale],
          }),
        ),
      },
    ],
  };

  // Everything that isn't the Heart recedes slightly — never disappears,
  // never darkens to black, just a mild give of attention.
  const peripheryStyle = {
    opacity: approachProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, ROOM_MOTION.APPROACH.peripheryOpacity],
    }),
  };

  // Three bounded glow circles fading in around the Heart — bounded
  // meaning finite, faded shapes, never an edge-to-edge wash or vignette.
  const presenceLightStyle = {
    opacity: approachProgress,
  };

  return (
    <View style={styles.void}>
      <Animated.View style={[styles.stage, stageStyle]}>
        {/* Ambient Company Health — a property of the room's light, never
            an object with its own edge, never touched by approach-state. */}
        <View pointerEvents="none" style={styles.ambientCore} />
        <View pointerEvents="none" style={styles.ambientWarm} />

        <Animated.View style={[styles.wallLevel, peripheryStyle]}>
          <ArchwayRecess active={false} onPress={() => onSelect("doorway-left")} />
          <DepartmentWall />
          <ArchwayRecess active onPress={() => onSelect("doorway-right")} />
        </Animated.View>

        {/* The Awakening (Sprint 18 v2) — three bounded, layered glow
            circles centered on the Heart, fading in with approach-state.
            Same flat-opacity-circle technique the Heart itself uses; never
            a gradient, never a hard-edged rectangle. */}
        <Animated.View
          pointerEvents="none"
          style={[styles.presenceLight, presenceLightStyle]}
        >
          <View style={[styles.glowRing, styles.glowOuter]} />
          <View style={[styles.glowRing, styles.glowMid]} />
          <View style={[styles.glowRing, styles.glowInner]} />
        </Animated.View>

        <View style={styles.heartLevel} pointerEvents="box-none">
          <Heart onPress={() => onSelect("heart")} />
        </View>

        <Animated.View style={[styles.floorLevel, peripheryStyle]}>
          <View style={styles.floor}>
            <ThresholdStone onPress={() => onSelect("inbox")} />
            <SmallHollow onPress={() => onSelect("tools")} />
          </View>
        </Animated.View>
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

  presenceLight: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  glowRing: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  glowOuter: {
    width: 260,
    height: 260,
    opacity: ROOM_MOTION.APPROACH.glow.outer,
  },

  glowMid: {
    width: 180,
    height: 180,
    opacity: ROOM_MOTION.APPROACH.glow.mid,
  },

  glowInner: {
    width: 120,
    height: 120,
    opacity: ROOM_MOTION.APPROACH.glow.inner,
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
