import type { CapabilityMaturity, CapabilityStateSnapshot } from "./evolution.types";
import { getAtlasConstitution } from "./AtlasConstitution";

type CapabilityStateDefinition = {
  maturity: number;
  status: CapabilityMaturity;
  systemId: string;
  evolutionMissionId: string;
  evidence: string[];
  northStarCritical: boolean;
};

const CAPABILITY_STATE: Record<string, CapabilityStateDefinition> = {
  planning: {
    maturity: 0.55,
    status: "developing",
    systemId: "brain",
    evolutionMissionId: "BRAIN-001",
    evidence: [
      "PlannerEngine and PlannerRegistry exist",
      "Default planners registered",
      "Planning layer not yet hardened as dedicated evolution mission",
    ],
    northStarCritical: true,
  },
  memory: {
    maturity: 0.5,
    status: "developing",
    systemId: "brain",
    evolutionMissionId: "BRAIN-002",
    evidence: ["MemoryEngine and MemoryStore exist", "Workflow memory integration present"],
    northStarCritical: true,
  },
  context: {
    maturity: 0.5,
    status: "developing",
    systemId: "brain",
    evolutionMissionId: "BRAIN-003",
    evidence: ["ContextEngine and ContextRegistry exist", "Planner context provider wired"],
    northStarCritical: true,
  },
  reasoning: {
    maturity: 0.9,
    status: "mature",
    systemId: "brain",
    evolutionMissionId: "BRAIN-005",
    evidence: [
      "Decision Engine operational (BRAIN-004)",
      "Capability Registry and Roadmap Intelligence (BRAIN-005)",
      "Branch Director advice grounded in capability gaps and strategic value",
    ],
    northStarCritical: true,
  },
  orchestration: {
    maturity: 0.9,
    status: "mature",
    systemId: "engineering",
    evolutionMissionId: "ATLAS-001",
    evidence: [
      "Constitution and Evolution Engine active",
      "Mission orchestrator generates packages from intent",
    ],
    northStarCritical: true,
  },
  audit: {
    maturity: 0.85,
    status: "mature",
    systemId: "auditor",
    evolutionMissionId: "ENG-006B",
    evidence: ["Atlas Auditor with release decisions", "Strict mode and quality scoring"],
    northStarCritical: false,
  },
  engineering: {
    maturity: 0.8,
    status: "mature",
    systemId: "engineering",
    evolutionMissionId: "ENG-006B",
    evidence: ["Engineering package structure", "Mission brief generator"],
    northStarCritical: false,
  },
  studio: {
    maturity: 0.9,
    status: "mature",
    systemId: "studio",
    evolutionMissionId: "STUDIO-002",
    evidence: [
      "CEO Workflow operational (STUDIO-001)",
      "Branch Director Debrief Flow with continue-or-adjust (STUDIO-002)",
      "Dutch CEO-facing debrief — no terminal-first workflow",
    ],
    northStarCritical: false,
  },
};

export function assessCurrentState(): CapabilityStateSnapshot[] {
  const constitution = getAtlasConstitution();

  return constitution.capabilities.map((capability) => {
    const state = CAPABILITY_STATE[capability.id] ?? {
      maturity: 0.1,
      status: "nascent" as const,
      systemId: "engineering",
      evolutionMissionId: "ATLAS-001",
      evidence: ["Capability not yet assessed in Current State Registry"],
      northStarCritical: false,
    };

    return {
      capabilityId: capability.id,
      name: capability.name,
      maturity: state.maturity,
      status: state.status,
      systemId: state.systemId,
      evidence: state.evidence,
      evolutionMissionId: state.evolutionMissionId,
    };
  });
}

export function getCapabilityState(capabilityId: string): CapabilityStateSnapshot | undefined {
  return assessCurrentState().find((item) => item.capabilityId === capabilityId);
}

export function isNorthStarCritical(capabilityId: string): boolean {
  return CAPABILITY_STATE[capabilityId]?.northStarCritical ?? false;
}

export function getTargetMaturity(capabilityId: string, intentRelevant: boolean): number {
  if (intentRelevant) return 1;
  if (isNorthStarCritical(capabilityId)) return 0.9;
  return 0.75;
}
