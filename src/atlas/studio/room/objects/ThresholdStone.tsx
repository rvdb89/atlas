import { StyleSheet, View } from "react-native";

import RoomTouchable from "../RoomTouchable";
import { ROOM_COLORS } from "../theme";

/**
 * Threshold Stone — CEO Focus, ratified Sprint 11 (`ATLAS_SPRINT_LOG.md`) as "CEO Inbox". A
 * flush floor inlay: a permanent structural seam (architecture, never changes) plus one
 * warmth intensity — the only expression of "something is waiting."
 *
 * Sprint 2.2 ("The Room — First Living Prototype") wires that warmth to a real signal for
 * the first time: `warmth` is the highest urgency among whatever Atlas Control's real CEO
 * Inbox currently surfaces (`roomData.ts`'s `selectCeoFocus()`), 0 when nothing does. The
 * seam itself never changes — only how much ember warmth sits over it, the exact same
 * Vein / Warm Vein relationship Department Wall already uses, applied here to a single
 * object instead of four. At `warmth === 0` no warm layer renders at all, so idle Threshold
 * Stone reads as calm, not merely "warmth turned down."
 *
 * Touch feedback is delegated entirely to `RoomTouchable` (Sprint 15).
 */
export default function ThresholdStone({
  onPress,
  warmth = 0,
}: {
  onPress: () => void;
  warmth?: number;
}) {
  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="CEO Focus — Threshold Stone"
      hitStyle={styles.hitArea}
    >
      <View pointerEvents="none" style={styles.stone}>
        <View style={styles.seam} />
        {warmth > 0 && <View style={[styles.warmSeam, { opacity: warmth * 0.6 }]} />}
      </View>
    </RoomTouchable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    padding: 8,
    borderRadius: 16,
  },

  stone: {
    width: 92,
    height: 40,
    borderRadius: 8,
    backgroundColor: ROOM_COLORS.floorMid,
    borderWidth: 1,
    borderColor: ROOM_COLORS.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  seam: {
    width: "84%",
    height: "72%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ROOM_COLORS.floorDeep,
    opacity: 0.5,
  },

  warmSeam: {
    position: "absolute",
    width: "84%",
    height: "72%",
    borderRadius: 6,
    backgroundColor: ROOM_COLORS.emberWarm,
    shadowColor: ROOM_COLORS.emberWarm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
});
