import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PlaceholderOverlay from "./PlaceholderOverlay";
import RoomScene from "./RoomScene";
import { ROOM_COLORS } from "./theme";
import type { RoomObjectId } from "./types";

const PLACEHOLDER_MESSAGE: Record<RoomObjectId, string> = {
  heart: "Atlas conversation will start here.",
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
 */
export default function RoomScreen() {
  const insets = useSafeAreaInsets();
  const [activeObject, setActiveObject] = useState<RoomObjectId | null>(null);

  const handleSelect = useCallback((object: RoomObjectId) => {
    setActiveObject(object);
  }, []);

  const handleClose = useCallback(() => {
    setActiveObject(null);
  }, []);

  const placeholderMessage = useMemo(
    () => (activeObject ? PLACEHOLDER_MESSAGE[activeObject] : null),
    [activeObject],
  );

  return (
    <View style={styles.screen}>
      <RoomScene onSelect={handleSelect} />

      <Pressable
        style={[styles.exit, { top: Math.max(insets.top, 16) }]}
        onPress={() => router.back()}
      >
        <Text style={styles.exitLabel}>← Verlaat The Room</Text>
      </Pressable>

      {placeholderMessage ? (
        <PlaceholderOverlay message={placeholderMessage} onClose={handleClose} />
      ) : null}
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
