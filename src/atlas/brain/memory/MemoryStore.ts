import type { AtlasMemoryEntry, AtlasMemoryEntryInput, MemoryStatus } from "./memory.types";

function createMemoryId(): string {
  return `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class MemoryStore {
  private entries = new Map<string, AtlasMemoryEntry>();

  save(input: AtlasMemoryEntryInput): AtlasMemoryEntry {
    const now = new Date().toISOString();
    const entry: AtlasMemoryEntry = {
      id: createMemoryId(),
      type: input.type,
      title: input.title.trim(),
      summary: input.summary.trim(),
      content: input.content,
      tags: [...new Set((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean))],
      source: input.source,
      createdAt: now,
      updatedAt: now,
      importance: clamp(input.importance ?? 5, 1, 10),
      confidence: clamp(input.confidence ?? 0.8, 0, 1),
      status: input.status ?? "active",
    };

    this.entries.set(entry.id, entry);
    return entry;
  }

  get(id: string): AtlasMemoryEntry | undefined {
    const entry = this.entries.get(id);
    if (!entry || entry.status === "deleted") return undefined;
    return entry;
  }

  list(includeArchived = false): AtlasMemoryEntry[] {
    return [...this.entries.values()].filter((entry) => {
      if (entry.status === "deleted") return false;
      if (!includeArchived && entry.status === "archived") return false;
      return true;
    });
  }

  update(id: string, patch: Partial<AtlasMemoryEntryInput>): AtlasMemoryEntry | undefined {
    const current = this.entries.get(id);
    if (!current || current.status === "deleted") return undefined;

    const updated: AtlasMemoryEntry = {
      ...current,
      type: patch.type ?? current.type,
      title: patch.title?.trim() ?? current.title,
      summary: patch.summary?.trim() ?? current.summary,
      content: patch.content ?? current.content,
      tags: patch.tags ? [...new Set(patch.tags.map((tag) => tag.trim()).filter(Boolean))] : current.tags,
      source: patch.source ?? current.source,
      importance: patch.importance !== undefined ? clamp(patch.importance, 1, 10) : current.importance,
      confidence: patch.confidence !== undefined ? clamp(patch.confidence, 0, 1) : current.confidence,
      status: patch.status ?? current.status,
      updatedAt: new Date().toISOString(),
    };

    this.entries.set(id, updated);
    return updated;
  }

  setStatus(id: string, status: MemoryStatus): AtlasMemoryEntry | undefined {
    return this.update(id, { status });
  }

  delete(id: string): boolean {
    const current = this.entries.get(id);
    if (!current) return false;
    this.entries.set(id, { ...current, status: "deleted", updatedAt: new Date().toISOString() });
    return true;
  }

  clear(): void {
    this.entries.clear();
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const localMemoryStore = new MemoryStore();
