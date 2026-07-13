import { Pressable, StyleSheet, Text, View } from "react-native";

import { ROOM_COLORS } from "./theme";

/**
 * Prototype 1 navigation placeholder. Every object leads somewhere real —
 * this proves the architecture is navigable without inventing what any of
 * those destinations actually contain (`ATLAS BUILD — Prototype 1` brief,
 * §4–7). "Niet definitief."
 */
export default function PlaceholderOverlay({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.card}>
        <Text style={styles.message}>{message}</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeLabel}>Terug naar The Room</Text>
        </Pressable>
      </View>
    </View>
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
