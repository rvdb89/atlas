import type { AtlasTaskType, TaskRoutingDecision } from "../types";
import { getModelProfile } from "../models/profiles";
import { getTaskRouteConfig } from "../tasks/routes";
import { TASK_PROMPT_IDS } from "../prompts/library";

const availabilityOverrides = new Map<string, boolean>();

export function setModelAvailability(modelId: string, available: boolean): void {
  availabilityOverrides.set(modelId, available);
}

export function isModelAvailable(modelId: string): boolean {
  if (availabilityOverrides.has(modelId)) {
    return availabilityOverrides.get(modelId)!;
  }
  return getModelProfile(modelId)?.available ?? false;
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

  const available = chain.filter((id) => isModelAvailable(id));
  return available.length > 0 ? available : chain;
}

export function routeTask(task: AtlasTaskType): TaskRoutingDecision {
  const config = getTaskRouteConfig(task);
  const providerChain = buildProviderChain(config.primaryModelId, config.fallbackModelIds);

  if (providerChain.length === 0) {
    throw new Error(`No providers configured for task: ${task}`);
  }

  return {
    task,
    agentId: config.agentId,
    primaryProviderId: providerChain[0],
    fallbackProviderIds: providerChain.slice(1),
    providerChain,
    promptId: config.promptId ?? TASK_PROMPT_IDS[task],
    settings: config.defaultSettings ?? {},
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
