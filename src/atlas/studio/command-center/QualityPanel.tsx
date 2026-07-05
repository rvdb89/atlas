import { StyleSheet, Text, View } from "react-native";

import { STUDIO_COLORS } from "../core/theme";
import CommandCenterCard from "./CommandCenterCard";
import type { CommandCenterPublishingView, CommandCenterQualityView } from "./types";

type QualityPanelProps = {
  quality: CommandCenterQualityView;
  publishing: CommandCenterPublishingView;
};

export default function QualityPanel({ quality, publishing }: QualityPanelProps) {
  return (
    <>
      <CommandCenterCard title="Quality" subtitle="Scores, issues, and content gaps">
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{quality.averageScore}</Text>
          <Text style={styles.scoreSuffix}>/ 100 average</Text>
        </View>
        <Text style={styles.meta}>{`${quality.openIssues} open quality issues`}</Text>
        <Text style={styles.meta}>{`${quality.contentGaps} content gaps detected`}</Text>

        {quality.gapTopics.length > 0 ? (
          <View style={styles.gapWrap}>
            {quality.gapTopics.map((topic) => (
              <View key={topic} style={styles.gapChip}>
                <Text style={styles.gapText}>{topic}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </CommandCenterCard>

      <CommandCenterCard title="Publishing Status" subtitle="Draft pipeline across Atlas Studio">
        <View style={styles.pipelineRow}>
          <PipelineStat label="Draft" value={publishing.draft} />
          <PipelineStat label="Review" value={publishing.review} />
          <PipelineStat label="Published" value={publishing.published} />
          <PipelineStat label="Archived" value={publishing.archived} />
        </View>
      </CommandCenterCard>
    </>
  );
}

function PipelineStat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pipelineStat}>
      <Text style={styles.pipelineValue}>{value}</Text>
      <Text style={styles.pipelineLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },

  score: {
    fontSize: 42,
    fontWeight: "900",
    color: STUDIO_COLORS.accent,
    letterSpacing: -1,
  },

  scoreSuffix: {
    fontSize: 14,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
  },

  gapWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  gapChip: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  gapText: {
    fontSize: 12,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  pipelineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  pipelineStat: {
    width: "47%",
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  pipelineValue: {
    fontSize: 28,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  pipelineLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
