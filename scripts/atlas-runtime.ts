import "dotenv/config";

import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { join } from "node:path";

import chalk from "chalk";

import { runAutonomousDecision } from "@/atlas/brain/decision";
import {
  bootstrapAtlasMemory,
  getMemorySnapshot,
  localMemoryStore,
  pruneOldDecisionMemories,
  type AtlasMemoryEntry,
  type RecentMemoryEntry,
} from "@/atlas/brain/memory";
import { missionRegistry, registerMissionFromSource } from "@/atlas/engineering/mission-orchestrator";
import { ATLAS_AI_TEAM } from "@/atlas/agents/team";
import { isAnthropicConfigured } from "@/atlas/config/env";

import { ROOT_DIR, EXECUTIVE_MEMORY_DB_FILE } from "./atlas/shared";
import { APPLY_BRIDGE_PORT, EXECUTIVE_MEMORY_PORT } from "./atlas/runtimePorts";
import { removePidFileIfMatches } from "./atlas/runtimeLifecycle";
import { ensureMissionPackage, type MissionPackageSummary } from "./atlas/missionPackage";
import { applyProposedChanges } from "./atlas/applyEngine";
import { runExecutionEngine, getExecutionProposalState, type ExecutionProposalState } from "./atlas/executionEngine";
import {
  runContentGenerationEngine,
  isContentMission,
  getNextUnappliedContentMissionId,
} from "./atlas/contentGenerationEngine";
import { runTipsGenerationEngine, isTipsMission } from "./atlas/tipsGenerationEngine";
import { createPublishingAttributionReporter } from "@/atlas/team/PublishingAttributionReporter";
import { createEngineeringAttributionReporter } from "@/atlas/team/EngineeringAttributionReporter";
import { departmentForOperationalId } from "@/atlas/team/DepartmentResolver";
import type { RatifiedDepartmentId } from "@/atlas/team/department.types";
import { readPendingCeoInstruction, writeCeoInstruction, clearCeoInstruction, type CeoInstruction } from "./atlas/ceoInstructions";
import { listPendingFixMissions } from "./atlas/replanOnFailure";
import { getAppsStatus, launchApp } from "./atlas/appsRegistry";
import { getCapabilityState } from "@/atlas/constitution";
import { SqlitePersistenceAdapter } from "@/atlas/executive-memory/server/SqlitePersistenceAdapter";
import { ExecutiveMemoryService } from "@/atlas/executive-memory/server/ExecutiveMemoryService";
import { startExecutiveMemoryHttpAdapter } from "@/atlas/executive-memory/server/ExecutiveMemoryHttpAdapter";
import { getMissionCardById } from "@/atlas/engineering/mission-orchestrator";
import { buildPlanForMission, findPlanByMissionId, registerPlan, updatePlanStatusById } from "@/atlas/brain/planner";
import type { ExecutionPlan } from "@/atlas/brain/planner";
import {
  buildRealRoadmap,
  buildRealDepartments,
  parseAuditWarnings,
  buildCandidateApprovals,
  buildAppliedHistory,
  buildRealBusinessesAndApps,
  type RuntimeRoadmapItem,
  type RuntimeDepartment,
  type RuntimeBug,
  type RuntimeApproval,
  type RuntimeAppliedMission,
  type RuntimeBusiness,
  type RuntimeApp,
} from "./atlas/realCompanyData";

/**
 * Atlas Runtime — the always-on decision loop.
 *
 * This is the piece that makes Atlas "think for itself" outside of a chat session or a
 * Cursor window: it is a standalone Node process that, on an interval, asks the real
 * Decision Engine (rule-based baseline + Claude verdict) what the platform should focus
 * on next, and writes the result to disk so any UI (Atlas Control) can read it.
 *
 * Run it with:
 *   npm run atlas:runtime            # continuous loop
 *   npm run atlas:runtime:once       # single cycle, then exit (useful for testing)
 *
 * State is written to:
 *   public/atlas-runtime-state.json  — latest snapshot, served statically by Expo web
 *   reports/runtime/activity.jsonl   — append-only history, survives restarts
 *   Executive Memory (atlas-memory/store) — BRAIN-002: Atlas' own memory entries, survives
 *     restarts. Migrated off reports/memory/store.json in Sprint 0.3 — that file is now only
 *     ever read once, as a one-time legacy import if Executive Memory has no snapshot yet.
 */

const PUBLIC_DIR = join(ROOT_DIR, "public");
const STATE_FILE = join(PUBLIC_DIR, "atlas-runtime-state.json");
const RUNTIME_DIR = join(ROOT_DIR, "reports", "runtime");
const ACTIVITY_LOG = join(RUNTIME_DIR, "activity.jsonl");
/** Sprint 0.3 · Legacy path — only ever read once, for the one-time import into Executive
 * Memory (see loadMemoryFromExecutiveMemory()). Never written by this file anymore. */
const MEMORY_DIR = join(ROOT_DIR, "reports", "memory");
const MEMORY_FILE = join(MEMORY_DIR, "store.json");
/** Sprint 0.3 · Executive Memory namespace/key for the Memory Engine's full snapshot — one
 * document, matching the exact shape reports/memory/store.json used to hold
 * (localMemoryStore.exportAll()). See ATLAS_SPRINT_0.3_IMPLEMENTATION_PLAN.md §2.2 for why a
 * single-document model was chosen over one document per entry. */
const MEMORY_NAMESPACE = "atlas-memory";
const MEMORY_KEY = "store";

const SELF_REVIEW_INTENT =
  "Continuous self-review: evaluate current capability gaps and confirm or correct the next highest-value initiative.";

const DEFAULT_INTERVAL_MS = 5 * 60_000;

/** EXEC-001 · Local-only bridge so the CEO Inbox's "Approve" button in Atlas Control can
 * trigger the Apply Engine directly — bound to 127.0.0.1 only, never reachable from
 * outside this machine. The dashboard calls this best-effort; if the runtime isn't
 * running, approving still works normally in the browser, it just can't auto-apply
 * (the CEO can always fall back to `npm run atlas:apply -- <MISSION-ID>`).
 *
 * APPLY_BRIDGE_PORT and EXECUTIVE_MEMORY_PORT live in ./atlas/runtimePorts (imported above)
 * rather than as local consts here, so that Runtime Lifecycle Management's separate CLI
 * commands (atlas:runtime:start/status/stop/restart) can import the same port numbers without
 * a circular import back into this file. Re-exported below for anything importing them
 * straight from atlas-runtime.ts. */
export { APPLY_BRIDGE_PORT, EXECUTIVE_MEMORY_PORT } from "./atlas/runtimePorts";

/** Sprint 0.1 · Executive Memory — the persistent, platform-independent storage layer that
 * Company State (Sprint 0.2) and the Memory Engine (Sprint 0.3) are both migrated onto. Bound
 * to 0.0.0.0, unlike the apply-bridge above: a physical mobile device on the same network
 * needs to reach this, and 127.0.0.1 on a phone refers to the phone itself, never this
 * machine. See ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md for the full design. */

type RuntimeActivityEntry = {
  id: string;
  occurredAt: string;
  cycle: number;
  source: "ai" | "rule-based";
  recommendedInitiativeId: string | null;
  recommendedInitiativeTitle: string | null;
  confidence: number | null;
  agreesWithRuleBased: boolean | null;
  reasoning: string;
};

type RuntimeAgentEntry = {
  id: string;
  name: string;
  role: string;
  /** Sprint 2.2a · ratified department id (engineering/publishing/customer-contact/
   * signal-research), resolved via the canonical CoreAgentId → TeamIdentityId →
   * RatifiedDepartmentId chain (`@/atlas/team/DepartmentResolver`). null for agents that have
   * no team identity — currently only `branch-director`, which is Atlas' own reasoning
   * identity, not a department member. Never a stale/invented department string. */
  department: RatifiedDepartmentId | null;
  status: "active" | "idle";
  health: number;
  currentInitiative: string;
  currentResponsibility: string;
};

/** Builds the real agent roster from ATLAS_AI_TEAM — no fictional names or metrics.
 *
 * Sprint 2.2a: department is no longer a hand-typed, pre-Team-Identity-Foundation guess
 * (the old `AGENT_DEPARTMENTS` map used fictional buckets like "marketing"/"design"/"quality"
 * that were never reconciled with the ratified Tom/Anna/Yara/Scout/Jerry identities). It now
 * resolves through the same canonical chain the rest of the Team Identity Foundation uses —
 * see `@/atlas/team/DepartmentResolver`'s `departmentForOperationalId()`. */
function buildRealAgents(latest: RuntimeActivityEntry): RuntimeAgentEntry[] {
  const claudeConfigured = isAnthropicConfigured();

  return ATLAS_AI_TEAM.map((member) => {
    const isBranchDirector = member.id === "branch-director";
    const active = isBranchDirector ? latest.source === "ai" : claudeConfigured;

    return {
      id: member.id,
      name: member.name,
      role: member.role,
      department: departmentForOperationalId(member.id),
      status: active ? "active" : "idle",
      health: active ? 100 : 40,
      currentInitiative: isBranchDirector
        ? (latest.recommendedInitiativeId ?? "No initiative selected this cycle")
        : claudeConfigured
          ? "Standby — no content pipeline task running"
          : "Idle — ANTHROPIC_API_KEY not configured",
      currentResponsibility: member.tagline,
    };
  });
}

/** Reads the most recent real audit score, if one has been generated (npm run atlas:audit). */
function readLatestAuditScore(): {
  overallScore: number;
  generatedAt: string;
  recommendation: string;
  reportPath: string | null;
} | null {
  const auditFile = join(ROOT_DIR, "reports", "sprints", "latest-audit.json");
  if (!existsSync(auditFile)) return null;

  try {
    const payload = JSON.parse(readFileSync(auditFile, "utf8")) as {
      overallScore?: number;
      generatedAt?: string;
      recommendation?: string;
      reportPath?: string;
    };
    if (typeof payload.overallScore !== "number") return null;
    return {
      overallScore: payload.overallScore,
      generatedAt: payload.generatedAt ?? "",
      recommendation: payload.recommendation ?? "",
      reportPath: payload.reportPath ?? null,
    };
  } catch {
    return null;
  }
}

/** Sprint 0.3 · Restores Atlas' persisted memory entries so it survives a runtime restart
 * instead of starting each session with a blank memory — now hydrated directly from the
 * in-process Executive Memory Service instead of a raw JSON file (see CEO decision log for
 * Sprint 0.3: no ExecutiveMemoryHttpClient here, this file IS the process that owns the
 * Service). Best-effort: any failure to reach Executive Memory starts with an empty store,
 * exactly like a missing/corrupt file did before.
 *
 * If Executive Memory has no snapshot yet (e.g. the very first boot after this migration),
 * falls back to a one-time import of the legacy reports/memory/store.json — read once, then
 * written into Executive Memory so every later boot uses Executive Memory as the sole source
 * of truth. The legacy file itself is never modified or deleted by this. */
async function loadMemoryFromExecutiveMemory(service: ExecutiveMemoryService): Promise<void> {
  bootstrapAtlasMemory();

  try {
    const existing = await service.load<AtlasMemoryEntry[]>(MEMORY_NAMESPACE, MEMORY_KEY);
    if (existing) {
      localMemoryStore.importAll(existing.value);
      return;
    }
  } catch (error) {
    console.error(
      chalk.red("Kon memory-store niet laden uit Executive Memory:"),
      error instanceof Error ? error.message : error,
    );
    return;
  }

  if (!existsSync(MEMORY_FILE)) return;
  try {
    const entries = JSON.parse(readFileSync(MEMORY_FILE, "utf8"));
    if (!Array.isArray(entries)) return;
    localMemoryStore.importAll(entries);
    await service.save(MEMORY_NAMESPACE, MEMORY_KEY, entries);
    console.log(
      chalk.cyan(
        `  memory: eenmalig ${entries.length} entries gemigreerd van reports/memory/store.json naar Executive Memory`,
      ),
    );
  } catch (error) {
    console.error(
      chalk.red("Kon legacy memory-store niet migreren naar Executive Memory:"),
      error instanceof Error ? error.message : error,
    );
  }
}

/** Writes every memory entry to Executive Memory — called after each cycle so new memories
 * (recorded by the Decision Engine) survive the next restart. One document, one save() per
 * cycle — same batch cadence as the old full-file rewrite it replaces.
 *
 * BRAIN-009 · Prunes old decision-type memories first (see MemoryRetention.ts) — without
 * this, the memory store grows without limit (~250 new decision memories/day measured in
 * this project), rewritten in full on every single cycle. Best-effort and silent when
 * there's nothing to prune; logs a line only when it actually removes something. Saving to
 * Executive Memory is itself best-effort too — a failure is logged but never blocks or
 * crashes the cycle, same "memory is best-effort" philosophy as rememberDecision(). */
async function persistMemoryToExecutiveMemory(service: ExecutiveMemoryService): Promise<void> {
  const pruned = pruneOldDecisionMemories();
  if (pruned > 0) {
    console.log(chalk.dim(`  memory: pruned ${pruned} old decision memor${pruned === 1 ? "y" : "ies"} (retention cap)`));
  }

  try {
    await service.save(MEMORY_NAMESPACE, MEMORY_KEY, localMemoryStore.exportAll());
  } catch (error) {
    console.error(
      chalk.red("Kon memory-store niet opslaan naar Executive Memory:"),
      error instanceof Error ? error.message : error,
    );
  }
}

/** Builds a small, honest summary of the persistent memory store for the dashboard.
 *
 * BRAIN-002b · Used to only ever expose a synthetic health score — the dashboard could see
 * "82% health, 14 memories" but never a single actual memory. `recent` closes that gap: the
 * same top-N-by-updatedAt entries getMemorySnapshot() already computes, trimmed to a lean,
 * dashboard-safe shape (see RecentMemoryEntry) and written into the exact same
 * public/atlas-runtime-state.json file every other dashboard section already polls — no new
 * server, no new port, same pattern as roadmap/departments/bugs/appliedHistory. */
function buildMemorySummary(): {
  total: number;
  health: number;
  statusLabel: string;
  lastUpdated: string;
  recent: RecentMemoryEntry[];
} {
  const snapshot = getMemorySnapshot();
  const total = snapshot.total;
  const health = total === 0 ? 40 : Math.min(98, 60 + total * 3);
  const lastUpdated = snapshot.recent[0]?.updatedAt ?? new Date().toISOString();
  const statusLabel =
    total === 0
      ? "No memories yet"
      : `${total} memories · ${snapshot.workflows} workflow · ${snapshot.preferences} preference`;
  const recent: RecentMemoryEntry[] = snapshot.recent.map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    summary: entry.summary,
    tags: entry.tags,
    importance: entry.importance,
    source: entry.source,
    updatedAt: entry.updatedAt,
  }));

  return { total, health, statusLabel, lastUpdated, recent };
}

function loadMissionFilesFromDisk(): void {
  const missionsDir = join(ROOT_DIR, "engineering/missions");
  if (!existsSync(missionsDir)) return;

  for (const filename of readdirSync(missionsDir)) {
    if (!filename.endsWith(".mission")) continue;
    const missionId = filename.replace(/\.mission$/, "").toUpperCase();
    const sourcePath = `engineering/missions/${filename}`;
    const source = readFileSync(join(ROOT_DIR, sourcePath), "utf8");
    registerMissionFromSource(missionId, sourcePath, source);
  }
}

function readHistory(): RuntimeActivityEntry[] {
  if (!existsSync(ACTIVITY_LOG)) return [];
  return readFileSync(ACTIVITY_LOG, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as RuntimeActivityEntry;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is RuntimeActivityEntry => entry !== null);
}

function appendHistory(entry: RuntimeActivityEntry): void {
  mkdirSync(RUNTIME_DIR, { recursive: true });
  appendFileSync(ACTIVITY_LOG, `${JSON.stringify(entry)}\n`, "utf8");
}

function writeSnapshot(input: {
  startedAt: string;
  intervalMs: number;
  cycleCount: number;
  latest: RuntimeActivityEntry;
  capabilityGaps: Array<{ id: string; name: string; gap: number; intentRelevant: boolean }>;
  history: RuntimeActivityEntry[];
  agents: RuntimeAgentEntry[];
  audit: { overallScore: number; generatedAt: string; recommendation: string; reportPath: string | null } | null;
  memory: { total: number; health: number; statusLabel: string; lastUpdated: string; recent: RecentMemoryEntry[] };
  activePackage: MissionPackageSummary | null;
  roadmap: RuntimeRoadmapItem[];
  departments: RuntimeDepartment[];
  bugs: RuntimeBug[];
  candidateApprovals: RuntimeApproval[];
  appliedHistory: RuntimeAppliedMission[];
  businesses: RuntimeBusiness[];
  apps: RuntimeApp[];
  /** Context/Planner integration (2026-07-11) · The live ExecutionPlan for whichever mission
   * the runtime is currently focused on, if one was registered — see buildPlanForMission() in
   * ensureExecutionProposal(). null just means no plan exists yet for this cycle's mission
   * (e.g. it was already fully applied, or planning itself failed — best-effort, never
   * blocks). This is what lets Atlas Control show "what Atlas is doing right now" step by
   * step instead of only a final diff once everything is already done. */
  plan: ExecutionPlan | null;
}): void {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(
    STATE_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        runtimeStartedAt: input.startedAt,
        intervalMs: input.intervalMs,
        cycleCount: input.cycleCount,
        latest: input.latest,
        capabilityGaps: input.capabilityGaps,
        activity: input.history.slice(-20).reverse(),
        agents: input.agents,
        audit: input.audit,
        memory: input.memory,
        activePackage: input.activePackage,
        roadmap: input.roadmap,
        departments: input.departments,
        bugs: input.bugs,
        candidateApprovals: input.candidateApprovals,
        appliedHistory: input.appliedHistory,
        businesses: input.businesses,
        apps: input.apps,
        plan: input.plan,
      },
      null,
      2,
    ),
    "utf8",
  );
}

/** EXEC-001 · Cooldown after a failed auto-draft attempt so a persistent problem (e.g. a
 * misconfigured API key, or Claude repeatedly failing for one mission) can't spam the
 * Claude API every single cycle. A successful draft never needs this — once
 * proposed-changes/ exists, getExecutionProposalState() already short-circuits. */
const EXECUTION_RETRY_BACKOFF_MS = 15 * 60_000;

type ExecutionAttemptMarker = { lastAttemptAt: string; ok: boolean; message: string };

function executionAttemptMarkerPath(missionId: string): string {
  return join(ROOT_DIR, "engineering", "packages", missionId, "execution-attempt.json");
}

function readExecutionAttemptMarker(missionId: string): ExecutionAttemptMarker | null {
  const markerPath = executionAttemptMarkerPath(missionId);
  if (!existsSync(markerPath)) return null;
  try {
    return JSON.parse(readFileSync(markerPath, "utf8")) as ExecutionAttemptMarker;
  } catch {
    return null;
  }
}

function writeExecutionAttemptMarker(missionId: string, ok: boolean, message: string): void {
  const markerPath = executionAttemptMarkerPath(missionId);
  mkdirSync(join(markerPath, ".."), { recursive: true });
  writeFileSync(markerPath, JSON.stringify({ lastAttemptAt: new Date().toISOString(), ok, message }, null, 2), "utf8");
}

/** EXEC-001 · Closes the loop from "Atlas picked this as top priority" all the way to "a
 * real, reviewable code change is waiting in the CEO Inbox" — no manual `npm run
 * atlas:execute` required. Only ever drafts into the review-only proposed-changes/ folder;
 * writing into the real working tree still always requires an explicit CEO Inbox "Approve"
 * click (or `npm run atlas:apply`). Best-effort and guarded: does nothing once a proposal
 * already exists or has been applied, and backs off for a while after a failed attempt. */
async function ensureExecutionProposal(
  missionId: string | null,
  // Sprint 1.2 — Anna & Yara. Optional and additive: omitting this reproduces today's exact
  // behavior. Threaded through to runContentGenerationEngine() so content missions can report
  // capability attribution via the existing in-process ExecutiveMemoryService — no self-HTTP
  // call, same precedent as Sprint 0.3.
  executiveMemoryService?: ExecutiveMemoryService,
): Promise<ExecutionProposalState> {
  if (!missionId) return "none";

  const state = getExecutionProposalState(missionId);
  if (state !== "none") return state;

  const marker = readExecutionAttemptMarker(missionId);
  if (marker && !marker.ok && Date.now() - Date.parse(marker.lastAttemptAt) < EXECUTION_RETRY_BACKOFF_MS) {
    return "none";
  }

  // Context/Planner integration (2026-07-11) · Register a real ExecutionPlan for this mission
  // BEFORE dispatching to the engine, using the exact same three-way branch the dispatch below
  // uses — deterministic, not the fuzzy matchScore text-matching the standalone Proof-of-Power
  // demo relies on. This is what makes the CEO Inbox/dashboard able to show "what Atlas is
  // doing right now" instead of only ever showing a final diff once everything is already
  // done. Best-effort: a planner problem must never block the real mission work below it.
  const missionKind = isContentMission(missionId) ? "content" : isTipsMission(missionId) ? "tips" : "execution";
  try {
    const goal = getMissionCardById(missionId)?.title ?? missionId;
    registerPlan(buildPlanForMission(missionId, goal, missionKind));
    updatePlanStatusById(missionId, { status: "executing", startedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.dim(`  planner: could not register a plan for ${missionId} (${message}) — continuing anyway`));
  }

  try {
    // Content missions (CONTENT-002, ...) route through the real copywriter/fact-checker/
    // link-engine agent team instead of the generic code-writing engine — see
    // contentGenerationEngine.ts for why: that team's own AI calls are real, but the
    // generic engine used to be asked to hand-write escaped TypeScript for rich articles,
    // which is what kept truncating. Tips missions (TIPS-001, ...) route through their own
    // much lighter engine — a tip is one sentence, not an article, so the full multi-agent
    // pipeline would be pure overhead (see tipsGenerationEngine.ts). Same downstream contract
    // either way (proposed-changes/ + CEO Inbox + Apply Engine), so nothing else in this
    // function needs to branch.
    const attributionReporter = executiveMemoryService
      ? createPublishingAttributionReporter(executiveMemoryService)
      : undefined;
    const result =
      missionKind === "content"
        ? await runContentGenerationEngine(missionId, attributionReporter)
        : missionKind === "tips"
          ? await runTipsGenerationEngine(missionId)
          : await runExecutionEngine(missionId);
    if (result.ok) {
      writeExecutionAttemptMarker(missionId, true, `Drafted ${result.files.length} file(s).`);
      console.log(
        chalk.magenta(
          `  execution: drafted a code proposal for ${missionId} (${result.files.length} file(s)) — awaiting CEO approval`,
        ),
      );
      return "pending-review";
    }

    writeExecutionAttemptMarker(missionId, false, result.message);
    console.log(chalk.dim(`  execution: could not draft a proposal for ${missionId} yet (${result.message})`));
    updatePlanStatusById(missionId, { status: "failed", completedAt: new Date().toISOString() });
    return "none";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeExecutionAttemptMarker(missionId, false, message);
    console.error(chalk.red(`  execution: drafting threw for ${missionId}:`), message);
    updatePlanStatusById(missionId, { status: "failed", completedAt: new Date().toISOString() });
    return "none";
  }
}

async function runCycle(
  cycle: number,
  startedAt: string,
  intervalMs: number,
  executiveMemoryService: ExecutiveMemoryService,
): Promise<void> {
  // Reload engineering/missions/*.mission every cycle, not just at process start — so a
  // brand-new mission file (e.g. an ad hoc CEO request) becomes selectable on the very next
  // cycle without needing to restart the always-on runtime process. Idempotent: re-registering
  // an unchanged mission is a harmless Map overwrite.
  loadMissionFilesFromDisk();

  // CONTENT-001 · A pending CEO instruction (reports/runtime/ceo-instruction.json) is an
  // explicit human command, not a suggestion — it always wins, in both the rule-based pick
  // AND the Claude "second opinion" (which would otherwise be free to disagree and silently
  // override it, see runAutonomousDecision). Still requires the mission to be a real,
  // registered mission card; still never touches the working tree without an Approve click.
  let pendingInstruction = readPendingCeoInstruction();

  // CONTENT-005 · Auto-chain: once the content capability's registered evolutionMissionId
  // has actually been applied, don't sit there recommending an already-finished mission
  // until a human manually edits CurrentStateRegistry.ts. Instead, self-queue the next
  // not-yet-applied CONTENT-* mission as if the CEO had typed the instruction directly —
  // reusing the exact same force-select + self-clear mechanism as a real CEO instruction,
  // so this only ever acts as a recovery/continuation step and never overrides an explicit
  // human instruction or other capabilities' normal capability-gap-based prioritization.
  if (!pendingInstruction) {
    const contentState = getCapabilityState("content");
    // Pure disk-state read, no side effects — must NOT use ensureExecutionProposal here,
    // since that function drafts a brand-new proposal as a side effect when none exists yet.
    const contentMissionApplied =
      contentState && getExecutionProposalState(contentState.evolutionMissionId) === "applied";

    if (contentMissionApplied) {
      const nextMissionId = getNextUnappliedContentMissionId();
      if (nextMissionId) {
        const title = getMissionCardById(nextMissionId)?.title ?? nextMissionId;
        pendingInstruction = writeCeoInstruction({
          missionId: nextMissionId,
          intent: `Automatisch doorgeschakeld na afronden van ${contentState!.evolutionMissionId}: ga verder met ${nextMissionId}.`,
          title,
        });
        console.log(
          chalk.cyan(`  auto-chain: content-missie afgerond, automatisch doorgeschakeld naar "${nextMissionId}" (${title}).`),
        );
      }
    }
  }

  const decision = await runAutonomousDecision(
    pendingInstruction
      ? {
          intent: pendingInstruction.intent,
          missionId: pendingInstruction.missionId,
          missionRegistered: (id) => missionRegistry.has(id),
        }
      : {
          intent: SELF_REVIEW_INTENT,
          missionRegistered: (id) => missionRegistry.has(id),
        },
  );

  // Claude's own pick is the source of truth when it disagrees with the rule-based
  // baseline — otherwise this runtime would silently hide every real override. That only
  // applies to Atlas's own autonomous prioritization though: an explicit CEO instruction is
  // never up for debate, so it force-selects the mission regardless of what either decision
  // layer independently concluded.
  const chosenMissionId = pendingInstruction
    ? pendingInstruction.missionId
    : (decision.ai?.selectedMissionId ?? decision.ruleBased.recommendedInitiativeId);
  const chosenTitle = pendingInstruction?.title ??
    decision.ruleBased.evolution.evolutionRecommendations.find((rec) => rec.missionId === chosenMissionId)?.title ??
    (chosenMissionId === decision.ruleBased.recommendedInitiativeId
      ? decision.ruleBased.recommendedInitiativeTitle
      : null);

  const entry: RuntimeActivityEntry = {
    id: `cycle-${cycle}-${Date.now()}`,
    occurredAt: new Date().toISOString(),
    cycle,
    source: decision.source,
    recommendedInitiativeId: chosenMissionId,
    recommendedInitiativeTitle: chosenTitle,
    confidence: decision.ai?.confidence ?? null,
    agreesWithRuleBased: decision.ai?.agreesWithRuleBased ?? null,
    reasoning: decision.ai?.reasoning ?? decision.aiError ?? decision.ruleBased.why,
  };

  appendHistory(entry);
  const history = readHistory();

  // BRAIN-001 · Turns the chosen mission into a real engineering package (or reports the
  // one that's already there) — closing the loop from "recommendation" to "something
  // concrete to build". Best-effort: never blocks the cycle if it fails.
  const activePackage = ensureMissionPackage(chosenMissionId);

  // EXEC-001 · Once there's a real package for the top priority, automatically draft a
  // code proposal too — the CEO only ever needs to see the resulting Inbox item and click
  // Approve, no CLI step required. Still never touches the working tree on its own.
  const executionProposalState = await ensureExecutionProposal(chosenMissionId, executiveMemoryService);

  // CONTENT-001 · Once a pending CEO instruction has actually been applied (drafted,
  // approved via CEO Inbox, and written into the working tree), the request is fully
  // resolved — clear the pointer so the runtime reverts to normal capability-gap-based
  // prioritization on its own, instead of staying pinned to an already-finished request.
  if (pendingInstruction && executionProposalState === "applied") {
    clearCeoInstruction();
    console.log(
      chalk.green(
        `  ceo-instruction: "${pendingInstruction.missionId}" is toegepast — verzoek afgerond, terug naar automatische prioritering.`,
      ),
    );
  }

  const agents = buildRealAgents(entry);
  const audit = readLatestAuditScore();
  const memory = buildMemorySummary();

  // Everything below replaces mock company data with values derived from what Atlas
  // actually did this cycle: its own evolution recommendations, real agent health, the
  // real Atlas Auditor report, and real git history. No fabricated fields.
  const roadmap = buildRealRoadmap(decision.ruleBased.evolution.evolutionRecommendations, chosenMissionId);

  // Sprint 2.2a · departments are now derived solely from real operational agents, resolved
  // through the canonical department chain — see buildRealDepartments()'s own doc comment for
  // why audit score / memory health / roadmap / decision confidence no longer feed synthetic
  // department entries here (they remain independently present on this same snapshot via
  // `audit`, `memory`, `roadmap`, and `latest` below).
  const departments = buildRealDepartments({ agents });

  const bugs = parseAuditWarnings(audit?.reportPath ?? undefined);

  const candidateApprovals = buildCandidateApprovals({
    activePackage,
    executionProposalState,
    bugs,
    aiDisagreed: decision.ai !== null && decision.ai.agreesWithRuleBased === false,
    chosenMissionId,
    chosenTitle,
    reasoning: entry.reasoning,
    pendingFixMissions: listPendingFixMissions(),
  });

  const { businesses, apps } = buildRealBusinessesAndApps({
    bugs,
    roadmap,
    auditScore: audit?.overallScore ?? null,
  });

  // CONTROL-HISTORY · Read-only track record of every mission actually applied so far —
  // scanned fresh from disk every cycle (cheap: just a directory walk + small JSON reads),
  // never fabricated or hand-maintained.
  const appliedHistory = buildAppliedHistory();

  // Context/Planner integration (2026-07-11) · Best-effort lookup — chosenMissionId can be
  // null (nothing to recommend this cycle) or its plan can have aged out of the capped
  // executionQueue; either way this must never throw or block the snapshot write.
  let plan: ExecutionPlan | null = null;
  try {
    plan = chosenMissionId ? findPlanByMissionId(chosenMissionId) : null;
  } catch {
    plan = null;
  }

  writeSnapshot({
    startedAt,
    intervalMs,
    cycleCount: cycle,
    latest: entry,
    capabilityGaps: decision.ruleBased.capabilityGaps.map((gap) => ({
      id: gap.capabilityId,
      name: gap.name,
      gap: gap.gap,
      intentRelevant: gap.intentRelevant,
    })),
    history,
    agents,
    audit,
    memory,
    activePackage,
    roadmap,
    departments,
    bugs,
    candidateApprovals,
    appliedHistory,
    businesses,
    apps,
    plan,
  });

  await persistMemoryToExecutiveMemory(executiveMemoryService);

  if (activePackage) {
    const packageColor = activePackage.alreadyExisted ? chalk.dim : chalk.magenta;
    console.log(
      packageColor(
        `  package: ${activePackage.missionId} — ${activePackage.alreadyExisted ? "already ready at" : "generated at"} ${activePackage.packageDir}`,
      ),
    );
  }

  const color = decision.source === "ai" ? chalk.green : chalk.yellow;
  const confidenceLabel = entry.confidence !== null ? `${Math.round(entry.confidence * 100)}%` : "n/a";
  console.log(
    color(
      `[cycle ${cycle}] ${decision.source === "ai" ? "Claude" : "rule-based"} · ${entry.recommendedInitiativeId ?? "no initiative"} · confidence ${confidenceLabel}`,
    ),
  );
  console.log(chalk.dim(`  ${entry.reasoning}`));

  const memorySummary = getMemorySnapshot();
  console.log(chalk.dim(`  memory: ${memorySummary.total} entries persisted`));
}

/** Starts the local-only apply-bridge HTTP server. Bound to 127.0.0.1 — never listens on
 * any external interface. Exposes exactly one action: apply an already-reviewed proposal
 * for a mission ID. Best-effort from the browser's side; this server existing or not
 * never affects the rest of the runtime loop. */
function startApplyBridge(executiveMemoryService: ExecutiveMemoryService): Server {
  // Sprint 1.3 — Tom (Engineering): constructed once per bridge start, reused across every
  // /apply request. Optional/additive from applyProposedChanges()'s point of view.
  const engineeringAttributionReporter = createEngineeringAttributionReporter(executiveMemoryService);
  const server = createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // App Launcher · lets Atlas Control check whether a registered app's dev server is
    // reachable (GET /apps/status) and spawn it on demand if not (POST /apps/launch) — see
    // scripts/atlas/appsRegistry.ts for why this exists (clicking "Doughbert app" used to
    // just window.open a dead port) and how to register future apps.
    if (req.method === "GET" && req.url === "/apps/status") {
      void getAppsStatus().then((status) => {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true, status }));
      });
      return;
    }

    if (req.method === "POST" && req.url === "/apps/launch") {
      let launchBody = "";
      req.on("data", (chunk) => {
        launchBody += chunk;
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(launchBody || "{}") as { appId?: unknown };
          const appId = typeof parsed.appId === "string" ? parsed.appId : "";
          if (!appId) {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ ok: false, message: "appId is required" }));
            return;
          }
          const result = launchApp(appId);
          console.log(
            result.ok
              ? chalk.green(
                  `  [apply-bridge] launch requested for app "${appId}" (alreadyRunning=${result.alreadyRunning})`,
                )
              : chalk.red(`  [apply-bridge] launch failed for app "${appId}": ${result.message}`),
          );
          res.writeHead(result.ok ? 200 : 400, { "content-type": "application/json" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false, message: error instanceof Error ? error.message : String(error) }));
        }
      });
      return;
    }

    // Bugfix 2026-07-10 · "roadmap_decision" cards (id: override-<missionId>, written when
    // Claude's mission.decide disagrees with the rule-based pick) used to be purely advisory —
    // clicking Confirm in the CEO Inbox only flipped local UI state, never actually pinned the
    // mission via writeCeoInstruction(). Found live: a CEO approval of an override card produced
    // no follow-up because the runtime kept recomputing its pick fresh every cycle with nothing
    // forcing it to stick. This route gives that card type the same "approval has a real
    // backend effect" guarantee /apply already gives pkg-* cards.
    if (req.method === "POST" && req.url === "/pin") {
      let pinBody = "";
      req.on("data", (chunk) => {
        pinBody += chunk;
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(pinBody || "{}") as { missionId?: unknown; intent?: unknown; title?: unknown };
          const missionId = typeof parsed.missionId === "string" ? parsed.missionId : "";
          if (!missionId) {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ ok: false, message: "missionId is required" }));
            return;
          }
          const intent =
            typeof parsed.intent === "string" && parsed.intent.trim()
              ? parsed.intent.trim()
              : `CEO bevestigde Atlas' aanbeveling om door te gaan met ${missionId}.`;
          const title = typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : undefined;

          const instruction = writeCeoInstruction({ missionId, intent, title });
          console.log(chalk.green(`  [apply-bridge] pinned "${instruction.missionId}" as the next CEO instruction`));
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: true, missionId: instruction.missionId }));
        } catch (error) {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false, message: error instanceof Error ? error.message : String(error) }));
        }
      });
      return;
    }

    if (req.method !== "POST" || req.url !== "/apply") {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          ok: false,
          message:
            "Not found. POST /apply { missionId }, POST /pin { missionId }, GET /apps/status, or POST /apps/launch { appId } only.",
        }),
      );
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body || "{}") as { missionId?: unknown };
        const missionId = typeof parsed.missionId === "string" ? parsed.missionId : "";
        if (!missionId) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ ok: false, message: "missionId is required" }));
          return;
        }

        const result = await applyProposedChanges(missionId, engineeringAttributionReporter);
        console.log(
          result.ok
            ? chalk.green(`  [apply-bridge] applied ${result.applied.length} file(s) for ${result.missionId}`)
            : chalk.red(`  [apply-bridge] failed for ${missionId}: ${result.message}`),
        );
        res.writeHead(result.ok ? 200 : 400, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: false, message: error instanceof Error ? error.message : String(error) }));
      }
    });
  });

  server.listen(APPLY_BRIDGE_PORT, "127.0.0.1", () => {
    console.log(chalk.dim(`  apply-bridge: http://127.0.0.1:${APPLY_BRIDGE_PORT}/apply (localhost only)`));
  });

  server.on("error", (error) => {
    console.error(chalk.red("  [apply-bridge] failed to start:"), error instanceof Error ? error.message : error);
  });

  return server;
}

/** Sprint 0.1 · Creates the Executive Memory Service in-process: the SQLite adapter and
 * Service run inside this same runtime process (no separate process to manage). Split from
 * the HTTP transport below (Sprint 0.3) so `service` exists — and can be used directly, no
 * HTTP round-trip needed — before anything in this file that has a hard dependency on it
 * runs, including in `--once` mode, which never starts the HTTP transport at all. See
 * ATLAS_SPRINT_0.1_IMPLEMENTATION_PLAN.md chapter 1 and ATLAS_SPRINT_0.3_IMPLEMENTATION_PLAN.md
 * for the reasoning. */
function createExecutiveMemoryService(): {
  service: ExecutiveMemoryService;
  adapter: SqlitePersistenceAdapter;
} {
  const adapter = new SqlitePersistenceAdapter(EXECUTIVE_MEMORY_DB_FILE);
  const service = new ExecutiveMemoryService(adapter);
  return { service, adapter };
}

/** Sprint 0.1 · Starts the LAN-reachable HTTP transport on top of an already-created Service —
 * this is what web/mobile clients and Company State's ExecutiveMemoryHttpClient talk to.
 * Bound to 0.0.0.0, unlike the apply-bridge: a physical device on the same network needs to
 * reach this, and 127.0.0.1 on a phone refers to the phone itself. Only started for a
 * continuous runtime (not `--once`) — same position/timing as before Sprint 0.3. */
async function startExecutiveMemoryHttpTransport(service: ExecutiveMemoryService): Promise<Server> {
  const server = await startExecutiveMemoryHttpAdapter(service, EXECUTIVE_MEMORY_PORT);
  console.log(chalk.dim(`  executive-memory: http://0.0.0.0:${EXECUTIVE_MEMORY_PORT} (LAN-reachable, web + mobile)`));
  return server;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const once = args.includes("--once");
  const intervalArg = args.find((arg) => arg.startsWith("--interval-ms="));
  const intervalMs = intervalArg ? Number(intervalArg.split("=")[1]) : DEFAULT_INTERVAL_MS;

  console.log("");
  console.log(chalk.bold.hex("#38bdf8")("Atlas Runtime — always-on decision loop"));
  console.log(
    chalk.dim(once ? "Mode: single cycle (--once)" : `Mode: continuous, every ${Math.round(intervalMs / 1000)}s`),
  );
  console.log("");

  // Sprint 0.3 · Executive Memory's Service must exist before anything tries to hydrate or
  // persist Atlas' memory — created directly in-process here (no HTTP round-trip to itself,
  // see the CEO decision log for Sprint 0.3). This must happen before the very first cycle,
  // including in `--once` mode, since runCycle() needs it to persist memory at the end of
  // every cycle. The HTTP transport (LAN-reachable, for web/mobile/Company State) still only
  // starts later, once the runtime actually goes continuous — same as before.
  const { service: executiveMemoryService, adapter: executiveMemoryAdapter } = createExecutiveMemoryService();

  loadMissionFilesFromDisk();
  await loadMemoryFromExecutiveMemory(executiveMemoryService);
  const startedAt = new Date().toISOString();
  let cycle = readHistory().length;

  // Guards against overlapping cycles: setInterval fires on a fixed clock regardless of
  // whether the previous tick finished. That was harmless while a cycle was just a
  // decision + maybe one code proposal (well under intervalMs), but the Content Generation
  // Engine can now make up to 6 sequential real AI calls in one cycle — genuinely capable of
  // running longer than the default 300s interval. Without this guard, a slow cycle and the
  // next scheduled one would run concurrently, racing on the same execution-attempt.json /
  // memory-store writes. Skips (never queues) an overlapping tick — the next on-schedule
  // tick still runs normally once the slow one finishes.
  let cycleInProgress = false;

  const tick = async (): Promise<void> => {
    if (cycleInProgress) {
      console.log(
        chalk.dim(`  skipped: cycle ${cycle + 1} would overlap a still-running cycle — waiting for it to finish`),
      );
      return;
    }

    cycleInProgress = true;
    cycle += 1;
    try {
      await runCycle(cycle, startedAt, intervalMs, executiveMemoryService);
    } catch (error) {
      console.error(chalk.red(`[cycle ${cycle}] failed:`), error instanceof Error ? error.message : error);
    } finally {
      cycleInProgress = false;
    }
  };

  await tick();

  if (once) {
    console.log(chalk.dim("Single cycle complete — exiting (--once)."));
    executiveMemoryAdapter.close();
    return;
  }

  const timer = setInterval(() => {
    void tick();
  }, intervalMs);

  const applyBridge = startApplyBridge(executiveMemoryService);
  const executiveMemoryServer = await startExecutiveMemoryHttpTransport(executiveMemoryService);

  const shutdown = (): void => {
    console.log("");
    console.log(chalk.dim("Atlas Runtime stopping…"));
    clearInterval(timer);
    applyBridge.close();
    executiveMemoryServer.close();
    executiveMemoryAdapter.close();
    // Runtime Lifecycle Management (tooling, buiten sprintteling) · Additive only: removes
    // .atlas/runtime.pid if and only if it still names this exact process. Never touches a
    // PID file belonging to another process — see scripts/atlas/runtimeLifecycle.ts, which
    // owns writing this file when the runtime is started via `npm run atlas:runtime:start`.
    // A no-op when nothing wrote a matching PID file (e.g. the raw `--no-watch` command).
    removePidFileIfMatches(process.pid);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log(chalk.dim("Runtime is live. Press Ctrl+C to stop."));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
