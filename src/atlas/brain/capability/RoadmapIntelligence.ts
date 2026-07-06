import {
  buildBranchDirectorCapabilityAdvice,
  buildCapabilityRecommendation,
  formatStrongCapabilitiesSummary,
  formatWeakCapabilitiesSummary,
} from "./BranchDirectorCapabilityAdvice";
import { getCapabilityRegistry, getCapabilityRegistryEntry } from "./CapabilityRegistry";
import type { CapabilityIntelligenceSnapshot, CapabilityRegistryEntry } from "./capability.types";
import { CAPABILITY_REGISTRY_ID } from "./capability.types";

const WEAK_MATURITY_THRESHOLD = 0.75;
const STRONG_MATURITY_THRESHOLD = 0.8;

export function getWeakCapabilities(): CapabilityRegistryEntry[] {
  return getCapabilityRegistry()
    .filter((item) => item.maturityScore < WEAK_MATURITY_THRESHOLD || item.gapPercent >= 0.1)
    .sort((left, right) => right.strategicValue - left.strategicValue);
}

export function getStrongCapabilities(): CapabilityRegistryEntry[] {
  return getCapabilityRegistry()
    .filter((item) => item.maturityScore >= STRONG_MATURITY_THRESHOLD && item.gapPercent < 0.1)
    .sort((left, right) => right.maturityScore - left.maturityScore);
}

export function selectTopCapabilityRecommendation(
  intentCapabilityIds: string[] = [],
): CapabilityRegistryEntry | null {
  const pool =
    intentCapabilityIds.length > 0
      ? getCapabilityRegistry().filter((item) => intentCapabilityIds.includes(item.id))
      : getCapabilityRegistry();

  const ranked = [...pool].sort((left, right) => {
    const leftScore = left.strategicValue * (left.gapPercent + 0.1);
    const rightScore = right.strategicValue * (right.gapPercent + 0.1);
    return rightScore - leftScore;
  });

  return ranked[0] ?? null;
}

export function answerWhereAreWeWeak(): string {
  const weak = getWeakCapabilities();
  return formatWeakCapabilitiesSummary(weak);
}

export function answerWhatShouldWeBuildNext(intentCapabilityIds: string[] = []): string {
  const top = selectTopCapabilityRecommendation(intentCapabilityIds);
  if (!top) return "Geen duidelijke volgende stap — verfijn intent of update de Capability Registry.";

  const initiative = top.relatedInitiatives[0];
  if (!initiative) {
    return `Verbeter ${top.name} — hoogste strategische waarde in de registry.`;
  }

  return `${initiative.missionId} (${initiative.title}) via ${top.name}.`;
}

export function answerWhyIsThisBestNextStep(
  capabilityId: string,
  missionId?: string,
): string {
  const capability = getCapabilityRegistryEntry(capabilityId);
  if (!capability) return "Capability niet gevonden in registry.";

  const initiative =
    capability.relatedInitiatives.find((item) => item.missionId === missionId) ??
    capability.relatedInitiatives[0];

  if (!initiative) {
    return `${capability.name} heeft de hoogste strategische waarde (${capability.strategicValue.toFixed(2)}) voor de North Star.`;
  }

  return buildBranchDirectorCapabilityAdvice(capability, initiative.missionId, initiative.title);
}

export function analyzeCapabilityIntelligence(input?: {
  intentCapabilityIds?: string[];
}): CapabilityIntelligenceSnapshot {
  const capabilities = getCapabilityRegistry();
  const weakCapabilities = getWeakCapabilities();
  const strongCapabilities = getStrongCapabilities();
  const topCapability = selectTopCapabilityRecommendation(input?.intentCapabilityIds ?? []);

  const topRecommendation = topCapability
    ? (() => {
        const initiative = topCapability.relatedInitiatives[0];
        if (!initiative) return null;
        return buildCapabilityRecommendation(topCapability, initiative.missionId, initiative.title);
      })()
    : null;

  const whyAnswer = topRecommendation
    ? topRecommendation.branchDirectorAdvice
    : topCapability
      ? answerWhyIsThisBestNextStep(topCapability.id)
      : "Geen capability recommendation beschikbaar.";

  return {
    registryId: CAPABILITY_REGISTRY_ID,
    capabilities,
    weakCapabilities,
    strongCapabilities,
    topRecommendation,
    answers: {
      whereAreWeWeak: answerWhereAreWeWeak(),
      whatShouldWeBuildNext: answerWhatShouldWeBuildNext(input?.intentCapabilityIds),
      whyIsThisBestNextStep: whyAnswer,
    },
  };
}
