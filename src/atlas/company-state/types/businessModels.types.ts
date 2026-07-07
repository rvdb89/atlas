/** Raw business models — mutable source data for the Company State Engine. */

export type EntityStatus = "healthy" | "attention" | "critical" | "idle" | "active" | "pending" | "planning";

export type AgentStatus = "active" | "idle" | "blocked" | "waiting";

export type WorkloadLevel = "light" | "balanced" | "heavy" | "overloaded";

export type SprintLifecycle = "running" | "completed" | "blocked" | "waiting_approval";

export type BugSeverity = "critical" | "high" | "medium" | "low";

export type BugStatus = "open" | "watching" | "resolved";

export type ApprovalStatus = "pending" | "approved" | "needs_changes" | "deferred";

export type ApprovalCategory =
  | "sprint_approval"
  | "roadmap_decision"
  | "new_business"
  | "new_app"
  | "marketing"
  | "memory_upgrade"
  | "architecture";

export type ApprovalUrgency = "low" | "medium" | "high" | "urgent";

export type InitiativeLane = "now" | "next" | "later" | "blocked";

export type DepartmentId =
  | "engineering"
  | "operations"
  | "marketing"
  | "design"
  | "product"
  | "intelligence"
  | "memory"
  | "quality"
  | "planning"
  | "research";

export type ActivityEventType =
  | "sprint_started"
  | "sprint_completed"
  | "approval_received"
  | "release_published"
  | "memory_updated"
  | "agent_promoted"
  | "app_deployed";

export type RecommendationDecision = "pending" | "approved" | "deferred";

export type NeedsChangeOptionId =
  | "fix-bug"
  | "adjust-design"
  | "adjust-roadmap"
  | "change-priority";

export type BusinessModel = {
  id: string;
  name: string;
  health: number;
  status: EntityStatus;
  currentFocus: string;
  activeSprintId: string | null;
  roadmapProgress: number;
  openBugs: number;
  nextRecommendation: string;
  marketingStatus: string;
  productIds: string[];
};

export type AppModel = {
  id: string;
  name: string;
  businessId: string;
  status: EntityStatus;
  version: string;
  health: number;
  lastRelease: string;
  currentInitiative: string;
};

export type AgentModel = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  health: number;
  workload: WorkloadLevel;
  currentInitiative: string;
  currentResponsibility: string;
  department: DepartmentId;
};

export type DepartmentModel = {
  id: DepartmentId;
  health: number;
  status: EntityStatus;
  currentWork: string;
  owner: string;
};

export type SprintModel = {
  id: string;
  name: string;
  businessId: string | null;
  progress: number;
  lifecycle: SprintLifecycle;
};

export type InitiativeModel = {
  id: string;
  title: string;
  lane: InitiativeLane;
  priority: number;
  businessValue: string;
  northStarContribution: string;
  owner: string;
  progress: number;
};

export type RoadmapModel = InitiativeModel;

export type ApprovalModel = {
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
};

export type PlatformModel = {
  studioHealth: number;
  appHealth: number;
  apiHealth: number;
  providersHealth: number;
  reviewsHealth: number;
  statusLabel: string;
  latestReviewLabel: string;
};

export type MemoryModel = {
  health: number;
  statusLabel: string;
  lastUpdated: string;
};

export type BugModel = {
  id: string;
  title: string;
  severity: BugSeverity;
  impact: string;
  owner: string;
  recommendation: string;
  expectedFix: string;
  status: BugStatus;
};

export type BlockerModel = {
  id: string;
  title: string;
  area: string;
  owner: string;
};

export type ActivityModel = {
  id: string;
  type: ActivityEventType;
  message: string;
  occurredAt: string;
};

export type RecommendationModel = {
  headline: string;
  recommendation: string;
  rationale: string;
  confidence: number;
  relatedInitiativeId?: string;
  decision: RecommendationDecision;
};

export type DecisionFeedbackModel = {
  ceoCommandConfirmation?: string;
};

/** Mutable company models — single write surface before live engines plug in. */
export type CompanyModels = {
  companyName: string;
  businesses: BusinessModel[];
  apps: AppModel[];
  departments: DepartmentModel[];
  agents: AgentModel[];
  initiatives: InitiativeModel[];
  sprints: SprintModel[];
  roadmap: RoadmapModel[];
  approvals: ApprovalModel[];
  platform: PlatformModel;
  memory: MemoryModel;
  bugs: BugModel[];
  blockers: BlockerModel[];
  activity: ActivityModel[];
  recommendation: RecommendationModel;
  decisionFeedback: DecisionFeedbackModel;
};
