import type { ExecutiveBriefing } from "./roomData";
import type { CeoInboxItem } from "@/atlas/studio/control/types";

/**
 * Briefing Steps — Sprint 5.2 ("Sequential Business Briefing").
 *
 * Purely a presentation-layer sequencer: it takes the already-composed `ExecutiveBriefing`
 * (Sprint 4.2/5.1 — `roomData.ts`'s `composeExecutiveBriefing()`, itself now a translation of
 * Sprint 5.1's Synthesis output) and splits its six fields into an ordered list of steps for
 * `ExecutiveBriefingOverlay.tsx` to reveal one at a time. Nothing here recomputes, re-ranks, or
 * re-derives any briefing content — every line below is read verbatim from the `ExecutiveBriefing`
 * object that already existed before this sprint. This is the "Do not redesign the data" rule,
 * applied literally: `roomData.ts` and `synthesisEngine.ts` are both untouched by Sprint 5.2.
 */

export type BriefingStepKind = "welcome" | "businessUpdate" | "judgement" | "attention" | "decisions" | "closing";

export type BriefingStep = {
  id: string;
  kind: BriefingStepKind;
  lines: string[];
  /** Sprint 5.3 ("Actionable Executive Briefing") — only ever set on the `"decisions"` step,
   * only ever the same real `CeoInboxItem[]` `ExecutiveBriefing.decisions.items` already
   * carries. Every other step kind has no existing CEO Inbox action to attach and stays
   * informational, exactly as `CompanyIssue` and `LivePlanSummary` have no approve/adjust/defer
   * mechanism anywhere in this codebase (verified in Sprint 5.1's investigation). */
  decisionItems?: CeoInboxItem[];
};

/**
 * The approved six-part order is fixed and non-negotiable — Welcome, Business Update,
 * Executive Judgement, Attention, CEO Decisions, Closing — but Attention and CEO Decisions are
 * each only included as a step when the underlying `ExecutiveBriefing` actually has something
 * there (`attention.length > 0`, `decisions.count > 0`), exactly mirroring the conditions the
 * Sprint 4.2/4.3 overlay already used to decide whether to render those sections at all. A
 * quiet-state briefing (no attention, no decisions) still produces a valid, non-empty sequence:
 * Welcome → Business Update → Executive Judgement → Closing.
 */
export function buildBriefingSteps(briefing: ExecutiveBriefing): BriefingStep[] {
  const steps: BriefingStep[] = [
    { id: "welcome", kind: "welcome", lines: [`${briefing.greeting}.`] },
    { id: "business-update", kind: "businessUpdate", lines: briefing.businessUpdate },
    { id: "judgement", kind: "judgement", lines: [briefing.judgement] },
  ];

  if (briefing.attention.length > 0) {
    steps.push({ id: "attention", kind: "attention", lines: briefing.attention });
  }

  if (briefing.decisions.count > 0) {
    steps.push({
      id: "decisions",
      kind: "decisions",
      lines: [briefing.decisions.summary],
      decisionItems: briefing.decisions.items,
    });
  }

  steps.push({ id: "closing", kind: "closing", lines: [briefing.closing] });

  return steps;
}
