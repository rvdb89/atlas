export type AuditRecommendation = "APPROVED" | "APPROVED_WITH_NOTES" | "BLOCKED";

export type AuditRuleCategory =
  | "security"
  | "architecture"
  | "quality"
  | "north-star"
  | "tooling"
  | "definition-of-done"
  | "compliance";

export type AuditWarningSeverity = "low" | "medium" | "high";

export type AuditFindingCategory = AuditRuleCategory;

export type AuditWarning = {
  id: string;
  title: string;
  severity: AuditWarningSeverity;
  category: AuditFindingCategory;
  file: string;
  reason: string;
  impact: string;
  suggestedFix: string;
  blocksRelease: boolean;
};

export type AuditBlocker = {
  id: string;
  title: string;
  severity: "blocker";
  category: AuditFindingCategory;
  file: string;
  reason: string;
  impact: string;
  requiredFix: string;
  blocksRelease: true;
};

export type AuditQualityScores = {
  architecture: number;
  northStar: number;
  security: number;
  maintainability: number;
  testability: number;
  developerExperience: number;
  technicalDebtRisk: number;
  overall: number;
};

export type AuditGitStatus = {
  available: boolean;
  clean: boolean;
  branch?: string;
  changedFiles: string[];
  stagedFiles: string[];
  hasEnvStaged: boolean;
  hasEnvChanged: boolean;
};

export type AuditBuildStatus = {
  typescriptOk: boolean;
  typescriptDetail?: string;
  healthOk: boolean;
  healthDetail?: string;
};

export type AuditHealthCheck = {
  label: string;
  ok: boolean;
  detail?: string;
};

export type AuditFileSnapshot = {
  path: string;
  content: string;
};

export type ArchitectureBrief = {
  sprintId: string;
  sprintTitle: string;
  phase: string;
  goals: string[];
  definitionOfDone: string[];
  architectureRules: string[];
  northStarGoals: string[];
};

export type AuditContextInput = {
  collectedAt?: string;
  atlasVersion: string;
  atlasBuild: string;
  git: AuditGitStatus;
  changedFiles: string[];
  packageScripts: Record<string, string>;
  build: AuditBuildStatus;
  healthChecks: AuditHealthCheck[];
  brief: ArchitectureBrief;
  scannedFiles?: AuditFileSnapshot[];
  strict?: boolean;
};

export type AuditContext = AuditContextInput & {
  scannedFiles: AuditFileSnapshot[];
  strict: boolean;
};

export type DefinitionOfDoneCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail?: string;
};

export type AuditRuleResult = {
  ruleId: string;
  label: string;
  category: AuditRuleCategory;
  passed: boolean;
  message: string;
  warnings: Omit<AuditWarning, "id">[];
  blockers: Omit<AuditBlocker, "id">[];
};

export type AuditReportSection = {
  id: string;
  title: string;
  body: string;
};

export type ReleaseDecisionView = {
  status: AuditRecommendation;
  pushAllowed: boolean;
  reason: string;
  reasons: string[];
  nextActions: string[];
  nextActionSummary: string;
};

export type AuditReport = {
  id: string;
  generatedAt: string;
  sprintId: string;
  sprintTitle: string;
  atlasVersion: string;
  atlasBuild: string;
  strict: boolean;
  recommendation: AuditRecommendation;
  releaseDecision: ReleaseDecisionView;
  warnings: AuditWarning[];
  blockers: AuditBlocker[];
  warningCount: number;
  blockerCount: number;
  passedChecks: number;
  totalChecks: number;
  changedFiles: string[];
  ruleResults: AuditRuleResult[];
  definitionOfDone: DefinitionOfDoneCheck[];
  qualityScores: AuditQualityScores;
  sections: AuditReportSection[];
  technicalDebt: string[];
  nextActions: string[];
  gitSummary: string;
  reportPath: string;
};

export type AuditRule = {
  id: string;
  label: string;
  category: AuditRuleCategory;
  description: string;
  run: (context: AuditContext) => AuditRuleResult;
};

export type AuditRunOptions = {
  reportPath: string;
  strict?: boolean;
};

export type AuditRunResult = {
  ok: boolean;
  report: AuditReport;
};

export type AuditStudioView = {
  lastAuditAt: string;
  recommendation: AuditRecommendation;
  overallScore: number;
  warnings: number;
  blockers: number;
  reportPath: string;
  sprintTitle: string;
  nextAction: string;
};

export type AuditLatestSummary = {
  generatedAt: string;
  sprintTitle: string;
  sprintId: string;
  overallScore: number;
  recommendation: AuditRecommendation;
  warnings: number;
  blockers: number;
  reportPath: string;
  nextAction: string;
};

export type AuditOperationResult<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

export type AuditIndexEntry = {
  date: string;
  sprintName: string;
  score: number;
  recommendation: AuditRecommendation;
  warnings: number;
  blockers: number;
  reportLink: string;
  strict: boolean;
};
