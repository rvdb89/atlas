import { Animated, DimensionValue, StyleSheet, Text, View, ViewStyle } from "react-native";

import ArchwayRecess from "./objects/ArchwayRecess";
import Heart from "./objects/Heart";
import { ROOM_MOTION } from "./motion";
import type { DoorwayPresence } from "./roomData";
import { ROOM_COLORS } from "./theme";
import type { DoorwayId } from "./types";

/**
 * Company Interior — Sprint 21, "First Company," extended by Sprint 22,
 * "Company Identity."
 *
 * The first working space behind a Company Doorway. Built from nothing new:
 * the same Ambient Company Health field the Room itself uses
 * (`ambientCore`/`ambientWarm`, ratified Sprint 6/7 — same tokens, same
 * mechanism), the same stage background it already sits inside (Polished
 * Limestone, painted once at the `stage` level in `RoomScene`, never
 * repainted here), and the one already-ratified Archway Recess (Sprint 13)
 * — reused unchanged as the way back. No new object, no new material, no
 * new render channel.
 *
 * Same-day correction (Sprint 21): Atlas may never disappear from any part
 * of the world. The Room is not where Atlas lives — the Heart is only ever
 * a point of contact (`ATLAS_IDENTITY_CONSTITUTION.md` ch.1,
 * `ATLAS_VISUAL_PRINCIPLES.md` §2) — so it renders the exact same `Heart`
 * component, at the exact same fixed position it holds in `RoomScene`
 * (`top: 30%`, never company-dependent), wired to the exact same
 * `onSelect("heart")` call and driven by the exact same
 * `presenceLightStyle`/`peripheryStyle` Animated values passed down from
 * `RoomScene`. No Company Heart was designed; this is the Room's Heart,
 * unmoved, simply still visible from here.
 *
 * Sprint 22 ("Company Identity") proved the two doorways lead to two real,
 * distinguishable places — without inventing a second visual language. Every
 * value that differs per company is a *composition* parameter (shape,
 * spacing, rhythm, and the Archway's own pre-existing glow), never a new
 * color, material, or object. That remains true after Sprint 4.2
 * ("Capability Migration 03 — Company Interior"), which only changes where
 * those values come from.
 *
 * Sprint 4.2 correction: Sprint 22's original `COMPANY_IDENTITY` table
 * hardcoded which company was "active" per doorway, independently of the
 * real business data its own doorway on the wall already rendered from —
 * exactly the two-truths risk `ATLAS_OBJECT_SEMANTICS.md`'s "Company
 * Interior" entry now names explicitly. That table is gone. `doorwayPresence`
 * — the same real, graduated 0–1 value (`roomData.ts`'s `mapCompanyDoorways()`)
 * already rendering each Archway Recess's glow on the wall a moment ago — is
 * the only source for everything below:
 *
 * - The return Archway's glow now reads `warmth={presence}` directly, the
 *   identical value and the identical prop `ArchwayRecess` already accepts
 *   for the real doorways — never a separate `active` boolean, never a
 *   second judgment.
 * - `warmthLeft/Right/Top/Height` and `returnPaddingTop/returnGap` still
 *   reshape the *same* `ambientWarm` token into the same two compositions
 *   Sprint 22 designed (wide/low/spacious vs. narrow/tall/close) — that
 *   design is unchanged. Only which of the two is selected is now real:
 *   `presence > 0` picks the more present composition, `presence === 0`
 *   ("no-signal" — Atlas genuinely has no data for this company yet, see
 *   `roomData.ts`) picks the quiet one. No new geometry was invented; the
 *   fixed `top: "54%"` safety boundary is untouched, exactly as before.
 *
 * Both companies still share everything else: the Heart, the Awakening,
 * the return mechanism, the stage frame, the base Ambient Company Health
 * field, and the cross-fade transition that brings them into view. That
 * shared skeleton is what keeps this feeling like one world with two
 * places in it, not two different apps.
 *
 * Scaling to more companies later means extending `presenceForDoorway()` in
 * `roomData.ts`, not adding new per-company entries here — there is no
 * per-company table left in this file to extend.
 */

const QUIET_GEOMETRY: {
  warmthLeft: DimensionValue;
  warmthRight: DimensionValue;
  warmthTop: DimensionValue;
  warmthHeight: DimensionValue;
  returnPaddingTop: number;
  returnGap: number;
} = {
  // Selected when a company has no current real signal (`presence === 0`).
  // Wide, low, spacious architecture; generous, slow rhythm around the way
  // back — unchanged from Sprint 22's original "quiet" composition.
  warmthLeft: "8%",
  warmthRight: "8%",
  warmthTop: "12%",
  warmthHeight: "34%",
  returnPaddingTop: 32,
  returnGap: 24,
};

const PRESENT_GEOMETRY: typeof QUIET_GEOMETRY = {
  // Selected whenever a company carries any real current presence
  // (`presence > 0`). Narrower, taller architecture; closer, tighter
  // rhythm — unchanged from Sprint 22's original "active" composition.
  warmthLeft: "30%",
  warmthRight: "30%",
  warmthTop: "6%",
  warmthHeight: "72%",
  returnPaddingTop: 12,
  returnGap: 12,
};

/** The one piece of real-data judgment left in this file: which of the two
 * already-designed compositions above applies. `presence` is always the
 * exact value the company's own Archway Recess already rendered on the
 * wall — this never recomputes or overrides it. */
function interiorGeometry(presence: number): typeof QUIET_GEOMETRY {
  return presence > 0 ? PRESENT_GEOMETRY : QUIET_GEOMETRY;
}

export default function CompanyInterior({
  doorway,
  onExit,
  onSelectHeart,
  presenceLightStyle,
  peripheryStyle,
  heartVitality,
  doorwayPresence,
}: {
  doorway: DoorwayId | null;
  onExit: () => void;
  onSelectHeart: () => void;
  presenceLightStyle: Animated.WithAnimatedValue<ViewStyle>;
  peripheryStyle: Animated.WithAnimatedValue<ViewStyle>;
  /** Sprint 4.2 — the same Heart vitality `RoomScene` computes once and shares with its own
   * Heart instance. This is still "the same Heart, the same point of contact" (see the
   * Sprint 21 correction note above) — it must never show a different condition in here than
   * it does in the Room itself. */
  heartVitality: number;
  /** Sprint 4.2 ("Capability Migration 03") — the identical `DoorwayPresence` `RoomScene`
   * already computed once and passed to the two real Archway Recesses on the wall. This is
   * the only source of company condition this file reads; it never derives its own. */
  doorwayPresence: DoorwayPresence;
}) {
  // `doorway` is only `null` for the instant before any doorway has ever
  // been activated, while this layer is fully transparent and
  // non-interactive (`RoomScene`) — the fallback below never becomes
  // visible on its own. Falling back to the left doorway's presence in that
  // instant matches the pre-existing `"doorway-left"` fallback below.
  const presence = doorway === "doorway-right" ? doorwayPresence.right : doorwayPresence.left;
  const geometry = interiorGeometry(presence);

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View pointerEvents="none" style={styles.ambientCore} />
      <View
        pointerEvents="none"
        style={[
          styles.ambientWarm,
          {
            left: geometry.warmthLeft,
            right: geometry.warmthRight,
            top: geometry.warmthTop,
            height: geometry.warmthHeight,
          },
        ]}
      />

      {/* The same Heart, the same point of contact, the same fixed
          position it holds in The Room — Atlas does not relocate when the
          CEO does, and does not change per company either. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.presenceLight, presenceLightStyle]}
      >
        <View style={[styles.glowRing, styles.glowOuter]} />
        <View style={[styles.glowRing, styles.glowMid]} />
        <View style={[styles.glowRing, styles.glowInner]} />
      </Animated.View>

      <View style={styles.heartLevel} pointerEvents="box-none">
        <Heart onPress={onSelectHeart} vitality={heartVitality} />
      </View>

      <Animated.View
        style={[
          styles.returnLevel,
          peripheryStyle,
          { paddingTop: geometry.returnPaddingTop, gap: geometry.returnGap },
        ]}
        pointerEvents="box-none"
      >
        <ArchwayRecess warmth={presence} onPress={onExit} />
        <Text style={styles.caption}>Terug naar The Room</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },

  ambientCore: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ROOM_COLORS.ambientCore,
  },

  ambientWarm: {
    position: "absolute",
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

  heartLevel: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  // Fixed at "54%" for every company, deliberately outside the per-company
  // identity table — this is the safety boundary from Sprint 21's
  // hit-testing correction (the Heart's own hit area ends here). Only
  // `paddingTop`/`gap` inside this box vary per company.
  returnLevel: {
    position: "absolute",
    top: "54%",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  caption: {
    fontSize: 13,
    color: "rgba(58, 52, 42, 0.6)",
  },
});
