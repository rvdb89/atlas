import { listProviders } from "@/atlas/ai/providers/registry";
import { memoryEngine } from "@/atlas/brain/memory";
import { getEntityById, listEntities } from "@/atlas/entity/registry/entityStore";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";
import { listWorkflows } from "@/atlas/workflows/registry";

import { runContextProviders } from "./ContextRegistry";
import type { ContextBuildInput, ContextBundle, ContextSourceId } from "./context.types";

function createEmptyBundle(input: ContextBuildInput): Partial<ContextBundle> {
  const activeModule = tryGetActiveModule();
  const moduleId = input.moduleId ?? activeModule?.id ?? "atlas";
  const moduleLabel = input.moduleLabel ?? activeModule?.name ?? "Atlas";

  return {
    goal: input.goal,
    module: { id: moduleId, label: moduleLabel },
    user: {
      id: input.userId ?? "atlas-user",
      label: input.userLabel ?? "Atlas Developer",
    },
    workspace: input.workspace ?? "Atlas Studio",
    environment: {
      workspace: input.workspace ?? "Atlas Studio",
      environment: input.environment ?? "development",
      language: input.language ?? "nl",
    },
    workflow: input.workflowId
      ? {
          id: input.workflowId,
          label: input.workflowId,
          score: 5,
        }
      : null,
    plannerOutput: input.executionPlan ?? null,
    memories: [],
    entities: [],
    knowledge: [],
    workflows: [],
    providers: [],
    sources: [],
    builtAt: new Date().toISOString(),
  };
}

function collectMemoryContext(input: ContextBuildInput): Partial<ContextBundle> {
  const search = memoryEngine.searchMemory({
    text: input.topic ?? input.goal,
    limit: 12,
    status: "active",
  });

  const memories =
    search.ok && search.data
      ? search.data.map((result) => ({
          id: result.entry.id,
          title: result.entry.title,
          type: result.entry.type,
          score: result.score,
        }))
      : [];

  return {
    memories,
    sources: ["memory"] as ContextSourceId[],
  };
}

function collectEntityContext(input: ContextBuildInput): Partial<ContextBundle> {
  const entities = listEntities();
  const topic = normalizeTopic(input.topic ?? input.goal);

  const explicit = (input.entityIds ?? [])
    .map((id) => getEntityById(id))
    .filter((entity): entity is NonNullable<typeof entity> => entity !== undefined)
    .map((entity) => ({
      id: entity.id,
      label: entity.title,
      domain: entity.domain,
      entityType: entity.entityType,
      score: 10,
    }));

  const matched = entities
    .filter((entity) => {
      const haystack = `${entity.title} ${entity.slug} ${entity.tags.join(" ")}`.toLowerCase();
      return topic.length > 0 && haystack.includes(topic);
    })
    .slice(0, 8)
    .map((entity) => ({
      id: entity.id,
      label: entity.title,
      domain: entity.domain,
      entityType: entity.entityType,
      score: 6,
    }));

  const merged = new Map<string, (typeof explicit)[number]>();
  for (const entity of [...explicit, ...matched]) {
    merged.set(entity.id, entity);
  }

  return {
    entities: [...merged.values()],
    sources: ["entity"] as ContextSourceId[],
  };
}

function collectKnowledgeContext(input: ContextBuildInput): Partial<ContextBundle> {
  const knowledgeSearch = memoryEngine.searchMemory({
    type: "knowledge",
    text: input.topic ?? input.goal,
    limit: 8,
    status: "active",
  });

  const fromMemory =
    knowledgeSearch.ok && knowledgeSearch.data
      ? knowledgeSearch.data.map((result) => ({
          id: result.entry.id,
          label: result.entry.title,
          source: result.entry.source,
          score: result.score,
        }))
      : [];

  const defaults = ["entity-catalog", "intelligence-insights", "publishing-templates"].map((id) => ({
    id,
    label: id,
    source: "atlas.core",
    score: 3,
  }));

  const merged = new Map<string, (typeof fromMemory)[number]>();
  for (const item of [...defaults, ...fromMemory]) {
    merged.set(item.id, item);
  }

  return {
    knowledge: [...merged.values()],
    sources: ["memory"] as ContextSourceId[],
  };
}

function collectWorkflowContext(input: ContextBuildInput): Partial<ContextBundle> {
  const workflows = listWorkflows().map((workflow) => ({
    id: workflow.id,
    label: workflow.label,
    score: workflow.id === input.workflowId ? 10 : 4,
  }));

  return {
    workflows,
    workflow: input.workflowId
      ? workflows.find((workflow) => workflow.id === input.workflowId) ?? null
      : null,
    sources: ["workflow"] as ContextSourceId[],
  };
}

function collectProviderContext(input: ContextBuildInput): Partial<ContextBundle> {
  const required = new Set(input.executionPlan?.requiredProviders ?? []);

  return {
    providers: listProviders().map((provider) => ({
      id: provider.id,
      label: provider.id,
      score: required.has(provider.id) ? 10 : 3,
    })),
    sources: ["providers"] as ContextSourceId[],
  };
}

function normalizeTopic(value: string): string {
  return value.trim().toLowerCase();
}

function mergeSources(...groups: Array<ContextSourceId[] | undefined>): ContextSourceId[] {
  const merged = new Set<ContextSourceId>();
  for (const group of groups) {
    for (const source of group ?? []) {
      merged.add(source);
    }
  }
  return [...merged];
}

export function buildContextBundle(input: ContextBuildInput): ContextBundle {
  const seed = createEmptyBundle(input);

  const providerPartial = runContextProviders(input, seed);
  const memoryPartial = collectMemoryContext(input);
  const entityPartial = collectEntityContext(input);
  const knowledgePartial = collectKnowledgeContext(input);
  const workflowPartial = collectWorkflowContext(input);
  const providersPartial = collectProviderContext(input);

  const sources = mergeSources(
    ["goal", "module", "workspace", "user", "environment", "planner"],
    providerPartial.sources,
    memoryPartial.sources,
    entityPartial.sources,
    knowledgePartial.sources,
    workflowPartial.sources,
    providersPartial.sources,
  );

  return {
    goal: input.goal,
    module: providerPartial.module ?? seed.module!,
    user: providerPartial.user ?? seed.user!,
    workspace: providerPartial.workspace ?? seed.workspace!,
    environment: providerPartial.environment ?? seed.environment!,
    workflow: workflowPartial.workflow ?? seed.workflow ?? null,
    plannerOutput: input.executionPlan ?? null,
    memories: memoryPartial.memories ?? [],
    entities: entityPartial.entities ?? [],
    knowledge: knowledgePartial.knowledge ?? [],
    workflows: workflowPartial.workflows ?? [],
    providers: providersPartial.providers ?? [],
    sources,
    builtAt: new Date().toISOString(),
  };
}
