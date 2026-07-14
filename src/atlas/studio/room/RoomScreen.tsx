import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PlaceholderOverlay from "./PlaceholderOverlay";
import RoomScene from "./RoomScene";
import { ROOM_COLORS } from "./theme";
import type { RoomObjectId } from "./types";

type PlaceholderObjectId = Exclude<RoomObjectId, "heart">;

const PLACEHOLDER_MESSAGE: Record<PlaceholderObjectId, string> = {
  inbox: "This is the CEO Inbox. Not definitief — this only proves the object can open a space.",
  tools: "AI Tools view will be built later.",
  "doorway-left": "This company view will be built later.",
  "doorway-right": "This company view will be built later.",
};

/**
 * Atlas Build — Prototype 1: "The Room Becomes Software."
 *
 * The Room Version 1 (`ATLAS_SPRINT_LOG.md`, Sprint 14) made navigable for
 * the first time. No new architecture, objects, behaviors or materialization
 * — every object here is the already-ratified object, now clickable. Every
 * click leads to a placeholder, never a finished destination, per the brief.
 *
 * Sprint 15 ("Living Room") added exactly two things on top, both purely
 * about craftsmanship, never about meaning: overlays are always mounted
 * and driven by `visible` so opening/closing is a Soft State Transition,
 * and every clickable object shares the same `RoomTouchable` reaction (see
 * `motion.ts`, `RoomTouchable.tsx`).
 *
 * Sprint 17 first tried "First Conversation" as an overlay (`ConversationSpace`,
 * still present in the codebase, currently unused). Review found the
 * transition itself still read as software, not as Atlas — so Sprint 18
 * ("The Awakening") replaces that wiring: activating the Heart no longer
 * opens anything. It toggles `approached`, a state of The Room itself,
 * handled entirely inside `RoomScene`. CEO Inbox, AI Tools and both
 * Company Doorways are unchanged — still `PlaceholderOverlay`.
 */
export default function RoomScreen() {
  const insets = useSafeAreaInsets();
  const [approached, setApproached] = useState(false);
  const [activeObject, setActiveObject] = useState<PlaceholderObjectId | null>(null);

  const handleSelect = useCallback((object: RoomObjectId) => {
    if (object === "heart") {
      setApproached((current) => !current);
      return;
    }
    setActiveObject(object);
  }, []);

  const handleClose = useCallback(() => {
    setActiveObject(null);
  }, []);

  const placeholderMessage = activeObject ? PLACEHOLDER_MESSAGE[activeObject] : null;

  return (
    <View style={styles.screen}>
      <RoomScene approached={approached} onSelect={handleSelect} />

      <Pressable
        style={[styles.exit, { top: Math.max(insets.top, 16) }]}
        onPress={() => router.back()}
      >
        <Text style={styles.exitLabel}>← Verlaat The Room</Text>
      </Pressable>

      <PlaceholderOverlay
        visible={activeObject !== null}
        message={placeholderMessage}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ROOM_COLORS.void,
  },

  exit: {
    position: "absolute",
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  exitLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(220, 213, 198, 0.7)",
  },
});
