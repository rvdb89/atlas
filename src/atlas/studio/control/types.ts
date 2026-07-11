/** Atlas Control — CEO Operating System information architecture (CONTROL-005). */

export type ControlStatus = "healthy" | "attention" | "critical" | "idle" | "active" | "pending" | "planning";

export type ManagementStatus = "active" | "idle" | "blocked" | "waiting";

export type IssueSeverity = "critical" | "high" | "medium" | "low";

export type IssueStatus = "open" | "watching" | "resolved";

export type InboxDecisionStatus = "pending" | "approved" | "needs_changes" | "deferred";

export type InboxUrgency = "low" | "medium" | "high" | "urgent";

export type AdviceDecision = "pending" | "approved" | "deferred";

export type InitiativeLane = "now" | "next" | "later" | "blocked";

export type KpiTrend = "up" | "down" | "flat";

export type KpiStatus = "healthy" | "attention" | "critical";

export type WorkloadLevel = "light" | "balanced" | "heavy" | "overloaded";

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

export type InboxCategory =
  | "sprint_approval"
  | "roadmap_decision"
  | "new_business"
  | "new_app"
  | "marketing"
  | "memory_upgrade"
  | "architecture";

export type ActivityEventType =
  | "sprint_started"
  | "sprint_completed"
  | "approval_received"
  | "release_published"
  | "memory_updated"
  | "agent_promoted"
  | "app_deployed"
  | "atlas_decision";

export type NeedsChangeOptionId =
  | "fix-bug"
  | "adjust-design"
  | "adjust-roadmap"
  | "change-priority";

/** Section 1 — CEO Command */
export type CeoCommand = {
  greeting: string;
  companyHealthScore: number;
  todayAdvice: string;
  recommendation: string;
  reason: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  confirmationMessage?: string;
};

/** Section 2 — CEO Inbox */
export type CeoInboxItem = {
  id: string;
  title: string;
  category: InboxCategory;
  urgency: InboxUrgency;
  reason: string;
  recommendation: string;
  status: InboxDecisionStatus;
  confirmationMessage?: string;
  selectedChangeOption?: NeedsChangeOptionId;
  changeNote?: string;
  /** Set when this was approved but never actually reached the working tree — see
   * ApprovalModel.applyWarning for the full story. Keeps this item visible under "Needs
   * attention" instead of silently disappearing once approved. */
  applyWarning?: string;
};

/** Section 2b — Geschiedenis: every mission Atlas has actually applied so far, read
 * straight from disk (engineering/packages/<ID>/applied-<timestamp>/). Read-only —
 * unlike CeoInboxItem, nothing here is pending a decision. */
export type AppliedMissionFile = {
  path: string;
  action: "create" | "modify";
  reason: string;
};

/** EXEC-002 · Automatic post-apply typecheck + commit-prep result — null for older
 * applied-* entries recorded before this existed, or if the validation step itself failed
 * (best-effort, never blocks an apply). */
export type AppliedMissionValidation = {
  typecheckOk: boolean;
  typecheckSummary: string;
  /** EXEC-003 · real node:test suite result (tsx --test), null for applied-* entries
   * recorded before EXEC-003 existed. */
  testsOk?: boolean;
  testSummary?: string;
  suggestedCommitMessage: string;
  staged: boolean;
  stageNote: string;
};

export type AppliedMissionRecord = {
  missionId: string;
  title: string;
  appliedAt: string;
  summary: string;
  files: AppliedMissionFile[];
  fileCount: number;
  risks: string[];
  followUp: string;
  validation: AppliedMissionValidation | null;
};

/** Section 3 — Company Overview (businesses) */
export type BusinessOverview = {
  id: string;
  name: string;
  status: ControlStatus;
  statusLabel: string;
  currentSprint: string;
  openBugs: number;
  roadmapProgress: number;
  marketingStatus: string;
  productIds: string[];
};

/** Section 3 — Products / Apps under Robbert AI */
export type ProductOverview = {
  id: string;
  name: string;
  businessId: string;
  status: ControlStatus;
  statusLabel: string;
};

/** Section 4 — Management Team (executives, not agents) */
export type ManagementMember = {
  id: string;
  name: string;
  title: string;
  department: DepartmentId;
  status: ManagementStatus;
  currentResponsibility: string;
  currentInitiative: string;
  healthScore: number;
  workload: WorkloadLevel;
};

/** Section 5 — Company KPIs */
export type CompanyKpi = {
  id: string;
  label: string;
  value: string;
  trend: KpiTrend;
  status: KpiStatus;
};

/** Section 6 — Roadmap */
export type RoadmapInitiative = {
  id: string;
  title: string;
  lane: InitiativeLane;
  priority: number;
  businessValue: string;
  northStarContribution: string;
  owner: string;
  progress: number;
};

/** Active sprints across the company */
export type ActiveSprint = {
  id: string;
  name: string;
  businessId?: string;
  progress: number;
  status: ControlStatus;
  statusLabel: string;
};

/** Section 7 — Company Operations (departments) */
export type DepartmentOperation = {
  department: DepartmentId;
  label: string;
  status: ControlStatus;
  statusLabel: string;
  currentFocus: string;
};

/** Section 8 — Bugs & Blockers */
export type CompanyIssue = {
  id: string;
  title: string;
  severity: IssueSeverity;
  impact: string;
  owner: string;
  recommendation: string;
  expectedFix: string;
  status: IssueStatus;
};

/** Section 9 — Activity timeline */
export type CompanyActivityEvent = {
  id: string;
  type: ActivityEventType;
  message: string;
  occurredAt: string;
};

/** BRAIN-002b · A real, recent memory entry — not just a health score. Dashboard-safe
 * subset (no full `content` body) of AtlasMemoryEntry, mirrored from RecentMemoryEntry in
 * @/atlas/brain/memory/memory.types.ts. */
export type RecentMemorySummaryEntry = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  importance: number;
  source: string;
  updatedAt: string;
};

/** Section 9b — Memory (BRAIN-002) */
export type MemorySummary = {
  health: number;
  statusLabel: string;
  lastUpdated: string;
  recent: RecentMemorySummaryEntry[];
};

/** Context/Planner integration (2026-07-11) · "What Atlas is doing right now", step by
 * step, for whichever mission the runtime is currently focused on. Mirrors
 * CompanyLivePlanState — see its comment in company-state/types/companyState.types.ts. null
 * when no plan is currently registered. */
export type LivePlanStepSummary = {
  id: string;
  order: number;
  kind: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
};

export type LivePlanSummary = {
  id: string;
  missionId?: string;
  goal: string;
  status: "draft" | "ready" | "executing" | "completed" | "failed" | "cancelled";
  steps: LivePlanStepSummary[];
  createdAt: string;
  updatedAt: string;
};

/** Section 10 — Atlas Advice */
export type AtlasAdvice = {
  headline: string;
  recommendation: string;
  rationale: string;
  confidence: number;
  relatedInitiative?: string;
  decision: AdviceDecision;
  /** BRAIN-001 · path to the real engineering package generated for this recommendation, if any. */
  packagePath?: string;
  packageIsNew?: boolean;
};

/** Metadata proving Atlas Control reads from the Company State Engine. */
export type CompanyStateMeta = {
  source: ControlDataSource;
  generatedAt: string;
  companyHealth: number;
  overallStatus: "healthy" | "attention" | "blocked";
  overallStatusLabel: string;
  northStarAlignment: number;
  counts: {
    approvals: number;
    pendingApprovals: number;
    businesses: number;
    agents: number;
    kpis: number;
    roadmap: number;
    bugs: number;
    blockers: number;
    activity: number;
  };
  bugsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
};

/** Root company OS snapshot */
export type ControlSnapshot = {
  collectedAt: string;
  companyName: string;
  companyState: CompanyStateMeta;
  ceoCommand: CeoCommand;
  ceoInbox: CeoInboxItem[];
  appliedHistory: AppliedMissionRecord[];
  businesses: BusinessOverview[];
  products: ProductOverview[];
  management: ManagementMember[];
  kpis: CompanyKpi[];
  roadmap: RoadmapInitiative[];
  sprints: ActiveSprint[];
  operations: DepartmentOperation[];
  issues: CompanyIssue[];
  activity: CompanyActivityEvent[];
  atlasAdvice: AtlasAdvice;
  memory: MemorySummary;
  livePlan: LivePlanSummary | null;
};

export type ControlDataSource = "mock" | "live";

export type ControlLoadResult = {
  source: ControlDataSource;
  snapshot: ControlSnapshot;
};

export const OVERALL_STATUS_LABELS: Record<CompanyStateMeta["overallStatus"], string> = {
  healthy: "Healthy",
  attention: "Attention needed",
  blocked: "Blocked",
};

export const ADJUST_OPTIONS: Array<{ id: NeedsChangeOptionId; label: string }> = [
  { id: "fix-bug", label: "Bug oplossen" },
  { id: "adjust-design", label: "Design aanpassen" },
  { id: "adjust-roadmap", label: "Roadmap aanpassen" },
  { id: "change-priority", label: "Prioriteit wijzigen" },
];

export const INITIATIVE_LANE_LABELS: Record<InitiativeLane, string> = {
  now: "Now",
  next: "Next",
  later: "Later",
  blocked: "Blocked",
};

export const INBOX_STATUS_LABELS: Record<InboxDecisionStatus, string> = {
  pending: "Waiting for you",
  approved: "Approved",
  needs_changes: "Needs changes",
  deferred: "Deferred",
};

export const INBOX_CATEGORY_LABELS: Record<InboxCategory, string> = {
  sprint_approval: "Sprint approval",
  roadmap_decision: "Roadmap decision",
  new_business: "New business",
  new_app: "New app",
  marketing: "Marketing",
  memory_upgrade: "Memory upgrade",
  architecture: "Architecture",
};

export const URGENCY_LABELS: Record<InboxUrgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const DEPARTMENT_LABELS: Record<DepartmentId, string> = {
  engineering: "Engineering",
  operations: "Operations",
  marketing: "Marketing",
  design: "Design",
  product: "Product",
  intelligence: "Intelligence",
  memory: "Memory",
  quality: "Quality",
  planning: "Planning",
  research: "Research",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityEventType, string> = {
  sprint_started: "Sprint started",
  sprint_completed: "Sprint completed",
  approval_received: "Approval received",
  release_published: "Release published",
  memory_updated: "Memory updated",
  agent_promoted: "Management promoted",
  app_deployed: "App deployed",
  atlas_decision: "Autonomous decision",
};

export const KPI_TREND_SYMBOL: Record<KpiTrend, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};
