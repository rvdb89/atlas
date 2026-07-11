import { getCompanyState } from "../CompanyStateEngine";
import { updateCompanyModels } from "../CompanyStateStore";
import type {
  ApprovalModel,
  CompanyModels,
  CompanyStateResult,
  NeedsChangeOptionId,
  RecommendationDecision,
} from "../types";

/** An approval still counts as "something the CEO needs to look at" while it's pending or
 * sitting in needs_changes — matches the CEO Inbox's own "Open" grouping (ceoInboxView.ts).
 * "approved" and "deferred" both mean the CEO has already made a call on it. */
function isApprovalStillOpen(status: ApprovalModel["status"]): boolean {
  return status === "pending" || status === "needs_changes";
}

/** Single source of truth for whether the top "Atlas Main Recommendation" card should still
 * show as actionable. Always computed fresh from the current approvals — never a separately
 * stored flag that can drift out of sync with what's actually still open in the CEO Inbox.
 * This is what makes "approve in the Inbox" and "approve on the recommendation card"
 * immediately reflect each other, from either direction, without needing a page reload. */
export function computeRecommendationDecision(
  initiativeId: string | null | undefined,
  approvals: ApprovalModel[],
): RecommendationDecision {
  if (!initiativeId) return "pending";
  const related = approvals.filter((item) => item.title.includes(initiativeId));
  if (related.length > 0 && related.every((item) => !isApprovalStillOpen(item.status))) {
    return "approved";
  }
  return "pending";
}

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

/** Decision layer — mutates company models, then returns fresh computed state.
 *
 * Every mutation below recomputes `recommendation.decision` from the fresh approvals list in
 * the same update — never leaves the top recommendation card's status to be reconciled later
 * on a page reload. That was the source of an earlier bug: approving something in the CEO
 * Inbox used to leave the top card frozen on "pending" until the next runtime-state merge. */
export function approveApproval(approvalId: string): CompanyStateResult {
  updateCompanyModels((models: CompanyModels) => {
    const target = models.approvals.find((item) => item.id === approvalId);
    if (!target || target.status !== "pending") return models;

    const approvals = models.approvals.map((item) =>
      item.id === approvalId
        ? { ...item, status: "approved" as const, confirmationMessage: "Goedgekeurd. Atlas mag door." }
        : item,
    );

    return {
      ...models,
      decisionFeedback: {},
      approvals,
      activity: [appendActivity(`CEO approved — ${target.title}`), ...models.activity],
      recommendation: {
        ...models.recommendation,
        decision: computeRecommendationDecision(models.recommendation.relatedInitiativeId, approvals),
      },
    };
  });

  return getCompanyState();
}

export function adjustApproval(approvalId: string, option: NeedsChangeOptionId): CompanyStateResult {
  const label = ADJUST_LABELS[option];

  updateCompanyModels((models: CompanyModels) => {
    const target = models.approvals.find((item) => item.id === approvalId);
    if (!target || target.status !== "pending") return models;

    const approvals = models.approvals.map((item) =>
      item.id === approvalId
        ? {
            ...item,
            status: "needs_changes" as const,
            selectedChangeOption: option,
            changeNote: `Atlas pauzeert. Jouw keuze: ${label}.`,
          }
        : item,
    );

    return {
      ...models,
      decisionFeedback: {},
      approvals,
      recommendation: {
        ...models.recommendation,
        decision: computeRecommendationDecision(models.recommendation.relatedInitiativeId, approvals),
      },
    };
  });

  return getCompanyState();
}

export function deferApproval(approvalId: string): CompanyStateResult {
  updateCompanyModels((models: CompanyModels) => {
    const target = models.approvals.find((item) => item.id === approvalId);
    if (!target || target.status !== "pending") return models;

    const approvals = models.approvals.map((item) =>
      item.id === approvalId
        ? { ...item, status: "deferred" as const, confirmationMessage: "Uitgesteld. Atlas bewaart dit voor later." }
        : item,
    );

    return {
      ...models,
      approvals,
      recommendation: {
        ...models.recommendation,
        decision: computeRecommendationDecision(models.recommendation.relatedInitiativeId, approvals),
      },
    };
  });

  return getCompanyState();
}

export function approveRecommendation(): CompanyStateResult {
  updateCompanyModels((models: CompanyModels) => {
    const initiative = models.recommendation.relatedInitiativeId;
    const matchingApproval = models.approvals.find(
      (item: ApprovalModel) => isApprovalStillOpen(item.status) && initiative && item.title.includes(initiative),
    );

    if (!matchingApproval) {
      // Nothing left open for this initiative — never claim "approved" without actually
      // resolving something. Just reflect the true state (which may already be "approved"
      // if the CEO handled it via the Inbox directly, or "pending" if there's genuinely
      // nothing here yet), so this button can't silently drift out of sync with the Inbox.
      return {
        ...models,
        recommendation: {
          ...models.recommendation,
          decision: computeRecommendationDecision(initiative, models.approvals),
        },
      };
    }

    const approvals = models.approvals.map((item: ApprovalModel) =>
      item.id === matchingApproval.id
        ? { ...item, status: "approved" as const, confirmationMessage: "Goedgekeurd. Atlas mag door." }
        : item,
    );

    return {
      ...models,
      approvals,
      decisionFeedback: {
        ceoCommandConfirmation: `Goedgekeurd. Atlas start ${initiative ?? "de aanbeveling"}.`,
      },
      activity: [
        appendActivity(
          `CEO approved Atlas recommendation — ${initiative ?? models.recommendation.recommendation}`,
        ),
        ...models.activity,
      ],
      recommendation: {
        ...models.recommendation,
        decision: computeRecommendationDecision(initiative, approvals),
      },
    };
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
