/** Raw business models — mutable source data for the Company State Engine. */

import type { RatifiedDepartmentId } from "@/atlas/team/department.types";

/** Sprint 2.2a adds "no-signal": a department (or, in principle, any other entity) that has
 * no real operational signal to compute a status from. Distinct from every other value here —
 * it is never derived from a health score, and must never be assigned merely to fill a UI
 * slot. See DepartmentModel below and ATLAS_SPRINT_2.2A note in labels.ts. */
export type EntityStatus =
  | "healthy"
  | "attention"
  | "critical"
  | "idle"
  | "active"
  | "pending"
  | "planning"
  | "no-signal";

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

/** Sprint 2.2a · alias of the one canonical department model — see
 * `@/atlas/team/department.types`'s `RatifiedDepartmentId`. Kept as a local name (rather than
 * importing `RatifiedDepartmentId` everywhere) so this file's own consumers don't all need to
 * change their imports; the value set is the single source of truth, defined once. */
export type DepartmentId = RatifiedDepartmentId;

export type ActivityEventType =
  | "sprint_started"
  | "sprint_completed"
  | "approval_received"
  | "release_published"
  | "memory_updated"
  | "agent_promoted"
  | "app_deployed"
  | "atlas_decision";

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
  /** Sprint 2.2a · null for an agent with no ratified department — currently only
   * `branch-director`, Atlas' own reasoning identity, not a department member. Never invent a
   * department to fill this field. */
  department: DepartmentId | null;
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
  /** Set when a "pkg-<missionId>" item is marked approved but the Apply Engine never
   * actually wrote the files to the working tree (e.g. the local apply-bridge wasn't
   * reachable at the moment of approval). Recomputed fresh from real disk state
   * (appliedHistory) on every load — never a flag that can go stale, and it clears itself
   * automatically once a manual `npm run atlas:apply` (or a later successful auto-apply)
   * actually lands the files. This is what makes an "approved but not applied" mission
   * visible instead of silently vanishing from the CEO Inbox. */
  applyWarning?: string;
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
  /** BRAIN-002b · Actual recent memory entries, not just a health score — see
   * RecentMemoryEntry in @/atlas/brain/memory. Declared inline here (not imported) because
   * this types file stays dependency-free by convention; the shape is kept in sync by hand
   * with @/atlas/brain/memory/memory.types.ts's RecentMemoryEntry. */
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

export type LivePlanStepModel = {
  id: string;
  order: number;
  kind: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
};

/** Context/Planner integration (2026-07-11) · Mirrors src/atlas/brain/planner/planner.types.ts's
 * ExecutionPlan, hand-duplicated here for the same reason MemoryModel.recent is (see its
 * comment above): this types file stays dependency-free by convention. Lets Atlas Control show
 * "what Atlas is doing right now" step by step, not just a final diff once everything is
 * already done. null means no plan is currently registered for the focused mission. */
export type LivePlanModel = {
  id: string;
  missionId?: string;
  goal: string;
  status: "draft" | "ready" | "executing" | "completed" | "failed" | "cancelled";
  steps: LivePlanStepModel[];
  createdAt: string;
  updatedAt: string;
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
  /** BRAIN-001 · path to the real engineering package generated for this recommendation, if any. */
  packagePath?: string;
  packageIsNew?: boolean;
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
  livePlan: LivePlanModel | null;
};
