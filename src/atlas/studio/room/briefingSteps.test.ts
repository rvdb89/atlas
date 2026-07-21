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
    decisions: { count: 0, summary: "Nothing is waiting on your decision.", items: [] },
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

test("Sprint 5.4 — the attention step carries visualReference when a synthesis point has one", () => {
  const steps = buildBriefingSteps(
    baseBriefing({
      attention: ["Engineering needs attention — reduced capacity."],
      synthesis: {
        generatedAt: "2026-07-21T08:00:00.000Z",
        points: [
          {
            id: "issue-bug-1",
            kind: "issue",
            rank: 0,
            headline: "Engineering needs attention",
            evidence: "reduced capacity",
            requiresAttention: true,
            visualReference: "engineering",
          },
        ],
        hasMeaningfulActivity: false,
        capacityConstrained: false,
        recommendation: undefined,
      },
    }),
  );

  assert.equal(steps.find((step) => step.kind === "attention")?.visualReference, "engineering");
  // No other step ever carries a visualReference.
  for (const step of steps) {
    if (step.kind !== "attention") {
      assert.equal(step.visualReference, undefined);
    }
  }
});

test("Sprint 5.4 — no visualReference on the attention step when no synthesis point has one", () => {
  const steps = buildBriefingSteps(baseBriefing({ attention: ["Checkout fails on the pizza flow needs attention."] }));

  assert.equal(steps.find((step) => step.kind === "attention")?.visualReference, undefined);
});

const sampleInboxItem = {
  id: "inbox-1",
  title: "Approve the summer menu roadmap change",
  category: "roadmap_decision" as const,
  urgency: "high" as const,
  reason: "Demand has shifted toward summer items.",
  recommendation: "Approve the roadmap change.",
  status: "pending" as const,
};

test("decisions step is included only when decisions.count is greater than zero", () => {
  const steps = buildBriefingSteps(
    baseBriefing({
      decisions: {
        count: 1,
        summary: "1 decision is waiting for you: Approve the summer menu roadmap change.",
        items: [sampleInboxItem],
      },
    }),
  );

  assert.deepEqual(
    steps.map((step) => step.kind),
    ["welcome", "businessUpdate", "judgement", "decisions", "closing"],
  );
});

test("Sprint 5.3 — the decisions step carries the real CeoInboxItem[] for attaching existing actions", () => {
  const steps = buildBriefingSteps(
    baseBriefing({
      decisions: {
        count: 1,
        summary: "1 decision is waiting for you: Approve the summer menu roadmap change.",
        items: [sampleInboxItem],
      },
    }),
  );

  const decisionsStep = steps.find((step) => step.kind === "decisions");
  assert.deepEqual(decisionsStep?.decisionItems, [sampleInboxItem]);
  // No other step ever carries decisionItems — issues/plan/work points have no existing
  // approve/adjust/defer mechanism, so they must stay purely informational.
  for (const step of steps) {
    if (step.kind !== "decisions") {
      assert.equal(step.decisionItems, undefined);
    }
  }
});

test("full briefing (attention and decisions both present) always follows the approved six-part order", () => {
  const steps = buildBriefingSteps(
    baseBriefing({
      attention: ["Checkout fails on the pizza flow needs attention."],
      decisions: {
        count: 1,
        summary: "1 decision is waiting for you: Approve the summer menu roadmap change.",
        items: [sampleInboxItem],
      },
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
