import type { AtlasTaskType, TaskRoutingDecision } from "../types";
import { resolveTaskTypeName } from "../types";
import { getModelProfile } from "../models/profiles";
import { getTaskRouteConfig } from "../tasks/routes";
import { getTaskProviderConfig, resolveEffectiveTaskProviderConfig } from "../providers/provider-config";
import { TASK_PROMPT_IDS } from "../prompts/library";
import { modelRegistry } from "../registry/modelRegistry";

const availabilityOverrides = new Map<string, boolean>();
const loadBalanceCounters = new Map<string, number>();

export function setModelAvailability(modelId: string, available: boolean): void {
  availabilityOverrides.set(modelId, available);
  modelRegistry.setAvailability(modelId, available);
}

export function isModelAvailable(modelId: string): boolean {
  if (availabilityOverrides.has(modelId)) {
    return availabilityOverrides.get(modelId)!;
  }
  return getModelProfile(modelId)?.available ?? false;
}

function rankModels(modelIds: string[]): string[] {
  return [...modelIds].sort((left, right) => {
    const leftProfile = getModelProfile(left);
    const rightProfile = getModelProfile(right);
    const leftPriority = leftProfile?.priority ?? 100;
    const rightPriority = rightProfile?.priority ?? 100;
    if (leftPriority !== rightPriority) return leftPriority - rightPriority;
    return (rightProfile?.rankScore ?? 0) - (leftProfile?.rankScore ?? 0);
  });
}

function applyLoadBalancing(task: AtlasTaskType, modelIds: string[]): { chain: string[]; loadBalanced: boolean } {
  if (modelIds.length < 2) return { chain: modelIds, loadBalanced: false };

  const topPriority = getModelProfile(modelIds[0])?.priority;
  const peerGroup = modelIds.filter((id) => (getModelProfile(id)?.priority ?? 100) === topPriority);
  if (peerGroup.length < 2) return { chain: modelIds, loadBalanced: false };

  const key = `${task}:${topPriority}`;
  const counter = loadBalanceCounters.get(key) ?? 0;
  loadBalanceCounters.set(key, counter + 1);
  const selected = peerGroup[counter % peerGroup.length];
  const rest = modelIds.filter((id) => id !== selected);
  return { chain: [selected, ...rest], loadBalanced: true };
}

function buildProviderChain(primaryId: string, fallbackIds: string[]): string[] {
  const ids = [primaryId, ...fallbackIds];
  const seen = new Set<string>();
  const chain: string[] = [];

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (getModelProfile(id)) chain.push(id);
  }

  for (const model of chain) {
    const fallback = getModelProfile(model)?.fallbackModelId;
    if (fallback && !seen.has(fallback) && getModelProfile(fallback)) {
      seen.add(fallback);
      chain.push(fallback);
    }
  }

  const ranked = rankModels(chain);
  const available = ranked.filter((id) => isModelAvailable(id));
  return available.length > 0 ? available : ranked;
}

export function routeTask(task: AtlasTaskType): TaskRoutingDecision {
  const config = getTaskRouteConfig(task);
  const providerConfig = resolveEffectiveTaskProviderConfig(task);
  const baseChain = buildProviderChain(config.primaryModelId, config.fallbackModelIds);
  const { chain, loadBalanced } = applyLoadBalancing(task, baseChain);

  if (chain.length === 0) {
    throw new Error(`No providers configured for task: ${task}`);
  }

  return {
    task,
    taskName: resolveTaskTypeName(task),
    agentId: config.agentId,
    primaryModelId: chain[0],
    primaryProviderId: providerConfig.providerId,
    fallbackModelIds: chain.slice(1),
    providerChain: chain,
    promptId: config.promptId ?? TASK_PROMPT_IDS[task],
    settings: config.defaultSettings ?? {},
    loadBalanced,
  };
}

export function getAllTaskRoutes(): TaskRoutingDecision[] {
  return (Object.keys(TASK_PROMPT_IDS) as AtlasTaskType[]).map((task) => routeTask(task));
}

export function listProviderHealth() {
  const now = new Date().toISOString();
  const seen = new Set<string>();
  const health: Array<{
    modelId: string;
    available: boolean;
    lastCheckedAt: string;
    message?: string;
  }> = [];

  for (const route of getAllTaskRoutes()) {
    for (const modelId of route.providerChain) {
      if (seen.has(modelId)) continue;
      seen.add(modelId);
      health.push({
        modelId,
        available: isModelAvailable(modelId),
        lastCheckedAt: now,
        message: isModelAvailable(modelId) ? "Available" : "Unavailable — fallback active",
      });
    }
  }

  return health;
}
