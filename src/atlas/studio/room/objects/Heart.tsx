import { StyleSheet, View } from "react-native";

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
 */
export default function Heart({ onPress }: { onPress: () => void }) {
  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="Heart — Atlas"
      hitStyle={styles.hitArea}
      focusRadius={999}
    >
      <View pointerEvents="none" style={styles.wrap}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={[styles.ring, styles.ringCore]} />
      </View>
    </RoomTouchable>
  );
}

const CORE = 34;
const MID = 64;
const OUTER = 104;

const styles = StyleSheet.create({
  hitArea: {
    width: OUTER + 24,
    height: OUTER + 24,
    borderRadius: 999,
  },

  wrap: {
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
    opacity: 0.16,
  },

  ringMid: {
    width: MID,
    height: MID,
    backgroundColor: ROOM_COLORS.emberWarm,
    opacity: 0.32,
  },

  ringCore: {
    width: CORE,
    height: CORE,
    backgroundColor: ROOM_COLORS.emberCore,
    opacity: 0.9,
  },
});
