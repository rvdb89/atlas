import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  StudioCard,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { useStudioBootstrap, useStudioSettings } from "@/atlas/studio/hooks";
import { studioDataService } from "@/atlas/studio/services/studioDataService";

const STRATEGIES = ["balanced", "quality", "speed", "cost"] as const;
const LANGUAGES = ["nl", "en", "de", "fr"];

export default function StudioSettingsScreen() {
  useStudioBootstrap();
  const { settings, updateSettings } = useStudioSettings();
  const module = studioDataService.getActiveModule();

  return (
    <StudioScreen title="Settings" subtitle="Configure Atlas Studio defaults and AI strategy.">
      <StudioSectionTitle>Active module</StudioSectionTitle>
      <StudioCard>
        <Text style={styles.value}>{module?.name ?? settings.activeModuleId}</Text>
        <Text style={styles.hint}>Currently loaded vertical module for Studio data context.</Text>
      </StudioCard>

      <StudioSectionTitle>AI provider strategy</StudioSectionTitle>
      <View style={styles.row}>
        {STRATEGIES.map((strategy) => (
          <Pressable
            key={strategy}
            style={[styles.option, settings.providerStrategy === strategy && styles.optionActive]}
            onPress={() => updateSettings({ providerStrategy: strategy })}
          >
            <Text style={[styles.optionText, settings.providerStrategy === strategy && styles.optionTextActive]}>
              {strategy}
            </Text>
          </Pressable>
        ))}
      </View>

      <StudioSectionTitle>Language</StudioSectionTitle>
      <View style={styles.row}>
        {LANGUAGES.map((language) => (
          <Pressable
            key={language}
            style={[styles.option, settings.language === language && styles.optionActive]}
            onPress={() => updateSettings({ language })}
          >
            <Text style={[styles.optionText, settings.language === language && styles.optionTextActive]}>
              {language.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <StudioSectionTitle>Quality threshold</StudioSectionTitle>
      <StudioCard>
        <View style={styles.row}>
          {[60, 75, 85, 90].map((threshold) => (
            <Pressable
              key={threshold}
              style={[styles.option, settings.qualityThreshold === threshold && styles.optionActive]}
              onPress={() => updateSettings({ qualityThreshold: threshold })}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.qualityThreshold === threshold && styles.optionTextActive,
                ]}
              >
                {threshold}
              </Text>
            </Pressable>
          ))}
        </View>
      </StudioCard>

      <StudioSectionTitle>Offline mode</StudioSectionTitle>
      <Pressable
        style={[styles.toggle, settings.offlineMode && styles.toggleActive]}
        onPress={() => updateSettings({ offlineMode: !settings.offlineMode })}
      >
        <Text style={[styles.toggleText, settings.offlineMode && styles.toggleTextActive]}>
          {settings.offlineMode ? "Offline mode enabled" : "Offline mode disabled"}
        </Text>
      </Pressable>
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  value: {
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  hint: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  optionActive: {
    backgroundColor: STUDIO_COLORS.brown,
    borderColor: STUDIO_COLORS.brown,
  },

  optionText: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
    textTransform: "capitalize",
  },

  optionTextActive: {
    color: STUDIO_COLORS.warmWhite,
  },

  toggle: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  toggleActive: {
    backgroundColor: STUDIO_COLORS.accent,
    borderColor: STUDIO_COLORS.accent,
  },

  toggleText: {
    fontSize: 15,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  toggleTextActive: {
    color: STUDIO_COLORS.warmWhite,
  },
});
