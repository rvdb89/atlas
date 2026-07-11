import { groupCeoInboxItems } from "../ceoInbox/ceoInboxView";
import type {
  AppliedMissionRecord,
  AtlasAdvice,
  CeoInboxItem,
  CompanyActivityEvent,
  CompanyStateMeta,
} from "../types";
import { ACTIVITY_TYPE_LABELS } from "../types";

export type OpeningVerdict = {
  /** Exactly one sentence — the living, narrative first line ("Atlas worked while you were
   * away."), not a bare status label. See composeOpeningVerdict below. */
  verdict: string;
  /** Optional second sentence, only ever present when there is something genuinely worth
   * naming. Grounded in `hasEscalation` (see below) so it can never claim "attention" is needed
   * while the Needs You zone simultaneously says nothing needs the CEO — see fix note below. */
  note?: string;
};

/** CEO_COCKPIT.md · Chapters 2 & 5 — First Impression / Company Health. A CEO does not need a
 * status label ("Atlas is progressing well."), they need to feel like they just walked into a
 * living company. This composes the opening line from what Atlas actually *did* — the same real
 * signal `summarizeRecentWork` already computes — instead of a bare health adjective. The
 * company-health *judgment* itself hasn't disappeared: it still drives the pill via
 * `describeHeaderStatus`/`healthTone`, and surfaces here as `note` whenever something genuinely
 * needs the CEO.
 *
 * CEO decision 2026-07-11: "In plaats van uitsluitend een status... wil ik dat de opening voelt
 * alsof ik mijn bedrijf binnenloop." Kept deliberately free of specific counts (those belong to
 * the "While You Were Away" block below, so this line and that block don't just repeat each
 * other) — this is the warm one-line greeting, not the report.
 *
 * Bugfix 2026-07-11 (CEO-reported, carried over from the previous round): `state.overallStatus`
 * can be "attention" or "blocked" for reasons that never produce a CEO Inbox item — e.g. low
 * memory/platform health, a blocked agent/sprint (see `calculateOverallStatus` in
 * company-state/calculations/kpiCalculations.ts, shared with other Atlas Control surfaces and out
 * of scope to change this phase). All "needs attention" language stays gated on `hasEscalation`
 * (true only when `selectMostImportantInboxItem` actually found something) so the note can never
 * contradict "Needs You". When something is off internally but nothing has been escalated, that
 * is Atlas managing it on its own — the verdict stays calm instead of manufacturing urgency. */
export function composeOpeningVerdict(
  companyName: string,
  state: CompanyStateMeta,
  recent: RecentWorkSummary,
  hasEscalation: boolean,
): OpeningVerdict {
  const verdict = recent.hasActivity
    ? `${companyName} worked while you were away.`
    : `Everything at ${companyName} stayed steady while you were away.`;

  if (state.overallStatus === "blocked") {
    return {
      verdict,
      note: hasEscalation
        ? "One decision needs you before Atlas can continue."
        : "Atlas is working through a blocker on its own.",
    };
  }

  if (state.overallStatus === "attention" && hasEscalation) {
    return { verdict, note: "One decision is waiting for you." };
  }

  return { verdict };
}

/** CEO_COCKPIT.md · Chapter 2 — First Impression. The status pill next to the greeting must
 * never say more than "Needs You" itself is willing to back up — see the bugfix note above.
 * "Attention needed" / "Blocked" only ever appear here when `hasEscalation` is true. */
export function describeHeaderStatus(state: CompanyStateMeta, hasEscalation: boolean): string {
  if (!hasEscalation) return "Healthy";
  return state.overallStatus === "blocked" ? "Blocked" : "Attention needed";
}

function ensureSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** CEO_COCKPIT.md · Chapter 3 — CEO Briefing. Atlas speaks TO the CEO, not about itself: no
 * "Recommended:" labels, no system/process language. Turns the raw imperative recommendation
 * string ("Focus on X — Title") into a first-person sentence ("I recommend focusing on X —
 * Title."). Returns "" (and is skipped by the caller) for recommendation text that doesn't match
 * the expected "Focus on …" shape — e.g. the "no initiative selected" fallback — rather than
 * force an awkward sentence out of it. */
function toRecommendationSentence(recommendation: string): string {
  const match = recommendation.match(/^Focus on (.+)$/i);
  if (!match) return "";
  return ensureSentence(`I recommend focusing on ${match[1]}`);
}

/** CEO_COCKPIT.md · Chapter 3 — CEO Briefing. "The Cockpit writes a briefing, not a report."
 * Deliberately does NOT read `ceoCommand.reason` / `atlasAdvice.rationale` — those are
 * explanatory fields of unknown, potentially unbounded length. Instead this composes 2-3 short
 * sentences purely from fields that are already short by construction: `headline` (also shown,
 * unclamped, as CommandPanel's "Today's focus") and `recommendation` (CommandPanel's "Next
 * recommendation"). No `numberOfLines` truncation anywhere here — there is never a long string
 * to cut.
 *
 * Bugfix 2026-07-11 (CEO-reported): `advice.headline` used to be generated at the source
 * (controlDataService.ts) as `"Atlas Runtime — live Claude verdict (cycle N)"` — a technical
 * process label, not something Atlas would ever say to the CEO. Fixed at the source (the same
 * field CommandPanel's "Today's focus" reads, so that surface is now honest too, with no
 * component redesign involved) to read as a natural priority statement instead. */
export function composeBriefing(advice: AtlasAdvice, state: CompanyStateMeta): string[] {
  const sentences: string[] = [];

  if (advice.headline) {
    sentences.push(ensureSentence(advice.headline));
  }

  const recommendationSentence = toRecommendationSentence(advice.recommendation);
  if (recommendationSentence) {
    sentences.push(recommendationSentence);
  }

  if (state.counts.blockers > 0) {
    // Informational, not a call to action: Atlas reporting its own status, never implying the
    // CEO must do something about it — that claim belongs exclusively to "Needs You".
    const noun = state.counts.blockers === 1 ? "blocker" : "blockers";
    sentences.push(`Atlas is currently working through ${state.counts.blockers} ${noun}.`);
  }

  return sentences.slice(0, 3);
}

export type RecentWorkSummary = {
  hasActivity: boolean;
  summary: string;
  lines: string[];
};

/** CEO_COCKPIT.md · Chapter 4 — Living Company. Titled "While You Were Away" in the UI.
 *
 * CEO decision 2026-07-11 (CEO_COCKPIT.md Amendementen v1.0.1): accepted as product language for
 * the Cockpit Opening on two standing conditions — (1) content stays based exclusively on real
 * recent activity (appliedHistory / activity feed — never invented), and (2) no specific time
 * claims are made as long as there is no `lastSeen`/session-awareness concept. There is still no
 * lastSeen/session timestamp anywhere in the codebase (verified 2026-07-11) — this reports the
 * most recent real, applied work, not work scoped to any specific absence.
 *
 * EXPLICIT FOLLOW-UP (recorded, not a blocker for this phase): Atlas needs a reliable `lastSeen`
 * or session-awareness concept eventually. From the moment that exists, "While You Were Away"
 * must literally and exactly mean activity since the CEO's previous visit — not "most recent
 * known activity" in general, as it does today. When that concept is built, this function (and
 * its two callers in CockpitOpening.tsx) need a real audit against that new guarantee.
 *
 * Bullets deliberately show only `mission.title` / the activity type label — short, title-like
 * fields by construction — never `mission.summary` (a full descriptive sentence) or file
 * counts; those move to the existing Activity Feed section instead of being crammed in here.
 * `numberOfLines` on each bullet in the component is a safety net only, for the rare
 * unusually-long title — not how shortness is primarily achieved. */
export function summarizeRecentWork(
  appliedHistory: AppliedMissionRecord[],
  activity: CompanyActivityEvent[],
  limit = 3,
): RecentWorkSummary {
  const recentMissions = [...appliedHistory]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit);

  if (recentMissions.length > 0) {
    const noun = recentMissions.length === 1 ? "improvement" : "improvements";
    return {
      hasActivity: true,
      summary: `Atlas completed ${recentMissions.length} ${noun} while you were away.`,
      lines: recentMissions.map((mission) => mission.title),
    };
  }

  if (activity.length > 0) {
    return {
      hasActivity: true,
      summary: "Atlas worked while you were away.",
      lines: activity.slice(0, limit).map((event) => ACTIVITY_TYPE_LABELS[event.type] ?? event.message),
    };
  }

  return {
    hasActivity: false,
    summary: "Everything remained stable while you were away.",
    lines: [],
  };
}

/** CEO_COCKPIT.md · Chapter 7 — CEO Inbox. "Needs You" must show the most important escalated
 * decision, not just the first pending item. Source of truth for grouping/ranking is
 * `groupCeoInboxItems` (src/atlas/studio/control/ceoInbox/ceoInboxView.ts) — it already groups
 * items into pending/attention/deferred/resolved and sorts "pending" by URGENCY_RANK
 * (urgent > high > medium > low). No new general ranking engine is introduced here — this is
 * only an explicit presentation rule for the Cockpit Opening, on top of that existing output:
 *
 * 1. `attention` first — approved but never actually applied (see ApprovalModel.applyWarning)
 *    is a broken promise to the CEO, and asks more directly for their attention than a fresh
 *    approval request does.
 * 2. `pending` next — already sorted by URGENCY_RANK by groupCeoInboxItems itself.
 * 3. Otherwise nothing — a calm, honest "nothing needs you" is a valid outcome. */
export function selectMostImportantInboxItem(items: CeoInboxItem[]): CeoInboxItem | undefined {
  const grouped = groupCeoInboxItems(items);
  return grouped.attention[0] ?? grouped.pending[0];
}
