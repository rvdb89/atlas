import type { ReleaseDecision } from "@/atlas/auditor/ReleaseDecision";

export type CeoWorkflowStageId =
  | "intent"
  | "branch-director-decision"
  | "execution"
  | "branch-director-review"
  | "release-decision"
  | "ceo-approval"
  | "publish"
  | "confirmation"
  | "branch-director-debrief"
  | "ceo-continue-decision";

export type CeoWorkflowStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "awaiting";

export type CeoWorkflowStep = {
  id: CeoWorkflowStageId;
  label: string;
  status: CeoWorkflowStepStatus;
  summary: string;
  details: string[];
  error?: string;
};

export type CeoWorkflowDecisionSummary = {
  recommendedInitiativeId: string | null;
  recommendedInitiativeTitle: string | null;
  nextBestInitiativeId: string | null;
  nextBestInitiativeTitle: string | null;
  priorityScore: number;
  northStarAligned: boolean;
  northStarScore: number;
  why: string;
  branchDirectorAdvice: string;
  executionPackageRequired: boolean;
  departmentAssignments: Array<{ departmentName: string; role: string }>;
};

export type CeoWorkflowAuditSummary = {
  recommendation: string;
  score: number;
  blockerCount: number;
  warningCount: number;
  blockers: Array<{ title: string; reason: string }>;
  warnings: Array<{ title: string; reason: string }>;
};

export type CeoWorkflowReleaseImpact = {
  branch: string;
  changedFiles: string[];
  atlasChangedFiles: string[];
  suggestedCommitMessage: string;
  version: string;
  build: string;
  missionId: string | null;
  fileCount: number;
};

export type CeoWorkflowConfirmation = {
  publishedAt: string;
  commitSha: string | null;
  remoteVerified: boolean;
  reportPath: string;
  pushOutput: string;
};

export type CeoAdjustOptionId =
  | "adjust-roadmap"
  | "change-priority"
  | "improve-current"
  | "follow-up-initiative"
  | "pause-execution";

export type CeoAdjustOption = {
  id: CeoAdjustOptionId;
  label: string;
  description: string;
};

export type BranchDirectorDebrief = {
  initiativeId: string | null;
  initiativeTitle: string | null;
  statusLabel: string;
  reviewResult: string;
  blockerCount: number;
  warningCount: number;
  blockers: Array<{ title: string; reason: string }>;
  warnings: Array<{ title: string; reason: string }>;
  readyToContinue: boolean;
  recommendedNextInitiativeId: string | null;
  recommendedNextInitiativeTitle: string | null;
  headline: string;
  summary: string;
  question: string;
  ceoDecision?: "continue" | "adjust";
  selectedAdjustOption?: CeoAdjustOptionId;
  adjustFeedback?: string;
};

export type CeoWorkflowStatus =
  | "idle"
  | "running"
  | "awaiting_ceo_approval"
  | "publishing"
  | "awaiting_ceo_debrief"
  | "continuing"
  | "paused"
  | "completed"
  | "failed"
  | "blocked";

export type CeoWorkflowState = {
  id: string;
  intent: string;
  status: CeoWorkflowStatus;
  steps: CeoWorkflowStep[];
  decision?: CeoWorkflowDecisionSummary;
  auditSummary?: CeoWorkflowAuditSummary;
  releaseDecision?: ReleaseDecision;
  auditReportPath?: string;
  impact?: CeoWorkflowReleaseImpact;
  confirmation?: CeoWorkflowConfirmation;
  debrief?: BranchDirectorDebrief;
  adjustOptions?: CeoAdjustOption[];
  continueConfirmation?: string;
  error?: string;
  updatedAt: string;
};

export type CeoWorkflowRunRequest = {
  intent: string;
};

export type CeoWorkflowApproveRequest = {
  commitMessage?: string;
};

export type CeoDebriefContinueRequest = Record<string, never>;

export type CeoDebriefAdjustRequest = {
  option: CeoAdjustOptionId;
  feedback?: string;
};
