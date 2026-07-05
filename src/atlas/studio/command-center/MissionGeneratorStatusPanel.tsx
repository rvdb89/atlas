import { StyleSheet, Text, View } from "react-native";

import type { CommandCenterMissionGeneratorView } from "./types";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { Metric, StatusBadge } from "../os/design-system";

type MissionGeneratorStatusPanelProps = {
  missionGenerator: CommandCenterMissionGeneratorView;
};

const TONE: Record<CommandCenterMissionGeneratorView["status"], "healthy" | "warning" | "info"> = {
  generated: "healthy",
  idle: "info",
  error: "warning",
};

export default function MissionGeneratorStatusPanel({ missionGenerator }: MissionGeneratorStatusPanelProps) {
  const generatedAt =
    missionGenerator.generatedAt === "Not generated yet"
      ? missionGenerator.generatedAt
      : new Date(missionGenerator.generatedAt).toLocaleString();

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Mission Generator</Text>

      <View style={styles.metrics}>
        <Metric label="Last Mission" value={missionGenerator.lastMission} />
        <Metric label="Template" value={missionGenerator.templateUsed} />
      </View>

      <View style={styles.row}>
        <StatusBadge label={missionGenerator.status} tone={TONE[missionGenerator.status]} />
      </View>

      <Text style={styles.section}>Last generated brief</Text>
      <Text style={styles.copy}>{missionGenerator.lastGeneratedBrief}</Text>
      <Text style={styles.copy}>Generated · {generatedAt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: STUDIO_RADIUS.card,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
    marginBottom: 12,
  },

  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },

  row: {
    marginBottom: 12,
  },

  section: {
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },

  copy: {
    fontSize: 13,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },
});
