import { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { ROOM_COLORS } from "./theme";
import { useRoomTransition } from "./useRoomTransition";

/**
 * Prototype 1 navigation placeholder. Every object leads somewhere real —
 * this proves the architecture is navigable without inventing what any of
 * those destinations actually contain (`ATLAS BUILD — Prototype 1` brief,
 * §4–7). "Niet definitief."
 *
 * Sprint 15 ("Living Room"): always mounted and controlled by `visible`,
 * so opening and closing is a Soft State Transition instead of an instant
 * mount/unmount. The last message stays on screen while it fades out so
 * the exit animation never shows blank content.
 *
 * Sprint 17: still used for CEO Inbox, AI Tools and both Company Doorways
 * — the Heart now opens `ConversationSpace` instead, which is purpose-built
 * rather than a generic message card.
 */
export default function PlaceholderOverlay({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string | null;
  onClose: () => void;
}) {
  const progress = useRoomTransition(visible);
  const [displayMessage, setDisplayMessage] = useState<string | null>(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
    }
  }, [message]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.backdrop, { opacity: progress }]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View
        style={[
          styles.card,
          {
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.message}>{displayMessage}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeLabel}>Terug naar The Room</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: ROOM_COLORS.backdrop,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  card: {
    maxWidth: 420,
    width: "100%",
    backgroundColor: ROOM_COLORS.wallBase,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 20,
  },

  message: {
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
    color: "#3A342A",
  },

  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: ROOM_COLORS.emberWarm,
  },

  closeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF7EE",
  },
});
