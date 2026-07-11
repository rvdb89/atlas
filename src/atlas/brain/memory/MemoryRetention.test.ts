import { test } from "node:test";
import assert from "node:assert/strict";

import { pruneOldDecisionMemories } from "./MemoryRetention";
import { localMemoryStore } from "./MemoryStore";
import type { AtlasMemoryEntry, MemoryType } from "./memory.types";

/**
 * EXEC-003 · Regression coverage for the BRAIN-009 fix.
 *
 * Real incident: decision-type memories are written once per ~5-minute runtime cycle and
 * never expired on their own (archive()/delete() only flip a status flag; exportAll() still
 * persisted everything). Measured 379 decision memories accumulating in under 2 days.
 * pruneOldDecisionMemories() is the fix — these tests pin down its two load-bearing
 * guarantees: (1) it keeps exactly the most recent MAX_DECISION_MEMORIES (200) decisions and
 * hard-removes the rest, and (2) it never touches any other memory type.
 *
 * Uses localMemoryStore.importAll() to seed entries with fully deterministic createdAt
 * timestamps — save() always stamps "now", which can't express "this one is older" reliably
 * in a fast-running test.
 */

function makeEntry(overrides: Partial<AtlasMemoryEntry> & { id: string; createdAt: string }): AtlasMemoryEntry {
  return {
    type: "decision" as MemoryType,
    title: `Decision ${overrides.id}`,
    summary: "test decision",
    content: "test decision content",
    tags: [],
    source: "test",
    updatedAt: overrides.createdAt,
    importance: 5,
    confidence: 0.8,
    status: "active",
    ...overrides,
  };
}

function seedDecisions(count: number, startId = 0): AtlasMemoryEntry[] {
  // Oldest first: id 0 is oldest, higher ids are newer — createdAt increases with id so
  // string sort order (used internally by pruneOldDecisionMemories) matches intent.
  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const createdAt = new Date(2026, 0, 1, 0, 0, id).toISOString();
    return makeEntry({ id: `dec-${id}`, createdAt });
  });
}

test("pruneOldDecisionMemories: no-op when under the cap", () => {
  localMemoryStore.clear();
  localMemoryStore.importAll(seedDecisions(50));

  const removed = pruneOldDecisionMemories();

  assert.equal(removed, 0);
  assert.equal(localMemoryStore.exportAll().length, 50);
});

test("pruneOldDecisionMemories: keeps exactly the newest 200, removes the rest", () => {
  localMemoryStore.clear();
  localMemoryStore.importAll(seedDecisions(250));

  const removed = pruneOldDecisionMemories();

  assert.equal(removed, 50);
  const remaining = localMemoryStore.exportAll();
  assert.equal(remaining.length, 200);

  // The 50 oldest (dec-0 .. dec-49) must be gone; the 200 newest (dec-50 .. dec-249) survive.
  const remainingIds = new Set(remaining.map((entry) => entry.id));
  for (let id = 0; id < 50; id += 1) {
    assert.equal(remainingIds.has(`dec-${id}`), false, `dec-${id} should have been pruned`);
  }
  for (let id = 50; id < 250; id += 1) {
    assert.equal(remainingIds.has(`dec-${id}`), true, `dec-${id} should have survived`);
  }
});

test("pruneOldDecisionMemories: never touches non-decision memory types", () => {
  localMemoryStore.clear();
  const decisions = seedDecisions(250);
  const knowledgeEntry = makeEntry({
    id: "knowledge-1",
    createdAt: new Date(2020, 0, 1).toISOString(),
    type: "knowledge",
  });
  localMemoryStore.importAll([...decisions, knowledgeEntry]);

  pruneOldDecisionMemories();

  assert.ok(localMemoryStore.get("knowledge-1"), "non-decision memory must survive regardless of age");
});

test("pruneOldDecisionMemories: is idempotent (a second call with nothing new removes nothing more)", () => {
  localMemoryStore.clear();
  localMemoryStore.importAll(seedDecisions(250));

  pruneOldDecisionMemories();
  const removedSecondTime = pruneOldDecisionMemories();

  assert.equal(removedSecondTime, 0);
  assert.equal(localMemoryStore.exportAll().length, 200);
});
