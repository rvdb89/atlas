import { listProviders } from "@/atlas/ai/providers/registry";
import { getCachedLiveProviderHealth, listLiveProviders } from "@/atlas/ai/providers/ProviderRegistry";
import { listTaskRegistryEntries } from "@/atlas/ai/registry/taskRegistry";
import { listTaskHandlers } from "@/atlas/ai/tasks/handlerRegistry";
import { listCacheEntries } from "@/atlas/ai/cache/memoryCache";
import { listMemoryEntries } from "@/atlas/ai/memory/store";
import { getEntityCount } from "@/atlas/entity/registry/entityStore";
import { listRegisteredEntityTypes } from "@/atlas/entity/registry/entityTypeRegistry";
import { listRegisteredModules } from "@/atlas/publishing/plugin/registry";
import { ATLAS_BUILD, ATLAS_VERSION } from "@/atlas/version";
import { listWorkflows } from "@/atlas/workflows/registry";

import { getStartupIssues } from "./auditLog";
import type { AtlasDiagnosticsSnapshot, LiveProviderHealthInfo, PublishingHandlerInfo } from "./types";

const PUBLISHING_AGENT_HANDLERS: PublishingHandlerInfo[] = [
  { id: "copywriter", kind: "publishing-agent", label: "Copywriter Agent" },
  { id: "visual-designer", kind: "publishing-agent", label: "Visual Designer Agent" },
  { id: "fact-checker", kind: "publishing-agent", label: "Fact Checker Agent" },
  { id: "link-engine", kind: "publishing-agent", label: "Link Engine Agent" },
  { id: "translator", kind: "publishing-agent", label: "Translator Agent" },
  { id: "domain-validator", kind: "publishing-agent", label: "Domain Validator Agent" },
];

/** Collect a full Atlas diagnostics snapshot for Studio and CLI tooling. */
export function collectAtlasDiagnostics(): AtlasDiagnosticsSnapshot {
  const modules = listRegisteredModules();
  const entityTypes = listRegisteredEntityTypes();
  const aiTasks = listTaskRegistryEntries();
  const workflows = listWorkflows();
  const providers = listProviders();
  const liveProviderHealth = getCachedLiveProviderHealth();
  const taskHandlers = listTaskHandlers();

  const publishingHandlers: PublishingHandlerInfo[] = [
    ...PUBLISHING_AGENT_HANDLERS,
    ...taskHandlers.map((task) => ({
      id: task,
      kind: "task-handler" as const,
      label: `Task handler · ${task}`,
    })),
  ];

  return {
    collectedAt: new Date().toISOString(),
    atlasVersion: ATLAS_VERSION,
    atlasBuild: ATLAS_BUILD,
    modules: modules.map((module) => ({
      id: module.id,
      name: module.name,
      version: module.version,
    })),
    entityTypes: entityTypes.map((type) => ({
      typeId: type.typeId,
      label: type.label,
      moduleId: type.moduleId,
    })),
    aiTasks: aiTasks.map((entry) => ({
      task: entry.task,
      taskName: entry.taskName,
      label: entry.label,
      agentId: entry.agentId,
    })),
    workflows: workflows.map((workflow) => ({
      id: workflow.id,
      label: workflow.label,
      version: workflow.version,
      stepCount: workflow.stepCount,
    })),
    providers: providers.map((provider) => ({
      id: provider.id,
      label: provider.id,
    })),
    liveProviders: buildLiveProviderHealth(liveProviderHealth),
    publishingHandlers,
    entityCount: getEntityCount(),
    memoryEntryCount: listMemoryEntries().length,
    cacheEntryCount: listCacheEntries().length,
    startupIssues: getStartupIssues(),
  };
}

function buildLiveProviderHealth(
  cached: ReturnType<typeof getCachedLiveProviderHealth>,
): LiveProviderHealthInfo[] {
  if (cached.length > 0) {
    return cached.map((entry) => ({
      id: entry.id,
      label: entry.label,
      available: entry.available,
      latencyMs: entry.latencyMs,
      message: entry.message,
      transportMode: entry.transportMode,
      hasApiKey: entry.hasApiKey,
      modelCount: entry.modelCount,
      models: entry.models,
      capabilities: {
        textGeneration: entry.capabilities.textGeneration,
        structuredOutput: entry.capabilities.structuredOutput,
        imageGeneration: entry.capabilities.imageGeneration,
        streaming: entry.capabilities.streaming,
      },
    }));
  }

  return listLiveProviders().map((provider) => ({
    id: provider.id,
    label: provider.label,
    available: true,
    latencyMs: 0,
    message: "Health pending",
    transportMode: "mock",
    hasApiKey: false,
    modelCount: provider.capabilities.models.length,
    models: provider.capabilities.models.map((model) => model.id),
    capabilities: {
      textGeneration: provider.capabilities.textGeneration,
      structuredOutput: provider.capabilities.structuredOutput,
      imageGeneration: provider.capabilities.imageGeneration,
      streaming: provider.capabilities.streaming,
    },
  }));
}
