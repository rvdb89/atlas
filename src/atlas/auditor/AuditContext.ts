import type { AuditContext, AuditContextInput } from "./audit.types";

export const CURRENT_ARCHITECTURE_BRIEF: AuditContextInput["brief"] = {
  sprintId: "brain-sprint-3.6",
  sprintTitle: "Atlas Auditor Hardening",
  phase: "PHASE 2 — ATLAS BRAIN",
  goals: [
    "Upgrade Atlas Auditor to Audit Report 2.0",
    "Add detailed warnings, blockers, and quality scoring",
    "Enable strict self-review mode for sprint validation",
  ],
  definitionOfDone: [
    "Audit report shows detailed warnings",
    "Audit report shows quality scores",
    "Audit report recommendation is correct",
    "Strict mode exists",
    "Security checks are extended",
    "Architecture checks are extended",
    "North Star check is present",
    "reports/sprints/index.md is updated",
    "Command Center Auditor card is improved",
    "npm run atlas:audit works",
    "npm run atlas:audit -- --strict works",
    "No existing functionality breaks",
  ],
  architectureRules: [
    "Atlas core remains domain-independent",
    "Brain modules remain provider-independent",
    "AI providers stay behind abstraction layer",
    "Studio uses registries where possible",
    "Workflows remain extensible",
    "No hardcoded Doughbert logic in generic modules",
    "No Claude-specific logic outside provider layer",
    "Registry pattern for extensibility",
  ],
  northStarGoals: [
    "Atlas as AI Operating System",
    "Generic architecture over vertical coupling",
    "Autonomy through planning, memory, and context",
    "Less manual intervention per workflow",
    "Extensible agents and decision support",
  ],
};

export function createAuditContext(input: AuditContextInput): AuditContext {
  return {
    ...input,
    collectedAt: input.collectedAt ?? new Date().toISOString(),
    scannedFiles: input.scannedFiles ?? [],
    strict: input.strict ?? false,
  };
}

export function createMockAuditContext(overrides?: Partial<AuditContextInput>): AuditContext {
  return createAuditContext({
    atlasVersion: "0.14.6",
    atlasBuild: "brain-sprint-3.6",
    git: {
      available: true,
      clean: false,
      branch: "main",
      changedFiles: ["src/atlas/auditor/AuditReport.ts"],
      stagedFiles: [],
      hasEnvStaged: false,
      hasEnvChanged: false,
    },
    changedFiles: ["src/atlas/auditor/AuditReport.ts"],
    packageScripts: {
      "atlas:audit": "tsx scripts/atlas-audit.ts",
    },
    build: {
      typescriptOk: true,
      healthOk: true,
    },
    healthChecks: [{ label: "Atlas health", ok: true, detail: "passed" }],
    brief: CURRENT_ARCHITECTURE_BRIEF,
    ...overrides,
  });
}
