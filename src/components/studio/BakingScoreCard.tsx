import { StyleSheet, Text, View } from "react-native";

import type { DomainValidationReport } from "@/atlas/publishing/types";
import { getTeamMember } from "@/studio/aiTeam";
import { STUDIO_COLORS } from "./studioTheme";

const doughbert = getTeamMember("domain-validator");

type BakingScoreCardProps = {
  report?: DomainValidationReport;
  compact?: boolean;
};

const SUBSCORE_LABELS: Record<keyof DomainValidationReport["subscores"], string> = {
  accuracy: "Wetenschappelijke juistheid",
  technicalAccuracy: "Technische juistheid",
  accessibility: "Beginnersvriendelijkheid",
  consistency: "Consistentie",
  clarity: "Duidelijkheid",
};

export default function BakingScoreCard({ report, compact }: BakingScoreCardProps) {
  if (!report) {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>
          {doughbert.emoji} {doughbert.name}
        </Text>
        <Text style={styles.empty}>Nog niet gevalideerd door {doughbert.name}.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <Text style={styles.label}>
        {doughbert.emoji} {doughbert.name} · Baking Score
      </Text>
      <Text style={styles.role}>{doughbert.role}</Text>
      <Text style={styles.score}>{report.overallScore} / 100</Text>
      <Text style={[styles.status, report.passed ? styles.pass : styles.fail]}>
        {report.passed ? "Technisch goedgekeurd" : "Technische review vereist"}
      </Text>

      {!compact ? (
        <>
          <View style={styles.subscores}>
            {(Object.entries(report.subscores) as [keyof DomainValidationReport["subscores"], number][]).map(
              ([key, value]) => (
                <View key={key} style={styles.subscoreRow}>
                  <Text style={styles.subscoreLabel}>{SUBSCORE_LABELS[key]}</Text>
                  <Text style={styles.subscoreValue}>{value}</Text>
                </View>
              ),
            )}
          </View>

          {report.deviations.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Afwijkingen</Text>
              {report.deviations.slice(0, 5).map((item) => (
                <Text key={item.id} style={styles.deviation}>
                  • {item.message}
                </Text>
              ))}
            </View>
          ) : null}

          {report.suggestions.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Bakcoach · {doughbert.name}</Text>
              {report.suggestions.slice(0, 4).map((item) => (
                <Text key={item.id} style={styles.suggestion}>
                  → {item.message}
                </Text>
              ))}
            </View>
          ) : null}
        </>
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

  empty: {
    marginTop: 8,
    fontSize: 15,
    color: STUDIO_COLORS.secondary,
  },

  subscores: {
    marginTop: 16,
    gap: 8,
  },

  subscoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subscoreLabel: {
    flex: 1,
    fontSize: 14,
    color: STUDIO_COLORS.secondary,
    paddingRight: 8,
  },

  subscoreValue: {
    fontSize: 15,
    fontWeight: "800",
    color: STUDIO_COLORS.accentSoft,
  },

  section: {
    marginTop: 16,
    gap: 6,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
  },

  deviation: {
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.brown,
  },

  suggestion: {
    fontSize: 14,
    lineHeight: 20,
    color: STUDIO_COLORS.accent,
  },
});
