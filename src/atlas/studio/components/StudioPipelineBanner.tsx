import { StyleSheet, Text, View } from "react-native";

import { getPipelineFlowLabel } from "@/atlas/agents/team";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";

export default function StudioPipelineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.label}>Publishing pipeline</Text>
      <Text style={styles.flow}>{getPipelineFlowLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    padding: 16,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  flow: {
    fontSize: 14,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
    fontWeight: "600",
  },
});
