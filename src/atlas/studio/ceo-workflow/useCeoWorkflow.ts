import { useCallback, useState } from "react";

import { ATLAS_DEV_API } from "@/atlas/studio/developer/devEvents";
import { mapDebriefContinueError } from "./BranchDirectorDebrief";
import type { CeoAdjustOptionId, CeoWorkflowState } from "./ceoWorkflow.types";

type WorkflowResult =
  | { ok: true; workflow: CeoWorkflowState }
  | { ok: false; error: string };

export function useCeoWorkflow() {
  const [workflow, setWorkflow] = useState<CeoWorkflowState | undefined>();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refreshState = useCallback(async () => {
    try {
      const response = await fetch(`${ATLAS_DEV_API}/atlas/ceo-workflow/state`);
      if (!response.ok) return;
      const payload = (await response.json()) as { workflow: CeoWorkflowState | null };
      if (payload.workflow) setWorkflow(payload.workflow);
    } catch {
      // dev API unavailable
    }
  }, []);

  const runWorkflow = useCallback(async (intent: string): Promise<WorkflowResult> => {
    setError(undefined);
    setRunning(true);

    try {
      const response = await fetch(`${ATLAS_DEV_API}/atlas/ceo-workflow/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });

      const payload = (await response.json()) as { workflow?: CeoWorkflowState; error?: string };

      if (!response.ok || !payload.workflow) {
        const message = payload.error ?? "Workflow mislukt — start Atlas met npm run atlas.";
        setError(message);
        return { ok: false, error: message };
      }

      setWorkflow(payload.workflow);
      return { ok: true, workflow: payload.workflow };
    } catch (workflowError) {
      const message =
        workflowError instanceof Error
          ? workflowError.message
          : "Atlas dev API niet bereikbaar. Start Atlas Studio met npm run atlas.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setRunning(false);
    }
  }, []);

  const approveRelease = useCallback(async (commitMessage?: string): Promise<WorkflowResult> => {
    setError(undefined);
    setRunning(true);

    try {
      const response = await fetch(`${ATLAS_DEV_API}/atlas/ceo-workflow/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commitMessage }),
      });

      const payload = (await response.json()) as { workflow?: CeoWorkflowState; error?: string };

      if (!response.ok || !payload.workflow) {
        const message = payload.error ?? "Goedkeuring mislukt.";
        setError(message);
        return { ok: false, error: message };
      }

      setWorkflow(payload.workflow);
      return { ok: true, workflow: payload.workflow };
    } catch (approveError) {
      const message = approveError instanceof Error ? approveError.message : "Goedkeuring mislukt.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setRunning(false);
    }
  }, []);

  const continueAfterDebrief = useCallback(async (): Promise<WorkflowResult> => {
    setError(undefined);
    setRunning(true);

    try {
      const response = await fetch(`${ATLAS_DEV_API}/atlas/ceo-workflow/debrief/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const payload = (await response.json()) as { workflow?: CeoWorkflowState; error?: string };

      if (!response.ok || !payload.workflow) {
        const message = mapDebriefContinueError(payload.error);
        setError(message);
        return { ok: false, error: message };
      }

      setWorkflow(payload.workflow);
      setError(undefined);
      return { ok: true, workflow: payload.workflow };
    } catch (continueError) {
      const message = mapDebriefContinueError(
        continueError instanceof Error ? continueError.message : undefined,
      );
      setError(message);
      return { ok: false, error: message };
    } finally {
      setRunning(false);
    }
  }, []);

  const adjustAfterDebrief = useCallback(
    async (option: CeoAdjustOptionId, feedback?: string): Promise<WorkflowResult> => {
      setError(undefined);
      setRunning(true);

      try {
        const response = await fetch(`${ATLAS_DEV_API}/atlas/ceo-workflow/debrief/adjust`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ option, feedback }),
        });

        const payload = (await response.json()) as { workflow?: CeoWorkflowState; error?: string };

        if (!response.ok || !payload.workflow) {
          const message = payload.error ?? "Aanpassen mislukt.";
          setError(message);
          return { ok: false, error: message };
        }

        setWorkflow(payload.workflow);
        return { ok: true, workflow: payload.workflow };
      } catch (adjustError) {
        const message = adjustError instanceof Error ? adjustError.message : "Aanpassen mislukt.";
        setError(message);
        return { ok: false, error: message };
      } finally {
        setRunning(false);
      }
    },
    [],
  );

  return {
    workflow,
    running,
    error,
    runWorkflow,
    approveRelease,
    continueAfterDebrief,
    adjustAfterDebrief,
    refreshState,
  };
}
