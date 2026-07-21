import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import CompanyInterior from "./CompanyInterior";
import ArchwayRecess from "./objects/ArchwayRecess";
import Heart from "./objects/Heart";
import SmallHollow from "./objects/SmallHollow";
import ThresholdStone from "./objects/ThresholdStone";
import { ROOM_MOTION } from "./motion";
import type { DoorwayPresence } from "./roomData";
import { ROOM_COLORS, ROOM_RADIUS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";
import type { DoorwayId, RoomObjectId } from "./types";

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
 *
 * Sprint 21 ("First Company") adds one more state, the same way: entering
 * a Company Doorway does not open a screen or a new route — it cross-fades
 * this same stage from the Room composition to `CompanyInterior`, both
 * living inside the one shared `stage` frame. No teleport, no hard cut:
 * the Room content recedes and grows slightly (as if passing by) while the
 * Company content arrives from a slightly wider frame into full view — the
 * same flat-opacity/scale technique every other state change in The Room
 * already uses, just applied to two whole compositions instead of one
 * object.
 *
 * Same-day correction: Atlas may never disappear from any part of the
 * world (`ATLAS_IDENTITY_CONSTITUTION.md` ch.1–3, `ATLAS_VISUAL_PRINCIPLES.md`
 * §2 — the Heart is a point of contact, not a container Atlas lives in).
 * `presenceLightStyle` and `peripheryStyle` are computed once, here, and
 * passed to `CompanyInterior` as-is, so the Heart it renders shares the
 * exact same Awakening animation as the Heart in the Room — never a second,
 * independently-tuned copy of the same idea.
 *
 * Sprint 22 ("Company Identity") passes `enteredCompany` straight through
 * to `CompanyInterior` as `doorway`, so it can tell the two doorways apart.
 * `RoomScene` itself makes no identity decisions — it only tells
 * `CompanyInterior` which door was used; the actual composition
 * differences live entirely in `CompanyInterior`.
 *
 * Sprint 4.2 ("Capability Migration 03 — Company Interior") also passes the
 * same `doorwayPresence` already threaded to the two Room-level Archway
 * Recesses above straight through to `CompanyInterior` — the identical
 * object, not a copy. `CompanyInterior`'s own hardcoded per-doorway
 * `COMPANY_IDENTITY` table is gone; it now derives everything it shows from
 * this one real, shared value, the same one its own doorway already
 * rendered on the wall a moment ago.
 *
 * Sprint 23 correction ("The Room unfolds"): manual review of "First
 * Truth" found the real problem was never Operations — it was that every
 * piece of company state (departments, their warmth, the floor objects,
 * Ambient Company Health) was already visible before the CEO had
 * activated anything. An opacity-based reveal was tried first and
 * rejected on manual test: a barely-there object is still a rendered
 * object. The ratified fix is a direct boolean coupling instead — the
 * whole company/business layer (Ambient Company Health, both Archway
 * Recesses, Threshold Stone, Small Hollow) mounts only when `approached`
 * is true, and does not exist in the render tree at all before it. It is
 * gated as one group per layout region (never one child conditional at a
 * time inside a shared row), so nothing partially appears and shifts a
 * `space-between` layout mid-transition. The Heart, the stage scale, the
 * Awakening glow, and the Room's own architecture (walls, floor material,
 * the Archways' carved openings) stay outside this layer entirely and
 * never reference `approached` here.
 *
 * Phase 5.6 ("Atlas Space") retires the permanent Department Wall this comment used to
 * describe. Departments are no longer a fixed place in the wall band — they are contextual
 * projection identities Atlas materializes only while discussing one (see
 * `objects/DepartmentProjection.tsx`, used by `ExecutiveBriefingOverlay.tsx`, the one existing
 * place that "discussing a department" is a real event). `wallLevel` below now holds only the
 * two Company Doorways; the space between them is genuinely empty, not a smaller version of the
 * same wall. `mapDepartmentsForRoom()` (`roomData.ts`) and `DepartmentSpec` are untouched and
 * still real — only this file's permanent visual consumer of them is removed.
 */
export default function RoomScene({
  approached,
  enteredCompany,
  ceoFocusWarmth,
  heartVitality,
  doorwayPresence,
  readyToEnter,
  onSelect,
  onExitCompany,
}: {
  approached: boolean;
  enteredCompany: DoorwayId | null;
  /** Sprint 2.2 — the single 0–1 warmth value Threshold Stone needs (see `roomData.ts`'s
   * `selectCeoFocus()`). RoomScene does not know what it means, only where it goes. */
  ceoFocusWarmth: number;
  /** Sprint 4.2 — the Heart's one variable property (see `roomData.ts`'s
   * `deriveHeartVitality()`). Threaded to both Heart instances below (the Room's own, and
   * the one `CompanyInterior` renders) — same point of contact, same value, never two. */
  heartVitality: number;
  /** Sprint 4.2.2 ("Company Doorway Completion") — each Archway Recess's one real, graduated
   * warmth value (0–1, see `roomData.ts`'s `mapCompanyDoorways()`). RoomScene still makes no
   * data decisions — it only replaces the two literals it used to hardcode with these two
   * real, stable-identity-bound ones. */
  doorwayPresence: DoorwayPresence;
  /** Sprint 4.3 ("Room Entry Experience") — `false` while the Executive Briefing is still
   * showing, `true` once the CEO has dismissed it. The entrance effect below now waits on
   * this instead of firing unconditionally on mount, so "Atlas greets you" finishes as its
   * own beat before "you enter The Room" begins as the next one — the same
   * `ROOM_MOTION.TRANSITION` timing and easing as always, only re-triggered on a later,
   * more deliberate condition. */
  readyToEnter: boolean;
  onSelect: (object: RoomObjectId) => void;
  onExitCompany: () => void;
}) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!readyToEnter) {
      return;
    }
    Animated.timing(entrance, {
      toValue: 1,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [entrance, readyToEnter]);

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

  // Sprint 21 — one cross-fade between the two whole compositions that can
  // occupy the same stage. Room content recedes and grows slightly, as if
  // passing by; Company content arrives from a slightly wider frame into
  // full view. One shared transition, one shared timing, applied to a
  // whole scene instead of one object — never a hard cut.
  const companyProgress = useRoomTransition(enteredCompany !== null);

  const roomContentStyle = {
    opacity: companyProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        scale: companyProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  const companyContentStyle = {
    opacity: companyProgress,
    transform: [
      {
        scale: companyProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.void}>
      <Animated.View style={[styles.stage, stageStyle]}>
        <Animated.View
          pointerEvents={enteredCompany ? "none" : "box-none"}
          style={[styles.contentLayer, roomContentStyle]}
        >
          {/* Sprint 23 correction, boolean-mount form: the whole company
              layer is coupled directly to `approached` — not to an
              animated opacity. Before Awakening none of it exists in the
              tree; after, all of it mounts together. Split across three
              JSX positions only because each region has its own RN parent
              (the absolute-fill ambient layer, the `wallLevel` row, the
              `floor` row) — every occurrence below tests the exact same
              `approached` boolean in the same render pass, so they always
              mount/unmount together as one atomic group, never staggered
              per child (that staggering, with only the left Archway
              conditional inside `wallLevel`, is what previously shifted
              Department Wall in the `space-between` row). */}
          {approached && (
            <>
              <View pointerEvents="none" style={styles.ambientCore} />
              <View pointerEvents="none" style={styles.ambientWarm} />
            </>
          )}

          <View style={styles.wallLevel}>
            {approached && (
              <>
                <ArchwayRecess warmth={doorwayPresence.left} onPress={() => onSelect("doorway-left")} />
                <ArchwayRecess warmth={doorwayPresence.right} onPress={() => onSelect("doorway-right")} />
              </>
            )}
          </View>

          {/* The Awakening (Sprint 18 v2) glow — outside the company layer,
              untouched: always mounted, its own existing
              `presenceLightStyle` animation and timing. */}
          <Animated.View
            pointerEvents="none"
            style={[styles.presenceLight, presenceLightStyle]}
          >
            <View style={[styles.glowRing, styles.glowOuter]} />
            <View style={[styles.glowRing, styles.glowMid]} />
            <View style={[styles.glowRing, styles.glowInner]} />
          </Animated.View>

          <View style={styles.heartLevel} pointerEvents="box-none">
            <Heart onPress={() => onSelect("heart")} vitality={heartVitality} />
          </View>

          {/* Floor material (`floorLevel`) is architecture and stays
              mounted; the objects on it are the company layer. */}
          <View style={styles.floorLevel}>
            <View style={styles.floor}>
              {approached && (
                <>
                  <ThresholdStone onPress={() => onSelect("inbox")} warmth={ceoFocusWarmth} />
                  <SmallHollow onPress={() => onSelect("tools")} />
                </>
              )}
            </View>
          </View>
        </Animated.View>

        {/* First Company (Sprint 21) — unchanged. */}
        <Animated.View
          pointerEvents={enteredCompany ? "box-none" : "none"}
          style={[styles.contentLayer, companyContentStyle]}
        >
          <CompanyInterior
            doorway={enteredCompany}
            onExit={onExitCompany}
            onSelectHeart={() => onSelect("heart")}
            presenceLightStyle={presenceLightStyle}
            peripheryStyle={peripheryStyle}
            heartVitality={heartVitality}
            doorwayPresence={doorwayPresence}
          />
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
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 6,
  },

  contentLayer: {
    ...StyleSheet.absoluteFill,
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
    borderTopWidth: 1,
    borderTopColor: ROOM_COLORS.glassBorder,
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
