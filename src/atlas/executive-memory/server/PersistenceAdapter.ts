import type {
  ExecutiveMemoryActionLogEntry,
  ExecutiveMemoryDocument,
  ExecutiveMemoryDocumentMeta,
  ExecutiveMemoryKey,
  ExecutiveMemoryNamespace,
  ExecutiveMemoryValue,
  ListActionsOptions,
} from "../contract";

/**
 * Internal interface between ExecutiveMemoryService and a concrete storage engine.
 *
 * Deliberately small and storage-agnostic — synchronous on purpose, because every storage
 * engine considered for Sprint 0.1 (node:sqlite's DatabaseSync, better-sqlite3) is itself
 * synchronous; ExecutiveMemoryService wraps these calls in Promises to satisfy the async
 * ExecutiveMemoryContract, so a future async adapter (e.g. a hosted database) would not
 * require any change to the Service or the public contract — only to this file and its
 * implementation. Nothing outside `server/` may import this file.
 */
export interface PersistenceAdapter {
  getDocument(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): ExecutiveMemoryDocument | null;

  /** Creates or fully replaces a document. Implementations own what "version" means
   * mechanically (e.g. a SQL `version = version + 1`) — the Service only relies on it being
   * monotonically increasing per (namespace, key). */
  putDocument(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    value: ExecutiveMemoryValue,
  ): ExecutiveMemoryDocument;

  deleteDocument(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): boolean;

  listDocuments(namespace: ExecutiveMemoryNamespace): ExecutiveMemoryDocumentMeta[];

  insertAction(
    namespace: ExecutiveMemoryNamespace,
    type: string,
    payload: ExecutiveMemoryValue,
  ): ExecutiveMemoryActionLogEntry;

  queryActions(namespace: ExecutiveMemoryNamespace, options?: ListActionsOptions): ExecutiveMemoryActionLogEntry[];
}
