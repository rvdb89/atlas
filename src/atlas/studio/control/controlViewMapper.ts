import type { CompanyState } from "@/atlas/company-state/types";
import type {
  ActivityEventType,
  AdviceDecision,
  AtlasAdvice,
  CeoCommand,
  CeoInboxItem,
  CompanyActivityEvent,
  CompanyIssue,
  CompanyKpi,
  ControlSnapshot,
  DepartmentId,
  DepartmentOperation,
  InboxCategory,
  InboxDecisionStatus,
  InboxUrgency,
  InitiativeLane,
  LivePlanSummary,
  ManagementMember,
  ManagementStatus,
  MemorySummary,
  NeedsChangeOptionId,
  ProductOverview,
  RoadmapInitiative,
  ActiveSprint,
  BusinessOverview,
  WorkloadLevel,
  ControlStatus,
  IssueSeverity,
  IssueStatus,
  CompanyStateMeta,
  ControlDataSource,
} from "./types";
import { OVERALL_STATUS_LABELS } from "./types";

function mapCompanyStateMeta(state: CompanyState, source: ControlDataSource): CompanyStateMeta {
  const openBugs = state.bugs.filter((bug) => bug.status !== "resolved");
  return {
    source,
    generatedAt: state.generatedAt,
    companyHealth: state.companyHealth,
    overallStatus: state.overallStatus,
    overallStatusLabel: OVERALL_STATUS_LABELS[state.overallStatus],
    northStarAlignment: state.northStarAlignment,
    counts: {
      approvals: state.approvals.length,
      pendingApprovals: state.approvals.filter((item) => item.status === "pending").length,
      businesses: state.businesses.length,
      agents: state.agents.length,
      kpis: state.kpis.length,
      roadmap: state.roadmap.length,
      bugs: openBugs.length,
      blockers: state.blockers.length,
      activity: state.activity.length,
    },
    bugsBySeverity: {
      critical: openBugs.filter((bug) => bug.severity === "critical").length,
      high: openBugs.filter((bug) => bug.severity === "high").length,
      medium: openBugs.filter((bug) => bug.severity === "medium").length,
      low: openBugs.filter((bug) => bug.severity === "low").length,
    },
  };
}

/** Maps computed CompanyState → Atlas Control view model. No health calculations here. */
export function mapCompanyStateToControlView(
  state: CompanyState,
  source: ControlDataSource = "mock",
): ControlSnapshot {
  return {
    collectedAt: state.generatedAt,
    companyName: state.companyName,
    companyState: mapCompanyStateMeta(state, source),
    ceoCommand: mapCeoCommand(state),
    ceoInbox: state.approvals.map(mapApprovalToInbox),
    // Not part of CompanyState — set from the runtime snapshot by loadControlSnapshot()
    // right after this call. Defaulted here only so this function's own return type
    // satisfies ControlSnapshot on its own (e.g. for the mock/no-runtime path).
    appliedHistory: [],
    businesses: state.businesses.map(mapBusiness),
    products: state.apps.map(mapApp),
    management: state.agents.map(mapAgent),
    kpis: state.kpis.map(mapKpi),
    roadmap: state.roadmap.map(mapRoadmapItem),
    sprints: state.sprints.map(mapSprint),
    operations: state.departments.map(mapDepartment),
    issues: state.bugs.map(mapBug),
    activity: state.activity.map(mapActivity),
    atlasAdvice: mapAtlasAdvice(state),
    memory: mapMemory(state),
    livePlan: mapLivePlan(state),
  };
}

function mapLivePlan(state: CompanyState): LivePlanSummary | null {
  if (!state.livePlan) return null;
  return {
    id: state.livePlan.id,
    missionId: state.livePlan.missionId,
    goal: state.livePlan.goal,
    status: state.livePlan.status,
    steps: state.livePlan.steps.map((step) => ({ ...step })),
    createdAt: state.livePlan.createdAt,
    updatedAt: state.livePlan.updatedAt,
  };
}

function mapMemory(state: CompanyState): MemorySummary {
  return {
    health: state.memory.health,
    statusLabel: state.memory.statusLabel,
    lastUpdated: state.memory.lastUpdated,
    recent: state.memory.recent,
  };
}

function mapCeoCommand(state: CompanyState): CeoCommand {
  return { ...state.ceoCommand };
}

function mapApprovalToInbox(approval: CompanyState["approvals"][number]): CeoInboxItem {
  return {
    id: approval.id,
    title: approval.title,
    category: approval.category as InboxCategory,
    urgency: approval.urgency as InboxUrgency,
    reason: approval.reason,
    recommendation: approval.recommendation,
    status: approval.status as InboxDecisionStatus,
    confirmationMessage: approval.confirmationMessage,
    selectedChangeOption: approval.selectedChangeOption as NeedsChangeOptionId | undefined,
    changeNote: approval.changeNote,
    applyWarning: approval.applyWarning,
  };
}

function mapBusiness(business: CompanyState["businesses"][number]): BusinessOverview {
  return {
    id: business.id,
    name: business.name,
    status: business.status as ControlStatus,
    statusLabel: business.statusLabel,
    currentSprint: business.activeSprint,
    openBugs: business.openBugs,
    roadmapProgress: business.roadmapProgress,
    marketingStatus: business.marketingStatus,
    productIds: business.productIds,
  };
}

function mapApp(app: CompanyState["apps"][number]): ProductOverview {
  return {
    id: app.id,
    name: app.name,
    businessId: app.businessId,
    status: app.status as ControlStatus,
    statusLabel: app.statusLabel,
  };
}

function mapAgent(agent: CompanyState["agents"][number]): ManagementMember {
  return {
    id: agent.id,
    name: agent.name,
    title: agent.role,
    department: agent.department as DepartmentId,
    status: agent.status as ManagementStatus,
    currentResponsibility: agent.currentResponsibility,
    currentInitiative: agent.currentInitiative,
    healthScore: agent.health,
    workload: agent.workload as WorkloadLevel,
  };
}

function mapKpi(kpi: CompanyState["kpis"][number]): CompanyKpi {
  return { ...kpi };
}

function mapRoadmapItem(item: CompanyState["roadmap"][number]): RoadmapInitiative {
  return {
    id: item.id,
    title: item.title,
    lane: item.lane as InitiativeLane,
    priority: item.priority,
    businessValue: item.businessValue,
    northStarContribution: item.northStarContribution,
    owner: item.owner,
    progress: item.progress,
  };
}

function mapSprint(sprint: CompanyState["sprints"][number]): ActiveSprint {
  return {
    id: sprint.id,
    name: sprint.name,
    businessId: sprint.businessId ?? undefined,
    progress: sprint.progress,
    status: sprint.status as ControlStatus,
    statusLabel: sprint.statusLabel,
  };
}

function mapDepartment(department: CompanyState["departments"][number]): DepartmentOperation {
  return {
    department: department.id as DepartmentId,
    label: department.label,
    status: department.status as ControlStatus,
    statusLabel: department.statusLabel,
    currentFocus: department.currentWork,
  };
}

function mapBug(bug: CompanyState["bugs"][number]): CompanyIssue {
  return {
    id: bug.id,
    title: bug.title,
    severity: bug.severity as IssueSeverity,
    impact: bug.impact,
    owner: bug.owner,
    recommendation: bug.recommendation,
    expectedFix: bug.expectedFix,
    status: bug.status as IssueStatus,
  };
}

function mapActivity(event: CompanyState["activity"][number]): CompanyActivityEvent {
  return {
    id: event.id,
    type: event.type as ActivityEventType,
    message: event.message,
    occurredAt: event.occurredAt,
  };
}

function mapAtlasAdvice(state: CompanyState): AtlasAdvice {
  return {
    headline: state.recommendation.headline,
    recommendation: state.recommendation.recommendation,
    rationale: state.recommendation.rationale,
    confidence: state.recommendation.confidence,
    relatedInitiative: state.recommendation.relatedInitiativeId,
    decision: state.recommendation.decision as AdviceDecision,
    packagePath: state.recommendation.packagePath,
    packageIsNew: state.recommendation.packageIsNew,
  };
}
