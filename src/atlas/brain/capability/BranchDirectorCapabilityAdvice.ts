import type { CapabilityRegistryEntry, CapabilityRecommendation } from "./capability.types";

function maturityLabel(score: number): string {
  if (score < 0.4) return "zeer laag";
  if (score < 0.7) return "laag";
  if (score < 0.85) return "ontwikkelend";
  return "volwassen";
}

function criticalityPhrase(critical: boolean): string {
  return critical ? "cruciaal voor autonomie" : "belangrijk voor de North Star";
}

export function buildBranchDirectorCapabilityAdvice(
  capability: CapabilityRegistryEntry,
  missionId: string,
  missionTitle?: string,
): string {
  const label = maturityLabel(capability.maturityScore);
  const criticality = criticalityPhrase(capability.northStarCritical);

  return [
    `Mijn advies is om ${capability.name} te verbeteren.`,
    `Reden: ${capability.name} is ${label} volwassen, maar ${criticality}.`,
    `Aanbevolen initiatief: ${missionTitle ? `${missionTitle} (${missionId})` : missionId}.`,
  ].join("\n");
}

export function buildCapabilityRecommendation(
  capability: CapabilityRegistryEntry,
  missionId: string,
  missionTitle: string,
): CapabilityRecommendation {
  return {
    capabilityId: capability.id,
    capabilityName: capability.name,
    missionId,
    missionTitle,
    strategicValue: capability.strategicValue,
    gapPercent: capability.gapPercent,
    branchDirectorAdvice: buildBranchDirectorCapabilityAdvice(capability, missionId, missionTitle),
  };
}

export function formatWeakCapabilitiesSummary(capabilities: CapabilityRegistryEntry[]): string {
  if (capabilities.length === 0) {
    return "Atlas ziet momenteel geen kritieke capability-zwaktes.";
  }

  return capabilities
    .slice(0, 4)
    .map(
      (item) =>
        `${item.name} (${Math.round(item.maturityScore * 100)}% volwassen, gap ${Math.round(item.gapPercent * 100)}%)`,
    )
    .join("; ");
}

export function formatStrongCapabilitiesSummary(capabilities: CapabilityRegistryEntry[]): string {
  if (capabilities.length === 0) {
    return "Nog geen capabilities op volwassen niveau.";
  }

  return capabilities
    .slice(0, 4)
    .map((item) => `${item.name} (${Math.round(item.maturityScore * 100)}%)`)
    .join("; ");
}
