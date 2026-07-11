import { listProviders } from "@/atlas/ai/providers/registry";
import { memoryEngine } from "@/atlas/brain/memory";
import { getEntityById, listEntities } from "@/atlas/entity/registry/entityStore";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";
import type { ArticleCatalogEntry } from "@/atlas/publishing/types";
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
  const queryText = input.topic ?? input.goal;

  const search = memoryEngine.searchMemory({
    text: queryText,
    limit: 12,
    status: "active",
  });

  // BRAIN-008 · MemoryEngine.semanticSearchMemory() (BRAIN-002, term-vector cosine
  // similarity — provider-neutral, no external embedding API/cost) has existed since
  // BRAIN-002 but was never actually called from anywhere real: ContextBuilder only ever
  // ran the plain exact-substring search above, so a memory phrased differently than the
  // current goal (same topic, different wording) never surfaced. Merged in here — keyword
  // hits and semantic hits are deduped by entry id, keeping the higher of the two scores,
  // so an exact match still wins but a conceptually related memory with no literal overlap
  // is no longer invisible to the Decision Engine.
  const semantic = memoryEngine.semanticSearchMemory(queryText, { limit: 12 });

  const byId = new Map<string, { id: string; title: string; type: string; score: number }>();
  for (const result of [...(search.ok ? search.data ?? [] : []), ...(semantic.ok ? semantic.data ?? [] : [])]) {
    const existing = byId.get(result.entry.id);
    const candidate = {
      id: result.entry.id,
      title: result.entry.title,
      type: result.entry.type,
      score: result.score,
    };
    if (!existing || candidate.score > existing.score) {
      byId.set(result.entry.id, candidate);
    }
  }

  const memories = [...byId.values()].sort((left, right) => right.score - left.score).slice(0, 12);

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

/** True once a catalog entry has an actual body (summary or at least one section) — same
 * doctrine as hasRealKnowledgeContent() in src/modules/doughbert/knowledge/knowledgeBites.ts:
 * a title-only stub is not real knowledge and should never be handed to the Decision Engine
 * as if it were. */
function hasRealArticleContent(entry: ArticleCatalogEntry): boolean {
  const content = entry.content as { summary?: unknown; sections?: unknown } | undefined;
  if (!content || typeof content !== "object") return false;
  const summary = typeof content.summary === "string" ? content.summary.trim() : "";
  const sections = Array.isArray(content.sections) ? content.sections : [];
  return summary.length > 0 || sections.length > 0;
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

  // BRAIN-007 · Used to be 3 hardcoded fake placeholder ids ("entity-catalog",
  // "intelligence-insights", "publishing-templates") with label === id — not real knowledge,
  // just three fixed strings injected into every single snapshot regardless of topic, which
  // is exactly why snapshots kept scoring "partial" health. Replaced with the active
  // module's real, published article catalog (getArticleCatalog(), the same module
  // abstraction studioService.ts already uses — deliberately not a direct import of
  // doughbert-specific files here, so this stays module-agnostic), filtered down to entries
  // that actually have content (never a title-only stub) and ranked by topic relevance the
  // same way collectEntityContext() above already does.
  const topic = normalizeTopic(input.topic ?? input.goal);
  const catalog = tryGetActiveModule()?.getArticleCatalog() ?? [];
  const realArticles = catalog.filter(hasRealArticleContent);
  const topicMatched = realArticles.filter((entry) => {
    const tags = Array.isArray(entry.tags) ? entry.tags.join(" ") : "";
    const haystack = `${entry.title} ${entry.slug} ${tags}`.toLowerCase();
    return topic.length > 0 && haystack.includes(topic);
  });
  const ranked = topicMatched.length > 0 ? topicMatched : realArticles;
  const defaults = ranked.slice(0, 6).map((entry) => ({
    id: entry.slug,
    label: entry.title,
    source: "atlas.knowledge-catalog",
    score: topicMatched.length > 0 ? 6 : 3,
  }));

  const merged = new Map<string, (typeof fromMemory)[number]>();
  for (const item of [...defaults, ...fromMemory]) {
    merged.set(item.id, item);
  }

  return {
    knowledge: [...merged.values()],
    sources: (defaults.length > 0 ? ["memory", "module"] : ["memory"]) as ContextSourceId[],
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
