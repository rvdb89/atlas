import type { CeoWorkflowStageId, CeoWorkflowStep } from "./ceoWorkflow.types";

export const CEO_WORKFLOW_ID = "STUDIO-001";

export const CEO_WORKFLOW_HIERARCHY = [
  "Intent",
  "Branch Director Decision",
  "Execution",
  "Branch Director Review",
  "Release Decision",
  "CEO Approval",
  "Publish",
  "Confirmation",
] as const;

export const DEBRIEF_FLOW_HIERARCHY = [
  "Initiative completed",
  "Branch Director Review",
  "Release Decision",
  "Branch Director Debrief",
  "CEO Decision",
  "Continue OR Adjust",
] as const;

export const CEO_WORKFLOW_STAGE_LABELS: Record<CeoWorkflowStageId, string> = {
  intent: "Intent",
  "branch-director-decision": "Branch Director Decision",
  execution: "Execution",
  "branch-director-review": "Branch Director Review",
  "release-decision": "Release Decision",
  "ceo-approval": "CEO Approval",
  publish: "Publish",
  confirmation: "Confirmation",
  "branch-director-debrief": "Branch Director Debrief",
  "ceo-continue-decision": "CEO Decision",
};

export function createInitialWorkflowSteps(): CeoWorkflowStep[] {
  return (Object.keys(CEO_WORKFLOW_STAGE_LABELS) as CeoWorkflowStageId[]).map((id) => ({
    id,
    label: CEO_WORKFLOW_STAGE_LABELS[id],
    status: "pending",
    summary: "Waiting",
    details: [],
  }));
}
