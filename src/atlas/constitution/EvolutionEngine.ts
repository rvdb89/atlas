import type {
  CapabilityGap,
  EvolutionAnswers,
  EvolutionInput,
  EvolutionRecommendation,
  EvolutionResult,
} from "./evolution.types";
import {
  EVOLUTION_ENGINE_ID,
  EVOLUTION_HIERARCHY,
  getAtlasConstitution,
  getConstitutionNorthStarGoals,
} from "./AtlasConstitution";
import {
  assessCurrentState,
  getTargetMaturity,
  isNorthStarCritical,
} from "./CurrentStateRegistry";
import { getBranchDirectorTerminology } from "./BranchDirectorIdentity";
import { routeOrganization } from "../organization/OrganizationEngine";
import { getOrganizationalModel } from "../organization/OrganizationalModel";

const INTENT_CAPABILITY_PATTERNS: Array<{ pattern: RegExp; capabilityId: string }> = [
  { pattern: /\bevolv(e|ution|ing)\b|\bself[- ]improv/i, capabilityId: "orchestration" },
  { pattern: /\bhow to think\b|\bdecision framework\b|\bhow atlas decides\b/i, capabilityId: "orchestration" },
  { pattern: /\bconstitution\b|\bidentity\b|\bwhy atlas\b/i, capabilityId: "orchestration" },
  { pattern: /\borchestrat(e|ion|or)\b/i, capabilityId: "orchestration" },
  { pattern: /\breason(ing|en)?\b/i, capabilityId: "reasoning" },
  { pattern: /\bdecision(s| engine)?\b/i, capabilityId: "reasoning" },
  { pattern: /\bmemory\b/i, capabilityId: "memory" },
  { pattern: /\bcontext\b/i, capabilityId: "context" },
  { pattern: /\bplanning\b|\bplanner\b|\bplan\b/i, capabilityId: "planning" },
  { pattern: /\baudit\b|\bself[- ]review\b/i, capabilityId: "audit" },
  { pattern: /\bengineering\b|\bpackage(s)?\b/i, capabilityId: "engineering" },
  { pattern: /\bstudio\b|\bcommand center\b/i, capabilityId: "studio" },
  { pattern: /\bautonom(y|ous)\b/i, capabilityId: "reasoning" },
];

const NORTH_STAR_CAPABILITY_WEIGHT: Record<string, number> = {
  planning: 1.4,
  reasoning: 1.5,
  memory: 1.3,
  context: 1.3,
  orchestration: 1.2,
  audit: 1.0,
  engineering: 0.9,
  studio: 0.8,
};

function matchIntentCapabilities(intent: string): string[] {
  return [
    ...new Set(
      INTENT_CAPABILITY_PATTERNS.filter((entry) => entry.pattern.test(intent)).map(
        (entry) => entry.capabilityId,
      ),
    ),
  ];
}

function identifyGaps(intentCapabilityIds: string[]): CapabilityGap[] {
  const currentState = assessCurrentState();

  return currentState
    .map((state) => {
      const intentRelevant = intentCapabilityIds.includes(state.capabilityId);
      const targetMaturity = getTargetMaturity(state.capabilityId, intentRelevant);
      const gap = Math.max(0, targetMaturity - state.maturity);

      return {
        capabilityId: state.capabilityId,
        name: state.name,
        currentMaturity: state.maturity,
        targetMaturity,
        gap,
        systemId: state.systemId,
        intentRelevant,
        northStarCritical: isNorthStarCritical(state.capabilityId),
      };
    })
    .filter((item) => item.gap > 0.05)
    .sort((left, right) => right.gap - left.gap);
}

function scoreRecommendations(
  gaps: CapabilityGap[],
  intentCapabilityIds: string[],
): EvolutionRecommendation[] {
  const constitution = getAtlasConstitution();
  const currentState = assessCurrentState();
  const byMission = new Map<string, EvolutionRecommendation>();

  const scoringGaps =
    intentCapabilityIds.length > 0 ? gaps.filter((gap) => gap.intentRelevant) : gaps;

  for (const gap of scoringGaps) {
    const state = currentState.find((item) => item.capabilityId === gap.capabilityId);
    if (!state) continue;

    const intentWeight = intentCapabilityIds.includes(gap.capabilityId) ? 3 : gap.northStarCritical ? 1.5 : 1;
    const northStarWeight = NORTH_STAR_CAPABILITY_WEIGHT[gap.capabilityId] ?? 1;
    const stackBonus = gap.currentMaturity < 0.4 ? 1.3 : 1;
    const valueScore = gap.gap * intentWeight * northStarWeight * stackBonus;

    const roadmapItem = constitution.roadmap.find((item) => item.missionId === state.evolutionMissionId);
    const existing = byMission.get(state.evolutionMissionId);

    if (existing && existing.valueScore >= valueScore) continue;

    byMission.set(state.evolutionMissionId, {
      missionId: state.evolutionMissionId,
      title: roadmapItem?.title ?? state.evolutionMissionId,
      capabilityId: gap.capabilityId,
      systemId: gap.systemId,
      valueScore,
      gapClosed: gap.gap,
      why: buildRecommendationWhy(gap, state.evolutionMissionId, intentCapabilityIds),
      roadmapRationale: roadmapItem?.rationale ?? null,
    });
  }

  return [...byMission.values()].sort((left, right) => right.valueScore - left.valueScore);
}

function scoreAllRecommendations(
  gaps: CapabilityGap[],
  intentCapabilityIds: string[],
): EvolutionRecommendation[] {
  const primary = scoreRecommendations(gaps, intentCapabilityIds);
  if (intentCapabilityIds.length === 0) return primary;

  const secondary = scoreRecommendations(
    gaps.filter((gap) => !gap.intentRelevant),
    [],
  );

  const seen = new Set(primary.map((item) => item.missionId));
  return [...primary, ...secondary.filter((item) => !seen.has(item.missionId))];
}

function buildRecommendationWhy(
  gap: CapabilityGap,
  missionId: string,
  intentCapabilityIds: string[],
): string {
  const maturityPct = Math.round(gap.currentMaturity * 100);
  const intentNote = intentCapabilityIds.includes(gap.capabilityId)
    ? "Intent directly targets this capability."
    : "North Star autonomy stack gap.";

  return [
    `${gap.name} is at ${maturityPct}% maturity (gap: ${Math.round(gap.gap * 100)}%).`,
    intentNote,
    `${missionId} closes the highest-value evolution path for ${gap.systemId} system.`,
  ].join(" ");
}

function buildAnswers(input: {
  intent: string;
  gaps: CapabilityGap[];
  recommendations: EvolutionRecommendation[];
  selected: EvolutionRecommendation | null;
}): EvolutionAnswers {
  const constitution = getAtlasConstitution();
  const currentState = assessCurrentState();
  const avgMaturity =
    currentState.reduce((sum, item) => sum + item.maturity, 0) / Math.max(currentState.length, 1);

  const intentGaps = input.gaps.filter((item) => item.intentRelevant);
  const topGap = intentGaps[0] ?? input.gaps[0] ?? null;
  const topRec = input.selected ?? input.recommendations[0] ?? null;

  const developing = currentState.filter((item) => item.status === "developing").map((item) => item.name);
  const nascent = currentState.filter((item) => item.status === "nascent").map((item) => item.name);

  return {
    whereAreWeToday: [
      `Atlas platform maturity averages ${Math.round(avgMaturity * 100)}%.`,
      developing.length > 0 ? `Developing: ${developing.join(", ")}.` : "",
      nascent.length > 0 ? `Nascent: ${nascent.join(", ")}.` : "",
      "Evolution Engine assesses live capability state — not blind roadmap order.",
    ]
      .filter(Boolean)
      .join(" "),
    whereDoWeWantToBe: constitution.northStar,
    missingCapabilities: input.gaps
      .filter((item) => item.intentRelevant || item.northStarCritical)
      .map((item) => `${item.name} (${Math.round(item.gap * 100)}% gap)`),
    highestValueCapability: topGap?.name ?? topRec?.capabilityId ?? null,
    systemToEvolve: topRec?.systemId ?? topGap?.systemId ?? null,
    missionsToCreate: input.recommendations.slice(0, 3).map((item) => item.missionId),
    whyNextBestStep: topRec
      ? [
          topRec.why,
          topRec.roadmapRationale ? `Roadmap context: ${topRec.roadmapRationale}` : "",
          "Selected by evolution value score — not static roadmap priority.",
        ]
          .filter(Boolean)
          .join(" ")
      : "No evolution path identified — refine intent or extend Current State Registry.",
  };
}

function evaluateNorthStarScore(recommendations: EvolutionRecommendation[], intentIds: string[]): {
  aligned: boolean;
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [getConstitutionNorthStarGoals()[0]];
  let score = 0;

  if (recommendations.length > 0) {
    score += 4;
    reasons.push(`Evolution recommends ${recommendations[0].missionId} to close capability gaps toward autonomy.`);
  }

  if (intentIds.length > 0) {
    score += 3;
    reasons.push("Intent maps to capabilities that advance the North Star.");
  }

  if (recommendations.some((item) => item.gapClosed >= 0.3)) {
    score += 2;
    reasons.push("Recommendation closes a significant capability gap.");
  }

  return { aligned: score >= 4, score: Math.min(10, score), reasons };
}

function step(
  id: string,
  label: string,
  status: "pass" | "warn" | "fail",
  summary: string,
  details: string[],
): EvolutionResult["steps"][number] {
  return { id, label, status, summary, details };
}

export function runEvolution(input: EvolutionInput): EvolutionResult {
  const evaluatedAt = new Date().toISOString();
  const intent = (input.intent ?? "").trim();

  if (!intent && !input.missionId) {
    return {
      engineId: EVOLUTION_ENGINE_ID,
      intent: "",
      northStarAligned: false,
      northStarScore: 0,
      currentState: assessCurrentState(),
      capabilityGaps: [],
      evolutionRecommendations: [],
      answers: {
        whereAreWeToday: "No assessment run.",
        whereDoWeWantToBe: getConstitutionNorthStarGoals()[0],
        missingCapabilities: [],
        highestValueCapability: null,
        systemToEvolve: null,
        missionsToCreate: [],
        whyNextBestStep: "Provide intent to run Evolution Engine.",
      },
      selectedMissionId: null,
      selectionRationale: "Intent or Mission ID is required.",
      nextBestMissionId: null,
      missionRegistered: false,
      steps: [step("intent", "Intent", "fail", "No intent provided", ["Provide natural-language intent only."])],
      evaluatedAt,
    };
  }

  const normalizedIntent =
    intent || `Evolve registered mission ${input.missionId} toward North Star alignment.`;

  const organization = routeOrganization({ intent: normalizedIntent });
  const orgModel = getOrganizationalModel();
  const engineeringRequired = input.missionId ? true : organization.engineeringPackageRequired;

  const intentCapabilityIds = matchIntentCapabilities(normalizedIntent);
  const currentState = assessCurrentState();
  const gaps = identifyGaps(intentCapabilityIds);

  let recommendations = scoreAllRecommendations(gaps, intentCapabilityIds);

  if (input.missionId) {
    const overrideId = input.missionId.toUpperCase();
    const overrideState = currentState.find((item) => item.evolutionMissionId === overrideId);
    const roadmapItem = getAtlasConstitution().roadmap.find((item) => item.missionId === overrideId);
    recommendations = [
      {
        missionId: overrideId,
        title: roadmapItem?.title ?? overrideId,
        capabilityId: overrideState?.capabilityId ?? "orchestration",
        systemId: overrideState?.systemId ?? "engineering",
        valueScore: 10,
        gapClosed: overrideState ? 1 - overrideState.maturity : 0.5,
        why: `Mission ID ${overrideId} provided — evolution assessment confirms alignment.`,
        roadmapRationale: roadmapItem?.rationale ?? null,
      },
      ...recommendations.filter((item) => item.missionId !== overrideId),
    ];
  }

  let selected = recommendations[0] ?? null;
  let selectedMissionId = engineeringRequired ? (selected?.missionId ?? input.missionId?.toUpperCase() ?? null) : null;
  let nextBestMissionId = engineeringRequired ? (recommendations[1]?.missionId ?? null) : null;

  const organizationResult = {
    ...organization,
    engineeringMissionId: engineeringRequired && selectedMissionId ? selectedMissionId : null,
  };

  const northStarEval = engineeringRequired
    ? evaluateNorthStarScore(recommendations, intentCapabilityIds)
    : {
        aligned: organization.departmentAssignments.length > 0,
        score: organization.departmentAssignments.length > 0 ? 7 : 3,
        reasons: [
          getConstitutionNorthStarGoals()[0],
          "Operational intent routed through Organizational Model.",
          organization.branchDirectorRationale,
        ],
      };

  const answers = engineeringRequired
    ? buildAnswers({ intent: normalizedIntent, gaps, recommendations, selected })
    : {
        whereAreWeToday: `Atlas (Branch Director) coordinating ${organization.departmentAssignments.length} department(s).`,
        whereDoWeWantToBe: getConstitutionNorthStarGoals()[0],
        missingCapabilities: organization.organizationalCapabilities,
        highestValueCapability: organization.organizationalCapabilities[0] ?? null,
        systemToEvolve: organization.departmentAssignments[0]?.departmentId ?? null,
        missionsToCreate: [],
        whyNextBestStep: organization.branchDirectorRationale,
      };

  const missionRegistered = selectedMissionId
    ? (input.missionRegistered?.(selectedMissionId) ?? true)
    : false;

  const orgCapabilityDetails = organization.organizationalCapabilities.map((id) => {
    const cap = orgModel.organizationalCapabilities.find((item) => item.id === id);
    return cap ? `${cap.name} (${id})` : id;
  });

  const steps: EvolutionResult["steps"] = [
    step("intent", "Intent", "pass", "Intent recognized", [normalizedIntent]),
    step(
      "capability",
      "Capability",
      orgCapabilityDetails.length > 0 ? "pass" : "warn",
      orgCapabilityDetails.length > 0 ? `${orgCapabilityDetails.length} capability(ies) mapped` : "General operational capability",
      orgCapabilityDetails.length > 0 ? orgCapabilityDetails : ["Routed via Operations default"],
    ),
    step(
      "departments",
      "Department(s)",
      organization.departmentAssignments.length > 0 ? "pass" : "warn",
      `${organization.departmentAssignments.length} department(s) selected`,
      organization.departmentAssignments.map(
        (item) => `${item.departmentName} (${item.role}) — ${item.rationale}`,
      ),
    ),
    step(
      "worker-assignment",
      "Worker Assignment",
      organization.workerAssignments.length > 0 ? "pass" : "warn",
      `${organization.workerAssignments.length} worker(s) assigned`,
      organization.workerAssignments.map(
        (item) => `${item.workerName} · ${item.departmentId} — ${item.task}`,
      ),
    ),
    step(
      "execution-plan",
      "Execution Plan",
      organization.executionPlan.length > 0 ? "pass" : "warn",
      `${organization.executionPlan.length} step(s) planned`,
      organization.executionPlan.map(
        (item) => `${item.order}. ${item.action} → ${item.deliverable}`,
      ),
    ),
  ];

  if (engineeringRequired) {
    steps.push(
      step(
        "current-state",
        "Current State",
        "pass",
        `${currentState.length} platform capabilities assessed`,
        currentState.slice(0, 4).map(
          (item) => `${item.name}: ${Math.round(item.maturity * 100)}% (${item.status})`,
        ),
      ),
      step(
        "north-star",
        "North Star",
        northStarEval.aligned ? "pass" : "warn",
        northStarEval.aligned ? "North Star alignment confirmed" : "North Star alignment uncertain",
        northStarEval.reasons,
      ),
      step(
        "capability-gaps",
        "Capability Gaps",
        gaps.length > 0 ? "pass" : "warn",
        `${gaps.length} platform gap(s) identified`,
        gaps.slice(0, 4).map(
          (item) =>
            `${item.name}: gap ${Math.round(item.gap * 100)}%${item.intentRelevant ? " · intent-relevant" : ""}`,
        ),
      ),
      step(
        "recommended-evolution",
        "Recommended Evolution",
        selected ? "pass" : "warn",
        selected ? `${selected.missionId} · ${selected.title}` : "No evolution path",
        recommendations.slice(0, 3).map((item) => `${item.missionId} — ${item.why}`),
      ),
    );
  } else {
    steps.push(
      step(
        "north-star",
        "North Star",
        "pass",
        "Operational alignment confirmed",
        northStarEval.reasons,
      ),
    );
  }

  const terms = getBranchDirectorTerminology();

  steps.push(
    step(
      "mission-registry",
      "Mission Registry",
      engineeringRequired
        ? selectedMissionId && missionRegistered
          ? "pass"
          : selectedMissionId
            ? "warn"
            : "fail"
        : "pass",
      engineeringRequired
        ? selectedMissionId
          ? missionRegistered
            ? `${selectedMissionId} registered`
            : `${selectedMissionId} not in registry`
          : "No mission selected"
        : "Not required — operational routing only",
      engineeringRequired
        ? [missionRegistered ? `Ready for ${terms.executionPackage}.` : "Add mission card to registry."]
        : ["Atlas assigns AI Workers directly — no mission registry needed."],
    ),
    step(
      "engineering-package",
      terms.executionPackage,
      engineeringRequired
        ? selectedMissionId && missionRegistered
          ? "pass"
          : "warn"
        : "pass",
      engineeringRequired
        ? selectedMissionId && missionRegistered
          ? "Ready to generate"
          : "Pending"
        : terms.noExecutionPackageRequired,
      engineeringRequired && selectedMissionId && missionRegistered
        ? [`npm run atlas:mission -- ${selectedMissionId}`]
        : engineeringRequired
          ? []
          : ["Atlas (Branch Director) coordinates departments without code generation."],
    ),
  );

  return {
    engineId: EVOLUTION_ENGINE_ID,
    intent: normalizedIntent,
    northStarAligned: northStarEval.aligned,
    northStarScore: northStarEval.score,
    currentState,
    capabilityGaps: gaps,
    evolutionRecommendations: recommendations,
    answers,
    selectedMissionId,
    selectionRationale: engineeringRequired
      ? answers.whyNextBestStep
      : organization.branchDirectorRationale,
    nextBestMissionId,
    missionRegistered,
    steps,
    organization: organizationResult,
    evaluatedAt,
  };
}

export function renderEvolutionHierarchy(): string {
  return EVOLUTION_HIERARCHY.join("\n↓\n");
}

export function getEvolutionEngineDefinition() {
  return getAtlasConstitution().evolutionEngine;
}
