import type { MissionCard } from "../brief-generator/MissionCard";
import { getBriefTemplate } from "../brief-generator/BriefTemplate";
import {
  ATLAS_CONSTITUTION_ID,
  ATLAS_CONSTITUTION_PATH,
  evaluateNorthStarAlignment,
  getBranchDirectorTerminology,
  getConstitutionArchitectureRules,
  getConstitutionEngineeringStandards,
  getConstitutionNorthStarGoals,
  renderConstitutionHierarchy,
  runDecisionFramework,
  type DecisionResult,
} from "@/atlas/constitution";
import type { MissionRegistryEntry } from "./mission.types";

export type MissionDependency = {
  missionId: string;
  title: string;
  relationship: "requires" | "extends" | "related";
  reason: string;
};

export type MissionPipelineStepId =
  | "decision-engine"
  | "organization"
  | "evolution-engine"
  | "decision-framework"
  | "constitution"
  | "north-star"
  | "principles"
  | "capabilities"
  | "systems"
  | "roadmap"
  | "mission-registry"
  | "engineering-standards"
  | "architecture-rules"
  | "mission-dependencies"
  | "definition-of-done"
  | "validation-plan"
  | "engineering-package";

export type MissionPipelineStep = {
  id: MissionPipelineStepId;
  label: string;
  source: "constitution" | "mission-registry" | "generated";
};

export type InferredMissionContext = {
  missionId: string;
  card: MissionCard;
  registryEntry: MissionRegistryEntry;
  constitutionId: string;
  constitutionPath: string;
  engineeringStandards: string[];
  northStarGoals: string[];
  architectureRules: string[];
  dependencies: MissionDependency[];
  definitionOfDone: string[];
  validationChecks: string[];
  pipeline: MissionPipelineStep[];
  decisionTrace: DecisionResult;
  northStarEvaluation: {
    advancesNorthStar: boolean;
    score: number;
    reasons: string[];
  };
};

/** @deprecated Use getConstitutionEngineeringStandards() from @/atlas/constitution */
export const ATLAS_ENGINEERING_STANDARDS = getConstitutionEngineeringStandards();

/** @deprecated Use getConstitutionArchitectureRules() from @/atlas/constitution */
export const ATLAS_ARCHITECTURE_RULES = getConstitutionArchitectureRules();

/** @deprecated Use getConstitutionNorthStarGoals() from @/atlas/constitution */
export const ATLAS_NORTH_STAR_GOALS = getConstitutionNorthStarGoals();

const KNOWN_DEPENDENCIES: Record<
  string,
  Array<{ missionId: string; title?: string; reason: string; relationship?: MissionDependency["relationship"] }>
> = {
  "ATLAS-000": [],
  "ATLAS-003": [
    { missionId: "ATLAS-002", title: "Organizational Model", reason: "Branch Director identity builds on organizational model", relationship: "requires" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Identity derives from Constitution", relationship: "requires" },
  ],
  "ATLAS-002": [
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Organizational Model extends Constitution identity", relationship: "requires" },
    { missionId: "ATLAS-001", title: "Evolution Engine", reason: "Evolution complements organizational routing", relationship: "requires" },
  ],
  "ATLAS-001": [
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Evolution Engine derives from Constitution", relationship: "requires" },
  ],
  "BRAIN-001": [
    { missionId: "ATLAS-001", title: "Evolution Engine", reason: "Planning missions pass through Evolution Engine", relationship: "requires" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Constitution defines planning capability", relationship: "requires" },
  ],
  "BRAIN-005": [
    { missionId: "BRAIN-004", title: "Decision Engine", reason: "Registry feeds Decision Engine recommendations", relationship: "requires" },
    { missionId: "ATLAS-001", title: "Evolution Engine", reason: "Evolution scoring uses registry strategic value", relationship: "requires" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Capabilities defined in Constitution", relationship: "requires" },
  ],
  "STUDIO-002": [
    { missionId: "STUDIO-001", title: "CEO Workflow", reason: "Debrief flow extends CEO Workflow in Studio", relationship: "requires" },
    { missionId: "BRAIN-004", title: "Decision Engine", reason: "Next initiative recommendation comes from Decision Engine", relationship: "requires" },
    { missionId: "ATLAS-003", title: "Branch Director Identity", reason: "Debrief uses Branch Director language", relationship: "requires" },
  ],
  "STUDIO-001": [
    { missionId: "BRAIN-004", title: "Decision Engine", reason: "CEO Workflow orchestrates Decision Engine output", relationship: "requires" },
    { missionId: "ATLAS-003", title: "Branch Director Identity", reason: "CEO Workflow uses Branch Director terminology", relationship: "requires" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Constitution defines CEO intent-only model", relationship: "requires" },
  ],
  "BRAIN-004": [
    { missionId: "BRAIN-003", title: "Context Engine", reason: "Context engine informs decision inputs", relationship: "requires" },
    { missionId: "BRAIN-002", title: "Memory Engine", reason: "Memory engine supplies decision history", relationship: "requires" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Constitution is the highest source of truth", relationship: "requires" },
  ],
  "ENG-006": [
    { missionId: "ENG-002", reason: "Brief generator is orchestrated by mission pipeline", relationship: "requires" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Mission derivation follows Constitution hierarchy", relationship: "requires" },
  ],
  "ENG-006B": [
    { missionId: "ENG-006", reason: "Extends mission orchestrator with package structure", relationship: "extends" },
    { missionId: "ENG-002", reason: "Brief generator remains backward compatible", relationship: "related" },
    { missionId: "ATLAS-000", title: "Atlas Constitution", reason: "Packages derive from Constitution", relationship: "requires" },
  ],
};

const PIPELINE_STEPS: MissionPipelineStep[] = [
  { id: "decision-engine", label: "Decision Engine", source: "constitution" },
  { id: "organization", label: "Organizational Model", source: "constitution" },
  { id: "evolution-engine", label: "Evolution Engine", source: "constitution" },
  { id: "decision-framework", label: "Decision Framework", source: "constitution" },
  { id: "constitution", label: "Constitution", source: "constitution" },
  { id: "north-star", label: "North Star", source: "constitution" },
  { id: "principles", label: "Principles", source: "constitution" },
  { id: "capabilities", label: "Capabilities", source: "constitution" },
  { id: "systems", label: "Systems", source: "constitution" },
  { id: "roadmap", label: "Roadmap", source: "constitution" },
  { id: "mission-registry", label: "Mission Registry", source: "mission-registry" },
  { id: "engineering-standards", label: "Engineering Standards", source: "constitution" },
  { id: "architecture-rules", label: "Architecture Rules", source: "constitution" },
  { id: "mission-dependencies", label: "Mission Dependencies", source: "generated" },
  { id: "definition-of-done", label: "Definition of Done", source: "generated" },
  { id: "validation-plan", label: "Validation Plan", source: "generated" },
  { id: "engineering-package", label: getBranchDirectorTerminology().executionPackage, source: "generated" },
];

function inferNumericDependencies(
  missionId: string,
  knownMissions: MissionRegistryEntry[],
): MissionDependency[] {
  const prefix = missionId.split("-")[0];
  const number = Number(missionId.split("-")[1]);
  if (!Number.isFinite(number)) return [];

  const deps: MissionDependency[] = [];
  for (const entry of knownMissions) {
    if (entry.id === missionId) continue;
    const entryPrefix = entry.id.split("-")[0];
    const entryNumber = Number(entry.id.split("-")[1]);
    if (entryPrefix !== prefix || !Number.isFinite(entryNumber) || entryNumber >= number) continue;

    deps.push({
      missionId: entry.id,
      title: entry.card.title,
      relationship: "requires",
      reason: `Prior ${prefix} mission in sequence`,
    });
  }

  return deps;
}

function mergeDependencies(
  missionId: string,
  knownMissions: MissionRegistryEntry[],
): MissionDependency[] {
  const byId = new Map<string, MissionDependency>();

  for (const dep of inferNumericDependencies(missionId, knownMissions)) {
    byId.set(dep.missionId, dep);
  }

  for (const known of KNOWN_DEPENDENCIES[missionId] ?? []) {
    const entry = knownMissions.find((item) => item.id === known.missionId);
    byId.set(known.missionId, {
      missionId: known.missionId,
      title: known.title ?? entry?.card.title ?? known.missionId,
      relationship: known.relationship ?? "requires",
      reason: known.reason,
    });
  }

  return [...byId.values()].sort((left, right) => left.missionId.localeCompare(right.missionId));
}

function buildDefinitionOfDone(card: MissionCard): string[] {
  return [
    `${card.title} module exists under src/atlas/`,
    ...card.focus.map((item) => `${item} implemented per mission scope`),
    ...card.constraints.map((item) => `Constraint respected: ${item}`),
    "TypeScript compiles clean",
    `npm run atlas:mission ${card.mission} regenerates package`,
    "npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES",
    card.success,
  ];
}

export function inferMissionContext(
  entry: MissionRegistryEntry,
  knownMissions: MissionRegistryEntry[],
  options?: {
    missionRegistered?: (missionId: string) => boolean;
    decisionTrace?: DecisionResult;
  },
): InferredMissionContext {
  const template = getBriefTemplate(entry.card.templateId);
  const engineeringStandards = getConstitutionEngineeringStandards();
  const northStarGoals = [...getConstitutionNorthStarGoals(), ...template.northStarGoals];
  const architectureRules = [...getConstitutionArchitectureRules(), ...template.architecturePrinciples];

  const decisionTrace =
    options?.decisionTrace ??
    runDecisionFramework({
      missionId: entry.id,
      missionRegistered: options?.missionRegistered,
    });

  return {
    missionId: entry.id,
    card: entry.card,
    registryEntry: entry,
    constitutionId: ATLAS_CONSTITUTION_ID,
    constitutionPath: ATLAS_CONSTITUTION_PATH,
    engineeringStandards,
    northStarGoals,
    architectureRules,
    dependencies: mergeDependencies(entry.id, knownMissions),
    definitionOfDone: buildDefinitionOfDone(entry.card),
    validationChecks: [
      ...template.validationChecks.map((check) => check.replace("<MISSION_ID>", entry.id)),
      "npm run atlas:constitution",
      `npm run atlas:decide -- "intent for ${entry.id}"`,
      `npm run atlas:mission ${entry.id}`,
    ],
    pipeline: PIPELINE_STEPS,
    decisionTrace,
    northStarEvaluation: evaluateNorthStarAlignment({
      missionId: entry.id,
      title: entry.card.title,
      focus: entry.card.focus,
    }),
  };
}

export function renderPipelineDiagram(): string {
  return renderConstitutionHierarchy();
}

export function renderBulletList(items: string[]): string {
  if (items.length === 0) return "_None specified._";
  return items.map((item) => `- ${item}`).join("\n");
}

export function renderChecklist(items: string[]): string {
  return items.map((item) => `- [ ] ${item}`).join("\n");
}

export function renderDependencies(deps: MissionDependency[]): string {
  if (deps.length === 0) return "_No upstream mission dependencies inferred._";
  return deps
    .map((dep) => `- **${dep.missionId}** · ${dep.title} · _${dep.relationship}_ — ${dep.reason}`)
    .join("\n");
}
