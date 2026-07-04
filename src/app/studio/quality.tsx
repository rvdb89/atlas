import { StyleSheet, Text } from "react-native";

import { getValidationReport } from "@/ai/types";
import DraftList from "@/components/studio/DraftList";
import QualityScoreCard from "@/components/studio/QualityScoreCard";
import { getTeamMember } from "@/atlas/agents/team";
import {
  StudioCard,
  StudioScreen,
  StudioSectionTitle,
} from "@/atlas/studio/components";
import { STUDIO_COLORS } from "@/atlas/studio/core/theme";
import { usePublicationStore, useStudioBootstrap, useStudioSettings } from "@/atlas/studio/hooks";

export default function StudioQualityScreen() {
  useStudioBootstrap();
  const { drafts } = usePublicationStore();
  const { settings } = useStudioSettings();
  const reviewQueue = drafts.filter((draft) => draft.reviewStatus === "in_review");
  const validator = getTeamMember("domain-validator");

  const averageReport =
    drafts.length > 0
      ? {
          score: Math.round(
            drafts.reduce((sum, d) => sum + (d.qualityReport?.score ?? 0), 0) / drafts.length,
          ),
          passed: drafts.every((d) => (d.qualityReport?.score ?? 0) >= settings.qualityThreshold),
          issues: [],
          checkedAt: new Date().toISOString(),
        }
      : undefined;

  const validationReports = drafts
    .map((draft) => getValidationReport(draft))
    .filter((report): report is NonNullable<typeof report> => Boolean(report));

  const averageValidation =
    validationReports.length > 0
      ? Math.round(
          validationReports.reduce((sum, report) => sum + report.overallScore, 0) /
            validationReports.length,
        )
      : undefined;

  return (
    <StudioScreen
      title="Quality"
      subtitle="Editorial quality, domain validation scores, and review queue."
    >
      <QualityScoreCard report={averageReport} />

      <StudioCard title={`${validator.emoji} ${validator.name}`} subtitle={validator.role}>
        <Text style={styles.score}>
          {averageValidation !== undefined ? `${averageValidation} / 100` : "Not validated yet"}
        </Text>
        <Text style={styles.hint}>Threshold: {settings.qualityThreshold}/100</Text>
      </StudioCard>

      <StudioSectionTitle>Review queue</StudioSectionTitle>
      <DraftList drafts={reviewQueue} emptyMessage="No items in review queue." />
    </StudioScreen>
  );
}

const styles = StyleSheet.create({
  score: {
    fontSize: 32,
    fontWeight: "900",
    color: STUDIO_COLORS.brown,
  },

  hint: {
    marginTop: 8,
    fontSize: 14,
    color: STUDIO_COLORS.secondary,
  },
});
