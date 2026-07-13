import { StyleSheet, View } from "react-native";

import RoomTouchable from "../RoomTouchable";
import { ROOM_COLORS } from "../theme";

/**
 * Threshold Stone — CEO Inbox, ratified Sprint 11 (`ATLAS_SPRINT_LOG.md`).
 * A flush floor inlay: a permanent structural seam (architecture, never
 * changes) plus one warmth intensity (the only expression of "something is
 * waiting"). Prototype 1 renders the resting state — dof, per Sprint 14's
 * composition — since there is no real inbox signal wired up yet.
 *
 * Touch feedback is delegated entirely to `RoomTouchable` (Sprint 15).
 */
export default function ThresholdStone({ onPress }: { onPress: () => void }) {
  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="CEO Inbox — Threshold Stone"
      hitStyle={styles.hitArea}
    >
      <View pointerEvents="none" style={styles.stone}>
        <View style={styles.seam} />
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
});
