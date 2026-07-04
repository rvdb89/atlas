import { StyleSheet, Text } from "react-native";

import { STUDIO_COLORS } from "../core/theme";

export default function StudioSectionTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
