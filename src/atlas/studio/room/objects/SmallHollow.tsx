import { Pressable, StyleSheet, View } from "react-native";

import { ROOM_COLORS } from "../theme";

/**
 * Small Hollow — AI Tools, ratified Sprint 12 (`ATLAS_SPRINT_LOG.md`). One
 * closed stone volume with exactly one small, dark aperture; warmth is only
 * visible when capacity is actually being used — never which tool.
 * Prototype 1 renders the resting state (dark aperture, no warmth).
 */
export default function SmallHollow({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.hitArea,
        (hovered || pressed) && styles.hitAreaActive,
      ]}
      accessibilityRole="button"
      accessibilityLabel="AI Tools — Small Hollow"
    >
      <View pointerEvents="none" style={styles.volume}>
        <View style={styles.aperture} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    padding: 8,
    borderRadius: 16,
  },

  hitAreaActive: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
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
