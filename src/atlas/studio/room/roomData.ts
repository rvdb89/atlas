import { buildTimeGreeting } from "@/atlas/company-state/calculations/scoreUtils";
import { groupCeoInboxItems } from "@/atlas/studio/control/ceoInbox/ceoInboxView";
import type {
  BusinessOverview,
  CeoInboxItem,
  ControlSnapshot,
  DepartmentOperation,
  ManagementMember,
} from "@/atlas/studio/control/types";
import { summarizeRecentWork } from "@/atlas/studio/control/v2/cockpitOpeningHelpers";

import type { DepartmentSpec, DepartmentState, DoorwayId } from "./types";

/**
 * The Room — real data mapping. Sprint 2.2 ("The Room — First Living Prototype").
 *
 * Pure functions only, no I/O, no React — the same separation `ceoInboxView.ts` already
 * uses for Atlas Control. `RoomScreen.tsx` is the only caller; it owns fetching the real
 * snapshot (`useControlDashboard`) and simply hands the two real arrays it already has
 * (`operations`, `ceoInbox`) to these functions. Nothing here invents a department, an
 * inbox item, or a warmth value — every number below is derived from real state that
 * already existed before this sprint.
 */

const MAX_DEPARTMENTS_ON_WALL = 6;
const MAX_FOCUS_ITEMS = 3;

function departmentState(status: DepartmentOperation["status"]): DepartmentState {
  return status === "attention" || status === "critical" ? "elevated" : "calm";
}

/**
 * Maps Atlas Control's real, live department operations onto Department Wall's existing
 * DepartmentSpec shape — no mock data, no invented department. `buildRealDepartments()`
 * (`scripts/atlas/realCompanyData.ts`) can emit more real departments than the Wall's fixed
 * band comfortably holds; elevated departments are surfaced first so the visible slice
 * always shows what currently matters most, per Visual Constitution Design Law 3 ("Attention
 * is earned"). Within each group, Atlas Control's own emitted order is preserved rather than
 * re-sorted further — this file adds no second, competing significance judgment.
 */
export function mapDepartmentsForRoom(operations: DepartmentOperation[]): DepartmentSpec[] {
  const elevated = operations.filter((operation) => departmentState(operation.status) === "elevated");
  const calm = operations.filter((operation) => departmentState(operation.status) !== "elevated");

  return [...elevated, ...calm].slice(0, MAX_DEPARTMENTS_ON_WALL).map((operation) => ({
    id: operation.department,
    label: operation.label,
    state: departmentState(operation.status),
  }));
}

export type CeoFocusItem = {
  id: string;
  title: string;
  reason: string;
};

const URGENCY_WARMTH: Record<CeoInboxItem["urgency"], number> = {
  urgent: 1,
  high: 0.75,
  medium: 0.45,
  low: 0.25,
};

/**
 * Selects only what genuinely deserves the CEO's attention right now — reusing Atlas
 * Control's own grouping/urgency logic (`groupCeoInboxItems`) instead of inventing a second
 * priority scheme for The Room. "attention" items (approved, but the Apply Engine never
 * actually landed the files) surface first — a decision that silently didn't land is more
 * urgent than one still waiting on a decision. "pending" items follow, already sorted by
 * urgency inside `groupCeoInboxItems`. Never the full inbox: capped, on purpose, per Visual
 * Constitution Design Law 3. `warmth` is the single highest urgency among the surfaced
 * items, expressed 0–1 — the one number Threshold Stone needs to carry "something is
 * waiting" without knowing anything about inbox categories, statuses, or counts.
 */
export function selectCeoFocus(
  items: CeoInboxItem[],
  max: number = MAX_FOCUS_ITEMS,
): { items: CeoFocusItem[]; warmth: number } {
  const grouped = groupCeoInboxItems(items);
  const surfaced = [...grouped.attention, ...grouped.pending].slice(0, max);
  const warmth = surfaced.reduce((highest, item) => Math.max(highest, URGENCY_WARMTH[item.urgency]), 0);

  return {
    items: surfaced.map((item) => ({ id: item.id, title: item.title, reason: item.reason })),
    warmth,
  };
}

/** Sprint 4.2 never lets vitality fully fade — the Heart is Atlas's one point of contact
 * (`ATLAS_IDENTITY_CONSTITUTION.md`) and may never disappear, however poor the company's
 * condition. First lowered from 0.5 to 0.35 (Sprint 4.2.1) after user testing found the
 * original range too subtle. Recalibrated a second time, to 0.3, not out of a fear of being
 * "too expressive" but from an actual limit: the core ring's own base opacity is 0.9, so
 * 0.3 is the floor where it still reads clearly against Polished Limestone (≈0.27 opacity) —
 * pushing further would start to genuinely risk illegibility, not drama. That is the real
 * boundary this constant answers to, not an arbitrary safety margin. Still a floor, never
 * 0 — the Heart's own identity requirement, unrelated to how strong its expression is
 * allowed to be. */
const HEART_VITALITY_FLOOR = 0.3;

/**
 * The Heart's one variable property (Sprint 4.2, "The Heart Becomes Alive") — the same
 * intensity-as-judgment idiom Threshold Stone, Department Wall and Archway Recess already
 * use for their own single judgment channel, applied here to the Heart itself for the first
 * time. `companyHealth` (0–100, `ControlSnapshot.companyState.companyHealth`) is the single
 * source of truth — the exact same score Atlas Control's own `AiHeart.tsx` already reads;
 * nothing new is invented or calculated here, only carried over.
 *
 * Before the real snapshot has loaded, `companyHealth` is `undefined` — that is an unknown
 * state, not a poor one, so it renders at full presence (1) rather than guessing a low score
 * during the ordinary loading flicker.
 */
export function deriveHeartVitality(companyHealth: number | undefined): number {
  if (companyHealth === undefined) {
    return 1;
  }
  const normalized = Math.max(0, Math.min(100, companyHealth)) / 100;
  return HEART_VITALITY_FLOOR + normalized * (1 - HEART_VITALITY_FLOOR);
}

export type DoorwayPresence = {
  left: number;
  right: number;
};

/**
 * Sprint 4.2.2 ("Company Doorway Completion") — which real, stable company occupies which
 * physical doorway slot. The Room has exactly two fixed doorway positions (ratified Sprint
 * 21); the business model has no concept of "doorway" at all, and never should — a company's
 * identity is `BusinessOverview.id`, the same stable id Atlas Control already uses, not
 * anything invented for the Room. This table is the one place that association is made
 * explicit — `CompanyInterior.tsx` (Sprint 4.2, "Capability Migration 03") now reads this
 * same table indirectly, through the `DoorwayPresence` this file exports below, rather than
 * keeping a second, separate identity table of its own. It replaces Capability Migration 02's
 * positional binding
 * (`businesses[0]`/`businesses[1]`), which was array-order-dependent and not a real identity
 * — a doorway now always represents the same named company, however the array is ordered.
 * Known, named limitation: this is a maintained convention, not an automatically inferred
 * one — scaling past two real companies needs its own decision, out of scope here exactly as
 * it was in Capability Migration 02.
 */
const DOORWAY_BUSINESS_ID: Record<DoorwayId, string> = {
  "doorway-left": "doughbert",
  "doorway-right": "atlas-control",
};

/**
 * Company Doorways' one variable property (Sprint 4.2, "Capability Migration 02" and its
 * completion, "Company Doorway Completion") — the same intensity-as-judgment idiom every
 * other wired object in the Room already uses. `ATLAS_OBJECT_SEMANTICS.md` is explicit that
 * a Company Doorway represents "the current condition of a company," never a status light or
 * a warning — so `PRESENCE_BY_STATUS` below is graded by how much real, current operational
 * signal a business is carrying right now, not by whether that signal is good or bad news. A
 * business in `critical` status is not "worse" on this axis than one that is `healthy` — it
 * is, truthfully, at least as present: real activity, real attention, real events are
 * concentrated there right now. `idle`/`planning` are genuinely quiet: nothing current is
 * happening. `no-signal` is the true floor — Atlas has no real data for that company yet, and
 * pretending otherwise would be inventing presence that isn't there (unlike the Heart, a
 * Company Doorway has no "may never disappear" rule of its own; it is truthful to a specific
 * company, not to Atlas's own permanent point of contact). This is deliberately a different
 * judgment than Department Wall's "elevated means needs attention" — Company Doorway warmth
 * answers "how much is currently happening here," not "is something wrong."
 *
 * Eight real states, eight distinguishable degrees of presence — replacing Capability
 * Migration 02's two-state `present`/`dormant` collapse, which lost too much of what
 * `BusinessOverview.status` already truthfully carries. The visual ceiling is unchanged:
 * every value here is a 0–1 multiplier of Archway Recess's own existing, already-accepted
 * maximum glow — nothing here can ever glow brighter than the object already did before this
 * sprint, only more of the range below that ceiling is now actually used.
 */
const PRESENCE_BY_STATUS: Record<BusinessOverview["status"], number> = {
  "no-signal": 0,
  idle: 0.15,
  planning: 0.3,
  pending: 0.45,
  healthy: 0.6,
  active: 0.75,
  attention: 0.9,
  critical: 1,
};

export function mapCompanyDoorways(businesses: BusinessOverview[]): DoorwayPresence {
  return {
    left: presenceForDoorway(businesses, "doorway-left"),
    right: presenceForDoorway(businesses, "doorway-right"),
  };
}

function presenceForDoorway(businesses: BusinessOverview[], doorway: DoorwayId): number {
  const business = businesses.find((candidate) => candidate.id === DOORWAY_BUSINESS_ID[doorway]);
  if (!business) {
    return 0;
  }
  return PRESENCE_BY_STATUS[business.status];
}

export type ExecutiveBriefing = {
  greeting: string;
  businessUpdate: string[];
  judgement: string;
  attention: string[];
  decisions: { count: number; summary: string };
  closing: string;
};

/**
 * Sprint 4.2 ("Executive Briefing v1") — composes the six approved briefing sections
 * (welcome, business update, executive judgement, attention, CEO decisions, closing) from the
 * same real `ControlSnapshot` every other Room capability already reads. Reuses rather than
 * re-derives wherever a real function already exists: `buildTimeGreeting()` is the same
 * time-aware greeting `CompanyStateEngine.ts`'s own `buildCeoCommand()` already produces;
 * `summarizeRecentWork()` is the same real appliedHistory/activity summarizer
 * `CockpitOpening.tsx`'s "While You Were Away" zone already uses; `groupCeoInboxItems()` is
 * the same shared grouping `selectCeoFocus()` above and Threshold Stone already use. Nothing
 * here is a second implementation of any of those three.
 *
 * Deliberately excluded as inputs: `atlasAdvice`, `ceoCommand.reason/todayAdvice`, and Memory
 * — none of those are on this capability's approved source list, and Memory specifically must
 * never appear as briefing content (it describes Atlas's own retention, not the company).
 *
 * Known, named limitation: `CompanyIssue.owner` and `RoadmapInitiative.owner` are untyped
 * strings with no confirmed relationship to `DepartmentId` or `ManagementMember.id` anywhere
 * in the data model (verified by trace, not assumed) — so this function never attributes a
 * specific issue or roadmap item to a specific department or team member. Department/
 * Management capacity is only ever spoken from a department's own real `label`/`status`
 * fields (and, for individual attribution, an exact `ManagementMember.department` match),
 * never inferred from an issue's or initiative's owner string.
 */
export function composeExecutiveBriefing(snapshot: ControlSnapshot): ExecutiveBriefing {
  const greeting = buildTimeGreeting();

  const recent = summarizeRecentWork(snapshot.appliedHistory, snapshot.activity);
  const businessUpdate: string[] = [recent.summary, ...recent.lines];

  const plan = snapshot.livePlan;
  if (plan?.status === "completed") {
    businessUpdate.push(`The current initiative, ${plan.goal}, finished successfully.`);
  } else if (plan?.status === "cancelled") {
    businessUpdate.push(`The initiative "${plan.goal}" was cancelled.`);
  }

  const criticalIssues = snapshot.issues.filter(
    (issue) => issue.status !== "resolved" && (issue.severity === "critical" || issue.severity === "high"),
  );
  const worstDepartment = snapshot.operations.find(
    (operation) => operation.status === "idle" || operation.status === "no-signal",
  );

  const attention: string[] = [];
  if (criticalIssues.length > 0) {
    const top = criticalIssues[0];
    attention.push(`${top.title} needs attention — ${top.impact}.`);
  }
  if (plan?.status === "failed") {
    attention.push(`Today's priority, ${plan.goal}, did not complete successfully.`);
  }
  if ((criticalIssues.length > 0 || plan?.status === "failed") && worstDepartment) {
    attention.push(capacityClause(worstDepartment, snapshot.management));
  }

  const allDepartmentsQuiet =
    snapshot.operations.length > 0 &&
    snapshot.operations.every((operation) => operation.status === "idle" || operation.status === "no-signal");

  let judgement: string;
  if (criticalIssues.length > 0 || plan?.status === "failed") {
    judgement = "One area needs attention today.";
  } else if (allDepartmentsQuiet) {
    judgement = "Team capacity is unusually low across the board today.";
  } else if (recent.hasActivity) {
    judgement = "The business made good operational progress.";
  } else {
    judgement = "Everything looks steady.";
  }

  const grouped = groupCeoInboxItems(snapshot.ceoInbox);
  const waiting = [...grouped.attention, ...grouped.pending];
  const decisions =
    waiting.length === 0
      ? { count: 0, summary: "Nothing is waiting on your decision." }
      : {
          count: waiting.length,
          summary: `${waiting.length} ${waiting.length === 1 ? "decision is" : "decisions are"} waiting for you: ${waiting
            .slice(0, 3)
            .map((item) => item.title)
            .join(", ")}${waiting.length > 3 ? `, and ${waiting.length - 3} more` : ""}.`,
        };

  const nowLane = snapshot.roadmap.filter((item) => item.lane === "now");
  let closing: string;
  if (plan && (plan.status === "executing" || plan.status === "ready" || plan.status === "draft")) {
    closing = `I'm continuing work on ${plan.goal}. I'll let you know if anything needs you.`;
  } else if (nowLane.length > 0) {
    const titles = nowLane
      .slice(0, 2)
      .map((item) => item.title)
      .join(", ");
    closing = `Atlas is currently focused on ${titles}${
      nowLane.length > 2 ? `, and ${nowLane.length - 2} more` : ""
    }. I'll let you know if anything needs you.`;
  } else {
    closing = "Nothing is actively in progress right now. I'll keep watching for what needs your attention next.";
  }

  return { greeting, businessUpdate, judgement, attention, decisions, closing };
}

/** Speaks a department's own real capacity signal, refined with a named individual only when
 * `ManagementMember.department` exactly matches — a type-safe join, never a string guess. */
function capacityClause(department: DepartmentOperation, management: ManagementMember[]): string {
  const blockedMember = management.find(
    (member) => member.department === department.department && member.status === "blocked",
  );
  if (blockedMember) {
    return `${blockedMember.name} on ${department.label} is currently blocked.`;
  }
  return `${department.label} is currently running at reduced capacity.`;
}
