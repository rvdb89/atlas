import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";

import { ROOM_MOTION } from "../motion";
import RoomTouchable from "../RoomTouchable";
import { ROOM_COLORS } from "../theme";
import { useRoomTransition } from "../useRoomTransition";

/**
 * Atlas's core — Design 2.0 ("The Core").
 *
 * This is a correction, not a rebuild: `CompanyInterior.tsx` still imports this component
 * directly at this file path and is out of this sprint's scope, so the path and the pre-existing
 * public contract (`onPress`, `vitality`, `activated`) are unchanged and still mean exactly what
 * they meant before. What changes is everything about how Atlas *behaves* while idle and how its
 * structure reads — the brief's own diagnosis was that Phase 5.9's Heart, for all its layers, was
 * still "an animated circle": four to six rings spinning forever at different speeds regardless of
 * whether Atlas was doing anything. That reads as a loading indicator, not an intelligence.
 *
 * Two changes carry the whole sprint:
 *
 * 1. A new `state` prop (`"rest" | "listening" | "thinking" | "speaking"`), independent of
 *    `activated`. `activated` still means what it always has — has the CEO engaged Atlas at all —
 *    and still drives the one existing approach cue (the containment ring's brightening on
 *    engagement). `state` is new: it describes Atlas's *cognitive* register once engaged, and it is
 *    the thing that now decides whether anything beyond breathing is allowed to move at all. This
 *    sprint does not wire every state to a real trigger — `AtlasSpace.tsx` only ever passes
 *    `"rest"`, `"thinking"` (briefly, while a step is materializing), or `"speaking"` (while a step
 *    is presented); `"listening"` has a fully defined visual register below and simply has no
 *    caller yet, per the brief's "only prepare the visual language" instruction.
 *
 * 2. Nothing spins unconditionally anymore. `ROOM_MOTION.BREATHE` is the one motion that never
 *    stops, now a slow, nearly-flat 10-second cycle instead of the old ~5s pulse. Every rotation
 *    loop below is started and stopped by an effect keyed on `state`: at `"rest"` every rotating
 *    layer is stopped and pinned to its resting angle, full stop — "Atlas is waiting for me," not
 *    "Atlas is performing an animation." Rotation only resumes once `state` leaves `"rest"`, and
 *    even then at speeds slower than anything Phase 5.9 used.
 *
 * The layer set is also restructured, not just re-timed — per the brief, "increase visual
 * sophistication... by adding structure," not effects:
 *
 * - `glassShell` — an outermost, almost-invisible bordered circle. The one purely "transparent
 *   glass-like" layer; it exists to imply a containment volume, not to be seen directly.
 * - `bracketGroup` (×4) — the HUD/instrument corner reticle, kept from Phase 5.9, now pushed to
 *   frame the whole mechanism (previously it sat *inside* the tick ring, which read as clutter
 *   rather than a frame) and, like everything else, static at rest.
 * - `containmentRing` — replaces Phase 5.9's separate `engagedRing` + `tickRing`: one ring built
 *   from two concentric hairline borders a few pixels apart (a machined-groove read — "brushed
 *   titanium") plus a reduced set of fine calibration ticks around it. `activated`'s approach glow
 *   now brightens this ring directly instead of drawing a whole separate ring for it.
 * - `structuralSegments` — replaces the old 26-piece spinning segment ring with 8 static ribs.
 *   Fewer, bolder, motionless: structure ("an engineered containment"), not a sweeping signal.
 * - `energyChannels` — new. Thin radial spokes between the structural ribs and the core, present
 *   only in proportion to internal activity — at `"rest"` they are essentially off; they are the
 *   thing that visibly brightens when Atlas is `"thinking"` or `"speaking"`, reading as power
 *   actually routing to the core rather than a generic glow increasing.
 * - `plate` — kept from Phase 5.9 (the rotating faceted square glimpsed behind the core), now
 *   slower still and, like the containment ring and brackets, motionless at rest.
 * - `precisionRing`, `core` — kept: the fine ring at the core's edge and the core itself, the one
 *   layer allowed real brightness, brightness now scaled by `state` as well as `vitality` so
 *   "speaking" is visibly the brightest register and "rest" the most restrained.
 *
 * No new dependency: still no `react-native-svg` in this project, still the same flat-View +
 * `Animated` technique `theme.ts` documents as this codebase's deliberate choice since Phase 5.5.
 * "Material" differences (matte metal, brushed titanium, dark ceramic, glass) are expressed the
 * only way this technique allows — border-only vs. filled shapes, and opacity register — not new
 * textures or gradients.
 */
export type AtlasCoreState = "rest" | "listening" | "thinking" | "speaking";

const TICK_COUNT = 10;
const TICK_ANGLES = Array.from({ length: TICK_COUNT }, (_, i) => Math.round((360 / TICK_COUNT) * i));

const SEGMENT_COUNT = 8;
const SEGMENT_ANGLES = Array.from({ length: SEGMENT_COUNT }, (_, i) => Math.round((360 / SEGMENT_COUNT) * i));

const CHANNEL_COUNT = 6;
const CHANNEL_ANGLES = Array.from({ length: CHANNEL_COUNT }, (_, i) => Math.round((360 / CHANNEL_COUNT) * i));

// Four ordinal positions — a reticle reads as an instrument precisely because it marks specific
// positions, not every angle.
const BRACKET_ANGLES = [45, 135, 225, 315] as const;

// How much of Atlas's structure is "doing something" at each state — internal ring/channel
// brightness, breathing strength, and whether rotation is permitted at all. Rest is deliberately
// restrained: per the brief, resting Atlas should read as "peacefully waiting," not dimmed-down
// busy. Correction (same sprint, follow-up round): "thinking" no longer rotates anything — the
// brief was explicit that thinking must not introduce dramatic motion. Its entire register is now
// a slightly stronger breath (`breatheBoost`), a subtle rise in internal energy (`activity`,
// `glow`) over rest, and the minor energy-channel activation that `activity` already drives —
// "attentive, not animated." Rotation is reserved for `"speaking"` alone, the state where Atlas is
// genuinely the origin of information.
const STATE_PROFILE: Record<
  AtlasCoreState,
  { activity: number; glow: number; rotate: boolean; breatheBoost: number }
> = {
  rest: { activity: 0.1, glow: 0.55, rotate: false, breatheBoost: 1 },
  listening: { activity: 0.32, glow: 0.72, rotate: false, breatheBoost: 1.1 },
  thinking: { activity: 0.22, glow: 0.62, rotate: false, breatheBoost: 1.3 },
  speaking: { activity: 0.85, glow: 1, rotate: true, breatheBoost: 1.05 },
};

export default function Heart({
  onPress,
  vitality = 1,
  activated = false,
  state = "rest",
}: {
  onPress: () => void;
  vitality?: number;
  activated?: boolean;
  state?: AtlasCoreState;
}) {
  const { width, height } = useWindowDimensions();
  const unit = Math.min(Math.max(Math.min(width, height) * 0.36, 200), 460);

  const CORE = unit * 0.2;
  const PRECISION_RING = unit * 0.3;
  const PLATE_SIZE = unit * 0.27;
  const STRUCTURAL_RADIUS = unit * 0.42;
  const CONTAINMENT_RADIUS = unit * 0.5;
  const CHANNEL_INNER = unit * 0.22;
  const GLASS_SHELL = unit * 0.86;
  const BRACKET_RADIUS = unit * 0.58;
  const BRACKET_SIZE = unit * 0.13;

  const profile = useMemo(() => STATE_PROFILE[state], [state]);

  const animatedVitality = useRef(new Animated.Value(vitality)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const containmentRotation = useRef(new Animated.Value(0)).current;
  const plateRotation = useRef(new Animated.Value(0)).current;
  const bracketRotation = useRef(new Animated.Value(0)).current;
  const activity = useRef(new Animated.Value(profile.activity)).current;
  const glow = useRef(new Animated.Value(profile.glow)).current;
  const breatheBoost = useRef(new Animated.Value(profile.breatheBoost)).current;

  const engagedProgress = useRoomTransition(activated);

  useEffect(() => {
    Animated.timing(animatedVitality, {
      toValue: vitality,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [vitality, animatedVitality]);

  // Atlas's cognitive register changes as a soft cross-fade, not a cut — reuses the one shared
  // Soft State Transition timing rather than inventing a second stopwatch for it.
  useEffect(() => {
    Animated.timing(activity, {
      toValue: profile.activity,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
    Animated.timing(glow, {
      toValue: profile.glow,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
    Animated.timing(breatheBoost, {
      toValue: profile.breatheBoost,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [profile, activity, glow, breatheBoost]);

  // The one motion that never stops — everything else below is gated on `profile.rotate`.
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

  function loopRotation(value: Animated.Value, duration: number) {
    const loop = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: ROOM_MOTION.ORBIT.easing,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }

  // "No constant spinning... every other motion should happen because Atlas is doing something."
  // At rest, every rotating layer stops dead and is pinned to 0 — not slowed, stopped.
  useEffect(() => {
    if (!profile.rotate) {
      containmentRotation.stopAnimation(() => containmentRotation.setValue(0));
      plateRotation.stopAnimation(() => plateRotation.setValue(0));
      bracketRotation.stopAnimation(() => bracketRotation.setValue(0));
      return;
    }
    const stopContainment = loopRotation(containmentRotation, ROOM_MOTION.ORBIT.containmentDuration);
    const stopPlate = loopRotation(plateRotation, ROOM_MOTION.ORBIT.plateDuration);
    const stopBracket = loopRotation(bracketRotation, ROOM_MOTION.ORBIT.bracketDuration);
    return () => {
      stopContainment();
      stopPlate();
      stopBracket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.rotate, containmentRotation, plateRotation, bracketRotation]);

  // The breathing envelope itself: 0 at rest, 1 at the cycle's midpoint, 0 again at the end —
  // `breathe`'s own two-leg sine-based easing already produces this shape (see `ROOM_MOTION.
  // BREATHE`'s docstring). `breatheBoost` (per `state`, cross-faded above) scales how strong that
  // envelope reads without changing its shape or its 10s period.
  const breatheEnvelope = Animated.multiply(breathe, breatheBoost);

  // Scale: 1.000 → 1.012 → 1.000 at the resting boost (1×) — one-directional, never dipping below
  // the resting size. This is the exact swing the brief asked for; the previous cut of this file
  // additionally multiplied it by `0.3`, which is the bug that made breathing read as missing.
  const presenceScale = Animated.multiply(
    animatedVitality.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1], extrapolate: "clamp" }),
    Animated.add(1, Animated.multiply(breatheEnvelope, ROOM_MOTION.BREATHE.scaleAmplitude)),
  );

  // Opacity: a 2.5% one-directional swing at the resting boost, inside the requested 2–3% band,
  // driven by the same envelope so scale and opacity breathe in lockstep — one motion, not two.
  const breatheGlow = Animated.add(1, Animated.multiply(breatheEnvelope, ROOM_MOTION.BREATHE.opacityAmplitude));

  const livingOpacity = Animated.multiply(animatedVitality, breatheGlow);
  const stateBrightness = Animated.multiply(livingOpacity, glow);
  const engagedBrightness = engagedProgress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  const containmentSpin = containmentRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const plateSpin = plateRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const bracketSpin = bracketRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "6deg"] });

  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="Atlas"
      hitStyle={[styles.hitArea, { width: CONTAINMENT_RADIUS * 2 + 24, height: CONTAINMENT_RADIUS * 2 + 24 }]}
      focusRadius={999}
    >
      <View pointerEvents="none" style={styles.wrap}>
        <Animated.View
          style={[
            styles.presence,
            { width: GLASS_SHELL, height: GLASS_SHELL, transform: [{ scale: presenceScale }] },
          ]}
        >
          {/* Outermost, almost invisible — a transparent containment shell, not a visible ring. */}
          <Animated.View
            style={[
              styles.glassShell,
              {
                width: GLASS_SHELL,
                height: GLASS_SHELL,
                borderRadius: GLASS_SHELL / 2,
                opacity: Animated.multiply(animatedVitality, 0.045),
              },
            ]}
          />

          {/* HUD corner reticle — frames the mechanism, static except when Atlas is doing
              something. */}
          <Animated.View
            style={[
              styles.bracketGroup,
              { width: BRACKET_RADIUS * 2, height: BRACKET_RADIUS * 2, transform: [{ rotate: bracketSpin }] },
            ]}
          >
            {BRACKET_ANGLES.map((angle, index) => (
              <Animated.View
                key={angle}
                style={[
                  styles.bracket,
                  {
                    width: BRACKET_SIZE,
                    height: BRACKET_SIZE,
                    opacity: Animated.multiply(animatedVitality, 0.3),
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -BRACKET_RADIUS },
                      { rotate: `${index * 90}deg` },
                    ],
                  },
                ]}
              />
            ))}
          </Animated.View>

          {/* Containment ring — a machined-groove read from two close hairline borders, plus a
              reduced set of calibration ticks. `activated`'s approach cue brightens this ring
              directly instead of a separate element. */}
          <Animated.View
            style={[
              styles.containmentOuter,
              {
                width: CONTAINMENT_RADIUS * 2,
                height: CONTAINMENT_RADIUS * 2,
                borderRadius: CONTAINMENT_RADIUS,
                opacity: Animated.multiply(animatedVitality, engagedBrightness),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.containmentInner,
              {
                width: CONTAINMENT_RADIUS * 2 - 7,
                height: CONTAINMENT_RADIUS * 2 - 7,
                borderRadius: CONTAINMENT_RADIUS - 3.5,
                opacity: Animated.multiply(stateBrightness, engagedBrightness),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.tickRing,
              {
                width: CONTAINMENT_RADIUS * 2,
                height: CONTAINMENT_RADIUS * 2,
                transform: [{ rotate: containmentSpin }],
                opacity: Animated.multiply(stateBrightness, engagedBrightness),
              },
            ]}
          >
            {TICK_ANGLES.map((angle) => (
              <View
                key={angle}
                style={[
                  styles.tick,
                  { transform: [{ rotate: `${angle}deg` }, { translateY: -CONTAINMENT_RADIUS }] },
                ]}
              />
            ))}
          </Animated.View>

          {/* Structural ribs — fixed, motionless. Structure, not a sweeping signal. */}
          <View style={[styles.segmentRing, { width: STRUCTURAL_RADIUS * 2, height: STRUCTURAL_RADIUS * 2 }]}>
            {SEGMENT_ANGLES.map((angle) => (
              <Animated.View
                key={angle}
                style={[
                  styles.segment,
                  {
                    opacity: Animated.multiply(animatedVitality, Animated.add(0.16, Animated.multiply(activity, 0.3))),
                    transform: [{ rotate: `${angle}deg` }, { translateY: -STRUCTURAL_RADIUS }],
                  },
                ]}
              />
            ))}
          </View>

          {/* Energy channels — the layer that visibly answers "is Atlas doing something?" Near-off
              at rest, brightening as internal activity rises. */}
          <View style={[styles.channelGroup, { width: STRUCTURAL_RADIUS * 2, height: STRUCTURAL_RADIUS * 2 }]}>
            {CHANNEL_ANGLES.map((angle) => (
              <Animated.View
                key={angle}
                style={[
                  styles.channel,
                  {
                    height: STRUCTURAL_RADIUS - CHANNEL_INNER,
                    opacity: Animated.multiply(animatedVitality, activity),
                    transform: [
                      { rotate: `${angle}deg` },
                      { translateY: -(CHANNEL_INNER + (STRUCTURAL_RADIUS - CHANNEL_INNER) / 2) },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* The internal faceted plate — a mechanical part glimpsed behind the core, not a
              circle. Motionless at rest like everything above. */}
          <Animated.View
            style={[
              styles.plate,
              {
                width: PLATE_SIZE,
                height: PLATE_SIZE,
                borderRadius: PLATE_SIZE * 0.16,
                transform: [{ rotate: plateSpin }],
                opacity: Animated.multiply(animatedVitality, 0.2),
              },
            ]}
          />

          <Animated.View
            style={[
              styles.ringPrecision,
              {
                width: PRECISION_RING,
                height: PRECISION_RING,
                borderRadius: PRECISION_RING / 2,
                opacity: Animated.multiply(animatedVitality, RING_OPACITY.precision),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringCore,
              {
                width: CORE,
                height: CORE,
                opacity: Animated.multiply(Animated.multiply(stateBrightness, RING_OPACITY.core), engagedBrightness),
              },
            ]}
          />
        </Animated.View>
      </View>
    </RoomTouchable>
  );
}

const RING_OPACITY = {
  precision: 0.4,
  core: 0.92,
} as const;

const styles = StyleSheet.create({
  hitArea: {
    borderRadius: 999,
  },

  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  presence: {
    alignItems: "center",
    justifyContent: "center",
  },

  ring: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  glassShell: {
    position: "absolute",
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    backgroundColor: "transparent",
  },

  ringPrecision: {
    position: "absolute",
    borderWidth: 1,
    borderColor: ROOM_COLORS.emberCore,
  },

  containmentOuter: {
    position: "absolute",
    borderWidth: 1,
    borderColor: ROOM_COLORS.textPrimary,
    backgroundColor: "transparent",
  },

  containmentInner: {
    position: "absolute",
    borderWidth: 1,
    borderColor: ROOM_COLORS.emberCore,
    backgroundColor: "transparent",
  },

  ringCore: {
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 14,
  },

  plate: {
    position: "absolute",
    borderWidth: 1,
    borderColor: ROOM_COLORS.emberCore,
    backgroundColor: "transparent",
  },

  bracketGroup: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  bracket: {
    position: "absolute",
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: ROOM_COLORS.textPrimary,
  },

  tickRing: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  tick: {
    position: "absolute",
    width: 2,
    height: 6,
    borderRadius: 1,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.4,
  },

  segmentRing: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  segment: {
    position: "absolute",
    width: 4,
    height: 12,
    borderRadius: 1,
    backgroundColor: ROOM_COLORS.emberDeep,
  },

  channelGroup: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  channel: {
    position: "absolute",
    width: 1.5,
    backgroundColor: ROOM_COLORS.emberCore,
  },
});
