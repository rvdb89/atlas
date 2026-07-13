import { Pressable, StyleSheet, View } from "react-native";

import { ROOM_COLORS } from "../theme";

/**
 * The Heart — randloos, gloeiend, geen silhouet dat als icoon leest
 * (`ATLAS_SPRINT_LOG.md`, Sprint 5 materialiteit §3). Rendered as layered,
 * flat-opacity circles of increasing size and decreasing intensity, never a
 * single hard-edged shape — there is no border to isolate it as an icon.
 *
 * The hover state below is a dev-only affordance (see `ATLAS_BACKLOG.md`
 * convention: not part of the Rendering Law, purely to make interaction
 * technically discoverable in Prototype 1).
 */
export default function Heart({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.hitArea,
        // Dev-only hover/press affordance — not a Rendering Law expression.
        (hovered || pressed) && styles.hitAreaActive,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Heart — Atlas"
    >
      <View pointerEvents="none" style={styles.wrap}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={[styles.ring, styles.ringCore]} />
      </View>
    </Pressable>
  );
}

const CORE = 34;
const MID = 64;
const OUTER = 104;

const styles = StyleSheet.create({
  hitArea: {
    width: OUTER + 24,
    height: OUTER + 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },

  hitAreaActive: {
    // Subtle, purely functional — proves the object is reachable.
    backgroundColor: "rgba(244, 182, 122, 0.06)",
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
