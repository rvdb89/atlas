import { StyleSheet, View } from "react-native";

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
 * same reaction for the quiet doorway and the active one. `active` only
 * ever changes the depth glow, never the touch response.
 */
export default function ArchwayRecess({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <RoomTouchable
      onPress={onPress}
      accessibilityLabel="Company Doorway — Archway Recess"
      hitStyle={styles.hitArea}
    >
      <View pointerEvents="none" style={styles.frame}>
        <View style={styles.depth}>
          <View
            style={[
              styles.glow,
              { opacity: active ? 0.55 : 0 },
            ]}
          />
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
  },
});
