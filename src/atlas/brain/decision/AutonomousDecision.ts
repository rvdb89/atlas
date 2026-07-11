import { executeTask } from "@/atlas/ai/core/Orchestrator";
import { bootstrapAiProviders } from "@/atlas/ai/providers/bootstrap";
import { isAnthropicConfigured } from "@/atlas/config/env";
import { bootstrapAtlasMemory, memoryEngine } from "@/atlas/brain/memory";
import { bootstrapAtlasContext, contextEngine } from "@/atlas/brain/context";

import { runDecision } from "./DecisionEngine";
import type { DecisionEngineInput, DecisionEngineResult } from "./decision.types";

/**
 * BRAIN-004 · Autonomous Decision Layer
 *
 * The rule-based Decision Engine (DecisionEngine.ts) always runs first and is never
 * modified by this file — every existing caller keeps working exactly as before.
 *
 * When ANTHROPIC_API_KEY is configured, this layer additionally asks Claude to look at
 * the same capability gaps and roadmap candidates the rule-based engine saw, and form
 * its own judgment — including the option to disagree with the rule-based pick. This is
 * the first real (non rule-based) decision Atlas makes for itself. Any failure (missing
 * key, network error, malformed response) falls back to the rule-based result only —
 * this layer can never break a decision, only add a second opinion to it.
 */

export type AiMissionVerdict = {
  selectedMissionId: string | null;
  confidence: number;
  reasoning: string;
  agreesWithRuleBased: boolean;
};

export type AutonomousDecisionResult = {
  ruleBased: DecisionEngineResult;
  ai: AiMissionVerdict | null;
  source: "ai" | "rule-based";
  aiError?: string;
  /** True when Claude was asked but the transport silently fell back to mock data internally. */
  transportFellBackToMock?: boolean;
};

export type RecentDecisionMemory = {
  cycleSummary: string;
  createdAt: string;
};

/** BRAIN-002 · Pulls Atlas' own past self-review verdicts from persistent memory, so the
 * Claude verdict below is informed by what it decided before — not a blank slate every
 * time. Best-effort: memory being empty or unavailable never blocks a decision. */
function recallRecentDecisions(): RecentDecisionMemory[] {
  try {
    bootstrapAtlasMemory();
    const result = memoryEngine.searchMemory({ type: "decision", limit: 3 });
    if (!result.ok || !result.data) return [];
    return result.data
      .map((match) => match.entry)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((entry) => ({ cycleSummary: entry.summary, createdAt: entry.createdAt }));
  } catch {
    return [];
  }
}

/** Records this cycle's verdict as a durable memory entry so future cycles can recall it. */
function rememberDecision(payload: {
  missionId: string | null;
  title: string | null;
  reasoning: string;
  source: "ai" | "rule-based";
  confidence: number | null;
}): void {
  try {
    bootstrapAtlasMemory();
    memoryEngine.saveMemory({
      type: "decision",
      title: payload.missionId ? `Focus: ${payload.missionId}` : "No initiative selected",
      summary: `${payload.source === "ai" ? "Claude" : "Rule-based"} chose ${payload.missionId ?? "no initiative"}${
        payload.title ? ` — ${payload.title}` : ""
      }${payload.confidence !== null ? ` (${Math.round(payload.confidence * 100)}% confidence)` : ""}`,
      content: payload.reasoning,
      tags: ["self-review", payload.source, payload.missionId ?? "none"].filter(Boolean),
      source: "atlas.brain.autonomous-decision",
      importance: 6,
      confidence: payload.confidence ?? 0.6,
      status: "active",
    });
  } catch {
    // Memory is best-effort — never let a persistence failure break a decision cycle.
  }
}

export type ContextSummary = {
  health: string;
  entities: string[];
  knowledge: string[];
  workflows: string[];
};

/** BRAIN-003 · Pulls a scored context snapshot (entities, knowledge, workflows relevant
 * to the self-review goal) so the verdict below is grounded in what Atlas actually knows
 * about, not just the raw capability-gap numbers. Best-effort, same as memory recall. */
function gatherContext(goal: string): ContextSummary | null {
  try {
    bootstrapAtlasContext();
    const result = contextEngine.createSnapshot({
      goal,
      topic: goal,
      moduleId: "atlas-brain",
      moduleLabel: "Atlas Brain",
    });
    if (!result.ok || !result.data) return null;

    const snapshot = result.data;
    return {
      health: snapshot.health,
      entities: snapshot.relevantEntities.slice(0, 5).map((entity) => entity.label),
      knowledge: snapshot.relevantKnowledge.slice(0, 5).map((item) => item.label),
      workflows: snapshot.relevantWorkflows.slice(0, 5).map((workflow) => workflow.label),
    };
  } catch {
    return null;
  }
}

function buildDecisionPayload(
  ruleBased: DecisionEngineResult,
  recentMemory: RecentDecisionMemory[],
  context: ContextSummary | null,
) {
  return {
    intent: ruleBased.intent,
    northStarScore: ruleBased.northStarScore,
    northStarAligned: ruleBased.northStarAligned,
    capabilityGaps: ruleBased.capabilityGaps.map((gap) => ({
      id: gap.capabilityId,
      name: gap.name,
      gap: gap.gap,
      intentRelevant: gap.intentRelevant,
      northStarCritical: gap.northStarCritical,
    })),
    ruleBasedRecommendation: {
      missionId: ruleBased.recommendedInitiativeId,
      title: ruleBased.recommendedInitiativeTitle,
      priorityScore: ruleBased.priorityScore,
      why: ruleBased.why,
    },
    candidateMissions: ruleBased.evolution.evolutionRecommendations.slice(0, 5).map((rec) => ({
      missionId: rec.missionId,
      title: rec.title,
      valueScore: rec.valueScore,
      gapClosed: rec.gapClosed,
      roadmapRationale: rec.roadmapRationale,
    })),
    recentMemory: recentMemory.map((memory) => memory.cycleSummary),
    context: context ?? { health: "empty", entities: [], knowledge: [], workflows: [] },
  };
}

function parseVerdict(output: unknown): AiMissionVerdict {
  const data = (output ?? {}) as Partial<AiMissionVerdict> & Record<string, unknown>;

  const selectedMissionId = typeof data.selectedMissionId === "string" ? data.selectedMissionId : null;
  const confidence =
    typeof data.confidence === "number" && Number.isFinite(data.confidence)
      ? Math.min(1, Math.max(0, data.confidence))
      : 0.5;
  const reasoning = typeof data.reasoning === "string" && data.reasoning.trim() ? data.reasoning.trim() : "Geen reasoning ontvangen.";
  const agreesWithRuleBased = Boolean(data.agreesWithRuleBased);

  return { selectedMissionId, confidence, reasoning, agreesWithRuleBased };
}

/**
 * Runs the existing rule-based Decision Engine, then — only when a real API key is
 * configured — asks Claude for an independent verdict on the same context. Always
 * resolves; never throws.
 */
export async function runAutonomousDecision(
  input: DecisionEngineInput,
): Promise<AutonomousDecisionResult> {
  const ruleBased = runDecision(input);

  if (!isAnthropicConfigured()) {
    rememberDecision({
      missionId: ruleBased.recommendedInitiativeId,
      title: ruleBased.recommendedInitiativeTitle,
      reasoning: ruleBased.why,
      source: "rule-based",
      confidence: null,
    });
    return { ruleBased, ai: null, source: "rule-based" };
  }

  try {
    bootstrapAiProviders();
    const recentMemory = recallRecentDecisions();
    const context = gatherContext(ruleBased.intent);

    const execution = await executeTask<AiMissionVerdict>({
      task: "mission.decide",
      payload: buildDecisionPayload(ruleBased, recentMemory, context),
      moduleId: "atlas-brain",
      skipCache: true,
    });

    const metadata = execution.metadata ?? {};
    const fellBackToMock = metadata.transport === "mock" || Boolean(metadata.fallbackUsed || metadata.liveError);

    if (fellBackToMock) {
      const liveError = typeof metadata.liveError === "string" ? metadata.liveError : undefined;
      rememberDecision({
        missionId: ruleBased.recommendedInitiativeId,
        title: ruleBased.recommendedInitiativeTitle,
        reasoning: ruleBased.why,
        source: "rule-based",
        confidence: null,
      });
      return {
        ruleBased,
        ai: null,
        source: "rule-based",
        aiError: liveError ?? "Claude transport viel terug op mock-data (geen live antwoord ontvangen).",
        transportFellBackToMock: true,
      };
    }

    const verdict = parseVerdict(execution.output);
    const chosenId = verdict.selectedMissionId ?? ruleBased.recommendedInitiativeId;
    const chosenTitle =
      ruleBased.evolution.evolutionRecommendations.find((rec) => rec.missionId === chosenId)?.title ??
      (chosenId === ruleBased.recommendedInitiativeId ? ruleBased.recommendedInitiativeTitle : null);

    rememberDecision({
      missionId: chosenId,
      title: chosenTitle,
      reasoning: verdict.reasoning,
      source: "ai",
      confidence: verdict.confidence,
    });

    return {
      ruleBased,
      ai: verdict,
      source: "ai",
    };
  } catch (error) {
    rememberDecision({
      missionId: ruleBased.recommendedInitiativeId,
      title: ruleBased.recommendedInitiativeTitle,
      reasoning: ruleBased.why,
      source: "rule-based",
      confidence: null,
    });
    return {
      ruleBased,
      ai: null,
      source: "rule-based",
      aiError: error instanceof Error ? error.message : String(error),
    };
  }
}
