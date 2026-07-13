import { StyleSheet, View } from "react-native";

import RoomTouchable from "../RoomTouchable";
import { ROOM_COLORS } from "../theme";

/**
 * Small Hollow — AI Tools, ratified Sprint 12 (`ATLAS_SPRINT_LOG.md`). One
 * closed stone volume with exactly one small, dark aperture; warmth is only
 * visible when capacity is actually being used — never which tool.
 * Prototype 1 renders the resting state (dark aperture, no warmth).
 *
 * Touch feedback is delegated entirely to `RoomTouchable` (Sprint 15).
 */
export default function SmallHollow({ onPress }: { onPress: () => void }) {
  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="AI Tools — Small Hollow"
      hitStyle={styles.hitArea}
    >
      <View pointerEvents="none" style={styles.volume}>
        <View style={styles.aperture} />
      </View>
    </RoomTouchable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    padding: 8,
    borderRadius: 16,
  },

  volume: {
    width: 56,
    height: 44,
    borderRadius: 12,
    backgroundColor: ROOM_COLORS.floorBase,
    alignItems: "center",
    justifyContent: "center",
  },

  aperture: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.stoneDark,
  },
});
