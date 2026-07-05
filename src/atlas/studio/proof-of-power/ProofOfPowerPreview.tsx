import { StyleSheet, Text, View } from "react-native";

import { StudioCard } from "../components";
import { STUDIO_COLORS } from "../core/theme";
import type { ProofOfPowerResult } from "@/atlas/workflows/proof-of-power/types";

type ProofOfPowerPreviewProps = {
  result: ProofOfPowerResult;
};

export default function ProofOfPowerPreview({ result }: ProofOfPowerPreviewProps) {
  const { mockContent, draft, entity } = result;

  return (
    <View>
      <StudioCard title={mockContent.title} subtitle={mockContent.summary}>
        <Text style={styles.body}>{mockContent.body}</Text>
      </StudioCard>

      <View style={styles.scoreRow}>
        <StudioCard compact title="Quality Score">
          <Text style={styles.scoreValue}>{mockContent.qualityScore}</Text>
          <Text style={styles.scoreSuffix}>/ 100</Text>
        </StudioCard>
        <StudioCard compact title="Fact Check">
          <Text style={[styles.factCheck, mockContent.factCheckPassed && styles.passed]}>
            {mockContent.factCheckPassed ? "passed" : "failed"}
          </Text>
          <Text style={styles.factNotes}>{mockContent.factCheckNotes}</Text>
        </StudioCard>
      </View>

      <StudioCard title="Publishing Status">
        <Text style={styles.publishStatus}>{mockContent.publishingStatus}</Text>
        <Text style={styles.meta}>Draft ID · {draft.id}</Text>
        <Text style={styles.meta}>Entity ID · {entity.id}</Text>
      </StudioCard>

      <StudioCard title="Suggested Relations">
        <View style={styles.chipWrap}>
          {mockContent.relations.map((relation) => (
            <View key={relation} style={styles.relationChip}>
              <Text style={styles.relationText}>{relation}</Text>
            </View>
          ))}
        </View>
      </StudioCard>

      <StudioCard title="Visual Plan">
        {mockContent.visualPlan.map((item) => (
          <View key={item.id} style={styles.visualRow}>
            <Text style={styles.visualRole}>{item.role}</Text>
            <Text style={styles.visualLabel}>{item.label}</Text>
            <Text style={styles.visualPrompt}>{item.prompt}</Text>
          </View>
        ))}
      </StudioCard>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: STUDIO_COLORS.brown,
  },

  scoreRow: {
    flexDirection: "row",
    gap: 10,
  },

  scoreValue: {
    fontSize: 40,
    fontWeight: "900",
    color: STUDIO_COLORS.accent,
    letterSpacing: -1,
  },

  scoreSuffix: {
    fontSize: 16,
    fontWeight: "700",
    color: STUDIO_COLORS.secondary,
    marginTop: -4,
  },

  factCheck: {
    fontSize: 22,
    fontWeight: "900",
    color: STUDIO_COLORS.danger,
    textTransform: "uppercase",
  },

  passed: {
    color: STUDIO_COLORS.success,
  },

  factNotes: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },

  publishStatus: {
    fontSize: 20,
    fontWeight: "900",
    color: STUDIO_COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  meta: {
    marginTop: 6,
    fontSize: 13,
    color: STUDIO_COLORS.secondary,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  relationChip: {
    backgroundColor: STUDIO_COLORS.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: STUDIO_COLORS.border,
  },

  relationText: {
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.brown,
  },

  visualRow: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: STUDIO_COLORS.border,
  },

  visualRole: {
    fontSize: 11,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  visualLabel: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.brown,
  },

  visualPrompt: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: STUDIO_COLORS.secondary,
  },
});
