/** Computed company state — read-only output of the Company State Engine. */

import type {
  ActivityEventType,
  AgentStatus,
  ApprovalCategory,
  ApprovalStatus,
  ApprovalUrgency,
  BugSeverity,
  BugStatus,
  DepartmentId,
  EntityStatus,
  InitiativeLane,
  NeedsChangeOptionId,
  RecommendationDecision,
  SprintLifecycle,
  WorkloadLevel,
} from "./businessModels.types";

export type OverallStatus = "healthy" | "attention" | "blocked";

export type KpiTrend = "up" | "down" | "flat";

export type KpiStatus = "healthy" | "attention" | "critical";

export type CompanyRecommendation = {
  headline: string;
  recommendation: string;
  rationale: string;
  confidence: number;
  relatedInitiativeId?: string;
  decision: RecommendationDecision;
  packagePath?: string;
  packageIsNew?: boolean;
};

export type CompanyBusinessState = {
  id: string;
  name: string;
  health: number;
  status: EntityStatus;
  statusLabel: string;
  currentFocus: string;
  activeSprint: string;
  roadmapProgress: number;
  openBugs: number;
  nextRecommendation: string;
  marketingStatus: string;
  productIds: string[];
};

export type CompanyAppState = {
  id: string;
  name: string;
  businessId: string;
  status: EntityStatus;
  statusLabel: string;
  version: string;
  health: number;
  lastRelease: string;
  currentInitiative: string;
};

export type CompanyAgentState = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  health: number;
  workload: WorkloadLevel;
  currentInitiative: string;
  currentResponsibility: string;
  /** Sprint 2.2a · null for an agent with no ratified department (currently only
   * branch-director). Mirrors AgentModel.department — see its comment for why. */
  department: DepartmentId | null;
};

export type CompanyDepartmentState = {
  id: DepartmentId;
  label: string;
  health: number;
  status: EntityStatus;
  statusLabel: string;
  currentWork: string;
  owner: string;
};

export type CompanySprintState = {
  id: string;
  name: string;
  businessId: string | null;
  progress: number;
  lifecycle: SprintLifecycle;
  status: EntityStatus;
  statusLabel: string;
};

export type CompanyInitiativeState = {
  id: string;
  title: string;
  lane: InitiativeLane;
  priority: number;
  businessValue: string;
  northStarContribution: string;
  owner: string;
  progress: number;
};

export type CompanyApprovalState = {
  id: string;
  title: string;
  category: ApprovalCategory;
  urgency: ApprovalUrgency;
  reason: string;
  recommendation: string;
  status: ApprovalStatus;
  confirmationMessage?: string;
  selectedChangeOption?: NeedsChangeOptionId;
  changeNote?: string;
  applyWarning?: string;
};

export type CompanyPlatformState = {
  health: number;
  statusLabel: string;
  latestReviewLabel: string;
  studioLabel: string;
  appLabel: string;
  apiLabel: string;
  providersLabel: string;
  reviewsLabel: string;
};

export type CompanyMemoryState = {
  health: number;
  statusLabel: string;
  lastUpdated: string;
  /** BRAIN-002b · Mirrors MemoryModel.recent — see businessModels.types.ts for why the
   * shape is hand-duplicated instead of imported. */
  recent: Array<{
    id: string;
    type: string;
    title: string;
    summary: string;
    tags: string[];
    importance: number;
    source: string;
    updatedAt: string;
  }>;
};

export type CompanyLivePlanStepState = {
  id: string;
  order: number;
  kind: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
};

/** Context/Planner integration (2026-07-11) · Mirrors LivePlanModel — see its comment in
 * businessModels.types.ts. null when no plan is currently registered for the focused mission. */
export type CompanyLivePlanState = {
  id: string;
  missionId?: string;
  goal: string;
  status: "draft" | "ready" | "executing" | "completed" | "failed" | "cancelled";
  steps: CompanyLivePlanStepState[];
  createdAt: string;
  updatedAt: string;
};

export type CompanyBugState = {
  id: string;
  title: string;
  severity: BugSeverity;
  impact: string;
  owner: string;
  recommendation: string;
  expectedFix: string;
  status: BugStatus;
};

export type CompanyBlockerState = {
  id: string;
  title: string;
  area: string;
  owner: string;
};

export type CompanyKpiState = {
  id: string;
  label: string;
  value: string;
  trend: KpiTrend;
  status: KpiStatus;
};

export type CompanyActivityState = {
  id: string;
  type: ActivityEventType;
  message: string;
  occurredAt: string;
};

export type CompanyCeoCommandState = {
  greeting: string;
  companyHealthScore: number;
  todayAdvice: string;
  recommendation: string;
  reason: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  confirmationMessage?: string;
};

/** Complete computed company state — single source of truth for readers. */
export type CompanyState = {
  companyName: string;
  companyHealth: number;
  overallStatus: OverallStatus;
  northStarAlignment: number;
  recommendation: CompanyRecommendation;
  generatedAt: string;
  ceoCommand: CompanyCeoCommandState;
  businesses: CompanyBusinessState[];
  apps: CompanyAppState[];
  departments: CompanyDepartmentState[];
  agents: CompanyAgentState[];
  initiatives: CompanyInitiativeState[];
  sprints: CompanySprintState[];
  roadmap: CompanyInitiativeState[];
  approvals: CompanyApprovalState[];
  platform: CompanyPlatformState;
  memory: CompanyMemoryState;
  bugs: CompanyBugState[];
  blockers: CompanyBlockerState[];
  kpis: CompanyKpiState[];
  activity: CompanyActivityState[];
  livePlan: CompanyLivePlanState | null;
};

export type CompanyStateSource = "mock" | "live";

export type CompanyStateResult = {
  source: CompanyStateSource;
  state: CompanyState;
};
