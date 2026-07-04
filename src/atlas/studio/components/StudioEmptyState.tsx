import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../core/theme";

export default function StudioEmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },
});
