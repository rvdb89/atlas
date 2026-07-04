import { StyleSheet, Text, View } from "react-native";

import type { QualityReport } from "@/ai/types";
import { getTeamMember } from "@/studio/aiTeam";
import { STUDIO_COLORS } from "./studioTheme";

const proof = getTeamMember("fact-checker");

type QualityScoreCardProps = {
  report?: QualityReport;
  compact?: boolean;
};

export default function QualityScoreCard({ report, compact }: QualityScoreCardProps) {
  const score = report?.score ?? 0;
  const passed = report?.passed ?? false;

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <Text style={styles.label}>
        {proof.emoji} {proof.name} · Quality Score
      </Text>
      <Text style={styles.role}>{proof.role}</Text>
      <Text style={styles.score}>{score} / 100</Text>
      <Text style={[styles.status, passed ? styles.pass : styles.fail]}>
        {passed ? "Klaar voor review" : "Verbetering nodig"}
      </Text>

      {!compact && report && report.issues.length > 0 ? (
        <View style={styles.issues}>
          {report.issues.slice(0, 4).map((issue) => (
            <Text key={issue.id} style={styles.issue}>
              • {issue.message}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: STUDIO_COLORS.warmWhite,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(184, 107, 56, 0.08)",
  },

  compact: {
    padding: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  role: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: STUDIO_COLORS.accentSoft,
  },

  score: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  status: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
  },

  pass: {
    color: STUDIO_COLORS.success,
  },

  fail: {
    color: STUDIO_COLORS.warning,
  },

  issues: {
    marginTop: 14,
    gap: 6,
  },

  issue: {
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.secondary,
  },
});
