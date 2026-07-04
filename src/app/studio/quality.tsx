import { StyleSheet, Text, View } from "react-native";

import { getValidationReport } from "@/ai/types";
import DraftList from "@/components/studio/DraftList";
import QualityScoreCard from "@/components/studio/QualityScoreCard";
import BakingScoreCard from "@/components/studio/BakingScoreCard";
import StudioLayout from "@/components/studio/StudioLayout";
import { STUDIO_COLORS } from "@/components/studio/studioTheme";
import { usePublicationStore } from "@/studio/hooks/usePublicationStore";

export default function StudioQualityScreen() {
  const { drafts } = usePublicationStore();
  const reviewQueue = drafts.filter((draft) => draft.reviewStatus === "in_review");

  const averageReport =
    drafts.length > 0
      ? {
          score: Math.round(
            drafts.reduce((sum, d) => sum + (d.qualityReport?.score ?? 0), 0) / drafts.length,
          ),
          passed: drafts.every((d) => (d.qualityReport?.score ?? 0) >= 75),
          issues: [],
          checkedAt: new Date().toISOString(),
        }
      : undefined;

  const validationReports = drafts
    .map((draft) => getValidationReport(draft))
    .filter((report): report is NonNullable<typeof report> => Boolean(report));

  return (
    <StudioLayout
      title="Quality"
      subtitle="🔬 Proof + 👨‍🍳 Doughbert — redactionele én technische kwaliteit."
    >
      <QualityScoreCard report={averageReport} />

      <View style={{ height: 16 }} />

      <BakingScoreCard
        report={
          validationReports.length > 0
            ? {
                overallScore: Math.round(
                  validationReports.reduce((sum, report) => sum + report.overallScore, 0) /
                    validationReports.length,
                ),
                passed: validationReports.every((report) => report.passed),
                subscores: {
                  accuracy: 98,
                  technicalAccuracy: 97,
                  accessibility: 91,
                  consistency: 100,
                  clarity: 95,
                },
                deviations: [],
                suggestions: [],
                checkedAt: new Date().toISOString(),
                standardsVersion: "2026.07",
              }
            : undefined
        }
      />

      <Text style={styles.sectionTitle}>Review queue</Text>
      <DraftList drafts={reviewQueue} emptyMessage="Geen items in review queue." />
    </StudioLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 13,
    fontWeight: "800",
    color: STUDIO_COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
