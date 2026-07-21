import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { ROOM_MOTION } from "../motion";
import RoomTouchable from "../RoomTouchable";
import { ROOM_COLORS } from "../theme";

/**
 * The Heart — randloos, gloeiend, geen silhouet dat als icoon leest
 * (`ATLAS_SPRINT_LOG.md`, Sprint 5 materialiteit §3). Rendered as layered,
 * flat-opacity circles of increasing size and decreasing intensity, never a
 * single hard-edged shape — there is no border to isolate it as an icon.
 *
 * Touch feedback is delegated entirely to `RoomTouchable` (Sprint 15) —
 * the same reaction every other object in The Room uses, never a Heart-
 * specific one.
 *
 * Sprint 4.2 ("The Heart Becomes Alive"): `vitality` is the Heart's one variable
 * property — the same intensity-as-judgment idiom Threshold Stone, Department Wall and
 * Archway Recess already use, applied here for the first time. Real value comes from
 * `roomData.ts`'s `deriveHeartVitality()`, floored so the Heart never fully fades.
 * Transitions use the Room's one shared `ROOM_MOTION.TRANSITION` timing, the same easing
 * every other state change in The Room already uses — not a new stopwatch.
 *
 * Sprint 4.2.1 ("Heart Presence Calibration"): user testing found ring opacity alone too
 * weak a channel to perceive at realistic day-to-day health scores. `vitality` now drives
 * two properties instead of one — ring opacity (as before) and the whole Heart's overall
 * scale — both derived from the exact same `animatedVitality` value, multiplied/interpolated
 * from it directly rather than from two independently-tracked numbers. This is the same
 * coupling relationship Department Wall's Grain Shift already has with its own Warm Vein:
 * one source, several visible effects, never two independent signals. No loop, no pulse:
 * the value only moves when `vitality` itself changes, using the same one-shot eased
 * transition as everything else here.
 *
 * Scale is deliberately the smaller of the two effects, by principle rather than caution:
 * shrinking/growing a shape reads to people as a change in power or importance ("bigger =
 * stronger"), which is exactly what this value must never say — presence, not power, is the
 * whole brief. Opacity/warmth is the channel already proven, three times over in this same
 * Room, to read correctly as "how much attention/condition," so it carries the primary
 * expression; scale only reinforces it physically, and stays visibly secondary so it can
 * never be mistaken for its own, competing signal.
 *
 * Phase 5.5 ("Jarvis Visual Identity") adds exactly one more layer: `breathe`, a slow,
 * continuous, uniform loop (`ROOM_MOTION.BREATHE`) — "subtle pulse... light breathing...
 * energy rather than decoration" per the brief. It is a purely decorative idle motion, never
 * selected on judgment (same discipline `ROOM_MOTION`'s own comments already hold `TRANSITION`
 * and `TOUCH` to) — `vitality` still alone decides how bright and how present the Heart is;
 * `breathe` only decides that it is quietly alive while nothing else is changing. It multiplies
 * into the exact same `presenceScale`/ring-opacity values `vitality` already drives, rather than
 * adding a second, competing transform or a second opacity source.
 */
const SCALE_RANGE = { min: 0.9, max: 1 } as const;

export default function Heart({
  onPress,
  vitality = 1,
}: {
  onPress: () => void;
  vitality?: number;
}) {
  const animatedVitality = useRef(new Animated.Value(vitality)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedVitality, {
      toValue: vitality,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [vitality, animatedVitality]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: ROOM_MOTION.BREATHE.duration,
          easing: ROOM_MOTION.BREATHE.easing,
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: ROOM_MOTION.BREATHE.duration,
          easing: ROOM_MOTION.BREATHE.easing,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const presenceScale = Animated.multiply(
    animatedVitality.interpolate({
      inputRange: [0, 1],
      outputRange: [SCALE_RANGE.min, SCALE_RANGE.max],
      extrapolate: "clamp",
    }),
    breathe.interpolate({
      inputRange: [0, 1],
      outputRange: [1 - ROOM_MOTION.BREATHE.amplitude * 0.3, 1 + ROOM_MOTION.BREATHE.amplitude * 0.3],
    }),
  );

  const breatheGlow = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1 - ROOM_MOTION.BREATHE.amplitude, 1 + ROOM_MOTION.BREATHE.amplitude],
  });

  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="Heart — Atlas"
      hitStyle={styles.hitArea}
      focusRadius={999}
    >
      <View pointerEvents="none" style={styles.wrap}>
        <Animated.View style={[styles.presence, { transform: [{ scale: presenceScale }] }]}>
          <Animated.View
            style={[
              styles.ring,
              styles.ringOuter,
              { opacity: Animated.multiply(Animated.multiply(animatedVitality, RING_OPACITY.outer), breatheGlow) },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringMid,
              { opacity: Animated.multiply(Animated.multiply(animatedVitality, RING_OPACITY.mid), breatheGlow) },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringCore,
              { opacity: Animated.multiply(Animated.multiply(animatedVitality, RING_OPACITY.core), breatheGlow) },
            ]}
          />
        </Animated.View>
      </View>
    </RoomTouchable>
  );
}

const CORE = 34;
const MID = 64;
const OUTER = 104;

// Sprint 4.2: named so `vitality` can multiply them, instead of living only inline in
// `styles` as before — the rings' relative proportions to each other are unchanged.
const RING_OPACITY = {
  outer: 0.16,
  mid: 0.32,
  core: 0.9,
} as const;

const styles = StyleSheet.create({
  // Sprint 4.2.1: the hit area stays exactly OUTER + 24 regardless of `vitality` — the
  // touch target does not shrink when the Heart's presence does, only what's visible does.
  hitArea: {
    width: OUTER + 24,
    height: OUTER + 24,
    borderRadius: 999,
  },

  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Sprint 4.2.1: the single node `presenceScale` transforms — one shared parent for all
  // three rings, so scale is applied once, coupled, never per-ring.
  presence: {
    alignItems: "center",
    justifyContent: "center",
  },

  ring: {
    position: "absolute",
    borderRadius: 999,
  },

  ringOuter: {
    width: OUTER,
    height: OUTER,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  ringMid: {
    width: MID,
    height: MID,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  // Phase 5.5 — the one real light source in the Room gets the one real
  // glow halo: a soft shadow in the same single energy colour, never a
  // second one, never on any other object's core.
  ringCore: {
    width: CORE,
    height: CORE,
    backgroundColor: ROOM_COLORS.emberCore,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 14,
  },
});
