import { recordStartupIssue } from "@/atlas/diagnostics/auditLog";

export type WorkflowRegistration = {
  id: string;
  label: string;
  version: string;
  stepCount: number;
  description?: string;
};

const workflows = new Map<string, WorkflowRegistration>();

export function registerWorkflow(workflow: WorkflowRegistration): void {
  if (workflows.has(workflow.id)) {
    recordStartupIssue({
      code: "duplicate-workflow-id",
      severity: "error",
      message: `Duplicate workflow id registered: ${workflow.id}`,
      context: { workflowId: workflow.id },
    });
  }
  workflows.set(workflow.id, workflow);
}

export function getWorkflow(workflowId: string): WorkflowRegistration | undefined {
  return workflows.get(workflowId);
}

export function listWorkflows(): WorkflowRegistration[] {
  return [...workflows.values()];
}

export function registerCoreWorkflows(): void {
  if (workflows.size > 0) return;

  registerWorkflow({
    id: "proof-of-power",
    label: "Proof of Power",
    version: "1.0.0",
    stepCount: 10,
    description: "End-to-end demo workflow from topic to review-ready draft",
  });
}
