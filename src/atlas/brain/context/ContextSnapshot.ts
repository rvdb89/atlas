import type {
  ContextBundle,
  ContextFilter,
  ContextHealthSnapshot,
  ContextSnapshot,
} from "./context.types";

let currentSnapshot: ContextSnapshot | null = null;
const listeners = new Set<(snapshot: ContextSnapshot | null) => void>();

function emitChange(): void {
  for (const listener of listeners) {
    listener(currentSnapshot);
  }
}

export function subscribeContextSnapshot(listener: (snapshot: ContextSnapshot | null) => void): () => void {
  listeners.add(listener);
  listener(currentSnapshot);
  return () => listeners.delete(listener);
}

export function getContextSnapshot(): ContextSnapshot | null {
  return currentSnapshot;
}

export function setContextSnapshot(snapshot: ContextSnapshot): void {
  currentSnapshot = snapshot;
  emitChange();
}

export function clearContextSnapshot(): void {
  currentSnapshot = null;
  emitChange();
}

export function deriveContextHealth(bundle: Pick<ContextBundle, "goal" | "memories" | "entities" | "providers">): ContextSnapshot["health"] {
  const loaded =
    bundle.memories.length + bundle.entities.length + bundle.providers.length + (bundle.goal ? 1 : 0);

  if (loaded === 0) return "empty";
  if (bundle.goal && bundle.providers.length > 0) return "healthy";
  return "partial";
}

export function createContextSnapshotFromBundle(bundle: ContextBundle): ContextSnapshot {
  return {
    goal: bundle.goal,
    relevantMemories: bundle.memories,
    relevantEntities: bundle.entities,
    relevantKnowledge: bundle.knowledge,
    relevantWorkflows: bundle.workflows,
    currentLanguage: bundle.environment.language,
    currentModule: bundle.module,
    currentUser: bundle.user,
    workspace: bundle.workspace,
    environment: bundle.environment.environment,
    plannerOutput: bundle.plannerOutput,
    loadedProviders: bundle.providers,
    health: deriveContextHealth(bundle),
    timestamp: new Date().toISOString(),
  };
}

export function filterContextBundle(bundle: ContextBundle, filter: ContextFilter = {}): ContextBundle {
  const minScore = filter.minScore ?? 0;

  return {
    ...bundle,
    memories: bundle.memories.filter((item) => item.score >= minScore).slice(0, filter.maxMemories ?? 8),
    entities: bundle.entities.filter((item) => item.score >= minScore).slice(0, filter.maxEntities ?? 8),
    knowledge: bundle.knowledge.filter((item) => item.score >= minScore).slice(0, filter.maxKnowledge ?? 8),
    workflows: bundle.workflows.filter((item) => item.score >= minScore).slice(0, filter.maxWorkflows ?? 6),
    providers: bundle.providers.filter((item) => item.score >= minScore).slice(0, filter.maxProviders ?? 12),
    sources: filter.sourceIds ? bundle.sources.filter((source) => filter.sourceIds!.includes(source)) : bundle.sources,
  };
}

export function mergeContextBundles(left: ContextBundle, right: Partial<ContextBundle>): ContextBundle {
  const mergeUnique = <T extends { id: string }>(primary: T[], secondary: T[] = []): T[] => {
    const map = new Map<string, T>();
    for (const item of [...primary, ...secondary]) {
      map.set(item.id, item);
    }
    return [...map.values()];
  };

  return {
    goal: right.goal ?? left.goal,
    module: right.module ?? left.module,
    user: right.user ?? left.user,
    workspace: right.workspace ?? left.workspace,
    environment: right.environment ?? left.environment,
    workflow: right.workflow ?? left.workflow,
    plannerOutput: right.plannerOutput ?? left.plannerOutput,
    memories: mergeUnique(left.memories, right.memories),
    entities: mergeUnique(left.entities, right.entities),
    knowledge: mergeUnique(left.knowledge, right.knowledge),
    workflows: mergeUnique(left.workflows, right.workflows),
    providers: mergeUnique(left.providers, right.providers),
    sources: [...new Set([...left.sources, ...(right.sources ?? [])])],
    builtAt: new Date().toISOString(),
  };
}

export function getContextHealthSnapshot(snapshot: ContextSnapshot | null): ContextHealthSnapshot {
  if (!snapshot) {
    return {
      health: "empty",
      goal: "—",
      memoryCount: 0,
      entityCount: 0,
      providerCount: 0,
      moduleLabel: "—",
      plannerStatus: "idle",
    };
  }

  return {
    health: snapshot.health,
    goal: snapshot.goal,
    memoryCount: snapshot.relevantMemories.length,
    entityCount: snapshot.relevantEntities.length,
    providerCount: snapshot.loadedProviders.length,
    moduleLabel: snapshot.currentModule.label,
    plannerStatus: snapshot.plannerOutput?.status ?? "idle",
  };
}
