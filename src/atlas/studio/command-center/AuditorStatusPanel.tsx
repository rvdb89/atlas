import { StyleSheet, Text, View } from "react-native";

import { getBranchDirectorTerminology } from "@/atlas/constitution";
import type { CommandCenterAuditorView } from "./types";
import { STUDIO_COLORS, STUDIO_RADIUS } from "../core/theme";
import { Metric, StatusBadge } from "../os/design-system";

type AuditorStatusPanelProps = {
  auditor: CommandCenterAuditorView;
};

const TONE: Record<CommandCenterAuditorView["recommendation"], "healthy" | "warning" | "offline"> = {
  APPROVED: "healthy",
  APPROVED_WITH_NOTES: "warning",
  BLOCKED: "offline",
};

export default function AuditorStatusPanel({ auditor }: AuditorStatusPanelProps) {
  const terms = getBranchDirectorTerminology();
  const lastAudit =
    auditor.lastAuditAt === "Not run yet"
      ? auditor.lastAuditAt
      : new Date(auditor.lastAuditAt).toLocaleString();

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{terms.branchDirectorReview}</Text>

      <View style={styles.metrics}>
        <Metric label="Score" value={`${auditor.overallScore}/100`} />
        <Metric label="Recommendation" value={auditor.recommendation} />
        <Metric label="Warnings" value={auditor.warnings} />
        <Metric label="Blockers" value={auditor.blockers} />
      </View>

      <View style={styles.row}>
        <StatusBadge label={auditor.recommendation} tone={TONE[auditor.recommendation]} />
      </View>

      <Text style={styles.section}>Last audit</Text>
      <Text style={styles.copy}>{lastAudit}</Text>
      <Text style={styles.copy}>Sprint · {auditor.sprintTitle}</Text>
      <Text style={styles.copy}>Report · {auditor.reportPath}</Text>

      <Text style={styles.section}>Next action</Text>
      <Text style={styles.copy}>{auditor.nextAction}</Text>
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
