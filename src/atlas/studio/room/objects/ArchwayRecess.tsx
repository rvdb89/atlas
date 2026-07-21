import { Animated, StyleSheet, View } from "react-native";

import RoomTouchable from "../RoomTouchable";
import { ROOM_COLORS } from "../theme";

/**
 * Archway Recess — Company Doorways, ratified Sprint 13
 * (`ATLAS_SPRINT_LOG.md`). A carved opening with real depth through the
 * wall plane; warm light visible deep inside when the company is active,
 * cool darkness when quiet. Fixed structure, one judgment-driven property
 * (the depth glow's intensity) — never a button, never a portal effect.
 *
 * Touch feedback is delegated entirely to `RoomTouchable` (Sprint 15) — the
 * same reaction for the quiet doorway and the active one. Neither `active`
 * nor `warmth` ever changes the touch response, only the depth glow.
 *
 * Sprint 23 correction: the `frame`/`depth` carving is real architecture
 * (fixed opening in the wall) and stays visible unconditionally, exactly
 * like before. The `glow`, though, expresses the same "is this company
 * active" judgment the Warm Vein expresses for departments — actual
 * company state, not structure — so it now accepts the same optional
 * `revealOpacity` every other piece of company state on the Room composes
 * with (`RoomScene`'s `revealStyle.opacity`).
 *
 * Sprint 4.2.2 ("Company Doorway Completion"): the one judgment-driven
 * property is now graduated, not binary — `warmth` (0–1, see `roomData.ts`'s
 * `mapCompanyDoorways()`) carries a real company's actual degree of presence,
 * completing what Sprint 13 already called "intensity" rather than replacing
 * it. `active` still works exactly as before (`0` or `MAX_GLOW`) for any
 * caller that doesn't pass `warmth` — that is deliberate, not a compatibility
 * shim: `CompanyInterior.tsx`'s return doorway still uses only `active`, and
 * this sprint does not touch that file. When both are given, `warmth` wins.
 * Either way, the visual ceiling is unchanged: nothing here can glow brighter
 * than the object already did before this sprint.
 */
const MAX_GLOW = 0.55;

export default function ArchwayRecess({
  active = false,
  warmth,
  onPress,
  revealOpacity,
}: {
  active?: boolean;
  warmth?: number;
  onPress: () => void;
  revealOpacity?: Animated.Value | Animated.AnimatedInterpolation<number>;
}) {
  const intensity = (warmth ?? (active ? 1 : 0)) * MAX_GLOW;
  const glowOpacity = revealOpacity ? Animated.multiply(revealOpacity, intensity) : intensity;

  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="Company Doorway — Archway Recess"
      hitStyle={styles.hitArea}
      focusRadius={14}
    >
      <View pointerEvents="none" style={styles.frame}>
        <View style={styles.depth}>
          <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
        </View>
      </View>
    </RoomTouchable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    padding: 6,
    borderRadius: 14,
  },

  frame: {
    width: 46,
    height: 112,
    borderRadius: 10,
    backgroundColor: ROOM_COLORS.wallDeep,
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    padding: 5,
  },

  depth: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: ROOM_COLORS.stoneDark,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  glow: {
    width: "70%",
    height: "55%",
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberWarm,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
});
