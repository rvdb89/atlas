import { useCallback, useEffect, useState } from "react";

import { getCompanyState } from "@/atlas/company-state";
import {
  adjustApproval,
  approveApproval,
  deferApproval,
  executePrimaryDecision,
  executeSecondaryDecision,
} from "@/atlas/company-state/decision";

import { cacheControlView, loadControlSnapshot, triggerExecutionApply, triggerRoadmapPin } from "./controlDataService";
import { mapCompanyStateToControlView } from "./controlViewMapper";
import type { ControlSnapshot, NeedsChangeOptionId } from "./types";

export function useControlDashboard() {
  const [snapshot, setSnapshot] = useState<ControlSnapshot | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [adjustingItemId, setAdjustingItemId] = useState<string | null>(null);

  useEffect(() => {
    loadControlSnapshot()
      .then((result) => setSnapshot(result.snapshot))
      .catch((caught: unknown) => {
        const message = caught instanceof Error ? caught.message : String(caught);
        console.error("Atlas Control failed to load:", caught);
        setError(`Atlas Control could not load. (${message})`);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyState = useCallback((next: ControlSnapshot) => {
    setSnapshot(cacheControlView(next));
    setError(undefined);
  }, []);

  const approveInbox = useCallback(
    (itemId: string) => {
      setAdjustingItemId(null);
      const result = approveApproval(itemId);
      applyState(mapCompanyStateToControlView(result.state, result.source));
      // EXEC-001 · Best-effort: if this was a "review engineering package" item, ask the
      // local Apply Engine bridge to write the reviewed proposal into the real working
      // tree. Never blocks or affects the approval itself above — this just refreshes the
      // snapshot afterward so the resulting activity entry shows up without a reload.
      void triggerExecutionApply(itemId).then(() => {
        const refreshed = getCompanyState();
        applyState(mapCompanyStateToControlView(refreshed.state, refreshed.source));
      });
      // Bugfix 2026-07-10 · Same idea, for "roadmap_decision" (override-<missionId>) items —
      // approving one of these used to be a dead end with no backend effect at all. Both
      // trigger* calls are no-ops for IDs that don't match their own prefix, so it's safe to
      // fire both unconditionally rather than branching on category here.
      void triggerRoadmapPin(itemId).then(() => {
        const refreshed = getCompanyState();
        applyState(mapCompanyStateToControlView(refreshed.state, refreshed.source));
      });
    },
    [applyState],
  );

  const adjustInbox = useCallback(
    (itemId: string, option: NeedsChangeOptionId) => {
      setAdjustingItemId(null);
      const result = adjustApproval(itemId, option);
      applyState(mapCompanyStateToControlView(result.state, result.source));
    },
    [applyState],
  );

  const deferInbox = useCallback(
    (itemId: string) => {
      setAdjustingItemId(null);
      const result = deferApproval(itemId);
      applyState(mapCompanyStateToControlView(result.state, result.source));
    },
    [applyState],
  );

  const primaryCommandAction = useCallback(() => {
    const result = executePrimaryDecision();
    applyState(mapCompanyStateToControlView(result.state, result.source));
  }, [applyState]);

  const secondaryCommandAction = useCallback(() => {
    const result = executeSecondaryDecision();
    applyState(mapCompanyStateToControlView(result.state, result.source));
  }, [applyState]);

  return {
    snapshot,
    loading,
    error,
    adjustingItemId,
    setAdjustingItemId,
    approveInbox,
    adjustInbox,
    deferInbox,
    primaryCommandAction,
    secondaryCommandAction,
  };
}
