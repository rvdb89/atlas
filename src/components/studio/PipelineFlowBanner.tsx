import { StyleSheet, Text, View } from "react-native";

import { getPipelineFlowLabel } from "@/studio/aiTeam";
import { STUDIO_COLORS } from "./studioTheme";

export default function PipelineFlowBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.label}>AI Team workflow</Text>
      <Text style={styles.flow}>{getPipelineFlowLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  flow: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },
});
