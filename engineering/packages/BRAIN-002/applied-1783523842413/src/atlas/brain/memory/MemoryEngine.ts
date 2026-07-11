import { createMemoryContext } from "./MemoryContext";
import { getMemoryProvider } from "./MemoryRegistry";
import { semanticSearchMemoryEntries } from "./MemorySemanticSearch";
import type {
  AtlasMemoryEntry,
  AtlasMemoryEntryInput,
  MemoryContext,
  MemoryOperationResult,
  MemorySearchQuery,
  MemorySearchResult,
  MemorySnapshot,
} from "./memory.types";

function success<T>(data: T): MemoryOperationResult<T> {
  return { ok: true, data };
}

function failure<T>(message: string): MemoryOperationResult<T> {
  return { ok: false, message };
}

export class MemoryEngine {
  saveMemory(input: AtlasMemoryEntryInput, context?: MemoryContext): MemoryOperationResult<AtlasMemoryEntry> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const entry = provider.save(input);
      return success(entry);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to save memory");
    }
  }

  getMemory(id: string, context?: MemoryContext): MemoryOperationResult<AtlasMemoryEntry> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const entry = provider.get(id);
      if (!entry) return failure("Memory entry not found");
      return success(entry);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to get memory");
    }
  }

  searchMemory(query: MemorySearchQuery, context?: MemoryContext): MemoryOperationResult<MemorySearchResult[]> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const results = provider.search({ ...query, status: query.status ?? "active" });
      return success(results);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to search memory");
    }
  }

  /** BRAIN-002 · Semantic recall — complements the exact-substring searchMemory() above
   * by scoring entries on conceptual (term-vector) overlap instead of literal text match.
   * Best-effort: any provider or scoring failure returns an empty result, never throws. */
  semanticSearchMemory(
    queryText: string,
    options?: { limit?: number },
    context?: MemoryContext,
  ): MemoryOperationResult<MemorySearchResult[]> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const results = semanticSearchMemoryEntries(provider.list(), queryText, options?.limit ?? 10);
      return success(results);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to run semantic memory search");
    }
  }

  updateMemory(
    id: string,
    patch: Partial<AtlasMemoryEntryInput>,
    context?: MemoryContext,
  ): MemoryOperationResult<AtlasMemoryEntry> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const entry = provider.update(id, patch);
      if (!entry) return failure("Memory entry not found");
      return success(entry);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to update memory");
    }
  }

  archiveMemory(id: string, context?: MemoryContext): MemoryOperationResult<AtlasMemoryEntry> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const entry = provider.archive(id);
      if (!entry) return failure("Memory entry not found");
      return success(entry);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to archive memory");
    }
  }

  deleteMemory(id: string, context?: MemoryContext): MemoryOperationResult<boolean> {
    try {
      const provider = getMemoryProvider(context?.activeProviderId);
      const deleted = provider.delete(id);
      if (!deleted) return failure("Memory entry not found");
      return success(true);
    } catch (error) {
      return failure(error instanceof Error ? error.message : "Failed to delete memory");
    }
  }

  getSnapshot(context?: MemoryContext): MemorySnapshot {
    const provider = getMemoryProvider(context?.activeProviderId);
    const activeEntries = provider.list().filter((entry) => entry.status === "active");
    const recent = [...activeEntries]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 5);

    return {
      total: activeEntries.length,
      recent,
      preferences: activeEntries.filter((entry) => entry.type === "preference").length,
      projects: activeEntries.filter((entry) => entry.type === "project").length,
      workflows: activeEntries.filter((entry) => entry.type === "workflow").length,
      health: activeEntries.length > 0 ? "healthy" : "empty",
    };
  }

  getContext(options?: Parameters<typeof createMemoryContext>[0]): MemoryContext {
    return createMemoryContext(options);
  }
}

export const memoryEngine = new MemoryEngine();

export function getMemorySnapshot(context?: MemoryContext): MemorySnapshot {
  return memoryEngine.getSnapshot(context);
}
