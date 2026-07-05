import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS, STUDIO_RADIUS } from "../../core/theme";

type InspectorPanelProps = {
  title: string;
  children: ReactNode;
};

export default function InspectorPanel({ title, children }: InspectorPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 14,
    marginBottom: 14,
  },

  title: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
});
