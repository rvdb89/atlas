import { localMemoryStore } from "./MemoryStore";

/**
 * BRAIN-009 · Memory Retention
 *
 * Decision-type memories are written once per runtime cycle (every ~5 min, see
 * AutonomousDecision.ts's rememberDecision()) and never expired on their own — archive() and
 * delete() on MemoryStore only ever flip a status flag, exportAll() still persists every
 * entry forever regardless of status (see MemoryStore.ts), so nothing actually bounded the
 * size of reports/memory/store.json. Real measurement during this project: 379 decision
 * memories accumulated in under 2 days — left unchecked, that keeps growing without limit,
 * both in the JS process and in the file rewritten to disk every single cycle.
 *
 * Only "decision" memories are pruned — the auto-generated per-cycle log. Every other memory
 * type (workflow/preference/knowledge/project/task/conversation/user) is left untouched,
 * since those are far lower-volume and more likely to hold lasting value; nothing here ever
 * decides that another type is disposable.
 *
 * recallRecentDecisions() (AutonomousDecision.ts) only ever reads the most recent 3 decision
 * memories, and collectMemoryContext()/collectKnowledgeContext() (ContextBuilder.ts) only
 * ever ask for a handful more — keeping the most recent MAX_DECISION_MEMORIES is generous
 * headroom for all real callers, not a risk to any existing functionality.
 */

const MAX_DECISION_MEMORIES = 200;

/** Hard-removes the oldest "decision" memories beyond MAX_DECISION_MEMORIES. Best-effort:
 * any failure returns 0 (nothing pruned) rather than throwing — a retention hiccup must
 * never block a cycle or a save. Returns how many entries were actually removed, so the
 * caller can log it (never a silent operation). */
export function pruneOldDecisionMemories(): number {
  try {
    const decisions = localMemoryStore
      .exportAll()
      .filter((entry) => entry.type === "decision" && entry.status !== "deleted")
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    if (decisions.length <= MAX_DECISION_MEMORIES) return 0;

    const idsToRemove = decisions.slice(MAX_DECISION_MEMORIES).map((entry) => entry.id);
    return localMemoryStore.purge(idsToRemove);
  } catch {
    return 0;
  }
}
