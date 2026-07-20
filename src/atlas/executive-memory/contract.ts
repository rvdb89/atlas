/**
 * Executive Memory Contract — Sprint 0.1.
 *
 * Protocol- and storage-independent. This is the ONLY thing every caller (web, mobile, the
 * Node runtime process, tests, future CLI tools or background workers) needs to know about.
 * Nothing in this file may import `node:http`, `node:sqlite`, or any Node-only module — it
 * must stay safe to import from anywhere, including the Expo web/native bundle.
 *
 * See ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md, chapter 1, for the full reasoning behind this
 * separation (Contract → Service → Persistence Adapter, plus a separate HTTP Adapter/Client
 * pair as just one transport among possible others).
 */

export type ExecutiveMemoryNamespace = string;
export type ExecutiveMemoryKey = string;

/** Anything JSON-serializable. Executive Memory is deliberately schema-agnostic — it does not
 * know or validate what a "Company State" or "Memory entry" must contain. That validation
 * belongs to the caller (Sprint 0.2 / 0.3), never to this layer. */
export type ExecutiveMemoryValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

export interface ExecutiveMemoryDocument<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue> {
  namespace: ExecutiveMemoryNamespace;
  key: ExecutiveMemoryKey;
  value: TValue;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/** Metadata-only view of a document — used by list(), which deliberately never returns bulk
 * payloads (Sprint 0.3 will use this to enumerate memory entries without loading all of them
 * at once). */
export interface ExecutiveMemoryDocumentMeta {
  key: ExecutiveMemoryKey;
  version: number;
  updatedAt: string;
}

export interface ExecutiveMemoryActionLogEntry<TPayload extends ExecutiveMemoryValue = ExecutiveMemoryValue> {
  id: string;
  namespace: ExecutiveMemoryNamespace;
  type: string;
  payload: TPayload;
  occurredAt: string;
}

export interface ListActionsOptions {
  /** ISO timestamp — only entries strictly after this are returned. */
  since?: string;
  /** Defaults to 100 in the Service; always capped, never "everything". */
  limit?: number;
}

/** Thrown by every ExecutiveMemoryContract implementation when the underlying storage cannot
 * be reached — the HTTP Client when the server doesn't respond, the Service when SQLite
 * itself errors. Callers are expected to fail open (same philosophy as the existing
 * CompanyStateStore.ts comment: "the session keeps working in-memory, just won't persist"),
 * not to crash the UI. Sprint 0.1 only defines this error type; deciding the fallback per
 * domain is Sprint 0.2 / 0.3's job. */
export class ExecutiveMemoryUnavailableError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ExecutiveMemoryUnavailableError";
    this.cause = cause;
  }
}

export interface ExecutiveMemoryContract {
  /** Creates or fully replaces a document. Returns the new version and timestamp — never the
   * value itself, callers already have it. */
  save<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    value: TValue,
  ): Promise<{ version: number; updatedAt: string }>;

  /** Reads one document. Returns null if it doesn't exist — never throws for a missing key. */
  load<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
  ): Promise<ExecutiveMemoryDocument<TValue> | null>;

  /** Shallow-merges `patch` over the existing value (or behaves like save() if the key doesn't
   * exist yet, or if either side isn't a plain object). */
  update<TValue extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    patch: Partial<TValue>,
  ): Promise<{ value: TValue; version: number; updatedAt: string }>;

  delete(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): Promise<{ deleted: boolean }>;

  /** Metadata for every document in a namespace — no bulk payload. */
  list(namespace: ExecutiveMemoryNamespace): Promise<ExecutiveMemoryDocumentMeta[]>;

  /** Appends one entry to the append-only action log. Never updates or removes existing
   * entries — there is deliberately no updateAction()/deleteAction() in this contract. */
  appendAction<TPayload extends ExecutiveMemoryValue = ExecutiveMemoryValue>(
    namespace: ExecutiveMemoryNamespace,
    type: string,
    payload: TPayload,
  ): Promise<{ id: string; occurredAt: string }>;

  listActions(
    namespace: ExecutiveMemoryNamespace,
    options?: ListActionsOptions,
  ): Promise<ExecutiveMemoryActionLogEntry[]>;
}
