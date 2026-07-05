import type { ContextBuildInput, ContextBundle, ContextProvider, ContextSourceId } from "./context.types";

const providers = new Map<string, ContextProvider>();
let activeProviderIds: string[] = [];

export function registerContextProvider(provider: ContextProvider): void {
  providers.set(provider.id, provider);
  if (!activeProviderIds.includes(provider.id)) {
    activeProviderIds.push(provider.id);
  }
}

export function unregisterContextProvider(providerId: string): void {
  providers.delete(providerId);
  activeProviderIds = activeProviderIds.filter((id) => id !== providerId);
}

export function listContextProviders(): ContextProvider[] {
  return [...providers.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function getContextProvider(providerId: string): ContextProvider | undefined {
  return providers.get(providerId);
}

export function setActiveContextProviders(providerIds: string[]): void {
  for (const providerId of providerIds) {
    if (!providers.has(providerId)) {
      throw new Error(`Context provider not registered: ${providerId}`);
    }
  }
  activeProviderIds = [...providerIds];
}

export function getActiveContextProviderIds(): string[] {
  return [...activeProviderIds];
}

export function getActiveContextProviders(): ContextProvider[] {
  return activeProviderIds
    .map((id) => providers.get(id))
    .filter((provider): provider is ContextProvider => provider !== undefined);
}

export function listContextSources(): ContextSourceId[] {
  const sources = new Set<ContextSourceId>();
  for (const provider of providers.values()) {
    for (const sourceId of provider.sourceIds) {
      sources.add(sourceId);
    }
  }
  return [...sources].sort();
}

export function runContextProviders(
  input: ContextBuildInput,
  seed: Partial<ContextBundle> = {},
): Partial<ContextBundle> {
  let partial: Partial<ContextBundle> = { ...seed };

  for (const provider of getActiveContextProviders()) {
    partial = {
      ...partial,
      ...provider.contribute(input, partial),
    };
  }

  return partial;
}

export function registerPlannedContextProviders(): void {
  const planned = [
    {
      id: "llm-context",
      label: "LLM Context",
      description: "AI-driven context selection (planned)",
      sourceIds: ["goal", "memory", "entity"] as ContextSourceId[],
    },
    {
      id: "vector-context",
      label: "Vector Context",
      description: "Embedding-based context retrieval (planned)",
      sourceIds: ["memory", "entity"] as ContextSourceId[],
    },
    {
      id: "graph-context",
      label: "Graph Context",
      description: "Knowledge graph context traversal (planned)",
      sourceIds: ["entity", "memory"] as ContextSourceId[],
    },
  ];

  for (const entry of planned) {
    if (providers.has(entry.id)) continue;
    registerContextProvider({
      ...entry,
      contribute: () => ({}),
    });
  }
}

export function isContextRegistryBootstrapped(): boolean {
  return providers.has("core-context");
}
