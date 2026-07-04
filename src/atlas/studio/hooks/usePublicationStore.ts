import { useSyncExternalStore } from "react";

import { getValidationReport } from "@/ai/types";
import { publicationStore } from "@/studio/store/publicationStore";

export function usePublicationStore() {
  return useSyncExternalStore(
    publicationStore.subscribe,
    publicationStore.getState,
    publicationStore.getState,
  );
}

export function useStudioStats() {
  const { drafts } = usePublicationStore();

  const validationReports = drafts
    .map((draft) => getValidationReport(draft))
    .filter((report): report is NonNullable<typeof report> => Boolean(report));

  return {
    total: drafts.length,
    inReview: drafts.filter((d) => d.reviewStatus === "in_review").length,
    approved: drafts.filter((d) => d.reviewStatus === "approved").length,
    published: drafts.filter((d) => d.reviewStatus === "published").length,
    averageQuality:
      drafts.length === 0
        ? 0
        : Math.round(
            drafts.reduce((sum, d) => sum + (d.qualityReport?.score ?? 0), 0) / drafts.length,
          ),
    averageValidationScore:
      validationReports.length === 0
        ? 0
        : Math.round(
            validationReports.reduce((sum, report) => sum + report.overallScore, 0) /
              validationReports.length,
          ),
    validationPassedCount: validationReports.filter((report) => report.passed).length,
    /** @deprecated Use averageValidationScore */
    averageBakingScore:
      validationReports.length === 0
        ? 0
        : Math.round(
            validationReports.reduce((sum, report) => sum + report.overallScore, 0) /
              validationReports.length,
          ),
    /** @deprecated Use validationPassedCount */
    testKitchenPassed: validationReports.filter((report) => report.passed).length,
  };
}
