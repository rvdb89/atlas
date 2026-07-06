import type {
  CeoAdjustOptionId,
  CeoContinueDecisionState,
  CeoDecisionStatus,
  CeoReleaseApprovalState,
  CeoWorkflowStep,
  CeoWorkflowStepStatus,
} from "./ceoWorkflow.types";

function mapDecisionStatusToStepStatus(status: CeoDecisionStatus): CeoWorkflowStepStatus {
  if (status === "adjustment_requested") return "completed";
  if (status === "awaiting") return "awaiting";
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  return "pending";
}

export function createPendingReleaseApproval(): CeoReleaseApprovalState {
  return {
    status: "pending",
    summary: "Wacht op Branch Director Review",
    details: [],
  };
}

export function createAwaitingReleaseApproval(): CeoReleaseApprovalState {
  return {
    status: "awaiting",
    summary: "Wacht op CEO-goedkeuring",
    details: ["Atlas heeft alles voorbereid. Jij keurt de release goed wanneer je klaar bent."],
  };
}

export function createCompletedReleaseApproval(): CeoReleaseApprovalState {
  return {
    status: "completed",
    summary: "CEO approved release",
    details: ["Explicit CEO approval received via Atlas Studio."],
    decidedAt: new Date().toISOString(),
  };
}

export function createPendingContinueDecision(): CeoContinueDecisionState {
  return {
    status: "pending",
    summary: "Wacht op debrief",
    details: [],
  };
}

export function createAwaitingContinueDecision(): CeoContinueDecisionState {
  return {
    status: "awaiting",
    summary: "Wacht op CEO-beslissing",
    details: ["Gaan we door?"],
  };
}

export function createCompletedContinueDecision(input: {
  confirmationMessage: string;
  nextInitiativeLabel?: string | null;
}): CeoContinueDecisionState {
  return {
    status: "completed",
    decision: "continue",
    summary: "CEO koos: doorgaan",
    details: ["Ja, ga door", input.confirmationMessage],
    confirmationMessage: input.confirmationMessage,
    nextInitiativeLabel: input.nextInitiativeLabel ?? null,
    decidedAt: new Date().toISOString(),
  };
}

export function createAdjustmentContinueDecision(input: {
  optionLabel: string;
  optionId: CeoAdjustOptionId;
  adjustmentSummary: string;
  feedback?: string;
}): CeoContinueDecisionState {
  return {
    status: "adjustment_requested",
    decision: "adjust",
    summary: "CEO koos: aanpassen",
    details: [
      input.optionLabel,
      input.feedback?.trim() ? input.feedback.trim() : "Geen extra toelichting.",
      input.adjustmentSummary,
    ],
    adjustOption: input.optionId,
    confirmationMessage: input.adjustmentSummary,
    decidedAt: new Date().toISOString(),
  };
}

export function syncReleaseApprovalStep(
  steps: CeoWorkflowStep[],
  releaseApproval?: CeoReleaseApprovalState,
): CeoWorkflowStep[] {
  if (!releaseApproval) return steps;

  return steps.map((step) =>
    step.id === "ceo-approval"
      ? {
          ...step,
          status: mapDecisionStatusToStepStatus(releaseApproval.status),
          summary: releaseApproval.summary,
          details: releaseApproval.details,
        }
      : step,
  );
}

export function syncContinueDecisionStep(
  steps: CeoWorkflowStep[],
  continueDecision?: CeoContinueDecisionState,
): CeoWorkflowStep[] {
  if (!continueDecision) return steps;

  return steps.map((step) =>
    step.id === "ceo-continue-decision"
      ? {
          ...step,
          status: mapDecisionStatusToStepStatus(continueDecision.status),
          summary: continueDecision.summary,
          details: continueDecision.details,
        }
      : step,
  );
}

export function syncCeoDecisionSteps(
  steps: CeoWorkflowStep[],
  input?: {
    releaseApproval?: CeoReleaseApprovalState;
    continueDecision?: CeoContinueDecisionState;
  },
): CeoWorkflowStep[] {
  let next = steps;
  if (input?.releaseApproval) {
    next = syncReleaseApprovalStep(next, input.releaseApproval);
  }
  if (input?.continueDecision) {
    next = syncContinueDecisionStep(next, input.continueDecision);
  }
  return next;
}
