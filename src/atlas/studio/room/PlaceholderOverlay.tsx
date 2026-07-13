import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { ROOM_MOTION } from "./motion";
import { ROOM_COLORS } from "./theme";

/**
 * Prototype 1 navigation placeholder. Every object leads somewhere real —
 * this proves the architecture is navigable without inventing what any of
 * those destinations actually contain (`ATLAS BUILD — Prototype 1` brief,
 * §4–7). "Niet definitief."
 *
 * Sprint 15 ("Living Room"): this is now always mounted and controlled by
 * `visible`, so opening and closing a placeholder is a Soft State
 * Transition — the same shared `ROOM_MOTION.TRANSITION` timing as the
 * Room's first entrance — instead of an instant mount/unmount. The last
 * message stays on screen while it fades out so the exit animation never
 * shows blank content.
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
  const progress = useRef(new Animated.Value(0)).current;
  const [displayMessage, setDisplayMessage] = useState<string | null>(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
    }
  }, [message]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: ROOM_MOTION.TRANSITION.duration,
      easing: ROOM_MOTION.TRANSITION.easing,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

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
    backgroundColor: "rgba(33, 29, 24, 0.72)",
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
