import {
  computeRecommendationDecision,
  ensureCompanyStateHydrated,
  getCompanyState,
  loadCompanyState,
  updateCompanyModels,
} from "@/atlas/company-state";
import type {
  AgentModel,
  DepartmentId,
  WorkloadLevel,
  RoadmapModel,
  InitiativeLane,
  DepartmentModel,
  BugModel,
  BugSeverity,
  ApprovalModel,
  BusinessModel,
  AppModel,
  EntityStatus,
  SprintModel,
  RecommendationDecision,
  LivePlanModel,
} from "@/atlas/company-state";

import { mapCompanyStateToControlView } from "./controlViewMapper";
import type { ControlLoadResult, ControlSnapshot } from "./types";

let cachedView: ControlSnapshot | null = null;

type RuntimeActivityEntry = {
  id: string;
  occurredAt: string;
  cycle: number;
  source: "ai" | "rule-based";
  recommendedInitiativeId: string | null;
  recommendedInitiativeTitle: string | null;
  confidence: number | null;
  agreesWithRuleBased: boolean | null;
  reasoning: string;
};

type RuntimeAgentEntry = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "active" | "idle";
  health: number;
  currentInitiative: string;
  currentResponsibility: string;
};

type RuntimeAuditEntry = {
  overallScore: number;
  generatedAt: string;
  recommendation: string;
};

type RuntimeMemoryRecentEntry = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  importance: number;
  source: string;
  updatedAt: string;
};

type RuntimeMemoryEntry = {
  total: number;
  health: number;
  statusLabel: string;
  lastUpdated: string;
  recent: RuntimeMemoryRecentEntry[];
};

/** Context/Planner integration (2026-07-11) · Mirrors src/atlas/brain/planner/planner.types.ts's
 * ExecutionPlan as written into atlas-runtime-state.json's `plan` field — only the subset
 * this dashboard actually renders is typed here (see LivePlanModel for the trimmed shape it
 * gets mapped into). */
type RuntimeExecutionPlanStep = {
  id: string;
  order: number;
  kind: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
};

type RuntimeExecutionPlan = {
  id: string;
  missionId?: string;
  goal: string;
  status: "draft" | "ready" | "executing" | "completed" | "failed" | "cancelled";
  steps: RuntimeExecutionPlanStep[];
  createdAt: string;
  updatedAt: string;
};

type RuntimeMissionPackage = {
  missionId: string;
  title: string;
  generatedAt: string;
  packageDir: string;
  claudePackagePath: string;
  alreadyExisted: boolean;
};

type RuntimeRoadmapItem = {
  id: string;
  title: string;
  lane: InitiativeLane;
  priority: number;
  businessValue: string;
  northStarContribution: string;
  owner: string;
  progress: number;
};

type RuntimeDepartment = {
  id: string;
  health: number;
  status: EntityStatus;
  currentWork: string;
  owner: string;
};

type RuntimeBug = {
  id: string;
  title: string;
  severity: BugSeverity;
  impact: string;
  owner: string;
  recommendation: string;
  expectedFix: string;
  status: "open" | "watching" | "resolved";
  file: string;
};

type RuntimeApproval = {
  id: string;
  title: string;
  category: "sprint_approval" | "architecture" | "roadmap_decision" | "memory_upgrade";
  urgency: "low" | "medium" | "high" | "urgent";
  reason: string;
  recommendation: string;
  status: "pending";
};

export type RuntimeAppliedFile = {
  path: string;
  action: "create" | "modify";
  reason: string;
};

export type RuntimeAppliedValidation = {
  typecheckOk: boolean;
  typecheckSummary: string;
  /** EXEC-003 · real node:test suite result (tsx --test), absent for pre-EXEC-003 entries. */
  testsOk?: boolean;
  testSummary?: string;
  suggestedCommitMessage: string;
  staged: boolean;
  stageNote: string;
};

export type RuntimeAppliedMission = {
  missionId: string;
  title: string;
  appliedAt: string;
  summary: string;
  files: RuntimeAppliedFile[];
  fileCount: number;
  risks: string[];
  followUp: string;
  validation: RuntimeAppliedValidation | null;
};

type RuntimeBusiness = {
  id: string;
  name: string;
  health: number;
  status: EntityStatus;
  currentFocus: string;
  roadmapProgress: number;
  openBugs: number;
  nextRecommendation: string;
  marketingStatus: string;
};

type RuntimeApp = {
  id: string;
  name: string;
  businessId: string;
  status: EntityStatus;
  version: string;
  health: number;
  lastRelease: string;
  currentInitiative: string;
};

type RuntimeStateFile = {
  generatedAt: string;
  runtimeStartedAt: string;
  intervalMs: number;
  cycleCount: number;
  latest: RuntimeActivityEntry;
  capabilityGaps: Array<{ id: string; name: string; gap: number; intentRelevant: boolean }>;
  activity: RuntimeActivityEntry[];
  agents: RuntimeAgentEntry[];
  audit: RuntimeAuditEntry | null;
  memory: RuntimeMemoryEntry | null;
  activePackage: RuntimeMissionPackage | null;
  roadmap: RuntimeRoadmapItem[];
  departments: RuntimeDepartment[];
  bugs: RuntimeBug[];
  candidateApprovals: RuntimeApproval[];
  appliedHistory: RuntimeAppliedMission[];
  businesses: RuntimeBusiness[];
  apps: RuntimeApp[];
  plan: RuntimeExecutionPlan | null;
};

/** Fetches the Atlas Runtime snapshot (written by `npm run atlas:runtime`) if it exists. */
async function fetchRuntimeState(): Promise<RuntimeStateFile | null> {
  if (typeof fetch !== "function") return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const response = await fetch("/atlas-runtime-state.json", {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    return (await response.json()) as RuntimeStateFile;
  } catch {
    return null;
  }
}

/** Decides whether the top "Atlas Main Recommendation" card should still show as an
 * actionable "Approve X" (pending), or as already handled (approved) — checked fresh on
 * every load instead of being hardcoded to "pending".
 *
 * Bug this fixes: applyRuntimeState used to reset `decision: "pending"` unconditionally on
 * every page load, because it only ever read the runtime's latest cycle verdict and never
 * looked at what the CEO had already done about it. So a CEO who approved everything in the
 * CEO Inbox for e.g. CONTENT-003 (which correctly emptied to 0 pending there) would still see
 * "Approve CONTENT-003" sitting at the top of the page after every refresh — the Inbox and
 * the top card were reading two different signals and only one of them remembered approvals. */
/** Bugfix 2026-07-11 · Found live: a cycle that produces no fresh initiative (e.g. the AI
 * provider was briefly unreachable) used to make this always return "pending" outright,
 * ignoring that the top card's relatedInitiativeId/packagePath fall back to the last cached
 * recommendation in that same situation (see the `recommendation:` object below). Result: the
 * card showed "Approve ENG-006B" for a mission that had been fully applied hours earlier,
 * while the CEO Inbox correctly showed 0 pending — two views of the same state disagreeing.
 * Fix: decide off the same *effective* initiative id the card actually displays (fresh this
 * cycle, or the cached fallback), not off runtime.latest alone. */
function deriveRecommendationDecision(
  runtime: RuntimeStateFile,
  mergedApprovals: ApprovalModel[],
  effectiveInitiativeId: string | undefined,
): RecommendationDecision {
  if (!effectiveInitiativeId) return "pending";

  // The mission already shipped via the Apply Engine — nothing left to approve.
  if (runtime.appliedHistory.some((entry) => entry.missionId === effectiveInitiativeId)) {
    return "approved";
  }

  // Same predicate the CEO Inbox itself uses (approveApproval/deferApproval/etc. in
  // ControlDecisionEngine.ts) — one shared source of truth, so approving something in the
  // Inbox and approving it via this card's own button always agree, from either direction,
  // without needing a page reload to reconcile.
  return computeRecommendationDecision(effectiveInitiativeId, mergedApprovals);
}

const PKG_APPROVAL_PATTERN = /^pkg-(.+)$/;

/** Reconciles "approved" code-proposal approvals against what actually landed on disk.
 *
 * Real incident this fixes: CONTENT-004 was approved in the CEO Inbox (status flipped to
 * "approved" immediately, client-side), which is supposed to also fire a background call to
 * the local Apply Engine bridge — but that call silently failed (the bridge inside
 * `npm run atlas:runtime` likely wasn't reachable at that exact moment, mid-restart). The
 * failure was only ever logged to the browser console; the CEO Inbox and the top
 * recommendation card both confidently showed "approved" / "Atlas is executing" while the
 * files never reached the working tree. Caught only because the CEO happened to check the
 * actual file tree — not something the dashboard itself surfaced.
 *
 * This runs on every runtime-state load and checks real ground truth (`appliedHistory`,
 * scanned straight from the applied-<timestamp> folders on disk) against every
 * "pkg-<missionId>" approval marked approved. Mismatch → visible warning. Match, or a manual
 * `npm run atlas:apply` catches it up later → warning clears itself automatically next load.
 * Never a flag that can go stale, because it's never trusted as state — it's recomputed. */
function reconcileApplyWarnings(approvals: ApprovalModel[], appliedHistory: RuntimeAppliedMission[]): ApprovalModel[] {
  const appliedMissionIds = new Set(appliedHistory.map((entry) => entry.missionId));

  return approvals.map((approval) => {
    const match = approval.id.match(PKG_APPROVAL_PATTERN);
    if (!match || approval.status !== "approved") {
      return approval.applyWarning ? { ...approval, applyWarning: undefined } : approval;
    }

    const missionId = match[1];
    if (appliedMissionIds.has(missionId)) {
      return approval.applyWarning ? { ...approval, applyWarning: undefined } : approval;
    }

    return {
      ...approval,
      applyWarning: `Goedgekeurd, maar nog niet toegepast op de code — de automatische koppeling is waarschijnlijk mislukt. Draai handmatig: npm run atlas:apply -- ${missionId}`,
    };
  });
}

/** Merges real runtime output into the mutable company models before the view is computed. */
function applyRuntimeState(runtime: RuntimeStateFile): void {
  updateCompanyModels((current) => {
    const confidencePct =
      runtime.latest.confidence !== null ? Math.round(runtime.latest.confidence * 100) : current.recommendation.confidence;

    const mergedApprovals = reconcileApplyWarnings(
      mergeApprovals(current.approvals, runtime.candidateApprovals),
      runtime.appliedHistory,
    );

    return {
      ...current,
      // The green "Goedgekeurd..." banner is meant as a one-time toast right after a click,
      // not a permanent label — it used to persist forever because nothing ever cleared it
      // on a fresh page load, so it kept showing up cycles later even though `decision` had
      // already correctly moved to "approved" (redundant with the still-visible Approve
      // button, and confusing once the underlying recommendation had moved on). A genuine
      // reload is a clean slate; the banner comes back immediately if the CEO clicks Approve
      // again from here.
      decisionFeedback: {},
      recommendation: (() => {
        // Computed once so relatedInitiativeId and decision can never disagree about which
        // mission the card is actually talking about — see deriveRecommendationDecision's
        // 2026-07-11 bugfix note above for the incident this closes.
        const effectiveInitiativeId = runtime.latest.recommendedInitiativeId ?? current.recommendation.relatedInitiativeId;
        return {
          // Bugfix 2026-07-11 (CEO-reported): used to read "Atlas Runtime — live Claude verdict
          // (cycle N)" — a technical process label, not something Atlas would ever say to the
          // CEO (CEO_COCKPIT.md: "Atlas speaks to the CEO, not about itself"). This field is
          // read unclamped both by CockpitOpening's Briefing and by CommandPanel's "Today's
          // focus" — fixing it here corrects both without redesigning either component.
          //
          // Refinement 2026-07-11 (CEO-reported): the "nothing selected" fallback read as a
          // system message ("No specific initiative needs attention today."). Reworded to sound
          // like an excellent executive assistant reporting that everything within Atlas's own
          // authority stayed on course — matching CEO_COCKPIT.md chapter 1/7's "only escalate
          // what Atlas genuinely cannot decide alone".
          headline: runtime.latest.recommendedInitiativeId
            ? `Today's priority is ${runtime.latest.recommendedInitiativeTitle ?? runtime.latest.recommendedInitiativeId}.`
            : "Atlas handled everything within its authority today.",
          recommendation: runtime.latest.recommendedInitiativeId
            ? `Focus on ${runtime.latest.recommendedInitiativeId}${
                runtime.latest.recommendedInitiativeTitle ? ` — ${runtime.latest.recommendedInitiativeTitle}` : ""
              }`
            : "No initiative selected this cycle — operational routing only.",
          rationale: runtime.latest.reasoning,
          confidence: confidencePct,
          relatedInitiativeId: effectiveInitiativeId,
          decision: deriveRecommendationDecision(runtime, mergedApprovals, effectiveInitiativeId),
          packagePath: runtime.activePackage?.claudePackagePath ?? current.recommendation.packagePath,
          packageIsNew: runtime.activePackage ? !runtime.activePackage.alreadyExisted : current.recommendation.packageIsNew,
        };
      })(),
      activity: [
        ...runtime.activity.map((entry) => ({
          id: entry.id,
          type: "atlas_decision" as const,
          message: entry.recommendedInitiativeId
            ? `Cycle ${entry.cycle}: recommended ${entry.recommendedInitiativeId} (${entry.source === "ai" ? "Claude" : "rule-based"})`
            : `Cycle ${entry.cycle}: no initiative selected (${entry.source === "ai" ? "Claude" : "rule-based"})`,
          occurredAt: entry.occurredAt,
        })),
        ...current.activity,
      ].slice(0, 30),
      agents: runtime.agents.length > 0 ? runtime.agents.map(mapRuntimeAgent) : current.agents,
      platform: runtime.audit
        ? {
            ...current.platform,
            studioHealth: runtime.audit.overallScore,
            appHealth: runtime.audit.overallScore,
            apiHealth: runtime.audit.overallScore,
            providersHealth: runtime.audit.overallScore,
            reviewsHealth: runtime.audit.overallScore,
            statusLabel: runtime.audit.recommendation || current.platform.statusLabel,
            latestReviewLabel: runtime.audit.generatedAt
              ? `Audit · ${new Date(runtime.audit.generatedAt).toLocaleString()}`
              : current.platform.latestReviewLabel,
          }
        : current.platform,
      memory: runtime.memory
        ? {
            health: runtime.memory.health,
            statusLabel: runtime.memory.statusLabel,
            lastUpdated: runtime.memory.lastUpdated,
            recent: runtime.memory.recent,
          }
        : current.memory,
      roadmap: runtime.roadmap.length > 0 ? runtime.roadmap.map(mapRuntimeRoadmapItem) : current.roadmap,
      departments: runtime.departments.length > 0 ? runtime.departments.map(mapRuntimeDepartment) : current.departments,
      bugs: runtime.bugs.length > 0 ? runtime.bugs.map(mapRuntimeBug) : current.bugs,
      businesses: runtime.businesses.length > 0 ? runtime.businesses.map(mapRuntimeBusiness) : current.businesses,
      apps: runtime.apps.length > 0 ? runtime.apps.map(mapRuntimeApp) : current.apps,
      // Context/Planner integration (2026-07-11) · Always reflects the latest snapshot as-is
      // (not additive like approvals) — a plan that finished or aged out of the runtime's
      // executionQueue should disappear from the dashboard too, not linger from a stale poll.
      livePlan: mapRuntimePlan(runtime.plan),
      sprints: runtime.roadmap.length > 0 ? deriveSprintsFromRoadmap(runtime.roadmap) : current.sprints,
      // Additive only: real triggers are proposed as new approvals, but anything the CEO
      // already approved or deferred (same id) is never re-added or overwritten.
      approvals: mergedApprovals,
    };
  });
}

function mapRuntimeRoadmapItem(item: RuntimeRoadmapItem): RoadmapModel {
  return {
    id: item.id,
    title: item.title,
    lane: item.lane,
    priority: item.priority,
    businessValue: item.businessValue,
    northStarContribution: item.northStarContribution,
    owner: item.owner,
    progress: item.progress,
  };
}

function mapRuntimeDepartment(department: RuntimeDepartment): DepartmentModel {
  return {
    id: department.id as DepartmentId,
    health: department.health,
    status: department.status,
    currentWork: department.currentWork,
    owner: department.owner,
  };
}

function mapRuntimeBug(bug: RuntimeBug): BugModel {
  return {
    id: bug.id,
    title: bug.title,
    severity: bug.severity,
    impact: bug.impact,
    owner: bug.owner,
    recommendation: bug.recommendation,
    expectedFix: bug.expectedFix,
    status: bug.status,
  };
}

function mapRuntimeBusiness(business: RuntimeBusiness): BusinessModel {
  return {
    id: business.id,
    name: business.name,
    health: business.health,
    status: business.status,
    currentFocus: business.currentFocus,
    activeSprintId: null,
    roadmapProgress: business.roadmapProgress,
    openBugs: business.openBugs,
    nextRecommendation: business.nextRecommendation,
    marketingStatus: business.marketingStatus,
    productIds: [`${business.id}-app`],
  };
}

function mapRuntimeApp(app: RuntimeApp): AppModel {
  return {
    id: app.id,
    name: app.name,
    businessId: app.businessId,
    status: app.status,
    version: app.version,
    health: app.health,
    lastRelease: app.lastRelease,
    currentInitiative: app.currentInitiative,
  };
}

function mapRuntimePlan(plan: RuntimeExecutionPlan | null): LivePlanModel | null {
  if (!plan) return null;
  return {
    id: plan.id,
    missionId: plan.missionId,
    goal: plan.goal,
    status: plan.status,
    steps: plan.steps.map((step) => ({ ...step })),
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

/** Turns the current "now" roadmap item into a real, single active sprint — no fictional
 * sprint data, just the real initiative Atlas is actually working on right now. */
function deriveSprintsFromRoadmap(roadmap: RuntimeRoadmapItem[]): SprintModel[] {
  return roadmap
    .filter((item) => item.lane === "now")
    .map((item) => ({
      id: item.id,
      name: item.title,
      businessId: null,
      progress: item.progress,
      lifecycle: "running" as const,
    }));
}

function mergeApprovals(existing: ApprovalModel[], candidates: RuntimeApproval[]): ApprovalModel[] {
  const existingIds = new Set(existing.map((approval) => approval.id));
  const additions = candidates
    .filter((candidate) => !existingIds.has(candidate.id))
    .map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      category: candidate.category,
      urgency: candidate.urgency,
      reason: candidate.reason,
      recommendation: candidate.recommendation,
      status: candidate.status,
    }));
  return [...existing, ...additions];
}

function mapRuntimeAgent(agent: RuntimeAgentEntry): AgentModel {
  return {
    id: agent.id,
    name: agent.name,
    role: agent.role,
    status: agent.status,
    health: agent.health,
    workload: (agent.status === "active" ? "balanced" : "light") as WorkloadLevel,
    currentInitiative: agent.currentInitiative,
    currentResponsibility: agent.currentResponsibility,
    department: agent.department as DepartmentId,
  };
}

/** Loads Atlas Control view from the Company State Engine — read-only visualization. */
export async function loadControlSnapshot(): Promise<ControlLoadResult> {
  await ensureCompanyStateHydrated();

  const runtime = await fetchRuntimeState();
  if (runtime) {
    applyRuntimeState(runtime);
  }

  const result = await loadCompanyState({ source: runtime ? "live" : "mock" });
  cachedView = {
    ...mapCompanyStateToControlView(result.state, result.source),
    // Read-only track record — set straight from the runtime snapshot, deliberately
    // bypassing the mutable CompanyState/merge machinery above: history never needs an
    // Approve/Adjust decision, it just reports what Atlas already did.
    appliedHistory: runtime?.appliedHistory ?? [],
  };
  return {
    source: result.source,
    snapshot: cachedView,
  };
}

export function getCachedControlSnapshot(): ControlSnapshot | null {
  return cachedView;
}

export function cacheControlView(snapshot: ControlSnapshot): ControlSnapshot {
  cachedView = snapshot;
  return snapshot;
}

const APPLY_BRIDGE_URL = "http://127.0.0.1:8791/apply";
const PIN_BRIDGE_URL = "http://127.0.0.1:8791/pin";

type PinBridgeResponse = { ok: true; missionId: string } | { ok: false; missionId?: string; message: string };

/** Bugfix 2026-07-10 · "roadmap_decision" cards (id: override-<missionId>, written whenever
 * Claude's mission.decide disagrees with the rule-based pick) used to be purely advisory —
 * approving one only flipped local UI state (see approveApproval in ControlDecisionEngine.ts),
 * nothing ever pinned that mission for the runtime to actually act on. Found live: the CEO
 * approved an override card and nothing new ever landed in the CEO Inbox afterward, because
 * the runtime recomputes its pick fresh every cycle unless a ceo-instruction.json pin forces
 * it to stick. Mirrors triggerExecutionApply below: best-effort, never blocks or reverts the
 * approval itself if the local runtime isn't reachable. */
export async function triggerRoadmapPin(approvalId: string): Promise<void> {
  const match = approvalId.match(/^override-(.+)$/);
  if (!match) return;
  const missionId = match[1];

  const appendActivity = (message: string) => {
    updateCompanyModels((current) => ({
      ...current,
      activity: [
        {
          id: `pin-${missionId}-${Date.now()}`,
          type: "release_published" as const,
          message,
          occurredAt: "Just now",
        },
        ...current.activity,
      ].slice(0, 30),
    }));
  };

  const target = getCompanyState().state.approvals.find((item) => item.id === approvalId);
  const intent = target?.reason?.trim() || `CEO bevestigde Atlas' aanbeveling om door te gaan met ${missionId}.`;
  const title = target?.title;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(PIN_BRIDGE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ missionId, intent, title }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const payload = (await response.json()) as PinBridgeResponse;

    appendActivity(
      payload.ok
        ? `Atlas heeft ${missionId} vastgepind — wordt bij de eerstvolgende cyclus als opdracht uitgevoerd.`
        : `Kon ${missionId} niet vastpinnen: ${payload.message}`,
    );
  } catch {
    appendActivity(
      `⚠ Kon de lokale runtime niet bereiken om ${missionId} vast te pinnen — bevestiging is nog niet doorgezet. Draai handmatig: npm run atlas:ask -- "${missionId}"`,
    );
    console.warn(
      `[roadmap-pin] Could not reach the local runtime for ${missionId}. Is npm run atlas:runtime running?`,
    );
  }
}

type ApplyBridgeResponse =
  | { ok: true; missionId: string; applied: Array<{ path: string; action: string }>; skipped: Array<{ path: string; reason: string }> }
  | { ok: false; missionId?: string; message: string };

/** EXEC-001 · When the CEO approves a "Review engineering package" inbox item, this fires
 * the local Apply Engine bridge (started by `npm run atlas:runtime`) so the reviewed
 * proposal is written to the real working tree — turning "approved" into "shipped"
 * without a separate terminal step. Best-effort and non-blocking: if the runtime isn't
 * running, the approval itself already succeeded in the UI; this only adds a follow-up
 * activity entry once the apply attempt resolves, it never blocks or reverts the approval. */
export async function triggerExecutionApply(approvalId: string): Promise<void> {
  const match = approvalId.match(/^pkg-(.+)$/);
  if (!match) return;
  const missionId = match[1];

  const appendActivity = (message: string) => {
    updateCompanyModels((current) => ({
      ...current,
      activity: [
        {
          id: `apply-${missionId}-${Date.now()}`,
          type: "release_published" as const,
          message,
          occurredAt: "Just now",
        },
        ...current.activity,
      ].slice(0, 30),
    }));
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(APPLY_BRIDGE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ missionId }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const payload = (await response.json()) as ApplyBridgeResponse;

    if (payload.ok) {
      appendActivity(
        payload.applied.length > 0
          ? `Atlas applied ${payload.applied.length} file(s) to the working tree for ${missionId}`
          : `Atlas ran the apply step for ${missionId}, but no files were applied — see engineering/packages/${missionId}/`,
      );
    } else {
      appendActivity(`Auto-apply for ${missionId} failed: ${payload.message}`);
    }
  } catch {
    // Used to be silent here (console.warn only) — the CEO Inbox and the top recommendation
    // card both kept showing "approved" with no indication anything was wrong, which is
    // exactly how a real CONTENT-004 apply-bridge failure went unnoticed for a while. Now
    // surfaced two ways: this immediate activity entry for the current session, plus
    // reconcileApplyWarnings() in applyRuntimeState catching it on every future load too
    // (so it's visible even if the CEO wasn't watching at the moment it happened).
    appendActivity(
      `⚠ Kon de lokale Apply Engine niet bereiken voor ${missionId} — de wijziging is nog niet toegepast op de code. Draai handmatig: npm run atlas:apply -- ${missionId}`,
    );
    console.warn(
      `[execution-apply] Could not reach the local apply bridge for ${missionId}. Is npm run atlas:runtime running?`,
    );
  }
}
