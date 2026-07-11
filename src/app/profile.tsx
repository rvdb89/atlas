import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/ScreenLayout";
import { BakeryColors, BakeryFonts } from "@/constants/theme";
import { getPipelineFlowLabel, STUDIO_MISSION } from "@/studio/aiTeam";

export default function ProfileScreen() {
  return (
    <ScreenLayout title="Profiel" backTo="/">
      <View style={styles.panel}>
        <Text style={styles.lead}>
          Jouw Doughbert account en voorkeuren komen binnenkort beschikbaar.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.studioButton, pressed && styles.pressed]}
          onPress={() => router.push("/studio")}
        >
          <Text style={styles.studioEmoji}>✨</Text>
          <View style={styles.studioCopy}>
            <Text style={styles.studioTitle}>Doughbert Studio</Text>
            <Text style={styles.studioSubtitle}>{STUDIO_MISSION}</Text>
            <Text style={styles.studioFlow}>{getPipelineFlowLabel()}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 16,
  },

  lead: {
    fontSize: 16,
    lineHeight: 24,
    color: BakeryColors.textSecondary,
  },

  studioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BakeryColors.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.12)",
    gap: 14,
  },

  pressed: {
    opacity: 0.92,
  },

  studioEmoji: {
    fontSize: 28,
  },

  studioCopy: {
    flex: 1,
    gap: 6,
  },

  studioTitle: {
    fontFamily: BakeryFonts.display,
    fontSize: 19,
    fontWeight: "700",
    color: BakeryColors.brown,
  },

  studioSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: BakeryColors.textSecondary,
  },

  studioFlow: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    color: BakeryColors.orangeAccent,
  },

  arrow: {
    fontSize: 26,
    fontWeight: "700",
    color: BakeryColors.orangeAccent,
  },
});
