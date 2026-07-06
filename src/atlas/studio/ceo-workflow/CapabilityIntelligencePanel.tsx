import { StyleSheet, Text, View } from "react-native";

import { analyzeCapabilityIntelligence } from "@/atlas/brain/capability/RoadmapIntelligence";
import type { CapabilityIntelligenceSnapshot } from "@/atlas/brain/capability/capability.types";
import { StudioCard } from "../components";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";

type CapabilityIntelligencePanelProps = {
  intelligence?: CapabilityIntelligenceSnapshot;
};

export default function CapabilityIntelligencePanel({
  intelligence: intelligenceInput,
}: CapabilityIntelligencePanelProps) {
  const intelligence = intelligenceInput ?? analyzeCapabilityIntelligence();

  return (
    <StudioCard title="Capability Registry" subtitle="Roadmap intelligence — waar Atlas zwak of sterk is">
      {intelligence.topRecommendation ? (
        <View style={styles.adviceBlock}>
          <Text style={styles.adviceLabel}>Branch Director advies</Text>
          <Text style={styles.adviceText}>{intelligence.topRecommendation.branchDirectorAdvice}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>Aanbevolen volgende initiative</Text>
      <Text style={styles.highlight}>
        {intelligence.topRecommendation
          ? `${intelligence.topRecommendation.missionTitle} (${intelligence.topRecommendation.missionId})`
          : intelligence.answers.whatShouldWeBuildNext}
      </Text>

      <Text style={styles.sectionLabel}>Waar zijn we zwak?</Text>
      <Text style={styles.body}>{intelligence.answers.whereAreWeWeak}</Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Zwakke capabilities</Text>
          {intelligence.weakCapabilities.slice(0, 4).map((item) => (
            <CapabilityRow key={item.id} name={item.name} score={item.maturityScore} tone="weak" />
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>Sterke capabilities</Text>
          {intelligence.strongCapabilities.slice(0, 4).map((item) => (
            <CapabilityRow key={item.id} name={item.name} score={item.maturityScore} tone="strong" />
          ))}
        </View>
      </View>

      <Text style={styles.sectionLabel}>Alle capability scores</Text>
      {intelligence.capabilities.map((item) => (
        <View key={item.id} style={styles.scoreRow}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreName}>{item.name}</Text>
            <Text style={styles.scoreValue}>{Math.round(item.maturityScore * 100)}%</Text>
          </View>
          <View style={styles.scoreTrack}>
            <View
              style={[
                styles.scoreFill,
                {
                  width: `${Math.round(item.maturityScore * 100)}%`,
                  backgroundColor:
                    item.maturityScore >= 0.8 ? STUDIO_COLORS.success : STUDIO_COLORS.warning,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </StudioCard>
  );
}

function CapabilityRow({
  name,
  score,
  tone,
}: {
  name: string;
  score: number;
  tone: "weak" | "strong";
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowName}>{name}</Text>
      <Text style={[styles.rowScore, tone === "weak" ? styles.weak : styles.strong]}>
        {Math.round(score * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  adviceBlock: {
    marginBottom: 16,
    padding: 14,
    borderRadius: STUDIO_RADIUS.input,
    backgroundColor: STUDIO_COLORS.cream,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  adviceLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 8,
  },

  adviceText: {
    fontSize: 15,
    lineHeight: 22,
    color: STUDIO_COLORS.brown,
    fontWeight: "600",
  },

  sectionLabel: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  highlight: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  body: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },

  columns: {
    marginTop: 16,
    gap: 12,
  },

  column: {
    padding: 12,
    borderRadius: STUDIO_RADIUS.input,
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  columnTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  rowName: {
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  rowScore: {
    fontSize: 13,
    fontWeight: "800",
  },

  weak: {
    color: STUDIO_COLORS.warning,
  },

  strong: {
    color: STUDIO_COLORS.success,
  },

  scoreRow: {
    marginTop: 10,
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  scoreName: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  scoreValue: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
  },

  scoreTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: STUDIO_COLORS.cream,
    overflow: "hidden",
  },

  scoreFill: {
    height: 8,
    borderRadius: 999,
  },
});
