import type {
  ExecutiveMemoryActionLogEntry,
  ExecutiveMemoryContract,
  ExecutiveMemoryDocument,
  ExecutiveMemoryDocumentMeta,
  ExecutiveMemoryKey,
  ExecutiveMemoryNamespace,
  ExecutiveMemoryValue,
  ListActionsOptions,
} from "../contract";
import type { PersistenceAdapter } from "./PersistenceAdapter";

function isPlainObject(value: ExecutiveMemoryValue | undefined): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Domain logic for Executive Memory — the only layer that knows what "save", "update" (merge
 * semantics) and "the action log is append-only" actually mean. Never talks to SQL directly;
 * depends only on PersistenceAdapter, so it stays unchanged if the storage engine ever
 * changes (see ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 1).
 *
 * This class is called two ways, deliberately, by design: directly (function calls, no
 * network) by anything running in the same Node process — the always-on runtime, CLI
 * scripts, tests — and indirectly, via ExecutiveMemoryHttpAdapter, by web and mobile.
 */
export class ExecutiveMemoryService implements ExecutiveMemoryContract {
  constructor(private readonly adapter: PersistenceAdapter) {}

  async save<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    value: TValue,
  ): Promise<{ version: number; updatedAt: string }> {
    const saved = this.adapter.putDocument(namespace, key, value);
    return { version: saved.version, updatedAt: saved.updatedAt };
  }

  async load<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
  ): Promise<ExecutiveMemoryDocument<TValue> | null> {
    return this.adapter.getDocument(namespace, key) as ExecutiveMemoryDocument<TValue> | null;
  }

  async update<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    patch: Partial<TValue>,
  ): Promise<{ value: TValue; version: number; updatedAt: string }> {
    const current = this.adapter.getDocument(namespace, key);
    const currentValue = current?.value;
    const patchValue = patch as ExecutiveMemoryValue;

    // Shallow merge when both sides are plain objects — the common case (Company State,
    // memory entries). Anything else (missing key, array/primitive value) behaves like
    // save(): the patch simply becomes the new value. No deep-merge, no array-splicing —
    // that would be functionality Sprint 0.1 does not need (see Diminishing Returns Check).
    const nextValue: ExecutiveMemoryValue =
      isPlainObject(currentValue) && isPlainObject(patchValue)
        ? { ...currentValue, ...patchValue }
        : patchValue;

    const saved = this.adapter.putDocument(namespace, key, nextValue);
    return { value: saved.value as TValue, version: saved.version, updatedAt: saved.updatedAt };
  }

  async delete(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): Promise<{ deleted: boolean }> {
    return { deleted: this.adapter.deleteDocument(namespace, key) };
  }

  async list(namespace: ExecutiveMemoryNamespace): Promise<ExecutiveMemoryDocumentMeta[]> {
    return this.adapter.listDocuments(namespace);
  }

  async appendAction<TPayload extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    type: string,
    payload: TPayload,
  ): Promise<{ id: string; occurredAt: string }> {
    const entry = this.adapter.insertAction(namespace, type, payload);
    return { id: entry.id, occurredAt: entry.occurredAt };
  }

  async listActions(
    namespace: ExecutiveMemoryNamespace,
    options?: ListActionsOptions,
  ): Promise<ExecutiveMemoryActionLogEntry[]> {
    return this.adapter.queryActions(namespace, options);
  }
}
