import {
  assessCurrentState,
  getTargetMaturity,
  isNorthStarCritical,
} from "@/atlas/constitution/CurrentStateRegistry";
import { getAtlasConstitution } from "@/atlas/constitution/AtlasConstitution";
import type { CapabilityMaturity } from "@/atlas/constitution/evolution.types";

import type { CapabilityInitiativeLink, CapabilityRegistryEntry } from "./capability.types";

const NORTH_STAR_STRATEGIC_WEIGHT: Record<string, number> = {
  planning: 1.4,
  reasoning: 1.5,
  memory: 1.3,
  context: 1.3,
  orchestration: 1.2,
  audit: 1.0,
  engineering: 0.9,
  studio: 0.8,
};

function computeStrategicValue(input: {
  capabilityId: string;
  maturityScore: number;
  gapPercent: number;
  northStarCritical: boolean;
}): number {
  const northStarWeight = NORTH_STAR_STRATEGIC_WEIGHT[input.capabilityId] ?? 1;
  const gapWeight = input.gapPercent * northStarWeight;
  const immaturityBonus = input.maturityScore < 0.6 ? 0.25 : input.maturityScore < 0.8 ? 0.1 : 0;
  const criticalBonus = input.northStarCritical ? 0.35 : 0.08;

  return Math.min(1, Number((gapWeight + immaturityBonus + criticalBonus).toFixed(3)));
}

function buildRelatedInitiatives(
  systemId: string,
  primaryMissionId: string,
): CapabilityInitiativeLink[] {
  const constitution = getAtlasConstitution();
  const links = new Map<string, CapabilityInitiativeLink>();

  const primary = constitution.roadmap.find((item) => item.missionId === primaryMissionId);
  if (primary) {
    links.set(primary.missionId, {
      missionId: primary.missionId,
      title: primary.title,
      rationale: primary.rationale,
    });
  }

  for (const item of constitution.roadmap) {
    if (item.systemId !== systemId && item.missionId !== primaryMissionId) continue;
    if (links.has(item.missionId)) continue;
    links.set(item.missionId, {
      missionId: item.missionId,
      title: item.title,
      rationale: item.rationale,
    });
  }

  return [...links.values()].sort((left, right) => {
    if (left.missionId === primaryMissionId) return -1;
    if (right.missionId === primaryMissionId) return 1;
    return left.missionId.localeCompare(right.missionId);
  });
}

function buildCurrentGaps(input: {
  maturityScore: number;
  gapPercent: number;
  status: CapabilityMaturity;
  evidence: string[];
  northStarCritical: boolean;
}): string[] {
  const gaps: string[] = [];

  if (input.status === "nascent") {
    gaps.push("Capability is nascent — foundation not yet established.");
  }
  if (input.maturityScore < 0.6) {
    gaps.push(`Low maturity (${Math.round(input.maturityScore * 100)}%) limits autonomous execution.`);
  }
  if (input.gapPercent >= 0.2) {
    gaps.push(`Gap of ${Math.round(input.gapPercent * 100)}% to target maturity.`);
  }
  if (input.northStarCritical && input.maturityScore < 0.85) {
    gaps.push("North Star-critical capability below autonomy threshold.");
  }

  if (gaps.length === 0 && input.evidence.length > 0) {
    gaps.push(`Remaining work: ${input.evidence[0]}`);
  }

  return gaps;
}

function buildRecommendedNextStep(entry: CapabilityRegistryEntry): string {
  const initiative = entry.relatedInitiatives[0];
  if (!initiative) {
    return `Close ${entry.name} gap toward North Star alignment.`;
  }

  return `Execute ${initiative.missionId} (${initiative.title}) to strengthen ${entry.name}.`;
}

function buildRegistryEntry(
  capability: { id: string; name: string; description: string },
  snapshot: ReturnType<typeof assessCurrentState>[number],
): CapabilityRegistryEntry {
  const northStarCritical = isNorthStarCritical(capability.id);
  const targetMaturity = getTargetMaturity(capability.id, false);
  const gapPercent = Math.max(0, targetMaturity - snapshot.maturity);
  const strategicValue = computeStrategicValue({
    capabilityId: capability.id,
    maturityScore: snapshot.maturity,
    gapPercent,
    northStarCritical,
  });

  const relatedInitiatives = buildRelatedInitiatives(snapshot.systemId, snapshot.evolutionMissionId);

  const draft: CapabilityRegistryEntry = {
    id: capability.id,
    name: capability.name,
    description: capability.description,
    maturityScore: snapshot.maturity,
    status: snapshot.status,
    relatedSystems: [snapshot.systemId],
    relatedInitiatives,
    strategicValue,
    currentGaps: [],
    recommendedNextStep: "",
    gapPercent,
    northStarCritical,
    missing: snapshot.status === "nascent" && snapshot.maturity < 0.2,
  };

  draft.currentGaps = buildCurrentGaps({
    maturityScore: draft.maturityScore,
    gapPercent: draft.gapPercent,
    status: draft.status,
    evidence: snapshot.evidence,
    northStarCritical,
  });
  draft.recommendedNextStep = buildRecommendedNextStep(draft);

  return draft;
}

let cachedRegistry: CapabilityRegistryEntry[] | null = null;

export function invalidateCapabilityRegistryCache(): void {
  cachedRegistry = null;
}

export function getCapabilityRegistry(): CapabilityRegistryEntry[] {
  if (cachedRegistry) return cachedRegistry;

  const constitution = getAtlasConstitution();
  const snapshots = assessCurrentState();
  const snapshotById = new Map(snapshots.map((item) => [item.capabilityId, item]));

  cachedRegistry = constitution.capabilities.map((capability) => {
    const snapshot = snapshotById.get(capability.id) ?? {
      capabilityId: capability.id,
      name: capability.name,
      maturity: 0.1,
      status: "nascent" as const,
      systemId: "engineering",
      evidence: ["Capability not yet assessed"],
      evolutionMissionId: "ATLAS-001",
    };

    return buildRegistryEntry(capability, snapshot);
  });

  return cachedRegistry;
}

export function getCapabilityRegistryEntry(capabilityId: string): CapabilityRegistryEntry | undefined {
  return getCapabilityRegistry().find((item) => item.id === capabilityId);
}

export function getCapabilityStrategicValue(capabilityId: string): number {
  return getCapabilityRegistryEntry(capabilityId)?.strategicValue ?? 0;
}
