import {
  assertPlanningResult,
  markPlanCompleted,
  markPlanExecuting,
  markPlanFailed,
  updatePlanStepByWorkflowId,
} from "@/atlas/brain/planner";
import { saveWorkflowMemory } from "@/atlas/brain/memory";
import type { ExecutionPlan } from "@/atlas/brain/planner/planner.types";

import type {
  ProofOfPowerInput,
  ProofOfPowerResult,
  WorkflowProgressCallback,
  WorkflowStepDefinition,
} from "./types";
import { planProofOfPowerExecution } from "./planProofOfPower";
import { runProofOfPowerWorkflowBody } from "./runProofOfPowerWorkflowBody";
export { PROOF_OF_POWER_STEPS } from "./stepDefinitions";
export { createProofOfPowerGoal, planProofOfPowerExecution } from "./planProofOfPower";

/** End-to-end workflow — Atlas plans first, then executes. */
export async function runProofOfPowerWorkflow(
  input: ProofOfPowerInput,
  onProgress?: WorkflowProgressCallback,
  onPlan?: (plan: ExecutionPlan) => void,
): Promise<ProofOfPowerResult> {
  const planningResult = planProofOfPowerExecution(input);
  assertPlanningResult(planningResult);
  const executionPlan = planningResult.plan;
  onPlan?.(executionPlan);
  markPlanExecuting(executionPlan.id);

  try {
    const result = await runProofOfPowerWorkflowBody(
      input,
      onProgress,
      executionPlan,
      (workflowStepId, status) => updatePlanStepByWorkflowId(workflowStepId, status),
    );
    markPlanCompleted(executionPlan.id);
    saveWorkflowMemory({
      goal: executionPlan.goal,
      executionPlan,
      runId: result.runId,
      entityId: result.entity.id,
      draftId: result.draft.id,
      moduleId: input.moduleId,
      moduleLabel: input.moduleLabel,
      workflowId: "proof-of-power",
      status: executionPlan.status,
      completedAt: result.completedAt,
    });
    return result;
  } catch (error) {
    markPlanFailed(executionPlan.id);
    throw error;
  }
}

export type { WorkflowStepDefinition };
