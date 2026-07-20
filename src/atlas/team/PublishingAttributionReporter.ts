import type {
  CapabilityConfirmedEvent,
  CapabilityFailedEvent,
  TeamAttributionReporter,
} from "@/atlas/publishing/types";
import type { ExecutiveMemoryContract } from "@/atlas/executive-memory";

import { confirmCompletion, recordFailure } from "./TeamAttribution";
import { resolveTeamIdentityId } from "./TeamIdentityResolver";

/**
 * PublishingAttributionReporter — Sprint 1.2.
 *
 * The only bridge between the Publishing Pipeline, TeamAttribution, and Executive Memory. The
 * pipeline itself (src/atlas/publishing/pipeline/PublishingPipeline.ts) knows nothing about any
 * of the three imports above — it only calls the generic TeamAttributionReporter contract (see
 * src/atlas/publishing/types.ts). This file is where that contract gets a concrete meaning.
 *
 * `onCapabilityStarted` is a deliberate no-op: TeamAttribution (Sprint 1.1) only ever persists
 * "confirmed"/"failed" — there is no "started" status in Executive Memory, and this sprint does
 * not introduce one. The pipeline still reports the event; this adapter simply chooses not to
 * act on it, exactly as intended by the reporter abstraction (the pipeline reports, the
 * implementer decides).
 *
 * Any Executive Memory write failure inside `onCapabilityConfirmed`/`onCapabilityFailed` is
 * caught here and never rethrown — fail-open, the same philosophy already used by
 * CompanyStateStore.ts and atlas-runtime.ts's memory persistence. A broken attribution write
 * must never surface as a pipeline error, let alone mask the real capability outcome it is
 * describing.
 */
export function createPublishingAttributionReporter(
  executiveMemory: ExecutiveMemoryContract,
): TeamAttributionReporter {
  return {
    // onCapabilityStarted intentionally omitted — see file-level comment above.

    async onCapabilityConfirmed(event: CapabilityConfirmedEvent): Promise<void> {
      const identityId = resolveTeamIdentityId(event.capabilityId);
      if (!identityId) {
        // No canonical team identity maps to this capability (shouldn't happen for the six
        // capabilities the pipeline reports on today, but resolveTeamIdentityId is additive and
        // may not cover every future capability) — nothing to attribute, not an error.
        return;
      }

      try {
        await confirmCompletion(executiveMemory, {
          identityId,
          source: `publishing-pipeline:${event.capabilityId}`,
          workItemRef: event.workItemRef ?? "unknown-work-item",
          description: event.description,
          evidence: {
            succeeded: true,
            reportedBy: `publishing-pipeline:${event.capabilityId}`,
            occurredAt: event.occurredAt,
          },
        });
      } catch (error) {
        console.error(
          "PublishingAttributionReporter: kon confirmed-attributie niet vastleggen:",
          error instanceof Error ? error.message : error,
        );
      }
    },

    async onCapabilityFailed(event: CapabilityFailedEvent): Promise<void> {
      const identityId = resolveTeamIdentityId(event.capabilityId);
      if (!identityId) {
        return;
      }

      try {
        await recordFailure(executiveMemory, {
          identityId,
          source: `publishing-pipeline:${event.capabilityId}`,
          workItemRef: event.workItemRef ?? "unknown-work-item",
          description: `Capability ${event.capabilityId} mislukt tijdens publishing pipeline.`,
          failure: {
            reason: event.reason,
            reportedBy: `publishing-pipeline:${event.capabilityId}`,
            occurredAt: event.occurredAt,
          },
        });
      } catch (error) {
        console.error(
          "PublishingAttributionReporter: kon failed-attributie niet vastleggen:",
          error instanceof Error ? error.message : error,
        );
      }
    },
  };
}
