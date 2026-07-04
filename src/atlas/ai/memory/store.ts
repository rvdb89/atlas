import type { CoreAgentId } from "@/atlas/publishing/plugin/types";
import type { MemoryEntry } from "../types";

const memory = new Map<string, MemoryEntry>();

function memoryKey(scope: MemoryEntry["scope"], key: string, moduleId?: string, agentId?: CoreAgentId) {
  return [scope, moduleId ?? "-", agentId ?? "-", key].join(":");
}

export function remember(
  key: string,
  value: unknown,
  scope: MemoryEntry["scope"] = "global",
  options?: { moduleId?: string; agentId?: CoreAgentId },
): MemoryEntry {
  const entry: MemoryEntry = {
    key,
    scope,
    moduleId: options?.moduleId,
    agentId: options?.agentId,
    value,
    updatedAt: new Date().toISOString(),
  };
  memory.set(memoryKey(scope, key, options?.moduleId, options?.agentId), entry);
  return entry;
}

export function recall<T = unknown>(
  key: string,
  scope: MemoryEntry["scope"] = "global",
  options?: { moduleId?: string; agentId?: CoreAgentId },
): T | undefined {
  return memory.get(memoryKey(scope, key, options?.moduleId, options?.agentId))?.value as T | undefined;
}

export function listMemoryEntries(): MemoryEntry[] {
  return [...memory.values()];
}

export function clearMemory(): void {
  memory.clear();
}

export function getStyleMemory(moduleId: string): Record<string, unknown> {
  return recall<Record<string, unknown>>("style", "module", { moduleId }) ?? {};
}

export function setStyleMemory(moduleId: string, style: Record<string, unknown>): void {
  remember("style", style, "module", { moduleId });
}
