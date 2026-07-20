import {
  ExecutiveMemoryUnavailableError,
  type ExecutiveMemoryActionLogEntry,
  type ExecutiveMemoryContract,
  type ExecutiveMemoryDocument,
  type ExecutiveMemoryDocumentMeta,
  type ExecutiveMemoryKey,
  type ExecutiveMemoryNamespace,
  type ExecutiveMemoryValue,
  type ListActionsOptions,
} from "../contract";

/**
 * Implements ExecutiveMemoryContract over `fetch`. This is the only file in
 * `executive-memory/` that the Expo app (web + native) ever imports — it has no Node-only
 * dependency (no `node:sqlite`, no `node:http`), so it is safe inside the app bundle.
 *
 * See ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 1.
 */
export class ExecutiveMemoryHttpClient implements ExecutiveMemoryContract {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs = 5000,
  ) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
      });
    } catch (error) {
      throw new ExecutiveMemoryUnavailableError(`Executive Memory is unreachable at ${this.baseUrl}`, error);
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 404) {
      return null as T;
    }

    if (!response.ok) {
      throw new ExecutiveMemoryUnavailableError(`Executive Memory returned ${response.status} for ${path}`);
    }

    return (await response.json()) as T;
  }

  async save<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    value: TValue,
  ): Promise<{ version: number; updatedAt: string }> {
    return this.request(`/documents/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
  }

  async load<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
  ): Promise<ExecutiveMemoryDocument<TValue> | null> {
    return this.request(`/documents/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`, {
      method: "GET",
    });
  }

  async update<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    patch: Partial<TValue>,
  ): Promise<{ value: TValue; version: number; updatedAt: string }> {
    return this.request(`/documents/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ patch }),
    });
  }

  async delete(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): Promise<{ deleted: boolean }> {
    return this.request(`/documents/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
  }

  async list(namespace: ExecutiveMemoryNamespace): Promise<ExecutiveMemoryDocumentMeta[]> {
    return this.request(`/documents/${encodeURIComponent(namespace)}`, { method: "GET" });
  }

  async appendAction<TPayload extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    type: string,
    payload: TPayload,
  ): Promise<{ id: string; occurredAt: string }> {
    return this.request(`/actions/${encodeURIComponent(namespace)}`, {
      method: "POST",
      body: JSON.stringify({ type, payload }),
    });
  }

  async listActions(
    namespace: ExecutiveMemoryNamespace,
    options: ListActionsOptions = {},
  ): Promise<ExecutiveMemoryActionLogEntry[]> {
    const params = new URLSearchParams();
    if (options.since) params.set("since", options.since);
    if (options.limit) params.set("limit", String(options.limit));
    const query = params.toString();
    return this.request(`/actions/${encodeURIComponent(namespace)}${query ? `?${query}` : ""}`, { method: "GET" });
  }
}
