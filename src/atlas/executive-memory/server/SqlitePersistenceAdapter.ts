import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

import type {
  ExecutiveMemoryActionLogEntry,
  ExecutiveMemoryDocument,
  ExecutiveMemoryDocumentMeta,
  ExecutiveMemoryKey,
  ExecutiveMemoryNamespace,
  ExecutiveMemoryValue,
  ListActionsOptions,
} from "../contract";
import type { PersistenceAdapter } from "./PersistenceAdapter";

/**
 * SQLite implementation of PersistenceAdapter.
 *
 * Uses Node's built-in `node:sqlite` (DatabaseSync), not `better-sqlite3`: during
 * implementation, `npm install better-sqlite3` failed in the build sandbox (registry access
 * blocked for native-module installs). `node:sqlite` was verified to work today, unflagged,
 * on the Node version this project runs on (22.22.3) — same SQL, zero extra dependency, no
 * native-compile step. The adapter boundary in ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md was
 * designed exactly to make this kind of swap cheap: only this file changed.
 *
 * Two tables, matching ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 2 exactly — nothing
 * else. `documents` holds one current row per (namespace, key); `action_log` is append-only.
 */
export class SqlitePersistenceAdapter implements PersistenceAdapter {
  private readonly db: DatabaseSync;

  constructor(filePath: string) {
    mkdirSync(dirname(filePath), { recursive: true });
    this.db = new DatabaseSync(filePath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        namespace TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (namespace, key)
      );

      CREATE TABLE IF NOT EXISTS action_log (
        id TEXT PRIMARY KEY,
        namespace TEXT NOT NULL,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        occurred_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_action_log_namespace_time ON action_log (namespace, occurred_at);
    `);
  }

  getDocument(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): ExecutiveMemoryDocument | null {
    const row = this.db
      .prepare(
        "SELECT namespace, key, value, version, created_at, updated_at FROM documents WHERE namespace = ? AND key = ?",
      )
      .get(namespace, key) as RawDocumentRow | undefined;
    return row ? toDocument(row) : null;
  }

  putDocument(
    namespace: ExecutiveMemoryNamespace,
    key: ExecutiveMemoryKey,
    value: ExecutiveMemoryValue,
  ): ExecutiveMemoryDocument {
    const now = new Date().toISOString();
    const serialized = JSON.stringify(value);

    // Single atomic statement — this is precisely what replaces the old
    // "rewrite the whole file every 5 minutes" pattern in atlas-runtime.ts (reports/memory/
    // store.json) with a real, per-record, transactional write.
    this.db
      .prepare(
        `INSERT INTO documents (namespace, key, value, version, created_at, updated_at)
         VALUES (?, ?, ?, 1, ?, ?)
         ON CONFLICT(namespace, key) DO UPDATE SET
           value = excluded.value,
           version = documents.version + 1,
           updated_at = excluded.updated_at`,
      )
      .run(namespace, key, serialized, now, now);

    const saved = this.getDocument(namespace, key);
    if (!saved) {
      throw new Error(`ExecutiveMemory: write to ${namespace}/${key} did not persist — this should be unreachable`);
    }
    return saved;
  }

  deleteDocument(namespace: ExecutiveMemoryNamespace, key: ExecutiveMemoryKey): boolean {
    const result = this.db.prepare("DELETE FROM documents WHERE namespace = ? AND key = ?").run(namespace, key);
    return Number(result.changes) > 0;
  }

  listDocuments(namespace: ExecutiveMemoryNamespace): ExecutiveMemoryDocumentMeta[] {
    const rows = this.db
      .prepare("SELECT key, version, updated_at FROM documents WHERE namespace = ? ORDER BY updated_at DESC")
      .all(namespace) as RawDocumentMetaRow[];
    return rows.map((row) => ({ key: row.key, version: row.version, updatedAt: row.updated_at }));
  }

  insertAction(
    namespace: ExecutiveMemoryNamespace,
    type: string,
    payload: ExecutiveMemoryValue,
  ): ExecutiveMemoryActionLogEntry {
    const id = `act-${randomUUID()}`;
    const occurredAt = new Date().toISOString();
    this.db
      .prepare("INSERT INTO action_log (id, namespace, type, payload, occurred_at) VALUES (?, ?, ?, ?, ?)")
      .run(id, namespace, type, JSON.stringify(payload), occurredAt);
    return { id, namespace, type, payload, occurredAt };
  }

  queryActions(
    namespace: ExecutiveMemoryNamespace,
    options: ListActionsOptions = {},
  ): ExecutiveMemoryActionLogEntry[] {
    const limit = options.limit && options.limit > 0 ? options.limit : 100;

    const rows = (
      options.since
        ? this.db
            .prepare(
              `SELECT id, namespace, type, payload, occurred_at FROM action_log
               WHERE namespace = ? AND occurred_at > ?
               ORDER BY occurred_at DESC LIMIT ?`,
            )
            .all(namespace, options.since, limit)
        : this.db
            .prepare(
              `SELECT id, namespace, type, payload, occurred_at FROM action_log
               WHERE namespace = ?
               ORDER BY occurred_at DESC LIMIT ?`,
            )
            .all(namespace, limit)
    ) as RawActionRow[];

    return rows.map(toActionEntry);
  }

  /** Not part of PersistenceAdapter — used by ExecutiveMemoryHttpAdapter's shutdown handler
   * and by tests that want a clean close instead of relying on process exit. */
  close(): void {
    this.db.close();
  }
}

type RawDocumentRow = {
  namespace: string;
  key: string;
  value: string;
  version: number;
  created_at: string;
  updated_at: string;
};

type RawDocumentMetaRow = { key: string; version: number; updated_at: string };

type RawActionRow = { id: string; namespace: string; type: string; payload: string; occurred_at: string };

function toDocument(row: RawDocumentRow): ExecutiveMemoryDocument {
  return {
    namespace: row.namespace,
    key: row.key,
    value: JSON.parse(row.value) as ExecutiveMemoryValue,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toActionEntry(row: RawActionRow): ExecutiveMemoryActionLogEntry {
  return {
    id: row.id,
    namespace: row.namespace,
    type: row.type,
    payload: JSON.parse(row.payload) as ExecutiveMemoryValue,
    occurredAt: row.occurred_at,
  };
}
