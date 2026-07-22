import { buildTimeGreeting } from "@/atlas/company-state/calculations/scoreUtils";
import { groupCeoInboxItems } from "@/atlas/studio/control/ceoInbox/ceoInboxView";
import type { BusinessOverview, CeoInboxItem, ControlSnapshot, DepartmentOperation } from "@/atlas/studio/control/types";

import { composeSynthesis, type Synthesis } from "./synthesisEngine";
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

/** Phase 5.7 ("Strip Space to Atlas") — a pure name lookup, not a new judgment. The visible
 * Company Doorways (Archway Recess) are retired from the main Space composition this phase;
 * the underlying route and the `DOORWAY_BUSINESS_ID` association above are preserved exactly,
 * and this is the one addition needed to label the restrained text-link fallback that replaces
 * them (`RoomScreen.tsx`) — the same real `BusinessOverview.name` Company Portfolio already
 * shows, nothing invented. */
export function doorwayBusinessName(businesses: BusinessOverview[], doorway: DoorwayId): string {
  const business = businesses.find((candidate) => candidate.id === DOORWAY_BUSINESS_ID[doorway]);
  return business?.name ?? DOORWAY_BUSINESS_ID[doorway];
}

export type ExecutiveBriefing = {
  greeting: string;
  businessUpdate: string[];
  judgement: string;
  attention: string[];
  /** Sprint 5.3 ("Actionable Executive Briefing") — `items` is the same real `CeoInboxItem[]`
   * slice `summary` already describes in prose, now also returned as objects so the briefing
   * step can attach the existing approve/adjust/defer actions to each one. Capped at 3, same
   * as the summary sentence — never the full inbox. */
  decisions: { count: number; summary: string; items: CeoInboxItem[] };
  closing: string;
  /** Sprint 5.1 ("Briefing Generator: Synthese → Briefing") — the ranked, limited Synthesis
   * output Business Update, Executive Judgement and Attention above were translated from.
   * Not rendered directly by the current overlay (Sprint 4.3's three-stage reveal is
   * unchanged); carried here so a future sequential beat (Sprint 5.2 — "one point at a time")
   * can play through the same real, already-ranked points instead of re-deriving them. */
  synthesis: Synthesis;
};

/**
 * Sprint 4.2 ("Executive Briefing v1") composed the six approved briefing sections directly
 * from separate Room capabilities, each with its own ad hoc filter/sort. Sprint 5.1
 * ("Briefing Generator: Synthese → Briefing") replaces that: `composeSynthesis()`
 * (`synthesisEngine.ts`) is now the single cross-domain ranking pass, and this function only
 * translates its already-ranked, already-limited output into the six approved sections — it no
 * longer independently filters `issues`, re-checks `operations`, or re-derives a judgement
 * ladder from raw plan status itself.
 *
 * Per the sprint's own rules, three sections stay sourced directly, not through Synthesis:
 * `buildTimeGreeting()` for the welcome (unchanged since Sprint 4.2 — the same time-aware
 * greeting `CompanyStateEngine.ts`'s own `buildCeoCommand()` already produces); CEO Decisions
 * from `groupCeoInboxItems()` (unchanged — forcing decisions through Synthesis would create
 * false semantics, since Synthesis's own recommendation is deliberately a *different* fact:
 * the single most important item, not the full waiting list); and Closing from current active
 * work (Live Plan / Roadmap Now lane), unless Synthesis carries a real recommendation, in which
 * case the briefing ends with that instead, per rule 4.
 *
 * Deliberately excluded as inputs, same as Sprint 4.2: `atlasAdvice`, `ceoCommand.reason/
 * todayAdvice`, and Memory — none are on this capability's approved source list, and Memory
 * specifically must never appear as briefing content.
 *
 * Known, named limitation (carried over, still true): `CompanyIssue.owner` and
 * `RoadmapInitiative.owner` are untyped strings with no confirmed relationship to
 * `DepartmentId` or `ManagementMember.id` — so Synthesis, and this translation layer, never
 * attribute a specific issue to a specific team member, only to a department via an exact
 * `ManagementMember.department` match (see `synthesisEngine.ts`'s `capacityClause`).
 */
export function composeExecutiveBriefing(snapshot: ControlSnapshot): ExecutiveBriefing {
  const greeting = buildTimeGreeting();
  const synthesis = composeSynthesis(snapshot);

  // Headlines never carry their own trailing punctuation (see `synthesisEngine.ts`) — this is
  // the one place a "." is added, so no section can end up with an accidental double period
  // regardless of what real evidence text (e.g. `CompanyIssue.impact`) already ends with.
  const workPoints = synthesis.points.filter((point) => !point.requiresAttention);
  const businessUpdate: string[] = workPoints.flatMap((point) => {
    const lines = [`${point.headline}.`];
    // "work" evidence is the same real, already-limited titles `summarizeRecentWork()`
    // produced (`;`-joined on the point itself for traceability) — split back out here purely
    // for display, not re-derived from any raw source.
    if (point.kind === "work" && point.evidence) {
      lines.push(...point.evidence.split("; ").filter(Boolean));
    }
    return lines;
  });

  const attention: string[] = synthesis.points
    .filter((point) => point.requiresAttention)
    .map((point) => `${point.headline} — ${point.evidence}`);

  let judgement: string;
  if (attention.length > 0) {
    judgement = "One area needs attention today.";
  } else if (synthesis.capacityConstrained) {
    judgement = "Team capacity is unusually low across the board today.";
  } else if (synthesis.hasMeaningfulActivity) {
    judgement = "The business made good operational progress.";
  } else {
    judgement = "Everything looks steady.";
  }

  const grouped = groupCeoInboxItems(snapshot.ceoInbox);
  const waiting = [...grouped.attention, ...grouped.pending];
  // Sprint 5.3 ("Actionable Executive Briefing") — `topWaiting` is the exact same slice the
  // summary sentence below already reduced `waiting` to; now also returned as real
  // `CeoInboxItem[]` (not just their titles) so the presentation layer can attach the existing
  // approve/adjust/defer actions to each one. No new selection, no new ranking — one already-
  // computed list, read twice.
  const topWaiting = waiting.slice(0, 3);
  const decisions =
    waiting.length === 0
      ? { count: 0, summary: "Nothing is waiting on your decision.", items: [] as CeoInboxItem[] }
      : {
          count: waiting.length,
          summary: `${waiting.length} ${waiting.length === 1 ? "decision is" : "decisions are"} waiting for you: ${topWaiting
            .map((item) => item.title)
            .join(", ")}${waiting.length > 3 ? `, and ${waiting.length - 3} more` : ""}.`,
          items: topWaiting,
        };

  const closing = composeClosing(snapshot, synthesis);

  return { greeting, businessUpdate, judgement, attention, decisions, closing, synthesis };
}

/** Closing stays sourced directly from current active work (rule 2), unless Synthesis carries a
 * real recommendation (rule 4) — in which case the briefing ends there instead, with an
 * explicit pointer to the existing CEO Inbox approve/adjust/defer path rather than any new
 * approval mechanism. Never both: a recommendation, when present, replaces the generic
 * "continuing work on X" line rather than appending to it, so the closing never restates the
 * same fact twice. */
function composeClosing(snapshot: ControlSnapshot, synthesis: Synthesis): string {
  if (synthesis.recommendation) {
    return `My recommendation: ${synthesis.recommendation.text} It's waiting for you in the CEO Inbox — approve, adjust, or defer whenever you're ready.`;
  }

  const plan = snapshot.livePlan;
  if (plan && (plan.status === "executing" || plan.status === "ready" || plan.status === "draft")) {
    return `I'm continuing work on ${plan.goal}. I'll let you know if anything needs you.`;
  }

  const nowLane = snapshot.roadmap.filter((item) => item.lane === "now");
  if (nowLane.length > 0) {
    const titles = nowLane
      .slice(0, 2)
      .map((item) => item.title)
      .join(", ");
    return `Atlas is currently focused on ${titles}${
      nowLane.length > 2 ? `, and ${nowLane.length - 2} more` : ""
    }. I'll let you know if anything needs you.`;
  }

  return "Nothing is actively in progress right now. I'll keep watching for what needs your attention next.";
}
