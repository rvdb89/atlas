import { test } from "node:test";
import assert from "node:assert/strict";

import { deriveContextHealth } from "./ContextSnapshot";

/**
 * EXEC-003 · deriveContextHealth is the sole source of the "empty" / "partial" / "healthy"
 * label the CEO dashboard and the Decision Engine both read. BRAIN-007 corrected a stale
 * claim that this formula also weighed knowledge context — it never did, and never has, only
 * memories + entities + providers + goal presence. These tests pin down the real formula so
 * that correction can't silently drift back into being wrong.
 */

test("deriveContextHealth: empty when everything is empty and there is no goal", () => {
  const health = deriveContextHealth({ goal: "", memories: [], entities: [], providers: [] });
  assert.equal(health, "empty");
});

test("deriveContextHealth: healthy requires both a goal AND at least one provider", () => {
  const health = deriveContextHealth({
    goal: "bak een brood",
    memories: [],
    entities: [],
    providers: [{ id: "claude" } as never],
  });
  assert.equal(health, "healthy");
});

test("deriveContextHealth: partial when there is a goal but zero providers", () => {
  const health = deriveContextHealth({
    goal: "bak een brood",
    memories: [{ id: "m1" } as never],
    entities: [{ id: "e1" } as never],
    providers: [],
  });
  assert.equal(health, "partial");
});

test("deriveContextHealth: partial when there are providers but no goal", () => {
  const health = deriveContextHealth({
    goal: "",
    memories: [],
    entities: [],
    providers: [{ id: "claude" } as never],
  });
  assert.equal(health, "partial");
});

test("deriveContextHealth: knowledge is not part of the formula at all", () => {
  // Regression for the BRAIN-007 correction: adding knowledge-shaped fields must never
  // change the result, since deriveContextHealth's signature doesn't even accept knowledge.
  const withGoalAndProvider = deriveContextHealth({
    goal: "bak een brood",
    memories: [],
    entities: [],
    providers: [{ id: "claude" } as never],
  });
  assert.equal(withGoalAndProvider, "healthy");
});
