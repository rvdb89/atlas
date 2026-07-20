import type { ExecutiveMemoryContract } from "@/atlas/executive-memory";

import { confirmCompletion, recordFailure } from "./TeamAttribution";
import { resolveTeamIdentityId } from "./TeamIdentityResolver";

/**
 * EngineeringAttributionReporter — Sprint 1.3 (Tom).
 *
 * Contract + concrete adapter for attributing real Apply Engine outcomes
 * (scripts/atlas/applyEngine.ts) to Tom, mirroring PublishingAttributionReporter.ts's role for
 * the publishing pipeline (Sprint 1.2) — deliberately a SEPARATE contract, not a reuse of
 * TeamAttributionReporter (src/atlas/publishing/types.ts). That one is shaped around six
 * distinct publishing capability *stages* per pipeline run; this one is shaped around a single
 * apply *attempt* per mission, keyed on `{missionId}:{archiveDirName}`. Forcing a shared
 * generic interface across two substantively different event shapes would only add
 * indirection without a real benefit.
 *
 * applyEngine.ts only ever imports the four TYPES below (`import type`, fully erased at
 * compile time) — never `createEngineeringAttributionReporter` or anything else in this file
 * that actually touches Executive Memory or TeamAttribution. That keeps the dependency
 * direction the same as Sprint 1.2: the executing engineering component defines/knows only a
 * domain-neutral callback shape; this file is the only place that gives it concrete meaning.
 */

/**
 * The only engineering capability identity that exists today: applyEngine.ts has no per-action
 * "agentId" concept (unlike the publishing pipeline's six capabilities) — applying a proposal
 * is one deterministic Node operation, not several distinct AI-driven stages. "claude-engineer"
 * already resolves to "tom" in TeamIdentityResolver.ts's EXISTING_ID_TO_TEAM_IDENTITY table
 * (Sprint 1.1) — no resolver change was needed for this sprint. Kept as a narrow, single-value
 * union rather than a plain string so the one real value stays explicit and typo-proof.
 */
export type EngineeringCapabilityId = "claude-engineer";

export type EngineeringActionEvent = {
  capabilityId: EngineeringCapabilityId;
  /** For confirmed events: `{missionId}:{archiveDirName}` — the most granular real identifier
   * pair that already exists at apply time (the archive folder Apply Engine renames
   * proposed-changes/ into). There is no per-file id anywhere in this codebase, so this is the
   * closest existing combination, not an invented one. For failed events (where an archive may
   * not exist yet — the throw can happen before the rename), see the file-level note in
   * applyEngine.ts on the failure workItemRef. */
  workItemRef: string;
  occurredAt: string;
};

export type EngineeringActionConfirmedEvent = EngineeringActionEvent & { description: string };
export type EngineeringActionFailedEvent = EngineeringActionEvent & { reason: string };

/** No onActionStarted method: nothing in Sprint 1.3 needs a "started" notification, and
 * Sprint 1.1's rule (TeamAttribution only ever persists confirmed/failed) makes one pointless
 * to add. */
export interface EngineeringAttributionReporter {
  onActionConfirmed?(event: EngineeringActionConfirmedEvent): void | Promise<void>;
  onActionFailed?(event: EngineeringActionFailedEvent): void | Promise<void>;
}

/**
 * Any Executive Memory write failure here is caught and logged, never rethrown — fail-open,
 * same philosophy as PublishingAttributionReporter.ts and CompanyStateStore.ts. A broken
 * attribution write must never surface as an apply failure, let alone mask a real engineering
 * outcome (the files are already safely applied to the working tree by the time this runs).
 */
export function createEngineeringAttributionReporter(
  executiveMemory: ExecutiveMemoryContract,
): EngineeringAttributionReporter {
  return {
    async onActionConfirmed(event: EngineeringActionConfirmedEvent): Promise<void> {
      const identityId = resolveTeamIdentityId(event.capabilityId);
      if (!identityId) {
        // Not expected for "claude-engineer" (already mapped), but resolveTeamIdentityId is
        // additive and this guards against future drift — nothing to attribute, not an error.
        return;
      }

      try {
        await confirmCompletion(executiveMemory, {
          identityId,
          source: `apply-engine:${event.capabilityId}`,
          workItemRef: event.workItemRef,
          description: event.description,
          evidence: {
            succeeded: true,
            reportedBy: `apply-engine:${event.capabilityId}`,
            occurredAt: event.occurredAt,
          },
        });
      } catch (error) {
        console.error(
          "EngineeringAttributionReporter: kon confirmed-attributie niet vastleggen:",
          error instanceof Error ? error.message : error,
        );
      }
    },

    async onActionFailed(event: EngineeringActionFailedEvent): Promise<void> {
      const identityId = resolveTeamIdentityId(event.capabilityId);
      if (!identityId) {
        return;
      }

      try {
        await recordFailure(executiveMemory, {
          identityId,
          source: `apply-engine:${event.capabilityId}`,
          workItemRef: event.workItemRef,
          description: `Capability ${event.capabilityId} mislukt tijdens het toepassen van een execution proposal.`,
          failure: {
            reason: event.reason,
            reportedBy: `apply-engine:${event.capabilityId}`,
            occurredAt: event.occurredAt,
          },
        });
      } catch (error) {
        console.error(
          "EngineeringAttributionReporter: kon failed-attributie niet vastleggen:",
          error instanceof Error ? error.message : error,
        );
      }
    },
  };
}
