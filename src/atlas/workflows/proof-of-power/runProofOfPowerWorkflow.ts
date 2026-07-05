import {
  assertPlanningResult,
  markPlanCompleted,
  markPlanExecuting,
  markPlanFailed,
  updatePlanStepByWorkflowId,
} from "@/atlas/brain/planner";
import { saveWorkflowMemory } from "@/atlas/brain/memory";
import { contextEngine } from "@/atlas/brain/context";
import type { ContextSnapshot } from "@/atlas/brain/context";
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

/** End-to-end workflow — Atlas plans, loads memory context, then executes. */
export async function runProofOfPowerWorkflow(
  input: ProofOfPowerInput,
  onProgress?: WorkflowProgressCallback,
  onPlan?: (plan: ExecutionPlan) => void,
  onContext?: (snapshot: ContextSnapshot) => void,
): Promise<ProofOfPowerResult> {
  const planningResult = planProofOfPowerExecution(input);
  assertPlanningResult(planningResult);
  const executionPlan = planningResult.plan;
  onPlan?.(executionPlan);

  const contextResult = contextEngine.createSnapshot({
    goal: executionPlan.goal,
    executionPlan,
    topic: input.topic,
    workflowId: "proof-of-power",
    moduleId: input.moduleId,
    moduleLabel: input.moduleLabel,
    language: input.language,
  });

  const contextSnapshot =
    contextResult.ok && contextResult.data
      ? contextResult.data
      : ({
          goal: executionPlan.goal,
          relevantMemories: [],
          relevantEntities: [],
          relevantKnowledge: [],
          relevantWorkflows: [],
          currentLanguage: input.language,
          currentModule: { id: input.moduleId, label: input.moduleLabel },
          currentUser: { id: "atlas-user", label: "Atlas Developer" },
          workspace: "Atlas Studio",
          environment: "development",
          plannerOutput: executionPlan,
          loadedProviders: [],
          health: "partial",
          timestamp: new Date().toISOString(),
        } satisfies ContextSnapshot);

  onContext?.(contextSnapshot);

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
    return {
      ...result,
      contextSnapshot,
    };
  } catch (error) {
    markPlanFailed(executionPlan.id);
    throw error;
  }
}

export type { WorkflowStepDefinition };
