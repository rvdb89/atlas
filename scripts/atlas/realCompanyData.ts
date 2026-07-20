import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import type { EvolutionRecommendation } from "@/atlas/constitution";
import { getCapabilityState } from "@/atlas/constitution";

import { ROOT_DIR } from "./shared";
import type { MissionPackageSummary } from "./missionPackage";
import { RATIFIED_DEPARTMENT_IDS, type RatifiedDepartmentId } from "@/atlas/team/department.types";

/**
 * Real, computed replacements for the remaining mock sections of the Atlas Control
 * dashboard (Roadmap, Departments, Bugs, CEO Inbox, Businesses/Apps). Every value here
 * is derived from something Atlas actually did or measured — the Decision Engine's own
 * evolution recommendations, real agent health, the real Atlas Auditor report, and real
 * git history. Nothing here is hand-typed fiction.
 */

// ---------------------------------------------------------------------------
// Roadmap — from the Decision Engine's own evolution recommendations
// ---------------------------------------------------------------------------

export type RuntimeRoadmapItem = {
  id: string;
  title: string;
  lane: "now" | "next" | "later" | "blocked";
  priority: number;
  businessValue: string;
  northStarContribution: string;
  owner: string;
  progress: number;
};

function ownerForSystem(systemId: string): string {
  switch (systemId) {
    case "brain":
      return "Atlas Brain";
    case "engineering":
      return "Atlas Engineering";
    case "studio":
      return "Atlas Studio";
    case "auditor":
      return "Atlas Auditor";
    default:
      return "Atlas";
  }
}

export function buildRealRoadmap(
  recommendations: EvolutionRecommendation[],
  chosenMissionId: string | null,
): RuntimeRoadmapItem[] {
  return recommendations.map((rec, index) => {
    const capability = getCapabilityState(rec.capabilityId);
    const progress = capability ? Math.round(capability.maturity * 100) : 0;
    const lane: RuntimeRoadmapItem["lane"] = rec.missionId === chosenMissionId ? "now" : index < 3 ? "next" : "later";

    return {
      id: rec.missionId,
      title: rec.title,
      lane,
      priority: index + 1,
      businessValue: rec.why,
      northStarContribution: rec.roadmapRationale ?? rec.why,
      owner: ownerForSystem(rec.systemId),
      progress,
    };
  });
}

// ---------------------------------------------------------------------------
// Departments — from real agent health, audit score, memory health, roadmap
// ---------------------------------------------------------------------------

export type RuntimeDepartmentAgent = {
  /** Sprint 2.2a · ratified department id, or null for agents with no team identity (e.g.
   * branch-director) — those agents are excluded from department aggregation entirely, never
   * forced into one. */
  department: RatifiedDepartmentId | null;
  name: string;
  health: number;
  currentInitiative: string;
};

export type RuntimeDepartment = {
  id: RatifiedDepartmentId;
  health: number;
  /** Sprint 2.2a · "no-signal" is a distinct, honest state — not a health-derived status. It
   * means no operational agent currently resolves to this department, so there is nothing
   * real to compute a status from. It must never be produced by `statusFromHealth()`, and
   * `health` on a no-signal entry is a placeholder (0), not a real score. */
  status: "healthy" | "active" | "attention" | "idle" | "no-signal";
  currentWork: string;
  owner: string;
};

function statusFromHealth(health: number): Exclude<RuntimeDepartment["status"], "no-signal"> {
  if (health >= 90) return "healthy";
  if (health >= 70) return "active";
  if (health >= 50) return "attention";
  return "idle";
}

/**
 * Sprint 2.2a — Department Source-of-Truth Alignment.
 *
 * Aggregates real operational agents into exactly the four ratified departments
 * (`@/atlas/team/department.types`'s `RATIFIED_DEPARTMENT_IDS`) — always all four, always
 * present, regardless of how many agents currently resolve to each one. A department with no
 * resolved agents is reported honestly as `"no-signal"`, never given a fabricated health score
 * or status just to fill the Department Wall.
 *
 * The four previous hardcoded pseudo-department entries this function used to append
 * (id "engineering" from the audit score, "memory" from memory health, "product" from roadmap
 * progress, "intelligence" from decision confidence) are removed here — none of the four
 * corresponded to a ratified department or a real team's operational agents, and keeping them
 * would have meant inventing department health from signals that were never about a
 * department's own agents. Those underlying signals are not lost: audit score, memory health,
 * roadmap, and decision confidence are still written to the runtime snapshot independently
 * (`writeSnapshot()`'s own `audit`/`memory`/`roadmap`/`latest` fields in atlas-runtime.ts) and
 * reach the dashboard through their own sections, not through the department list.
 */
export function buildRealDepartments(input: { agents: RuntimeDepartmentAgent[] }): RuntimeDepartment[] {
  const byDept = new Map<RatifiedDepartmentId, RuntimeDepartmentAgent[]>();
  for (const agent of input.agents) {
    if (agent.department === null) continue; // no team identity — not a department member
    const list = byDept.get(agent.department) ?? [];
    list.push(agent);
    byDept.set(agent.department, list);
  }

  return RATIFIED_DEPARTMENT_IDS.map((id) => {
    const members = byDept.get(id);
    if (!members || members.length === 0) {
      return {
        id,
        health: 0,
        status: "no-signal",
        currentWork: "No operational agents assigned yet",
        owner: "—",
      };
    }

    const health = Math.round(members.reduce((sum, member) => sum + member.health, 0) / members.length);
    return {
      id,
      health,
      status: statusFromHealth(health),
      currentWork: members[0]?.currentInitiative ?? "Idle",
      owner: members.map((member) => member.name).join(", "),
    };
  });
}

// ---------------------------------------------------------------------------
// Bugs — parsed from the real Atlas Auditor markdown report
// ---------------------------------------------------------------------------

export type RuntimeBug = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  impact: string;
  owner: string;
  recommendation: string;
  expectedFix: string;
  status: "open" | "watching" | "resolved";
  file: string;
};

function extractField(block: string, label: string): string {
  const pattern = new RegExp(`\\*\\*${label}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*|\\n###|\\n##|$)`);
  const match = block.match(pattern);
  return match ? match[1].trim() : "";
}

export function parseAuditWarnings(reportPath: string | undefined): RuntimeBug[] {
  if (!reportPath) return [];
  const fullPath = join(ROOT_DIR, reportPath);
  if (!existsSync(fullPath)) return [];

  try {
    const content = readFileSync(fullPath, "utf8");
    const blocks = content.split(/(?=^### WARNING )/m).filter((block) => block.startsWith("### WARNING"));

    return blocks.map((block, index) => {
      const idMatch = block.match(/^### WARNING ([\w-]+)/);
      const title = extractField(block, "Title") || "Untitled warning";
      const severityRaw = extractField(block, "Severity").toLowerCase();
      const severity: RuntimeBug["severity"] =
        severityRaw === "critical" || severityRaw === "high" || severityRaw === "medium" || severityRaw === "low"
          ? (severityRaw as RuntimeBug["severity"])
          : "low";
      const file = extractField(block, "File");
      const reason = extractField(block, "Reason");
      const suggestedFix = extractField(block, "Suggested fix");

      return {
        id: `audit-${idMatch?.[1] ?? index}`,
        title,
        severity,
        impact: file ? `${reason} (${file})` : reason,
        owner: "Atlas Auditor",
        recommendation: suggestedFix || "See audit report for details.",
        expectedFix: "Tracked as follow-up mission",
        status: "open",
        file,
      };
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// CEO Inbox — real triggers only (new packages, audit warnings, AI overrides)
// ---------------------------------------------------------------------------

export type RuntimeApproval = {
  id: string;
  title: string;
  category: "sprint_approval" | "architecture" | "roadmap_decision" | "memory_upgrade";
  urgency: "low" | "medium" | "high" | "urgent";
  reason: string;
  recommendation: string;
  status: "pending";
};

export type ExecutionProposalState = "none" | "pending-review" | "applied";

export function buildCandidateApprovals(input: {
  activePackage: MissionPackageSummary | null;
  executionProposalState: ExecutionProposalState | null;
  bugs: RuntimeBug[];
  aiDisagreed: boolean;
  chosenMissionId: string | null;
  chosenTitle: string | null;
  reasoning: string;
  /** BRAIN-011 · Fix proposals Atlas drafted on its own after a post-apply validation
   * failure. Always surfaced here regardless of activePackage — the CEO-instruction slot
   * and the Decision Engine's ranking only ever track ONE "current" mission at a time, so a
   * fix proposal that isn't currently winning that slot would otherwise stay invisible. */
  pendingFixMissions: Array<{ missionId: string; title: string; packageDir: string }>;
}): RuntimeApproval[] {
  const approvals: RuntimeApproval[] = [];

  for (const fix of input.pendingFixMissions) {
    approvals.push({
      id: `fix-${fix.missionId}`,
      title: `Fix-voorstel klaar · ${fix.missionId} ${fix.title}`,
      category: "sprint_approval",
      urgency: "urgent",
      reason: "Een eerdere Apply faalde de post-apply validatie (typecheck of tests) — Atlas heeft automatisch een gericht fix-voorstel opgesteld.",
      recommendation: `Open ${fix.packageDir}/proposed-changes/CHANGES.md, controleer, en klik Approve om toe te passen.`,
      status: "pending",
    });
  }

  if (input.activePackage) {
    const proposalReady = input.executionProposalState === "pending-review";
    const isNewPackage = !input.activePackage.alreadyExisted;

    if (proposalReady) {
      // EXEC-001 · The Execution Engine already drafted real code for this mission — the
      // CEO can go straight from "notification" to "Approve" without ever touching a CLI.
      approvals.push({
        id: `pkg-${input.activePackage.missionId}`,
        title: `Review code proposal · ${input.activePackage.missionId} ${input.activePackage.title}`,
        category: "sprint_approval",
        urgency: "high",
        reason: `Atlas drafted a real code proposal for ${input.activePackage.missionId} — ready to review.`,
        recommendation: `Open ${input.activePackage.packageDir}/proposed-changes/CHANGES.md, then click Approve to apply it to the real codebase.`,
        status: "pending",
      });
    } else if (isNewPackage) {
      approvals.push({
        id: `pkg-${input.activePackage.missionId}`,
        title: `Review engineering package · ${input.activePackage.missionId} ${input.activePackage.title}`,
        category: "sprint_approval",
        urgency: "high",
        reason: `Atlas generated a new engineering package for ${input.activePackage.missionId}.`,
        recommendation: `Review ${input.activePackage.claudePackagePath} — Atlas is drafting a code proposal next.`,
        status: "pending",
      });
    }
  }

  const highSeverity = input.bugs.filter((bug) => bug.severity === "high" || bug.severity === "critical");
  if (highSeverity.length > 0) {
    approvals.push({
      id: "audit-warnings",
      title: `${highSeverity.length} audit warning(s) need follow-up`,
      category: "architecture",
      urgency: "medium",
      reason: "The latest Atlas Auditor run flagged issues that aren't blocking release but need a decision.",
      recommendation: "Review Bugs & Blockers and schedule follow-up fixes.",
      status: "pending",
    });
  }

  if (input.aiDisagreed && input.chosenMissionId) {
    approvals.push({
      id: `override-${input.chosenMissionId}`,
      title: `Claude overruled the rule-based pick — now recommending ${input.chosenMissionId}`,
      category: "roadmap_decision",
      urgency: "medium",
      reason: input.reasoning,
      recommendation: `Confirm or override Atlas' choice of ${input.chosenMissionId}${input.chosenTitle ? ` — ${input.chosenTitle}` : ""}.`,
      status: "pending",
    });
  }

  return approvals;
}

// ---------------------------------------------------------------------------
// Applied History — every mission that has actually been approved and applied,
// read straight from disk (engineering/packages/<ID>/applied-<timestamp>/), so a human
// can look back at what Atlas has really done over time. Read-only: this never mutates
// anything, it only reports what the Apply Engine already wrote.
// ---------------------------------------------------------------------------

export type RuntimeAppliedFile = {
  path: string;
  action: "create" | "modify";
  reason: string;
};

/** EXEC-002 · What postApplyValidation.ts found right after this mission was applied —
 * null when the archived folder predates EXEC-002 or the validation step itself failed to
 * write its result (best-effort, see postApplyValidation.ts). */
export type RuntimeAppliedValidation = {
  typecheckOk: boolean;
  typecheckSummary: string;
  /** EXEC-003 · real node:test suite result (tsx --test), absent for pre-EXEC-003 entries. */
  testsOk?: boolean;
  testSummary?: string;
  suggestedCommitMessage: string;
  staged: boolean;
  stageNote: string;
};

export type RuntimeAppliedMission = {
  missionId: string;
  title: string;
  appliedAt: string;
  summary: string;
  files: RuntimeAppliedFile[];
  fileCount: number;
  risks: string[];
  followUp: string;
  validation: RuntimeAppliedValidation | null;
};

type RawProposalManifest = {
  missionId?: unknown;
  title?: unknown;
  generatedAt?: unknown;
  summary?: unknown;
  files?: unknown;
  risks?: unknown;
  followUp?: unknown;
};

/** Best-effort read of postApplyValidation.ts's output next to the manifest — missing or
 * unreadable (e.g. an applied-* folder from before EXEC-002 existed) just means "no
 * validation info", never an error for the whole applied-history read. */
function readAppliedValidation(validationPath: string): RuntimeAppliedValidation | null {
  if (!existsSync(validationPath)) return null;
  try {
    const raw = JSON.parse(readFileSync(validationPath, "utf8")) as Record<string, unknown>;
    return {
      typecheckOk: raw.typecheckOk === true,
      typecheckSummary: typeof raw.typecheckSummary === "string" ? raw.typecheckSummary : "",
      testsOk: typeof raw.testsOk === "boolean" ? raw.testsOk : undefined,
      testSummary: typeof raw.testSummary === "string" ? raw.testSummary : undefined,
      suggestedCommitMessage: typeof raw.suggestedCommitMessage === "string" ? raw.suggestedCommitMessage : "",
      staged: raw.staged === true,
      stageNote: typeof raw.stageNote === "string" ? raw.stageNote : "",
    };
  } catch {
    return null;
  }
}

function readAppliedManifest(manifestPath: string, validation: RuntimeAppliedValidation | null): RuntimeAppliedMission | null {
  try {
    const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as RawProposalManifest;
    const missionId = typeof raw.missionId === "string" ? raw.missionId : null;
    if (!missionId) return null;

    const files = Array.isArray(raw.files)
      ? raw.files
          .map((item): RuntimeAppliedFile | null => {
            if (!item || typeof item !== "object") return null;
            const entry = item as Record<string, unknown>;
            const path = typeof entry.path === "string" ? entry.path : "";
            if (!path) return null;
            return {
              path,
              action: entry.action === "modify" ? "modify" : "create",
              reason: typeof entry.reason === "string" ? entry.reason : "",
            };
          })
          .filter((item): item is RuntimeAppliedFile => item !== null)
      : [];

    return {
      missionId,
      title: typeof raw.title === "string" && raw.title ? raw.title : missionId,
      appliedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : new Date(0).toISOString(),
      summary: typeof raw.summary === "string" ? raw.summary : "",
      files,
      fileCount: files.length,
      risks: Array.isArray(raw.risks) ? raw.risks.filter((item): item is string => typeof item === "string") : [],
      followUp: typeof raw.followUp === "string" ? raw.followUp : "",
      validation,
    };
  } catch {
    return null;
  }
}

/** Scans every engineering/packages/<ID>/applied-<timestamp>/ folder on disk for its
 * proposal-manifest.json, newest first. Best-effort: a missing or unreadable manifest is
 * silently skipped rather than blocking the whole history — one broken record should
 * never hide the rest of Atlas' track record. */
export function buildAppliedHistory(): RuntimeAppliedMission[] {
  const packagesDir = join(ROOT_DIR, "engineering", "packages");
  if (!existsSync(packagesDir)) return [];

  const missions: RuntimeAppliedMission[] = [];

  for (const missionDir of readdirSync(packagesDir)) {
    const missionPath = join(packagesDir, missionDir);
    if (!statSync(missionPath).isDirectory()) continue;

    for (const entry of readdirSync(missionPath)) {
      if (!entry.startsWith("applied-")) continue;

      const manifestPath = join(missionPath, entry, "proposal-manifest.json");
      if (!existsSync(manifestPath)) continue;

      const validation = readAppliedValidation(join(missionPath, entry, "validation-result.json"));
      const mission = readAppliedManifest(manifestPath, validation);
      if (mission) missions.push(mission);
    }
  }

  return missions.sort((left, right) => right.appliedAt.localeCompare(left.appliedAt));
}

// ---------------------------------------------------------------------------
// Businesses / Apps — from real git history, real audit warnings, real roadmap
// ---------------------------------------------------------------------------

export type RuntimeBusiness = {
  id: string;
  name: string;
  health: number;
  status: "healthy" | "active" | "attention" | "planning";
  currentFocus: string;
  roadmapProgress: number;
  openBugs: number;
  nextRecommendation: string;
  marketingStatus: string;
};

export type RuntimeApp = {
  id: string;
  name: string;
  businessId: string;
  status: "healthy" | "active" | "attention" | "planning";
  version: string;
  health: number;
  lastRelease: string;
  currentInitiative: string;
};

function getLastCommitDate(pathspecs: string[]): string | null {
  try {
    const output = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...pathspecs], {
      cwd: ROOT_DIR,
      encoding: "utf8",
    }).trim();
    return output || null;
  } catch {
    return null;
  }
}

function getAppVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf8")) as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function healthStatus(health: number): "healthy" | "active" | "attention" {
  if (health >= 80) return "healthy";
  if (health >= 60) return "active";
  return "attention";
}

export function buildRealBusinessesAndApps(input: {
  bugs: RuntimeBug[];
  roadmap: RuntimeRoadmapItem[];
  auditScore: number | null;
}): { businesses: RuntimeBusiness[]; apps: RuntimeApp[] } {
  const version = getAppVersion();
  const doughbertLastCommit = getLastCommitDate(["src/app", ":!src/app/studio"]);
  const atlasLastCommit = getLastCommitDate(["src/app/studio", "src/atlas"]);

  const doughbertBugs = input.bugs.filter(
    (bug) => bug.file.startsWith("src/app") && !bug.file.startsWith("src/app/studio"),
  ).length;
  const atlasBugs = input.bugs.filter(
    (bug) => bug.file.startsWith("src/atlas") || bug.file.startsWith("src/app/studio"),
  ).length;

  const doughbertHealth = Math.max(40, 100 - doughbertBugs * 10);
  const atlasHealth = input.auditScore ?? Math.max(40, 100 - atlasBugs * 10);

  const atlasRoadmapProgress =
    input.roadmap.length > 0
      ? Math.round(input.roadmap.reduce((sum, item) => sum + item.progress, 0) / input.roadmap.length)
      : 0;

  const businesses: RuntimeBusiness[] = [
    {
      id: "doughbert",
      name: "Doughbert",
      health: doughbertHealth,
      status: healthStatus(doughbertHealth),
      currentFocus: doughbertLastCommit
        ? `Last changed ${new Date(doughbertLastCommit).toLocaleDateString()}`
        : "No recent changes tracked",
      roadmapProgress: doughbertHealth,
      openBugs: doughbertBugs,
      nextRecommendation:
        doughbertBugs > 0 ? "Review open audit warnings in Doughbert app code." : "No open issues — stable.",
      marketingStatus: "No live marketing data connected yet",
    },
    {
      id: "atlas-control",
      name: "Atlas Control",
      health: atlasHealth,
      status: healthStatus(atlasHealth),
      currentFocus: atlasLastCommit
        ? `Last changed ${new Date(atlasLastCommit).toLocaleDateString()}`
        : "No recent changes tracked",
      roadmapProgress: atlasRoadmapProgress,
      openBugs: atlasBugs,
      nextRecommendation: atlasBugs > 0 ? "Review open audit warnings in Atlas code." : "No open issues — stable.",
      marketingStatus: "Internal platform — no external marketing",
    },
  ];

  const apps: RuntimeApp[] = [
    {
      id: "doughbert-app",
      name: "Doughbert App",
      businessId: "doughbert",
      status: healthStatus(doughbertHealth),
      version,
      health: doughbertHealth,
      lastRelease: doughbertLastCommit ?? "—",
      currentInitiative: doughbertBugs > 0 ? `${doughbertBugs} open audit warning(s)` : "Stable",
    },
    {
      id: "atlas-control-app",
      name: "Atlas Control",
      businessId: "atlas-control",
      status: healthStatus(atlasHealth),
      version,
      health: atlasHealth,
      lastRelease: atlasLastCommit ?? "—",
      currentInitiative: atlasBugs > 0 ? `${atlasBugs} open audit warning(s)` : "Stable",
    },
  ];

  return { businesses, apps };
}
