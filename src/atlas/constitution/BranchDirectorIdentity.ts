export const BRANCH_DIRECTOR_IDENTITY_ID = "ATLAS-003";

export type BranchDirectorIdentityDefinition = {
  id: string;
  title: string;
  version: string;
  role: string;
  terminology: BranchDirectorTerminology;
  languageRules: string[];
};

export type BranchDirectorTerminology = {
  branchDirectorReview: string;
  branchDirectorReleaseDecision: string;
  missionExecuted: string;
  executionPackage: string;
  executionPackages: string;
  recommendedNextInitiative: string;
  nextBestInitiative: string;
  executionPackageGenerated: string;
  verifiedByReview: string;
  reportFooterLabel: string;
  cliReviewBanner: string;
  missionGeneratorTitle: string;
  lastInitiativeLabel: string;
  noExecutionPackageRequired: string;
  startRecommendedNextInitiative: string;
  createFollowUpInitiative: string;
  hierarchyReviewLabel: string;
  hierarchyExecutionPackageLabel: string;
  branchDirectorReportIntro: string;
};

export const BRANCH_DIRECTOR_TERMINOLOGY: BranchDirectorTerminology = {
  branchDirectorReview: "Branch Director Review",
  branchDirectorReleaseDecision: "Branch Director Release Decision",
  missionExecuted: "Mission Executed",
  executionPackage: "Execution Package",
  executionPackages: "Execution Packages",
  recommendedNextInitiative: "Recommended Next Initiative",
  nextBestInitiative: "Recommended Next Initiative",
  executionPackageGenerated: "Execution Package generated",
  verifiedByReview: "Verified by Branch Director Review",
  reportFooterLabel: "Branch Director Review",
  cliReviewBanner: "Branch Director Review",
  missionGeneratorTitle: "Initiative Generator",
  lastInitiativeLabel: "Last Initiative",
  noExecutionPackageRequired: "No Execution Package required",
  startRecommendedNextInitiative: "Start recommended next initiative",
  createFollowUpInitiative: "Create follow-up initiative",
  hierarchyReviewLabel: "Branch Director Review",
  hierarchyExecutionPackageLabel: "Execution Packages",
  branchDirectorReportIntro:
    "Atlas communicates as Branch Director of the Robbert AI Organization — operational leadership, not engineering tooling.",
};

export const BRANCH_DIRECTOR_IDENTITY: BranchDirectorIdentityDefinition = {
  id: BRANCH_DIRECTOR_IDENTITY_ID,
  title: "Branch Director Identity",
  version: "1.0.0",
  role: "Branch Director (Vestigingsdirecteur) of the Robbert AI Organization",
  terminology: BRANCH_DIRECTOR_TERMINOLOGY,
  languageRules: [
    "Atlas Auditor → Branch Director Review",
    "Release Decision → Branch Director Release Decision",
    "Mission Complete → Mission Executed",
    "Engineering Package → Execution Package",
    "Next Mission → Recommended Next Initiative",
    "User-facing UI, CLI, and reports use organizational language",
    "Internal module paths and npm scripts may retain technical names",
  ],
};

export function getBranchDirectorIdentity(): BranchDirectorIdentityDefinition {
  return BRANCH_DIRECTOR_IDENTITY;
}

export function getBranchDirectorTerminology(): BranchDirectorTerminology {
  return BRANCH_DIRECTOR_TERMINOLOGY;
}

export function applyBranchDirectorLanguage(text: string): string {
  const terms = BRANCH_DIRECTOR_TERMINOLOGY;

  return text
    .replace(/Atlas Auditor/g, terms.branchDirectorReview)
    .replace(/Release Decision/g, terms.branchDirectorReleaseDecision)
    .replace(/Mission Complete/g, terms.missionExecuted)
    .replace(/Engineering Packages/g, terms.executionPackages)
    .replace(/Engineering Package/g, terms.executionPackage)
    .replace(/Next best mission/gi, terms.nextBestInitiative)
    .replace(/Next Mission/g, terms.recommendedNextInitiative)
    .replace(/Start next mission/gi, terms.startRecommendedNextInitiative)
    .replace(/follow-up mission/gi, terms.createFollowUpInitiative.replace("Create ", "follow-up "));
}
