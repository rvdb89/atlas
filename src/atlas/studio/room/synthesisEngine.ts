import { groupCeoInboxItems } from "@/atlas/studio/control/ceoInbox/ceoInboxView";
import type { ControlSnapshot, DepartmentOperation, ManagementMember } from "@/atlas/studio/control/types";
import { summarizeRecentWork } from "@/atlas/studio/control/v2/cockpitOpeningHelpers";

/**
 * Synthesis Engine — Sprint 5.1 ("Briefing Generator: Synthese → Briefing").
 *
 * Investigation finding, stated plainly: no cross-domain "Synthese Engine" existed anywhere in
 * this codebase before this sprint. `ATLAS_BUILD_ROADMAP.md`'s Fase 3 describes one as a
 * Foundation-track deliverable ("Synthese Engine — cross-domein prioritering én
 * verhaalopbouw"), but it was never built — the only existing file with "synthesizer" in its
 * name (`src/atlas/intelligence/ai-suggestions/synthesizer.ts`) is an unrelated content-gap
 * suggestion generator, not a cross-domain narrative ranker. `composeExecutiveBriefing()`
 * (`roomData.ts`) was, until this sprint, the only place doing any of this ranking — and it did
 * so independently per source (its own `criticalIssues.filter(...)`, its own
 * `worstDepartment.find(...)`, its own plan-status branches), exactly the "second parallel
 * prioritization path" this sprint was asked to remove. This file is that removal: one real,
 * minimal ranking pass, built now, because Sprint 5.1 explicitly named it as this sprint's own
 * scope ("Briefing Generator: Synthese → Briefing") rather than deferring it — see the
 * management summary for the full note on this discrepancy.
 *
 * Every input below is exactly the same real data the Room already reads elsewhere:
 * `CompanyIssue[]`, `LivePlanSummary`, `DepartmentOperation[]`/`ManagementMember[]`, and
 * `appliedHistory`/`activity` via the existing `summarizeRecentWork()` (already reused by
 * `composeExecutiveBriefing()` since Sprint 4.2 — not re-implemented here). Nothing new is
 * fetched and nothing is invented; this only changes *where* the ranking decision is made.
 */

export type SynthesisPointKind = "issue" | "plan" | "work";

export type SynthesisPoint = {
  id: string;
  kind: SynthesisPointKind;
  /** 0 = most important. Preserved on the point itself so a future sequential beat (Sprint
   * 5.2's "one point at a time" playback) can render strictly in this order without re-deriving
   * it. */
  rank: number;
  headline: string;
  evidence: string;
  requiresAttention: boolean;
  /** A real `DepartmentId`, only ever set when the point is genuinely traceable to one
   * department's own status (never invented) — the optional "visual reference" Sprint 5.1's
   * sequential-readiness requirement asks each point to be able to carry. */
  visualReference?: string;
};

export type SynthesisRecommendation = {
  text: string;
  /** The real `CeoInboxItem.id` this recommendation came from — traceability, and the CEO's
   * existing approve/adjust/defer path (Threshold Stone / CEO Inbox) is reached through this
   * same id. No new approval mechanism is introduced. */
  ceoInboxItemId: string;
};

export type Synthesis = {
  generatedAt: string;
  /** Already ranked, already limited — never the full issues/activity/plan list. */
  points: SynthesisPoint[];
  hasMeaningfulActivity: boolean;
  /** Folded in as supporting evidence only (Department Wall's own real `operations` status) —
   * never surfaced as its own point, never re-read independently by the briefing composer. */
  capacityConstrained: boolean;
  /** Present only when a real CEO Inbox item carries a non-empty `.recommendation` — never
   * manufactured when the underlying data has none. */
  recommendation?: SynthesisRecommendation;
};

/**
 * The one cross-domain ranking pass. Issues are ranked against each other by severity (critical
 * over high); only the single top-ranked open issue survives into `points` — every other open
 * issue, however real, is genuinely dropped here and must never reappear elsewhere in the
 * briefing. A failed Live Plan and a completed/cancelled Live Plan are evaluated independently
 * (a plan and an issue are different kinds of fact, not competing for the same rank), then the
 * existing `summarizeRecentWork()` result becomes the final point — reused exactly as it was
 * before this sprint, not re-implemented.
 */
export function composeSynthesis(snapshot: ControlSnapshot): Synthesis {
  const points: SynthesisPoint[] = [];

  const openIssues = snapshot.issues.filter((issue) => issue.status !== "resolved");
  const rankedIssues = [
    ...openIssues.filter((issue) => issue.severity === "critical"),
    ...openIssues.filter((issue) => issue.severity === "high"),
  ];
  const topIssue = rankedIssues[0];
  if (topIssue) {
    points.push({
      id: `issue-${topIssue.id}`,
      kind: "issue",
      rank: points.length,
      headline: `${topIssue.title} needs attention`,
      evidence: topIssue.impact,
      requiresAttention: true,
    });
  }

  const plan = snapshot.livePlan;
  if (plan?.status === "failed") {
    points.push({
      id: `plan-${plan.id}`,
      kind: "plan",
      rank: points.length,
      headline: `Today's priority, ${plan.goal}, did not complete successfully`,
      evidence: "The plan failed before finishing.",
      requiresAttention: true,
    });
  } else if (plan?.status === "completed") {
    points.push({
      id: `plan-${plan.id}`,
      kind: "plan",
      rank: points.length,
      headline: `The current initiative, ${plan.goal}, finished successfully`,
      evidence: "Live Plan marked complete.",
      requiresAttention: false,
    });
  } else if (plan?.status === "cancelled") {
    points.push({
      id: `plan-${plan.id}`,
      kind: "plan",
      rank: points.length,
      headline: `The initiative "${plan.goal}" was cancelled`,
      evidence: "Live Plan marked cancelled.",
      requiresAttention: false,
    });
  }

  const recent = summarizeRecentWork(snapshot.appliedHistory, snapshot.activity);
  points.push({
    id: "recent-work",
    kind: "work",
    rank: points.length,
    // Headline is kept free of trailing punctuation, same as every other point above — the
    // translation layer (`roomData.ts`) is the one place that decides final sentence-ending
    // punctuation, so no section can end up with an accidental double period.
    headline: recent.summary.replace(/\.$/, ""),
    evidence: recent.lines.join("; "),
    requiresAttention: false,
  });

  const attentionPresent = points.some((point) => point.requiresAttention);
  if (attentionPresent) {
    const worstDepartment = snapshot.operations.find(
      (operation) => operation.status === "idle" || operation.status === "no-signal",
    );
    const topAttentionPoint = points.find((point) => point.requiresAttention);
    if (worstDepartment && topAttentionPoint) {
      topAttentionPoint.evidence = `${topAttentionPoint.evidence} ${capacityClause(worstDepartment, snapshot.management)}`;
      topAttentionPoint.visualReference = worstDepartment.department;
    }
  }

  const capacityConstrained =
    !attentionPresent &&
    snapshot.operations.length > 0 &&
    snapshot.operations.every((operation) => operation.status === "idle" || operation.status === "no-signal");

  return {
    generatedAt: snapshot.collectedAt,
    points,
    hasMeaningfulActivity: recent.hasActivity,
    capacityConstrained,
    recommendation: selectRecommendation(snapshot),
  };
}

/** The only "approve or respond" path anywhere in this codebase is CEO Inbox's existing
 * approve/adjust/defer (`useControlDashboard.ts`) — so a recommendation can only ever be the
 * real `.recommendation` text already carried by the single most important CEO Inbox item
 * (reusing `groupCeoInboxItems()`'s own ranking, not a second sort). "Most important" here
 * means: an item stuck after approval (`attention`) outranks one still merely waiting
 * (`pending`), matching the priority `selectCeoFocus()` already uses for Threshold Stone. */
function selectRecommendation(snapshot: ControlSnapshot): SynthesisRecommendation | undefined {
  const grouped = groupCeoInboxItems(snapshot.ceoInbox);
  const top = grouped.attention[0] ?? grouped.pending[0];
  if (!top || !top.recommendation) {
    return undefined;
  }
  return { text: top.recommendation, ceoInboxItemId: top.id };
}

/** Speaks a department's own real capacity signal, refined with a named individual only when
 * `ManagementMember.department` exactly matches — a type-safe join, never a string guess.
 * Carried over unchanged from `roomData.ts`'s Sprint 4.2 version of this same helper. */
function capacityClause(department: DepartmentOperation, management: ManagementMember[]): string {
  const blockedMember = management.find(
    (member) => member.department === department.department && member.status === "blocked",
  );
  if (blockedMember) {
    return `${blockedMember.name} on ${department.label} is currently blocked.`;
  }
  return `${department.label} is currently running at reduced capacity.`;
}
