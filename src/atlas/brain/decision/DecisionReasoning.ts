import {
  ATLAS_CONSTITUTION_ID,
  getAtlasConstitution,
  getConstitutionNorthStarGoals,
} from "@/atlas/constitution/AtlasConstitution";
import type { EvolutionResult } from "@/atlas/constitution/evolution.types";
import { getBranchDirectorTerminology } from "@/atlas/constitution/BranchDirectorIdentity";
import type { OrganizationRoutingResult } from "@/atlas/organization/organization.types";

import type { DecisionEngineResult } from "./decision.types";

function formatGapSummary(evolution: EvolutionResult): string {
  const intentGaps = evolution.capabilityGaps.filter((gap) => gap.intentRelevant);
  const source = intentGaps.length > 0 ? intentGaps : evolution.capabilityGaps;
  if (source.length === 0) return "No significant capability gaps detected.";

  return source
    .slice(0, 3)
    .map((gap) => `${gap.name} (${Math.round(gap.gap * 100)}% gap)`)
    .join(", ");
}

function formatDepartmentSummary(organization: OrganizationRoutingResult | undefined): string {
  if (!organization || organization.departmentAssignments.length === 0) {
    return "No departments assigned — refine intent or extend Organizational Model.";
  }

  return organization.departmentAssignments
    .map((item) => `${item.departmentName} (${item.role})`)
    .join(", ");
}

export function buildDecisionReasoning(input: {
  evolution: EvolutionResult;
  organization: OrganizationRoutingResult | undefined;
  priorityScore: number;
  recommendedInitiativeId: string | null;
  recommendedInitiativeTitle: string | null;
  executionPackageRequired: boolean;
  executionPackageTrigger: boolean;
}): { reasoning: string[]; why: string } {
  const constitution = getAtlasConstitution();
  const terms = getBranchDirectorTerminology();
  const northStar = getConstitutionNorthStarGoals()[0];
  const topRec = input.evolution.evolutionRecommendations[0] ?? null;

  const reasoning: string[] = [
    `Intent "${input.evolution.intent}" received — ${constitution.missionDerivationRules[0]}`,
    `Constitution (${ATLAS_CONSTITUTION_ID}) defines North Star: ${northStar}`,
    `Current capabilities assessed: ${input.evolution.currentState.length} platform capabilities; average maturity informs gap analysis.`,
    `Capability gaps: ${formatGapSummary(input.evolution)}.`,
    `Organization routes intent to: ${formatDepartmentSummary(input.organization)}.`,
    input.organization?.branchDirectorRationale ?? "Branch Director coordinates departments toward intent.",
  ];

  if (input.executionPackageRequired) {
    reasoning.push(
      `Roadmap context (${constitution.roadmap.length} missions) informs evolution — value score selects initiative, not static priority.`,
    );

    if (input.recommendedInitiativeId) {
      reasoning.push(
        `${terms.recommendedNextInitiative}: ${input.recommendedInitiativeId} (${input.recommendedInitiativeTitle ?? "unknown"}) at priority ${input.priorityScore.toFixed(2)}.`,
      );
      if (topRec?.roadmapRationale) {
        reasoning.push(`Roadmap rationale: ${topRec.roadmapRationale}`);
      }
    }

    reasoning.push(
      input.executionPackageTrigger
        ? `${terms.executionPackage} trigger: ready for ${input.recommendedInitiativeId}.`
        : `${terms.executionPackage} pending — mission registry or alignment incomplete.`,
    );
  } else {
    reasoning.push(
      `Operational intent — Atlas assigns AI Workers directly. ${terms.noExecutionPackageRequired}.`,
    );
  }

  const whyParts = [
    input.executionPackageRequired
      ? input.evolution.answers.whyNextBestStep
      : (input.organization?.branchDirectorRationale ?? input.evolution.selectionRationale),
    `North Star alignment score: ${input.evolution.northStarScore}/10.`,
    input.recommendedInitiativeId
      ? `Selected ${input.recommendedInitiativeId} because it closes the highest-value capability gap (priority ${input.priorityScore.toFixed(2)}).`
      : "No engineering initiative selected — operational routing only.",
    `Departments: ${formatDepartmentSummary(input.organization)}.`,
  ];

  return {
    reasoning,
    why: whyParts.filter(Boolean).join(" "),
  };
}

export function buildDecisionSteps(result: DecisionEngineResult): DecisionEngineResult["steps"] {
  const terms = getBranchDirectorTerminology();
  const org = result.evolution.organization;
  const topGap = result.capabilityGaps.find((gap) => gap.intentRelevant) ?? result.capabilityGaps[0];

  return [
    {
      id: "intent",
      label: "Intent",
      status: result.intent ? "pass" : "fail",
      summary: result.intent ? "Intent recognized" : "No intent",
      details: [result.intent || "Provide natural-language intent only."],
    },
    {
      id: "constitution",
      label: "Constitution",
      status: "pass",
      summary: `${result.inputs.constitutionId} applied`,
      details: ["Constitution is the highest source of truth for this decision."],
    },
    {
      id: "current-capabilities",
      label: "Current Capabilities",
      status: result.inputs.capabilityCount > 0 ? "pass" : "warn",
      summary: `${result.inputs.capabilityCount} capabilities assessed`,
      details: result.evolution.currentState
        .slice(0, 3)
        .map((item) => `${item.name}: ${Math.round(item.maturity * 100)}%`),
    },
    {
      id: "organization",
      label: "Organization",
      status: result.departmentAssignments.length > 0 ? "pass" : "warn",
      summary: `${result.departmentAssignments.length} department(s) assigned`,
      details: result.departmentAssignments.map(
        (item) => `${item.departmentName} (${item.role}) — ${item.rationale}`,
      ),
    },
    {
      id: "roadmap",
      label: "Roadmap",
      status: "pass",
      summary: `${result.inputs.roadmapMissionCount} roadmap missions as context`,
      details: ["Roadmap informs evolution — value score selects the initiative."],
    },
    {
      id: "north-star",
      label: "North Star Alignment",
      status: result.northStarAligned ? "pass" : "warn",
      summary: result.northStarAligned ? "Aligned" : "Uncertain alignment",
      details: [`Score: ${result.northStarScore}/10`],
    },
    {
      id: "capability-gaps",
      label: "Capability Gap Analysis",
      status: result.capabilityGaps.length > 0 ? "pass" : "warn",
      summary: `${result.capabilityGaps.length} gap(s) identified`,
      details: topGap
        ? [`Top gap: ${topGap.name} (${Math.round(topGap.gap * 100)}%)`]
        : ["No significant gaps"],
    },
    {
      id: "recommended-initiative",
      label: terms.recommendedNextInitiative,
      status: result.recommendedInitiativeId ? "pass" : result.executionPackageRequired ? "warn" : "pass",
      summary: result.recommendedInitiativeId
        ? `${result.recommendedInitiativeId} · priority ${result.priorityScore.toFixed(2)}`
        : "Operational routing only",
      details: result.recommendedInitiativeId
        ? [result.recommendedInitiativeTitle ?? result.recommendedInitiativeId]
        : [org?.branchDirectorRationale ?? "No engineering initiative required."],
    },
    {
      id: "execution-package",
      label: terms.executionPackage,
      status: result.executionPackageTrigger ? "pass" : result.executionPackageRequired ? "warn" : "pass",
      summary: result.executionPackageTrigger
        ? "Trigger ready"
        : result.executionPackageRequired
          ? "Pending"
          : terms.noExecutionPackageRequired,
      details: result.executionPackageTrigger
        ? [`npm run atlas:mission -- ${result.executionPackageMissionId}`]
        : result.executionPackageRequired
          ? ["Complete mission registry alignment first."]
          : ["Atlas coordinates AI Workers without code generation."],
    },
  ];
}
