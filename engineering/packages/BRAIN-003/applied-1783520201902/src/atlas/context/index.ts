// Context Engine — provider-independent snapshot layer for Atlas Brain.
// Mirrors the Memory Engine pattern: best-effort, never blocks a decision.

export interface ContextEntity {
  id: string;
  name: string;
  type: string;
}

export interface ContextKnowledgeItem {
  id: string;
  summary: string;
  source: string;
}

export interface ContextWorkflowRef {
  id: string;
  name: string;
}

export type ContextHealth = "empty" | "partial" | "healthy";

export interface ContextSnapshot {
  query: string;
  relevantEntities: ContextEntity[];
  relevantKnowledge: ContextKnowledgeItem[];
  relevantWorkflows: ContextWorkflowRef[];
  health: ContextHealth;
  generatedAt: string;
}

// A provider contributes one slice of the snapshot. Implementations plug
// into real registries (entity catalog, knowledge base, workflow index)
// as those catalogs grow — none are fabricated here.
export interface ContextProvider {
  name: string;
  provideEntities?(query: string): ContextEntity[];
  provideKnowledge?(query: string): ContextKnowledgeItem[];
  provideWorkflows?(query: string): ContextWorkflowRef[];
}

export class ContextRegistry {
  private providers: ContextProvider[] = [];

  register(provider: ContextProvider): void {
    if (this.providers.some((p) => p.name === provider.name)) {
      return;
    }
    this.providers.push(provider);
  }

  list(): ContextProvider[] {
    return [...this.providers];
  }
}

export class ContextBuilder {
  constructor(private readonly registry: ContextRegistry) {}

  build(query: string): ContextSnapshot {
    const relevantEntities: ContextEntity[] = [];
    const relevantKnowledge: ContextKnowledgeItem[] = [];
    const relevantWorkflows: ContextWorkflowRef[] = [];

    for (const provider of this.registry.list()) {
      // Best-effort: a failing provider never breaks snapshot building.
      try {
        if (provider.provideEntities) {
          relevantEntities.push(...provider.provideEntities(query));
        }
      } catch {
        // ignore provider failure
      }
      try {
        if (provider.provideKnowledge) {
          relevantKnowledge.push(...provider.provideKnowledge(query));
        }
      } catch {
        // ignore provider failure
      }
      try {
        if (provider.provideWorkflows) {
          relevantWorkflows.push(...provider.provideWorkflows(query));
        }
      } catch {
        // ignore provider failure
      }
    }

    return {
      query,
      relevantEntities,
      relevantKnowledge,
      relevantWorkflows,
      health: computeHealth(relevantEntities, relevantKnowledge, relevantWorkflows),
      generatedAt: new Date().toISOString(),
    };
  }
}

function computeHealth(
  entities: ContextEntity[],
  knowledge: ContextKnowledgeItem[],
  workflows: ContextWorkflowRef[]
): ContextHealth {
  const total = entities.length + knowledge.length + workflows.length;
  if (total === 0) return "empty";
  const filledSlices = [entities.length > 0, knowledge.length > 0, workflows.length > 0].filter(
    Boolean
  ).length;
  return filledSlices >= 2 ? "healthy" : "partial";
}

// ContextEngine is the single entry point Brain consumers (e.g. the
// Decision Engine) call before a self-review verdict. Building a snapshot
// never throws and never blocks — on failure it returns an empty snapshot.
export class ContextEngine {
  private readonly registry: ContextRegistry;
  private readonly builder: ContextBuilder;

  constructor(registry: ContextRegistry = new ContextRegistry()) {
    this.registry = registry;
    this.builder = new ContextBuilder(this.registry);
  }

  registerProvider(provider: ContextProvider): void {
    this.registry.register(provider);
  }

  getSnapshot(query: string): ContextSnapshot {
    try {
      return this.builder.build(query);
    } catch {
      return {
        query,
        relevantEntities: [],
        relevantKnowledge: [],
        relevantWorkflows: [],
        health: "empty",
        generatedAt: new Date().toISOString(),
      };
    }
  }
}

export function createContextEngine(): ContextEngine {
  return new ContextEngine();
}
