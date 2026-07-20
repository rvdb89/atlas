import type { ExecutiveMemoryContract } from "@/atlas/executive-memory";

import type {
  TeamActionPayload,
  TeamFailureDetails,
  TeamIdentityId,
  TeamSuccessEvidence,
} from "./team.types";

/**
 * TeamAttribution — Sprint 1.1.
 *
 * Exactly one responsibility: recording a VERIFIED OUTCOME of already-executed work. Never
 * manages assignments — assignments are the Organization Model's responsibility, wired up in a
 * later sprint — and never decides whether work succeeded; the caller must already know that,
 * and must pass typed evidence to prove it (see confirmCompletion()'s required `evidence`
 * parameter).
 *
 * Takes an ExecutiveMemoryContract as an explicit parameter on every call — this module never
 * constructs its own client and makes no assumption about transport. The caller decides
 * whether that is the in-process Service (as scripts/atlas-runtime.ts will use in a later
 * sprint, per the Sprint 0.3 decision to avoid an HTTP round-trip to itself) or the HTTP
 * client used elsewhere. See ATLAS_SPRINT_1.1_IMPLEMENTATION_PLAN.md for the full reasoning.
 */

export const TEAM_ATTRIBUTION_NAMESPACE = "team-attribution";

export interface ConfirmCompletionInput {
  identityId: TeamIdentityId;
  /** Which capability produced this outcome — e.g. "execution-engine". */
  source: string;
  /** Reference to the work item this outcome is about — e.g. a mission ID. */
  workItemRef: string;
  description: string;
  /** Required — see team.types.ts's TeamSuccessEvidence. There is no overload, default, or
   * fallback that allows this to be omitted. */
  evidence: TeamSuccessEvidence;
}

export interface RecordFailureInput {
  identityId: TeamIdentityId;
  source: string;
  workItemRef: string;
  description: string;
  failure: TeamFailureDetails;
}

function buildStoredPayload(
  identityId: TeamIdentityId,
  source: string,
  workItemRef: string,
  status: TeamActionPayload["status"],
  description: string,
  reportedBy: string,
  occurredAt: string,
): TeamActionPayload {
  return { identityId, source, workItemRef, status, description, reportedBy, occurredAt };
}

/**
 * The ONLY function in this module that can produce a "confirmed" action — and it can only do
 * so when the caller supplies `input.evidence`, a value of the required TeamSuccessEvidence
 * shape (`succeeded: true` is a literal type, not `boolean` — see team.types.ts). This is the
 * "harde regel" from the implementation plan, enforced by the type system rather than by
 * convention: there is no code path here that reaches Executive Memory without it.
 */
export async function confirmCompletion(
  executiveMemory: ExecutiveMemoryContract,
  input: ConfirmCompletionInput,
): Promise<{ id: string; occurredAt: string }> {
  const payload = buildStoredPayload(
    input.identityId,
    input.source,
    input.workItemRef,
    "confirmed",
    input.description,
    input.evidence.reportedBy,
    input.evidence.occurredAt,
  );

  return executiveMemory.appendAction(
    TEAM_ATTRIBUTION_NAMESPACE,
    input.identityId,
    payload as unknown as Record<string, unknown>,
  );
}

/**
 * Records an explicit failure. Never produces a "confirmed" outcome and never confirms
 * anyone — a `failed` entry exists purely for visibility and diagnosis.
 */
export async function recordFailure(
  executiveMemory: ExecutiveMemoryContract,
  input: RecordFailureInput,
): Promise<{ id: string; occurredAt: string }> {
  const payload = buildStoredPayload(
    input.identityId,
    input.source,
    input.workItemRef,
    "failed",
    `${input.description} — reden: ${input.failure.reason}`,
    input.failure.reportedBy,
    input.failure.occurredAt,
  );

  return executiveMemory.appendAction(
    TEAM_ATTRIBUTION_NAMESPACE,
    input.identityId,
    payload as unknown as Record<string, unknown>,
  );
}

/** Read-only convenience wrapper around Executive Memory's listActions(), scoped to the
 * team-attribution namespace. Not assignment tracking — just a namespace-scoped read of what
 * TeamAttribution itself has written. */
export function listTeamActions(
  executiveMemory: ExecutiveMemoryContract,
  options?: { since?: string; limit?: number },
) {
  return executiveMemory.listActions(TEAM_ATTRIBUTION_NAMESPACE, options);
}
