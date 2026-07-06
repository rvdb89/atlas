import type {
  BranchDirectorDebrief,
  CeoAdjustOption,
  CeoWorkflowAuditSummary,
  CeoWorkflowDecisionSummary,
  CeoWorkflowReleaseImpact,
  CeoWorkflowState,
} from "./ceoWorkflow.types";

export const DEBRIEF_WORKFLOW_ID = "STUDIO-002";

export const CEO_ADJUST_OPTIONS: CeoAdjustOption[] = [
  {
    id: "adjust-roadmap",
    label: "Roadmap aanpassen",
    description: "Atlas herziet de roadmap-volgorde op basis van jouw feedback.",
  },
  {
    id: "change-priority",
    label: "Prioriteit wijzigen",
    description: "Atlas herprioriteert welke capability of afdeling nu voorrang krijgt.",
  },
  {
    id: "improve-current",
    label: "Huidige initiative verbeteren",
    description: "Atlas blijft bij het huidige initiative en plant verbeteringen.",
  },
  {
    id: "follow-up-initiative",
    label: "Follow-up initiative",
    description: "Atlas maakt een gericht vervolg-initiative voor open punten.",
  },
  {
    id: "pause-execution",
    label: "Execution pauzeren",
    description: "Atlas stopt execution tot jij nieuwe intent geeft.",
  },
];

export function buildBranchDirectorDebrief(input: {
  decision?: CeoWorkflowDecisionSummary;
  auditSummary?: CeoWorkflowAuditSummary;
  impact?: CeoWorkflowReleaseImpact;
  releaseAllowed: boolean;
}): BranchDirectorDebrief {
  const initiativeId = input.impact?.missionId ?? input.decision?.recommendedInitiativeId ?? null;
  const initiativeTitle =
    input.decision?.recommendedInitiativeTitle ??
    (initiativeId ? initiativeId : null);

  const blockers = input.auditSummary?.blockers ?? [];
  const warnings = input.auditSummary?.warnings ?? [];
  const blockerCount = input.auditSummary?.blockerCount ?? blockers.length;
  const warningCount = input.auditSummary?.warningCount ?? warnings.length;

  const nextId = input.decision?.nextBestInitiativeId ?? null;
  const nextTitle = input.decision?.nextBestInitiativeTitle ?? nextId;

  const readyToContinue = input.releaseAllowed && blockerCount === 0;
  const headline = "Sprint is klaar.";

  const obstacleLine =
    blockerCount > 0
      ? `Ik zie ${blockerCount} belemmering(en) die we eerst moeten oplossen.`
      : warningCount > 0
        ? `Ik zie geen blockers, wel ${warningCount} aandachtspunt(en) voor follow-up.`
        : "Ik zie geen belemmeringen om door te gaan.";

  const adviceLine = nextTitle
    ? `Mijn advies: ga verder met ${nextTitle}${nextId && nextTitle !== nextId ? ` (${nextId})` : ""}.`
    : "Mijn advies: pauzeer execution tot er een duidelijke volgende stap is.";

  const question = "Gaan we door?";

  return {
    initiativeId,
    initiativeTitle,
    statusLabel: readyToContinue ? "Afgerond" : "Aandacht vereist",
    reviewResult: input.auditSummary?.recommendation ?? "Geen review beschikbaar",
    blockerCount,
    warningCount,
    blockers,
    warnings,
    readyToContinue,
    recommendedNextInitiativeId: nextId,
    recommendedNextInitiativeTitle: nextTitle,
    headline,
    summary: [headline, obstacleLine, adviceLine, question].join("\n"),
    question,
  };
}

export function buildContinueIntent(debrief: BranchDirectorDebrief): string {
  const target = debrief.recommendedNextInitiativeTitle ?? debrief.recommendedNextInitiativeId;
  if (!target) {
    return "Atlas, geef de volgende aanbevolen initiative op basis van de North Star.";
  }
  return `Atlas, ga verder met ${target}${debrief.recommendedNextInitiativeId ? ` (${debrief.recommendedNextInitiativeId})` : ""}.`;
}

export function attachDebriefToWorkflow(workflow: CeoWorkflowState): CeoWorkflowState {
  const debrief = buildBranchDirectorDebrief({
    decision: workflow.decision,
    auditSummary: workflow.auditSummary,
    impact: workflow.impact,
    releaseAllowed: workflow.releaseDecision?.pushAllowed ?? false,
  });

  return {
    ...workflow,
    debrief,
    adjustOptions: CEO_ADJUST_OPTIONS,
    status: "awaiting_ceo_debrief",
  };
}
