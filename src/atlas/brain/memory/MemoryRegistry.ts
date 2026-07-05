import { localMemoryStore } from "./MemoryStore";
import { searchMemoryEntries } from "./MemorySearch";
import type { AtlasMemoryEntry, AtlasMemoryEntryInput, MemoryProvider, MemorySearchQuery, MemorySearchResult } from "./memory.types";

const providers = new Map<string, MemoryProvider>();
let activeProviderId = "local-memory";

function createLocalMemoryProvider(): MemoryProvider {
  return {
    id: "local-memory",
    label: "Local Memory",
    description: "In-memory Atlas memory store for development and mock usage",
    save: (entry) => localMemoryStore.save(entry),
    get: (id) => localMemoryStore.get(id),
    search: (query) => searchMemoryEntries(localMemoryStore.list(true), query),
    update: (id, patch) => localMemoryStore.update(id, patch),
    archive: (id) => localMemoryStore.setStatus(id, "archived"),
    delete: (id) => localMemoryStore.delete(id),
    list: () => localMemoryStore.list(true),
  };
}

export function registerMemoryProvider(provider: MemoryProvider): void {
  providers.set(provider.id, provider);
}

export function unregisterMemoryProvider(providerId: string): void {
  providers.delete(providerId);
  if (activeProviderId === providerId) {
    activeProviderId = "local-memory";
  }
}

export function listMemoryProviders(): MemoryProvider[] {
  return [...providers.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function getMemoryProvider(providerId?: string): MemoryProvider {
  const id = providerId ?? activeProviderId;
  const provider = providers.get(id);
  if (!provider) {
    throw new Error(`Memory provider not found: ${id}`);
  }
  return provider;
}

export function setActiveMemoryProvider(providerId: string): void {
  if (!providers.has(providerId)) {
    throw new Error(`Memory provider not registered: ${providerId}`);
  }
  activeProviderId = providerId;
}

export function getActiveMemoryProviderId(): string {
  return activeProviderId;
}

export function registerPlannedMemoryProviders(): void {
  const planned: Array<Omit<MemoryProvider, "save" | "get" | "search" | "update" | "archive" | "delete" | "list"> & {
    planned: true;
  }> = [
    { id: "vector-memory", label: "Vector Memory", description: "Embedding-based semantic memory (planned)", planned: true },
    { id: "cloud-memory", label: "Cloud Memory", description: "Remote synced memory provider (planned)", planned: true },
    { id: "knowledge-graph-memory", label: "Knowledge Graph Memory", description: "Graph-linked memory provider (planned)", planned: true },
  ];

  for (const entry of planned) {
    if (providers.has(entry.id)) continue;
    registerMemoryProvider({
      ...entry,
      save: () => {
        throw new Error(`${entry.label} is not available yet`);
      },
      get: () => undefined,
      search: () => [],
      update: () => undefined,
      archive: () => undefined,
      delete: () => false,
      list: () => [],
    });
  }
}

export function bootstrapLocalMemoryProvider(): void {
  if (!providers.has("local-memory")) {
    registerMemoryProvider(createLocalMemoryProvider());
  }
  setActiveMemoryProvider("local-memory");
}

export function isMemoryRegistryBootstrapped(): boolean {
  return providers.has("local-memory");
}

export type { AtlasMemoryEntry, AtlasMemoryEntryInput, MemorySearchQuery, MemorySearchResult };
