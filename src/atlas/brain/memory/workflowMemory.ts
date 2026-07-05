import type { ExecutionPlan } from "@/atlas/brain/planner/planner.types";

import { createMemoryContext } from "./MemoryContext";
import { memoryEngine } from "./MemoryEngine";
import type { MemoryOperationResult, AtlasMemoryEntry } from "./memory.types";

export type WorkflowMemoryPayload = {
  goal: string;
  executionPlan: ExecutionPlan;
  result: {
    runId: string;
    entityId?: string;
    draftId?: string;
    status: string;
    completedAt: string;
  };
  timestamp: string;
  status: string;
};

export function saveWorkflowMemory(input: {
  goal: string;
  executionPlan: ExecutionPlan;
  runId: string;
  entityId?: string;
  draftId?: string;
  moduleId?: string;
  moduleLabel?: string;
  workflowId?: string;
  status?: string;
  completedAt?: string;
}): MemoryOperationResult<AtlasMemoryEntry> {
  const context = createMemoryContext({
    moduleId: input.moduleId,
    moduleLabel: input.moduleLabel,
  });

  const payload: WorkflowMemoryPayload = {
    goal: input.goal,
    executionPlan: input.executionPlan,
    result: {
      runId: input.runId,
      entityId: input.entityId,
      draftId: input.draftId,
      status: input.status ?? input.executionPlan.status,
      completedAt: input.completedAt ?? new Date().toISOString(),
    },
    timestamp: input.completedAt ?? new Date().toISOString(),
    status: input.status ?? input.executionPlan.status,
  };

  return memoryEngine.saveMemory(
    {
      type: "workflow",
      title: input.goal,
      summary: `Workflow memory · ${input.workflowId ?? "atlas.workflow"} · ${payload.result.status}`,
      content: JSON.stringify(payload, null, 2),
      tags: [
        "workflow",
        input.workflowId ?? "atlas.workflow",
        input.moduleId ?? context.moduleId,
        payload.result.status,
      ],
      source: `atlas.workflow.${input.workflowId ?? "generic"}`,
      importance: 8,
      confidence: 0.92,
      status: "active",
    },
    context,
  );
}
