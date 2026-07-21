import { test } from "node:test";
import assert from "node:assert/strict";

import { buildBriefingSteps } from "./briefingSteps";
import type { ExecutiveBriefing } from "./roomData";

/**
 * Sprint 5.2 ("Sequential Business Briefing") — validation coverage for `buildBriefingSteps()`.
 * `baseBriefing()` mirrors the quiet-state `ExecutiveBriefing` `composeExecutiveBriefing()`
 * would produce for an empty `ControlSnapshot` (see `roomData.test.ts`'s own quiet-state case) —
 * this file only tests the presentation-layer sequencing, never re-testing Sprint 5.1's content
 * composition itself.
 */

function baseBriefing(overrides: Partial<ExecutiveBriefing> = {}): ExecutiveBriefing {
  return {
    greeting: "Good morning, sir",
    businessUpdate: ["Everything remained stable while you were away."],
    judgement: "Everything looks steady.",
    attention: [],
    decisions: { count: 0, summary: "Nothing is waiting on your decision." },
    closing: "Nothing is actively in progress right now. I'll keep watching for what needs your attention next.",
    synthesis: {
      generatedAt: "2026-07-21T08:00:00.000Z",
      points: [],
      hasMeaningfulActivity: false,
      capacityConstrained: false,
      recommendation: undefined,
    },
    ...overrides,
  };
}

test("quiet-state briefing produces four steps in the approved order, skipping attention and decisions", () => {
  const steps = buildBriefingSteps(baseBriefing());

  assert.deepEqual(
    steps.map((step) => step.kind),
    ["welcome", "businessUpdate", "judgement", "closing"],
  );
});

test("attention step is included only when the briefing has attention lines", () => {
  const steps = buildBriefingSteps(baseBriefing({ attention: ["Checkout fails on the pizza flow needs attention."] }));

  assert.deepEqual(
    steps.map((step) => step.kind),
    ["welcome", "businessUpdate", "judgement", "attention", "closing"],
  );
  assert.deepEqual(steps.find((step) => step.kind === "attention")?.lines, [
    "Checkout fails on the pizza flow needs attention.",
  ]);
});

test("decisions step is included only when decisions.count is greater than zero", () => {
  const steps = buildBriefingSteps(
    baseBriefing({ decisions: { count: 1, summary: "1 decision is waiting for you: Approve the summer menu." } }),
  );

  assert.deepEqual(
    steps.map((step) => step.kind),
    ["welcome", "businessUpdate", "judgement", "decisions", "closing"],
  );
});

test("full briefing (attention and decisions both present) always follows the approved six-part order", () => {
  const steps = buildBriefingSteps(
    baseBriefing({
      attention: ["Checkout fails on the pizza flow needs attention."],
      decisions: { count: 1, summary: "1 decision is waiting for you: Approve the summer menu." },
    }),
  );

  assert.deepEqual(
    steps.map((step) => step.kind),
    ["welcome", "businessUpdate", "judgement", "attention", "decisions", "closing"],
  );
});

test("no content is invented — every step's lines come verbatim from the ExecutiveBriefing object", () => {
  const briefing = baseBriefing({
    businessUpdate: ["Atlas completed 2 improvements while you were away.", "Published the sourdough guide"],
  });
  const steps = buildBriefingSteps(briefing);

  assert.deepEqual(steps.find((step) => step.kind === "businessUpdate")?.lines, briefing.businessUpdate);
  assert.deepEqual(steps.find((step) => step.kind === "welcome")?.lines, [`${briefing.greeting}.`]);
  assert.deepEqual(steps.find((step) => step.kind === "closing")?.lines, [briefing.closing]);
});
