import { test } from "node:test";
import assert from "node:assert/strict";

import { composeExecutiveBriefing } from "./roomData";
import type { ControlSnapshot } from "@/atlas/studio/control/types";

/**
 * Sprint 4.2 ("Executive Briefing v1") — validation coverage for `composeExecutiveBriefing()`.
 * Each test builds a minimal, fully real-shaped `ControlSnapshot` (no mocked framework, no
 * fixtures beyond plain object literals matching the actual type) and asserts the specific
 * scenario named in the sprint's Validation section. `baseSnapshot()` is the quiet-state
 * baseline every other test overrides only the fields it needs to change.
 */

function baseSnapshot(overrides: Partial<ControlSnapshot> = {}): ControlSnapshot {
  return {
    collectedAt: "2026-07-20T08:00:00.000Z",
    companyName: "Robbert AI",
    companyState: {
      source: "live",
      generatedAt: "2026-07-20T08:00:00.000Z",
      companyHealth: 90,
      overallStatus: "healthy",
      overallStatusLabel: "Healthy",
      northStarAlignment: 80,
      counts: {
        approvals: 0,
        pendingApprovals: 0,
        businesses: 1,
        agents: 4,
        kpis: 0,
        roadmap: 0,
        bugs: 0,
        blockers: 0,
        activity: 0,
      },
      bugsBySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
    },
    ceoCommand: {
      greeting: "",
      companyHealthScore: 90,
      todayAdvice: "",
      recommendation: "",
      reason: "",
      primaryActionLabel: "",
      secondaryActionLabel: "",
    },
    ceoInbox: [],
    appliedHistory: [],
    businesses: [],
    products: [],
    management: [
      {
        id: "engineering-director",
        name: "Tom",
        title: "Engineering Director",
        department: "engineering",
        status: "active",
        currentResponsibility: "Shipping",
        currentInitiative: "—",
        healthScore: 90,
        workload: "balanced",
      },
    ],
    kpis: [],
    roadmap: [],
    sprints: [],
    operations: [
      {
        department: "engineering",
        label: "Engineering",
        status: "healthy",
        statusLabel: "Healthy",
        currentFocus: "—",
      },
    ],
    issues: [],
    activity: [],
    atlasAdvice: {
      headline: "",
      recommendation: "",
      rationale: "",
      confidence: 0,
      decision: "pending",
    },
    memory: {
      health: 90,
      statusLabel: "Healthy",
      lastUpdated: "2026-07-20T07:00:00.000Z",
      recent: [],
    },
    livePlan: null,
    ...overrides,
  };
}

test("quiet state — no meaningful activity and no CEO decisions", () => {
  const briefing = composeExecutiveBriefing(baseSnapshot());

  assert.equal(briefing.businessUpdate[0], "Everything remained stable while you were away.");
  assert.equal(briefing.judgement, "Everything looks steady.");
  assert.deepEqual(briefing.attention, []);
  assert.equal(briefing.decisions.count, 0);
  assert.equal(briefing.decisions.summary, "Nothing is waiting on your decision.");
  assert.equal(
    briefing.closing,
    "Nothing is actively in progress right now. I'll keep watching for what needs your attention next.",
  );
});

test("meaningful completed activity is summarized, not raw", () => {
  const snapshot = baseSnapshot({
    appliedHistory: [
      {
        missionId: "CONTENT-010",
        title: "Published the sourdough troubleshooting guide",
        appliedAt: "2026-07-20T05:00:00.000Z",
        summary: "…",
        files: [],
        fileCount: 2,
        risks: [],
        followUp: "",
        validation: null,
      },
      {
        missionId: "CONTENT-011",
        title: "Refreshed the pizza dough hydration article",
        appliedAt: "2026-07-20T04:00:00.000Z",
        summary: "…",
        files: [],
        fileCount: 1,
        risks: [],
        followUp: "",
        validation: null,
      },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.equal(briefing.businessUpdate[0], "Atlas completed 2 improvements while you were away.");
  assert.ok(briefing.businessUpdate.includes("Published the sourdough troubleshooting guide"));
  assert.ok(briefing.businessUpdate.includes("Refreshed the pizza dough hydration article"));
  assert.equal(briefing.judgement, "The business made good operational progress.");
});

test("one material issue requiring attention surfaces by name, judgement reflects it", () => {
  const snapshot = baseSnapshot({
    issues: [
      {
        id: "bug-1",
        title: "Checkout fails on the pizza flow",
        severity: "critical",
        impact: "Customers cannot complete an order.",
        owner: "unknown",
        recommendation: "Roll back the last release.",
        expectedFix: "",
        status: "open",
      },
      {
        id: "bug-2",
        title: "Typo in footer",
        severity: "low",
        impact: "Cosmetic only.",
        owner: "unknown",
        recommendation: "Fix when convenient.",
        expectedFix: "",
        status: "open",
      },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.equal(briefing.attention.length, 1);
  assert.equal(
    briefing.attention[0],
    "Checkout fails on the pizza flow needs attention — Customers cannot complete an order.",
  );
  assert.equal(briefing.judgement, "One area needs attention today.");
  // The low-severity issue is never listed individually.
  assert.ok(!briefing.attention.some((line) => line.includes("Typo in footer")));
});

test("one or more CEO Inbox decisions are counted and summarized", () => {
  const snapshot = baseSnapshot({
    ceoInbox: [
      {
        id: "inbox-1",
        title: "Approve the summer menu roadmap change",
        category: "roadmap_decision",
        urgency: "high",
        reason: "…",
        recommendation: "…",
        status: "pending",
      },
      {
        id: "inbox-2",
        title: "Approve new marketing copy",
        category: "marketing",
        urgency: "medium",
        reason: "…",
        recommendation: "…",
        status: "pending",
      },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.equal(briefing.decisions.count, 2);
  assert.ok(briefing.decisions.summary.startsWith("2 decisions are waiting for you:"));
  assert.ok(briefing.decisions.summary.includes("Approve the summer menu roadmap change"));
  assert.ok(briefing.decisions.summary.includes("Approve new marketing copy"));
});

test("active Live Plan is reflected in the closing, not restated as completed", () => {
  const snapshot = baseSnapshot({
    livePlan: {
      id: "plan-1",
      missionId: "CONTENT-012",
      goal: "Publish the autumn bread series",
      status: "executing",
      steps: [],
      createdAt: "2026-07-20T06:00:00.000Z",
      updatedAt: "2026-07-20T07:30:00.000Z",
    },
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.equal(briefing.closing, "I'm continuing work on Publish the autumn bread series. I'll let you know if anything needs you.");
  // An in-progress plan is never also claimed as a completed fact in the business update.
  assert.ok(!briefing.businessUpdate.some((line) => line.includes("finished successfully")));
});

test("Roadmap Now lane is reflected in the closing when there is no active Live Plan", () => {
  const snapshot = baseSnapshot({
    roadmap: [
      { id: "r1", title: "Redesign onboarding", lane: "now", priority: 1, businessValue: "", northStarContribution: "", owner: "", progress: 40 },
      { id: "r2", title: "Explore wholesale channel", lane: "later", priority: 3, businessValue: "", northStarContribution: "", owner: "", progress: 0 },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.equal(briefing.closing, "Atlas is currently focused on Redesign onboarding. I'll let you know if anything needs you.");
});

test("no signal is duplicated across sections under different wording", () => {
  const snapshot = baseSnapshot({
    issues: [
      {
        id: "bug-1",
        title: "Production incident in the order pipeline",
        severity: "critical",
        impact: "Orders are not being recorded.",
        owner: "unknown",
        recommendation: "…",
        expectedFix: "",
        status: "open",
      },
    ],
    livePlan: {
      id: "plan-1",
      missionId: "ENG-020",
      goal: "Stabilize the order pipeline",
      status: "failed",
      steps: [],
      createdAt: "2026-07-20T06:00:00.000Z",
      updatedAt: "2026-07-20T07:30:00.000Z",
    },
  });

  const briefing = composeExecutiveBriefing(snapshot);

  // The failed plan appears exactly once, in Attention — never also in Business Update or Closing.
  const failedMentions = [...briefing.businessUpdate, ...briefing.attention, briefing.closing].filter((line) =>
    line.includes("Stabilize the order pipeline"),
  );
  assert.equal(failedMentions.length, 1);
  assert.ok(briefing.attention.some((line) => line.includes("Stabilize the order pipeline")));
  // The closing must fall back to "nothing in progress" rather than re-describing the failed plan.
  assert.equal(
    briefing.closing,
    "Nothing is actively in progress right now. I'll keep watching for what needs your attention next.",
  );
});

test("Sprint 5.1 — multiple open issues are reduced to a single ranked point, critical outranks high", () => {
  const snapshot = baseSnapshot({
    issues: [
      {
        id: "bug-high",
        title: "Slow checkout on the pizza flow",
        severity: "high",
        impact: "Some orders take longer than usual.",
        owner: "unknown",
        recommendation: "Investigate the payment provider latency.",
        expectedFix: "",
        status: "open",
      },
      {
        id: "bug-critical",
        title: "Checkout fails on the pizza flow",
        severity: "critical",
        impact: "Customers cannot complete an order.",
        owner: "unknown",
        recommendation: "Roll back the last release.",
        expectedFix: "",
        status: "open",
      },
      {
        id: "bug-critical-2",
        title: "Second critical incident",
        severity: "critical",
        impact: "A second, unrelated critical fault.",
        owner: "unknown",
        recommendation: "…",
        expectedFix: "",
        status: "open",
      },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  // Three real, open issues exist; Synthesis reduces this to exactly one ranked point.
  assert.equal(briefing.attention.length, 1);
  assert.equal(briefing.synthesis.points.filter((point) => point.requiresAttention).length, 1);
  // Critical outranks high — the critical issue listed first in `issues` wins, not array order.
  assert.ok(briefing.attention[0].startsWith("Checkout fails on the pizza flow needs attention"));
  // The lower-ranked critical issue and the high issue are genuinely dropped, not just hidden —
  // they must not reappear anywhere else in the briefing under different wording.
  const allText = [...briefing.businessUpdate, briefing.judgement, ...briefing.attention, briefing.closing].join(" \n ");
  assert.ok(!allText.includes("Second critical incident"));
  assert.ok(!allText.includes("Slow checkout on the pizza flow"));
});

test("Sprint 5.1 — a genuine CEO Inbox recommendation ends the briefing with an existing response path", () => {
  const snapshot = baseSnapshot({
    ceoInbox: [
      {
        id: "inbox-1",
        title: "Approve the summer menu roadmap change",
        category: "roadmap_decision",
        urgency: "high",
        reason: "Demand has shifted toward summer items.",
        recommendation: "Approve the roadmap change — the shift is well-supported by recent orders.",
        status: "pending",
      },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.ok(briefing.closing.startsWith("My recommendation: Approve the roadmap change"));
  assert.ok(briefing.closing.includes("CEO Inbox"));
  assert.equal(briefing.synthesis.recommendation?.ceoInboxItemId, "inbox-1");
});

test("Sprint 5.1 — no recommendation is manufactured when no CEO Inbox item carries one", () => {
  const snapshot = baseSnapshot({
    ceoInbox: [
      {
        id: "inbox-1",
        title: "Approve new marketing copy",
        category: "marketing",
        urgency: "medium",
        reason: "…",
        recommendation: "",
        status: "pending",
      },
    ],
  });

  const briefing = composeExecutiveBriefing(snapshot);

  assert.equal(briefing.synthesis.recommendation, undefined);
  assert.ok(!briefing.closing.startsWith("My recommendation:"));
  // Falls through to the ordinary "nothing in progress" closing, same as the quiet state.
  assert.equal(
    briefing.closing,
    "Nothing is actively in progress right now. I'll keep watching for what needs your attention next.",
  );
});

test("no unsupported financial or external-performance claims appear anywhere", () => {
  const briefing = composeExecutiveBriefing(baseSnapshot());
  const allText = [
    briefing.greeting,
    ...briefing.businessUpdate,
    briefing.judgement,
    ...briefing.attention,
    briefing.decisions.summary,
    briefing.closing,
  ].join(" \n ");

  for (const forbidden of ["revenue", "profit", "cost", "ROAS", "ROI", "ad spend", "customer growth", "%"]) {
    assert.ok(
      !allText.toLowerCase().includes(forbidden.toLowerCase()),
      `Unexpected unsupported claim token found: "${forbidden}"`,
    );
  }
});
