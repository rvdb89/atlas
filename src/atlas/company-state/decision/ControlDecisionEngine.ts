import { getCompanyState } from "../CompanyStateEngine";
import { updateCompanyModels } from "../CompanyStateStore";
import type { ApprovalModel, CompanyModels, CompanyStateResult, NeedsChangeOptionId } from "../types";

const ADJUST_LABELS: Record<NeedsChangeOptionId, string> = {
  "fix-bug": "Bug oplossen",
  "adjust-design": "Design aanpassen",
  "adjust-roadmap": "Roadmap aanpassen",
  "change-priority": "Prioriteit wijzigen",
};

function appendActivity(message: string) {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: "approval_received" as const,
    message,
    occurredAt: "Just now",
  };
}

/** Decision layer — mutates company models, then returns fresh computed state. */
export function approveApproval(approvalId: string): CompanyStateResult {
  updateCompanyModels((models: CompanyModels) => {
    const target = models.approvals.find((item) => item.id === approvalId);
    if (!target || target.status !== "pending") return models;

    return {
      ...models,
      decisionFeedback: {},
      approvals: models.approvals.map((item) =>
        item.id === approvalId
          ? { ...item, status: "approved", confirmationMessage: "Goedgekeurd. Atlas mag door." }
          : item,
      ),
      activity: [appendActivity(`CEO approved — ${target.title}`), ...models.activity],
    };
  });

  return getCompanyState();
}

export function adjustApproval(approvalId: string, option: NeedsChangeOptionId): CompanyStateResult {
  const label = ADJUST_LABELS[option];

  updateCompanyModels((models: CompanyModels) => {
    const target = models.approvals.find((item) => item.id === approvalId);
    if (!target || target.status !== "pending") return models;

    return {
      ...models,
      decisionFeedback: {},
      approvals: models.approvals.map((item) =>
        item.id === approvalId
          ? {
              ...item,
              status: "needs_changes",
              selectedChangeOption: option,
              changeNote: `Atlas pauzeert. Jouw keuze: ${label}.`,
            }
          : item,
      ),
    };
  });

  return getCompanyState();
}

export function deferApproval(approvalId: string): CompanyStateResult {
  updateCompanyModels((models: CompanyModels) => {
    const target = models.approvals.find((item) => item.id === approvalId);
    if (!target || target.status !== "pending") return models;

    return {
      ...models,
      approvals: models.approvals.map((item) =>
        item.id === approvalId
          ? { ...item, status: "deferred", confirmationMessage: "Uitgesteld. Atlas bewaart dit voor later." }
          : item,
      ),
    };
  });

  return getCompanyState();
}

export function approveRecommendation(): CompanyStateResult {
  updateCompanyModels((models: CompanyModels) => {
    if (models.recommendation.decision !== "pending") return models;

    const initiative = models.recommendation.relatedInitiativeId;
    const matchingApproval = models.approvals.find(
      (item: ApprovalModel) =>
        item.status === "pending" && initiative && item.title.includes(initiative),
    );

    let next = {
      ...models,
      recommendation: { ...models.recommendation, decision: "approved" as const },
      decisionFeedback: {
        ceoCommandConfirmation: `Goedgekeurd. Atlas start ${initiative ?? "de aanbeveling"}.`,
      },
      activity: [
        appendActivity(
          `CEO approved Atlas recommendation — ${initiative ?? models.recommendation.recommendation}`,
        ),
        ...models.activity,
      ],
    };

    if (matchingApproval) {
      next = {
        ...next,
        approvals: next.approvals.map((item: ApprovalModel) =>
          item.id === matchingApproval.id
            ? { ...item, status: "approved", confirmationMessage: "Goedgekeurd. Atlas mag door." }
            : item,
        ),
      };
    }

    return next;
  });

  return getCompanyState();
}

export function reviewRecommendationDetails(): CompanyStateResult {
  updateCompanyModels((models) => ({
    ...models,
    decisionFeedback: {
      ceoCommandConfirmation: "Bekijk Atlas Advice onderaan Atlas Control voor volledige context.",
    },
  }));

  return getCompanyState();
}

export function executePrimaryDecision(): CompanyStateResult {
  const current = getCompanyState().state;
  if (current.recommendation.decision === "pending") {
    return approveRecommendation();
  }

  const pending = current.approvals.filter((item) => item.status === "pending");
  if (pending[0]) {
    return approveApproval(pending[0].id);
  }

  updateCompanyModels((models) => ({
    ...models,
    decisionFeedback: { ceoCommandConfirmation: "Overzicht vernieuwd." },
  }));

  return getCompanyState();
}

export function executeSecondaryDecision(): CompanyStateResult {
  return reviewRecommendationDetails();
}
