/**
 * Team Identity Foundation — Sprint 1.1.
 *
 * Pure vocabulary and schema, no I/O. See ATLAS_SPRINT_1.1_IMPLEMENTATION_PLAN.md for the
 * full architecture and reasoning.
 *
 * Of the four statuses below, TeamAttribution.ts only ever produces "confirmed" and "failed".
 * "assigned" and "unconfirmed" are shared vocabulary reserved for the Organization Model,
 * which owns assignments and — in a later sprint — will compute them by comparing its own
 * assignments against what TeamAttribution has written to Executive Memory's action-log.
 * TeamAttribution itself never manages, stores, or queries assignments.
 */

/** The five canonical team identities. Distinct from ATLAS_AI_TEAM's CoreAgentId and the
 * Organization Model's fictional workerId — see TeamIdentityResolver.ts for how those relate. */
export type TeamIdentityId = "tom" | "anna" | "scout" | "yara" | "jerry";

export interface TeamIdentity {
  id: TeamIdentityId;
  name: string;
  /** What this identity is responsible for — description only, no capability wiring. */
  responsibility: string;
}

/** Shared status vocabulary across the whole Identity Foundation. See the file-level comment
 * above for which half of these TeamAttribution actually produces. */
export type TeamActionStatus = "assigned" | "confirmed" | "failed" | "unconfirmed";

/** The subset of TeamActionStatus that TeamAttribution is responsible for. */
export type TeamVerifiedOutcomeStatus = Extract<TeamActionStatus, "confirmed" | "failed">;

/** Required, typed proof that a capability actually, verifiably succeeded. `succeeded` is
 * typed as the literal `true` (not `boolean`) so that passing `{ succeeded: false, ... }` is a
 * compile error, not a runtime bug — confirmCompletion() cannot be called without a value of
 * this exact shape. See TeamAttribution.ts's "harde regel". */
export interface TeamSuccessEvidence {
  succeeded: true;
  /** Which capability reported the success — e.g. "content-generation-engine". */
  reportedBy: string;
  /** When the underlying capability itself completed (not when this is recorded). */
  occurredAt: string;
}

/** Details recorded when a capability explicitly reports failure. No "hard rule" gate here —
 * failure never confirms anyone, so there is nothing to protect against. */
export interface TeamFailureDetails {
  reason: string;
  reportedBy: string;
  occurredAt: string;
}

/** Payload shape written into Executive Memory via appendAction() — namespace
 * "team-attribution" (see TeamAttribution.ts), type = the TeamIdentityId. The one shared
 * schema every future role sprint uses; nothing else in this sprint writes to Executive
 * Memory. */
export interface TeamActionPayload {
  identityId: TeamIdentityId;
  /** Which capability produced this outcome — e.g. "execution-engine". */
  source: string;
  /** Reference to the work item this outcome is about — e.g. a mission ID. */
  workItemRef: string;
  status: TeamVerifiedOutcomeStatus;
  description: string;
  reportedBy: string;
  occurredAt: string;
}
