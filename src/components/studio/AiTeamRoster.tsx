import { StyleSheet, Text, View } from "react-native";

import {
  AI_TEAM,
  EDITOR_IN_CHIEF,
  getPipelineFlowLabel,
  STUDIO_MISSION,
} from "@/studio/aiTeam";
import { STUDIO_COLORS } from "./studioTheme";

type AiTeamRosterProps = {
  compact?: boolean;
};

export default function AiTeamRoster({ compact }: AiTeamRosterProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.mission}>{STUDIO_MISSION}</Text>
      <Text style={styles.flow}>{getPipelineFlowLabel()}</Text>

      <View style={styles.list}>
        {AI_TEAM.map((member) => (
          <View key={member.id} style={[styles.card, compact && styles.cardCompact]}>
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{member.emoji}</Text>
              <View style={styles.cardCopy}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.role}>{member.role}</Text>
              </View>
            </View>
            {!compact ? (
              <Text style={styles.tagline}>{member.tagline}</Text>
            ) : null}
          </View>
        ))}

        <View style={[styles.card, styles.editorCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.emoji}>{EDITOR_IN_CHIEF.emoji}</Text>
            <View style={styles.cardCopy}>
              <Text style={styles.name}>{EDITOR_IN_CHIEF.name}</Text>
              <Text style={styles.role}>{EDITOR_IN_CHIEF.role}</Text>
            </View>
          </View>
          <Text style={styles.tagline}>{EDITOR_IN_CHIEF.tagline}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },

  mission: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.secondary,
  },

  flow: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
  },

  list: {
    gap: 10,
  },

  card: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  cardCompact: {
    paddingVertical: 12,
  },

  editorCard: {
    borderColor: "rgba(184, 95, 29, 0.18)",
    backgroundColor: STUDIO_COLORS.card,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  emoji: {
    fontSize: 26,
  },

  cardCopy: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  role: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
  },

  tagline: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },
});
